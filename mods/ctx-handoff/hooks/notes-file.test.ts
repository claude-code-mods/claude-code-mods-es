// ：、POSIX 、（、、）
import { expect, test } from 'claude-code/testing'
import type { On } from 'claude-code'
import { cmd, say, endTurn, NOTES, distillNow, EXISTING, CLAUDE_PROJECTS, lastOf, openPanel, actionsReply, ctl, world } from './test-world'

// ---------- S7： ----------

// （，）：
// ； fs ， ctx-handoff.md
const NOTES_FIXTURE: string = [
  "# ctx-handoff \u5c08\u6848\u7d93\u9a57",
  "",
  "> \u7531 ctx-handoff \u80cc\u666f\u6574\u7406\u7dad\u8b77，\u53ef\u4ee5\u76f4\u63a5\u7de8\u8f2f。\u65b0\u5c0d\u8a71\u958b\u982d\u6703\u5e36\u5165\u8a18\u61b6，\u4ee5\u53ca\u51fa\u73fe 2 \u6b21\u4ee5\u4e0a\u7684\u898f\u5247。",
  "> \u6700\u5f8c\u66f4\u65b0：2026-10-03 23:10",
  "",
  "## \u8a18\u61b6",
  "- [project] \u7bc4\u4f8b\u8a18\u61b6 7：\u5167\u5bb9\u5df2\u53bb\u8b58\u5225\u5316",
  "- [user] \u7bc4\u4f8b\u8a18\u61b6 8：\u5167\u5bb9\u5df2\u53bb\u8b58\u5225\u5316",
  "- [project] \u7bc4\u4f8b\u8a18\u61b6 9：\u5167\u5bb9\u5df2\u53bb\u8b58\u5225\u5316",
  "- [project] \u7bc4\u4f8b\u8a18\u61b6 10：\u5167\u5bb9\u5df2\u53bb\u8b58\u5225\u5316",
  "- [project] \u7bc4\u4f8b\u8a18\u61b6 11：\u5167\u5bb9\u5df2\u53bb\u8b58\u5225\u5316",
  "- [reference] \u7bc4\u4f8b\u8a18\u61b6 12：\u5167\u5bb9\u5df2\u53bb\u8b58\u5225\u5316",
  "- [project] \u7bc4\u4f8b\u8a18\u61b6 13：\u5167\u5bb9\u5df2\u53bb\u8b58\u5225\u5316",
  "- [user] \u7bc4\u4f8b\u8a18\u61b6 14：\u5167\u5bb9\u5df2\u53bb\u8b58\u5225\u5316",
  "- [project] \u7bc4\u4f8b\u8a18\u61b6 15：\u5167\u5bb9\u5df2\u53bb\u8b58\u5225\u5316",
  "- [project] \u7bc4\u4f8b\u8a18\u61b6 16：\u5167\u5bb9\u5df2\u53bb\u8b58\u5225\u5316",
  "- [project] \u7bc4\u4f8b\u8a18\u61b6 17：\u5167\u5bb9\u5df2\u53bb\u8b58\u5225\u5316",
  "- [project] \u7bc4\u4f8b\u8a18\u61b6 18：\u5167\u5bb9\u5df2\u53bb\u8b58\u5225\u5316",
  "- [project] \u7bc4\u4f8b\u8a18\u61b6 19：\u5167\u5bb9\u5df2\u53bb\u8b58\u5225\u5316",
  "- [project] \u7bc4\u4f8b\u8a18\u61b6 20：\u5167\u5bb9\u5df2\u53bb\u8b58\u5225\u5316",
  "- [project] \u7bc4\u4f8b\u8a18\u61b6 21：\u5167\u5bb9\u5df2\u53bb\u8b58\u5225\u5316",
  "- [project] \u7bc4\u4f8b\u8a18\u61b6 22：\u5167\u5bb9\u5df2\u53bb\u8b58\u5225\u5316",
  "- [project] \u7bc4\u4f8b\u8a18\u61b6 23：\u5167\u5bb9\u5df2\u53bb\u8b58\u5225\u5316",
  "- [project] \u7bc4\u4f8b\u8a18\u61b6 24：\u5167\u5bb9\u5df2\u53bb\u8b58\u5225\u5316",
  "- [project] \u7bc4\u4f8b\u8a18\u61b6 25：\u5167\u5bb9\u5df2\u53bb\u8b58\u5225\u5316",
  "- [project] \u7bc4\u4f8b\u8a18\u61b6 26：\u5167\u5bb9\u5df2\u53bb\u8b58\u5225\u5316",
  "- [project] \u7bc4\u4f8b\u8a18\u61b6 27：\u5167\u5bb9\u5df2\u53bb\u8b58\u5225\u5316",
  "- [project] \u7bc4\u4f8b\u8a18\u61b6 28：\u5167\u5bb9\u5df2\u53bb\u8b58\u5225\u5316",
  "- [user] \u7bc4\u4f8b\u8a18\u61b6 29：\u5167\u5bb9\u5df2\u53bb\u8b58\u5225\u5316",
  "- [user] \u7bc4\u4f8b\u8a18\u61b6 30：\u5167\u5bb9\u5df2\u53bb\u8b58\u5225\u5316",
  "- [reference] \u7bc4\u4f8b\u8a18\u61b6 31：\u5167\u5bb9\u5df2\u53bb\u8b58\u5225\u5316",
  "- [reference] \u7bc4\u4f8b\u8a18\u61b6 32：\u5167\u5bb9\u5df2\u53bb\u8b58\u5225\u5316",
  "- [reference] \u7bc4\u4f8b\u8a18\u61b6 33：\u5167\u5bb9\u5df2\u53bb\u8b58\u5225\u5316",
  "- [project] \u7bc4\u4f8b\u8a18\u61b6 34：\u5167\u5bb9\u5df2\u53bb\u8b58\u5225\u5316",
  "- [project] \u7bc4\u4f8b\u8a18\u61b6 35：\u5167\u5bb9\u5df2\u53bb\u8b58\u5225\u5316",
  "- [feedback] \u7bc4\u4f8b\u8a18\u61b6 36：\u5167\u5bb9\u5df2\u53bb\u8b58\u5225\u5316",
  "- [project] \u7bc4\u4f8b\u8a18\u61b6 37：\u5167\u5bb9\u5df2\u53bb\u8b58\u5225\u5316",
  "- [project] \u7bc4\u4f8b\u8a18\u61b6 38：\u5167\u5bb9\u5df2\u53bb\u8b58\u5225\u5316",
  "- [project] \u7bc4\u4f8b\u8a18\u61b6 39：\u5167\u5bb9\u5df2\u53bb\u8b58\u5225\u5316",
  "- [project] \u7bc4\u4f8b\u8a18\u61b6 40：\u5167\u5bb9\u5df2\u53bb\u8b58\u5225\u5316",
  "- [project] \u7bc4\u4f8b\u8a18\u61b6 41：\u5167\u5bb9\u5df2\u53bb\u8b58\u5225\u5316",
  "- [reference] \u7bc4\u4f8b\u8a18\u61b6 42：\u5167\u5bb9\u5df2\u53bb\u8b58\u5225\u5316",
  "- [project] \u7bc4\u4f8b\u8a18\u61b6 43：\u5167\u5bb9\u5df2\u53bb\u8b58\u5225\u5316",
  "- [project] \u7bc4\u4f8b\u8a18\u61b6 44：\u5167\u5bb9\u5df2\u53bb\u8b58\u5225\u5316",
  "- [user] \u7bc4\u4f8b\u8a18\u61b6 45：\u5167\u5bb9\u5df2\u53bb\u8b58\u5225\u5316",
  "",
  "## \u898f\u5247",
  "",
  "### \u7bc4\u4f8b\u898f\u5247 49（1 \u6b21）",
  "- \u898f\u5247：\u7bc4\u4f8b\u5167\u5bb9 50",
  "- \u9069\u7528：\u7bc4\u4f8b\u5167\u5bb9 51",
  "- \u6839\u64da：\u7bc4\u4f8b\u5167\u5bb9 52",
  "",
  "### \u7bc4\u4f8b\u898f\u5247 54（1 \u6b21）",
  "- \u898f\u5247：\u7bc4\u4f8b\u5167\u5bb9 55",
  "- \u9069\u7528：\u7bc4\u4f8b\u5167\u5bb9 56",
  "- \u6839\u64da：\u7bc4\u4f8b\u5167\u5bb9 57",
  "",
  "### \u7bc4\u4f8b\u898f\u5247 59（2 \u6b21）",
  "- \u898f\u5247：\u7bc4\u4f8b\u5167\u5bb9 60",
  "- \u9069\u7528：\u7bc4\u4f8b\u5167\u5bb9 61",
  "- \u6839\u64da：\u7bc4\u4f8b\u5167\u5bb9 62",
  "- \u6839\u64da：\u7bc4\u4f8b\u5167\u5bb9 63",
  "",
  "### \u7bc4\u4f8b\u898f\u5247 65（1 \u6b21）",
  "- \u898f\u5247：\u7bc4\u4f8b\u5167\u5bb9 66",
  "- \u9069\u7528：\u7bc4\u4f8b\u5167\u5bb9 67",
  "- \u505a\u6cd5：\u7bc4\u4f8b\u5167\u5bb9 68",
  "- \u6839\u64da：\u7bc4\u4f8b\u5167\u5bb9 69",
  "",
  "### \u7bc4\u4f8b\u898f\u5247 71（1 \u6b21）",
  "- \u898f\u5247：\u7bc4\u4f8b\u5167\u5bb9 72",
  "- \u9069\u7528：\u7bc4\u4f8b\u5167\u5bb9 73",
  "- \u6839\u64da：\u7bc4\u4f8b\u5167\u5bb9 74",
  "",
  "### \u7bc4\u4f8b\u898f\u5247 76（2 \u6b21）",
  "- \u898f\u5247：\u7bc4\u4f8b\u5167\u5bb9 77",
  "- \u9069\u7528：\u7bc4\u4f8b\u5167\u5bb9 78",
  "- \u6839\u64da：\u7bc4\u4f8b\u5167\u5bb9 79",
  "- \u6839\u64da：\u7bc4\u4f8b\u5167\u5bb9 80",
  "",
  "### \u7bc4\u4f8b\u898f\u5247 82（1 \u6b21）",
  "- \u898f\u5247：\u7bc4\u4f8b\u5167\u5bb9 83",
  "- \u9069\u7528：\u7bc4\u4f8b\u5167\u5bb9 84",
  "- \u6839\u64da：\u7bc4\u4f8b\u5167\u5bb9 85",
  "",
  "### \u7bc4\u4f8b\u898f\u5247 87（1 \u6b21）",
  "- \u898f\u5247：\u7bc4\u4f8b\u5167\u5bb9 88",
  "- \u9069\u7528：\u7bc4\u4f8b\u5167\u5bb9 89",
  "- \u6839\u64da：\u7bc4\u4f8b\u5167\u5bb9 90",
  "",
  "### \u7bc4\u4f8b\u898f\u5247 92（1 \u6b21）",
  "- \u898f\u5247：\u7bc4\u4f8b\u5167\u5bb9 93",
  "- \u9069\u7528：\u7bc4\u4f8b\u5167\u5bb9 94",
  "- \u6839\u64da：\u7bc4\u4f8b\u5167\u5bb9 95",
  "",
  "### \u7bc4\u4f8b\u898f\u5247 97（2 \u6b21）",
  "- \u898f\u5247：\u7bc4\u4f8b\u5167\u5bb9 98",
  "- \u9069\u7528：\u7bc4\u4f8b\u5167\u5bb9 99",
  "- \u6839\u64da：\u7bc4\u4f8b\u5167\u5bb9 100",
  "- \u6839\u64da：\u7bc4\u4f8b\u5167\u5bb9 101",
  "",
  "### \u7bc4\u4f8b\u898f\u5247 103（4 \u6b21）",
  "- \u898f\u5247：\u7bc4\u4f8b\u5167\u5bb9 104",
  "- \u9069\u7528：\u7bc4\u4f8b\u5167\u5bb9 105",
  "- \u6839\u64da：\u7bc4\u4f8b\u5167\u5bb9 106",
  "- \u6839\u64da：\u7bc4\u4f8b\u5167\u5bb9 107",
  "- \u6839\u64da：\u7bc4\u4f8b\u5167\u5bb9 108",
  "",
  "### \u7bc4\u4f8b\u898f\u5247 110（2 \u6b21）",
  "- \u898f\u5247：\u7bc4\u4f8b\u5167\u5bb9 111",
  "- \u9069\u7528：\u7bc4\u4f8b\u5167\u5bb9 112",
  "- \u6839\u64da：\u7bc4\u4f8b\u5167\u5bb9 113",
  "- \u6839\u64da：\u7bc4\u4f8b\u5167\u5bb9 114",
  "",
  "### \u7bc4\u4f8b\u898f\u5247 116（2 \u6b21）",
  "- \u898f\u5247：\u7bc4\u4f8b\u5167\u5bb9 117",
  "- \u9069\u7528：\u7bc4\u4f8b\u5167\u5bb9 118",
  "- \u6839\u64da：\u7bc4\u4f8b\u5167\u5bb9 119",
  "- \u6839\u64da：\u7bc4\u4f8b\u5167\u5bb9 120",
  "",
  "### \u7bc4\u4f8b\u898f\u5247 122（1 \u6b21）",
  "- \u898f\u5247：\u7bc4\u4f8b\u5167\u5bb9 123",
  "- \u9069\u7528：\u7bc4\u4f8b\u5167\u5bb9 124",
  "- \u6839\u64da：\u7bc4\u4f8b\u5167\u5bb9 125",
  "",
  "### \u7bc4\u4f8b\u898f\u5247 127（1 \u6b21）",
  "- \u898f\u5247：\u7bc4\u4f8b\u5167\u5bb9 128",
  "- \u9069\u7528：\u7bc4\u4f8b\u5167\u5bb9 129",
  "- \u6839\u64da：\u7bc4\u4f8b\u5167\u5bb9 130",
  "",
  "### \u7bc4\u4f8b\u898f\u5247 132（1 \u6b21）",
  "- \u898f\u5247：\u7bc4\u4f8b\u5167\u5bb9 133",
  "- \u9069\u7528：\u7bc4\u4f8b\u5167\u5bb9 134",
  "- \u6839\u64da：\u7bc4\u4f8b\u5167\u5bb9 135",
  "",
  "### \u7bc4\u4f8b\u898f\u5247 137（1 \u6b21）",
  "- \u898f\u5247：\u7bc4\u4f8b\u5167\u5bb9 138",
  "- \u9069\u7528：\u7bc4\u4f8b\u5167\u5bb9 139",
  "- \u6839\u64da：\u7bc4\u4f8b\u5167\u5bb9 140",
  "",
  "### \u7bc4\u4f8b\u898f\u5247 142（1 \u6b21）",
  "- \u898f\u5247：\u7bc4\u4f8b\u5167\u5bb9 143",
  "- \u9069\u7528：\u7bc4\u4f8b\u5167\u5bb9 144",
  "- \u6839\u64da：\u7bc4\u4f8b\u5167\u5bb9 145",
  "",
  "### \u7bc4\u4f8b\u898f\u5247 147（1 \u6b21）",
  "- \u898f\u5247：\u7bc4\u4f8b\u5167\u5bb9 148",
  "- \u9069\u7528：\u7bc4\u4f8b\u5167\u5bb9 149",
  "- \u6839\u64da：\u7bc4\u4f8b\u5167\u5bb9 150",
  "",
  "### \u7bc4\u4f8b\u898f\u5247 152（1 \u6b21）",
  "- \u898f\u5247：\u7bc4\u4f8b\u5167\u5bb9 153",
  "- \u9069\u7528：\u7bc4\u4f8b\u5167\u5bb9 154",
  "- \u6839\u64da：\u7bc4\u4f8b\u5167\u5bb9 155",
  "",
  "### \u7bc4\u4f8b\u898f\u5247 157（1 \u6b21）",
  "- \u898f\u5247：\u7bc4\u4f8b\u5167\u5bb9 158",
  "- \u9069\u7528：\u7bc4\u4f8b\u5167\u5bb9 159",
  "- \u6839\u64da：\u7bc4\u4f8b\u5167\u5bb9 160",
  "",
  "### \u7bc4\u4f8b\u898f\u5247 162（1 \u6b21）",
  "- \u898f\u5247：\u7bc4\u4f8b\u5167\u5bb9 163",
  "- \u9069\u7528：\u7bc4\u4f8b\u5167\u5bb9 164",
  "- \u6839\u64da：\u7bc4\u4f8b\u5167\u5bb9 165",
  "",
  "### \u7bc4\u4f8b\u898f\u5247 167（1 \u6b21）",
  "- \u898f\u5247：\u7bc4\u4f8b\u5167\u5bb9 168",
  "- \u9069\u7528：\u7bc4\u4f8b\u5167\u5bb9 169",
  "- \u6839\u64da：\u7bc4\u4f8b\u5167\u5bb9 170",
  "",
  "### \u7bc4\u4f8b\u898f\u5247 172（1 \u6b21）",
  "- \u898f\u5247：\u7bc4\u4f8b\u5167\u5bb9 173",
  "- \u9069\u7528：\u7bc4\u4f8b\u5167\u5bb9 174",
  "- \u6839\u64da：\u7bc4\u4f8b\u5167\u5bb9 175",
  "",
  "### \u7bc4\u4f8b\u898f\u5247 177（1 \u6b21）",
  "- \u898f\u5247：\u7bc4\u4f8b\u5167\u5bb9 178",
  "- \u9069\u7528：\u7bc4\u4f8b\u5167\u5bb9 179",
  "- \u6839\u64da：\u7bc4\u4f8b\u5167\u5bb9 180",
  "",
].join('\n')

