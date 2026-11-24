import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, Timer } from 'claude-code'
import type { PanelData, PanelSetting, PanelUi } from '../types'
import { panelTree, showSetting } from './panel'
import type { PanelActions } from './panel'
import { getLang, pickLang, setLang, t } from './i18n'
import type { Lang } from './i18n'
import { addRejected, distillPrompt, guardAnswers, guardPromotions, latestProgress, looksSecret, prepareDistillActions, reconcileDistillActions } from './distill'
import type { Action, Rejected } from './distill'
import { progressForPrompt, progressKey, progressOffer, withOffered } from './progress'
import type { Progress, ProgressFields } from './progress'
import { GUARD_ASK_ITEMS, GUARD_MIN_COUNT, applyGuardChange, findGuardHit, guardAskText, guardCandidatesOf, guardChangeOf, guardHitKey, guardListText, guardPrompt, guardSummaryText, parseGuards, withHits, withProposals } from './guards'
import type { Guard, GuardMode } from './guards'
import { PROJECT_DECLINED, PROJECT_IN, contextText, localStamp, memHead, noteBlock, parseNotes, renderNotes, tag } from './notes'
import type { Notes, Rule } from './notes'
import { encodeProject, isAbs, resolveDots, slash } from './paths'
import { anchorOf } from './transcript'
import { hasNewDistillTurns, selectDistillBatch } from './distill-batch'
import type { DistillSnapshot as DistillSnap, DistillCheckpoint, DistillEndpoint } from './distill-batch'
import type { Row } from './transcript'
import { DISTILL_EFFORT, DISTILL_MAX_TOKENS, DISTILL_TIMEOUT_MS, GUARD_MAX_TOKENS, HANDOFF_TIMEOUT_MS, KEEP, DEFER_CAP_EXTRA, DEFER_CAP_RATIO, RELOAD_GRACE_MS, RETRY_MS, RETRY_TURNS, STOPPED, cfg, optionsOf, resetConfig, resolveConfig, settingSource, settingValue, specOf, stepSetting, thresholdOf } from './config'
import { resetRuntime, rt } from './runtime'
import { doneCheck, freshWork, noteCall, trackFailure } from './loops'
import { clearNext, noteStep, peekNext, resolveReplyLang, stopRewrite, takePending } from './lang'
import { addBackgroundUsage, addStat, awayKey, describeUsage, pendingKey, pruneSeen, statsKey } from './records'
import type { Away, DistillError, DistillLast, HandoffError, Kind, PendingSubmit, Saved, Stats, Usage } from './records'
import { HANDOFF_PROMPT, forkFailure, heldBlock, sourceFreshness } from './handoff'
import type { HandoffSource } from './handoff'
import { buryMissing, memTitles, tombKey } from './tombstones'
import type { Tombstones } from './tombstones'
import { guardsFoundInRepo, markAsked, promoteCandidates, promoteItems, promoteText, releaseAsked } from './promote'
import type { PromoteAsk } from './promote'
import { backupPath, keepMemory, panelSnapshot, withoutNote } from './panel-data'
import { distillStatusText, statusText, usageText } from './status'

//  plugin ： store  settings ， settings.json  pluginConfigs["ctx-handoff@<marketplace>"].options
async function readSettings($: EngineInterface) {
  let options: Record<string, unknown> = {}
  try {
    options = optionsOf((await $.settings.read()).pluginConfigs as Record<string, { options?: Record<string, unknown> }> | undefined)
  } catch {}
  const panel = ((await $.store.get('settings')) as Record<string, unknown> | undefined) ?? {}
  return { options, panel }
}

async function loadConfig($: EngineInterface) {
  const { options, panel } = await readSettings($)
  Object.assign(cfg, resolveConfig(options, panel))
}

// （、）： session ；、、
async function reloadConfig($: EngineInterface) {
  const before = { ...cfg }
  await loadConfig($)
  if (cfg.replyLanguage !== before.replyLanguage) rt.replyTarget = undefined
  if (cfg.language !== before.language) {
    rt.langReady = undefined
    await initLang($)
  }
  if (cfg.idleMs !== before.idleMs && rt.idle !== undefined) await schedule($)
  if (cfg.minTokens !== before.minTokens || cfg.distillEvery !== before.distillEvery) await showDistillStatus($)
}

async function isRefreshOn($: EngineInterface) {
  return (await $.store.get('refresh')) !== false
}

//  ms： fallback（ promise ，）
async function within<T, F>($: EngineInterface, p: Promise<T>, ms: number, fallback: F): Promise<T | F> {
  let timer: Timer | undefined
  const late = new Promise<F>(resolve => { timer = $.clock.after(ms, () => resolve(fallback)) })
  try {
    return await Promise.race([p, late])
  } finally {
    timer?.cancel()
  }
}

type ForkResult = Awaited<ReturnType<EngineInterface['model']['fork']>>
type ForkOutcome = ForkResult | { isAnswered: false; reason: 'timeout' }
async function forkWithin($: EngineInterface, prompt: string, ms: number, sid: string): Promise<ForkOutcome> {
  const started = await $.clock.now()
  try {
    const r = await within($, $.model.fork({ prompt }), ms, { isAnswered: false as const, reason: 'timeout' as const })
    await recordUsage($, sid, started, 'usage' in r ? r.usage : undefined)
    return r
  } catch (err) { await recordUsage($, sid, started); throw err }
}

type ModelUsage = { input_tokens: number; output_tokens: number; cache_read_input_tokens: number; cache_creation_input_tokens: number }
async function recordUsage($: EngineInterface, sid: string, started: number, usage?: ModelUsage) {
  try {
  const now = await $.clock.now()
  const project = await projectKey($)
  const run = rt.statQueue.then(async () => {
    try {
      const key = `stats:session:${sid}`
      const prev = (await $.store.get(key)) as Stats | undefined
      const value = usage ? { input: usage.input_tokens, output: usage.output_tokens, cacheRead: usage.cache_read_input_tokens, cacheCreation: usage.cache_creation_input_tokens, ms: now - started } : undefined
      await $.store.set(key, addBackgroundUsage(prev, now, project, value))
    } catch { /* \u53ea\u662f\u8a18\u5e33 */ }
  })
  rt.statQueue = run
  await run
  } catch { /* \u53ea\u662f\u8a18\u5e33 */ }
}

async function completeBackground($: EngineInterface, request: Parameters<EngineInterface['model']['complete']>[0], sid: string) {
  const started = await $.clock.now()
  try {
    const r = await $.model.complete(request)
    await recordUsage($, sid, started, 'usage' in r ? r.usage : undefined)
    return r
  } catch (err) { await recordUsage($, sid, started); throw err }
}

// ：（<claude>/projects/<>/memory/ctx-handoff.md）
async function projectKey($: EngineInterface) {
  return encodeProject(await workspace($)) || 'unknown'
}

//  session ，；
async function touchSeen($: EngineInterface, key: string) {
  if (rt.seenKnown.has(key)) return
  rt.seenKnown.add(key)
  const seen = ((await $.store.get('seen')) as Record<string, number> | undefined) ?? {}
  if (seen[key] === undefined) await $.store.set('seen', { ...seen, [key]: await $.clock.now() })
}

// （）：；
//  process ：（）
async function stat($: EngineInterface, what: string, n = 1, event?: { failure?: string; hit?: string }) {
  const run = rt.statQueue.then(() => writeStat($, what, n, event))
  rt.statQueue = run
  await run
}

async function writeStat($: EngineInterface, what: string, n: number, event?: { failure?: string; hit?: string }) {
  try {
    const clean = (s: string | undefined) => (s !== undefined && looksSecret(s) ? t().reject.secret : s)
    const key = statsKey(await projectKey($))
    const prev = (await $.store.get(key)) as Stats | undefined
    await $.store.set(key, addStat(prev, await $.clock.now(), what, n, { failure: clean(event?.failure), hit: clean(event?.hit) }))
  } catch { /* \u53ea\u662f\u8a18\u5e33 */ }
}

//  store  /handoff ；
async function recordFailure($: EngineInterface, kind: Kind, tokens: number | null, reason: string, sid?: string) {
  const at = await $.clock.now()
  const turns = await $.session.turns()
  const err: HandoffError = { at, sessionId: sid ?? await $.session.id(), kind, reason, tokens, turns }
  await $.store.set(`handoff:error:${await projectKey($)}`, err)
  await stat($, `handoff.${kind}.fail`, 1, { failure: reason })
  if (kind === 'present' || kind === 'manual') rt.retryAfter = { turns, at }
}

async function makeHandoff($: EngineInterface, kind: Kind, tokens: number | null, source?: HandoffSource) {
  const sid = source?.sid ?? await $.session.id()
  const started = await $.clock.now()
  const task = { sid, phase: 'generating', at: started } satisfies NonNullable<typeof rt.handoffTask>
  rt.handoffTask = task
  await refreshPanel($)
  try {
  const r = await forkWithin($, HANDOFF_PROMPT, HANDOFF_TIMEOUT_MS, sid)
  if (source && !(await sourceIsFresh($, source))) {
    $.ui.log(t().idle.outdated)
    await stat($, 'away.stale')
    return undefined
  }
  if (!r.isAnswered) {
    $.ui.log(t().handoff.failedLog(forkFailure(r.reason)))
    $.ui.toast(t().handoff.failedToast)
    await recordFailure($, kind, tokens, t().handoff.failGenerate(forkFailure(r.reason)))
    return undefined
  }
  const at = await $.clock.now()
  const usage: Usage = {
    input: r.usage.input_tokens,
    cacheRead: r.usage.cache_read_input_tokens,
    cacheCreation: r.usage.cache_creation_input_tokens,
    output: r.usage.output_tokens,
    ms: at - started,
  }
  const saved: Saved = { at, sessionId: sid, kind, tokens, text: r.text, usage }
  const handoffsKey = `handoffs:${await projectKey($)}`
  const list = ((await $.store.get(handoffsKey)) as Saved[] | undefined) ?? []
  if (source && !(await sourceIsFresh($, source))) return undefined
  await $.store.set(handoffsKey, [...list, saved].slice(-KEEP))
  if (source && !(await sourceIsFresh($, source))) return undefined
  rt.lastHandoff = { text: r.text }
  $.ui.log(t().handoff.savedLog(kind, describeUsage(usage)))
  return r.text
  } finally { if (rt.handoffTask === task) rt.handoffTask = undefined; await refreshPanel($) }
}

