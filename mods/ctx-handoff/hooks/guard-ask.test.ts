// （ 2026-10-09 ）：，，
//  AI ，
import { expect, test } from 'claude-code/testing'
import type { Engine } from 'claude-code/testing'
import { NOTES, actionsReply, ctl, distillNow, pushGuard, say, startSession, world } from './test-world'

//  CLAUDE.md  3 ，（4 ）
const NOTES_ESCALATED = [
  '# ctx-handoff \u5c08\u6848\u7d93\u9a57', '', '## \u8a18\u61b6', '', '## \u898f\u5247', '',
  '### \u63a8\u9001\u524d\u5148\u8dd1 preflight（4 \u6b21）', '- \u898f\u5247：git push \u524d\u5148\u8dd1 preflight', '- \u5c08\u6848：\u5df2\u5728 CLAUDE.md（\u7b2c 3 \u6b21\u6642）', '',
].join('\n')
const DRAFT = { rule: '\u63a8\u9001\u524d\u5148\u8dd1 preflight', tool: 'Bash', match: 'git\\s+push', unless: 'preflight', mode: 'remind', message: '\u5148\u8dd1 preflight \u518d\u63a8', bad: 'git push origin main', good: 'node cli.mjs preflight && git push' }
const askOf = async ($: Engine) => (await $.prompt.context({ blocks: [] })).blocks.find(b => b.name === 'ctxHandoffGuardAsk')?.text
const guardsOf = (w: ReturnType<typeof world>) => (w.get('guards:C--proj') ?? []) as { id: number; state: string }[]

test('\u5b88\u9580\u5347\u7d1a：\u653e\u9032 repo \u4e4b\u5f8c\u53c8\u88ab\u7cfe\u6b63\u7684\u898f\u5247，\u6574\u7406\u5b8c\u80cc\u666f\u8d77\u8349\u5b88\u9580；\u6b21\u6578\u6c92\u518d\u589e\u52a0\u5c31\u4e0d\u91cd\u8d77\u8349', async ($, on) => {
  let turns = 5
  const w = world(on, 100_000, 1_000_000, {}, [], () => turns)
  w.files.set(NOTES, NOTES_ESCALATED)
  let calls = 0
  ctl.onComplete = () => { ctl.distillReply = ++calls === 2 ? actionsReply(DRAFT) : actionsReply() }
  await distillNow($)
  expect(w.completes.length).toBe(2)
  expect(w.completes[1]?.system).toContain('### \u63a8\u9001\u524d\u5148\u8dd1 preflight')
  expect(guardsOf(w)).toMatchObject([{ id: 1, state: 'proposed' }])
  expect(w.get('guardTried:C--proj')).toEqual({ '\u63a8\u9001\u524d\u5148\u8dd1 preflight': 4 })
  // ：，
  w.put('guards:C--proj', [])
  turns = 6
  await w.clock.advance(60_000)
  await distillNow($)
  // ，
  expect(w.completes.length).toBe(3)
})

test('\u5b88\u9580\u5347\u7d1a：\u6574\u7406\u5b8c\u6210\u524d\u63db session，\u81ea\u52d5\u8d77\u8349\u8207\u6574\u7406\u7684\u7528\u91cf\u90fd\u6b78\u4f86\u6e90 session', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  w.files.set(NOTES, NOTES_ESCALATED)
  let calls = 0
  ctl.onComplete = () => {
    calls += 1
    ctl.distillReply = calls === 2 ? actionsReply(DRAFT) : actionsReply()
    if (calls === 1) ctl.curSid = 'S2'
  }
  await distillNow($)
  expect(w.completes.length).toBe(2)
  expect(guardsOf(w)).toMatchObject([{ id: 1, state: 'proposed' }])
  expect(w.get('stats:session:S1')).toMatchObject({ background: { usage: { input: 2, output: 2 }, unknownResults: 0 } })
  expect(w.get('stats:session:S2')).toBeUndefined()
})

test('\u5b88\u9580\u5347\u7d1a：\u653e\u9032 repo \u6642\u8a18\u4e0b\u662f\u7b2c\u5e7e\u6b21；\u4e4b\u5f8c\u6c92\u518d\u88ab\u7cfe\u6b63\u7684\u4e0d\u8d77\u8349', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  w.files.set(NOTES, NOTES_ESCALATED.replace('（4 \u6b21）', '（3 \u6b21）'))
  ctl.distillReply = actionsReply(DRAFT)
  await distillNow($)
  expect(w.completes.length).toBe(1)
  expect(guardsOf(w)).toEqual([])
})

