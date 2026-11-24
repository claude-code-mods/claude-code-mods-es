// ：。「## 」、， AI  skill
import { expect, test } from 'claude-code/testing'
import type { Engine } from 'claude-code/testing'
import { actionsReply, cmd, ctl, distillNow, lastOf, NOTES, NOTES_PATH, openPanel, say, startSession, world } from './test-world'
import { parseNotes, renderNotes } from './notes'

const RELEASE = {
  name: '\u767c\u7248',
  when: '\u8981\u767c\u65b0\u7248\u672c\u6642',
  steps: ['\u6539 plugin.json \u7684\u7248\u672c\u865f', '\u628a Unreleased \u79fb\u5230\u65b0\u7248\u672c', '\u6253 tag', '\u5efa\u7acb GitHub release'],
}
const addRelease = { op: 'add_procedure', ...RELEASE, evidence: '\u9019\u6bb5\u5c0d\u8a71\u767c\u4e86\u5169\u6b21\u7248' }

// 、、（）
const withProcedure = (count: number, extraLines: string[] = []) => [
  '# ctx-handoff \u5c08\u6848\u7d93\u9a57',
  '',
  '## \u8a18\u61b6',
  '- [feedback] \u820a A',
  '',
  '## \u898f\u5247',
  '',
  '### \u898f\u5247\u4e00（1 \u6b21）',
  '- \u898f\u5247：\u505a X',
  '',
  '## \u6d41\u7a0b',
  '',
  `### \u767c\u7248（${count} \u6b21）`,
  '- \u6642\u6a5f：\u8981\u767c\u65b0\u7248\u672c\u6642',
  '- \u6b65\u9a5f：',
  '  1. \u6539 plugin.json \u7684\u7248\u672c\u865f',
  '  2. \u6253 tag',
  '  3. \u5efa\u7acb GitHub release',
  '- \u6839\u64da：1970-01-01 \u505a\u904e\u5169\u6b21',
  ...extraLines,
  '',
].join('\n')

const promoteBlockOf = async ($: Engine) =>
  (await $.prompt.context({ blocks: [] })).blocks.find(b => b.name === 'ctxHandoffPromote')?.text

test('\u6d41\u7a0b：\u89e3\u6790\u518d\u8f38\u51fa\u9010\u4f4d\u5143\u76f8\u540c；\u6c92\u6709\u6d41\u7a0b\u7684\u820a\u6a94\u4e0d\u591a\u51fa\u4e00\u6bb5；\u81ea\u8a02\u5340\u6bb5\u4ecd\u4fdd\u7559\u5728\u5f8c\u9762', () => {
  const text = withProcedure(3, ['- \u5c08\u6848：\u5df2\u5728 .claude/skills/release/SKILL.md', '', '## \u81ea\u8a02\u5340\u6bb5', '\u539f\u6a23\u4fdd\u7559'])
  const notes = parseNotes(text)
  expect(notes.procedures).toHaveLength(1)
  expect(notes.procedures[0]).toMatchObject({ name: '\u767c\u7248', count: 3 })
  expect(notes.rules.map(r => r.name)).toEqual(['\u898f\u5247\u4e00'])
  expect(notes.extra).toEqual(['## \u81ea\u8a02\u5340\u6bb5', '\u539f\u6a23\u4fdd\u7559'])
  const stamp = '2026-10-08 10:00'
  const out = renderNotes(notes, stamp)
  // 、
  expect(out).toContain(text.slice(text.indexOf('## \u6d41\u7a0b')))
  expect(out.indexOf('## \u898f\u5247')).toBeLessThan(out.indexOf('## \u6d41\u7a0b'))
  expect(renderNotes(parseNotes(out), stamp)).toBe(out)
  expect(parseNotes(out)).toEqual(notes)
  // ：「## 」
  expect(renderNotes({ ...notes, procedures: [] }, stamp)).not.toContain('## \u6d41\u7a0b')
})