// $.prompt.submit  hook  { drop }、：，
async function submitText($: EngineInterface, text: string) {
  const r = await $.prompt.submit({ text })
  if (r.drop !== undefined) throw new Error(t().handoff.dropped(r.drop))
}

// /clear → 。 pendingSubmit:< session id>，；
// （clear ＝，pending ；submit ＝pending  /handoff resend）
async function clearAndSubmit($: EngineInterface, text: string) {
  const sid = await $.session.id()
  const task = { sid, phase: 'submitting', at: await $.clock.now() } satisfies NonNullable<typeof rt.handoffTask>
  rt.handoffTask = task
  await refreshPanel($)
  try {
  const key = pendingKey(sid)
  await $.store.set(key, { text, project: await projectKey($) } satisfies PendingSubmit)
  await touchSeen($, key)
  rt.myPending = { sid }
  rt.pendingToasted = false
  // （ handoff）：，/clear 
  await markHanded($, sid, true)
  try {
    await $.command.run({ command: 'clear' })
  } catch (err) {
    await $.store.delete(key)
    rt.myPending = undefined
    await markHanded($, sid, false)
    return { stage: 'clear', reason: String(err) }
  }
  try {
    await submitText($, text)
  } catch (err) {
    return { stage: 'submit', reason: String(err) }
  }
  await $.store.delete(key)
  rt.myPending = undefined
  return undefined
  } finally { if (rt.handoffTask === task) rt.handoffTask = undefined; await refreshPanel($) }
}

// ---------- ： ----------

async function homeDir($: EngineInterface) {
  return slash((await $.env.get('USERPROFILE')) ?? (await $.env.get('HOME')) ?? '')
}

async function claudeDir($: EngineInterface) {
  const custom = await $.env.get('CLAUDE_CONFIG_DIR')
  if (custom) return slash(custom)
  return `${await homeDir($)}/.claude`
}

// ：（ ~/.claude/CLAUDE.md）
async function isHomeWorkspace($: EngineInterface) {
  const home = await homeDir($)
  return home !== '' && (await workspace($)).toLowerCase() === home.toLowerCase()
}

async function readText($: EngineInterface, path: string) {
  try { return await $.fs.read(path) } catch { return '' }
}

async function readNotes($: EngineInterface, path: string) {
  try { return await $.fs.read(path) } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    if (/(?:^|\$\.fs\.read: )ENOENT(?:$|:|,)/.test(message) || /\$\.fs\.read\([\s\S]*\) failed: ENOENT$/.test(message)) return ''
    throw err
  }
}

// ：session ； git worktree （.git ：gitdir: <>/.git/worktrees/<>）。
//  $.session.repo()：， Bash  cd ； root  .git
async function workspace($: EngineInterface) {
  const root = slash(await $.session.root())
  if (rt.workspaceCache?.root === root) return rt.workspaceCache.dir
  const m = /^gitdir:\s*(.+?)\/\.git\/worktrees\/[^/]+\s*$/m.exec(slash(await readText($, `${root}/.git`)))
  const main = m?.[1] ? slash(m[1]) : undefined
  const dir = !main ? root : isAbs(main) ? main : resolveDots(`${root}/${main}`)
  rt.workspaceCache = { root, dir }
  return dir
}

// ：<claude>/projects/<>/memory/ctx-handoff.md；。
//  MEMORY.md： auto memory ， auto memory 、
async function notesFile($: EngineInterface) {
  return `${await claudeDir($)}/projects/${encodeProject(await workspace($))}/memory/ctx-handoff.md`
}

// ： CLAUDE.md。，
// （2026-10-09 ：， CLAUDE.md ）
async function guidesText($: EngineInterface) {
  const parts: string[] = []
  for (const [label, path] of [['\u5de5\u4f5c\u5340', `${await workspace($)}/CLAUDE.md`], ['\u4f7f\u7528\u8005', `${await claudeDir($)}/CLAUDE.md`]] as const) {
    const text = (await readText($, path)).trim()
    if (text) parts.push(`--- ${label}：${path} ---\n${text}`)
  }
  return parts.join('\n\n')
}

async function isDistillOn($: EngineInterface) {
  return (await $.store.get('distill')) !== false && !(await isHomeWorkspace($))
}

// ： /clear ，（/clear  session id ）
async function distillSnap($: EngineInterface): Promise<DistillSnap> {
  const sid = await $.session.id()
  return {
    sid,
    turns: await $.session.turns(),
    anchor: (await $.store.get(`last:${sid}`)) as string | undefined,
    rows: (await $.session.messages()) as readonly Row[],
  }
}

// ：（ /clear ），
// queue=false：， /clear，
// ；， snap （），（）
async function distill($: EngineInterface, why: string, queue = true, snap?: DistillSnap) {
  if (rt.distilling) {
    if (snap === undefined) return undefined
    $.ui.log(t().distill.waiting(why))
    while (rt.distilling) await rt.distillDone
  }
  const sid = snap?.sid ?? await $.session.id()
  const key = `distill:${sid}`
  const prev = (await $.store.get(key)) as DistillCheckpoint | undefined
  const retryKey = `distill:retry:${sid}`
  let retry = (await $.store.get(retryKey)) as DistillEndpoint | undefined
  if (retry && (prev?.turn ?? 0) >= retry.turn) {
    await $.store.delete(retryKey).catch(err => $.ui.log(t().distill.retryCleanup(String(err))))
    retry = undefined
  }
  const turns = retry?.turn ?? snap?.turns ?? await $.session.turns()
  if (!hasNewDistillTurns(turns, prev)) return undefined
  //  store 
  if (rt.distilling) return undefined
  rt.distilling = true
  let done = () => {}
  rt.distillDone = new Promise<void>(r => { done = r })
  rt.distillFailed = false
  await showDistillStatus($, why)
  const pk = await projectKey($)
  const fail = async (reason: string) => {
    rt.distillFailed = true
    $.ui.log(t().distill.failLog(why, reason))
    await $.store.set(`distill:error:${pk}`, { at: await $.clock.now(), why, reason })
    await stat($, 'distill.fail', 1, { failure: `${why}: ${reason}` })
  }
  try {
    // ；
    const anchor = retry ? retry.anchor : snap ? snap.anchor : (await $.store.get(`last:${sid}`)) as string | undefined
    const batch = selectDistillBatch({ sid, turns, anchor, rows: snap?.rows ?? (await $.session.messages()) as readonly Row[], previous: prev, retry })
    if (batch.kind === 'blocked') {
      await fail(t().distill.retryLost)
      return undefined
    }
    if (batch.kind === 'nothing-new') return undefined
    const { rows, transcript, userText, currentUserText, source } = batch
    const file = await notesFile($)
    const original = await readNotes($, file)
    const notes = parseNotes(original)
    // （、tools/notes.mjs、），
    const tk = tombKey(pk)
    const tombs = buryMissing((await $.store.get(tk)) as Tombstones | undefined, memTitles(notes), await $.clock.now())
    await $.store.set(tk, tombs)
    //  repo 、：
    const guards = await loadGuards($)
    const candidates = promoteCandidates(guards, notes)
    // ：
    const drafts = guards.filter(g => g.state === 'proposed').map(g => ({ id: `G${g.id}`, name: g.rule }))
    const started = await $.clock.now()
    rt.distillTask = { sid, why, at: started }
    await refreshPanel($)
    const r = await completeBackground($, {
      model: cfg.notesModel,
      effort: DISTILL_EFFORT,
      maxTokens: DISTILL_MAX_TOKENS,
      timeoutMs: DISTILL_TIMEOUT_MS,
      system: distillPrompt(transcript.found ? prev?.anchor : undefined, notes, localStamp(started).slice(0, 10), progressForPrompt(await loadProgress($), started), candidates, await guidesText($), drafts, tombs.dead.map(d => d.title)),
      prompt: `=== \u5c0d\u8a71\u7d00\u9304 ===\n${transcript.text || '（\u6c92\u6709\u65b0\u7684\u5c0d\u8a71\u5167\u5bb9）'}\n=== \u5c0d\u8a71\u7d00\u9304\u7d50\u675f ===\n\n\u4f9d\u7cfb\u7d71\u6307\u793a\u8f38\u51fa ACTIONS。`,
    }, sid)
    if (!r.isAnswered) {
      if (r.reason === 'aborted' && (why === t().distill.why.idle || why === t().distill.why.away)) return r
      const reason = r.reason === 'api-error' ? `api-error ${r.status ?? ''} ${r.error}`.replace(/\s+/g, ' ')
        : r.reason === 'aborted' ? t().distill.timeout(DISTILL_TIMEOUT_MS / 60_000) : r.reason
      await fail(reason)
      return r
    }
    const now = await $.clock.now()
    const stamp = localStamp(now)
    const prepared = prepareDistillActions({
      text: r.text, notes, userText, candidates: candidates.map(c => c.id), drafts: drafts.map(d => d.id),
      retry: retry !== undefined, guards: retry ? guards : [],
    })
    const checked = await checkPromotions($, prepared.actions, prepared.rejected)
    const result = reconcileDistillActions({ prepared, actions: checked, tombstones: tombs, currentUserText, notes, day: stamp.slice(0, 10), sid, source })
    const { rejected } = result
    if (result.kind === 'unusable') {
      const usage = describeUsage({ input: r.usage.input_tokens, cacheRead: r.usage.cache_read_input_tokens, cacheCreation: r.usage.cache_creation_input_tokens, output: r.usage.output_tokens, ms: now - started })
      await $.store.set(`distill:last:${pk}`, { at: now, why, changes: [], file, usage, rejected } satisfies DistillLast)
      await fail(t().distill.noUsableActions)
      return r
    }
    // ：，，
    if ((await readNotes($, file)) !== original) {
      const reason = t().distill.edited(file)
      $.ui.log(t().distill.skipLog(why, reason))
      await $.store.set(`distill:error:${pk}`, { at: now, why, reason })
      await stat($, 'distill.fail', 1, { failure: `${why}: ${reason}` })
      rt.distillFailed = true
      return r
    }
    const { actions, notes: updated, changes: noteChanges } = result
    if (!retry && result.hasEffects) {
      await $.store.set(retryKey, batch.endpoint)
    }
    if (noteChanges.length > 0) {
      await $.fs.write(file, renderNotes(updated, stamp))
      await $.store.set(tk, { ...tombs, known: memTitles(updated) })
    }
    const changes = [...noteChanges, ...await applyPromotions($, actions, candidates, sid, started), ...await applyGuardAnswers($, actions)]
    // （，）
    const progress = latestProgress(actions)
    if (progress) await saveProgress($, sid, progress, now)
    await touchSeen($, key)
    const usage = describeUsage({ input: r.usage.input_tokens, cacheRead: r.usage.cache_read_input_tokens, cacheCreation: r.usage.cache_creation_input_tokens, output: r.usage.output_tokens, ms: now - started })
    await $.store.set(`distill:last:${pk}`, { at: now, why, changes, file, usage, rejected } satisfies DistillLast)
    const { fromTurn: _fromTurn, ...checkpoint } = batch.endpoint
    await $.store.set(key, { ...checkpoint, at: now })
    await $.store.delete(retryKey).catch(err => $.ui.log(t().distill.retryCleanup(String(err))))
    await stat($, 'distill.ok')
    // ：， AI （）
    await autoDraftGuards($, updated, rows, sid).catch(err => $.ui.log(t().guard.autoFailed(String(err))))
    await refreshPanel($)
    $.ui.log(t().distill.doneLog(why, changes.length, rejected.count, file))
    // ；（ prompt.submit）
    if (changes.length > 0 && queue) {
      rt.pendingNotes.set(sid, { changes: [...(rt.pendingNotes.get(sid)?.changes ?? []), ...changes], file })
      $.ui.log(t().distill.queued(changes.length))
    }
    // ：（），、 token
    if (changes.length > 0) {
      $.ui.toast(t().distill.toast(changes.length, queue, file))
    }
    return r
  } catch (err) {
    await fail(t().distill.writeFailed(String(err)))
    return undefined
  } finally {
    rt.distilling = false
    rt.distillTask = undefined
    done()
    await refreshPanel($)
    await showDistillStatus($).catch(err => $.ui.log(t().distill.writeFailed(String(err))))
  }
}

