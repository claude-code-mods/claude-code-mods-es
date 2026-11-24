// ： *.test.ts （ *.test.ts，）
import { mock } from 'claude-code/testing'
import type { On } from 'claude-code'
import type { Engine } from 'claude-code/testing'

const usage = (tokens: number) =>
  ({ input_tokens: 1, output_tokens: 1, cache_read_input_tokens: tokens, cache_creation_input_tokens: 0 })

//  JSON ； ACTIONS／END 
export const actionsReply = (...lines: (string | object)[]) =>
  ['=== ACTIONS ===', ...lines.map(l => (typeof l === 'string' ? l : JSON.stringify(l))), '=== END ==='].join('\n')
//  fork 
export const DISTILL_REPLY = actionsReply(
  { op: 'add_memory', type: 'project', title: '\u4f7f\u7528\u8005\u6c7a\u5b9a\u4ea4\u63a5\u9580\u6abb\u7dad\u6301 600k', evidence: '\u8a0e\u8ad6\u9580\u6abb\u5f8c\u6c7a\u5b9a' },
  { op: 'add_memory', type: 'project', title: 'api_key=abc123 \u4e0d\u8a72\u88ab\u5beb\u5165', evidence: '\u6e2c\u8a66' },
  { op: 'add_rule', name: '\u5148\u5be6\u6e2c\u518d\u4e0b\u7d50\u8ad6', rule: '\u5ba3\u7a31\u73fe\u884c\u884c\u70ba\u524d\u5148\u8dd1\u4e00\u6b21\u6700\u5c0f\u5be6\u6e2c', applies: 'API \u884c\u70ba\u4e0d\u78ba\u5b9a\u6642', not_applies: '\u6587\u4ef6\u5df2\u660e\u78ba\u4fdd\u8b49\u6642', evidence: 'fork \u80fd\u5426\u8b80\u5beb\u9760\u5be6\u6e2c\u624d\u78ba\u5b9a' },
)

// ：ES module  let ，， world() 
const fresh = () => ({
  distillReply: DISTILL_REPLY,
  onComplete: undefined as (() => void | Promise<void>) | undefined,
  //  aborted（ timeoutMs ）
  completeAborts: false,
  takenCommands: new Set<string>(),
  registered: [] as string[],
  //  fork ： fork ，
  forkGate: undefined as (() => Promise<void>) | undefined,
  completeGate: undefined as (() => Promise<void>) | undefined,
  // 
  distillGate: undefined as (() => Promise<void>) | undefined,
  handoffGate: undefined as (() => Promise<void>) | undefined,
  // （）
  failWrite: undefined as string | undefined,
  failRead: undefined as { path: string; reason: string } | undefined,
  failStore: undefined as { key: string; remaining: number } | undefined,
  failDelete: undefined as string | undefined,
  onStore: undefined as ((op: 'get' | 'set', key: string) => Promise<void>) | undefined,
  // $.session.repo()：（ cd ）
  curRepo: null as { root: string; remote: string | null; internal: boolean; name: string } | null,
  //  fork（）
  failHandoff: false,
  //  prompt.submit 
  failSubmits: 0,
  // /clear （ /clear ）
  onClear: undefined as (() => void | Promise<void>) | undefined,
  //  Stop hook （ plugin ）
  stopBlock: undefined as string | undefined,
  // tool.call ： undefined （{ result: 'ok' }）；
  toolReply: undefined as ((e: { tool: string; command?: string }) => { isError: true; result: string; text: string } | undefined) | undefined,
  // turn.step （）
  stepReply: { answer: '', toolUses: [] as { name: string; input: unknown }[] },
  //  turn.step （ plugin  model、effort）
  stepSeen: undefined as { model: string; effort?: unknown } | undefined,
  curSid: 'S1',
  // session （P1）
  curRoot: 'C:\\proj',
  curCwd: 'C:/proj',
  // $.env.get ；world()  Windows ，POSIX  world() 
  envVars: { USERPROFILE: 'C:\\Users\\u' } as Record<string, string>,
  // （store  settings， plugin ）；，
  panelSettings: {} as Record<string, unknown>,
  // settings.json  pluginConfigs["ctx-handoff@…"].options（clone  claude -p ）
  pluginOptions: {} as Record<string, unknown>,
})
export const ctl = fresh()

