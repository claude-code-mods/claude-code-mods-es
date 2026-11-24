// ： set_progress、 $.store、
import { expect, test } from 'claude-code/testing'
import type { Engine } from 'claude-code/testing'
import { latestProgress, parseActions } from './distill'
import { parseNotes } from './notes'
import { PROGRESS_TOTAL_MAX, agoText, progressOffer } from './progress'
import type { Progress } from './progress'
import { DAY, NOTE_TAG, NOTES, actionsReply, cmd, ctl, distillNow, say, stop, world } from './test-world'

const HOUR = 60 * 60_000
const PROGRESS = {
  op: 'set_progress', task: '\u4fee\u597d\u767b\u5165\u9801\u7684\u903e\u6642', state: 'in_progress', verified: 'npm test：12 \u9805\u901a\u904e',
  next: '\u88dc refresh token \u904e\u671f\u7684\u6e2c\u8a66', files: ['src/auth/login.ts', 'src/auth/login.test.ts'],
}
const KEY = 'progress:C--proj'
//  session（S0），at=0（mock  0 ）
const OLD: Progress = { sid: 'S0', at: 0, task: '\u642c\u8cc7\u6599\u5eab\u8a2d\u5b9a', state: 'blocked', next: '\u7b49\u4f7f\u7528\u8005\u7d66\u9023\u7dda\u5b57\u4e32', files: ['config/db.ts'] }
const blockOf = async ($: Engine) => (await $.prompt.context({ blocks: [] })).blocks.find(b => b.name === 'ctxHandoffProgress')?.text

// ----------  ----------

const parse = (...lines: (string | object)[]) => parseActions(actionsReply(...lines), parseNotes(''))

test('set_progress：\u6709\u6548\u7684\u6536\u4e0b；done \u53ef\u4ee5\u6c92\u6709\u4e0b\u4e00\u6b65；\u540c\u4e00\u6279\u53d6\u6700\u5f8c\u4e00\u500b\u6709\u6548\u7684', () => {
  const ok = parse(PROGRESS)
  expect(ok.rejected.count).toBe(0)
  expect(latestProgress(ok.actions)).toEqual({
    task: PROGRESS.task, state: 'in_progress', verified: PROGRESS.verified, next: PROGRESS.next, files: PROGRESS.files,
  })
  expect(latestProgress(parse({ op: 'set_progress', task: '\u767c\u7248', state: 'done' }).actions)).toEqual({ task: '\u767c\u7248', state: 'done', files: [] })
  const two = parse(PROGRESS, { ...PROGRESS, task: '\u7b2c\u4e8c\u500b' }, { ...PROGRESS, task: '\u58de\u7684', state: '??' })
  expect(latestProgress(two.actions)?.task).toBe('\u7b2c\u4e8c\u500b')
  expect(two.rejected.count).toBe(1)
  expect(latestProgress(parse().actions)).toBeUndefined()
})

test('set_progress：\u7f3a\u6b04\u4f4d、\u72c0\u614b\u7121\u6548、files \u6216 decisions \u4e0d\u662f\u6e05\u55ae、\u7591\u4f3c\u91d1\u9470\u90fd\u6574\u884c\u4e1f\u68c4', () => {
  const bad = (o: object) => {
    const r = parse({ ...PROGRESS, ...o })
    expect(latestProgress(r.actions)).toBeUndefined()
    return r.rejected
  }
  expect(bad({ task: undefined }).count).toBe(1)
  expect(bad({ next: undefined }).count).toBe(1)
  expect(bad({ state: 'finished' }).samples[0]).toContain('finished')
  expect(bad({ files: 'src/a.ts' }).samples[0]).toContain('files')
  expect(bad({ decisions: '\u5148\u7528 build \u6a23\u5f0f' }).samples[0]).toContain('decisions')
  expect(bad({ task: '\u6539 api_key=abc123 \u7684\u8b80\u6cd5' }).samples[0]).not.toContain('abc123')
})