// ：，「 N 」；handoff 
async function showDistillStatus($: EngineInterface, running?: string) {
  if (rt.deferral) return
  if (!(await isDistillOn($))) return $.ui.status(undefined)
  if (running) return $.ui.status(t().status.running)
  const left = cfg.distillEvery - (await sinceDistill($))
  if (left > 0) return $.ui.status(t().status.left(left))
  $.ui.status(((await $.session.usage()).context.tokens ?? 0) < cfg.minTokens ? t().status.short : t().status.next)
}

// 
async function sinceDistill($: EngineInterface) {
  const last = ((await $.store.get(`distill:${await $.session.id()}`)) as { turn: number } | undefined)?.turn ?? 0
  return Math.max(0, (await $.session.turns()) - last)
}

async function distillStatus($: EngineInterface, preloaded?: { pk: string; file: string; notes: Notes; err?: DistillError }) {
  const on = await isDistillOn($)
  const pk = preloaded?.pk ?? await projectKey($)
  const d = (await $.store.get(`distill:last:${pk}`)) as DistillLast | undefined
  const err = preloaded ? preloaded.err : (await $.store.get(`distill:error:${pk}`)) as DistillError | undefined
  const file = preloaded?.file ?? await notesFile($)
  const notes = preloaded?.notes ?? parseNotes(await readNotes($, file))
  const today = localStamp(await $.clock.now()).slice(0, 10)
  return distillStatusText({ on, d, err, file, notes, today, since: on ? await sinceDistill($) : 0 })
}

//  $.state：，session.start 
const idleState = atom({ plugin: 'ctx-handoff', key: 'idle' } as const, null)
const awayControl = atom({ plugin: 'ctx-handoff', key: 'awayControl' } as const, null)

async function awayPaused($: EngineInterface) {
  const saved = await read($, awayControl)
  return saved?.sid === await $.session.id() && saved.paused
}

async function sourceIsFresh($: EngineInterface, source: HandoffSource, withPaused = false) {
  if (rt.activity !== source.activity) return false
  const sid = await $.session.id()
  if (!sourceFreshness(source, { sid, activity: rt.activity })) return false
  if (!withPaused) return true
  const saved = await read($, awayControl)
  const currentSid = await $.session.id()
  return sourceFreshness(source, { sid: currentSid, activity: rt.activity, paused: saved?.sid === currentSid && saved.paused })
}

async function changeAway($: EngineInterface, paused: boolean) {
  const sid = await $.session.id()
  await update($, awayControl, () => ({ sid, paused }))
  if (paused) {
    rt.activity += 1
    rt.idle?.cancel()
    rt.idle = undefined
    await update($, idleState, () => null)
  } else await schedule($)
  await refreshPanel($)
  return t().cmd.awayChanged(paused)
}

async function schedule($: EngineInterface, delay = cfg.idleMs) {
  rt.idle?.cancel()
  if (await awayPaused($)) { rt.idle = undefined; await update($, idleState, () => null); return }
  rt.idle = $.clock.after(delay, () => void onIdle($))
  const due = (await $.clock.now()) + delay
  await update($, idleState, () => ({ due, refreshes: rt.refreshes }))
}

async function resumeSchedule($: EngineInterface) {
  const saved = await read($, idleState)
  if (!saved || rt.idle) return
  const left = saved.due - (await $.clock.now())
  if (left < -RELOAD_GRACE_MS) return
  rt.refreshes = saved.refreshes
  await schedule($, Math.max(0, left))
}

async function onIdle($: EngineInterface) {
  const activity = rt.activity
  const sid = await $.session.id()
  await initLang($)
  rt.idle = undefined
  await update($, idleState, () => null)
  if (rt.busy || await awayPaused($)) return
  const { context } = await $.session.usage()
  const tokens = context.tokens ?? 0
  if (tokens < cfg.minTokens) return

  if ((await isRefreshOn($)) && rt.refreshes < cfg.maxRefresh) {
    const task = { sid, phase: 'refresh', at: await $.clock.now() } satisfies NonNullable<typeof rt.handoffTask>
    rt.handoffTask = task
    await refreshPanel($)
    try {
    //  fork（ OK）；，
    const r = await forkWithin($, '\u53ea\u56de\u8986 OK', HANDOFF_TIMEOUT_MS, sid)
    if (!(await sourceIsFresh($, { sid, activity }, true))) return
    if (!r.isAnswered && r.reason === 'nothing-to-fork') {
      $.ui.log(t().idle.refreshSkipped)
      return
    }
    if (rt.refreshes === 0 && await isDistillOn($)) await distill($, t().distill.why.idle)
    if (!(await sourceIsFresh($, { sid, activity }, true))) return
    rt.refreshes += 1
    $.ui.log(r.isAnswered
      ? t().idle.refresh(rt.refreshes, cfg.maxRefresh, r.usage.cache_read_input_tokens, r.usage.cache_creation_input_tokens)
      : t().idle.refreshFailed(rt.refreshes, cfg.maxRefresh, r.reason))
    await schedule($)
    return
    } finally { if (rt.handoffTask === task) rt.handoffTask = undefined; await refreshPanel($) }
  }

  if (!cfg.awayHandoff) return
  rt.busy = true
  try {
    if (rt.refreshes === 0 && await isDistillOn($)) await distill($, t().distill.why.away)
    if (!(await sourceIsFresh($, { sid, activity }))) return
    const handoff = await makeHandoff($, 'away', tokens, { sid, activity })
    if (handoff === undefined) return
    if (!(await sourceIsFresh($, { sid, activity }))) {
      $.ui.log(t().idle.outdated)
      await stat($, 'away.stale')
      return
    }
    const key = awayKey(sid)
    await $.store.set(key, { handoff } satisfies Away)
    if (!(await sourceIsFresh($, { sid, activity }))) {
      await $.store.delete(key)
      return
    }
    await touchSeen($, key)
    $.ui.log(t().idle.awaySavedLog(tokens))
    await stat($, 'handoff.away.ok')
    $.ui.toast(t().idle.awaySavedToast)
  } finally {
    rt.busy = false
  }
}

