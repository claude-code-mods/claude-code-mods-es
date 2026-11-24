// ： JSONL 、、、、
import { expect, test } from 'claude-code/testing'
import type { Engine } from 'claude-code/testing'
import { NOTE_TAG, composer, cmd, say, endTurn, stop, NOTES, distillNow, EXISTING, ALPHA, ALPHA_NOTES, repo, lastOf, actionsReply, ctl, world } from './test-world'

test('\u72c0\u614b\u5217\u986f\u793a\u6574\u7406\u9032\u5ea6：\u5e73\u5e38\u662f\u518d\u5e7e\u5247\u6574\u7406，\u6574\u7406\u6642\u986f\u793a\u6b63\u5728\u6574\u7406，\u6574\u7406\u5b8c\u91cd\u7b97', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  await endTurn($)
  expect(w.statuses.at(-1)).toBe('\u518d 25 \u5247\u6574\u7406\u7b46\u8a18')
  expect((await cmd($, '')).text).toContain('\u4e0b\u6b21：\u518d 25 \u5247')
  await distillNow($)
  expect(w.statuses).toContain('\u6b63\u5728\u6574\u7406\u7b46\u8a18…')
  expect(w.get('distill:error:C--proj')).toBeUndefined()
  expect(w.statuses.at(-1)).toBe('\u518d 30 \u5247\u6574\u7406\u7b46\u8a18')
  await cmd($, 'distill off')
  expect(w.statuses.at(-1)).toBeUndefined()
})

test('\u9592\u7f6e\u5237\u65b0\u9806\u4fbf\u6574\u7406：\u5beb\u5165\u5c08\u6848\u7d93\u9a57\u6a94、\u6ffe\u6389\u7591\u4f3c\u91d1\u9470、\u5dee\u7570\u6392\u5165\u4e0b\u4e00\u5247\u8a0a\u606f，\u6c92\u65b0\u8a0a\u606f\u5c31\u53ea\u5237\u65b0', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  await $.prompt.submit({ text: '\u8acb\u5e6b\u6211  \u6574\u7406\n\u9019\u6bb5\u5c0d\u8a71', origin: composer, wait: false })
  await endTurn($)
  await w.clock.advance(55 * 60_000)
  //  OK  fork， complete ，
  expect(w.forks).toEqual(['\u53ea\u56de\u8986 OK'])
  expect(w.completes.length).toBe(1)
  expect(w.completes[0]?.system).toContain('\u7bc4\u570d：\u6574\u6bb5\u5c0d\u8a71')
  expect(w.completes[0]?.prompt).toContain('【\u4f7f\u7528\u8005】\u8acb\u5e6b\u6211  \u6574\u7406\n\u9019\u6bb5\u5c0d\u8a71')
  expect(w.completes[0]).toMatchObject({ model: 'claude-sonnet-5-5', effort: 'low' })
  const notes = w.files.get(NOTES) ?? ''
  expect(notes).toContain('## \u8a18\u61b6\n- [project] \u4f7f\u7528\u8005\u6c7a\u5b9a\u4ea4\u63a5\u9580\u6abb\u7dad\u6301 600k')
  expect(notes).not.toContain('api_key')
  expect(notes).toContain('### \u5148\u5be6\u6e2c\u518d\u4e0b\u7d50\u8ad6（1 \u6b21）')
  expect(notes).toContain('- \u6839\u64da：1970-01-01 fork \u80fd\u5426\u8b80\u5beb\u9760\u5be6\u6e2c\u624d\u78ba\u5b9a')
  const status = await cmd($, '')
  expect(status.text).toContain('\u65b0\u589e\u8a18\u61b6：[project] \u4f7f\u7528\u8005\u6c7a\u5b9a\u4ea4\u63a5\u9580\u6abb\u7dad\u6301 600k')
  // ：， OK
  await w.clock.advance(55 * 60_000)
  expect(w.forks).toEqual(['\u53ea\u56de\u8986 OK', '\u53ea\u56de\u8986 OK'])
  expect(w.completes.length).toBe(1)
  //  session.append，
  await say($, '\u4e0b\u4e00\u5247')
  expect(w.contexts[1]?.[0]).toContain(NOTE_TAG)
  expect(w.contexts[1]?.[0]).toContain('\u65b0\u589e\u8a18\u61b6：[project] \u4f7f\u7528\u8005\u6c7a\u5b9a\u4ea4\u63a5\u9580\u6abb\u7dad\u6301 600k')
})

test('\u4ea4\u63a5\u524d\u6574\u7406\u4e00\u6b21，\u518d /clear', async ($, on) => {
  const w = world(on, 650_000, 1_000_000, {}, [], 5)
  await stop($)
  await w.clock.advance(0)
  expect(w.forks.length).toBe(1)
  expect(w.completes.length).toBe(1)
  expect(w.completes[0]?.system).toContain('=== ACTIONS ===')
  expect(w.commands).toEqual(['clear'])
  expect(w.files.get(NOTES) ?? '').toContain('600k')
})