test('\u6d41\u7a0b：\u6574\u7406\u65b0\u589e、\u78ba\u8a8d、\u66f4\u65b0、\u522a\u9664，\u683c\u5f0f\u8207\u6b21\u6578、\u6839\u64da\u90fd\u7531\u7a0b\u5f0f\u7dad\u8b77', async ($, on) => {
  let n = 5
  const w = world(on, 100_000, 1_000_000, {}, [], () => n)
  ctl.distillReply = actionsReply(addRelease, { ...addRelease, name: '\u767c\u7248（2 \u6b21）' })
  await distillNow($)
  expect(w.files.get(NOTES) ?? '').toContain([
    '## \u6d41\u7a0b',
    '',
    '### \u767c\u7248（1 \u6b21）',
    '- \u6642\u6a5f：\u8981\u767c\u65b0\u7248\u672c\u6642',
    '- \u6b65\u9a5f：',
    '  1. \u6539 plugin.json \u7684\u7248\u672c\u865f',
    '  2. \u628a Unreleased \u79fb\u5230\u65b0\u7248\u672c',
    '  3. \u6253 tag',
    '  4. \u5efa\u7acb GitHub release',
    '- \u6839\u64da：1970-01-01 \u9019\u6bb5\u5c0d\u8a71\u767c\u4e86\u5169\u6b21\u7248 [ctx-source:S1:0:5]',
  ].join('\n'))
  // （「（2 ）」）
  expect((w.files.get(NOTES) ?? '').match(/### \u767c\u7248/g)).toHaveLength(1)
  expect(lastOf(w).changes).toEqual(['\u65b0\u6d41\u7a0b：\u767c\u7248（4 \u6b65，\u51fa\u73fe 1 \u6b21）'])

  n = 40
  ctl.distillReply = actionsReply(
    { op: 'confirm_procedure', id: 'P1', evidence: '\u53c8\u767c\u4e86\u4e00\u6b21\u7248' },
    { op: 'update_procedure', id: 'P1', steps: ['1. \u6539\u7248\u672c\u865f', '2) \u6253 tag', '\u5efa\u7acb release'] },
  )
  await distillNow($)
  // 
  expect((w.completes.at(-1)?.system ?? '')).toContain('P1 \u767c\u7248｜\u51fa\u73fe 1 \u6b21｜\u6642\u6a5f：\u8981\u767c\u65b0\u7248\u672c\u6642｜\u6b65\u9a5f：\u6539 plugin.json \u7684\u7248\u672c\u865f → \u628a Unreleased \u79fb\u5230\u65b0\u7248\u672c → \u6253 tag → \u5efa\u7acb GitHub release')
  const after = w.files.get(NOTES) ?? ''
  expect(after).toContain([
    '### \u767c\u7248（2 \u6b21）',
    '- \u6642\u6a5f：\u8981\u767c\u65b0\u7248\u672c\u6642',
    '- \u6b65\u9a5f：',
    '  1. \u6539\u7248\u672c\u865f',
    '  2. \u6253 tag',
    '  3. \u5efa\u7acb release',
    '- \u6839\u64da：1970-01-01 \u9019\u6bb5\u5c0d\u8a71\u767c\u4e86\u5169\u6b21\u7248 [ctx-source:S1:0:5]',
    '- \u6839\u64da：1970-01-01 \u53c8\u767c\u4e86\u4e00\u6b21\u7248 [ctx-source:S1:5:40]',
  ].join('\n'))
  expect(lastOf(w).changes).toEqual(['\u6d41\u7a0b\u78ba\u8a8d：\u767c\u7248 → \u51fa\u73fe 2 \u6b21', '\u66f4\u65b0\u6d41\u7a0b：\u767c\u7248'])

  n = 80
  ctl.distillReply = actionsReply({ op: 'delete_procedure', id: 'P1', reason: '\u4e0d\u518d\u9019\u6a23\u767c\u7248' })
  await distillNow($)
  expect(w.files.get(NOTES) ?? '').not.toContain('\u767c\u7248')
})

test('\u6d41\u7a0b：\u6b04\u4f4d\u4e0d\u5408\u683c\u7684\u6574\u689d\u4e1f\u6389\u4e26\u8a18\u4e0b\u539f\u56e0（\u6b65\u9a5f\u6578、\u7a7a\u6b65\u9a5f、\u9577\u5ea6、\u7f3a\u6b04\u4f4d、\u7de8\u865f）', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  w.files.set(NOTES, withProcedure(1))
  const bad = (patch: object) => ({ ...addRelease, name: `\u58de${Math.random()}`, ...patch })
  ctl.distillReply = actionsReply(
    bad({ steps: ['\u53ea\u6709\u4e00\u6b65'] }),
    bad({ steps: Array.from({ length: 9 }, (_, i) => `\u6b65\u9a5f${i}`) }),
    bad({ steps: ['\u7532', ''] }),
    bad({ steps: '\u7532 → \u4e59' }),
    bad({ steps: ['\u7532', '\u9577'.repeat(81)] }),
    bad({ when: undefined }),
    bad({ name: '\u9577'.repeat(41) }),
    { op: 'confirm_procedure', id: 'P2', evidence: '\u6c92\u6709\u9019\u500b\u7de8\u865f' },
    { op: 'confirm_procedure', id: 'R1', evidence: '\u7de8\u865f\u7a2e\u985e\u4e0d\u5c0d' },
    { op: 'update_procedure', id: 'P1' },
    { op: 'delete_procedure', id: 'P1' },
    { op: 'add_procedure', name: '\u5408\u683c', when: '\u4ec0\u9ebc\u6642\u5019', steps: ['\u7532', '\u4e59'], evidence: '\u6709\u8b49\u64da' },
  )
  await distillNow($)
  const { rejected, changes } = lastOf(w)
  expect(rejected.count).toBe(11)
  expect(rejected.samples).toEqual([
    expect.stringMatching(/^steps \u8981\u662f 2 \u5230 8 \u500b\u975e\u7a7a\u5b57\u4e32/),
    expect.stringMatching(/^steps \u8981\u662f 2 \u5230 8 \u500b\u975e\u7a7a\u5b57\u4e32/),
    expect.stringMatching(/^steps \u8981\u662f 2 \u5230 8 \u500b\u975e\u7a7a\u5b57\u4e32/),
  ])
  expect(changes).toEqual(['\u65b0\u6d41\u7a0b：\u5408\u683c（2 \u6b65，\u51fa\u73fe 1 \u6b21）'])
  const notes = w.files.get(NOTES) ?? ''
  expect(notes).toContain('### \u767c\u7248（1 \u6b21）')
  expect(notes).not.toContain('\u58de')
  expect(notes).toContain('  1. \u7532\n  2. \u4e59')
  // 
  expect(notes).toContain('### \u898f\u5247\u4e00（1 \u6b21）\n- \u898f\u5247：\u505a X')
})

test('\u6d41\u7a0b：\u5df2\u653e\u9032\u5c08\u6848\u7684\u5728\u6574\u7406\u63d0\u793a\u6a19\u51fa repo \u624d\u662f\u6b63\u672c；\u4e0a\u9650\u8207\u7de8\u865f\u7a2e\u985e\u53e6\u6709\u539f\u56e0', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  w.files.set(NOTES, withProcedure(3, ['- \u5c08\u6848：\u5df2\u5728 .claude/skills/release/SKILL.md']))
  ctl.distillReply = actionsReply({ op: 'confirm_procedure', id: 'R1', evidence: 'x' }, { op: 'confirm_procedure', id: 'P3', evidence: 'x' })
  await distillNow($)
  expect(w.completes[0]?.system ?? '').toContain('｜\u5df2\u5728 .claude/skills/release/SKILL.md（repo \u88e1\u7684\u624d\u662f\u6b63\u672c，\u4e0d\u8981 update_procedure）')
  expect(lastOf(w).rejected.samples).toEqual(['id \u4e0d\u662f P#：{"op":"confirm_procedure","id":"R1","evidence":"x"}', '\u6c92\u6709\u7de8\u865f P3：{"op":"confirm_procedure","id":"P3","evidence":"x"}'])
})