// ：，
function beginPresent() {
  rt.busy = true
  rt.presenting = true
  rt.held = []
  rt.presentStartedAt = undefined
  rt.idle?.cancel()
  rt.idle = undefined
}

async function present($: EngineInterface, tokens: number | null, kind: 'present' | 'manual', note?: string) {
  rt.presentStartedAt = await $.clock.now()
  const sid = await $.session.id()
  // rt.held ：，
  let delivered = 0
  const drain = async (send: (batch: string, n: number) => Promise<void>) => {
    while (rt.held.length > delivered) {
      const n = rt.held.length - delivered
      const batch = rt.held.slice(delivered).join('\n\n')
      delivered = rt.held.length
      await send(batch, n)
    }
  }
  const resubmit = async (batch: string, n: number) => {
    try { await submitText($, batch) } catch (err) {
      $.ui.log(t().handoff.resubmitFailed(String(err)))
      await stat($, 'held.lost', n, { failure: String(err) })
    }
  }
  try {
    //  fork  /clear 。，/clear ，
    // ：（），
    const snap = isDistillOn($).then(on => on ? distillSnap($) : undefined).catch(() => undefined)
    void snap.then(s => s && distill($, t().distill.why.before, false, s)).catch(() => undefined)
    const handoff = await makeHandoff($, kind, tokens)
    if (handoff === undefined) { await drain(resubmit); return }
    await snap
    const why = kind === 'manual' ? t().handoff.whyManual : t().handoff.whyTokens(tokens ?? 0)
    const included = [...rt.held]
    delivered = included.length
    const intro = `${tag} ${included.length === 0 ? t().handoff.intro(why) : t().handoff.introHeld(why)}`
    const text = `${intro}${note ? t().handoff.note(note) : ''}\n\n${handoff}${included.length ? `\n\n${heldBlock(included)}` : ''}`
    const failed = await clearAndSubmit($, text)
    if (failed?.stage === 'clear') {
      $.ui.log(t().handoff.clearFailedLog(failed.reason))
      await recordFailure($, kind, tokens, t().handoff.reasonClear(failed.reason), sid)
      delivered = 0
      await drain(resubmit)
    } else if (failed) {
      $.ui.log(t().handoff.submitFailedLog(failed.reason))
      $.ui.toast(`${t().handoff.submitFailedToast}\n/handoff resend ${sid}`)
      await recordFailure($, kind, tokens, t().handoff.reasonSubmit(failed.reason), sid)
      // ： pendingSubmit，
      let pending = text
      await drain(async batch => {
        pending += included.length === 0 && pending === text ? `\n\n${heldBlock([batch])}` : `\n\n${batch}`
        await $.store.set(pendingKey(sid), { text: pending, project: await projectKey($) } satisfies PendingSubmit)
      })
    } else {
      rt.retryAfter = undefined
      rt.refreshes = 0
      await stat($, `handoff.${kind}.ok`)
      // ： handoff 
      await drain(resubmit)
    }
  } catch (err) {
    $.ui.log(t().handoff.failedAll(String(err)))
    try {
      await recordFailure($, kind, tokens, t().handoff.reasonException(String(err)), sid)
      delivered = 0
      await drain(resubmit)
    } catch (err2) {
      $.ui.log(t().handoff.failedCleanup(String(err2)))
    }
  } finally {
    const held = rt.held.length
    rt.presenting = false
    rt.held = []
    rt.busy = false
    if (held > 0) await stat($, 'held', held)
  }
}

// classic.Stop：。，
//  session， /clear；
async function onStop($: EngineInterface, e: { agent_id?: string; background_tasks?: { status: string }[]; session_crons?: { recurring: boolean }[] }) {
  if (e.agent_id !== undefined) return
  const tasks = (e.background_tasks ?? []).filter(t => !STOPPED.has(t.status)).length
  const crons = e.session_crons ?? []
  const oneShot = crons.filter(c => !c.recurring).length
  rt.snapshot = { tasks, oneShot, recurring: crons.length - oneShot }
  if (rt.busy) return
  // ：， Claude Code  compact
  if (!cfg.autoHandoff) {
    rt.deferral = undefined
    rt.deferToasted = false
    return
  }
  const { context } = await $.session.usage()
  const tokens = context.tokens
  const threshold = thresholdOf(context.window)
  if (tokens === undefined || tokens < threshold) {
    rt.deferral = undefined
    rt.deferToasted = false
    return
  }
  const agents = (await $.agent.list()).filter(a => a.status === 'running').length
  const parts = [tasks && t().stop.tasks(tasks), oneShot && t().stop.oneShot(oneShot), agents && t().stop.agents(agents)].filter(Boolean)
  const partsText = parts.join(t().list)
  let note: string | undefined
  if (parts.length > 0) {
    const cap = Math.min(Math.floor(context.window * DEFER_CAP_RATIO), threshold + DEFER_CAP_EXTRA)
    if (tokens < cap) {
      rt.deferral = t().stop.deferral(partsText, cap)
      $.ui.status(t().status.deferred(partsText))
      $.ui.log(t().stop.deferLog(tokens, partsText))
      if (!rt.deferToasted) { rt.deferToasted = true; $.ui.toast(t().status.deferred(partsText)) }
      return
    }
    note = t().stop.note(partsText, cap)
    $.ui.log(t().stop.capLog(tokens, cap, partsText))
  }
  // ：
  if (rt.retryAfter && (await $.session.turns()) - rt.retryAfter.turns < RETRY_TURNS && (await $.clock.now()) - rt.retryAfter.at < RETRY_MS) {
    $.ui.log(t().stop.retryLog(tokens))
    return
  }
  rt.deferral = undefined
  rt.deferToasted = false
  $.ui.status(undefined)
  beginPresent()
  $.clock.after(0, () => void present($, tokens, 'present', note))
}

// ：（）。 hook ， cfg、t() 
const initLang = ($: EngineInterface) =>
  (rt.langReady ??= loadConfig($).then(() => detectLang($)).then(setLang, () => setLang('en')))

async function detectLang($: EngineInterface): Promise<Lang> {
  if (cfg.language !== 'auto') return cfg.language
  let setting: unknown
  try { setting = (await $.settings.read()).language } catch {}
  let locale: string | undefined
  try { locale = Intl.DateTimeFormat().resolvedOptions().locale } catch {}
  return pickLang(setting, locale)
}

async function prune($: EngineInterface) {
  const now = await $.clock.now()
  const seen = ((await $.store.get('seen')) as Record<string, number> | undefined) ?? {}
  const { changed, expired } = pruneSeen(await $.store.keys(), seen, now)
  for (const k of expired) await $.store.delete(k)
  if (changed) await $.store.set('seen', seen)
}

// ---------- ：（、、 guards.ts） ----------
// （proposed）， /handoff guard on N ； $.store，
const guardsKey = async ($: EngineInterface) => `guards:${await projectKey($)}`
async function loadGuards($: EngineInterface) {
  return ((await $.store.get(await guardsKey($))) as Guard[] | undefined) ?? []
}

async function guardCandidates($: EngineInterface, notes?: Notes, guards?: Guard[]) {
  const g = guards ?? await loadGuards($)
  const n = notes ?? parseNotes(await readNotes($, await notesFile($)))
  return guardCandidatesOf(n.rules, g)
}

// （proposed），
async function draftGuards($: EngineInterface, candidates: Rule[], rows: readonly Row[], sid: string) {
  const calls = rows.flatMap(r => r.toolUses)
  const r = await completeBackground($, {
    model: cfg.notesModel,
    effort: DISTILL_EFFORT,
    maxTokens: GUARD_MAX_TOKENS,
    timeoutMs: DISTILL_TIMEOUT_MS,
    system: guardPrompt(candidates, [...new Set(calls.map(c => c.tool))]),
    prompt: '\u4f9d\u7cfb\u7d71\u6307\u793a\u8f38\u51fa ACTIONS。',
  }, sid)
  if (!r.isAnswered) return { failed: r.reason }
  const { out, rejected } = parseGuards(r.text, new Set(candidates.map(c => c.name)))
  const guards = await loadGuards($)
  const added = withProposals(out, guards, calls, await $.clock.now())
  await $.store.set(await guardsKey($), [...guards, ...added])
  return { added, rejected }
}

async function suggestGuards($: EngineInterface) {
  const candidates = await guardCandidates($)
  if (candidates.length === 0) return { text: `${t().guard.noCandidates(GUARD_MIN_COUNT)}\n${await guardList($)}` }
  const sid = await $.session.id()
  const d = await draftGuards($, candidates, (await $.session.messages()) as readonly Row[], sid)
  if ('failed' in d) return { text: `${t().guard.suggestFailed(String(d.failed))}` }
  const { added, rejected } = d
  await markTried($, candidates)
  return {
    text: [
      `${t().guard.suggested(candidates.length, added.length)}`,
      ...(rejected.length ? [`${t().ind}${t().guard.droppedLines(rejected.length, rejected.join(t().slashList))}`] : []),
      '',
      await guardList($),
    ].join('\n'),
  }
}

// （guardTried:<>）：，
const triedKey = async ($: EngineInterface) => `guardTried:${await projectKey($)}`
async function markTried($: EngineInterface, rules: Rule[]) {
  const tried = ((await $.store.get(await triedKey($))) as Record<string, number> | undefined) ?? {}
  for (const r of rules) tried[r.name] = r.count
  await $.store.set(await triedKey($), tried)
}