// ：、fork、/clear、、，
export const world = (on: On, tokens: number, window = 1_000_000, store: Record<string, unknown> = {}, agents: { id: string; status: string }[] = [], turns: number | (() => number) = 0,
  //  Claude Code  language ；，
  language: unknown = '\u7e41\u9ad4\u4e2d\u6587', injectAutoHandoffOverride = true) => {
  const turnsOf = typeof turns === 'function' ? turns : () => turns
  const forks: string[] = []
  const completes: { model: string; effort?: string; system?: string; prompt: string; timeoutMs?: number }[] = []
  const rows: { role: 'user' | 'assistant'; text: string; toolUses: { tool: string; input: Record<string, unknown>; text?: string }[] }[] = []
  const commands: string[] = []
  const submits: string[] = []
  const contexts: (readonly string[] | undefined)[] = []
  const toasts: string[] = []
  const files = new Map<string, string>([['C:/Users/u/.claude/projects/C--proj/S1.jsonl', '']])
  const logs: string[] = []
  Object.assign(ctl, fresh())
  const clock = mock.clock(on)
  on('ui.log', (_$, e: unknown) => { logs.push(JSON.stringify(e)); return { value: undefined } })
  const statuses: (string | undefined)[] = []
  on('ui.status', (_$, e: { text?: string }) => { statuses.push(e.text); return { value: undefined } })
  on('ui.toast', (_$, e: unknown) => { toasts.push(JSON.stringify(e)); return { value: undefined } })
  //  store：（$.store  $ ）； JSON ，
  const kv = new Map<string, unknown>(Object.entries(store))
  on('store.get', async (_$, e: { key: string }) => {
    await ctl.onStore?.('get', e.key)
    return { value: kv.has(e.key) ? JSON.parse(JSON.stringify(kv.get(e.key))) : e.key === 'settings' ? { ...ctl.panelSettings } : undefined }
  })
  on('store.set', async (_$, e: { key: string; value: unknown }) => {
    await ctl.onStore?.('set', e.key)
    if (ctl.failStore?.key === e.key && ctl.failStore.remaining > 0) { ctl.failStore.remaining -= 1; return { deny: 'store write failed' } }
    kv.set(e.key, JSON.parse(JSON.stringify(e.value)))
    return { value: undefined }
  })
  on('store.delete', (_$, e: { key: string }) => {
    if (ctl.failDelete === e.key) return { deny: 'store delete failed' }
    kv.delete(e.key)
    return { value: undefined }
  })
  on('store.keys', () => ({ value: [...kv.keys()] }))
  const get = (key: string) => kv.get(key)
  const put = (key: string, value: unknown) => { kv.set(key, value) }
  on('env.get', (_$, e: { name: string }) => ({ value: ctl.envVars[e.name] }))
  on('settings.read', () => ({ value: { language, pluginConfigs: { 'ctx-handoff@ctx-handoff-mod': { options: { ...(injectAutoHandoffOverride ? { auto_handoff: true } : {}), ...ctl.pluginOptions } } } } }) as never)
  on('config.set', (_$, e: { key: string; value: unknown }) => ({ value: e.value }) as never)
  on('session.id', () => ({ value: ctl.curSid }))
  on('session.turns', () => ({ value: turnsOf() }))
  on('session.usage', () => ({ value: { startedAt: 0, context: { tokens, window }, rateLimits: [] } }))
  on('session.repo', () => ({ value: ctl.curRepo }))
  on('session.root', () => ({ value: ctl.curRoot }))
  on('session.cwd', () => ({ value: ctl.curCwd }))
  // ：， tool.call  plugin  hook
  on('tool.call', (_$, e) => ctl.toolReply?.(e as { tool: string; command?: string }) ?? { result: 'ok' })
  // （Windows ），。
  // POSIX  C:/... ，（/w/C:/...）； Windows ，；，Windows  /home/...  POSIX （C:/home/...），
  const norm = (p: string) => p.split(String.fromCharCode(92)).join('/').replace(/^.*?\/(?=[A-Za-z]:\/)/, '').replace(/^[A-Za-z]:(?=\/(?:home|opt)\/)/, '')
  on('fs.exists', (_$, e: { path: string }) => ({ value: files.has(norm(e.path)) }))
  on('fs.list', (_$, e: { path: string }) => {
    const dir = `${norm(e.path).replace(/\/+$/, '')}/`
    const names = new Map<string, 'file' | 'dir'>()
    for (const p of files.keys()) {
      if (!p.startsWith(dir)) continue
      const rest = p.slice(dir.length)
      const i = rest.indexOf('/')
      names.set(i === -1 ? rest : rest.slice(0, i), i === -1 ? 'file' : 'dir')
    }
    return { value: [...names].map(([name, kind]) => ({ name, kind, size: 0, mtimeMs: 0, isLink: false })) }
  })
  const reads: string[] = []
  on('fs.read', (_$, e: { path: string }) => {
    reads.push(norm(e.path))
    if (ctl.failRead?.path === norm(e.path)) return { deny: ctl.failRead.reason }
    return files.has(norm(e.path)) ? { value: files.get(norm(e.path)) ?? '' } : { deny: 'ENOENT' }
  })
  const writes: string[] = []
  on('fs.write', (_$, e: { path: string; text: string }) => {
    writes.push(norm(e.path))
    if (ctl.failWrite === norm(e.path)) return { deny: 'disk full' }
    files.set(norm(e.path), e.text)
    return { value: undefined }
  })
  on('model.fork', async (_$, e: { prompt: string }) => {
    forks.push(e.prompt)
    await ctl.forkGate?.()
    await ctl.handoffGate?.()
    if (ctl.failHandoff) return { value: { isAnswered: false as const, reason: 'nothing-to-fork' as const } }
    return { value: { isAnswered: true as const, text: 'HANDOFF: \u6e2c\u8a66', usage: usage(tokens) } }
  })
  on('model.complete', async (_$, e: { model: string; effort?: string; system?: string; prompt: string; timeoutMs?: number }) => {
    completes.push(e)
    // timeoutMs ；ctl.completeAborts  aborted
    if (ctl.completeAborts) return { value: { isAnswered: false as const, reason: 'aborted' as const, usage: usage(0) } }
    await ctl.onComplete?.()
    await ctl.completeGate?.()
    await ctl.distillGate?.()
    return { value: { isAnswered: true as const, text: ctl.distillReply, usage: usage(0) } }
  })
  // ：，
  on('session.messages', () => ({ value: [...rows] as never }))
  // ctl.takenCommands： skill 
  on('command.register', (_$, e: { name: string }) => {
    ctl.registered.push(e.name)
    return ctl.takenCommands.has(e.name) ? { deny: `"/${e.name}" refused: it is the user's /${e.name}` } : { value: { command: e.name } }
  })
  on('session.start', (_$, e: { cwd: string }) => ({ cwd: e.cwd }))
  on('session.end', (_$, e: { sessionId: string }) => ({ sessionId: e.sessionId }))
  on('tool.register', (_$, e: { name: string }) => ({ value: { tool: `mcp__ctx-handoff__${e.name}` } }) as never)
  on('prompt.context', (_$, e) => ({ blocks: [...e.blocks] }))
  on('command.run', async (_$, e: { command: string }) => {
    commands.push(e.command)
    await ctl.onClear?.()
    return { text: '' }
  })
  //  hook ：，
  // biome-ignore lint/correctness/useYield:  yield
  on('turn.step', async function* (_$, e) {
    ctl.stepSeen = e
    const { answer, toolUses } = ctl.stepReply
    return { turnId: 't1', index: 0, answer, toolUses, stopReason: toolUses.length > 0 ? ('tool_use' as const) : ('end_turn' as const), usage: null }
  })
  on('turn.complete', () => ({ text: '' }))
  on('classic.Stop', () => (ctl.stopBlock !== undefined ? { block: ctl.stopBlock } : {}))
  on('agent.list', () => ({ value: agents.map(a => ({ ...a, description: '', type: 'general-purpose' })) as never }))
  on('prompt.submit', (_$, e: { text?: string; context?: readonly string[] }) => {
    // ：（hook ， $.prompt.submit ）
    if (ctl.failSubmits > 0) { ctl.failSubmits -= 1; return { drop: 'submit boom' } }
    submits.push(e.text ?? '')
    contexts.push(e.context)
    rows.push({ role: 'user', text: e.text ?? '', toolUses: [] })
    return { text: e.text ?? '', context: e.context }
  })
  return { clock, forks, commands, submits, contexts, toasts, files, logs, get, put, reads, writes, completes, rows, statuses }
}

