// ：、、fork 、、
import { expect, test } from 'claude-code/testing'
import { composer, cmd, say, endTurn, stop, NOTES, distillNow, EXISTING, CLAUDE_PROJECTS, ALPHA, ALPHA_NOTES, repo, lastOf, actionsReply, ctl, world } from './test-world'

// ---------- S6：、、 ----------

test('S6 \u4ea4\u63a5\u5931\u6557：\u8a18\u9304\u539f\u56e0、\u4e0b\u4e00\u5247\u4e0d\u91cd\u8a66、3 \u5247\u4e4b\u5f8c\u91cd\u8a66', async ($, on) => {
  let turns = 10
  const w = world(on, 650_000, 1_000_000, { distill: false }, [], () => turns)
  ctl.failHandoff = true
  await stop($)
  await w.clock.settle()
  expect(w.forks.length).toBe(1)
  const err = (w.get('handoff:error:C--proj')) as { reason: string; sessionId: string; turns: number; kind: string }
  expect(err.reason).toContain('\u7522\u751f\u5931\u6557')
  expect(err.sessionId).toBe('S1')
  expect(err.turns).toBe(10)
  expect(err.kind).toBe('present')
  expect((await cmd($, '')).text).toContain('\u6700\u8fd1\u5931\u6557')
  ctl.failHandoff = false
  turns = 11
  await stop($)
  await w.clock.settle()
  expect(w.forks.length).toBe(1)
  turns = 13
  await stop($)
  await w.clock.settle()
  expect(w.forks.length).toBe(2)
  expect(w.commands).toEqual(['clear'])
})

test('S6 \u4ea4\u63a5\u5931\u6557：\u6eff 10 \u5206\u9418\u4e5f\u6703\u91cd\u8a66', async ($, on) => {
  const w = world(on, 650_000, 1_000_000, { distill: false })
  ctl.failHandoff = true
  await stop($)
  await w.clock.settle()
  ctl.failHandoff = false
  await stop($)
  await w.clock.settle()
  expect(w.forks.length).toBe(1)
  await w.clock.advance(10 * 60_000)
  await stop($)
  await w.clock.settle()
  expect(w.forks.length).toBe(2)
  expect(w.commands).toEqual(['clear'])
})

test('S6 \u5169\u500b session \u5404\u5beb\u81ea\u5df1\u7684 pendingSubmit：\u7b2c\u4e8c\u500b\u6210\u529f\u53ea\u522a\u81ea\u5df1\u7684', async ($, on) => {
  const w = world(on, 650_000, 1_000_000, { distill: false })
  ctl.failSubmits = 1
  await stop($)
  await w.clock.settle()
  expect(w.get('pendingSubmit:S1')).toMatchObject({ project: 'C--proj' })
  ctl.curSid = 'S2'
  await cmd($, 'now')
  await w.clock.settle()
  expect(w.submits.length).toBe(1)
  expect(w.get('pendingSubmit:S2')).toBeUndefined()
  expect(w.get('pendingSubmit:S1')).toMatchObject({ project: 'C--proj' })
})

test('S6 \u6514\u4e0b\u8a0a\u606f＋/clear \u6210\u529f＋\u9001\u51fa\u5931\u6557：/handoff resend \u9001\u51fa handoff \u8207\u8a0a\u606f，\u522a\u6389 pending', async ($, on) => {
  const w = world(on, 650_000, 1_000_000, {}, [], 5)
  ctl.failSubmits = 1
  //  fork （：）
  ctl.handoffGate = async () => { await say($, '\u4e2d\u9014\u8a0a\u606f') }
  await stop($)
  await w.clock.settle()
  expect(w.submits).toEqual([])
  const pending = (w.get('pendingSubmit:S1') as { text: string }).text
  expect(pending).toContain('HANDOFF: \u6e2c\u8a66')
  expect(pending).toContain('\u4e2d\u9014\u8a0a\u606f')
  expect((await cmd($, '')).text).toContain('\u672a\u9001\u9054\u7684 handoff')
  await cmd($, 'resend')
  await w.clock.settle()
  expect(w.submits.length).toBe(1)
  expect(w.submits[0]).toContain('HANDOFF: \u6e2c\u8a66')
  expect(w.submits[0]).toContain('\u4e2d\u9014\u8a0a\u606f')
  expect(w.get('pendingSubmit:S1')).toBeUndefined()
  expect((await cmd($, '')).text).not.toContain('\u672a\u9001\u9054\u7684 handoff')
  // /clear ，resend  /clear
  expect(w.commands).toEqual(['clear'])
})

