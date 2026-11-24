// ：、、 handoff、、、store 
import { expect, test } from 'claude-code/testing'
import type { On } from 'claude-code'
import { NOTE_TAG, DAY, actionsReply, presentation, composer, cmd, resume, say, startSession, task, cron, endTurn, stop, NOTES, distillNow, ctl, world } from './test-world'

test('\u9054 600k：\u7522\u751f handoff → /clear → \u9001\u51fa', async ($, on) => {
  const w = world(on, 650_000)
  await stop($)
  await w.clock.advance(0)
  expect(w.forks.length).toBe(1)
  expect(w.commands).toEqual(['clear'])
  expect(w.submits.length).toBe(1)
  expect(w.submits[0]).toContain('HANDOFF: \u6e2c\u8a66')
  expect(w.forks[0]).toContain('HANDOFF:')
  expect(w.get('handoffs:C--proj')).toEqual([
    { at: 0, sessionId: 'S1', kind: 'present', tokens: 650_000, text: 'HANDOFF: \u6e2c\u8a66', usage: { input: 1, cacheRead: 650_000, cacheCreation: 0, output: 1, ms: 0 } },
  ])
})

test('\u81ea\u52d5\u4ea4\u63a5\u95dc\u9589（\u9810\u8a2d）：\u5230\u9580\u6abb\u4e0d\u4ea4\u63a5，\u6bcf 30 \u5247\u7167\u6a23\u6574\u7406', async ($, on) => {
  const w = world(on, 650_000, 1_000_000, {}, [], 30, '\u7e41\u9ad4\u4e2d\u6587', false)
  await stop($)
  await w.clock.advance(0)
  expect(w.forks.length).toBe(0)
  expect(w.commands).toEqual([])
  await endTurn($)
  await w.clock.advance(0)
  expect(w.forks).toEqual([])
  expect(w.completes.length).toBe(1)
  expect(w.commands).toEqual([])
})

test('200k \u8996\u7a97：\u9580\u6abb\u964d\u70ba 160k', async ($, on) => {
  const w = world(on, 170_000, 200_000)
  await stop($)
  await w.clock.advance(0)
  expect(w.commands).toEqual(['clear'])
})

test('\u9580\u6abb\u4ee5\u4e0b\u9592\u7f6e：\u5237\u65b0 3 \u6b21\u5f8c\u5b58\u96e2\u5e2d handoff，\u4e0d /clear', async ($, on) => {
  const w = world(on, 100_000)
  await endTurn($)
  await w.clock.advance(0)
  expect(w.commands).toEqual([])
  for (let i = 1; i <= 3; i++) {
    await w.clock.advance(55 * 60_000)
    expect(w.forks).toEqual(Array(i).fill('\u53ea\u56de\u8986 OK'))
  }
  await w.clock.advance(55 * 60_000)
  expect(w.forks.length).toBe(4)
  expect(w.forks[3]).toContain('HANDOFF')
  expect(w.commands).toEqual([])
  expect(w.submits).toEqual([])
  // 
  await w.clock.advance(5 * 60 * 60_000)
  expect(w.forks.length).toBe(4)
  //  handoff  /handoff resume 
  await resume($)
  await w.clock.advance(0)
  expect(w.commands).toEqual(['clear'])
  expect(w.submits[0]).toContain('HANDOFF: \u6e2c\u8a66')
})

// （2026-10-06）：，，，
// ， $.state ，session.start 
// ： idle ，
const savedIdle = (on: On, value: { due: number; refreshes: number }) => {
  let given = false
  on('state.get', (_$, e, next) => {
    if (given || e.key !== 'idle') return next(e)
    given = true
    return { value: { value, version: 1 } } as never
  })
}

test('\u71b1\u91cd\u8f09\u5f8c\u63a5\u56de\u9592\u7f6e\u8a08\u6642：\u7167\u539f\u672c\u7684\u5230\u671f\u6642\u9593\u5237\u65b0，\u5237\u65b0\u6b21\u6578\u63a5\u8457\u7b97', async ($, on) => {
  const w = world(on, 100_000)
  savedIdle(on, { due: 25 * 60_000, refreshes: 1 })
  await startSession($)
  await w.clock.advance(25 * 60_000)
  expect(w.forks).toEqual(['\u53ea\u56de\u8986 OK'])
  await w.clock.advance(55 * 60_000)
  expect(w.forks.length).toBe(2)
  await w.clock.advance(55 * 60_000)
  expect(w.forks[2]).toContain('HANDOFF')
})

test('resume \u5c1a\u7121\u53ef fork \u8acb\u6c42：\u505c\u6b62\u9592\u7f6e\u91cd\u8a66，\u4e0b\u4e00\u4e3b\u56de\u61c9\u91cd\u65b0\u958b\u59cb\u5237\u65b0', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  savedIdle(on, { due: 25 * 60_000, refreshes: 0 })
  ctl.failHandoff = true
  await startSession($)
  await w.clock.advance(25 * 60_000)
  expect(w.forks.length).toBe(1)
  expect(w.forks).toEqual(['\u53ea\u56de\u8986 OK'])
  expect(w.completes).toEqual([])
  const waiting = (await cmd($, '')).text
  expect(waiting).toContain('\u5df2\u5237\u65b0 0/3')
  expect(waiting).toContain('\u8a08\u6642\u5668\u672a\u555f\u52d5')
  expect(waiting).toContain('\u4ea4\u63a5／\u5237\u65b0：\u5f85\u547d')
  await w.clock.advance(5 * 60 * 60_000)
  expect(w.forks).toEqual(['\u53ea\u56de\u8986 OK'])
  expect(w.get('away:S1')).toBeUndefined()
  ctl.failHandoff = false
  await endTurn($)
  await w.clock.advance(55 * 60_000)
  expect(w.forks.filter(prompt => prompt === '\u53ea\u56de\u8986 OK').length).toBe(2)
  expect((await cmd($, '')).text).toContain('\u5df2\u5237\u65b0 1/3')
})