test('\u4f9d\u7de8\u865f\u5957\u7528\u65b0\u589e／\u66f4\u65b0／\u522a\u9664／\u78ba\u8a8d，\u8d85\u51fa\u7bc4\u570d\u7684\u5ffd\u7565；\u9328\u9ede\u63a5\u7e8c\u4e0a\u6b21', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, { 'distill:S1': { turn: 3, anchor: '\u4e0a\u6b21\u6700\u5f8c\u4e00\u5247\u8a0a\u606f' } }, [], 6)
  w.files.set(NOTES, EXISTING)
  ctl.distillReply = actionsReply(
    { op: 'update_memory', id: 'M1', type: 'feedback', title: '\u6539\u904e\u7684 A', quote: '\u4e0a\u6b21\u6700\u5f8c\u4e00\u5247\u8a0a\u606f' },
    { op: 'delete_memory', id: 'M2', reason: '\u5df2\u904e\u6642' },
    { op: 'add_memory', type: 'user', title: '\u65b0\u7684\u504f\u597d', how: '\u7167\u505a', evidence: '\u4f7f\u7528\u8005\u63d0\u904e', quote: '\u66f4\u65e9\u7684…\u8a0a\u606f' },
    { op: 'delete_memory', id: 'M9', reason: '\u8d85\u51fa\u7bc4\u570d' },
    { op: 'confirm_rule', id: 'R1', evidence: '\u53c8\u88ab\u8b49\u5be6\u4e00\u6b21' },
    { op: 'delete_rule', id: 'R2', reason: '\u88ab\u63a8\u7ffb' },
    { op: 'confirm_rule', id: 'R9', evidence: '\u8d85\u51fa\u7bc4\u570d' },
    { op: 'add_rule', name: '\u6c92\u6709\u898f\u5247\u5167\u5bb9\u7684\u689d\u76ee', evidence: '\u7f3a\u898f\u5247，\u61c9\u4e1f\u68c4' },
  )
  w.rows.push(
    { role: 'user', text: '\u66f4\u65e9\u7684\u8a0a\u606f', toolUses: [] },
    { role: 'user', text: '\u4e0a\u6b21\u6700\u5f8c\u4e00\u5247\u8a0a\u606f', toolUses: [] },
    { role: 'assistant', text: '\u597d\u7684', toolUses: [{ tool: 'Bash', input: { command: 'ls' }, text: 'a.ts' }] },
  )
  await distillNow($)
  expect(w.completes[0]?.system).toContain('\u4f7f\u7528\u8005\u8aaa「\u4e0a\u6b21\u6700\u5f8c\u4e00\u5247\u8a0a\u606f」')
  // ；、
  expect(w.completes[0]?.prompt).toContain('【\u52a9\u7406】\u597d\u7684')
  expect(w.completes[0]?.prompt).toContain('〔\u5de5\u5177 Bash〕{"command":"ls"} → a.ts')
  expect(w.completes[0]?.prompt).not.toContain('\u66f4\u65e9\u7684\u8a0a\u606f')
  expect(w.completes[0]?.system).toContain('M1 [feedback] \u820a A')
  expect(w.completes[0]?.system).toContain('R2 \u898f\u5247\u4e8c｜\u51fa\u73fe 2 \u6b21｜\u505a Y')
  const notes = w.files.get(NOTES) ?? ''
  //  session； … 
  expect(notes).toContain([
    '- [feedback] \u6539\u904e\u7684 A',
    '  - \u6839\u64da：1970-01-01 S1｜\u4f7f\u7528\u8005\u539f\u8a71：「\u4e0a\u6b21\u6700\u5f8c\u4e00\u5247\u8a0a\u606f」',
    '- [user] \u65b0\u7684\u504f\u597d',
    '  - \u505a\u6cd5：\u7167\u505a',
    '  - \u6839\u64da：1970-01-01 S1｜\u4f7f\u7528\u8005\u63d0\u904e｜\u4f7f\u7528\u8005\u539f\u8a71：「\u66f4\u65e9\u7684…\u8a0a\u606f」',
  ].join('\n'))
  expect(notes).not.toContain('\u820a B')
  expect(notes).toContain('### \u898f\u5247\u4e00（2 \u6b21）\n- \u898f\u5247：\u505a X\n- \u6839\u64da：1970-01-01 \u7b2c\u4e00\u6b21\n- \u6839\u64da：1970-01-01 \u53c8\u88ab\u8b49\u5be6\u4e00\u6b21')
  expect(notes).not.toContain('\u898f\u5247\u4e8c')
  expect(notes).not.toContain('\u6c92\u6709\u898f\u5247\u5167\u5bb9')
})

test('\u65b0\u5c0d\u8a71\u958b\u982d\u5e36\u5165\u8a18\u61b6\u8207\u51fa\u73fe 2 \u6b21\u4ee5\u4e0a\u7684\u898f\u5247', async ($, on) => {
  const w = world(on, 100_000)
  w.files.set(NOTES, EXISTING)
  const r = await $.prompt.context({ blocks: [{ name: 'currentDate', text: 'today' }] })
  const block = r.blocks.find(b => b.name === 'ctxHandoffProject')
  expect(r.blocks[0]?.name).toBe('currentDate')
  expect(block?.text).toContain('- [feedback] \u820a A')
  expect(block?.text).toContain('- \u898f\u5247\u4e8c（2 \u6b21）：\u505a Y')
  expect(block?.text).not.toContain('\u898f\u5247\u4e00')
})

test('\u6c92\u6709\u7d93\u9a57\u6a94：\u65b0\u5c0d\u8a71\u958b\u982d\u4e0d\u5e36\u5165', async ($, on) => {
  world(on, 100_000)
  const r = await $.prompt.context({ blocks: [] })
  expect(r.blocks).toEqual([])
})

test('\u6574\u7406\u671f\u9593\u6a94\u6848\u88ab\u624b\u52d5\u4fee\u6539：\u4e0d\u5957\u7528、\u4e0d\u6392\u5165，\u4e0b\u6b21\u91cd\u65b0\u6574\u7406\u540c\u4e00\u6bb5', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  w.files.set(NOTES, EXISTING)
  ctl.onComplete = () => { w.files.set(NOTES, `${EXISTING}\n- [user] \u4f7f\u7528\u8005\u525b\u624b\u52d5\u52a0\u7684\n`) }
  const r = await distillNow($)
  expect(r.text).toContain('\u6574\u7406\u671f\u9593\u7d93\u9a57\u6a94\u88ab\u4fee\u6539')
  expect(w.files.get(NOTES) ?? '').toContain('\u4f7f\u7528\u8005\u525b\u624b\u52d5\u52a0\u7684')
  await say($, '\u4e0b\u4e00\u5247')
  expect(w.contexts[0]).toBeUndefined()
  // ：
  ctl.onComplete = undefined
  await distillNow($)
  expect(w.completes.length).toBe(2)
})