const stripStamp = (s: string) => s.replace(/^> \u6700\u5f8c\u66f4\u65b0：.*$/m, '')

test('S7 \u771f\u5be6\u7d93\u9a57\u6a94\u8907\u672c：\u89e3\u6790\u518d\u8f38\u51fa（\u6263\u6389\u66f4\u65b0\u6642\u9593）\u5b8c\u5168\u76f8\u540c', async ($, on) => {
  let n = 5
  const w = world(on, 100_000, 1_000_000, {}, [], () => n)
  w.files.set(NOTES, NOTES_FIXTURE)
  const items = NOTES_FIXTURE.split('\n').filter(l => l.startsWith('- [')).length
  // ： parse → render，
  ctl.distillReply = actionsReply({ op: 'add_memory', type: 'project', title: '\u66ab\u6642\u7684\u4e00\u689d', evidence: '\u6e2c\u8a66' })
  await distillNow($)
  expect(w.files.get(NOTES) ?? '').toContain('\u66ab\u6642\u7684\u4e00\u689d')
  n = 9
  ctl.distillReply = actionsReply({ op: 'delete_memory', id: `M${items + 1}`, reason: '\u9084\u539f' })
  await distillNow($)
  const out = w.files.get(NOTES) ?? ''
  expect(out).not.toContain('\u66ab\u6642\u7684\u4e00\u689d')
  expect(stripStamp(out)).toBe(stripStamp(NOTES_FIXTURE))
})