// 2026-10-09 ： 80–120 、 600 ；
test('set_progress：\u6b04\u4f4d\u4e0d\u518d\u5404\u81ea\u8a2d\u4e0a\u9650，\u53ea\u6709\u6574\u4efd\u8d85\u904e\u9632\u5931\u63a7\u7684\u4e0a\u9650\u624d\u4e1f\u68c4；\u9019\u4ef6\u5de5\u4f5c\u7684\u6c7a\u5b9a\u4e00\u8d77\u5e36', () => {
  const long = { task: 'a'.repeat(300), verified: 'b'.repeat(800), next: 'c'.repeat(300), decisions: ['\u5148\u7528 build \u6a23\u5f0f', 'PR #817 \u5148\u653e\u8457'], files: Array.from({ length: 12 }, (_, i) => `src/f${i}.ts`) }
  const ok = parse({ ...PROGRESS, ...long })
  expect(ok.rejected.count).toBe(0)
  expect(latestProgress(ok.actions)?.decisions).toEqual(['\u5148\u7528 build \u6a23\u5f0f', 'PR #817 \u5148\u653e\u8457'])
  const over = parse({ ...PROGRESS, verified: 'x'.repeat(PROGRESS_TOTAL_MAX) })
  expect(over.rejected.samples[0]).toContain(String(PROGRESS_TOTAL_MAX))
  expect(progressOffer({ ...OLD, decisions: ['\u5148\u7528 build \u6a23\u5f0f'] }, 'S1', HOUR)).toContain('\u9019\u4ef6\u5de5\u4f5c\u7684\u6c7a\u5b9a：\u5148\u7528 build \u6a23\u5f0f')
})

test('\u63d0\u4f9b\u7684\u689d\u4ef6：\u4e0d\u540c session、7 \u5929\u5167（\u8de8\u9031\u672b）、\u6c92\u4ea4\u63a5、\u9084\u6c92\u63d0\u4f9b\u904e', () => {
  const p: Progress = { ...OLD, at: 1000 }
  expect(progressOffer(p, 'S1', 1000 + HOUR)).toContain('1 \u5c0f\u6642\u524d')
  expect(progressOffer(p, 'S0', 1000 + HOUR)).toBeUndefined()
  expect(progressOffer(p, 'S1', 1000 + 3 * DAY)).toContain('3 \u5929\u524d')
  expect(progressOffer(p, 'S1', 1000 + 7 * DAY)).toBeDefined()
  expect(progressOffer(p, 'S1', 1000 + 7 * DAY + 1)).toBeUndefined()
  expect(progressOffer({ ...p, handed: true }, 'S1', 2000)).toBeUndefined()
  expect(progressOffer({ ...p, offered: ['S1'] }, 'S1', 2000)).toBeUndefined()
  expect(progressOffer({ ...p, offered: ['S1'] }, 'S2', 2000)).toBeDefined()
  expect(progressOffer(undefined, 'S1', 2000)).toBeUndefined()
  expect([0, 20_000, 5 * 60_000, 59 * 60_000, 90 * 60_000, 23 * HOUR, 24 * HOUR, 72 * HOUR].map(agoText)).toEqual(['\u525b\u624d', '\u525b\u624d', '5 \u5206\u9418\u524d', '59 \u5206\u9418\u524d', '2 \u5c0f\u6642\u524d', '23 \u5c0f\u6642\u524d', '1 \u5929\u524d', '3 \u5929\u524d'])
})

// ----------  ----------

test('\u6574\u7406：\u5b58\u5728\u5de5\u4f5c\u5340\u7684\u9375（session、\u6642\u9593、\u5167\u5bb9），\u4e0d\u5beb\u9032\u7d93\u9a57\u6a94、\u4e0d\u7b97\u8b8a\u52d5、\u4e0d\u8df3 toast', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  ctl.distillReply = actionsReply(PROGRESS)
  await w.clock.advance(5000)
  await distillNow($)
  const { op: _op, ...fields } = PROGRESS
  expect(w.get(KEY)).toEqual({ ...fields, sid: 'S1', at: 5000 })
  expect(w.files.get(NOTES)).toBeUndefined()
  expect(lastChanges(w)).toEqual([])
  expect(w.toasts).toEqual([])
})