test('S6 \u65b0 process \u7684 resend：\u4e0d\u9001\u5225\u7684 session \u7684 pending；\u6709\u672c process \u7522\u751f\u7684 handoff \u624d\u91cd\u9001\u5b83', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, { 'pendingSubmit:OTHER': '\u5225\u7684 session \u7684\u6587\u5b57' })
  const r = await cmd($, 'resend')
  expect(r.text).toContain('\u6c92\u6709\u53ef\u4ee5\u91cd\u9001')
  await w.clock.settle()
  expect(w.submits).toEqual([])
  await cmd($, 'dry')
  await cmd($, 'resend')
  await w.clock.settle()
  expect(w.submits.length).toBe(1)
  expect(w.submits[0]).toContain('HANDOFF: \u6e2c\u8a66')
  expect(w.submits[0]).not.toContain('\u5225\u7684 session')
  expect(typeof (w.get('pendingSubmit:OTHER'))).toBe('string')
})

test('\u91cd\u555f\u5f8c\u53ef\u660e\u78ba\u6307\u5b9a\u4f86\u6e90session\u91cd\u9001\u672a\u9001\u9054\u4ea4\u63a5，\u6210\u529f\u5f8c\u624d\u522a', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, { 'pendingSubmit:OLD': { text: '\u4f86\u6e90\u4ea4\u63a5\u8207\u672a\u9001\u9054\u6587\u5b57', project: 'C--proj' } })
  ctl.failSubmits = 1
  await cmd($, 'resend OLD')
  await w.clock.settle()
  expect(w.get('pendingSubmit:OLD')).toBeDefined()
  await cmd($, 'resend OLD')
  await w.clock.settle()
  expect(w.submits).toEqual(['\u4f86\u6e90\u4ea4\u63a5\u8207\u672a\u9001\u9054\u6587\u5b57'])
  expect(w.get('pendingSubmit:OLD')).toBeUndefined()
  expect(w.commands).toEqual([])
})

test('\u660e\u78ba\u4f86\u6e90\u4e5f\u4e0d\u80fd\u91cd\u9001\u5176\u4ed6\u5de5\u4f5c\u5340\u7684pending', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, { 'pendingSubmit:OTHER': { text: '\u5176\u4ed6\u5de5\u4f5c\u5340\u5167\u5bb9', project: 'D--elsewhere' } })
  const r = await cmd($, 'resend OTHER')
  expect(r.text).toContain('\u6c92\u6709\u53ef\u4ee5\u91cd\u9001')
  await w.clock.settle()
  expect(w.submits).toEqual([])
  expect(w.get('pendingSubmit:OTHER')).toBeDefined()
})

// ---------- 、、、 ----------

const hang = () => new Promise<void>(() => {})
const gate = () => {
  let release: () => void = () => {}
  const wait = new Promise<void>(r => { release = r })
  return { wait: () => wait, release: () => release() }
}

test('\u4ea4\u63a5 fork \u5361\u4f4f：5 \u5206\u9418\u5f8c\u653e\u68c4\u4e26\u8a18\u9304，\u6514\u4e0b\u7684\u8a0a\u606f\u9001\u56de\u820a\u5c0d\u8a71，\u4e4b\u5f8c\u4e0d\u518d\u6514', async ($, on) => {
  const w = world(on, 650_000, 1_000_000, {}, [], 5)
  ctl.handoffGate = hang
  await stop($)
  await w.clock.advance(0)
  await say($, '\u7b49\u5f88\u4e45\u7684\u8a0a\u606f')
  expect(w.submits).toEqual([])
  await w.clock.advance(3 * 60_000)
  expect(w.submits).toEqual([])
  await w.clock.advance(2 * 60_000)
  expect(w.commands).toEqual([])
  expect(w.submits).toEqual(['\u7b49\u5f88\u4e45\u7684\u8a0a\u606f'])
  const err = w.get('handoff:error:C--proj') as { reason: string }
  expect(err.reason).toContain('timeout')
  await say($, '\u4e4b\u5f8c\u7684\u8a0a\u606f')
  expect(w.submits.at(-1)).toBe('\u4e4b\u5f8c\u7684\u8a0a\u606f')
})

