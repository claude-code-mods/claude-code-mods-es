// ：、
import { expect, test } from 'claude-code/testing'
import { claimsDone, doneCheck, doneCheckText, failureSignature, freshWork, isCheckCommand, noteCall, retryNudgeText, trackFailure } from './loops'
import type { Streak, Work } from './loops'
import { cmd, ctl, say, stop, world } from './test-world'

const fail = (text: string) => ({ isError: true as const, result: text, text })
const NUDGE = '\u9023\u7e8c\u5169\u6b21\u56e0\u540c\u6a23\u539f\u56e0\u5931\u6557'

// ----------  ----------

test('\u5931\u6557\u7c3d\u540d：\u8def\u5f91、\u6578\u5b57、\u7a7a\u767d\u4e0d\u540c\u4f46\u539f\u56e0\u76f8\u540c\u7684\u932f\u8aa4\u8996\u70ba\u540c\u4e00\u500b', () => {
  const a = failureSignature('Error: ENOENT  C:\\work\\a\\x.ts line 12\n  at foo (/srv/a/b.js:3:4)')
  const b = failureSignature('Error: ENOENT D:/other/y.ts line 99 at foo (/tmp/c.js:7:8)')
  expect(a).toBe(b)
  expect(failureSignature('Error: A')).not.toBe(failureSignature('Error: B'))
  expect(failureSignature('x'.repeat(500)).length).toBe(200)
  expect(failureSignature(undefined)).toBe('')
})

test('\u9023\u7e8c\u5931\u6557：\u7b2c 2 \u6b21\u8207\u7b2c 4 \u6b21\u76f8\u540c\u7c3d\u540d\u624d\u63d0\u9192、\u6210\u529f\u8207\u63db\u932f\u8aa4\u91cd\u65b0\u7b97', () => {
  const m = new Map<string, Streak>()
  const call = (isError: boolean, text?: string) => trackFailure(m, 'Bash', 'Bash', isError, text)
  expect(call(true, 'boom 1')).toBeUndefined()
  expect(call(true, 'boom 2')).toContain(NUDGE)
  expect(call(true, 'boom 3')).toBeUndefined()
  expect(call(true, 'boom 4')).toContain(NUDGE)
  expect(call(true, 'boom 5')).toBeUndefined()
  expect(call(false)).toBeUndefined()
  expect(call(true, 'boom 6')).toBeUndefined()
  expect(call(true, 'other error')).toBeUndefined()
  expect(call(true, 'other error')).toContain(NUDGE)
  // 
  expect(call(true, "The user doesn't want to proceed with this tool use")).toBeUndefined()
  expect(call(true, "The user doesn't want to proceed with this tool use")).toBeUndefined()
})

test('\u9023\u7e8c\u5931\u6557\u5c0e\u5f15：Edit／MultiEdit \u6307\u8def Grep \u8207 safe-replace，Read \u6307\u8def Glob，\u5176\u4ed6\u5de5\u5177\u7dad\u6301\u539f\u53e5', () => {
  for (const tool of ['Edit', 'MultiEdit']) {
    const n = retryNudgeText(tool, 'String to replace not found')
    expect(n).toContain(`${tool} \u9023\u7e8c\u5169\u6b21\u56e0\u540c\u6a23\u539f\u56e0\u5931\u6557`)
    expect(n).toContain('Grep (rg -F)')
    expect(n).toContain('Read (\u6307\u5b9a offset/limit)')
    expect(n).toContain('node ~/.claude/tools/safe-replace.mjs')
  }
  const r = retryNudgeText('Read', 'File does not exist')
  expect(r).toContain('Read \u9023\u7e8c\u5169\u6b21\u5931\u6557')
  expect(r).toContain('Glob')
  expect(r).not.toContain('safe-replace')
  const b = retryNudgeText('Bash', 'Exit code 1')
  expect(b).toContain('\u9019\u500b\u5de5\u5177（Bash）')
  expect(b).toContain('\u66ab\u6642\u6027\u7684（\u903e\u6642、\u9084\u5728\u8f09\u5165、\u9023\u7dda\u4e2d\u65b7）')
})