test('resume \u7121\u53ef fork \u8acb\u6c42\u4e14\u6574\u7406\u95dc\u9589：\u4e94\u5c0f\u6642\u5167\u4e0d\u91cd\u8a66\u6216\u5347\u7d1a\u96e2\u5e2d\u4ea4\u63a5', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, { distill: false })
  savedIdle(on, { due: 25 * 60_000, refreshes: 0 })
  ctl.failHandoff = true
  await startSession($)
  await w.clock.advance(25 * 60_000)
  await w.clock.advance(5 * 60 * 60_000)
  expect(w.forks.length).toBe(1)
  expect(w.forks).toEqual(['\u53ea\u56de\u8986 OK'])
  expect(w.get('away:S1')).toBeUndefined()
})

test('\u5237\u65b0\u903e\u6642\u4ecd\u8a08\u6b21\u4e26\u6392\u4e0b\u4e00\u6b21，\u4e0d\u7576\u6210\u6c92\u6709\u53ef fork \u8acb\u6c42', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, { distill: false })
  let release = () => {}
  const gate = new Promise<void>(r => { release = r })
  ctl.handoffGate = () => gate
  await endTurn($)
  await w.clock.advance(60 * 60_000)
  expect(w.forks).toEqual(['\u53ea\u56de\u8986 OK'])
  expect((await cmd($, '')).text).toContain('\u5df2\u5237\u65b0 1/3')
  release()
  ctl.handoffGate = undefined
  await w.clock.advance(55 * 60_000)
  expect(w.forks).toEqual(['\u53ea\u56de\u8986 OK', '\u53ea\u56de\u8986 OK'])
  expect((await cmd($, '')).text).toContain('\u5df2\u5237\u65b0 2/3')
})

test('\u71b1\u91cd\u8f09\u6642\u8a08\u6642\u65e9\u5df2\u904e\u671f：\u4e0d\u88dc\u5237\u65b0', async ($, on) => {
  const w = world(on, 100_000)
  await w.clock.set(70 * 60_000)
  savedIdle(on, { due: 55 * 60_000, refreshes: 0 })
  await startSession($)
  await w.clock.advance(2 * 60 * 60_000)
  expect(w.forks).toEqual([])
})

test('\u5237\u65b0\u95dc\u9589：\u9592\u7f6e 55 \u5206\u9418\u76f4\u63a5\u5b58\u96e2\u5e2d handoff', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, { refresh: false })
  await endTurn($)
  await w.clock.advance(55 * 60_000)
  expect(w.forks.length).toBe(1)
  expect(w.forks[0]).toContain('HANDOFF')
})

// 2026-10-26：；
test('\u5237\u65b0\u8207\u96e2\u5e2d\u4ea4\u63a5\u90fd\u95dc\u9589：\u9592\u7f6e\u591a\u4e45\u90fd\u4e0d fork、\u4e0d\u5b58\u96e2\u5e2d\u72c0\u614b，\u8a0a\u606f\u7167\u5e38\u9001\u51fa', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, { refresh: false })
  ctl.pluginOptions = { away_handoff: false }
  await endTurn($)
  await w.clock.advance(5 * 60 * 60_000)
  expect(w.forks).toEqual([])
  expect(w.get('away:S1')).toBeUndefined()
})

test('\u96e2\u5e2d\u4ea4\u63a5\u95dc\u9589、\u5237\u65b0\u958b\u8457：\u7167\u6a23\u5237\u65b0 3 \u6b21，\u4e4b\u5f8c\u4e0d\u7522\u751f\u96e2\u5e2d\u4ea4\u63a5', async ($, on) => {
  const w = world(on, 100_000)
  ctl.pluginOptions = { away_handoff: false }
  await endTurn($)
  await w.clock.advance(5 * 60 * 60_000)
  expect(w.forks).toEqual(Array(3).fill('\u53ea\u56de\u8986 OK'))
  expect(w.get('away:S1')).toBeUndefined()
})

test('context \u592a\u5c0f：\u4e0d\u5237\u65b0\u4e5f\u4e0d\u7522\u751f handoff', async ($, on) => {
  const w = world(on, 10_000)
  await endTurn($)
  await w.clock.advance(5 * 60 * 60_000)
  expect(w.forks).toEqual([])
})

test('handoff resume：/clear \u5f8c\u9001\u51fa handoff \u548c\u88ab\u6514\u4e0b\u7684\u8a0a\u606f', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, { 'away:S1': { handoff: 'HANDOFF: \u6e2c\u8a66', held: '\u6211\u56de\u4f86\u4e86' } })
  await resume($)
  await w.clock.advance(0)
  expect(w.commands).toContain('clear')
  expect(w.submits[0]).toContain('HANDOFF: \u6e2c\u8a66')
  expect(w.submits[0]).toContain('\u6211\u56de\u4f86\u4e86')
  // ： /clear
  await resume($)
  await w.clock.advance(0)
  expect(w.commands).toEqual(['clear'])
})