test('\u4ea4\u63a5\u524d\u6574\u7406\u5f88\u6162：\u5c0d\u8a71\u7247\u6bb5\u5148\u8b80\u597d，handoff \u4e00\u597d\u5c31 /clear，\u4e0d\u7b49\u6574\u7406；\u6574\u7406\u4e4b\u5f8c\u7167\u6a23\u5beb\u6a94、\u4e0d\u6392\u5165', async ($, on) => {
  const w = world(on, 650_000, 1_000_000, {}, [], 5)
  const g = gate()
  ctl.distillGate = g.wait
  await stop($)
  await w.clock.advance(0)
  expect(w.commands).toEqual(['clear'])
  expect(w.submits[0]).toContain('HANDOFF: \u6e2c\u8a66')
  g.release()
  await w.clock.advance(0)
  expect(w.files.get(NOTES) ?? '').toContain('\u4f7f\u7528\u8005\u6c7a\u5b9a\u4ea4\u63a5\u9580\u6abb\u7dad\u6301 600k')
  await say($, '\u65b0\u5c0d\u8a71\u7b2c\u4e00\u5247')
  expect(w.contexts.at(-1)).toBeUndefined()
})

test('\u6574\u7406\u8acb\u6c42\u903e\u6642：\u624b\u52d5\u6574\u7406\u56de aborted \u4ecd\u8a18\u9304\u932f\u8aa4；\u9592\u7f6e\u6574\u7406\u903e\u6642\u5b89\u975c\u7565\u904e\u4e14\u7b2c 2、3 \u6b21\u5237\u65b0\u4e0d\u91cd\u8a66', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  ctl.completeAborts = true
  await endTurn($)
  await w.clock.advance(55 * 60_000)
  expect(w.completes.length).toBe(1)
  expect(w.completes[0]?.timeoutMs).toBe(8 * 60_000)
  expect(w.get('distill:error:C--proj')).toBeUndefined()
  await w.clock.advance(55 * 60_000)
  expect(w.completes.length).toBe(1)
  await distillNow($)
  expect(w.completes.length).toBe(2)
  const err = w.get('distill:error:C--proj') as { reason: string }
  expect(err.reason).toContain('timeout')
  ctl.completeAborts = false
  await distillNow($)
  expect(w.files.get(NOTES) ?? '').toContain('\u4f7f\u7528\u8005\u6c7a\u5b9a\u4ea4\u63a5\u9580\u6abb\u7dad\u6301 600k')
})