// ：、（）
async function autoDraftGuards($: EngineInterface, notes: Notes, rows: readonly Row[], sid: string) {
  const tried = ((await $.store.get(await triedKey($))) as Record<string, number> | undefined) ?? {}
  const candidates = guardCandidatesOf(notes.rules, await loadGuards($)).filter(r => tried[r.name] !== r.count)
  if (candidates.length === 0) return
  const d = await draftGuards($, candidates, rows, sid)
  if ('failed' in d) { $.ui.log(t().guard.autoFailed(String(d.failed))); return }
  await markTried($, candidates)
  if (d.added.length > 0) $.ui.log(t().guard.autoDrafted(d.added.length))
}

// （、）：，（，）；
async function applyGuardAnswers($: EngineInterface, actions: Action[]) {
  const answers = guardAnswers(actions)
  if (answers.length === 0) return []
  const guards = await loadGuards($)
  const changes: string[] = []
  for (const a of answers) {
    const g = guards.find(x => x.id === a.id && x.state === 'proposed')
    if (!g) continue
    g.state = a.approve ? 'on' : 'off'
    changes.push(a.approve ? t().change.guardApproved(g.id, g.rule) : t().change.guardDeclined(g.id, g.rule))
  }
  await $.store.set(await guardsKey($), guards)
  const asked = await loadAsked($)
  for (const a of answers) delete asked[`q:${a.id}`]
  await $.store.set(await promoteKey($), asked)
  return changes
}

//  AI ：（， q:<>）
async function guardAskBlock($: EngineInterface, notes: Notes) {
  const asked = await loadAsked($)
  const drafts = (await loadGuards($)).filter(g => g.state === 'proposed' && asked[`q:${g.id}`] === undefined).slice(0, GUARD_ASK_ITEMS)
  if (drafts.length === 0) return undefined
  const sid = await $.session.id()
  const now = await $.clock.now()
  for (const g of drafts) asked[`q:${g.id}`] = { sid, at: now }
  await $.store.set(await promoteKey($), asked)
  return guardAskText(drafts.map(g => ({ guard: g, rule: notes.rules.find(r => r.name === g.rule) })))
}

// ：
async function guardViews($: EngineInterface) {
  const stats = (await $.store.get(statsKey(await projectKey($)))) as Stats | undefined
  return withHits(await loadGuards($), stats?.counts, stats?.hits)
}

const guardList = async ($: EngineInterface) => guardListText(await guardViews($))

async function guardCommand($: EngineInterface, args: string[]) {
  const [action = '', idText = '', modeText = ''] = args
  if (action === '') return { text: await guardList($) }
  if (action === 'suggest') return suggestGuards($)
  const usage = `${t().guard.usage}`
  const change = guardChangeOf(action, modeText)
  if (change === undefined || !idText) return { text: usage }
  const g = await changeGuard($, Number(idText), change)
  if (!g) return { text: `${t().guard.missing(idText)}\n${await guardList($)}` }
  return { text: `${t().guard.changed(g.id, change === 'drop')}\n${await guardList($)}` }
}

// ／／／；， undefined
async function changeGuard($: EngineInterface, id: number, change: 'on' | 'off' | 'drop' | GuardMode) {
  const r = applyGuardChange(await loadGuards($), id, change)
  if (!r) return undefined
  await $.store.set(await guardsKey($), r.updated)
  return r.g
}

// /handoff panel：（）
async function togglePanel($: EngineInterface) {
  const open = !(await read($, panelUi)).open
  // ，
  if (open) {
    const data = await loadPanelData($)
    await update($, panelData, () => data)
  }
  await update($, panelUi, u => ({ open, tab: u.tab, expanded: u.expanded, suggesting: u.suggesting }))
  return {
    text: `${open ? t().panelCmd.opened : t().panelCmd.closed}`,
  }
}

async function guardSummary($: EngineInterface, notes?: Notes) {
  const guards = await loadGuards($)
  return guardSummaryText(guards, (await guardCandidates($, notes, guards)).length)
}

async function recordHit($: EngineInterface, id: number, tool: string, input: string) {
  // ，（）；，
  await stat($, guardHitKey(id), 1, { hit: `#${id} ${tool}: ${input}` })
  await refreshPanel($)
}

// ---------- ：/handoff panel，、、 ----------
// （AbovePrompt）， Pane： Pane 
//  $.state ： store， I/O 
const panelUi = atom({ plugin: 'ctx-handoff', key: 'panelUi' } as const, { open: false, tab: 'guard', expanded: [], suggesting: false })
const panelData = atom({ plugin: 'ctx-handoff', key: 'panelData' } as const, null)

async function loadPanelData($: EngineInterface): Promise<PanelData> {
  const pk = await projectKey($)
  const file = await notesFile($)
  const notes = parseNotes(await readNotes($, file))
  const guards = await guardViews($)
  const d = (await $.store.get(`distill:last:${pk}`)) as DistillLast | undefined
  const data = panelSnapshot(file, notes, guards, d, localStamp(await $.clock.now()).slice(0, 10), await settingRows($))
  const background = await backgroundSnapshot($, { file, project: pk })
  // 、、； footer，「」
  const active = [
    background.lines[1],
    ...background.lines.slice(2, 4).filter(l => !l.endsWith(t().background.idle)),
    ...background.lines.slice(4),
  ].filter((l): l is string => Boolean(l))
  return { ...data, background: { paused: background.paused, lines: active, details: background.history } }
}

// ：SETTINGS （、， store  refresh／distill），
const SETTING_ORDER = ['auto_handoff', 'threshold', 'window_ratio', 'refresh', 'idle_minutes', 'max_refresh', 'away_handoff', 'distill', 'distill_every', 'min_tokens', 'notes_model', 'resume_hint', 'retry_nudge', 'done_check', 'reply_language', 'language']
const STORE_SWITCHES = new Set(['refresh', 'distill'])

async function settingRows($: EngineInterface): Promise<PanelSetting[]> {
  const { options, panel } = await readSettings($)
  const rows: PanelSetting[] = []
  for (const key of SETTING_ORDER) {
    if (STORE_SWITCHES.has(key)) {
      const stored = await $.store.get(key)
      rows.push({ key, kind: 'bool', value: stored !== false, source: stored === undefined ? 'default' : 'panel' })
      continue
    }
    const spec = specOf(key)
    if (!spec) continue
    const shown = key === 'reply_language' && cfg.replyLanguage === 'auto' ? (await replyTarget($)) ?? 'off'
      : key === 'language' && cfg.language === 'auto' ? getLang() : undefined
    rows.push({ key, kind: spec.kind, value: settingValue(spec, panel[key] ?? options[key]), source: settingSource(key, panel, options), ...(shown ? { shown } : {}) })
  }
  return rows
}

// ：、、； store （ session ）
async function changeSetting($: EngineInterface, key: string, dir: 1 | -1) {
  const name = t().panel.settingName[key] ?? key
  if (STORE_SWITCHES.has(key)) {
    const on = (await $.store.get(key)) !== false
    await $.store.set(key, !on)
    if (key === 'distill') await showDistillStatus($)
    return t().panelCmd.settingSet(name, on ? t().panel.offValue : t().panel.on)
  }
  const spec = specOf(key)
  if (!spec) return t().panelCmd.notFound
  const { options, panel } = await readSettings($)
  const value = stepSetting(spec, panel[key] ?? options[key], dir)
  await $.store.set('settings', { ...panel, [key]: value })
  await reloadConfig($)
  return t().panelCmd.settingSet(name, showSetting(key, value))
}

// ：， settings.json 
async function resetSetting($: EngineInterface, key: string) {
  const name = t().panel.settingName[key] ?? key
  if (STORE_SWITCHES.has(key)) {
    await $.store.delete(key)
    if (key === 'distill') await showDistillStatus($)
    return t().panelCmd.settingReset(name, t().panel.on)
  }
  const spec = specOf(key)
  if (!spec) return t().panelCmd.notFound
  const { options, panel } = await readSettings($)
  const { [key]: _drop, ...rest } = panel
  await $.store.set('settings', rest)
  await reloadConfig($)
  return t().panelCmd.settingReset(name, showSetting(key, settingValue(spec, options[key])))
}

// ；，
async function refreshPanel($: EngineInterface) {
  if (!(await read($, panelUi)).open) return
  try {
    const data = await loadPanelData($)
    await update($, panelData, () => data)
  } catch (err) {
    await setNote($, t().panelCmd.readFailed(String(err)))
  }
}

// （undefined ），
const setNote = ($: EngineInterface, note: string | undefined) =>
  update($, panelUi, ({ confirming: _c, note: _n, ...u }) => (note ? { ...u, note } : u))

// （m:<>）（r:<>）：、， .ctx-handoff-backup/
// 「」：，（，）
async function keepNote($: EngineInterface, head: string) {
  if (rt.distilling) return t().panelCmd.busyKeep
  const file = await notesFile($)
  const notes = parseNotes(await readNotes($, file))
  const m = notes.memory.find(x => memHead(x) === head)
  if (!m) return t().panelCmd.notFound
  const now = await $.clock.now()
  keepMemory(m, localStamp(now).slice(0, 10))
  await $.fs.write(file, renderNotes(notes, localStamp(now)))
  return t().panelCmd.kept(m.title)
}