test('S7 \u8a18\u61b6\u7684\u6b04\u4f4d\u539f\u6a23\u4fdd\u7559、\u8a8d\u4e0d\u5f97\u7684\u5ef6\u7e8c\u884c\u4f75\u9032\u6a19\u984c、\u81ea\u8a02\u5340\u6bb5\u539f\u6a23\u4fdd\u7559；\u540c\u540d\u898f\u5247\u7684 ADD \u7565\u904e', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  w.files.set(NOTES, [
    '# ctx-handoff \u5c08\u6848\u7d93\u9a57',
    '',
    '> \u7531 ctx-handoff \u80cc\u666f\u6574\u7406\u7dad\u8b77，\u53ef\u4ee5\u76f4\u63a5\u7de8\u8f2f。\u65b0\u5c0d\u8a71\u958b\u982d\u6703\u5e36\u5165\u8a18\u61b6，\u4ee5\u53ca\u51fa\u73fe 2 \u6b21\u4ee5\u4e0a\u7684\u898f\u5247。',
    '> \u6700\u5f8c\u66f4\u65b0：2026-01-01 00:00',
    '',
    '## \u8a18\u61b6',
    '- [user] \u7b2c\u4e00\u689d',
    '  \u5ef6\u7e8c\u884c A',
    '  - \u7e2e\u6392\u5b50\u9805',
    '- [project] \u7b2c\u4e8c\u689d',
    '  - \u505a\u6cd5：\u7167\u505a',
    '  - \u7406\u7531：\u56e0\u70ba',
    '  - \u6839\u64da：2026-01-01 abc｜\u767c\u751f\u904e',
    '',
    '## \u898f\u5247',
    '',
    '### \u898f\u5247\u7532（2 \u6b21）',
    '- \u898f\u5247：\u505a\u7532',
    '- \u6839\u64da：2026-01-01 \u4e00',
    '',
    '## \u5099\u8a3b',
    '\u624b\u52d5\u5099\u8a3b\u7b2c\u4e00\u884c',
    '- \u5099\u8a3b\u6e05\u55ae',
    '',
  ].join('\n'))
  ctl.distillReply = actionsReply(
    { op: 'add_memory', type: 'project', title: '\u65b0\u589e\u7684\u4e00\u689d', evidence: '\u65b0\u7684' },
    { op: 'add_rule', name: '\u898f\u5247\u7532', rule: '\u91cd\u8907\u7684\u5167\u5bb9', applies: 'x', not_applies: 'y', evidence: '\u91cd\u8907' },
    { op: 'add_rule', name: '\u898f\u5247\u4e59', rule: '\u505a\u4e59', applies: 'x', not_applies: 'y', evidence: '\u65b0\u7684' },
  )
  await distillNow($)
  expect(w.completes[0]?.system).toContain('M1 [user] \u7b2c\u4e00\u689d \u5ef6\u7e8c\u884c A - \u7e2e\u6392\u5b50\u9805\nM2 [project] \u7b2c\u4e8c\u689d｜\u505a\u6cd5：\u7167\u505a｜\u7406\u7531：\u56e0\u70ba｜\u6839\u64da：2026-01-01 abc｜\u767c\u751f\u904e')
  const out = w.files.get(NOTES) ?? ''
  expect(out).toContain([
    '## \u8a18\u61b6',
    '- [user] \u7b2c\u4e00\u689d \u5ef6\u7e8c\u884c A - \u7e2e\u6392\u5b50\u9805',
    '- [project] \u7b2c\u4e8c\u689d',
    '  - \u505a\u6cd5：\u7167\u505a',
    '  - \u7406\u7531：\u56e0\u70ba',
    '  - \u6839\u64da：2026-01-01 abc｜\u767c\u751f\u904e',
    '- [project] \u65b0\u589e\u7684\u4e00\u689d',
    '  - \u6839\u64da：1970-01-01 S1｜\u65b0\u7684',
    '',
  ].join('\n'))
  expect(out).toContain('### \u898f\u5247\u7532（2 \u6b21）\n- \u898f\u5247：\u505a\u7532\n- \u6839\u64da：2026-01-01 \u4e00\n')
  expect(out).not.toContain('\u91cd\u8907\u7684\u5167\u5bb9')
  expect(out.split('### \u898f\u5247\u7532').length).toBe(2)
  expect(out).toContain('### \u898f\u5247\u4e59（1 \u6b21）')
  expect(out).toContain('## \u5099\u8a3b\n\u624b\u52d5\u5099\u8a3b\u7b2c\u4e00\u884c\n- \u5099\u8a3b\u6e05\u55ae\n')
  // 
  expect(out.indexOf('## \u5099\u8a3b')).toBeGreaterThan(out.indexOf('### \u898f\u5247\u4e59'))
})