test('\u5b50\u4ee3\u7406\u9084\u5728\u8dd1：\u5ef6\u5f8c handoff', async ($, on) => {
  const w = world(on, 650_000, 1_000_000, {}, [{ id: 'a1', status: 'running' }])
  await stop($)
  await w.clock.advance(0)
  expect(w.commands).toEqual([])
})

test('handoff dry：\u7522\u751f handoff \u4e26\u56de\u5831\u7528\u91cf，\u4e0d /clear', async ($, on) => {
  const w = world(on, 650_000)
  const r = await cmd($, 'dry')
  expect(w.forks.length).toBe(1)
  expect(w.commands).toEqual([])
  expect(r.text).toContain('HANDOFF: \u6e2c\u8a66')
  expect(r.text).toContain('\u5feb\u53d6\u8b80 650,000')
  const s = await cmd($, '')
  //  dry，
  expect(s.text).toContain(' dry，context')
  expect(s.text).toContain('\u8f38\u51fa 1')
})

test('handoff：\u4e0d\u5e36\u53c3\u6578\u986f\u793a\u72c0\u614b\u548c\u7528\u6cd5，\u4e0d\u8a8d\u5f97\u7684\u5b50\u6307\u4ee4\u53ea\u56de\u7528\u6cd5、\u4e0d\u52d5\u4f5c', async ($, on) => {
  const w = world(on, 650_000)
  const s = await cmd($, '')
  expect(s.text).toContain('\u9580\u6abb')
  expect(s.text).toContain('/handoff now')
  expect(s.text).toContain('/handoff resend')
  const u = await cmd($, 'nwo')
  expect(u.text).toContain('\u4e0d\u8a8d\u5f97「nwo」')
  expect(w.forks.length).toBe(0)
  expect(w.commands).toEqual([])
})

// ---------- S1： ----------

test('S1 \u9580\u6abb\u4ea4\u63a5\u671f\u9593：\u4eba\u985e\u8a0a\u606f\u88ab\u6514\u4e0b，\u6700\u7d42\u9001\u51fa\u7684\u6587\u5b57\u5305\u542b\u5b83', async ($, on) => {
  const w = world(on, 650_000, 1_000_000, {}, [], 5)
  //  fork 
  ctl.handoffGate = async () => { await say($, '\u4e2d\u9014\u8a0a\u606f') }
  await stop($)
  await w.clock.settle()
  expect(w.commands).toEqual(['clear'])
  // ，
  expect(w.submits.length).toBe(1)
  expect(w.submits[0]).toContain('HANDOFF: \u6e2c\u8a66')
  expect(w.submits[0]).toContain('\u4ea4\u63a5\u671f\u9593\u6536\u5230\u7684\u4f7f\u7528\u8005\u8a0a\u606f')
  expect(w.submits[0]).toContain('\u4e2d\u9014\u8a0a\u606f')
})

test('S1 /clear \u5b8c\u6210\u5f8c、\u9001\u51fa\u524d\u5230\u7684\u8a0a\u606f：\u53e6\u5916\u63a5\u5728 handoff \u4e4b\u5f8c\u9001\u51fa', async ($, on) => {
  const w = world(on, 650_000)
  ctl.onClear = async () => { await say($, '\u665a\u5230\u7684\u8a0a\u606f') }
  await stop($)
  await w.clock.settle()
  expect(w.commands).toEqual(['clear'])
  expect(w.submits.length).toBe(2)
  expect(w.submits[0]).toContain('HANDOFF: \u6e2c\u8a66')
  expect(w.submits[0]).not.toContain('\u665a\u5230\u7684\u8a0a\u606f')
  expect(w.submits[1]).toBe('\u665a\u5230\u7684\u8a0a\u606f')
})

test('S1 /handoff dry \u9032\u884c\u4e2d：\u4eba\u985e\u8a0a\u606f\u4e0d\u88ab\u6514\u4e0b', async ($, on) => {
  const w = world(on, 100_000)
  let release: () => void = () => {}
  const gate = new Promise<void>(r => { release = r })
  ctl.forkGate = () => gate
  const run = cmd($, 'dry')
  await w.clock.settle()
  expect(w.forks.length).toBe(1)
  await say($, '\u4eba\u985e\u8a0a\u606f')
  expect(w.submits).toEqual(['\u4eba\u985e\u8a0a\u606f'])
  release()
  await run
})

test('S1 \u96e2\u5e2d handoff \u7522\u751f\u4e2d：\u4e0d\u88ab S1 \u6514\u4e0b', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, { refresh: false })
  await endTurn($)
  let release: () => void = () => {}
  const gate = new Promise<void>(r => { release = r })
  ctl.forkGate = () => gate
  await w.clock.advance(55 * 60_000)
  expect(w.forks.length).toBe(1)
  await say($, '\u4eba\u985e\u8a0a\u606f')
  expect(w.submits).toEqual(['\u4eba\u985e\u8a0a\u606f'])
  release()
  await w.clock.settle()
  expect(w.get('away:S1')).toBeUndefined()
  await say($, '\u4e0d\u61c9\u88ab\u904e\u6642\u4ea4\u63a5\u6514\u4e0b')
  expect(w.submits.at(-1)).toBe('\u4e0d\u61c9\u88ab\u904e\u6642\u4ea4\u63a5\u6514\u4e0b')
})