test('\u6d41\u7a0b：\u4e0d\u5e36\u5165\u65b0\u5c0d\u8a71（\u53ea\u6709\u6d41\u7a0b\u6642\u9023\u5c08\u6848\u7d93\u9a57\u5340\u584a\u90fd\u6c92\u6709）', async ($, on) => {
  const w = world(on, 100_000)
  w.files.set(NOTES, withProcedure(5))
  const r = await $.prompt.context({ blocks: [] })
  const text = r.blocks.find(b => b.name === 'ctxHandoffProject')?.text ?? ''
  expect(text).toContain('\u820a A')
  expect(text).not.toContain('\u767c\u7248')
  expect(text).not.toContain('plugin.json')
  w.files.set(NOTES, ['# ctx-handoff \u5c08\u6848\u7d93\u9a57', '', '## \u8a18\u61b6', '', '## \u898f\u5247', '', '## \u6d41\u7a0b', '', '### \u767c\u7248（5 \u6b21）', '- \u6642\u6a5f：\u8981\u767c\u65b0\u7248\u672c\u6642', ''].join('\n'))
  expect((await $.prompt.context({ blocks: [] })).blocks).toEqual([])
})

test('\u6d41\u7a0b：git repo \u88e1\u51fa\u73fe 3 \u6b21\u4ee5\u4e0a\u5c31\u4ea4\u4ee3 AI \u505a\u6210 skill；\u4e0d\u5230 3 \u6b21、\u4e0d\u662f git repo \u4e0d\u4ea4\u4ee3', async ($, on) => {
  const w = world(on, 100_000)
  w.files.set('C:/proj/.git', '')
  w.files.set(NOTES, withProcedure(2))
  await startSession($)
  expect(await promoteBlockOf($)).toBeUndefined()
  w.files.set(NOTES, withProcedure(3))
  const text = (await promoteBlockOf($)) ?? ''
  expect(text).toContain('- \u6d41\u7a0b「\u767c\u7248」（3 \u6b21）：\u8981\u767c\u65b0\u7248\u672c\u6642｜\u6b65\u9a5f：1. \u6539 plugin.json \u7684\u7248\u672c\u865f；2. \u6253 tag；3. \u5efa\u7acb GitHub release')
  expect(text).toContain('.claude/skills/<kebab-case \u540d\u7a31>/SKILL.md')
  expect(text).toContain('frontmatter \u6709 name')
  expect(text).toContain('description')
  expect(text).toContain('\u4e0d\u8981\u53e6\u958b\u91cd\u8907\u7684')
  expect(text).toContain('\u4e0d\u8981 commit \u6216 push')
  expect(text).toContain('\u4e0d\u7528\u547c\u53eb\u4efb\u4f55\u5de5\u5177\u56de\u5831')
  expect(Object.keys(w.get('promote:C--proj') as object)).toEqual(['p:\u767c\u7248'])
})