test('\u9023\u7e8c\u5931\u6557：\u63d0\u9192\u5e36\u5de5\u5177\u540d\u8207\u7c21\u77ed\u932f\u8aa4；\u4e0d\u540c\u5de5\u5177\u5206\u958b\u7b97', () => {
  const m = new Map<string, Streak>()
  expect(trackFailure(m, 'Read', 'Read', true, 'no such file\nmore')).toBeUndefined()
  expect(trackFailure(m, 'Bash', 'Bash', true, 'no such file\nmore')).toBeUndefined()
  const n = trackFailure(m, 'Read', 'Read', true, 'no such file\nmore')
  expect(n).toStartWith('[ctx-handoff] ')
  expect(n).toContain('Read')
  expect(n).toContain('no such file')
  expect(n).not.toContain('more')
})

test('\u9a57\u8b49\u6307\u4ee4：\u6e2c\u8a66、\u6aa2\u67e5、\u5efa\u7f6e\u7b97；\u53ea\u662f\u770b\u6a94\u6848\u7684\u4e0d\u7b97', () => {
  for (const c of ['npm test', 'node --test', 'pytest -q', 'go test ./...', 'cargo test', 'cd x && npx tsc -p .', 'node tools/check.mjs', 'npm run build', 'make lint'])
    expect(isCheckCommand(c)).toBe(true)
  for (const c of ['ls tests/', 'cat test.js', 'git commit -m "add tests"', 'grep -rn check src', 'echo done', 'node run.js', ''])
    expect(isCheckCommand(c)).toBe(false)
})

test('\u5b8c\u6210\u7684\u8aaa\u6cd5：\u4fdd\u5b88\u5224\u65b7，\u5426\u5b9a、\u63d0\u554f、\u5df2\u8aaa\u660e\u6c92\u9a57\u8b49\u6216\u6e2c\u8a66\u5931\u6557\u7684\u4e0d\u7b97', () => {
  for (const m of ['\u5df2\u7d93\u6539\u597d\u4e86，\u5b8c\u6210\u4e86。', '\u90fd\u597d\u4e86', '\u4fee\u597d\u4e86', 'All done.', "I've fixed it", 'It is now fixed and working.', '\u5168\u90e8\u5b8c\u6210'])
    expect(claimsDone(m)).toBe(true)
  for (const m of ['\u9084\u6c92\u5b8c\u6210，\u6211\u518d\u770b\u770b', '\u5c1a\u672a\u5b8c\u6210', '\u6211\u5148\u770b\u904e\u7a0b\u5f0f\u78bc', '\u8981\u6211\u5b8c\u6210\u55ce？', 'Is it done?', '\u5b8c\u6210\u4e86，\u4f46\u6211\u6c92\u6709\u8dd1\u6e2c\u8a66', '\u5df2\u7d93\u6539\u597d\u4e86，\u4f46\u6e2c\u8a66\u5931\u6557', 'All done, though 1 test failed', 'Done, though I could not run the tests', undefined, ''])
    expect(claimsDone(m)).toBe(false)
})

test('\u5b8c\u6210\u524d\u9a57\u8b49\u7684\u63d0\u9192：\u5169\u7a2e\u60c5\u6cc1\u90fd\u8981\u6a21\u578b\u6a19\u793a\u56db\u7d1a\u72c0\u614b', () => {
  for (const failed of [false, true]) {
    const text = doneCheckText(failed)
    for (const label of ['[\u5df2\u5b8c\u6210\u4e14\u5df2\u5be6\u6e2c]', '[\u5df2\u90e8\u7f72\u4f46\u5f85\u6b63\u5f0f\u9a57\u6536]', '[\u5df2\u4fee\u6539\u4f46\u672a\u5be6\u6e2c（\u9644\u539f\u56e0）]', '[\u5f85\u4f60\u62cd\u677f]'])
      expect(text).toContain(label)
  }
})