// mock.clock  0 ： 1970-01-01， 30 
const TIERED_NOTES = [
  '# ctx-handoff \u5c08\u6848\u7d93\u9a57', '', '## \u8a18\u61b6',
  '- [feedback] \u56de\u5831\u7528\u689d\u5217', '  - \u505a\u6cd5：\u4e00\u9ede\u4e00\u884c', '  - \u7406\u7531：\u597d\u8b80', '  - \u6839\u64da：1969-12-25 abc｜\u4f7f\u7528\u8005\u539f\u8a71：「\u7528\u689d\u5217」',
  '- [project] \u65b0\u9bae\u7684\u4e8b\u5be6', '  - \u505a\u6cd5：\u7d30\u7bc0\u53ea\u5728\u6b63\u672c', '  - \u6839\u64da：1969-12-20 abc｜\u6700\u8fd1\u8b49\u5be6\u904e',
  '- [reference] \u5f88\u4e45\u6c92\u8b49\u5be6\u7684\u4f4d\u7f6e', '  - \u6839\u64da：1969-11-01 abc｜\u5f88\u4e45\u4ee5\u524d',
  '- [project] \u6c92\u6709\u65e5\u671f\u7684\u4e8b\u5be6',
  '', '## \u898f\u5247',
].join('\n')