async function dropNote($: EngineInterface, key: string) {
  if (rt.distilling) return t().panelCmd.busyDrop
  const file = await notesFile($)
  const original = await readNotes($, file)
  const notes = parseNotes(original)
  const removed = withoutNote(notes, key)
  if (!removed) return t().panelCmd.notFound
  const now = await $.clock.now()
  const dir = file.slice(0, file.lastIndexOf('/'))
  await $.fs.write(backupPath(dir, now), original)
  await $.fs.write(file, renderNotes(removed.updated, localStamp(now)))
  return t().panelCmd.deleted(key.startsWith('m:') ? 'm' : key.startsWith('p:') ? 'p' : 'r', removed.target, dir)
}

// ---------- ：「」，（、 progress.ts） ----------
//  $.store（，）； session ，
const progressKeyOf = async ($: EngineInterface) => progressKey(await projectKey($))
const loadProgress = async ($: EngineInterface) => (await $.store.get(await progressKeyOf($))) as Progress | undefined

//  session ：，（handoff ，）；
// 、 session ，
async function saveProgress($: EngineInterface, sid: string, p: ProgressFields, at: number) {
  await $.store.set(await progressKeyOf($), { ...p, sid, at, ...(rt.handed.has(sid) ? { handed: true as const } : {}) } satisfies Progress)
}

// （/clear  handoff ）： session ；on=false 。
// ，
async function markHanded($: EngineInterface, sid: string, on: boolean) {
  try {
    if (on) rt.handed.add(sid)
    else rt.handed.delete(sid)
    const p = await loadProgress($)
    if (p?.sid !== sid) return
    const { handed: _h, ...rest } = p
    await $.store.set(await progressKeyOf($), on ? { ...rest, handed: true as const } : rest)
  } catch {}
}

// ： session 、、 handoff 、 session
async function progressBlock($: EngineInterface) {
  if (!cfg.resumeHint) return undefined
  const p = await loadProgress($)
  const sid = await $.session.id()
  const text = progressOffer(p, sid, await $.clock.now())
  if (!text || !p) return undefined
  await $.store.set(await progressKeyOf($), withOffered(p, sid))
  return text
}

// ----------  ----------
const promoteKey = async ($: EngineInterface) => `promote:${await projectKey($)}`
const loadAsked = async ($: EngineInterface) => ((await $.store.get(await promoteKey($))) as Record<string, PromoteAsk> | undefined) ?? {}

// ：session  git repo ；
async function promoteBlock($: EngineInterface, notes: Notes) {
  const root = slash(await $.session.root())
  if (!(await $.fs.exists(`${root}/.git`))) return undefined
  const asked = await loadAsked($)
  const released = await guardsAlreadyInRepo($, root, asked)
  const items = promoteItems(await loadGuards($), notes, asked)
  if (items.length === 0) {
    if (released) await $.store.set(await promoteKey($), asked)
    return undefined
  }
  markAsked(asked, items, await $.session.id(), await $.clock.now())
  await $.store.set(await promoteKey($), asked)
  return promoteText(items)
}

// ， repo  .claude/hooks/  .claude/settings.json：，
// （asked ）。 repo，
async function guardsAlreadyInRepo($: EngineInterface, root: string, asked: Record<string, PromoteAsk>) {
  const guards = await loadGuards($)
  if (!guards.some(g => g.state === 'on' && g.project === undefined)) return false
  const paths = ['.claude/settings.json']
  try {
    for (const e of await $.fs.list(`${root}/.claude/hooks`)) if (e.kind === 'file') paths.push(`.claude/hooks/${e.name}`)
  } catch {}
  const files: { path: string; text: string }[] = []
  for (const p of paths) {
    try { files.push({ path: p, text: await $.fs.read(`${root}/${p}`) }) } catch {}
  }
  const found = guardsFoundInRepo(guards, files)
  if (found.length === 0) return false
  for (const f of found) {
    const g = guards.find(x => x.id === f.id)
    if (!g) continue
    g.project = `${PROJECT_IN}${f.where}`
    g.state = 'off'
    delete asked[`g:${g.id}`]
    $.ui.log(t().change.inProject(g.rule, f.where))
  }
  await $.store.set(await guardsKey($), guards)
  await refreshPanel($)
  return true
}

// （before：），
async function releasePromote($: EngineInterface, sid: string, before?: number) {
  const asked = await loadAsked($)
  if (releaseAsked(asked, sid, before)) await $.store.set(await promoteKey($), asked)
}