test('\u6bcf 30 \u5247\u8a0a\u606f\u6574\u7406\u4e00\u6b21；\u4e0d\u5230 30 \u5247\u4e0d\u6574\u7406', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 30)
  await endTurn($)
  await w.clock.advance(0)
  expect(w.completes.length).toBe(1)
  // ： 30 ，
  await endTurn($)
  await w.clock.advance(0)
  expect(w.completes.length).toBe(1)
})

test('\u8a2d\u5b9a distill_every：\u6539\u6210\u6bcf 10 \u5247\u5c31\u6574\u7406，\u72c0\u614b\u5217\u5012\u6578\u8ddf\u8457\u5b83', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 10)
  ctl.panelSettings = { distill_every: 10 }
  await endTurn($)
  await w.clock.advance(0)
  expect(w.completes.length).toBe(1)
  expect((await cmd($, '')).text).toContain('\u6bcf 10 \u5247')
})

test('\u91cd\u8907\u6574\u7406：\u540c\u4e00\u689d\u8a18\u61b6\u4e0d\u6703\u91cd\u8907\u5beb\u5165，\u6c92\u6709\u8b8a\u52d5\u5c31\u4e0d\u6392\u5165', async ($, on) => {
  let n = 5
  const w = world(on, 100_000, 1_000_000, {}, [], () => n)
  await distillNow($)
  n = 9
  ctl.distillReply = actionsReply({ op: 'add_memory', type: 'project', text: '\u4f7f\u7528\u8005\u6c7a\u5b9a\u4ea4\u63a5\u9580\u6abb\u7dad\u6301 600k' })
  await distillNow($)
  const notes = w.files.get(NOTES) ?? ''
  expect(notes.split('\u4f7f\u7528\u8005\u6c7a\u5b9a\u4ea4\u63a5\u9580\u6abb\u7dad\u6301 600k').length).toBe(2)
  expect(notes.split('## \u8a18\u61b6').length).toBe(2)
  // ：，
  await say($, '\u4e0b\u4e00\u5247')
  expect((w.contexts[0]?.[0] ?? '').split('\u65b0\u589e\u8a18\u61b6').length).toBe(2)
})

test('\u9328\u9ede：\u8a18\u4e0b\u4f7f\u7528\u8005\u6700\u5f8c\u4e00\u5247\u8a0a\u606f，\u4e0b\u6b21\u6574\u7406\u5f9e\u5b83\u4e4b\u5f8c\u958b\u59cb', async ($, on) => {
  let n = 5
  const w = world(on, 100_000, 1_000_000, {}, [], () => n)
  await $.prompt.submit({ text: '\u8acb\u5e6b\u6211  \u6574\u7406\n\u9019\u6bb5\u5c0d\u8a71', origin: composer, wait: false })
  await $.prompt.submit({ text: '/handoff', origin: composer, wait: false })
  await distillNow($)
  expect(w.completes[0]?.system).toContain('\u7bc4\u570d：\u6574\u6bb5\u5c0d\u8a71')
  n = 9
  await distillNow($)
  expect(w.completes[1]?.system).toContain('\u4f7f\u7528\u8005\u8aaa「\u8acb\u5e6b\u6211 \u6574\u7406 \u9019\u6bb5\u5c0d\u8a71」')
})

// ---------- JSONL  ----------

const read = ($: Engine, file: string) => $.tool.call({ tool: 'Read', file_path: file })

test('JSONL \u4e00\u884c\u58de\u6389、\u4e00\u500b\u4e0d\u8a8d\u5f97\u7684 op：\u6709\u6548\u7684\u7167\u5957\u7528，\u8a18\u4e0b\u4e1f\u68c4 2 \u884c\u8207\u6a23\u672c，\u72c0\u614b\u770b\u5f97\u5230', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  ctl.distillReply = actionsReply(
    { op: 'add_memory', type: 'project', title: '\u6709\u6548\u7684\u4e00\u689d', evidence: 'x' },
    '{\u9019\u4e0d\u662f JSON',
    { op: 'explode', text: '\u4e0d\u8a8d\u5f97\u7684 op' },
    '',
    { op: 'add_rule', name: '\u6709\u6548\u898f\u5247', rule: '\u505a Z', applies: 'a', not_applies: 'b', evidence: 'c' },
  )
  const r = await distillNow($)
  const notes = w.files.get(NOTES) ?? ''
  expect(notes).toContain('- [project] \u6709\u6548\u7684\u4e00\u689d')
  expect(notes).toContain('### \u6709\u6548\u898f\u5247（1 \u6b21）\n- \u898f\u5247：\u505a Z\n- \u9069\u7528：a｜\u4e0d\u9069\u7528：b\n- \u6839\u64da：1970-01-01 c')
  const last = lastOf(w)
  expect(last.rejected.count).toBe(2)
  // ，
  expect(last.rejected.samples[0]).toStartWith('JSON \u683c\u5f0f\u932f\u8aa4（')
  expect(last.rejected.samples[0]).toEndWith('）：{\u9019\u4e0d\u662f JSON')
  expect(last.rejected.samples[1]).toBe('\u4e0d\u8a8d\u5f97\u7684 op（explode）：{"op":"explode","text":"\u4e0d\u8a8d\u5f97\u7684 op"}')
  expect(r.text).toContain('\u4e1f\u68c4 2 \u884c\u7121\u6548\u8f38\u51fa')
})

test('JSONL \u6a23\u672c\u6700\u591a 3 \u500b；\u9577\u7684\u884c\u4fdd\u7559\u982d 100 \u5b57\u8207\u5c3e 50 \u5b57', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  ctl.distillReply = actionsReply('x'.repeat(300), 'b', 'c', 'd')
  await distillNow($)
  const { rejected } = lastOf(w)
  expect(rejected.count).toBe(4)
  expect(rejected.samples.length).toBe(3)
  expect(rejected.samples[0]).toEndWith(`：${'x'.repeat(100)}…${'x'.repeat(50)}`)
  expect(rejected.samples[0]?.length).toBeLessThan(260)
  expect(rejected.samples[2]).toEndWith('：c')
})