test('S7 \u8a18\u61b6\u4f9d\u985e\u578b\u5e36\u5165：\u72c0\u614b\u986f\u793a\u6574\u689d、\u53ea\u5e36\u6a19\u984c、\u5c01\u5b58\u5404\u5e7e\u689d（\u4e0d\u518d\u56e0\u689d\u6578\u591a\u800c\u4e0d\u5e36\u5165）', async ($, on) => {
  const w = world(on, 100_000)
  const memory = Array.from({ length: 42 }, (_, i) => `- [project] \u7b2c ${i + 1} \u689d`)
  w.files.set(NOTES, TIERED_NOTES.replace('\n\n## \u898f\u5247', ['', ...memory, '', '## \u898f\u5247'].join('\n')))
  const s = (await cmd($, '')).text
  expect(s).toContain('\u8a18\u61b6\u5e36\u5165：\u504f\u597d\u8207\u4fee\u6b63 1 \u689d\u6574\u689d、\u4e8b\u5be6\u8207\u4f4d\u7f6e 44 \u689d\u53ea\u5e36\u6a19\u984c、\u5c01\u5b58 1 \u689d')
})

// ---------- POSIX （Linux／macOS）：HOME=/home/u、 /home/u/proj ----------
//  Windows ； /home/... ，
const POSIX_PROJECTS = '/home/u/.claude/projects'
const posixWorld = (on: On) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  ctl.envVars = { HOME: '/home/u' }
  ctl.curRoot = '/home/u/proj'
  ctl.curCwd = '/home/u/proj'
  return w
}

test('POSIX：\u7d93\u9a57\u6a94\u5728 <HOME>/.claude/projects/<-home-u-proj>/memory，\u6574\u7406\u5beb\u9032\u53bb', async ($, on) => {
  const w = posixWorld(on)
  await distillNow($)
  expect(w.files.get(`${POSIX_PROJECTS}/-home-u-proj/memory/ctx-handoff.md`) ?? '').toContain('\u4f7f\u7528\u8005\u6c7a\u5b9a\u4ea4\u63a5\u9580\u6abb\u7dad\u6301 600k')
  expect(w.get('distill:last:-home-u-proj')).toBeDefined()
})

test('POSIX：CLAUDE_CONFIG_DIR \u512a\u5148\u65bc HOME', async ($, on) => {
  const w = posixWorld(on)
  ctl.envVars = { HOME: '/home/u', CLAUDE_CONFIG_DIR: '/opt/claude-cfg' }
  await distillNow($)
  expect(w.files.get('/opt/claude-cfg/projects/-home-u-proj/memory/ctx-handoff.md') ?? '').toContain('\u4f7f\u7528\u8005\u6c7a\u5b9a\u4ea4\u63a5\u9580\u6abb\u7dad\u6301 600k')
})

test('POSIX：\u5f9e git worktree \u555f\u52d5，\u7d93\u9a57\u6a94\u8ddf\u8457\u4e3b\u5de5\u4f5c\u6a39（\u7d55\u5c0d\u8def\u5f91 gitdir）', async ($, on) => {
  const w = posixWorld(on)
  const MAIN_NOTES = `${POSIX_PROJECTS}/-home-u-main/memory/ctx-handoff.md`
  w.files.set('/home/u/proj/.git', 'gitdir: /home/u/main/.git/worktrees/feat\n')
  w.files.set(MAIN_NOTES, EXISTING)
  await distillNow($)
  expect(w.files.get(MAIN_NOTES) ?? '').toContain('\u4f7f\u7528\u8005\u6c7a\u5b9a\u4ea4\u63a5\u9580\u6abb\u7dad\u6301 600k')
  expect(w.files.has(`${POSIX_PROJECTS}/-home-u-proj/memory/ctx-handoff.md`)).toBe(false)
})

test('POSIX：worktree \u7684 gitdir \u662f\u76f8\u5c0d\u8def\u5f91，\u4ecd\u5c0d\u5230\u4e3b\u5de5\u4f5c\u6a39', async ($, on) => {
  const w = posixWorld(on)
  const MAIN_NOTES = `${POSIX_PROJECTS}/-home-u-main/memory/ctx-handoff.md`
  w.files.set('/home/u/proj/.git', 'gitdir: ../main/.git/worktrees/feat\n')
  w.files.set(MAIN_NOTES, EXISTING)
  await distillNow($)
  expect(w.files.get(MAIN_NOTES) ?? '').toContain('\u4f7f\u7528\u8005\u6c7a\u5b9a\u4ea4\u63a5\u9580\u6abb\u7dad\u6301 600k')
})

test('\u6574\u7406\u6709\u8b8a\u52d5：\u8df3\u51fa\u63d0\u793a，\u5beb\u51fa\u9805\u6578\u8207\u7d93\u9a57\u6a94\u7684\u5b8c\u6574\u8def\u5f91；\u6c92\u6709\u8b8a\u52d5\u4e0d\u63d0\u793a', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  ctl.distillReply = actionsReply(
    { op: 'add_memory', type: 'project', title: '\u7b2c\u4e00\u689d\u65b0\u8a18\u61b6', evidence: 'x' },
    { op: 'add_memory', type: 'project', title: '\u7b2c\u4e8c\u689d\u65b0\u8a18\u61b6', evidence: 'x' },
  )
  await distillNow($)
  const toast = w.toasts.find(t => t.includes('\u7d93\u9a57\u5df2\u66f4\u65b0'))
  expect(toast).toContain('\u7d93\u9a57\u5df2\u66f4\u65b0 2 \u9805，\u6703\u8ddf\u8457\u4f60\u4e0b\u4e00\u5247\u8a0a\u606f\u5e36\u5165')
  expect(toast).toContain(NOTES)
  ctl.distillReply = actionsReply()
  await say($, '\u518d\u4e00\u5247')
  const before = w.toasts.length
  await distillNow($)
  expect(w.toasts.slice(before).some(t => t.includes('\u7d93\u9a57\u5df2\u66f4\u65b0'))).toBe(false)
})