export const NOTE_TAG = '[ctx-handoff \u5c08\u6848\u7d93\u9a57]'
export const DAY = 24 * 60 * 60_000
export const presentation = { isFullscreen: false, columns: 80 }
export const composer = { kind: 'composer' as const }
export const cmd = ($: Engine, args: string) =>
  $.command.run({ command: 'handoff', args, origin: composer, presentation })
export const resume = ($: Engine) => cmd($, 'resume')
export const say = ($: Engine, text: string) => $.prompt.submit({ text, origin: composer, wait: false })
export const startSession = ($: Engine) => $.session.start({ cwd: 'C:/proj', surface: null, isInteractive: true })
export const task = (status = 'running') => ({ id: 'b1', type: 'shell', status, description: 'sleep 999' })
export const cron = (recurring: boolean) => ({ id: 'c1', schedule: '0 9 * * *', recurring, prompt: 'check' })

// ：answer ，tools ；agentId ＝
export const step = async ($: Engine, answer: string, opts: { tools?: number; agentId?: string } = {}) => {
  ctl.stepReply = { answer, toolUses: Array.from({ length: opts.tools ?? 0 }, () => ({ name: 'Read', input: {} })) }
  const stream = $.turn.step({ turnId: 't1', index: 0, model: 'm', messageCount: 1, ...(opts.agentId ? { agentId: opts.agentId } : {}) })
  // ：generator 
  for (;;) {
    const it = await stream.next()
    if (it.done) return it.value
  }
}