test('\u7591\u4f3c\u91d1\u9470\u7684\u52d5\u4f5c\u6574\u884c\u4e1f\u68c4（\u4efb\u4f55\u6b04\u4f4d），\u6a23\u672c\u4e0d\u8a18\u5167\u5bb9', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  ctl.distillReply = actionsReply(
    { op: 'add_memory', type: 'project', title: '\u6b63\u5e38\u7684\u4e00\u689d', evidence: 'x' },
    { op: 'add_memory', type: 'project', title: '\u91d1\u9470 ghp_abcdefghijklmnop', evidence: 'x' },
    { op: 'add_rule', name: '\u898f\u5247', rule: '\u505a\u4e8b', applies: 'a', not_applies: 'b', evidence: 'password=hunter2' },
    { op: 'delete_memory', id: 'M1', reason: 'token: abc' },
    '\u9019\u884c\u4e0d\u662f JSON \u4f46\u6709 api_key=zzz',
  )
  w.files.set(NOTES, EXISTING)
  await distillNow($)
  const notes = w.files.get(NOTES) ?? ''
  expect(notes).toContain('- [project] \u6b63\u5e38\u7684\u4e00\u689d')
  expect(notes).toContain('\u820a A')
  expect(notes).not.toMatch(/ghp_|hunter2|api_key/)
  const { rejected } = lastOf(w)
  expect(rejected.count).toBe(4)
  expect(JSON.stringify(rejected.samples)).not.toMatch(/ghp_|hunter2|api_key|token/)
})

test('\u6b04\u4f4d\u88e1\u7684\u63db\u884c\u6703\u6536\u6210\u4e00\u500b\u7a7a\u683c，\u4e0d\u6703\u5beb\u51fa\u591a\u884c\u6216\u65b0\u6a19\u984c', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  ctl.distillReply = actionsReply({ op: 'add_memory', type: 'project', title: '\u7b2c\u4e00\u884c\n## \u5047\u6a19\u984c\n\u7b2c\u4e09\u884c', evidence: 'x' })
  await distillNow($)
  const notes = w.files.get(NOTES) ?? ''
  expect(notes).toContain('- [project] \u7b2c\u4e00\u884c ## \u5047\u6a19\u984c \u7b2c\u4e09\u884c')
  expect(notes.match(/^## \u8a18\u61b6/gm)?.length).toBe(1)
})

test('\u52d5\u4f5c\u7684 type \u4e0d\u5728 user|feedback|project|reference、\u7f3a\u5fc5\u8981\u6b04\u4f4d：\u4e1f\u68c4', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  ctl.distillReply = actionsReply(
    { op: 'add_memory', type: 'bogus', text: '\u985e\u578b\u4e0d\u5c0d' },
    { op: 'add_memory', text: '\u6c92\u6709\u985e\u578b' },
    { op: 'add_memory', type: 'user' },
    { op: 'add_rule', name: '\u7f3a\u6b04\u4f4d', rule: 'r', applies: 'a', evidence: 'e' },
    { op: 'delete_rule', id: 'R1' },
  )
  w.files.set(NOTES, EXISTING)
  await distillNow($)
  expect(lastOf(w).rejected.count).toBe(5)
  expect(w.files.get(NOTES) ?? '').toBe(EXISTING)
})

test('\u6574\u7406\u63d0\u793a：\u7e41\u9ad4\u4e2d\u6587\u6307\u793a、\u53ea\u6709\u9019\u500b\u5de5\u4f5c\u5340\u7684\u8a18\u61b6\u8207\u898f\u5247\u7de8\u865f、JSONL \u8f38\u51fa\u683c\u5f0f；\u5225\u7684 repo \u7684\u7d93\u9a57\u4e0d\u5217\u5165', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  w.files.set(NOTES, EXISTING)
  w.files.set(ALPHA_NOTES, '# x\n\n## \u8a18\u61b6\n- [user] alpha \u7684\u8a18\u61b6\n\n## \u898f\u5247\n\n### alpha \u898f\u5247（3 \u6b21）\n- \u898f\u5247：\u505a A\n')
  repo(w, ALPHA)
  await read($, `${ALPHA}/a.ts`)
  await distillNow($)
  const p = w.completes[0]?.system ?? ''
  expect(p).toContain('\u7528\u4f7f\u7528\u8005\u5728\u5c0d\u8a71\u88e1\u4f7f\u7528\u7684\u8a9e\u8a00\u64b0\u5beb（\u4f7f\u7528\u8005\u5beb\u4e2d\u6587\u5c31\u7528\u7e41\u9ad4\u4e2d\u6587（\u53f0\u7063））；\u7a0b\u5f0f\u78bc、\u6307\u4ee4、\u8def\u5f91、\u932f\u8aa4\u8a0a\u606f\u8207\u5c08\u6709\u540d\u8a5e\u7dad\u6301\u539f\u6587')
  expect(p).toContain('\u4e0d\u8981\u7528\u4ed6、\u5979\u7b49\u4ee3\u540d\u8a5e\u731c\u6027\u5225')
  expect(p).toContain('M2 [project] \u820a B')
  expect(p).toContain('R1 \u898f\u5247\u4e00｜\u51fa\u73fe 1 \u6b21｜\u505a X')
  expect(p).not.toContain('alpha')
  expect(p).not.toContain('P2')
  expect(p).toContain('=== ACTIONS ===')
  expect(p).toContain('=== END ===')
  expect(p).toContain('{"op":"add_memory","type":"feedback","title":"…","how":"…","why":"…","evidence":"…","quote":"…"}')
  expect(p).toContain('{"op":"delete_rule","id":"R4","reason":"…"}')
  expect(p).toContain('{"op":"add_procedure","name":"…","when":"…","steps":["…","…","…"],"evidence":"…"}')
  expect(p).toContain('\u76ee\u524d\u7684\u6d41\u7a0b：')
  expect(p).toContain('\u53ea\u6536\u540c\u4e00\u7a2e\u5de5\u4f5c\u5728\u9019\u6bb5\u5c0d\u8a71\u88e1\u88ab\u505a\u4e86\u4e0d\u53ea\u4e00\u6b21')
  //  repo 
  expect(w.files.get(ALPHA_NOTES) ?? '').not.toContain('\u4f7f\u7528\u8005\u6c7a\u5b9a\u4ea4\u63a5\u9580\u6abb\u7dad\u6301 600k')
  expect(w.files.get(NOTES) ?? '').toContain('\u4f7f\u7528\u8005\u6c7a\u5b9a\u4ea4\u63a5\u9580\u6abb\u7dad\u6301 600k')
})