test('\u5b8c\u6210\u524d\u9a57\u8b49：\u6539\u6a94\u5f8c\u6c92\u9a57\u8b49\u6216\u6e2c\u8a66\u5931\u6557\u624d\u64cb、scratchpad \u4e0d\u8aa4\u64cb、\u6bcf\u56de\u5408\u4e00\u6b21', () => {
  const run = (setup: (w: Work) => void, msg = '\u5b8c\u6210\u4e86', active = false) => {
    const w = freshWork()
    setup(w)
    return { w, reason: doneCheck(w, msg, active) }
  }
  const edit = (w: Work) => noteCall(w, 'Edit', { file_path: 'a.ts' }, false)
  const test_ = (w: Work) => noteCall(w, 'Bash', { command: 'npm test' }, false)
  expect(run(edit).reason).toContain('[ctx-handoff]')
  // 、、 scratchpad 、：
  expect(run(() => {}).reason).toBeUndefined()
  expect(run(w => noteCall(w, 'Edit', { file_path: 'README.md' }, false)).reason).toBeUndefined()
  expect(run(w => noteCall(w, 'Write', { file_path: 'C:/Users/u/AppData/Local/Temp/claude/p/s/scratchpad/ops.json' }, false)).reason).toBeUndefined()
  expect(run(w => noteCall(w, 'Write', { file_path: '/tmp/claude/s/scratchpad/tmp.ts' }, false)).reason).toBeUndefined()
  expect(run(w => noteCall(w, 'Edit', { file_path: 'a.ts' }, true)).reason).toBeUndefined()
  // ；（）；
  expect(run(w => { edit(w); test_(w) }).reason).toBeUndefined()
  expect(run(w => { edit(w); noteCall(w, 'Bash', { command: 'npm test' }, true) }).reason).toContain('\u6e2c\u8a66\u6216\u6aa2\u67e5\u6c92\u6709\u901a\u904e')
  expect(run(w => { edit(w); test_(w); noteCall(w, 'Bash', { command: 'npm run lint' }, true) }).reason).toContain('\u6e2c\u8a66\u6216\u6aa2\u67e5\u6c92\u6709\u901a\u904e')
  expect(run(w => { edit(w); noteCall(w, 'Bash', { command: 'npm test' }, true) }, '\u5df2\u7d93\u6539\u597d\u4e86，\u4f46\u6e2c\u8a66\u5931\u6557').reason).toBeUndefined()
  expect(run(w => { edit(w); test_(w); edit(w) }).reason).toContain('\u6c92\u6709\u8dd1\u4efb\u4f55\u6e2c\u8a66\u6216\u6aa2\u67e5')
  // 、 hook ：
  expect(run(edit, '\u6211\u6539\u4e86 a.ts，\u63a5\u4e0b\u4f86\u8acb\u4f60\u770b\u770b').reason).toBeUndefined()
  expect(run(edit, '\u5b8c\u6210\u4e86', true).reason).toBeUndefined()
  // 
  const w = freshWork()
  edit(w)
  expect(doneCheck(w, '\u5b8c\u6210\u4e86', false)).toBeDefined()
  expect(doneCheck(w, '\u5b8c\u6210\u4e86', false)).toBeUndefined()
  // 
  for (const tool of ['Write', 'NotebookEdit', 'MultiEdit']) {
    const x = freshWork()
    noteCall(x, tool, { file_path: 'a.py', notebook_path: 'a.ipynb' }, false)
    expect(doneCheck(x, 'fixed it', false)).toBeDefined()
  }
})

// ---------- A：（ tool.call） ----------

test('\u91cd\u8907\u5931\u6557：\u7b2c 2 \u6b21\u540c\u6a23\u7684\u5931\u6557\u5728\u7d50\u679c\u5f8c\u9762\u9644\u63d0\u9192，\u4e4b\u5f8c\u540c\u4e00\u6bb5\u4e0d\u518d\u63d0\u9192', async ($, on) => {
  world(on, 1000)
  ctl.toolReply = e => (e.tool === 'Bash' ? fail('Exit code 1\nmodule not found: foo') : undefined)
  const r1 = await $.tool.call({ tool: 'Bash', command: 'node a.js' })
  expect(r1.context).toBeUndefined()
  const r2 = await $.tool.call({ tool: 'Bash', command: 'node a.js' })
  expect(r2.isError).toBe(true)
  expect(r2.context?.[0]).toStartWith('[ctx-handoff] ')
  expect(r2.context?.[0]).toContain(NUDGE)
  expect(r2.context?.[0]).toContain('Bash')
  // （2026-10-09 ，）
  expect(r2.context?.[0]).toContain('\u66ab\u6642\u6027\u7684（\u903e\u6642、\u9084\u5728\u8f09\u5165、\u9023\u7dda\u4e2d\u65b7）\u5c31\u7a0d\u7b49\u518d\u8a66\u4e00\u6b21')
  const r3 = await $.tool.call({ tool: 'Bash', command: 'node a.js' })
  expect(r3.context).toBeUndefined()
})