test('\u6d41\u7a0b：\u6c92\u6709\u6d41\u7a0b\u7684\u4ea4\u4ee3\u6587\u5b57\u4e0d\u63d0 skill', async ($, on) => {
  const w = world(on, 100_000)
  w.files.set('C:/proj/.git', '')
  w.files.set(NOTES, ['# x', '', '## \u898f\u5247', '', '### \u898f\u5247\u4e09（3 \u6b21）', '- \u898f\u5247：\u505a Z', ''].join('\n'))
  await startSession($)
  const text = (await promoteBlockOf($)) ?? ''
  expect(text).toContain('\u898f\u5247\u4e09')
  expect(text).not.toContain('SKILL.md')
  expect(text).toContain('4. \u5b8c\u6210\u5f8c\u5728\u56de\u8986\u6700\u5f8c')
})

test('\u6d41\u7a0b：\u4e0d\u662f git repo \u4e0d\u4ea4\u4ee3；\u4ea4\u7d66\u7684\u5c0d\u8a71\u9084\u5728\u6642\u4e0d\u91cd\u8907\u4ea4\u4ee3，\u5b83\u7d50\u675f\u5c31\u518d\u4ea4\u4ee3', async ($, on) => {
  const w = world(on, 100_000)
  w.files.set(NOTES, withProcedure(3))
  await startSession($)
  expect(await promoteBlockOf($)).toBeUndefined()
  w.files.set('C:/proj/.git', '')
  expect(await promoteBlockOf($)).toContain('\u6d41\u7a0b「\u767c\u7248」')
  expect(await promoteBlockOf($)).toBeUndefined()
  await $.session.end({ reason: 'prompt_input_exit', sessionId: 'S1', resume: { id: 'S1' } })
  ctl.curSid = 'S2'
  expect(await promoteBlockOf($)).toContain('\u6d41\u7a0b「\u767c\u7248」')
})