test('\u6c92\u6709 ACTIONS \u6a19\u8a18\u7684\u8f38\u51fa：\u4e0d\u5957\u7528，\u8a18\u4e00\u884c\u4e1f\u68c4；\u7a7a\u7684 ACTIONS \u5340\u584a\u8996\u70ba\u6c92\u6709\u8b8a\u52d5', async ($, on) => {
  let n = 5
  const w = world(on, 100_000, 1_000_000, {}, [], () => n)
  ctl.distillReply = '\u6211\u89ba\u5f97\u6c92\u4ec0\u9ebc\u597d\u6574\u7406\u7684'
  await distillNow($)
  expect(w.files.has(NOTES)).toBe(false)
  expect(lastOf(w).rejected.count).toBe(1)
  n = 9
  ctl.distillReply = actionsReply()
  await distillNow($)
  expect(w.files.has(NOTES)).toBe(false)
  expect(lastOf(w).rejected.count).toBe(0)
})

for (const reply of ['', '\u6c92\u6709\u8b8a\u52d5', '=== ACTIONS ===', actionsReply('{broken'), actionsReply({ op: 'unknown' })]) {
  test(`\u7121\u6cd5\u4f7f\u7528\u7684\u6574\u7406\u8f38\u51fa\u4e0d\u6d88\u8017\u9019\u6bb5\u5c0d\u8a71：${reply.slice(0, 30)}`, async ($, on) => {
    const w = world(on, 100_000, 1_000_000, {}, [], 5)
    ctl.distillReply = reply
    const result = await distillNow($)
    expect(result.text).not.toContain('\u6574\u7406\u5b8c\u6210')
    expect(w.get('distill:S1')).toBeUndefined()
    expect(w.get('distill:error:C--proj')).toMatchObject({ reason: '\u6574\u7406\u8f38\u51fa\u6c92\u6709\u53ef\u63a1\u7528\u7684\u52d5\u4f5c；\u5df2\u4fdd\u7559\u9019\u6bb5\u5c0d\u8a71\u4f9b\u4e0b\u6b21\u91cd\u8a66' })
    expect(w.get('stats:C--proj')).toMatchObject({ counts: { 'distill.fail': 1 } })
    expect(w.files.has(NOTES)).toBe(false)
    ctl.distillReply = actionsReply()
    await distillNow($)
    expect(w.completes.length).toBe(2)
    expect(w.get('distill:S1')).toMatchObject({ turn: 5 })
  })
}

test('\u5893\u7891\u4e0d\u80fd\u9760\u5df2\u6574\u7406\u904e\u7684\u4f7f\u7528\u8005\u539f\u8a71\u5fa9\u6d3b；\u58d3\u7e2e\u5f8c\u627e\u4e0d\u5230\u820a\u9328\u9ede\u6642\u4e5f\u4e0d\u80fd\u9760\u5168\u5c0d\u8a71\u539f\u8a71\u5fa9\u6d3b', async ($, on) => {
  let turns = 6
  const w = world(on, 100_000, 1_000_000, {
    'distill:S1': { turn: 3, anchor: '\u4e4b\u524d\u8981\u6c42\u4fdd\u7559\u820a B' },
    'tombstones:C--proj': { known: [], dead: [{ title: '\u820a B', at: 0 }] },
  }, [], () => turns)
  w.rows.push({ role: 'user', text: '\u4e4b\u524d\u8981\u6c42\u4fdd\u7559\u820a B', toolUses: [] }, { role: 'user', text: '\u73fe\u5728\u6539\u505a\u53e6\u4e00\u4ef6\u4e8b', toolUses: [] })
  ctl.distillReply = actionsReply(
    { op: 'add_memory', type: 'project', title: '\u820a B', evidence: '\u53c8\u8ac7\u5230\u4e86', quote: '\u4e4b\u524d\u8981\u6c42\u4fdd\u7559\u820a B' },
    { op: 'add_memory', type: 'project', title: '\u672c\u6279\u65b0\u4e8b\u5be6', evidence: '\u65b0\u5167\u5bb9' },
  )
  await distillNow($)
  expect(w.files.get(NOTES) ?? '').not.toContain('\u820a B')
  expect(lastOf(w).rejected.samples.join('\n')).toContain('\u4f7f\u7528\u8005\u522a\u904e「\u820a B」')
  //  last:S1 ，（）
  await say($, '\u58d3\u7e2e\u524d\u6700\u5f8c\u4e00\u5247\u8a0a\u606f')
  turns = 8
  ctl.distillReply = actionsReply()
  await distillNow($)
  w.rows.length = 0
  w.rows.push({ role: 'user', text: '\u58d3\u7e2e\u6458\u8981\u88e1\u4fdd\u7559\u4e86\u820a B \u7684\u5b57\u6a23', toolUses: [] })
  turns = 11
  ctl.distillReply = actionsReply(
    { op: 'add_memory', type: 'project', title: '\u820a B', evidence: '\u58d3\u7e2e\u5f8c\u63d0\u5230', quote: '\u58d3\u7e2e\u6458\u8981\u88e1\u4fdd\u7559\u4e86\u820a B \u7684\u5b57\u6a23' },
    { op: 'add_memory', type: 'project', title: '\u58d3\u7e2e\u5f8c\u53e6\u4e00\u4ef6\u65b0\u4e8b\u5be6', evidence: '\u65b0\u5167\u5bb9' },
  )
  await distillNow($)
  expect(w.files.get(NOTES) ?? '').not.toContain('\u820a B')
  expect(w.files.get(NOTES) ?? '').toContain('\u58d3\u7e2e\u5f8c\u53e6\u4e00\u4ef6\u65b0\u4e8b\u5be6')
  expect(w.get('distill:S1')).toMatchObject({ turn: 11 })
})

