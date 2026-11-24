// ：， AI  repo；AI ，
import { expect, test } from 'claude-code/testing'
import type { Engine } from 'claude-code/testing'
import { actionsReply, cmd, ctl, startSession, NOTES, distillNow, lastOf, pushGuard, say, world } from './test-world'

const PROMOTE_NOTES = [
  '# ctx-handoff \u5c08\u6848\u7d93\u9a57',
  '',
  '## \u8a18\u61b6',
  '- [feedback] \u820a A',
  '',
  '## \u898f\u5247',
  '',
  '### \u6b63\u5f0f\u7ad9\u522a\u9664\u8981\u65b7\u8a00\u7b46\u6578（4 \u6b21）',
  '- \u898f\u5247：DELETE \u524d\u5148\u5728 DO \u5340\u584a\u65b7\u8a00\u7b46\u6578',
  '',
  '### \u898f\u5247\u4e8c（2 \u6b21）',
  '- \u898f\u5247：\u505a Y',
  '',
].join('\n')
const promoteBlockOf = async ($: Engine) =>
  (await $.prompt.context({ blocks: [] })).blocks.find(b => b.name === 'ctxHandoffPromote')?.text
const endSession = ($: Engine, sid: string) => $.session.end({ reason: 'clear', sessionId: sid, resume: { id: sid } })
// git repo 、 4 
const repoWorld = (on: Parameters<typeof world>[0], store: Record<string, unknown> = {}) => {
  const w = world(on, 100_000, 1_000_000, store, [], 5)
  w.files.set(NOTES, PROMOTE_NOTES)
  w.files.set('C:/proj/.git', '')
  return w
}

test('\u653e\u9032\u5c08\u6848：git repo \u88e1，\u51fa\u73fe 3 \u6b21\u4ee5\u4e0a\u7684\u898f\u5247\u8207\u555f\u7528\u4e2d\u7684\u5b88\u9580\u5728\u65b0\u5c0d\u8a71\u958b\u982d\u4ea4\u4ee3；\u4e0d\u5230 3 \u6b21\u7684\u4e0d\u4ea4\u4ee3；\u4e0d\u7528\u547c\u53eb\u5de5\u5177\u56de\u5831', async ($, on) => {
  const w = repoWorld(on, { 'guards:C--proj': [pushGuard('on'), { ...pushGuard('proposed'), id: 2 }] })
  await startSession($)
  const text = (await promoteBlockOf($)) ?? ''
  expect(text).toContain('\u8acb\u5728\u9019\u4e00\u8f2a\u56de\u8986\u7d50\u675f\u524d\u8655\u7406：\u5148\u505a\u5b8c\u4f7f\u7528\u8005\u9019\u6b21\u4ea4\u4ee3\u7684\u4e8b')
  expect(text).toContain('\u4e0d\u8981 commit \u6216 push')
  expect(text).toContain('\u4e0d\u7528\u547c\u53eb\u4efb\u4f55\u5de5\u5177\u56de\u5831')
  expect(text).not.toContain('mark_in_project')
  expect(text).toContain('- \u898f\u5247「\u6b63\u5f0f\u7ad9\u522a\u9664\u8981\u65b7\u8a00\u7b46\u6578」（4 \u6b21）：DELETE \u524d\u5148\u5728 DO \u5340\u584a\u65b7\u8a00\u7b46\u6578')
  expect(text).toContain('- \u5b88\u9580 #1（\u64cb\u4e0b）：\u63a8\u9001\u524d\u5148\u8dd1 preflight')
  expect(text).not.toContain('\u898f\u5247\u4e8c')
  expect(text).not.toContain('\u5b88\u9580 #2')
  //  #2  repo ，（q:2）
  expect(Object.keys(w.get('promote:C--proj') as object).sort()).toEqual(['g:1', 'q:2', 'r:\u6b63\u5f0f\u7ad9\u522a\u9664\u8981\u65b7\u8a00\u7b46\u6578'])
  expect((w.get('promote:C--proj') as Record<string, { sid: string }>)['g:1']?.sid).toBe('S1')
})