test('\u5237\u65b0\u5f8c\u8b80\u53d6\u66ab\u505c\u72c0\u614b\u671f\u9593\u63db session，\u4e0d\u63a1\u7528\u820a\u4f86\u6e90\u6216\u958b\u59cb\u6574\u7406', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  let armed = false
  let switched = false
  on('state.get', (_$, e, next) => {
    if (armed && !switched && e.key === 'awayControl') {
      switched = true
      ctl.curSid = 'S2'
    }
    return next(e)
  })
  ctl.handoffGate = async () => { armed = true }
  await endTurn($)
  await w.clock.advance(55 * 60_000)
  expect(switched).toBe(true)
  expect(w.forks).toEqual(['\u53ea\u56de\u8986 OK'])
  expect(w.completes).toEqual([])
  expect((await cmd($, '')).text).toContain('0/3')
  expect(w.get('away:S1')).toBeUndefined()
})

for (const changed of ['complete', 'session', 'attachment']) {
  test(`\u96e2\u5e2d\u751f\u6210\u5f8c\u4f86\u6e90\u5df2\u524d\u9032，\u4e0d\u63a1\u7528\u665a\u5230\u7d50\u679c：${changed}`, async ($, on) => {
    const w = world(on, 100_000, 1_000_000, { refresh: false, distill: false })
    await endTurn($)
    let release = () => {}
    const gate = new Promise<void>(r => { release = r })
    ctl.handoffGate = () => gate
    await w.clock.advance(55 * 60_000)
    if (changed === 'complete') await endTurn($)
    if (changed === 'session') ctl.curSid = 'S2'
    if (changed === 'attachment') await $.prompt.submit({ text: '', attachments: [{ type: 'image' }], origin: composer, wait: false })
    release()
    await w.clock.settle()
    expect(w.get('away:S1')).toBeUndefined()
    expect(w.get('away:S2')).toBeUndefined()
    expect(w.get('handoffs:C--proj')).toBeUndefined()
  })
}

for (const op of ['get', 'set']) {
  test(`\u96e2\u5e2d\u6b77\u53f2${op}\u7b49\u5f85\u671f\u9593\u5c0d\u8a71\u524d\u9032，\u665a\u5230\u6458\u8981\u4e0d\u80fdresend\u63a1\u7528`, async ($, on) => {
    const w = world(on, 100_000, 1_000_000, { refresh: false, distill: false })
    let fired = false
    ctl.onStore = async (operation, key) => {
      if (!fired && operation === op && key === 'handoffs:C--proj') {
        fired = true
        await say($, '\u96e2\u5e2d\u6458\u8981\u9084\u5728\u5b58\u6a94\u6642\u6211\u5df2\u56de\u4f86')
      }
    }
    await endTurn($)
    await w.clock.advance(55 * 60_000)
    expect(fired).toBe(true)
    expect(w.get('away:S1')).toBeUndefined()
    await cmd($, 'resend')
    await w.clock.settle()
    expect(w.submits).toEqual(['\u96e2\u5e2d\u6458\u8981\u9084\u5728\u5b58\u6a94\u6642\u6211\u5df2\u56de\u4f86'])
  })
}

test('\u66ab\u505c\u96e2\u5e2d\u53d6\u6d88timer\u4f46\u624b\u52d5\u6574\u7406\u4ecd\u53ef\u7528，\u6062\u5fa9\u5f9e\u73fe\u5728\u91cd\u6392', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  await endTurn($)
  await cmd($, 'away pause')
  await w.clock.advance(120 * 60_000)
  expect(w.forks).toEqual([])
  expect(w.completes).toEqual([])
  expect(w.commands).toEqual([])
  expect(w.get('away:S1')).toBeUndefined()
  await cmd($, 'distill')
  expect(w.completes.length).toBe(1)
  await cmd($, 'away resume')
  await w.clock.advance(49 * 60_000)
  expect(w.forks).toEqual([])
  await w.clock.advance(60_000)
  expect(w.forks.at(-1)).toBe('\u53ea\u56de\u8986 OK')
})

test('\u66ab\u505c\u5f8c\u518d\u6062\u5fa9\u4e5f\u4e0d\u63a1\u7528\u5df2\u767c\u51fa\u7684\u820a\u96e2\u5e2dfork', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, { refresh: false, distill: false })
  await endTurn($)
  let release = () => {}
  const gate = new Promise<void>(r => { release = r })
  ctl.handoffGate = () => gate
  await w.clock.advance(55 * 60_000)
  await cmd($, 'away pause')
  await cmd($, 'away resume')
  release()
  await w.clock.settle()
  expect(w.get('away:S1')).toBeUndefined()
})

for (const sid of ['S1', 'S2']) {
  test(`\u71b1\u91cd\u8f09\u4fdd\u7559\u540csession\u66ab\u505c，\u65b0session\u4e0d\u7e7c\u627f：${sid}`, async ($, on) => {
    const w = world(on, 100_000, 1_000_000, { distill: false })
    ctl.curSid = sid
    on('state.get', (_$, e, next) => e.key === 'awayControl'
      ? { value: { value: { sid: 'S1', paused: true }, version: 1 } } as never : next(e))
    await startSession($)
    await endTurn($)
    expect((await cmd($, '')).text).toContain(sid === 'S1' ? '\u96e2\u5e2d\u5de5\u4f5c\u5df2\u66ab\u505c' : '\u96e2\u5e2d\u5de5\u4f5c\u555f\u7528')
    await w.clock.advance(55 * 60_000)
    expect(w.forks.length).toBe(sid === 'S1' ? 0 : 1)
  })
}