for (const when of ['before', 'after']) {
  test(`\u5fc5\u8981\u7d93\u9a57\u6a94\u8b80\u53d6\u5931\u6557\u4e0d\u8986\u5beb、\u4e0d\u63a8\u9032：${when}`, async ($, on) => {
    const w = world(on, 100_000, 1_000_000, {}, [], 5)
    w.files.set(NOTES, EXISTING)
    const deny = () => { ctl.failRead = { path: NOTES, reason: 'EACCES: permission denied opening /tmp/ENOENT: notes' } }
    if (when === 'before') deny()
    else ctl.onComplete = deny
    await distillNow($)
    expect(w.files.get(NOTES)).toBe(EXISTING)
    expect(w.writes).not.toContain(NOTES)
    expect(w.get('distill:S1')).toBeUndefined()
    expect((w.get('distill:error:C--proj') as { reason: string }).reason).toContain('EACCES')
    expect(w.completes.length).toBe(when === 'before' ? 0 : 1)
  })
}

test('\u7d93\u9a57\u6a94\u5beb\u6210\u5f8c store \u5931\u6557，\u540c\u4e00\u7247\u6bb5\u91cd\u8a66\u4e0d\u91cd\u8907\u589e\u52a0\u898f\u5247\u8207\u6d41\u7a0b\u6b21\u6578', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  w.files.set(NOTES, `${EXISTING}\n## \u6d41\u7a0b\n\n### \u767c\u7248（1 \u6b21）\n- \u6642\u6a5f：\u767c\u7248\n- \u6b65\u9a5f：\n  1. \u6e2c\u8a66\n  2. \u767c\u5e03\n`)
  ctl.onComplete = () => { ctl.failStore = { key: 'tombstones:C--proj', remaining: 1 } }
  ctl.distillReply = actionsReply({ op: 'confirm_rule', id: 'R1', evidence: '\u4f7f\u7528\u8005\u53c8\u8981\u6c42\u4e00\u6b21' }, { op: 'confirm_procedure', id: 'P1', evidence: '\u518d\u6b21\u767c\u7248' })
  await distillNow($)
  expect(w.files.get(NOTES)).toContain('### \u898f\u5247\u4e00（2 \u6b21）')
  expect(w.files.get(NOTES)).toContain('### \u767c\u7248（2 \u6b21）')
  expect(w.get('distill:S1')).toBeUndefined()
  ctl.onComplete = undefined
  ctl.distillReply = actionsReply({ op: 'confirm_rule', id: 'R1', evidence: '\u540c\u4e00\u6bb5\u4f7f\u7528\u8005\u91cd\u7533' }, { op: 'confirm_procedure', id: 'P1', evidence: '\u540c\u4e00\u6b21\u518d\u6b21\u57f7\u884c\u767c\u7248' })
  await distillNow($)
  expect(w.files.get(NOTES)).toContain('### \u898f\u5247\u4e00（2 \u6b21）')
  expect(w.files.get(NOTES)).toContain('### \u767c\u7248（2 \u6b21）')
  expect(w.get('distill:S1')).toMatchObject({ turn: 5 })
})

test('\u90e8\u5206\u5beb\u5165\u91cd\u8a66\u51cd\u7d50\u539f\u7247\u6bb5，\u65b0\u4f86\u7684\u76f8\u540c\u8981\u6c42\u7559\u7d66\u4e0b\u4e00\u6279', async ($, on) => {
  let turns = 5
  const w = world(on, 100_000, 1_000_000, {}, [], () => turns)
  w.files.set(NOTES, EXISTING)
  await say($, '\u4f7f\u7528\u8005\u518d\u6b21\u8981\u6c42\u505a X')
  ctl.distillReply = actionsReply({ op: 'confirm_rule', id: 'R1', evidence: '\u4f7f\u7528\u8005\u518d\u6b21\u8981\u6c42\u505a X' }, { op: 'update_rule', id: 'R1', rule: '\u6539\u505a X' })
  ctl.onComplete = () => { ctl.failStore = { key: 'tombstones:C--proj', remaining: 1 } }
  await distillNow($)
  expect(w.files.get(NOTES)).toContain('### \u898f\u5247\u4e00（2 \u6b21）')
  ctl.onComplete = undefined
  turns = 6
  await say($, '\u4e0b\u4e00\u6279\u7684\u65b0\u5de5\u4f5c，\u4f7f\u7528\u8005\u518d\u6b21\u8981\u6c42\u505a X')
  ctl.distillReply = actionsReply({ op: 'confirm_rule', id: 'R1', evidence: '\u63db\u53e5\u8a71\u91cd\u8ff0\u540c\u4e00\u8981\u6c42' })
  await distillNow($)
  expect(w.completes[1]?.prompt).not.toContain('\u4e0b\u4e00\u6279\u7684\u65b0\u5de5\u4f5c')
  expect(w.files.get(NOTES)).toContain('### \u898f\u5247\u4e00（2 \u6b21）')
  expect(w.get('distill:S1')).toMatchObject({ turn: 5 })
  await distillNow($)
  expect(w.completes[2]?.prompt).toContain('\u4e0b\u4e00\u6279\u7684\u65b0\u5de5\u4f5c')
  expect(w.files.get(NOTES)).toContain('### \u898f\u5247\u4e00（3 \u6b21）')
  expect(w.get('distill:S1')).toMatchObject({ turn: 6 })
})