const lastChanges = (w: ReturnType<typeof world>) => (w.get('distill:last:C--proj') as { changes: string[] }).changes

test('\u6574\u7406：\u5de5\u4f5c\u5340\u4e0d\u540c、\u9375\u5c31\u4e0d\u540c（\u5f9e git worktree \u555f\u52d5\u7b97\u4e3b\u5de5\u4f5c\u6a39）', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  ctl.curRoot = 'D:/repos/alpha'
  ctl.distillReply = actionsReply(PROGRESS)
  await distillNow($)
  expect(w.get('progress:D--repos-alpha')).toBeDefined()
  expect(w.get(KEY)).toBeUndefined()
})

test('\u6574\u7406：\u6a21\u578b\u6c92\u8f38\u51fa set_progress \u6216\u8f38\u51fa\u7121\u6548\u7684，\u524d\u4e00\u4efd\u9032\u5ea6\u4fdd\u7559；\u6709\u65b0\u7684\u5c31\u6574\u4efd\u53d6\u4ee3', async ($, on) => {
  let turns = 5
  const w = world(on, 100_000, 1_000_000, { [KEY]: { ...OLD, offered: ['S9'] } }, [], () => turns)
  const round = async (reply: string) => { turns += 5; ctl.distillReply = reply; await distillNow($) }
  await round(actionsReply())
  expect(w.completes.length).toBe(1)
  expect(w.get(KEY)).toEqual({ ...OLD, offered: ['S9'] })
  await round(actionsReply({ ...PROGRESS, state: 'bad' }))
  expect(w.completes.length).toBe(2)
  expect(w.get(KEY)).toEqual({ ...OLD, offered: ['S9'] })
  await round(actionsReply(PROGRESS))
  const saved = w.get(KEY) as Progress
  expect(saved.task).toBe(PROGRESS.task)
  expect(saved.sid).toBe('S1')
  expect(saved.offered).toBeUndefined()
})

test('\u6574\u7406\u63d0\u793a：\u9644\u4e0a\u76ee\u524d\u7684\u9032\u5ea6\u8b93\u6a21\u578b\u63a5\u8457\u66f4\u65b0；\u6c92\u6709\u5c31\u5beb（\u7121）；7 \u5929\u5167\u8de8\u9031\u672b\u4fdd\u7559、\u8d85\u904e 7 \u5929\u7576\u4f5c\u6c92\u6709', async ($, on) => {
  let turns = 5
  const w = world(on, 100_000, 1_000_000, {}, [], () => turns)
  ctl.distillReply = actionsReply(PROGRESS)
  await distillNow($)
  expect(w.completes[0]?.system).toContain('\u76ee\u524d\u7684\u9032\u5ea6：（\u7121）')
  expect(w.completes[0]?.system).toContain('set_progress')
  turns += 5
  await distillNow($)
  expect(w.completes[1]?.system).toContain(`\u76ee\u524d\u7684\u9032\u5ea6：\u525b\u624d：\u4efb\u52d9「${PROGRESS.task}」`)
  await w.clock.advance(3 * DAY)
  turns += 5
  await distillNow($)
  expect(w.completes[2]?.system).toContain(`\u76ee\u524d\u7684\u9032\u5ea6：3 \u5929\u524d：\u4efb\u52d9「${PROGRESS.task}」`)
  await w.clock.advance(8 * DAY)
  turns += 5
  await distillNow($)
  expect(w.completes[3]?.system).toContain('\u76ee\u524d\u7684\u9032\u5ea6：（\u7121）')
})

// ----------  ----------