test('\u7b46\u8a18\u8207\u4ea4\u63a5\u4e26\u884c\u6642\u5169\u500b\u72c0\u614b\u69fd\u4e92\u4e0d\u8986\u84cb', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  let releaseDistill = () => {}
  let releaseHandoff = () => {}
  const distillGate = new Promise<void>(r => { releaseDistill = r })
  const handoffGate = new Promise<void>(r => { releaseHandoff = r })
  ctl.distillGate = () => distillGate
  ctl.handoffGate = () => handoffGate
  const updating = distillNow($)
  const generating = cmd($, 'dry')
  await w.clock.advance(0)
  const during = (await cmd($, '')).text
  expect(during).toContain('\u7b46\u8a18\u6574\u7406：\u624b\u52d5（\u4f86\u6e90 S1')
  expect(during).toContain('\u4ea4\u63a5／\u5237\u65b0：\u7522\u751f\u6458\u8981（\u4f86\u6e90 S1')
  releaseHandoff()
  await generating
  const remaining = (await cmd($, '')).text
  expect(remaining).toContain('\u7b46\u8a18\u6574\u7406：\u624b\u52d5（\u4f86\u6e90 S1')
  expect(remaining).toContain('\u4ea4\u63a5／\u5237\u65b0：\u5f85\u547d')
  releaseDistill()
  await updating
})

test('S1 handoff fork \u5931\u6557：\u6514\u4e0b\u7684\u8a0a\u606f\u5728\u820a\u5c0d\u8a71\u91cd\u65b0\u9001\u51fa', async ($, on) => {
  const w = world(on, 650_000, 1_000_000, {}, [], 5)
  ctl.failHandoff = true
  ctl.onComplete = async () => { await say($, '\u4e2d\u9014\u8a0a\u606f') }
  await stop($)
  await w.clock.settle()
  expect(w.commands).toEqual([])
  expect(w.submits).toEqual(['\u4e2d\u9014\u8a0a\u606f'])
})

test('S1 \u4ea4\u63a5 fork \u8207\u4ea4\u63a5\u524d\u6574\u7406\u540c\u6642\u767c\u51fa', async ($, on) => {
  const w = world(on, 650_000, 1_000_000, {}, [], 5)
  let release: () => void = () => {}
  const gate = new Promise<void>(r => { release = r })
  ctl.forkGate = () => gate
  ctl.completeGate = () => gate
  await stop($)
  await w.clock.settle()
  expect(w.forks.length).toBe(1)
  expect(w.completes.length).toBe(1)
  expect(w.commands).toEqual([])
  release()
  await w.clock.settle()
  expect(w.commands).toEqual(['clear'])
})

// ：，；
// ，（/clear ）
test('S1 \u4ea4\u63a5\u6642\u5df2\u6709\u6574\u7406\u5728\u8dd1：\u4ea4\u63a5\u524d\u5148\u8b80\u597d\u6700\u5f8c\u4e00\u6bb5，\u7b49\u90a3\u6b21\u6574\u7406\u7d50\u675f\u518d\u88dc\u6574\u7406', async ($, on) => {
  let turns = 5
  const w = world(on, 650_000, 1_000_000, {}, [], () => turns)
  w.rows.push({ role: 'user', text: '\u7b2c\u4e00\u6bb5\u7684\u5c0d\u8a71', toolUses: [] })
  let release: () => void = () => {}
  const gate = new Promise<void>(r => { release = r })
  ctl.distillGate = () => gate
  const first = distillNow($)
  await w.clock.settle()
  expect(w.completes.length).toBe(1)
  // ，
  w.rows.push({ role: 'user', text: '\u6700\u5f8c\u4e00\u6bb5：\u4e4b\u5f8c\u4e00\u5f8b\u5148\u8dd1\u6e2c\u8a66', toolUses: [] })
  turns = 8
  // /clear ： session、
  ctl.onClear = () => { ctl.curSid = 'S2'; w.rows.length = 0 }
  await stop($)
  await w.clock.settle()
  // 
  expect(w.commands).toEqual(['clear'])
  expect(w.logs.some(l => l.includes('\u6392\u5728\u5b83\u4e4b\u5f8c'))).toBe(true)
  release()
  await first
  await w.clock.settle()
  expect(w.completes.length).toBe(2)
  expect(w.completes[1]?.prompt).toContain('\u6700\u5f8c\u4e00\u6bb5：\u4e4b\u5f8c\u4e00\u5f8b\u5148\u8dd1\u6e2c\u8a66')
  //  session ：
  expect((w.get('distill:S1') as { turn: number }).turn).toBe(8)
})

// ---------- S2： ----------

test('S2 \u88ab\u6514\u4e0b\u7684\u8a0a\u606f\u8207\u659c\u7dda\u6307\u4ee4\u4e0d\u6d88\u8017\u6392\u5165\u7684\u5dee\u7570，\u4e0b\u4e00\u5247\u771f\u6b63\u9001\u51fa\u7684\u624d\u5e36\u5165、\u518d\u4e0b\u4e00\u5247\u4e0d\u5e36', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, { 'away:S1': { handoff: 'H' } }, [], 5)
  await distillNow($)
  //  handoff ：
  await say($, '\u88ab\u6514\u4e0b\u7684\u8a0a\u606f')
  expect(w.submits).toEqual([])
  // ：
  await say($, '/handoff')
  expect(w.submits).toEqual(['/handoff'])
  expect(w.contexts[0]).toBeUndefined()
  // ＝：，
  await say($, '\u88ab\u6514\u4e0b\u7684\u8a0a\u606f')
  expect(w.contexts[1]?.[0]).toContain(NOTE_TAG)
  expect(w.contexts[1]?.[0]).toContain('\u65b0\u589e\u8a18\u61b6')
  // 
  await say($, '\u518d\u4e0b\u4e00\u5247')
  expect(w.contexts[2]).toBeUndefined()
})