// （2026-10-14，issue #2）：AI 「 .claude/hooks/x.mjs」，，
// ，repo  hook  ctx-handoff 
test('\u653e\u9032\u5c08\u6848：\u5b88\u9580\u7684\u63d0\u9192\u6587\u5b57\u5df2\u7d93\u5beb\u5728 repo \u7684 hook \u6a94，\u76f4\u63a5\u8a18\u6210\u5df2\u5728\u90a3\u88e1\u4e26\u505c\u7528，\u4e0d\u518d\u4ea4\u4ee3；\u592a\u77ed\u7684\u4e0d\u6bd4\u5c0d', async ($, on) => {
  const message = '\u6b63\u5f0f\u7ad9 SQL \u8acb\u6539\u7528 node tools/ops/prod/sql.mjs（\u9810\u8a2d\u552f\u8b80）'
  const w = repoWorld(on, { 'guards:C--proj': [{ ...pushGuard('on', 'remind'), message }, { ...pushGuard('on'), id: 2 }] })
  w.files.set('C:/proj/.claude/hooks/prod-guard.mjs', `const MSG = '${message}'\n// \u5148\u8dd1 preflight \u518d\u63a8`)
  await startSession($)
  const text = (await promoteBlockOf($)) ?? ''
  expect(text).not.toContain('\u5b88\u9580 #1')
  expect(text).toContain('\u5b88\u9580 #2')
  const guards = w.get('guards:C--proj') as { id: number; state: string; project?: string }[]
  expect(guards[0]).toMatchObject({ state: 'off', project: '\u5df2\u5728 .claude/hooks/prod-guard.mjs' })
  expect(guards[1]).toMatchObject({ state: 'on' })
  expect(guards[1]?.project).toBeUndefined()
  expect(Object.keys(w.get('promote:C--proj') as object).sort()).toEqual(['g:2', 'r:\u6b63\u5f0f\u7ad9\u522a\u9664\u8981\u65b7\u8a00\u7b46\u6578'])
  //  ctx-handoff 
  const r = await $.tool.call({ tool: 'Bash', command: 'git push' })
  expect((r.context ?? []).join('\n')).not.toContain(message)
})

test('\u653e\u9032\u5c08\u6848：\u4e0d\u662f git repo（\u4f8b\u5982\u5728\u5bb6\u76ee\u9304\u958b\u7684 session）\u5c31\u4e0d\u4ea4\u4ee3', async ($, on) => {
  const w = world(on, 100_000)
  w.files.set(NOTES, PROMOTE_NOTES)
  await startSession($)
  expect(await promoteBlockOf($)).toBeUndefined()
})

// ： 2 ，（2026-10-09  3 ）
test('\u653e\u9032\u5c08\u6848：\u4ea4\u7d66\u7684\u5c0d\u8a71\u9084\u5728\u6642\u4e0d\u4ea4\u7d66\u5225\u7684\u5c0d\u8a71；\u5b83\u7d50\u675f\u5c31\u6536\u56de，\u4e0b\u4e00\u6bb5\u518d\u4ea4\u4ee3，\u6c92\u6709\u6b21\u6578\u4e0a\u9650', async ($, on) => {
  const w = repoWorld(on)
  await startSession($)
  expect(await promoteBlockOf($)).toContain('\u6b63\u5f0f\u7ad9\u522a\u9664\u8981\u65b7\u8a00\u7b46\u6578')
  // S1 ：
  ctl.curSid = 'S2'
  expect(await promoteBlockOf($)).toBeUndefined()
  for (const [ended, next] of [['S1', 'S3'], ['S3', 'S4'], ['S4', 'S5']] as const) {
    await endSession($, ended)
    expect(w.get('promote:C--proj')).toEqual({})
    ctl.curSid = next
    expect(await promoteBlockOf($)).toContain('\u6b63\u5f0f\u7ad9\u522a\u9664\u8981\u65b7\u8a00\u7b46\u6578')
  }
})

test('\u653e\u9032\u5c08\u6848：\u6574\u7406\u770b\u904e\u4ea4\u4ee3\u4e4b\u5f8c\u7684\u5c0d\u8a71\u537b\u6c92\u770b\u5230\u653e\u597d，\u5c31\u6536\u56de，\u4e0b\u4e00\u6bb5\u65b0\u5c0d\u8a71\u518d\u4ea4\u4ee3', async ($, on) => {
  const w = repoWorld(on)
  await startSession($)
  expect(await promoteBlockOf($)).toContain('\u6b63\u5f0f\u7ad9\u522a\u9664\u8981\u65b7\u8a00\u7b46\u6578')
  await w.clock.advance(60_000)
  ctl.distillReply = actionsReply()
  await distillNow($)
  expect(w.get('promote:C--proj')).toEqual({})
  ctl.curSid = 'S2'
  expect(await promoteBlockOf($)).toContain('\u6b63\u5f0f\u7ad9\u522a\u9664\u8981\u65b7\u8a00\u7b46\u6578')
})