test('\u91cd\u8907\u5931\u6557：\u932f\u8aa4\u4e0d\u540c、\u4e2d\u9593\u6210\u529f\u904e、\u5225\u7684\u5de5\u5177\u6210\u529f\u90fd\u4e0d\u7b97\u9023\u7e8c\u540c\u6a23\u7684\u5931\u6557', async ($, on) => {
  world(on, 1000)
  let reply: ReturnType<NonNullable<typeof ctl.toolReply>>
  ctl.toolReply = () => reply
  const call = async (tool: string, r: typeof reply) => { reply = r; return (await $.tool.call({ tool: tool as 'Bash', command: 'x' })).context }
  expect(await call('Bash', fail('error A'))).toBeUndefined()
  expect(await call('Bash', fail('error B'))).toBeUndefined()
  // ，
  expect(await call('Bash', undefined)).toBeUndefined()
  expect(await call('Bash', fail('error B'))).toBeUndefined()
  // 
  expect(await call('Read', undefined)).toBeUndefined()
  expect((await call('Bash', fail('error B')))?.[0]).toContain(NUDGE)
})

test('\u91cd\u8907\u5931\u6557：Edit \u9023\u6557\u6642\u900f\u904e tool.call \u9644\u4e0a\u8de8\u6a94\u7de8\u8f2f\u5c0e\u5f15', async ($, on) => {
  world(on, 1000)
  ctl.toolReply = e => (e.tool === 'Edit' ? fail('String to replace not found') : undefined)
  await $.tool.call({ tool: 'Edit', file_path: 'a.ts', old_string: 'a', new_string: 'b' })
  const r = await $.tool.call({ tool: 'Edit', file_path: 'a.ts', old_string: 'a', new_string: 'b' })
  expect(r.context?.[0]).toContain('Grep (rg -F)')
  expect(r.context?.[0]).toContain('safe-replace.mjs')
})

test('\u91cd\u8907\u5931\u6557：\u548c\u5b88\u9580\u63d0\u9192\u4e26\u5b58，\u5b88\u9580\u7684 deny \u4e0d\u53d7\u5f71\u97ff', async ($, on) => {
  world(on, 1000, 1_000_000, { 'guards:C--proj': [
    { id: 1, rule: '\u5225\u78b0 foo', tool: 'Bash', match: 'foo', message: '\u4e0d\u8981', mode: 'remind', state: 'on', at: 0 },
    { id: 2, rule: '\u7981\u6b62 rm', tool: 'Bash', match: 'rm -rf', message: '\u4e0d\u53ef', mode: 'deny', state: 'on', at: 0 },
  ] })
  ctl.toolReply = () => fail('same failure')
  await $.tool.call({ tool: 'Bash', command: 'foo' })
  const r = await $.tool.call({ tool: 'Bash', command: 'foo' })
  expect(r.context?.length).toBe(2)
  expect(r.context?.[0]).toContain('\u5b88\u9580 #1')
  expect(r.context?.[1]).toContain(NUDGE)
  expect((await $.tool.call({ tool: 'Bash', command: 'rm -rf x' })).deny).toContain('\u5b88\u9580 #2')
})

test('\u91cd\u8907\u5931\u6557：retry_nudge \u95dc\u9589\u6642\u4e0d\u63d0\u9192', async ($, on) => {
  world(on, 1000)
  ctl.panelSettings.retry_nudge = false
  ctl.toolReply = () => fail('same failure')
  await $.tool.call({ tool: 'Bash', command: 'x' })
  const r = await $.tool.call({ tool: 'Bash', command: 'x' })
  expect(r.isError).toBe(true)
  expect(r.context).toBeUndefined()
})

test('\u91cd\u8907\u5931\u6557：\u8a2d\u5b9a\u8d70 pluginConfigs \u4e5f\u80fd\u95dc\u9589', async ($, on) => {
  world(on, 1000)
  ctl.pluginOptions = { retry_nudge: false }
  ctl.toolReply = () => fail('same failure')
  await $.tool.call({ tool: 'Bash', command: 'x' })
  expect((await $.tool.call({ tool: 'Bash', command: 'x' })).context).toBeUndefined()
})

// ---------- B：（ classic.Stop） ----------

const claim = { last_assistant_message: '\u5df2\u7d93\u6539\u597d\u4e86，\u5b8c\u6210\u4e86。' }