test('S2 \u4ea4\u63a5\u524d\u6574\u7406\u4e0d\u6392\u5165\u5dee\u7570', async ($, on) => {
  const w = world(on, 650_000, 1_000_000, {}, [], 5)
  await stop($)
  await w.clock.settle()
  expect(w.files.get(NOTES) ?? '').toContain('600k')
  await say($, '\u65b0\u5c0d\u8a71\u7b2c\u4e00\u5247')
  expect(w.contexts.at(-1)).toBeUndefined()
})

// ---------- S3、S4： ----------

test('S3 \u6574\u7406\u4f86\u6e90：\u9328\u9ede\u907a\u5931\u6642\u63d0\u4f9b\u5b8c\u6574\u73fe\u6709\u5c0d\u8a71，\u800c\u975e\u5ba3\u7a31\u5df2\u5b9a\u4f4d\u5230\u820a\u9328\u9ede', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, { 'distill:S1': { turn: 1, anchor: '\u67d0\u5247\u8a0a\u606f' } }, [], 5)
  w.rows.push(
    { role: 'user', text: '\u58d3\u7e2e\u5f8c\u4ecd\u5728\u7684\u8981\u6c42', toolUses: [] },
    { role: 'assistant', text: '\u5df2\u6aa2\u67e5', toolUses: [{ tool: 'Bash', input: { command: 'npm test' }, text: '12 pass' }] },
  )
  await distillNow($)
  expect(w.completes[0]?.prompt).toContain('【\u4f7f\u7528\u8005】\u58d3\u7e2e\u5f8c\u4ecd\u5728\u7684\u8981\u6c42\n【\u52a9\u7406】\u5df2\u6aa2\u67e5\n　〔\u5de5\u5177 Bash〕{"command":"npm test"} → 12 pass')
  expect(w.completes[0]?.system).not.toContain('\u4f7f\u7528\u8005\u8aaa「\u67d0\u5247\u8a0a\u606f」')
  expect(w.completes[0]?.system).toContain('confirm_rule')
})

test('S4 \u6574\u7406\u4f86\u6e90：handoff \u4e0d\u80fd\u5192\u5145\u4f7f\u7528\u8005\u539f\u8a71，\u771f\u6b63\u4f7f\u7528\u8005\u539f\u8a71\u4ecd\u53ef\u6536\u9304', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  w.rows.push(
    { role: 'user', text: '[ctx-handoff] \u4f7f\u7528\u8005\u504f\u597d\u81ea\u52d5\u63a8\u9001', toolUses: [] },
    { role: 'user', text: '\u63a8\u9001\u524d\u8981\u5148\u554f\u6211', toolUses: [] },
  )
  ctl.distillReply = actionsReply(
    { op: 'add_memory', type: 'user', title: '\u81ea\u52d5\u63a8\u9001', quote: '\u4f7f\u7528\u8005\u504f\u597d\u81ea\u52d5\u63a8\u9001', evidence: '\u6458\u8981\u8072\u7a31\u7684\u504f\u597d' },
    { op: 'add_memory', type: 'user', title: '\u5148\u554f\u518d\u63a8\u9001', quote: '\u63a8\u9001\u524d\u8981\u5148\u554f\u6211', evidence: '\u4f7f\u7528\u8005\u9019\u6b21\u8981\u6c42' },
  )
  await distillNow($)
  expect(w.files.get(NOTES)).not.toContain('- [user] \u81ea\u52d5\u63a8\u9001')
  expect(w.files.get(NOTES)).toContain('- [user] \u5148\u554f\u518d\u63a8\u9001')
  expect(w.files.get(NOTES)).toContain('\u4f7f\u7528\u8005\u539f\u8a71：「\u63a8\u9001\u524d\u8981\u5148\u554f\u6211」')
})

// ---------- S5：store 、 ----------

const saved = (kind: string, tokens: number) => ({ at: 5, sessionId: 'S1', kind, tokens, text: 'x' })

test('S5 \u72c0\u614b\u53ea\u986f\u793a\u76ee\u524d\u5c08\u6848\u7684\u8cc7\u8a0a', async ($, on) => {
  world(on, 100_000, 1_000_000, {
    handoffs: [saved('present', 999)],
    'handoffs:OTHER': [saved('manual', 888)],
    'handoffs:C--proj': [saved('away', 123)],
    'distill:last': { at: 1, why: '\u820a\u5168\u57df', changes: [], file: 'f', usage: 'u' },
    'distill:last:OTHER': { at: 1, why: '\u5225\u7684\u5c08\u6848', changes: [], file: 'f', usage: 'u' },
    'distill:error': { at: 9, why: '\u820a\u5168\u57df\u932f\u8aa4', reason: 'r1' },
    'handoff:error:OTHER': { at: 9, sessionId: 'Z', kind: 'present', reason: '\u5225\u7684\u5c08\u6848\u7684\u5931\u6557', tokens: 1, turns: 1 },
  })
  const s = (await cmd($, '')).text
  expect(s).toContain(' away，context 123')
  expect(s).not.toContain('999')
  expect(s).not.toContain('888')
  expect(s).not.toContain('\u820a\u5168\u57df')
  expect(s).not.toContain('\u5225\u7684\u5c08\u6848')
})