test('\u5f9e worktree \u555f\u52d5、\u4e3b\u5de5\u4f5c\u6a39\u9084\u6c92\u6709\u7d93\u9a57\u6a94：\u5efa\u5728\u4e3b\u5de5\u4f5c\u6a39，\u4e0d\u5efa\u5728 worktree \u7684\u5c0d\u8a71\u6a94\u76ee\u9304', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  const MAIN_NOTES = `${CLAUDE_PROJECTS}/D--main/memory/ctx-handoff.md`
  w.files.set('C:/proj/.git', 'gitdir: D:/main/.git/worktrees/feat\n')
  await distillNow($)
  expect(w.files.get(MAIN_NOTES) ?? '').toContain('\u4f7f\u7528\u8005\u6c7a\u5b9a\u4ea4\u63a5\u9580\u6abb\u7dad\u6301 600k')
  expect(w.files.has(NOTES)).toBe(false)
})

// ---------- ：＋ ----------
test('\u8a18\u61b6：user／feedback \u8981\u9644\u4f7f\u7528\u8005\u8a0a\u606f\u88e1\u627e\u5f97\u5230\u7684\u539f\u8a71；\u672c\u7a0b\u5f0f\u6ce8\u5165\u7684\u8a0a\u606f\u4e0d\u7b97', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  w.rows.push(
    { role: 'user', text: '\u4ee5\u5f8c\u56de\u5831\u90fd\u7528\u689d\u5217', toolUses: [] },
    { role: 'user', text: '[ctx-handoff] \u4e0a\u4e00\u6bb5\u5c0d\u8a71\u7684 handoff：\u4f7f\u7528\u8005\u8981\u6c42\u6bcf\u6b21\u90fd\u8dd1\u5168\u5957\u6e2c\u8a66', toolUses: [] },
  )
  ctl.distillReply = actionsReply(
    { op: 'add_memory', type: 'user', title: '\u56de\u5831\u7528\u689d\u5217', evidence: '\u4f7f\u7528\u8005\u8aaa\u7684', quote: '\u4ee5\u5f8c\u56de\u5831 \u90fd\u7528\u689d\u5217' },
    { op: 'add_memory', type: 'feedback', title: '\u6c92\u6709\u539f\u8a71', evidence: 'x' },
    { op: 'add_memory', type: 'user', title: '\u634f\u9020\u7684\u539f\u8a71', evidence: 'x', quote: '\u6bcf\u6b21\u90fd\u8981\u5beb\u6e2c\u8a66' },
    { op: 'add_memory', type: 'feedback', title: '\u5f15\u7528 handoff', evidence: 'x', quote: '\u6bcf\u6b21\u90fd\u8dd1\u5168\u5957\u6e2c\u8a66' },
  )
  await distillNow($)
  const notes = w.files.get(NOTES) ?? ''
  expect(notes).toContain('- [user] \u56de\u5831\u7528\u689d\u5217')
  expect(notes).toContain('\u4f7f\u7528\u8005\u539f\u8a71：「\u4ee5\u5f8c\u56de\u5831 \u90fd\u7528\u689d\u5217」')
  expect(notes).not.toMatch(/\u6c92\u6709\u539f\u8a71|\u634f\u9020\u7684\u539f\u8a71|\u5f15\u7528 handoff/)
  const { rejected } = lastOf(w)
  expect(rejected.count).toBe(3)
  expect(rejected.samples[0]).toStartWith('feedback \u985e\u7f3a\u5c11\u4f7f\u7528\u8005\u539f\u8a71 quote')
  expect(rejected.samples[1]).toStartWith('quote \u4e0d\u5728\u4f7f\u7528\u8005\u8a0a\u606f\u88e1')
})

test('\u8a18\u61b6\u8207\u898f\u5247：\u8d85\u904e\u5b57\u6578\u4e0a\u9650\u6574\u689d\u4e1f\u6389，\u8a18\u4e0b\u539f\u56e0', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  ctl.distillReply = actionsReply(
    { op: 'add_memory', type: 'project', title: '\u9577'.repeat(61), evidence: 'x' },
    { op: 'add_memory', type: 'project', title: '\u525b\u597d', how: '\u505a'.repeat(101), evidence: 'x' },
    { op: 'add_rule', name: '\u898f\u5247', rule: '\u6b65'.repeat(151), applies: 'a', not_applies: 'b', evidence: 'c' },
    { op: 'add_memory', type: 'project', title: '\u9577'.repeat(60), evidence: 'x' },
  )
  await distillNow($)
  const notes = w.files.get(NOTES) ?? ''
  expect(notes).toContain(`- [project] ${'\u9577'.repeat(60)}`)
  expect(notes).not.toContain('\u525b\u597d')
  const { rejected } = lastOf(w)
  expect(rejected.count).toBe(3)
  expect(rejected.samples).toEqual([
    expect.stringMatching(/^title \u8d85\u904e 60 \u5b57/),
    expect.stringMatching(/^how \u8d85\u904e 100 \u5b57/),
    expect.stringMatching(/^rule \u8d85\u904e 150 \u5b57/),
  ])
})

test('\u8a18\u61b6\u5e36\u5165\u65b0\u5c0d\u8a71：\u504f\u597d\u8207\u4fee\u6b63\u6574\u689d、\u4e8b\u5be6\u53ea\u5e36\u6a19\u984c、\u5c01\u5b58\u7684\u4e0d\u5e36，\u90fd\u4e0d\u5e36\u6839\u64da', async ($, on) => {
  const w = world(on, 1000)
  w.files.set(NOTES, TIERED_NOTES)
  const r = await $.prompt.context({ blocks: [] })
  const text = r.blocks.find(b => b.name === 'ctxHandoffProject')?.text ?? ''
  expect(text).toContain(['## \u4f7f\u7528\u8005\u7684\u504f\u597d\u8207\u4fee\u6b63（\u7167\u505a，\u4e0d\u7528\u518d\u554f\u4f7f\u7528\u8005）', '- [feedback] \u56de\u5831\u7528\u689d\u5217', '  - \u505a\u6cd5：\u4e00\u9ede\u4e00\u884c', '  - \u7406\u7531：\u597d\u8b80'].join('\n'))
  expect(text).toContain(['- [project] \u65b0\u9bae\u7684\u4e8b\u5be6', '- [project] \u6c92\u6709\u65e5\u671f\u7684\u4e8b\u5be6'].join('\n'))
  expect(text).not.toContain('\u7d30\u7bc0\u53ea\u5728\u6b63\u672c')
  expect(text).not.toContain('\u5f88\u4e45\u6c92\u8b49\u5be6\u7684\u4f4d\u7f6e')
  expect(text).not.toMatch(/\u6839\u64da|\u4f7f\u7528\u8005\u539f\u8a71/)
})