test('\u5b8c\u6210\u524d\u9a57\u8b49：\u6539\u4e86\u6a94\u6848、\u6c92\u8dd1\u4efb\u4f55\u6aa2\u67e5\u5c31\u8aaa\u5b8c\u6210，\u64cb\u4e0b\u505c\u6b62\u4e26\u8aaa\u660e\u539f\u56e0', async ($, on) => {
  const w = world(on, 1000)
  await $.tool.call({ tool: 'Edit', file_path: 'a.ts', old_string: 'a', new_string: 'b' })
  const out = await stop($, claim)
  expect(out.block).toStartWith('[ctx-handoff] ')
  expect(out.block).toContain('\u6c92\u6709\u8dd1\u4efb\u4f55\u6e2c\u8a66\u6216\u6aa2\u67e5')
  expect(w.logs.some(l => l.includes('\u5148\u9a57\u8b49'))).toBe(true)
  // 
  expect((await stop($, claim)).block).toBeUndefined()
})

test('\u5b8c\u6210\u524d\u9a57\u8b49：\u64cb\u4e0b\u6642\u4e0d\u505a\u9580\u6abb\u4ea4\u63a5（\u56de\u5408\u9084\u6c92\u7d50\u675f）', async ($, on) => {
  const w = world(on, 650_000)
  await $.tool.call({ tool: 'Write', file_path: 'a.ts', content: 'x' })
  expect((await stop($, claim)).block).toBeDefined()
  await w.clock.advance(0)
  expect(w.forks.length).toBe(0)
  // ：，
  expect((await stop($, { ...claim, stop_hook_active: true })).block).toBeUndefined()
  await w.clock.advance(0)
  expect(w.forks.length).toBeGreaterThan(0)
})

test('\u5b8c\u6210\u524d\u9a57\u8b49：\u6539\u6a94\u4e4b\u5f8c\u8dd1\u904e\u6e2c\u8a66、\u6c92\u6539\u6a94、\u6c92\u8aaa\u5b8c\u6210、\u53ea\u6539\u6587\u4ef6\u90fd\u4e0d\u64cb', async ($, on) => {
  world(on, 1000)
  expect((await stop($, claim)).block).toBeUndefined()
  await $.tool.call({ tool: 'Edit', file_path: 'a.ts', old_string: 'a', new_string: 'b' })
  expect((await stop($, { last_assistant_message: '\u6211\u6539\u4e86 a.ts，\u8acb\u770b\u770b' })).block).toBeUndefined()
  // ：，
  await $.tool.call({ tool: 'Edit', file_path: 'a.ts', old_string: 'a', new_string: 'b' })
  await $.tool.call({ tool: 'Bash', command: 'npm test' })
  expect((await stop($, claim)).block).toBeUndefined()
  await $.tool.call({ tool: 'Edit', file_path: 'README.md', old_string: 'a', new_string: 'b' })
  expect((await stop($, claim)).block).toBeUndefined()
})

test('\u5b8c\u6210\u524d\u9a57\u8b49：\u6539\u6a94\u5931\u6557\u6216\u53ea\u5beb scratchpad \u4e0d\u7b97\u6539\u6a94；\u6e2c\u8a66\u5931\u6557\u537b\u76f4\u63a5\u8aaa\u5b8c\u6210\u6703\u64cb\u4e0b，\u91cd\u8dd1\u901a\u904e\u624d\u653e\u884c', async ($, on) => {
  world(on, 1000)
  ctl.toolReply = e => (e.tool === 'Edit' || e.command === 'npm test' ? fail('boom') : undefined)
  await $.tool.call({ tool: 'Edit', file_path: 'a.ts', old_string: 'a', new_string: 'b' })
  expect((await stop($, claim)).block).toBeUndefined()
  await $.tool.call({ tool: 'Write', file_path: 'C:/Users/u/AppData/Local/Temp/claude/p/s/scratchpad/clean.json', content: '{}' })
  expect((await stop($, claim)).block).toBeUndefined()
  ctl.toolReply = e => (e.command === 'npm test' ? fail('1 failed') : undefined)
  await $.tool.call({ tool: 'Edit', file_path: 'a.ts', old_string: 'a', new_string: 'b' })
  await $.tool.call({ tool: 'Bash', command: 'npm test' })
  expect((await stop($, claim)).block).toContain('\u6e2c\u8a66\u6216\u6aa2\u67e5\u6c92\u6709\u901a\u904e')
  // 
  ctl.toolReply = undefined
  await $.tool.call({ tool: 'Edit', file_path: 'a.ts', old_string: 'a', new_string: 'b' })
  await $.tool.call({ tool: 'Bash', command: 'npm test' })
  expect((await stop($, claim)).block).toBeUndefined()
})

