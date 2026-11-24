// ：deny／remind 、、tool.call 
import { expect, test } from 'claude-code/testing'
import { cmd, NOTES_PATH, pushGuard, actionsReply, ctl, world } from './test-world'

// ----------  ----------

test('\u5b88\u9580：\u555f\u7528\u7684 deny \u64cb\u4e0b\u9055\u898f、\u653e\u884c\u7b26\u5408 unless \u7684\u5beb\u6cd5，\u4e26\u8a18\u89f8\u767c\u6b21\u6578', async ($, on) => {
  const w = world(on, 1000, 1_000_000, { 'guards:C--proj': [pushGuard('on')] })
  const blocked = await $.tool.call({ tool: 'Bash', command: 'git push origin main' })
  expect(blocked.deny).toContain('\u5b88\u9580 #1')
  expect(blocked.deny).toContain('/handoff guard off 1')
  const ok = await $.tool.call({ tool: 'Bash', command: 'node cli.mjs preflight && git push' })
  expect(ok.deny).toBeUndefined()
  const other = await $.tool.call({ tool: 'Read', file_path: 'git push.md' })
  expect(other.deny).toBeUndefined()
  expect((w.get('stats:C--proj') as { counts: Record<string, number> }).counts['guard.hit.1']).toBe(1)
})

// issue #6： 10 ，，
test('\u5b88\u9580：\u6e05\u55ae\u5217\u51fa\u6700\u8fd1 3 \u6b21\u547d\u4e2d\u7684\u6307\u4ee4，\u8b93\u4eba\u5224\u65b7\u662f\u4e0d\u662f\u8aa4\u5831', async ($, on) => {
  world(on, 1000, 1_000_000, { 'guards:C--proj': [pushGuard('on', 'remind')] })
  for (const c of ['git push a', 'git push b', 'git push c', 'git push\n  d']) await $.tool.call({ tool: 'Bash', command: c })
  const text = (await cmd($, 'guard')).text
  expect(text).toContain('\u6700\u8fd1\u547d\u4e2d')
  expect(text).not.toContain('git push a')
  expect(text).toContain('　git push b')
  expect(text).toContain('　git push d')
})

test('\u5b88\u9580：\u8349\u7a3f\u8207\u505c\u7528\u7684\u4e0d\u751f\u6548', async ($, on) => {
  world(on, 1000, 1_000_000, { 'guards:C--proj': [pushGuard('proposed'), { ...pushGuard('off'), id: 2 }] })
  const r = await $.tool.call({ tool: 'Bash', command: 'git push' })
  expect(r.deny).toBeUndefined()
})

test('\u5b88\u9580：remind \u7167\u5e38\u57f7\u884c，\u7d50\u679c\u5f8c\u9762\u9644\u63d0\u9192', async ($, on) => {
  world(on, 1000, 1_000_000, { 'guards:C--proj': [pushGuard('on', 'remind')] })
  const r = await $.tool.call({ tool: 'Bash', command: 'git push' })
  expect(r.deny).toBeUndefined()
  expect(r.context?.[0]).toContain('\u5148\u8dd1 preflight \u518d\u63a8')
})