test('\u653e\u9032\u5c08\u6848：\u6574\u7406\u63d0\u793a\u5217\u51fa\u9084\u6c92\u653e\u9032 repo \u7684\u9805\u76ee\u8207 in_project \u7684\u5beb\u6cd5', async ($, on) => {
  const w = repoWorld(on, { 'guards:C--proj': [pushGuard('on')] })
  await distillNow($)
  const prompt = (w.completes.at(-1)?.system ?? '')
  const section = prompt.slice(prompt.indexOf('\u4e94、\u653e\u9032 repo'), prompt.indexOf('- \u9644\u4e0a\u7684\u5c0d\u8a71\u88e1，AI \u5be6\u969b'))
  expect(section.split('\n').slice(1).filter(Boolean)).toEqual(['G1 \u63a8\u9001\u524d\u5148\u8dd1 preflight', 'R1 \u6b63\u5f0f\u7ad9\u522a\u9664\u8981\u65b7\u8a00\u7b46\u6578'])
  expect(prompt).toContain('{"op":"in_project","id":"R2","where":"CLAUDE.md"}')
})

test('\u653e\u9032\u5c08\u6848：\u6574\u7406\u8a8d\u51fa\u653e\u597d\u4e86，\u898f\u5247\u8a18「\u5df2\u5728」、\u4e0d\u518d\u5e36\u5165\u4e5f\u4e0d\u518d\u4ea4\u4ee3；\u5b88\u9580\u505c\u7528 ctx-handoff \u81ea\u5df1\u9019\u4efd', async ($, on) => {
  const w = repoWorld(on, { 'guards:C--proj': [pushGuard('on')] })
  w.files.set('C:/proj/AGENTS.md', '# agents')
  w.files.set('C:/proj/.claude/hooks/push-guard.mjs', '')
  await startSession($)
  await promoteBlockOf($)
  ctl.distillReply = actionsReply(
    { op: 'in_project', id: 'R1', where: 'AGENTS.md' },
    //  repo 
    { op: 'in_project', id: 'G1', where: 'C:/proj/.claude/hooks/push-guard.mjs' },
  )
  await w.clock.advance(60_000)
  await distillNow($)
  // ：，，
  expect(w.files.get(NOTES) ?? '').toContain('### \u6b63\u5f0f\u7ad9\u522a\u9664\u8981\u65b7\u8a00\u7b46\u6578（4 \u6b21）\n- \u898f\u5247：DELETE \u524d\u5148\u5728 DO \u5340\u584a\u65b7\u8a00\u7b46\u6578\n- \u5c08\u6848：\u5df2\u5728 AGENTS.md（\u7b2c 4 \u6b21\u6642）\n')
  const g = (w.get('guards:C--proj') as { state: string; project?: string }[])[0]
  expect(g?.state).toBe('off')
  expect(g?.project).toBe('\u5df2\u5728 .claude/hooks/push-guard.mjs')
  expect(w.get('promote:C--proj')).toEqual({})
  expect(lastOf(w).changes).toEqual(['\u5df2\u653e\u9032 repo：\u6b63\u5f0f\u7ad9\u522a\u9664\u8981\u65b7\u8a00\u7b46\u6578 → AGENTS.md', '\u5df2\u653e\u9032 repo：\u63a8\u9001\u524d\u5148\u8dd1 preflight → .claude/hooks/push-guard.mjs'])
  ctl.curSid = 'S2'
  const blocks = (await $.prompt.context({ blocks: [] })).blocks
  expect(blocks.find(b => b.name === 'ctxHandoffPromote')).toBeUndefined()
  expect(blocks.find(b => b.name === 'ctxHandoffProject')?.text ?? '').not.toContain('\u6b63\u5f0f\u7ad9\u522a\u9664\u8981\u65b7\u8a00\u7b46\u6578')
})

test('\u653e\u9032\u5c08\u6848：repo \u88e1\u6c92\u6709\u90a3\u500b\u6a94\u6848、\u7de8\u865f\u4e0d\u662f\u5f85\u653e\u7684\u9805\u76ee，\u90fd\u4e1f\u6389\u4e26\u8a18\u9032\u4e1f\u68c4\u6a23\u672c', async ($, on) => {
  const w = repoWorld(on)
  ctl.distillReply = actionsReply(
    { op: 'in_project', id: 'R1', where: 'AGENTS.md' },
    { op: 'in_project', id: 'R2', where: 'CLAUDE.md' },
  )
  w.files.set('C:/proj/CLAUDE.md', '')
  await distillNow($)
  expect(w.files.get(NOTES)).toBe(PROMOTE_NOTES)
  const last = lastOf(w)
  expect(last.rejected.count).toBe(2)
  expect(last.rejected.samples.join('\n')).toContain('repo \u88e1\u6c92\u6709 AGENTS.md')
  expect(last.rejected.samples.join('\n')).toContain('\u6c92\u6709\u7de8\u865f R2')
})