test('\u8a18\u61b6\u78ba\u8a8d：confirm_memory \u52a0\u4e00\u7b46\u6839\u64da，\u5c01\u5b58\u7684\u56e0\u6b64\u6062\u5fa9\u5e36\u5165；\u6574\u7406\u63d0\u793a\u6a19\u51fa\u5c01\u5b58', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  w.files.set(NOTES, TIERED_NOTES)
  ctl.distillReply = actionsReply({ op: 'confirm_memory', id: 'M3', evidence: '\u9019\u6b21\u53c8\u67e5\u4e86\u4e00\u6b21\u4f4d\u7f6e' })
  await distillNow($)
  expect(w.completes[0]?.system).toContain('M3 [reference] \u5f88\u4e45\u6c92\u8b49\u5be6\u7684\u4f4d\u7f6e｜\u6839\u64da：1969-11-01 abc｜\u5f88\u4e45\u4ee5\u524d（\u5df2\u5c01\u5b58：\u8d85\u904e 30 \u5929\u6c92\u88ab\u8b49\u5be6）')
  const notes = w.files.get(NOTES) ?? ''
  expect(notes).toContain(['- [reference] \u5f88\u4e45\u6c92\u8b49\u5be6\u7684\u4f4d\u7f6e', '  - \u6839\u64da：1969-11-01 abc｜\u5f88\u4e45\u4ee5\u524d', '  - \u6839\u64da：1970-01-01 S1｜\u9019\u6b21\u53c8\u67e5\u4e86\u4e00\u6b21\u4f4d\u7f6e'].join('\n'))
  expect(lastOf(w).changes).toEqual(['\u8a18\u61b6\u78ba\u8a8d：[reference] \u5f88\u4e45\u6c92\u8b49\u5be6\u7684\u4f4d\u7f6e'])
  const r = await $.prompt.context({ blocks: [] })
  expect(r.blocks.find(b => b.name === 'ctxHandoffProject')?.text).toContain('- [reference] \u5f88\u4e45\u6c92\u8b49\u5be6\u7684\u4f4d\u7f6e')
})

// （2026-10-14，issue #3）： session ，
test('\u8a18\u61b6\u78ba\u8a8d：\u540c\u4e00\u500b session \u518d\u78ba\u8a8d，\u63db\u6389\u5b83\u4e4b\u524d\u7684\u6839\u64da，\u4e0d\u591a\u4e00\u884c', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  w.files.set(NOTES, TIERED_NOTES)
  ctl.distillReply = actionsReply(
    { op: 'confirm_memory', id: 'M3', evidence: '\u67e5\u4e86\u4f4d\u7f6e' },
    { op: 'confirm_memory', id: 'M3', evidence: '\u53c8\u67e5\u4e86\u4e00\u6b21\u4f4d\u7f6e' },
  )
  await distillNow($)
  const notes = w.files.get(NOTES) ?? ''
  expect(notes).toContain(['- [reference] \u5f88\u4e45\u6c92\u8b49\u5be6\u7684\u4f4d\u7f6e', '  - \u6839\u64da：1969-11-01 abc｜\u5f88\u4e45\u4ee5\u524d', '  - \u6839\u64da：1970-01-01 S1｜\u53c8\u67e5\u4e86\u4e00\u6b21\u4f4d\u7f6e'].join('\n'))
  expect(notes).not.toContain('S1｜\u67e5\u4e86\u4f4d\u7f6e')
})

test('\u9762\u677f：\u5c01\u5b58\u7684\u8a18\u61b6\u53e6\u5217\u4e00\u5340，\u6309\u7559\u4e0b\u5c31\u52a0\u4e00\u7b46\u4eca\u5929\u7684\u6839\u64da\u4e26\u6062\u5fa9', async ($, on) => {
  const w = world(on, 1000)
  w.files.set(NOTES, TIERED_NOTES)
  const ui = await openPanel($, 'memory')
  expect(await ui.find({ type: 'Text', text: /\u5c01\u5b58 1 \u689d：\u8d85\u904e 30 \u5929\u6c92\u88ab\u8b49\u5be6/ })).toBeDefined()
  await ui.press({ key: 'keep:[reference] \u5f88\u4e45\u6c92\u8b49\u5be6\u7684\u4f4d\u7f6e' })
  await w.clock.advance(0)
  expect(w.files.get(NOTES) ?? '').toContain('  - \u6839\u64da：1970-01-01｜\u5728\u9762\u677f\u78ba\u8a8d\u7559\u4e0b')
  expect(await ui.find({ type: 'Text', text: /^\u5c01\u5b58 \d+ \u689d/ })).toBeUndefined()
  expect(await ui.find({ type: 'Text', text: /\u5df2\u7559\u4e0b：\u5f88\u4e45\u6c92\u8b49\u5be6\u7684\u4f4d\u7f6e/ })).toBeDefined()
})

test('\u8a18\u61b6\u7684\u6839\u64da：\u6a21\u578b\u81ea\u5df1\u5728\u958b\u982d\u5beb\u7684\u65e5\u671f\u53bb\u6389，\u53ea\u7559\u7a0b\u5f0f\u88dc\u7684\u90a3\u4e00\u500b', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  ctl.distillReply = actionsReply({ op: 'add_memory', type: 'project', title: '\u6709\u65e5\u671f\u7684\u6839\u64da', evidence: '1970-01-01｜PR #1 \u5be6\u6e2c' })
  await distillNow($)
  expect(w.files.get(NOTES) ?? '').toContain('  - \u6839\u64da：1970-01-01 S1｜PR #1 \u5be6\u6e2c')
})