test('\u4ea4\u63a5\u671f\u9593：\u63d0\u793a\u5beb\u51fa\u5df2\u9032\u884c\u79d2\u6578；\u76f8\u540c\u8a0a\u606f\u53ea\u66ab\u5b58\u4e00\u6b21；\u53ea\u6709\u5716\u7247\u7684\u8a0a\u606f\u4e0d\u66ab\u5b58\u4e26\u63d0\u793a\u91cd\u8cbc', async ($, on) => {
  const w = world(on, 650_000, 1_000_000, {}, [], 5)
  const g = gate()
  ctl.handoffGate = g.wait
  await stop($)
  await w.clock.advance(0)
  await w.clock.advance(5_000)
  const r1 = await say($, '\u540c\u4e00\u5247')
  expect(JSON.stringify(r1)).toContain('\u5df2\u9032\u884c 5 \u79d2')
  const r2 = await say($, ' \u540c\u4e00\u5247 ')
  expect(JSON.stringify(r2)).toContain('\u4e0d\u6703\u91cd\u8907\u9001\u51fa')
  const r3 = await $.prompt.submit({ text: '', attachments: [{ type: 'image', mediaType: 'image/png' }], origin: composer, wait: false })
  expect(JSON.stringify(r3)).toContain('\u91cd\u65b0\u8cbc\u4e0a')
  const r4 = await $.prompt.submit({ text: '\u9644\u5716\u7684\u8a0a\u606f', attachments: [{ type: 'image' }], origin: composer, wait: false })
  expect(JSON.stringify(r4)).toContain('\u5df2\u66ab\u5b58')
  expect(JSON.stringify(r4)).toContain('\u91cd\u65b0\u8cbc\u4e0a')
  g.release()
  await w.clock.advance(0)
  expect(w.submits.length).toBe(1)
  expect((w.submits[0] ?? '').split('\u540c\u4e00\u5247').length - 1).toBe(1)
  expect(w.submits[0]).toContain('\u9644\u5716\u7684\u8a0a\u606f')
})

test('\u96e2\u5e2d：\u53ea\u6709\u5716\u7247\u7684\u7b2c\u4e00\u5247\u8a0a\u606f\u4e0d\u8a18\u6210\u6514\u4e0b\u7684\u8a0a\u606f，\u63d0\u793a\u5148\u9078\u64c7\u518d\u91cd\u8cbc', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, { 'away:S1': { handoff: 'H' } })
  const r = await $.prompt.submit({ text: '', attachments: [{ type: 'image' }], origin: composer, wait: false })
  expect(JSON.stringify(r)).toContain('\u91cd\u65b0\u8cbc\u4e0a')
  expect(w.get('away:S1')).toEqual({ handoff: 'H' })
})

test('\u4e1f\u68c4\u6a23\u672c\u5beb\u51fa\u539f\u56e0：\u820a\u683c\u5f0f\u7de8\u865f、\u4e0d\u8a8d\u5f97\u7684 op、type \u7121\u6548', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  w.files.set(NOTES, EXISTING)
  ctl.distillReply = actionsReply(
    { op: 'delete_memory', id: 'P1-M1', reason: 'x' },
    { op: 'move_memory', id: 'M1', project: 'P2' },
    { op: 'add_memory', type: 'misc', text: 'y' },
  )
  await distillNow($)
  const { rejected } = lastOf(w)
  expect(rejected.count).toBe(3)
  expect(rejected.samples[0]).toStartWith('id \u4e0d\u662f M#：')
  expect(rejected.samples[1]).toStartWith('\u4e0d\u8a8d\u5f97\u7684 op（move_memory）：')
  expect(rejected.samples[2]).toStartWith('type \u7121\u6548（misc）：')
  expect(w.files.get(NOTES) ?? '').toContain('- [feedback] \u820a A')
})

test('Bash cd \u9032\u5225\u7684 repo：P1 \u8207 store \u7684\u5c08\u6848\u9375\u4ecd\u662f session \u555f\u52d5\u8cc7\u6599\u593e', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  w.files.set(ALPHA_NOTES, EXISTING)
  repo(w, ALPHA)
  // $.session.repo() ：cd  alpha  alpha
  ctl.curRepo = { root: ALPHA, remote: null, internal: false, name: 'alpha' }
  ctl.curCwd = ALPHA
  await distillNow($)
  expect(w.files.get(NOTES) ?? '').toContain('\u4f7f\u7528\u8005\u6c7a\u5b9a\u4ea4\u63a5\u9580\u6abb\u7dad\u6301 600k')
  expect(w.files.get(ALPHA_NOTES)).toBe(EXISTING)
  expect(w.get('distill:last:C--proj')).toBeDefined()
  expect(w.get('distill:last:D--repos-alpha')).toBeUndefined()
})