export const endTurn = ($: Engine) =>
  $.turn.complete({ answer: 'ok', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer' })

// ：（）
export const stop = ($: Engine, extra: Partial<Parameters<Engine['classic']['Stop']>[0]> = {}) =>
  $.classic.Stop({ stop_hook_active: false, background_tasks: [], session_crons: [], ...extra })

export const NOTES = 'C:/Users/u/.claude/projects/C--proj/memory/ctx-handoff.md'
export const distillNow = ($: Engine) => cmd($, 'distill')

export const EXISTING = [
  '# ctx-handoff \u5c08\u6848\u7d93\u9a57',
  '',
  '## \u8a18\u61b6',
  '- [feedback] \u820a A',
  '- [project] \u820a B',
  '',
  '## \u898f\u5247',
  '',
  '### \u898f\u5247\u4e00（1 \u6b21）',
  '- \u898f\u5247：\u505a X',
  '- \u6839\u64da：1970-01-01 \u7b2c\u4e00\u6b21',
  '',
  '### \u898f\u5247\u4e8c（2 \u6b21）',
  '- \u898f\u5247：\u505a Y',
  '',
].join('\n')

export const CLAUDE_PROJECTS = 'C:/Users/u/.claude/projects'
export const ALPHA = 'D:/repos/alpha'
export const ALPHA_NOTES = `${CLAUDE_PROJECTS}/D--repos-alpha/memory/ctx-handoff.md`
export type World = ReturnType<typeof world>
//  D:/repos/<name>  .git  repo
export const repo = (w: World, dir: string) => { w.files.set(`${dir}/.git`, '') }
export const lastOf =(w: World) => w.get('distill:last:C--proj') as { changes: string[]; rejected: { count: number; samples: string[] } }

export const NOTES_PATH = 'C:/Users/u/.claude/projects/C--proj/memory/ctx-handoff.md'
export const pushGuard = (state: string, mode = 'deny') => ({
  id: 1, rule: '\u63a8\u9001\u524d\u5148\u8dd1 preflight', tool: 'Bash', match: 'git\\s+push', unless: 'preflight', message: '\u5148\u8dd1 preflight \u518d\u63a8',
  mode, state, at: 0,
})

// （AbovePrompt）；/handoff panel 
export const BAND_MOUNT = { plugin: 'ctx-handoff', surface: 'terminal' as const, component: 'AbovePrompt' as const,
  props: { hasSurvey: false, isCollapsed: false, isWorking: false, maxRows: 20, bodyColumns: 120, scroll: { offset: 0, bodyRows: 20 }, view: {} } }
// tab：（）
export const openPanel = async ($: Engine, tab?: string) => {
  await cmd($, 'panel')
  const ui = await $.ui.mount(BAND_MOUNT)
  if (tab) await ui.press({ key: `tab:${tab}` })
  return ui
}
export const PANEL_NOTES = ['# ctx-handoff \u5c08\u6848\u7d93\u9a57', '', '## \u8a18\u61b6', '- [project] \u820a\u7684\u8a18\u61b6', '- [feedback] \u4f7f\u7528\u8005\u8981\u6c42\u6bcf\u6b21\u90fd\u5148\u8dd1\u6e2c\u8a66', '', '## \u898f\u5247', '', '### \u63a8\u9001\u524d\u5148\u8dd1 preflight（3 \u6b21）', '- \u898f\u5247：\u5148\u8dd1 preflight'].join('\n')