//  repo ： session ，；
// 
async function checkPromotions($: EngineInterface, actions: Action[], rejected: Rejected) {
  const root = slash(await $.session.root())
  const out: Action[] = []
  for (const a of actions) {
    if (a.op !== 'in_project') { out.push(a); continue }
    const p = slash(a.where).replace(/^\.\//, '')
    const abs = isAbs(p) ? p : `${root}/${p}`
    if (!(await $.fs.exists(abs))) { addRejected(rejected, t().reject.whereMissing(a.where), JSON.stringify(a)); continue }
    out.push({ ...a, where: abs.toLowerCase().startsWith(`${root.toLowerCase()}/`) ? abs.slice(root.length + 1) : p })
  }
  return out
}

//  repo： project（ repo  ctx-handoff ），；
// （，），
async function applyPromotions($: EngineInterface, actions: Action[], candidates: { id: string; key: string; name: string }[], sid: string, started: number) {
  const changes: string[] = []
  const promos = guardPromotions(actions)
  if (promos.length > 0) {
    const guards = await loadGuards($)
    for (const p of promos) {
      const g = guards.find(x => x.id === p.id)
      if (!g) continue
      g.project = p.where === undefined ? PROJECT_DECLINED : `${PROJECT_IN}${p.where}`
      if (p.where !== undefined) g.state = 'off'
      changes.push(p.where === undefined ? t().change.notInProject(g.rule) : t().change.inProject(g.rule, p.where))
    }
    await $.store.set(await guardsKey($), guards)
  }
  const asked = await loadAsked($)
  const keyOf = new Map(candidates.map(c => [c.id, c.key]))
  let changed = releaseAsked(asked, sid, started)
  for (const a of actions) {
    const key = (a.op === 'in_project' || a.op === 'not_in_project') ? keyOf.get(a.id) : undefined
    if (key !== undefined && asked[key] !== undefined) { delete asked[key]; changed = true }
  }
  if (changed) await $.store.set(await promoteKey($), asked)
  return changes
}

function panelActions($: EngineInterface): PanelActions {
  // （），、； $.state
  const run = (work: () => Promise<string | undefined>) => {
    void work()
      .catch(err => t().panelCmd.failed(String(err)))
      .then(async note => { await refreshPanel($); await setNote($, note) })
  }
  const setUi = (fn: (u: PanelUi) => PanelUi) => update($, panelUi, fn)
  return {
    away: paused => run(() => changeAway($, paused)),
    guard: (id, action) => run(async () => {
      const g = await changeGuard($, id, action)
      return g ? t().guard.panelDone(id, action) : t().guard.missing(String(id))
    }),
    suggest: () => run(async () => {
      if ((await read($, panelUi)).suggesting) return undefined
      await setUi(u => ({ ...u, suggesting: true }))
      try { return (await suggestGuards($)).text.split('\n')[0] }
      finally { await setUi(u => ({ ...u, suggesting: false })) }
    }),
    tab: tab => setUi(({ confirming: _c, note: _n, ...u }) => ({ ...u, tab })),
    toggle: key => setUi(u => ({ ...u, expanded: u.expanded.includes(key) ? u.expanded.filter(k => k !== key) : [...u.expanded, key] })),
    ask: key => setUi(({ confirming: _c, note: _n, ...u }) => (key ? { ...u, confirming: key } : u)),
    drop: key => run(() => dropNote($, key)),
    setting: (key, dir) => run(() => changeSetting($, key, dir)),
    resetSetting: key => run(() => resetSetting($, key)),
    keep: head => run(() => keepNote($, head)),
    close: () => setUi(u => ({ ...u, open: false })),
  }
}

// （ $，，、）：
// A ， 2 （context，、）；
// B ，；
// C （watchReply ），
function watchCall<R extends { deny?: string; isError?: boolean; text?: string; result?: unknown; context?: readonly string[] }>(
  e: { tool: string },
  r: R,
): R {
  try {
    if (r.deny !== undefined) return r
    const failed = r.isError === true
    const agent = (e as { agentId?: string }).agentId ?? ''
    // ：（）（2026-10-08 ）
    if (cfg.doneCheck && agent === '') noteCall(rt.work, e.tool, e as Record<string, unknown>, failed)
    const extra: string[] = []
    if (cfg.retryNudge) {
      const text = r.text ?? (typeof r.result === 'string' ? r.result : undefined)
      const nudge = trackFailure(rt.streaks, `${agent}|${e.tool}`, e.tool, failed, text)
      if (nudge) extra.push(nudge)
    }
    // ：，（）
    const reply = agent === '' ? takePending(rt.reply) : undefined
    if (reply) extra.push(reply)
    return extra.length ? { ...r, context: [...(r.context ?? []), ...extra] } : r
  } catch {
    return r
  }
}

// ：；auto  Claude Code  language ， undefined（）。
// ，（config.set）
async function replyTarget($: EngineInterface) {
  if (rt.replyTarget) return rt.replyTarget.lang
  let setting: unknown
  if (cfg.replyLanguage === 'auto') {
    try { setting = (await $.settings.read()).language } catch { return undefined }
  }
  const lang = resolveReplyLang(cfg.replyLanguage, setting)
  rt.replyTarget = { lang }
  return lang
}

// turn.step ：（、）。
// ，（watchCall）；（prompt.submit）
async function watchReply($: EngineInterface, r: { answer: string; toolUses: readonly unknown[] }) {
  try {
    await initLang($)
    if (cfg.replyLanguage === 'off' || !r.answer) return
    const target = await replyTarget($)
    if (target) noteStep(rt.reply, r.answer, r.toolUses.length > 0, target)
  } catch {}
}

// ：（，）
async function rewriteReason($: EngineInterface, e: { stop_hook_active?: boolean; last_assistant_message?: string }) {
  try {
    if (cfg.replyLanguage === 'off') return undefined
    const target = await replyTarget($)
    return target ? stopRewrite(rt.reply, e.last_assistant_message, e.stop_hook_active === true, target) : undefined
  } catch {
    return undefined
  }
}

// ，：（）。
// ； reminded，。 Stop ，
//  turn.complete（isAborted）
function doneReason(e: { stop_hook_active?: boolean; last_assistant_message?: string }): string | undefined {
  try {
    if (cfg.doneCheck) {
      const reason = doneCheck(rt.work, e.last_assistant_message, e.stop_hook_active === true)
      if (reason) return reason
    }
  } catch {}
  rt.work = freshWork()
  return undefined
}

export const register: Register = on => {
  resetRuntime()
  resetConfig()
  setLang('en')

  on('session.start', async ($, e, next) => {
    await initLang($)
    const description = t().start.description
    //  /handoff（ skill）， /ctx-handoff
    try {
      await $.command.register({ name: 'handoff', description })
    } catch (err) {
      try {
        await $.command.register({ name: 'ctx-handoff', description })
        $.ui.log(t().start.taken(String(err)))
      } catch (err2) {
        $.ui.log(t().start.registerFailed(String(err2)))
      }
    }
    try {
      await showDistillStatus($)
    } catch {}
    // ：
    try {
      await resumeSchedule($)
    } catch (err) {
      $.ui.log(t().start.resumeFailed(String(err)))
    }
    try {
      await prune($)
    } catch (err) {
      $.ui.log(t().start.pruneFailed(String(err)))
    }
    return next(e)
  })

  // （、/clear、resume、）：，
  on('session.end', async ($, e, next) => {
    try {
      await releasePromote($, e.sessionId)
    } catch {}
    return next(e)
  })

  // ：，（model、effort ，）
  on('turn.step', async function* ($, e, next) {
    const r = yield* next(e)
    if (e.agentId === undefined) await watchReply($, r)
    return r
  })

  //  /config  Claude Code （ language）： auto 
  on('config.set', async (_$, e, next) => {
    const out = await next(e)
    if (out.deny === undefined) rt.replyTarget = undefined
    return out
  })

  // （ /clear ）；，
  on('prompt.context', async ($, e, next) => {
    const out = await next(e)
    await initLang($)
    try {
      if (await isHomeWorkspace($)) return out
      const file = await notesFile($)
      const notes = parseNotes(await readNotes($, file))
      const text = contextText(notes, file, localStamp(await $.clock.now()).slice(0, 10))
      const promote = await promoteBlock($, notes)
      const guardAsk = await guardAskBlock($, notes).catch(() => undefined)
      // 
      const progress = await progressBlock($).catch(() => undefined)
      const blocks = [
        ...(text ? [{ name: 'ctxHandoffProject', text }] : []),
        ...(promote ? [{ name: 'ctxHandoffPromote', text: promote }] : []),
        ...(guardAsk ? [{ name: 'ctxHandoffGuardAsk', text: guardAsk }] : []),
        ...(progress ? [{ name: 'ctxHandoffProgress', text: progress }] : []),
      ]
      return blocks.length ? { ...out, blocks: [...out.blocks, ...blocks] } : out
    } catch {
      return out
    }
  })

  // ：（on）；hook ，
  on('tool.call', async ($, e, next) => {
    let matched: { hit: Guard; text: string } | undefined
    try {
      matched = findGuardHit(await loadGuards($), e.tool, e as Record<string, unknown>)
    } catch (err) {
      await initLang($)
      $.ui.log(t().guard.checkFailed(String(err)))
    }
    await initLang($)
    if (!matched) return watchCall(e, await next(e))
    const { hit, text } = matched
    await recordHit($, hit.id, e.tool, text)
    const head = `${tag} ${t().guard.head(hit.id, hit.rule, hit.message)}`
    if (hit.mode === 'deny') {
      $.ui.toast(t().guard.denyToast(hit.id, e.tool, hit.rule))
      return { deny: `${head}\n${t().guard.denyHint(hit.id)}` }
    }
    const r = await next(e)
    return watchCall(e, r.deny === undefined ? { ...r, context: [...(r.context ?? []), head] } : r)
  })

  // 、，（ plugin ）
  //  $.state（，），
  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    await initLang($)
    const ui = await read($, panelUi)
    const data = ui.open && !e.props.hasSurvey ? await read($, panelData) : null
    return data
      ? panelTree($.ui.resolve(e), { ...data, ...ui, columns: e.props.bodyColumns }, panelActions($))
      : next(e)
  })

  on('turn.complete', async ($, e, next) => {
    await initLang($)
    const out = await next(e)
    //  Stop：，
    if (e.agentId === undefined && e.isAborted) rt.work = freshWork()
    if (e.agentId === undefined) rt.activity += 1
    if (e.agentId !== undefined || rt.busy) return out
    //  session ：（ state）
    await refreshPanel($)
    // ： handoff 
    const ak = awayKey(await $.session.id())
    const away = (await $.store.get(ak)) as Away | undefined
    if (away !== undefined && away.held === undefined) {
      await $.store.delete(ak)
      $.ui.log(t().idle.outdated)
      await stat($, 'away.stale')
    }
    // ，TTL 
    await schedule($)
    if (e.reason !== 'answer') return out
    const { context } = await $.session.usage()
    //  classic.Stop ；（）
    if (cfg.autoHandoff && context.tokens !== undefined && context.tokens >= thresholdOf(context.window)) return out
    //  distill_every ，
    if ((context.tokens ?? 0) >= cfg.minTokens && !rt.distilling && (await isDistillOn($)) && (await sinceDistill($)) >= cfg.distillEvery) {
      const every = cfg.distillEvery
      $.clock.after(0, () => void distill($, t().distill.why.every(every)))
    }
    if (!rt.distilling) await showDistillStatus($)
    return out
  })

  on('classic.Stop', async ($, e, next) => {
    await initLang($)
    const out = await next(e)
    //  Stop hook ：， Stop 
    if (out.block !== undefined) return out
    // ：，，
    const reason = e.agent_id === undefined ? doneReason(e) : undefined
    if (reason !== undefined) {
      $.ui.log(t().loops.doneLog)
      return { ...out, block: reason }
    }
    const rewrite = e.agent_id === undefined ? await rewriteReason($, e) : undefined
    if (rewrite !== undefined) {
      $.ui.log(t().loops.rewriteLog)
      return { ...out, block: rewrite }
    }
    try {
      await onStop($, e)
    } catch (err) {
      $.ui.log(t().stop.stopFailed(String(err)))
    }
    return out
  })

  on('prompt.submit', async ($, e, next) => {
    const isHuman = e.origin.kind === 'composer' || e.origin.kind === 'bridge'
    if (!isHuman) return next(e)
    rt.activity += 1
    await initLang($)
    try { await reloadConfig($) } catch {}
    const isSlash = e.text.trimStart().startsWith('/')
    // ：，
    const hasAttachments = (e.attachments?.length ?? 0) > 0
    if (rt.presenting && !isSlash && (e.text.trim() || hasAttachments)) {
      const elapsed = rt.presentStartedAt === undefined ? 0 : Math.round(((await $.clock.now()) - rt.presentStartedAt) / 1000)
      const wait = t().submit.wait(elapsed, Math.round(HANDOFF_TIMEOUT_MS / 60_000))
      // ：mod 
      const attachNote = hasAttachments ? t().submit.attach : ''
      if (!e.text.trim()) return { drop: `${t().submit.busy(wait, attachNote)}` }
      // ：
      if (rt.held.some(h => h.trim() === e.text.trim())) {
        return { drop: `${t().submit.dup(wait, attachNote)}` }
      }
      rt.held.push(e.text)
      return { drop: `${t().submit.held(wait, attachNote)}` }
    }
    rt.idle?.cancel()
    rt.idle = undefined
    rt.refreshes = 0
    // ：
    rt.work = freshWork()
    await update($, idleState, () => null)
    const sid = await $.session.id()
    // ：
    if (!isSlash && e.text.trim()) {
      await $.store.set(`last:${sid}`, anchorOf(e.text))
      await touchSeen($, `last:${sid}`)
    }
    if (rt.myPending && !rt.busy && !rt.pendingToasted) {
      rt.pendingToasted = true
      $.ui.toast(t().submit.pendingToast)
    }
    if (isSlash) return next(e)

    const key = awayKey(sid)
    const away = (await $.store.get(key)) as Away | undefined
    let msg = e
    if (away !== undefined) {
      if (away.held === undefined) {
        // 、：，
        if (!e.text.trim()) {
          return { drop: `${t().submit.awayAttach}` }
        }
        await $.store.set(key, { ...away, held: e.text } satisfies Away)
        return { drop: `${t().submit.awayHeld(hasAttachments)}` }
      }
      // ＝；
      await $.store.delete(key)
      if (e.text !== away.held) msg = { ...e, text: `${away.held}\n\n${e.text}` }
    }
    // ：
    // ：，
    const pend = rt.pendingNotes.get(sid)
    const reply = peekNext(rt.reply)
    if (!pend && reply.length === 0) return next(msg)
    const r = await next({ ...msg, context: [...(msg.context ?? []), ...(pend ? [noteBlock(pend.changes, pend.file)] : []), ...reply] })
    if ((r as { drop?: string }).drop === undefined) {
      rt.pendingNotes.delete(sid)
      clearNext(rt.reply)
    }
    return r
  })

  //  /handoff（ /ctx-handoff），；
  for (const command of ['handoff', 'ctx-handoff']) on('command.run', { command }, async ($, e) => {
    await initLang($)
    const [sub = '', arg = '', ...rest] = e.args.trim().split(/\s+/)
    try {
    switch (sub) {
      case '': return { text: await status($) }
      case 'now': return await handoffNow($)
      case 'dry': return await handoffDry($)
      case 'distill': return await distillCommand($, arg)
      case 'resume': return await resume($)
      case 'continue': return await keepOld($)
      case 'resend': return await resend($, arg)
      case 'away': return { text: arg === 'pause' || arg === 'resume' ? await changeAway($, arg === 'pause') : t().cmd.awayUsage }
      case 'refresh': return await refreshCommand($, arg)
      case 'guard': {
        const r = await guardCommand($, [arg, ...rest])
        await refreshPanel($)
        return r
      }
      case 'panel': return await togglePanel($)
      default: return { text: `${t().cmd.unknown(sub)}\n${usageText()}` }
    }
    } catch (err) { return { text: t().cmd.commandFailed(String(err)) } }
  })
}