test('\u5b8c\u6210\u5f8c\u91cd\u8a66\u7d42\u9ede\u6e05\u7406\u5931\u6557\u4e0d\u91cd\u64ad\u6216\u56de\u9000checkpoint', async ($, on) => {
  let turns = 5
  const w = world(on, 100_000, 1_000_000, {}, [], () => turns)
  w.files.set(NOTES, EXISTING)
  ctl.failDelete = 'distill:retry:S1'
  ctl.distillReply = actionsReply({ op: 'confirm_rule', id: 'R1', evidence: '\u518d\u8b1b\u4e00\u6b21' })
  expect((await distillNow($)).text).toContain('\u6574\u7406\u5b8c\u6210')
  expect(w.get('distill:S1')).toMatchObject({ turn: 5 })
  expect(w.get('distill:retry:S1')).toBeDefined()
  await distillNow($)
  expect(w.completes.length).toBe(1)
  turns = 6
  await distillNow($)
  expect(w.files.get(NOTES)).toContain('### \u898f\u5247\u4e00（3 \u6b21）')
  expect(w.get('distill:S1')).toMatchObject({ turn: 6 })
})

for (const action of [
  { op: 'add_memory', type: 'project', title: '\u820a B', evidence: '\u91cd\u8a66\u540c\u4e00\u689d\u4e8b\u5be6' },
  { op: 'approve_guard', id: 'G1', quote: '\u540c\u610f\u63a1\u7528\u5b88\u9580' },
  { op: 'in_project', id: 'R1', where: 'CLAUDE.md' },
  { op: 'in_project', id: 'G1', where: 'C:/proj/AGENTS.md' },
]) {
  test(`\u90e8\u5206\u6210\u529f\u91cd\u8a66\u5df2\u9054\u6210\u7684\u72c0\u614b\u662f\u5408\u6cd5no-op：${action.op}:${'id' in action ? action.id : action.title}`, async ($, on) => {
    const guardState = action.op === 'in_project' ? 'on' : 'proposed'
    const w = world(on, 100_000, 1_000_000, { 'guards:C--proj': [{ id: 1, state: guardState, rule: '\u6e2c\u8a66\u5b88\u9580', tool: 'Bash', match: 'push', message: '\u63d0\u9192', mode: 'remind', at: 0 }] }, [], 5)
    w.files.set(NOTES, EXISTING.replace('\u898f\u5247\u4e00（1 \u6b21）', '\u898f\u5247\u4e00（3 \u6b21）'))
    w.files.set('C:/proj/CLAUDE.md', '\u898f\u5247\u5df2\u5728\u6b64')
    w.files.set('C:/proj/AGENTS.md', '\u5b88\u9580\u5df2\u5728\u6b64')
    await say($, '\u540c\u610f\u63a1\u7528\u5b88\u9580')
    ctl.distillReply = actionsReply({ op: 'add_memory', type: 'project', title: '\u672c\u6b21\u4e8b\u5be6', evidence: '\u6e2c\u8a66' }, action)
    ctl.failStore = { key: 'distill:last:C--proj', remaining: 1 }
    await distillNow($)
    expect(w.get('distill:S1')).toBeUndefined()
    ctl.distillReply = actionsReply(action)
    expect((await distillNow($)).text).toContain('\u6574\u7406\u5b8c\u6210')
    expect(w.get('distill:S1')).toMatchObject({ turn: 5 })
    expect(lastOf(w).changes).toEqual([])
  })
}

test('\u53ea\u8f38\u51fa\u7f3a\u6a94\u7684 in_project \u6642\u6574\u6279\u8996\u70ba\u7121\u6cd5\u4f7f\u7528，\u4e0d\u63a8\u9032\u9032\u5ea6', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  w.files.set(NOTES, EXISTING.replace('\u898f\u5247\u4e00（1 \u6b21）', '\u898f\u5247\u4e00（3 \u6b21）'))
  ctl.distillReply = actionsReply({ op: 'in_project', id: 'R1', where: 'MISSING.md' })
  const r = await distillNow($)
  expect(r.text).not.toContain('\u6574\u7406\u5b8c\u6210')
  expect(w.get('distill:S1')).toBeUndefined()
  expect(lastOf(w).rejected.count).toBe(1)
  expect(w.get('distill:error:C--proj')).toMatchObject({ reason: '\u6574\u7406\u8f38\u51fa\u6c92\u6709\u53ef\u63a1\u7528\u7684\u52d5\u4f5c；\u5df2\u4fdd\u7559\u9019\u6bb5\u5c0d\u8a71\u4f9b\u4e0b\u6b21\u91cd\u8a66' })
})

test('\u539f\u7247\u6bb5\u7d42\u9ede\u5df2\u6d88\u5931\u6642\u505c\u6b62\u91cd\u8a66，\u4e0d\u731c\u4f4d\u7f6e\u6216\u63a8\u9032', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, { 'distill:retry:S1': { fromTurn: 0, turn: 5, rowCount: 1, last: { role: 'user', text: '\u539f\u59cb\u8a0a\u606f' } } }, [], 6)
  w.files.set(NOTES, EXISTING)
  w.rows.push({ role: 'user', text: '\u58d3\u7e2e\u5f8c\u4e0d\u540c\u8a0a\u606f', toolUses: [] })
  await distillNow($)
  expect(w.completes).toEqual([])
  expect(w.files.get(NOTES)).toBe(EXISTING)
  expect(w.get('distill:S1')).toBeUndefined()
  expect(w.get('distill:error:C--proj')).toMatchObject({ reason: '\u627e\u4e0d\u5230\u4e0a\u6b21\u90e8\u5206\u5beb\u5165\u7684\u5c0d\u8a71\u7d42\u9ede；\u505c\u6b62\u6574\u7406，\u672a\u8986\u5beb\u7b46\u8a18\u6216\u63a8\u9032\u9032\u5ea6' })
})