test('\u5b8c\u6210\u524d\u9a57\u8b49：\u4f7f\u7528\u8005\u7684\u65b0\u8a0a\u606f、\u88ab\u4e2d\u65b7\u7684\u56de\u5408\u90fd\u91cd\u65b0\u7b97\u9019\u4e00\u8f2a', async ($, on) => {
  world(on, 1000)
  await $.tool.call({ tool: 'Edit', file_path: 'a.ts', old_string: 'a', new_string: 'b' })
  await say($, '\u7b97\u4e86，\u63db\u500b\u554f\u984c')
  expect((await stop($, claim)).block).toBeUndefined()
  await $.tool.call({ tool: 'Edit', file_path: 'a.ts', old_string: 'a', new_string: 'b' })
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: true, turnId: 't1', reason: 'aborted' })
  expect((await stop($, claim)).block).toBeUndefined()
})

test('\u5b8c\u6210\u524d\u9a57\u8b49：\u5225\u7684 Stop hook \u5df2\u7d93\u8981\u6c42\u7e7c\u7e8c\u6642\u4e0d\u63d2\u624b；\u5b50\u4ee3\u7406\u7684\u505c\u6b62\u4e0d\u770b', async ($, on) => {
  world(on, 1000)
  await $.tool.call({ tool: 'Edit', file_path: 'a.ts', old_string: 'a', new_string: 'b' })
  ctl.stopBlock = '\u5225\u7684 hook \u7684\u7406\u7531'
  expect((await stop($, claim)).block).toBe('\u5225\u7684 hook \u7684\u7406\u7531')
  ctl.stopBlock = undefined
  expect((await stop($, { ...claim, agent_id: 'sub1' })).block).toBeUndefined()
  expect((await stop($, claim)).block).toContain('[ctx-handoff]')
})

// 2026-10-08 ：，，
test('\u5b8c\u6210\u524d\u9a57\u8b49：\u5b50\u4ee3\u7406（\u542b\u80cc\u666f\u5b50\u4ee3\u7406）\u7684\u6539\u6a94\u8207\u6aa2\u67e5\u4e0d\u7b97\u4e3b\u5c0d\u8a71\u7684\u9019\u4e00\u8f2a', async ($, on) => {
  world(on, 1000)
  await $.tool.call({ tool: 'Edit', file_path: 'a.ts', old_string: 'a', new_string: 'b' })
  await $.tool.call({ tool: 'Bash', command: 'node tools/check.mjs .' })
  await $.tool.call({ tool: 'Edit', file_path: 'b.ts', old_string: 'a', new_string: 'b', agentId: 'bg1' } as never)
  expect((await stop($, claim)).block).toBeUndefined()
  // 
  await $.tool.call({ tool: 'Edit', file_path: 'a.ts', old_string: 'a', new_string: 'b' })
  await $.tool.call({ tool: 'Bash', command: 'npm test', agentId: 'bg1' } as never)
  expect((await stop($, claim)).block).toContain('[ctx-handoff]')
})

test('\u5b8c\u6210\u524d\u9a57\u8b49：done_check \u95dc\u9589\u6642\u4e0d\u64cb', async ($, on) => {
  world(on, 1000)
  ctl.panelSettings.done_check = false
  await $.tool.call({ tool: 'Edit', file_path: 'a.ts', old_string: 'a', new_string: 'b' })
  expect((await stop($, claim)).block).toBeUndefined()
})

test('\u9632\u5446\u63d0\u9192：/handoff \u72c0\u614b\u986f\u793a\u5169\u500b\u958b\u95dc', async ($, on) => {
  world(on, 1000)
  ctl.panelSettings.done_check = false
  expect((await cmd($, '')).text).toContain('\u9632\u5446\u63d0\u9192：\u91cd\u8907\u5931\u6557 on，\u5b8c\u6210\u524d\u9a57\u8b49 off')
})