test('\u4f7f\u7528\u8005\u5df2\u6709 /handoff：\u6539\u8a3b\u518a /ctx-handoff，\u6307\u4ee4\u7167\u5e38\u53ef\u7528，\u555f\u52d5\u6642\u7684\u6574\u7406\u7167\u8dd1', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, { 'last:OLD': 'x' })
  ctl.takenCommands = new Set(['handoff'])
  await startSession($)
  expect(ctl.registered).toEqual(['handoff', 'ctx-handoff'])
  //  store ： session  seen
  expect((w.get('seen') as Record<string, number>)['last:OLD']).toBeDefined()
  const r = await $.command.run({ command: 'ctx-handoff', args: '', origin: composer, presentation })
  expect(r.text).toContain('\u80cc\u666f\u6574\u7406')
})

const staleAway = { handoff: 'H', held: '\u6514\u4e0b\u7684\u8a0a\u606f' }

test('S5 \u6e05\u7406：\u820a\u5b57\u4e32\u503c\u8207 away \u4e0d\u88ab\u6539\u5beb，\u53ea\u8a18\u4e0b\u7b2c\u4e00\u6b21\u770b\u5230\u7684\u6642\u9593', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, { 'last:x': '\u820a\u7684\u5b57\u4e32\u9328\u9ede', 'away:y': staleAway })
  await startSession($)
  expect(w.get('last:x')).toBe('\u820a\u7684\u5b57\u4e32\u9328\u9ede')
  expect(w.get('away:y')).toEqual(staleAway)
  const seen = (w.get('seen')) as Record<string, number>
  expect(Object.keys(seen).sort()).toEqual(['away:y', 'last:x'])
})

test('S5 \u6e05\u7406：\u7b2c\u4e00\u6b21\u770b\u5230\u8d85\u904e 30 \u5929\u7684\u522a\u9664、1 \u5929\u7684\u4fdd\u7559', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, { 'last:x': '\u820a\u7684\u5b57\u4e32\u9328\u9ede', 'away:y': staleAway, seen: { 'last:x': 0, 'away:y': 30 * DAY } })
  await w.clock.set(31 * DAY)
  await startSession($)
  expect(w.get('last:x')).toBeUndefined()
  expect(w.get('away:y')).toEqual(staleAway)
  expect(Object.keys((w.get('seen')) as Record<string, number>)).toEqual(['away:y'])
})

test('S5 \u65b0\u7a0b\u5f0f\u5efa\u7acb\u7684\u6bcf session \u9375\u4e5f\u8a18\u9032 seen；\u5df2\u7d93\u8a18\u9304\u7684\u6642\u9593\u4e0d\u91cd\u5beb', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, { seen: { 'last:S1': 1 } }, [], 5)
  await w.clock.set(5 * DAY)
  await say($, '\u4e00\u5247\u8a0a\u606f')
  await distillNow($)
  const seen = w.get('seen') as Record<string, number>
  expect(seen['last:S1']).toBe(1)
  expect(seen['distill:S1']).toBe(5 * DAY)
})

for (const changed of ['prompt', 'session', 'pause']) {
  test(`\u5237\u65b0\u5f8c\u6574\u7406\u7b49\u5f85\u671f\u9593\u4f86\u6e90\u6539\u8b8a，\u4e0d\u91cd\u6392\u65b0\u56de\u5408timer\u6216\u6263\u5237\u65b0\u984d\u5ea6：${changed}`, async ($, on) => {
    const w = world(on, 100_000, 1_000_000, {}, [], 5)
    await endTurn($)
    let release = () => {}
    const gate = new Promise<void>(r => { release = r })
    ctl.distillGate = () => gate
    await w.clock.advance(55 * 60_000)
    expect(w.completes.length).toBe(1)
    await w.clock.advance(10 * 60_000)
    if (changed === 'pause') {
      await cmd($, 'away pause')
      await cmd($, 'away resume')
    } else {
      if (changed === 'session') ctl.curSid = 'S2'
      else await say($, '\u958b\u59cb\u65b0\u7684\u56de\u5408')
      await endTurn($)
    }
    await w.clock.advance(5 * 60_000)
    ctl.distillGate = undefined
    release()
    await w.clock.settle()
    expect(w.forks).toEqual(['\u53ea\u56de\u8986 OK'])
    expect(w.completes.length).toBe(1)
    expect((await cmd($, '')).text).toContain('0/3')
    w.put('distill', false)
    for (let i = 0; i < 3; i++) {
      await w.clock.advance((i === 0 ? 45 : 50) * 60_000)
      expect(w.forks.at(-1)).toBe('\u53ea\u56de\u8986 OK')
      expect(w.forks.filter(p => p === '\u53ea\u56de\u8986 OK').length).toBe(i + 2)
    }
    expect(w.get(`away:${ctl.curSid}`)).toBeUndefined()
  })
}

// ---------- S8：（classic.Stop） ----------