test('/handoff resume \u6642 /clear \u5931\u6557：\u96e2\u5e2d handoff \u8207\u6514\u4e0b\u7684\u8a0a\u606f\u653e\u56de\u53bb，\u53ef\u4ee5\u518d\u9078', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, { 'away:S1': { handoff: 'H', held: '\u56de\u4f86\u7684\u8a0a\u606f' } })
  ctl.onClear = () => { throw new Error('clear boom') }
  await cmd($, 'resume')
  await w.clock.advance(0)
  expect(w.submits).toEqual([])
  expect(w.get('away:S1')).toEqual({ handoff: 'H', held: '\u56de\u4f86\u7684\u8a0a\u606f' })
})

test('\u7591\u4f3c\u91d1\u9470\u7528 JSON \u8df3\u812b\u5beb\u6cd5：\u4ecd\u6574\u884c\u4e1f\u68c4，\u6a23\u672c\u8207\u72c0\u614b\u90fd\u4e0d\u5e36\u5167\u5bb9', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  ctl.distillReply = actionsReply('{"op":"add_memory","type":"user","text":"db \\u0073ecret= hunter2-PLAINTEXT"}')
  const r = await distillNow($)
  const last = lastOf(w)
  expect(last.rejected.samples).toEqual(['\u7591\u4f3c\u91d1\u9470：（\u5167\u5bb9\u4e0d\u8a18\u9304）'])
  expect(JSON.stringify(last)).not.toContain('hunter2')
  expect(r.text).not.toContain('hunter2')
  expect(w.files.get(NOTES) ?? '').not.toContain('hunter2')
})

test('\u5f9e git worktree \u555f\u52d5：\u7d93\u9a57\u6a94\u8207\u5c08\u6848\u9375\u8ddf\u8457\u4e3b\u5de5\u4f5c\u6a39', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  const MAIN_NOTES = `${CLAUDE_PROJECTS}/D--main/memory/ctx-handoff.md`
  w.files.set('C:/proj/.git', 'gitdir: D:/main/.git/worktrees/feat\n')
  w.files.set(MAIN_NOTES, EXISTING)
  await distillNow($)
  expect(w.files.get(MAIN_NOTES) ?? '').toContain('\u4f7f\u7528\u8005\u6c7a\u5b9a\u4ea4\u63a5\u9580\u6abb\u7dad\u6301 600k')
  expect(w.files.get(NOTES)).toBeUndefined()
  expect(w.get('distill:last:D--main')).toBeDefined()
})

test('\u5de2\u72c0\u503c\u88e1\u7684\u7591\u4f3c\u91d1\u9470：\u6574\u884c\u4e1f\u68c4，\u6a23\u672c\u4e0d\u5e36\u5167\u5bb9', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  ctl.distillReply = actionsReply(
    '{"op":"add_memory","type":"bad","meta":{"k":"\\u0073k-HUNTER2XYZ"}}',
    '{"op":"add_memory","type":"user","text":["\\u0073ecret= hunter3"]}',
  )
  await distillNow($)
  const last = lastOf(w)
  expect(last.rejected.samples).toEqual(['\u7591\u4f3c\u91d1\u9470：（\u5167\u5bb9\u4e0d\u8a18\u9304）', '\u7591\u4f3c\u91d1\u9470：（\u5167\u5bb9\u4e0d\u8a18\u9304）'])
  expect(JSON.stringify(last)).not.toContain('HUNTER2')
  expect(JSON.stringify(last)).not.toContain('hunter3')
})

test('worktree \u7684 gitdir \u662f\u76f8\u5c0d\u8def\u5f91：\u4ecd\u5c0d\u5230\u4e3b\u5de5\u4f5c\u6a39', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  const MAIN_NOTES = `${CLAUDE_PROJECTS}/C--main/memory/ctx-handoff.md`
  w.files.set('C:/proj/.git', 'gitdir: ../main/.git/worktrees/feat\r\n')
  w.files.set(MAIN_NOTES, EXISTING)
  await distillNow($)
  expect(w.files.get(MAIN_NOTES) ?? '').toContain('\u4f7f\u7528\u8005\u6c7a\u5b9a\u4ea4\u63a5\u9580\u6abb\u7dad\u6301 600k')
  expect(w.get('distill:last:C--main')).toBeDefined()
})