test('\u5b88\u9580\u8a62\u554f：\u65b0\u5c0d\u8a71\u958b\u982d\u8acb AI \u505a\u5b8c\u4f7f\u7528\u8005\u7684\u4e8b\u518d\u554f\u8981\u4e0d\u8981\u63a1\u7528；\u4ea4\u7d66\u7684\u5c0d\u8a71\u9084\u5728\u6642\u4e0d\u554f\u5225\u6bb5，\u5b83\u7d50\u675f\u518d\u554f', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, { 'guards:C--proj': [pushGuard('proposed', 'remind')] })
  w.files.set(NOTES, NOTES_ESCALATED)
  await startSession($)
  const text = (await askOf($)) ?? ''
  expect(text).toContain('\u5148\u505a\u5b8c\u4f7f\u7528\u8005\u9019\u6b21\u4ea4\u4ee3\u7684\u4e8b，\u518d\u5728\u56de\u8986\u6700\u5f8c\u7528\u4e00\u5169\u53e5\u767d\u8a71\u554f\u4f7f\u7528\u8005\u8981\u4e0d\u8981\u63a1\u7528')
  expect(text).toContain('- \u5b88\u9580 #1（\u63d0\u9192）：\u898f\u5247「\u63a8\u9001\u524d\u5148\u8dd1 preflight」（\u4f7f\u7528\u8005\u63d0\u904e 4 \u6b21；git push \u524d\u5148\u8dd1 preflight）｜\u5de5\u5177 Bash \u7b26\u5408 /git\\s+push/，\u9664\u975e /preflight/\u6642，\u544a\u8a34 AI：\u5148\u8dd1 preflight \u518d\u63a8')
  expect(text).toContain('\u4e0d\u7528\u547c\u53eb\u4efb\u4f55\u5de5\u5177，\u80cc\u666f\u6574\u7406\u6703\u5f9e\u5c0d\u8a71\u8a18\u4e0b')
  ctl.curSid = 'S2'
  expect(await askOf($)).toBeUndefined()
  await $.session.end({ reason: 'clear', sessionId: 'S1', resume: { id: 'S1' } })
  ctl.curSid = 'S3'
  expect(await askOf($)).toContain('\u5b88\u9580 #1')
})

for (const [label, op, state, change] of [
  ['\u63a1\u7528', 'approve_guard', 'on', '\u4f7f\u7528\u8005\u63a1\u7528\u5b88\u9580 #1：\u63a8\u9001\u524d\u5148\u8dd1 preflight'],
  ['\u4e0d\u8981', 'decline_guard', 'off', '\u4f7f\u7528\u8005\u4e0d\u8981\u5b88\u9580 #1：\u63a8\u9001\u524d\u5148\u8dd1 preflight'],
] as const) {
  test(`\u5b88\u9580\u8a62\u554f：\u4f7f\u7528\u8005\u8aaa${label}，\u6574\u7406\u5f9e\u5c0d\u8a71\u8a18\u4e0b（\u8981\u9644\u4f7f\u7528\u8005\u539f\u8a71），\u4e4b\u5f8c\u4e0d\u518d\u554f`, async ($, on) => {
    const w = world(on, 100_000, 1_000_000, { 'guards:C--proj': [pushGuard('proposed', 'remind')] }, [], 5)
    w.files.set(NOTES, NOTES_ESCALATED)
    await startSession($)
    await askOf($)
    await say($, `\u5b88\u9580\u90a3\u689d${label}`)
    ctl.distillReply = actionsReply({ op, id: 'G1', quote: `\u5b88\u9580\u90a3\u689d${label}` })
    await w.clock.advance(60_000)
    await distillNow($)
    expect(w.completes[0]?.system).toContain('\u516d、\u5b88\u9580\u8349\u7a3f')
    expect(w.completes[0]?.system).toContain('G1 \u63a8\u9001\u524d\u5148\u8dd1 preflight')
    expect(guardsOf(w)[0]?.state).toBe(state)
    expect((w.get('distill:last:C--proj') as { changes: string[] }).changes).toContain(change)
    expect(Object.keys(w.get('promote:C--proj') as object)).not.toContain('q:1')
    ctl.curSid = 'S2'
    expect(await askOf($)).toBeUndefined()
  })
}

test('\u5b88\u9580\u8a62\u554f：\u627e\u4e0d\u5230\u4f7f\u7528\u8005\u539f\u8a71、\u6216\u4e0d\u662f\u5f85\u554f\u7684\u8349\u7a3f，\u90fd\u4e0d\u7b97', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, { 'guards:C--proj': [pushGuard('proposed', 'remind'), { ...pushGuard('on'), id: 2 }] }, [], 5)
  w.files.set(NOTES, NOTES_ESCALATED)
  ctl.distillReply = actionsReply({ op: 'approve_guard', id: 'G1', quote: '\u597d\u554a\u63a1\u7528' }, { op: 'approve_guard', id: 'G2', quote: '\u597d\u554a\u63a1\u7528' })
  await distillNow($)
  expect(guardsOf(w).map(g => g.state)).toEqual(['proposed', 'on'])
  expect((w.get('distill:last:C--proj') as { rejected: { count: number } }).rejected.count).toBe(2)
})