test('S8 \u80cc\u666f shell \u9084\u5728\u8dd1：\u4e0d /clear，\u72c0\u614b\u770b\u5f97\u5230\u539f\u56e0，\u53ea\u63d0\u9192\u4e00\u6b21；\u7d50\u675f\u5f8c\u7684 Stop \u624d\u4ea4\u63a5', async ($, on) => {
  const w = world(on, 650_000)
  await stop($, { background_tasks: [task()] })
  await w.clock.advance(0)
  expect(w.commands).toEqual([])
  await stop($, { background_tasks: [task()] })
  await w.clock.advance(0)
  expect(w.commands).toEqual([])
  expect(w.toasts.filter(t => t.includes('\u5ef6\u5f8c')).length).toBe(1)
  expect((await cmd($, '')).text).toContain('handoff \u5ef6\u5f8c')
  await stop($, { background_tasks: [task('completed')] })
  await w.clock.advance(0)
  expect(w.commands).toEqual(['clear'])
})

test('S8 \u5225\u7684 Stop hook \u8981\u6c42\u7e7c\u7e8c：\u9019\u6b21\u4e0d\u4ea4\u63a5，\u771f\u6b63\u505c\u4e0b\u7684\u90a3\u6b21\u624d\u4ea4\u63a5', async ($, on) => {
  const w = world(on, 650_000, 1_000_000, { distill: false })
  ctl.stopBlock = '\u7e7c\u7e8c\u5de5\u4f5c'
  await stop($)
  await w.clock.advance(0)
  expect(w.forks).toEqual([])
  expect(w.commands).toEqual([])
  ctl.stopBlock = undefined
  await stop($, { stop_hook_active: true })
  await w.clock.advance(0)
  expect(w.commands).toEqual(['clear'])
})

test('S2 \u4e0b\u5c64 hook \u4e1f\u68c4\u8a0a\u606f：\u5dee\u7570\u4e0d\u88ab\u6d88\u8017，\u4e0b\u4e00\u5247\u624d\u5e36\u5165', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  await distillNow($)
  ctl.failSubmits = 1
  const r = await say($, '\u88ab\u4e0b\u5c64\u4e1f\u68c4')
  expect((r as { drop?: string }).drop).toBe('submit boom')
  await say($, '\u4e0b\u4e00\u5247')
  expect(w.contexts[0]?.[0]).toContain(NOTE_TAG)
})

test('S8 \u4e00\u6b21\u6027\u6392\u7a0b\u9084\u5728：\u4e0d /clear', async ($, on) => {
  const w = world(on, 650_000)
  await stop($, { session_crons: [cron(false)] })
  await w.clock.advance(0)
  expect(w.commands).toEqual([])
})

test('S8 \u53ea\u6709\u5faa\u74b0\u6392\u7a0b：\u7167\u5e38 /clear', async ($, on) => {
  const w = world(on, 650_000)
  await stop($, { session_crons: [cron(true)] })
  await w.clock.advance(0)
  expect(w.commands).toEqual(['clear'])
})

test('S8 \u8d85\u904e\u4e0a\u9650：\u80cc\u666f\u5de5\u4f5c\u9084\u5728\u4e5f\u4ea4\u63a5，\u4e26\u5728\u958b\u982d\u8a3b\u660e', async ($, on) => {
  //  1M： 600k， min(900k, 750k) = 750k
  const w = world(on, 760_000)
  await stop($, { background_tasks: [task()] })
  await w.clock.advance(0)
  expect(w.commands).toEqual(['clear'])
  expect(w.submits[0]).toContain('\u4ea4\u63a5\u6642\u4ecd\u67091 \u500b\u80cc\u666f\u5de5\u4f5c\u5728\u57f7\u884c')
})

// ---------- S9： ----------

test('S9 \u96e2\u5e2d：\u7b2c\u4e8c\u5247\u4e0d\u540c\u6587\u5b57\u7684\u8a0a\u606f\u9023\u540c\u5148\u524d\u6514\u4e0b\u7684\u4e00\u8d77\u9001\u9032\u820a\u5c0d\u8a71；\u76f8\u540c\u6587\u5b57\u5247\u7167\u539f\u6a23', async ($, on) => {
  const away = { handoff: 'H', held: '\u7b2c\u4e00\u5247' }
  const w = world(on, 100_000, 1_000_000, { 'away:S1': away })
  await say($, '\u7b2c\u4e8c\u5247')
  expect(w.submits).toEqual(['\u7b2c\u4e00\u5247\n\n\u7b2c\u4e8c\u5247'])
  expect(w.get('away:S1')).toBeUndefined()
  w.put('away:S1', away)
  await say($, '\u7b2c\u4e00\u5247')
  expect(w.submits[1]).toBe('\u7b2c\u4e00\u5247')
  expect(w.get('away:S1')).toBeUndefined()
})

test('S9 \u96e2\u5e2d handoff \u5b58\u597d\u5f8c\u4e3b\u5c0d\u8a71\u53c8\u5b8c\u6210\u56de\u5408：\u6c92\u6709\u6514\u4e0b\u8a0a\u606f\u5c31\u522a\u6389\u96e2\u5e2d\u72c0\u614b', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, { 'away:S1': { handoff: 'H' } })
  await endTurn($)
  expect(w.get('away:S1')).toBeUndefined()
})

test('S9 \u5df2\u6514\u4e0b\u8a0a\u606f\u7684\u96e2\u5e2d\u72c0\u614b\u4e0d\u6703\u56e0\u56de\u5408\u5b8c\u6210\u88ab\u522a', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, { 'away:S1': { handoff: 'H', held: '\u6211\u56de\u4f86\u4e86' } })
  await endTurn($)
  expect(w.get('away:S1')).toBeDefined()
})