test('\u6d41\u7a0b：\u6574\u7406\u8a8d\u51fa skill \u653e\u597d\u5c31\u8a18「\u5df2\u5728」，\u4e0d\u518d\u4ea4\u4ee3；\u4f7f\u7528\u8005\u4e0d\u8981\u5c31\u8a18「\u4e0d\u653e」', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  w.files.set('C:/proj/.git', '')
  w.files.set('C:/proj/.claude/skills/release/SKILL.md', '---\nname: release\n---')
  //  P1、 P2
  w.files.set(NOTES, withProcedure(3).replace('## \u6d41\u7a0b\n', '## \u6d41\u7a0b\n\n### \u5099\u4efd\u8cc7\u6599（4 \u6b21）\n- \u6642\u6a5f：\u6bcf\u9031\n- \u6b65\u9a5f：\n  1. \u532f\u51fa\n  2. \u4e0a\u50b3\n  3. \u9a57\u8b49\n'))
  await startSession($)
  expect(await promoteBlockOf($)).toContain('\u6d41\u7a0b「\u5099\u4efd\u8cc7\u6599」')
  await say($, '\u5099\u4efd\u8cc7\u6599\u90a3\u500b\u6d41\u7a0b\u4e0d\u7528\u505a\u6210 skill')
  ctl.distillReply = actionsReply(
    { op: 'in_project', id: 'P2', where: '.claude/skills/release/SKILL.md' },
    { op: 'not_in_project', id: 'P1', quote: '\u4e0d\u7528\u505a\u6210 skill' },
  )
  await distillNow($)
  const notes = w.files.get(NOTES) ?? ''
  expect(notes).toContain('  3. \u5efa\u7acb GitHub release\n- \u6839\u64da：1970-01-01 \u505a\u904e\u5169\u6b21\n- \u5c08\u6848：\u5df2\u5728 .claude/skills/release/SKILL.md')
  expect(notes).toContain('  3. \u9a57\u8b49\n- \u5c08\u6848：\u4e0d\u653e')
  expect(w.get('promote:C--proj')).toEqual({})
  ctl.curSid = 'S2'
  expect(await promoteBlockOf($)).toBeUndefined()
})

test('\u6d41\u7a0b：\u9762\u677f\u5728\u898f\u5247\u5206\u9801\u5217\u51fa\u6b21\u6578\u8207「\u5df2\u5728」，\u522a\u9664\u8981\u6309\u5169\u6b21\u4e26\u5099\u4efd\u539f\u6a94', async ($, on) => {
  const w = world(on, 1000)
  const text = withProcedure(3, ['- \u5c08\u6848：\u5df2\u5728 .claude/skills/release/SKILL.md'])
  w.files.set(NOTES_PATH, text)
  const ui = await openPanel($, 'rules')
  expect(await ui.find({ type: 'Text', text: /\u6d41\u7a0b 1 \u689d/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /3 \u6b21 \u767c\u7248.*\u5df2\u5728 \.claude\/skills\/release\/SKILL\.md/ })).toBeDefined()
  await ui.press({ key: 'del:p:\u767c\u7248' })
  await w.clock.advance(0)
  expect(w.files.get(NOTES_PATH)).toBe(text)
  await ui.press({ key: 'yes:p:\u767c\u7248' })
  await w.clock.advance(0)
  const after = w.files.get(NOTES_PATH) ?? ''
  expect(after).not.toContain('\u767c\u7248')
  expect(after).not.toContain('## \u6d41\u7a0b')
  expect(after).toContain('### \u898f\u5247\u4e00（1 \u6b21）')
  const backup = [...w.files.keys()].find(p => p.includes('/memory/.ctx-handoff-backup/'))
  expect(backup && w.files.get(backup)).toBe(text)
  expect(await ui.find({ type: 'Text', text: /\u5df2\u522a\u9664\u6d41\u7a0b「\u767c\u7248」/ })).toBeDefined()
})

test('\u6d41\u7a0b：/handoff \u72c0\u614b\u5217\u51fa\u6d41\u7a0b\u689d\u6578\u8207\u5df2\u653e\u9032\u5c08\u6848\u7684\u689d\u6578；\u6c92\u6709\u6d41\u7a0b\u5c31\u6c92\u6709\u9019\u4e00\u884c', async ($, on) => {
  const w = world(on, 100_000)
  w.files.set(NOTES, withProcedure(3, ['- \u5c08\u6848：\u5df2\u5728 .claude/skills/release/SKILL.md']))
  expect((await cmd($, '')).text).toContain('\u5de5\u4f5c\u5340\u6d41\u7a0b：1 \u689d（\u5df2\u653e\u9032\u5c08\u6848 skill \u6216\u6587\u4ef6 1 \u689d；\u6d41\u7a0b\u4e0d\u5e36\u5165\u65b0\u5c0d\u8a71）')
  w.files.set(NOTES, '# x\n\n## \u8a18\u61b6\n\n## \u898f\u5247\n')
  expect((await cmd($, '')).text).not.toContain('\u5de5\u4f5c\u5340\u6d41\u7a0b')
})