test('\u4e0d\u540c session、24 \u5c0f\u6642\u5167：\u958b\u982d\u63d0\u4f9b\u4e00\u6b21（\u76f8\u5c0d\u6642\u9593、\u4efb\u52d9、\u72c0\u614b、\u9a57\u8b49、\u4e0b\u4e00\u6b65、\u6a94\u6848）', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, { [KEY]: { ...OLD, verified: '\u8dd1\u904e migrate \u4e7e\u8dd1' } })
  await w.clock.advance(2 * HOUR)
  const text = await blockOf($)
  expect(text).toBe([
    `${NOTE_TAG} \u4e0a\u4e00\u6bb5\u5c0d\u8a71（2 \u5c0f\u6642\u524d）\u505c\u5728：\u4efb\u52d9「\u642c\u8cc7\u6599\u5eab\u8a2d\u5b9a」、\u72c0\u614b\u5361\u4f4f\u4e86、\u6700\u5f8c\u9a57\u8b49：\u8dd1\u904e migrate \u4e7e\u8dd1、\u4e0b\u4e00\u6b65：\u7b49\u4f7f\u7528\u8005\u7d66\u9023\u7dda\u5b57\u4e32、\u76f8\u95dc\u6a94\u6848：config/db.ts。`,
    '\u9019\u662f\u80cc\u666f\u6574\u7406\u7559\u4e0b\u7684\u7c21\u77ed\u5099\u5fd8，\u53ef\u80fd\u843d\u5f8c\u5e7e\u5247\u8a0a\u606f。\u4f7f\u7528\u8005\u8981\u63a5\u7e8c\u6642\u4ee5\u6b64\u70ba\u8d77\u9ede，\u52d5\u624b\u524d\u5148\u770b\u5be6\u969b\u7684\u6a94\u6848\u8207 git \u72c0\u614b；\u4f7f\u7528\u8005\u5728\u505a\u5225\u7684\u4e8b\u5c31\u5ffd\u7565，\u4e0d\u8981\u4e3b\u52d5\u63d0\u8d77。',
  ].join('\n'))
  //  prompt.context ，
  expect((await $.prompt.context({ blocks: [{ name: 'currentDate', text: 'today' }] })).blocks.map(b => b.name)).toEqual(['currentDate'])
})

test('\u540c\u4e00\u6bb5\u5c0d\u8a71\u53ea\u63d0\u4f9b\u4e00\u6b21（compaction \u5f8c prompt.context \u91cd\u7b97\u4e5f\u4e0d\u91cd\u8907）；\u53e6\u4e00\u6bb5\u65b0\u5c0d\u8a71\u9084\u662f\u6703\u63d0\u4f9b', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, { [KEY]: OLD })
  expect(await blockOf($)).toContain('\u642c\u8cc7\u6599\u5eab\u8a2d\u5b9a')
  expect(await blockOf($)).toBeUndefined()
  expect((w.get(KEY) as Progress).offered).toEqual(['S1'])
  ctl.curSid = 'S2'
  expect(await blockOf($)).toContain('\u642c\u8cc7\u6599\u5eab\u8a2d\u5b9a')
  expect((w.get(KEY) as Progress).offered).toEqual(['S1', 'S2'])
})

for (const [reason, progress, age] of [
  ['\u8d85\u904e 7 \u5929', OLD, 7 * DAY + 1],
  ['\u540c\u4e00\u500b session \u7559\u4e0b\u7684', { ...OLD, sid: 'S1' }, 0],
  ['\u5df2\u4ea4\u63a5\u7684', { ...OLD, handed: true }, 0],
] as const) {
  test(`\u4e0d\u63d0\u4f9b：${reason}，\u4e0d\u662f\u56e0\u70ba\u5df2\u63d0\u4f9b\u904e`, async ($, on) => {
    const w = world(on, 100_000, 1_000_000, { [KEY]: progress })
    await w.clock.advance(age)
    expect(await blockOf($)).toBeUndefined()
    expect(w.get(KEY)).toEqual(progress)
  })
}

test('\u8a2d\u5b9a resume_hint \u95dc\u9589：\u4e0d\u63d0\u4f9b，\u4e5f\u4e0d\u8a18\u6210\u5df2\u63d0\u4f9b', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, { [KEY]: OLD })
  ctl.pluginOptions = { resume_hint: false }
  expect(await blockOf($)).toBeUndefined()
  expect(w.get(KEY)).toEqual(OLD)
  expect((await cmd($, '')).text).toContain('resume_hint \u5df2\u95dc')
})