async function backgroundSnapshot($: EngineInterface, preloaded?: { file: string; project: string }) {
  const sid = await $.session.id()
  const file = preloaded?.file ?? await notesFile($)
  const project = preloaded?.project ?? await projectKey($)
  const paused = await awayPaused($)
  const idle = await read($, idleState)
  const stats = (await $.store.get(`stats:session:${sid}`)) as Stats | undefined
  const background = stats?.background?.project === project ? stats.background : undefined
  const m = t().background
  const pendingSid = rt.myPending?.sid ?? sid
  const pending = (await $.store.get(pendingKey(pendingSid))) as PendingSubmit | undefined
  const task = rt.distillTask
  const handoff = rt.handoffTask
  const lines = [
    m.bound(file, sid), m.away(paused, rt.idle && !paused ? idle?.due : undefined),
    task ? m.task(m.distill, task.sid, task.why, task.at) : m.idleTask(m.distill),
    handoff ? m.task(m.handoff, handoff.sid, m.phases[handoff.phase], handoff.at) : m.idleTask(m.handoff),
    background ? m.collected(background.since, describeUsage(background.usage), background.unknownResults) : m.uncollected,
    ...(pending?.project === project ? [m.pending(pendingSid)] : []),
  ]
  const saved = ((await $.store.get(`handoffs:${project}`)) as Saved[] | undefined)?.at(-1)
  const error = (await $.store.get(`handoff:error:${project}`)) as HandoffError | undefined
  const distillError = (await $.store.get(`distill:error:${project}`)) as DistillError | undefined
  const history = [
    m.history,
    ...(saved ? [t().cmd.latest({ at: new Date(saved.at).toLocaleString(), kind: saved.kind, tokens: String(saved.tokens ?? '?') })] : []),
    ...(error ? [t().cmd.latestFailure(new Date(error.at).toLocaleString(), error.kind, error.reason)] : []),
    ...(distillError ? [t().distillStatus.failed(new Date(distillError.at).toLocaleString(), distillError.why, distillError.reason)] : []),
  ]
  return { paused, lines, history, saved, error, distillError }
}

async function status($: EngineInterface) {
  const { context } = await $.session.usage()
  const away = (await $.store.get(awayKey(await $.session.id()))) as Away | undefined
  const pk = await projectKey($)
  const file = await notesFile($)
  const notes = parseNotes(await readNotes($, file))
  const bg = await backgroundSnapshot($, { file, project: pk })
  return statusText({
    background: bg.lines,
    tokens: context.tokens, window: context.window, refreshOn: await isRefreshOn($), away, last: bg.saved, herr: bg.error,
    distill: await distillStatus($, { pk, file, notes, err: bg.distillError }),
    guards: await guardSummary($, notes), progress: await progressStatus($), replyLang: await replyLangLabel($),
  })
}

// /handoff ：auto 
async function replyLangLabel($: EngineInterface) {
  if (cfg.replyLanguage !== 'auto') return cfg.replyLanguage
  return `auto → ${(await replyTarget($)) ?? 'off'}`
}

async function progressStatus($: EngineInterface) {
  const p = await loadProgress($)
  return p && t().progress.status(new Date(p.at).toLocaleString(), p.task, t().progress.states[p.state] ?? p.state, !cfg.resumeHint)
}

async function handoffNow($: EngineInterface) {
  if (rt.busy) return { text: `${t().cmd.busy}` }
  const { context } = await $.session.usage()
  const tokens = context.tokens ?? null
  beginPresent()
  $.clock.after(0, () => void present($, tokens, 'manual'))
  return { text: `${t().cmd.nowStarted}` }
}

async function handoffDry($: EngineInterface) {
  if (rt.busy) return { text: `${t().cmd.busy}` }
  const { context } = await $.session.usage()
  rt.busy = true
  try {
    const text = await makeHandoff($, 'dry', context.tokens ?? null)
    if (text === undefined) return { text: `${t().cmd.dryFailed}` }
    const list = ((await $.store.get(`handoffs:${await projectKey($)}`)) as Saved[] | undefined) ?? []
    const usage = list.at(-1)?.usage
    return {
      text: `${t().cmd.dryDone(String(context.tokens ?? '?'))}\n` +
        `${usage ? describeUsage(usage) : ''}\n\n${text}`,
    }
  } finally {
    rt.busy = false
  }
}

async function distillCommand($: EngineInterface, arg: string) {
  if (arg === 'on' || arg === 'off') {
    await $.store.set('distill', arg === 'on')
    await showDistillStatus($)
    return { text: t().cmd.distillSet(arg) }
  }
  if (arg !== '') return { text: `${t().cmd.distillUsage}` }
  if (rt.distilling) return { text: `${t().cmd.distilling}` }
  const r = await distill($, t().distill.why.manual)
  if (r === undefined || !r.isAnswered || rt.distillFailed) {
    return { text: `${t().cmd.distillNone}\n${await distillStatus($)}` }
  }
  return { text: `${t().cmd.distillDone}\n${await distillStatus($)}` }
}

async function refreshCommand($: EngineInterface, arg: string) {
  if (arg !== 'on' && arg !== 'off') return { text: `${t().cmd.refreshNow((await isRefreshOn($)) ? 'on' : 'off')}` }
  await $.store.set('refresh', arg === 'on')
  return { text: t().cmd.refreshSet(arg, cfg.idleMs / 60_000) }
}

async function resume($: EngineInterface) {
  const key = awayKey(await $.session.id())
  const away = (await $.store.get(key)) as Away | undefined
  if (away === undefined) return { text: `${t().cmd.noAway}` }
  await $.store.delete(key)
  const intro = `${tag} ${away.held === undefined ? t().cmd.resumeIntro : t().cmd.resumeIntroHeld}`
  const handoff = away.held === undefined ? away.handoff : `${away.handoff}\n\n${t().cmd.resumeHeld}\n${away.held}`
  rt.busy = true
  const sid = await $.session.id()
  $.clock.after(0, () => {
    void clearAndSubmit($, `${intro}

${handoff}`)
      .then(async failed => {
        if (!failed) { await stat($, 'away.resume'); return }
        $.ui.log(t().cmd.resumeFailedLog(failed.reason))
        await recordFailure($, 'away', null, t().handoff.reasonStage(failed.stage, failed.reason), sid)
        // ： handoff（）， /handoff resume  continue
        if (failed.stage === 'clear') {
          await $.store.set(key, away)
          $.ui.toast(t().cmd.resumeClearFailed)
        }
      })
      .catch(err => $.ui.log(t().cmd.resumeFailedLog(String(err))))
      .finally(() => { rt.busy = false })
  })
  return { text: `${t().cmd.resuming}` }
}

//  session  pending；， session， /clear。
async function resend($: EngineInterface, sourceSid = '') {
  let text: string | undefined
  let key: string | undefined
  const sid = sourceSid || rt.myPending?.sid
  if (sid) {
    const candidateKey = pendingKey(sid)
    const stored = (await $.store.get(candidateKey)) as PendingSubmit | undefined
    if (typeof stored === 'string') return { text: t().cmd.pendingUnbound }
    if (stored?.project === await projectKey($)) { key = candidateKey; text = stored.text }
  }
  if (text === undefined && !sourceSid && rt.lastHandoff) {
    text = `${tag} ${t().cmd.resendIntro}

${rt.lastHandoff.text}`
  }
  if (text === undefined) return { text: `${t().cmd.nothingToResend}` }
  const body = text
  $.clock.after(0, () => {
    void submitText($, body)
      .then(async () => {
        if (key !== undefined) await $.store.delete(key)
        rt.myPending = undefined
      })
      .catch(err => $.ui.log(t().cmd.resendFailed(String(err))))
  })
  return { text: `${t().cmd.resending}` }
}

async function keepOld($: EngineInterface) {
  const key = awayKey(await $.session.id())
  const away = (await $.store.get(key)) as Away | undefined
  if (away === undefined) return { text: `${t().cmd.noAway}` }
  await $.store.delete(key)
  await stat($, 'away.continue')
  const msg = away.held
  if (msg === undefined) return { text: `${t().cmd.discarded}` }
  $.clock.after(0, () => void submitText($, msg).catch(err => $.ui.log(t().cmd.sendHeldFailed(String(err)))))
  return { text: `${t().cmd.discardedSend}` }
}