test('\u65b0\u589e\u898f\u5247\u8207\u6d41\u7a0b\u90e8\u5206\u5beb\u5165\u5f8c\u6539\u8f38\u51faconfirm，\u4e0d\u628a\u540c\u4e00\u4e8b\u4ef6\u7b97\u5169\u6b21', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  ctl.distillReply = actionsReply(
    { op: 'add_rule', name: '\u5148\u6e2c\u8a66', rule: '\u5148\u6e2c\u8a66', applies: '\u6539\u7a0b\u5f0f', not_applies: '\u6539\u6587\u4ef6', evidence: '\u672c\u6b21\u8981\u6c42' },
    { op: 'add_procedure', name: '\u9a57\u6536', when: '\u6539\u5b8c\u7a0b\u5f0f', steps: ['\u6e2c\u8a66', '\u6aa2\u67e5'], evidence: '\u672c\u6b21\u6d41\u7a0b' },
  )
  ctl.onComplete = () => { ctl.failStore = { key: 'tombstones:C--proj', remaining: 1 } }
  await distillNow($)
  ctl.onComplete = undefined
  ctl.distillReply = actionsReply({ op: 'confirm_rule', id: 'R1', evidence: '\u6539\u5beb\u540c\u4e00\u8981\u6c42' }, { op: 'confirm_procedure', id: 'P1', evidence: '\u6539\u5beb\u540c\u4e00\u6d41\u7a0b' })
  await distillNow($)
  expect(w.files.get(NOTES)).toContain('### \u5148\u6e2c\u8a66（1 \u6b21）')
  expect(w.files.get(NOTES)).toContain('### \u9a57\u6536（1 \u6b21）')
  expect(w.get('distill:S1')).toMatchObject({ turn: 5 })
})

for (const errno of ['ENOENT', 'EACCES', 'ENOTDIR']) {
  test(`\u771f\u5be6fs.read\u932f\u8aa4\u5f62\u72c0\u53ea\u5c07\u7f3a\u6a94\u8996\u70ba\u7a7a\u7b46\u8a18：${errno}`, async ($, on) => {
    const w = world(on, 100_000, 1_000_000, {}, [], 5)
    if (errno !== 'ENOENT') w.files.set(NOTES, EXISTING)
    ctl.failRead = { path: NOTES, reason: `ctx-handoff: $.fs.read(C:\\notes(with parentheses)\\ctx-handoff.md) failed: ${errno}` }
    const result = await distillNow($)
    if (errno === 'ENOENT') {
      expect(result.text).toContain('\u6574\u7406\u5b8c\u6210')
      expect(w.get('distill:S1')).toMatchObject({ turn: 5 })
    } else {
      expect(result.text).toContain('\u6307\u4ee4\u5931\u6557')
      expect(w.files.get(NOTES)).toBe(EXISTING)
      expect(w.writes).not.toContain(NOTES)
      expect(w.get('distill:S1')).toBeUndefined()
    }
  })
}

// （2026-10-14，issue #3）：，，
test('\u5893\u7891：\u76f4\u63a5\u6539\u6a94\u522a\u6389\u7684\u8a18\u61b6，\u6574\u7406\u52a0\u4e0d\u56de\u4f86；\u4f7f\u7528\u8005\u53c8\u63d0\u8d77（\u9644\u539f\u8a71）\u624d\u52a0\u56de', async ($, on) => {
  let n = 5
  const w = world(on, 100_000, 1_000_000, {}, [], () => n)
  w.files.set(NOTES, EXISTING)
  await distillNow($)
  // 「 B」
  w.files.set(NOTES, (w.files.get(NOTES) ?? '').replace('- [project] \u820a B\n', ''))
  n = 9
  ctl.distillReply = actionsReply({ op: 'add_memory', type: 'project', title: '\u820a B', evidence: '\u53c8\u8ac7\u5230\u4e86' })
  await distillNow($)
  expect(w.completes[1]?.system).toContain('\u4f7f\u7528\u8005\u522a\u6389\u7684\u8a18\u61b6')
  expect(w.completes[1]?.system).toContain('- \u820a B')
  expect(w.files.get(NOTES) ?? '').not.toContain('\u820a B')
  expect(lastOf(w).rejected.samples.join('\n')).toContain('\u4f7f\u7528\u8005\u522a\u904e「\u820a B」')
  n = 13
  w.rows.push({ role: 'user', text: '\u820a B \u5176\u5be6\u9084\u662f\u8981\u8a18\u8457', toolUses: [] })
  ctl.distillReply = actionsReply({ op: 'add_memory', type: 'project', title: '\u820a B', evidence: '\u4f7f\u7528\u8005\u8981\u6c42', quote: '\u820a B \u5176\u5be6\u9084\u662f\u8981\u8a18\u8457' })
  await distillNow($)
  expect(w.files.get(NOTES) ?? '').toContain('- [project] \u820a B')
  // ，
  n = 17
  ctl.distillReply = actionsReply()
  await distillNow($)
  expect(w.completes[3]?.system).not.toContain('\u4f7f\u7528\u8005\u522a\u6389\u7684\u8a18\u61b6')
})

test('\u5893\u7891：\u7b2c\u4e00\u6b21\u6574\u7406\u6c92\u6709\u6bd4\u5c0d\u5c0d\u8c61，\u4e0d\u8a18\u5893\u7891；\u6574\u7406\u81ea\u5df1\u522a\u7684（\u88ab\u63a8\u7ffb、\u5408\u4f75）\u4e0d\u7b97\u4f7f\u7528\u8005\u522a\u7684', async ($, on) => {
  let n = 5
  const w = world(on, 100_000, 1_000_000, {}, [], () => n)
  w.files.set(NOTES, EXISTING)
  ctl.distillReply = actionsReply({ op: 'delete_memory', id: 'M2', reason: '\u88ab\u63a8\u7ffb' })
  await distillNow($)
  expect(w.completes[0]?.system).not.toContain('\u4f7f\u7528\u8005\u522a\u6389\u7684\u8a18\u61b6')
  n = 9
  ctl.distillReply = actionsReply()
  await distillNow($)
  expect(w.completes[1]?.system).not.toContain('\u4f7f\u7528\u8005\u522a\u6389\u7684\u8a18\u61b6')
})