test('\u9762\u677f\u6539 resume_hint：\u6539\u56de\u958b\u555f\u5f8c，\u4e0b\u4e00\u5247\u8a0a\u606f\u8d77\u5c31\u63d0\u4f9b', async ($, on) => {
  world(on, 100_000, 1_000_000, { [KEY]: OLD })
  ctl.panelSettings = { resume_hint: false }
  expect(await blockOf($)).toBeUndefined()
  ctl.panelSettings = { resume_hint: true }
  await say($, '\u7e7c\u7e8c')
  expect(await blockOf($)).toContain('\u642c\u8cc7\u6599\u5eab\u8a2d\u5b9a')
})

// ---------- /clear  ----------

test('\u4f7f\u7528\u8005\u81ea\u5df1 /clear：session id \u63db\u4e86，\u525b\u6574\u7406\u51fa\u4f86\u7684\u9032\u5ea6\u5728\u65b0\u5c0d\u8a71\u958b\u982d\u63d0\u4f9b', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  ctl.distillReply = actionsReply(PROGRESS)
  await distillNow($)
  expect(await blockOf($)).toBeUndefined()
  // ：
  ctl.curSid = 'S2'
  await w.clock.advance(10 * 60_000)
  const text = await blockOf($)
  expect(text).toContain('\u4e0a\u4e00\u6bb5\u5c0d\u8a71（10 \u5206\u9418\u524d）\u505c\u5728：\u4efb\u52d9「\u4fee\u597d\u767b\u5165\u9801\u7684\u903e\u6642」、\u72c0\u614b\u9032\u884c\u4e2d')
  expect(text).toContain('\u6700\u5f8c\u9a57\u8b49：npm test：12 \u9805\u901a\u904e')
  expect(text).toContain('\u4e0b\u4e00\u6b65：\u88dc refresh token \u904e\u671f\u7684\u6e2c\u8a66')
  expect(text).toContain('\u76f8\u95dc\u6a94\u6848：src/auth/login.ts、src/auth/login.test.ts')
})

test('\u81ea\u52d5\u4ea4\u63a5 /clear：handoff \u6458\u8981\u5df2\u6db5\u84cb，\u65b0\u5c0d\u8a71\u4e0d\u518d\u63d0\u4f9b\u9032\u5ea6', async ($, on) => {
  const w = world(on, 650_000, 1_000_000, {}, [], 5)
  ctl.distillReply = actionsReply(PROGRESS)
  ctl.onClear = () => { ctl.curSid = 'S2' }
  await stop($)
  await w.clock.advance(0)
  expect(w.commands).toEqual(['clear'])
  expect(w.submits[0]).toContain('HANDOFF: \u6e2c\u8a66')
  expect((w.get(KEY) as Progress).task).toBe(PROGRESS.task)
  expect((w.get(KEY) as Progress).handed).toBe(true)
  expect(await blockOf($)).toBeUndefined()
  //  S2 ，
  ctl.curSid = 'S3'
  expect(await blockOf($)).toBeUndefined()
})

// ：/clear ，、 session ，
test('\u81ea\u52d5\u4ea4\u63a5：\u6574\u7406\u6162，/clear \u4e4b\u5f8c\u624d\u8dd1\u5b8c：\u5b58\u6210\u6700\u65b0\u9032\u5ea6\u4f46\u6a19\u8a18\u5df2\u4ea4\u63a5，\u4e0d\u63d0\u4f9b', async ($, on) => {
  //  session 
  const w = world(on, 650_000, 1_000_000, { [KEY]: { ...PROGRESS, task: '\u66f4\u65e9\u7684\u4efb\u52d9', sid: 'S0', at: 0 } }, [], 5)
  let release: () => void = () => {}
  const wait = new Promise<void>(r => { release = r })
  ctl.distillGate = () => wait
  ctl.distillReply = actionsReply(PROGRESS)
  ctl.onClear = () => { ctl.curSid = 'S2' }
  await stop($)
  await w.clock.advance(0)
  expect(w.commands).toEqual(['clear'])
  release()
  await w.clock.advance(0)
  expect((w.get(KEY) as Progress).task).toBe(PROGRESS.task)
  expect((w.get(KEY) as Progress).handed).toBe(true)
  expect(await blockOf($)).toBeUndefined()
})