// 2026-10-09 ：
test('\u5b88\u9580：suggest \u53ea\u9001\u5beb\u9032 repo \u5f8c\u53c8\u88ab\u7cfe\u6b63、\u6216\u4e0d\u653e\u9032 repo \u537b\u8b1b\u4e86 3 \u6b21\u4ee5\u4e0a\u7684\u898f\u5247，\u9a57\u8b49\u8349\u7a3f\u4e26\u8a66\u6bd4\u5c0d\u9019\u6bb5\u5c0d\u8a71', async ($, on) => {
  const w = world(on, 1000)
  w.files.set(NOTES_PATH, [
    '# ctx-handoff \u5c08\u6848\u7d93\u9a57', '', '## \u8a18\u61b6', '', '## \u898f\u5247', '',
    '### \u63a8\u9001\u524d\u5148\u8dd1 preflight（4 \u6b21）', '- \u898f\u5247：git push \u524d\u5148\u8dd1 preflight', '- \u5c08\u6848：\u5df2\u5728 CLAUDE.md（\u7b2c 3 \u6b21\u6642）', '',
    '### \u653e\u9032\u53bb\u5f8c\u6c92\u518d\u72af（3 \u6b21）', '- \u898f\u5247：\u4e0d\u8a72\u9001\u7d66\u6a21\u578b', '- \u5c08\u6848：\u5df2\u5728 CLAUDE.md（\u7b2c 3 \u6b21\u6642）', '',
    '### \u9084\u6c92\u8655\u7406\u653e\u9032 repo（5 \u6b21）', '- \u898f\u5247：\u5148\u8d70\u653e\u9032 repo', '',
    '### \u4e0d\u653e\u9032 repo \u7684（3 \u6b21）', '- \u898f\u5247：\u4e5f\u8a72\u9001', '- \u5c08\u6848：\u4e0d\u653e',
  ].join('\n'))
  w.rows.push({ role: 'assistant', text: '', toolUses: [{ tool: 'Bash', input: { command: 'git push' } }, { tool: 'Bash', input: { command: 'ls' } }] })
  ctl.distillReply = actionsReply(
    { rule: '\u63a8\u9001\u524d\u5148\u8dd1 preflight', tool: 'Bash', match: 'git\\s+push', unless: 'preflight', mode: 'deny', message: '\u5148\u8dd1 preflight', bad: 'git push origin main', good: 'node cli.mjs preflight && git push' },
    { rule: '\u63a8\u9001\u524d\u5148\u8dd1 preflight', tool: 'Bash', match: 'push', mode: 'remind', message: '\u6c92\u6709\u7bc4\u4f8b' },
    { rule: '\u4e0d\u5b58\u5728\u7684\u898f\u5247', tool: 'Bash', match: 'x', mode: 'deny', message: 'x', bad: 'x', good: 'y' },
    { rule: '\u63a8\u9001\u524d\u5148\u8dd1 preflight', tool: 'Bash', match: '(', mode: 'deny', message: '\u58de regex', bad: '(', good: 'y' },
    // ：
    { rule: '\u63a8\u9001\u524d\u5148\u8dd1 preflight', tool: 'Bash', match: '[\\s\\S]', mode: 'remind', message: '\u592a\u5bec', bad: 'git push', good: 'node cli.mjs preflight && git push' },
    // $ ：$$ ，
    { rule: '\u63a8\u9001\u524d\u5148\u8dd1 preflight', tool: 'Bash', match: 'do\\s+$$', mode: 'remind', message: '\u6c92\u8df3\u812b', bad: 'do $$ delete from x $$', good: 'ls' },
  )
  const r = await cmd($, 'guard suggest')
  expect(w.completes[0]?.system).toContain('### \u63a8\u9001\u524d\u5148\u8dd1 preflight')
  expect(w.completes[0]?.system).toContain('### \u4e0d\u653e\u9032 repo \u7684')
  expect(w.completes[0]?.system).not.toContain('\u653e\u9032\u53bb\u5f8c\u6c92\u518d\u72af')
  expect(w.completes[0]?.system).not.toContain('\u9084\u6c92\u8655\u7406\u653e\u9032 repo')
  const guards = w.get('guards:C--proj') as { id: number; state: string; replay: { hits: number; calls: number } }[]
  expect(guards.length).toBe(1)
  expect(guards[0]).toMatchObject({ id: 1, state: 'proposed', replay: { hits: 1, calls: 2 } })
  expect(r.text).toContain('\u4e1f\u68c4 5 \u884c')
  expect(r.text).toContain('\u7f3a bad／good \u7bc4\u4f8b')
  expect(r.text).toContain('\u6b63\u78ba\u7bc4\u4f8b\u4e5f\u6703\u88ab\u64cb')
  expect(r.text).toContain('\u9055\u898f\u7bc4\u4f8b\u6c92\u6709\u88ab\u64cb')
  expect(r.text).toContain('2 \u6b21\u5de5\u5177\u547c\u53eb\u4e2d\u6703\u547d\u4e2d 1 \u6b21')
  expect(r.text).toContain('\u7bc4\u4f8b：\u64cb「git push origin main」，\u653e\u884c「node cli.mjs preflight && git push」')
  // （）
  await cmd($, 'guard suggest')
  expect(w.completes.length).toBe(2)
  expect(w.completes[1]?.system).not.toContain('### \u63a8\u9001\u524d\u5148\u8dd1 preflight')
})

test('\u5b88\u9580：/handoff guard on|mode|drop \u6539\u72c0\u614b', async ($, on) => {
  const w = world(on, 1000, 1_000_000, { 'guards:C--proj': [pushGuard('proposed')] })
  await cmd($, 'guard on 1')
  expect((w.get('guards:C--proj') as { state: string }[])[0]?.state).toBe('on')
  await cmd($, 'guard mode 1 remind')
  expect((w.get('guards:C--proj') as { mode: string }[])[0]?.mode).toBe('remind')
  const missing = await cmd($, 'guard on 9')
  expect(missing.text).toContain('\u6c92\u6709\u5b88\u9580 #9')
  await cmd($, 'guard drop 1')
  expect(w.get('guards:C--proj')).toEqual([])
})

// 2026-10-09 ：$.store 。， session 
test('\u5b88\u9580：\u547d\u4e2d\u53ea\u8a18\u5728\u7d71\u8a08、\u4e0d\u6539\u5b88\u9580\u8cc7\u6599；\u5217\u8868\u7167\u6a23\u986f\u793a\u89f8\u767c\u6b21\u6578；/handoff \u72c0\u614b\u53ea\u8b80\u4e00\u6b21\u7d93\u9a57\u6a94', async ($, on) => {
  const w = world(on, 1000, 1_000_000, { 'guards:C--proj': [pushGuard('on')] })
  w.files.set(NOTES_PATH, '# ctx-handoff \u5c08\u6848\u7d93\u9a57\n\n## \u8a18\u61b6\n- [project] A\n\n## \u898f\u5247\n')
  const before = JSON.stringify(w.get('guards:C--proj'))
  await $.tool.call({ tool: 'Bash', command: 'git push origin main' })
  await $.tool.call({ tool: 'Bash', command: 'git push origin dev' })
  expect(JSON.stringify(w.get('guards:C--proj'))).toBe(before)
  expect((await cmd($, 'guard')).text).toContain('\u5df2\u89f8\u767c 2 \u6b21')
  w.reads.length = 0
  await cmd($, '')
  expect(w.reads.filter(p => p === NOTES_PATH).length).toBe(1)
})