test('\u504f\u597d\u8207\u4fee\u6b63\u4f9d\u71b1\u5ea6\u8207\u6b21\u6578\u5206\u7d1a：14 \u5929\u5167\u6216 ≥2 \u7b46\u6839\u64da\u6574\u689d\u5e36\u5165；\u51b7\u6389\u7684\u55ae\u6b21 user \u53ea\u5e36\u6a19\u984c；\u8d85\u904e 30 \u5929\u7684\u55ae\u6b21 feedback \u5c01\u5b58', async ($, on) => {
  const w = world(on, 1000)
  w.files.set(NOTES, [
    '# ctx-handoff \u5c08\u6848\u7d93\u9a57', '', '## \u8a18\u61b6',
    '- [feedback] \u8b1b\u904e\u5169\u6b21\u7684\u8001\u7fd2\u6163', '  - \u505a\u6cd5：\u7167\u505a\u5169\u6b21', '  - \u7406\u7531：\u5e38\u72af', '  - \u6839\u64da：1969-06-01 a｜\u7b2c\u4e00\u6b21', '  - \u6839\u64da：1969-07-01 b｜\u7b2c\u4e8c\u6b21',
    '- [user] 20 \u5929\u524d\u8b1b\u904e\u4e00\u6b21\u7684\u504f\u597d', '  - \u505a\u6cd5：\u51b7\u6389\u7684\u505a\u6cd5', '  - \u7406\u7531：\u51b7\u6389\u7684\u7406\u7531', '  - \u6839\u64da：1969-12-12 a｜\u4e00\u6b21',
    '- [feedback] 20 \u5929\u524d\u8b1b\u904e\u4e00\u6b21\u7684\u4fee\u6b63', '  - \u505a\u6cd5：\u4e8c\u5341\u5929\u505a\u6cd5', '  - \u6839\u64da：1969-12-12 b｜\u4e00\u6b21',
    '- [feedback] 40 \u5929\u524d\u8b1b\u904e\u4e00\u6b21\u7684\u4fee\u6b63', '  - \u505a\u6cd5：\u5f88\u4e45\u4ee5\u524d\u67d0\u9801\u4fee\u6b63', '  - \u6839\u64da：1969-11-10 c｜\u4e00\u6b21',
    '', '## \u898f\u5247',
  ].join('\n'))
  const r = await $.prompt.context({ blocks: [] })
  const text = r.blocks.find(b => b.name === 'ctxHandoffProject')?.text ?? ''
  expect(text).toContain(['- [feedback] \u8b1b\u904e\u5169\u6b21\u7684\u8001\u7fd2\u6163', '  - \u505a\u6cd5：\u7167\u505a\u5169\u6b21', '  - \u7406\u7531：\u5e38\u72af'].join('\n'))
  expect(text).toContain('- [user] 20 \u5929\u524d\u8b1b\u904e\u4e00\u6b21\u7684\u504f\u597d')
  expect(text).toContain('- [feedback] 20 \u5929\u524d\u8b1b\u904e\u4e00\u6b21\u7684\u4fee\u6b63')
  expect(text).not.toContain('\u51b7\u6389\u7684\u505a\u6cd5')
  expect(text).not.toContain('\u4e8c\u5341\u5929\u505a\u6cd5')
  expect(text).not.toContain('40 \u5929\u524d\u8b1b\u904e\u4e00\u6b21\u7684\u4fee\u6b63')
  expect((await cmd($, '')).text).toContain('\u8a18\u61b6\u5e36\u5165：\u504f\u597d\u8207\u4fee\u6b63 1 \u689d\u6574\u689d、\u4e8b\u5be6\u8207\u4f4d\u7f6e 2 \u689d\u53ea\u5e36\u6a19\u984c、\u5c01\u5b58 1 \u689d')
})

test('\u5bb6\u76ee\u9304\u5de5\u4f5c\u5340：\u4e0d\u81ea\u52d5\u6574\u7406\u4e5f\u4e0d\u81ea\u52d5\u5e36\u5165\u5c08\u6848\u7b46\u8a18，\u624b\u52d5 /handoff distill \u4ecd\u53ef\u7528', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 30)
  ctl.curRoot = 'C:/Users/u'
  ctl.curCwd = 'C:/Users/u'
  const HOME_NOTES = 'C:/Users/u/.claude/projects/C--Users-u/memory/ctx-handoff.md'
  w.files.set(HOME_NOTES, TIERED_NOTES)
  const ctx = await $.prompt.context({ blocks: [] })
  expect(ctx.blocks).toEqual([])
  await say($, '\u5728\u5bb6\u76ee\u9304\u554f\u500b\u554f\u984c')
  await endTurn($)
  await w.clock.advance(0)
  expect(w.completes.length).toBe(0)
  await distillNow($)
  expect(w.completes.length).toBe(1)
})

test('\u975e ASCII \u540c\u5b57\u6578\u5de5\u4f5c\u5340（\u5982 D:/work/\u8ab2\u7a0b \u8207 D:/work/\u6587\u7ae0）：\u7d93\u9a57\u6a94\u5404\u81ea\u7368\u7acb，\u4e0d\u6df7\u5165\u5225\u684c\u5c0d\u8a71', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  ctl.curRoot = 'D:/work/\u8ab2\u7a0b'
  ctl.curCwd = 'D:/work/\u8ab2\u7a0b'
  await distillNow($)
  const written = [...w.files.keys()].filter(k => k.startsWith(`${CLAUDE_PROJECTS}/D--work---`) && k.endsWith('/memory/ctx-handoff.md'))
  expect(written.length).toBe(1)
  expect(w.files.get(written[0]!) ?? '').toContain('\u4f7f\u7528\u8005\u6c7a\u5b9a\u4ea4\u63a5\u9580\u6abb\u7dad\u6301 600k')

  ctl.curRoot = 'D:/work/\u6587\u7ae0'
  ctl.curCwd = 'D:/work/\u6587\u7ae0'
  const ctx = await $.prompt.context({ blocks: [] })
  expect(ctx.blocks.find(b => b.name === 'ctxHandoffProject')).toBeUndefined()
})