test('\u81ea\u52d5\u4ea4\u63a5\u6642 /clear \u5931\u6557：\u9084\u539f\u4ea4\u63a5\u6a19\u8a18，\u4e4b\u5f8c\u958b\u7684\u65b0\u5c0d\u8a71\u4ecd\u6703\u63d0\u4f9b', async ($, on) => {
  const w = world(on, 650_000, 1_000_000, {}, [], 5)
  ctl.distillReply = actionsReply(PROGRESS)
  ctl.onClear = () => { throw new Error('clear boom') }
  await stop($)
  await w.clock.advance(0)
  expect(w.submits).toEqual([])
  expect((w.get(KEY) as Progress).handed).toBeUndefined()
  ctl.curSid = 'S2'
  expect(await blockOf($)).toContain(PROGRESS.task)
})

// ----------  ----------

test('/handoff \u72c0\u614b：\u986f\u793a\u6700\u8fd1\u4e00\u4efd\u9032\u5ea6（\u6642\u9593\u8207\u4efb\u52d9）；\u6c92\u6709\u5c31\u4e0d\u986f\u793a', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  expect((await cmd($, '')).text).not.toContain('\u6700\u8fd1\u9032\u5ea6')
  ctl.distillReply = actionsReply(PROGRESS)
  await distillNow($)
  const line = ((await cmd($, ''))?.text ?? '').split(/\r?\n/).find(l => l.startsWith('\u6700\u8fd1\u9032\u5ea6：')) ?? ''
  expect(line).toContain('\u4fee\u597d\u767b\u5165\u9801\u7684\u903e\u6642（\u9032\u884c\u4e2d）')
  expect(line).not.toContain('resume_hint')
  expect(w.get(KEY)).toBeDefined()
})

// 2026-10-09 ： CLAUDE.md ，
test('\u6574\u7406\u63d0\u793a：\u9644\u4e0a\u5de5\u4f5c\u5340\u8207\u4f7f\u7528\u8005\u7684 CLAUDE.md，\u8b93\u6574\u7406\u77e5\u9053\u54ea\u4e9b\u4e0d\u7528\u518d\u8a18', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  w.files.set('C:/proj/CLAUDE.md', '# \u5c08\u6848\u6307\u5f15\n- \u63a8\u9001\u524d\u5148\u8dd1 check')
  w.files.set('C:/Users/u/.claude/CLAUDE.md', '# \u5168\u57df\n- Bash \u6703\u5403\u6389\u53cd\u659c\u7dda')
  await distillNow($)
  const system = w.completes[0]?.system ?? ''
  expect(system).toContain('--- \u5de5\u4f5c\u5340：C:/proj/CLAUDE.md ---\n# \u5c08\u6848\u6307\u5f15\n- \u63a8\u9001\u524d\u5148\u8dd1 check')
  expect(system).toContain('--- \u4f7f\u7528\u8005：C:/Users/u/.claude/CLAUDE.md ---\n# \u5168\u57df\n- Bash \u6703\u5403\u6389\u53cd\u659c\u7dda')
})

test('\u6574\u7406\u63d0\u793a：\u6c92\u6709 CLAUDE.md \u5c31\u5beb（\u7121）', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  await distillNow($)
  expect(w.completes[0]?.system).toContain('\u5df2\u6709\u7684\u6307\u5f15（\u5c08\u6848\u8207\u4f7f\u7528\u8005\u7684 CLAUDE.md；\u65b0\u5c0d\u8a71\u672c\u4f86\u5c31\u6703\u8b80\u5230）：\n（\u7121）')
})