test('\u653e\u9032\u5c08\u6848：\u4f7f\u7528\u8005\u8aaa\u4e0d\u8981\u5c31\u8a18「\u4e0d\u653e」（\u8981\u9644\u4f7f\u7528\u8005\u539f\u8a71），\u7167\u5e38\u5e36\u5165、\u4e0d\u518d\u4ea4\u4ee3', async ($, on) => {
  const w = repoWorld(on)
  await say($, '\u65b7\u8a00\u7b46\u6578\u90a3\u689d\u4e0d\u8981\u653e\u9032 repo')
  ctl.distillReply = actionsReply({ op: 'not_in_project', id: 'R1', quote: '\u4e0d\u8981\u653e\u9032 repo' })
  await distillNow($)
  expect(w.files.get(NOTES) ?? '').toContain('- \u5c08\u6848：\u4e0d\u653e')
  expect(lastOf(w).changes).toEqual(['\u4f7f\u7528\u8005\u4e0d\u8981\u653e\u9032 repo：\u6b63\u5f0f\u7ad9\u522a\u9664\u8981\u65b7\u8a00\u7b46\u6578'])
  const blocks = (await $.prompt.context({ blocks: [] })).blocks
  expect(blocks.find(b => b.name === 'ctxHandoffProject')?.text ?? '').toContain('\u6b63\u5f0f\u7ad9\u522a\u9664\u8981\u65b7\u8a00\u7b46\u6578')
  expect(blocks.find(b => b.name === 'ctxHandoffPromote')).toBeUndefined()
})

test('\u653e\u9032\u5c08\u6848：「\u4e0d\u653e」\u627e\u4e0d\u5230\u4f7f\u7528\u8005\u539f\u8a71\u5c31\u4e1f\u6389', async ($, on) => {
  const w = repoWorld(on)
  ctl.distillReply = actionsReply({ op: 'not_in_project', id: 'R1', quote: '\u4e0d\u8981\u653e\u9032 repo' })
  await distillNow($)
  expect(w.files.get(NOTES)).toBe(PROMOTE_NOTES)
  expect(lastOf(w).rejected.count).toBe(1)
})

test('\u653e\u9032\u5c08\u6848：\u5df2\u5728\u5c08\u6848\u7684\u898f\u5247\u4e0d\u6703\u518d\u88ab\u63d0\u8b70\u6210\u500b\u4eba\u5b88\u9580，\u6574\u7406\u63d0\u793a\u4e5f\u6a19\u51fa repo \u624d\u662f\u6b63\u672c', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  w.files.set(NOTES, PROMOTE_NOTES.replace('- \u898f\u5247：DELETE \u524d\u5148\u5728 DO \u5340\u584a\u65b7\u8a00\u7b46\u6578', '- \u898f\u5247：DELETE \u524d\u5148\u5728 DO \u5340\u584a\u65b7\u8a00\u7b46\u6578\n- \u5c08\u6848：\u5df2\u5728 AGENTS.md'))
  expect((await cmd($, 'guard suggest')).text).toContain('\u6c92\u6709\u5beb\u9032 repo \u5f8c\u53c8\u88ab\u7cfe\u6b63、\u6216\u4e0d\u653e\u9032 repo \u537b\u8b1b\u4e86 3 \u6b21\u4ee5\u4e0a、\u9084\u6c92\u6709\u5b88\u9580\u7684\u898f\u5247')
  await distillNow($)
  expect((w.completes.at(-1)?.system ?? '')).toContain('\u6b63\u5f0f\u7ad9\u522a\u9664\u8981\u65b7\u8a00\u7b46\u6578｜\u51fa\u73fe 4 \u6b21｜DELETE \u524d\u5148\u5728 DO \u5340\u584a\u65b7\u8a00\u7b46\u6578｜\u5df2\u5728 AGENTS.md（repo \u88e1\u7684\u624d\u662f\u6b63\u672c，\u4e0d\u8981 update_rule；AI \u53c8\u72af\u800c\u88ab\u4f7f\u7528\u8005\u7cfe\u6b63\u6642\u7167\u6a23 confirm_rule）')
})
