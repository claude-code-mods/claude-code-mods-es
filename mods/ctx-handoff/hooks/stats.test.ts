// ：、、、 stats:<>，、
import { expect, test } from 'claude-code/testing'
import { DAY, cmd, ctl, distillNow, endTurn, pushGuard, resume, say, startSession, stop, world } from './test-world'
import type { Stats } from './records'
import { addBackgroundUsage } from './records'

const statsOf = (w: ReturnType<typeof world>) => w.get('stats:C--proj') as Stats | undefined

test('session\u7528\u91cf\u6cbf30\u5929\u6e05\u7406，\u5de5\u4f5c\u5340\u7d2f\u8a08\u8207\u672a\u5b8c\u6210retry\u7aef\u9ede\u4fdd\u7559', async ($, on) => {
  const stats = addBackgroundUsage(undefined, 0, 'C--proj')
  const retry = { fromTurn: 0, turn: 5, rowCount: 1, last: { role: 'user', text: '\u5f85\u91cd\u8a66' } }
  const w = world(on, 100_000, 1_000_000, {
    'stats:session:old': stats, 'stats:session:boundary': stats, 'stats:C--proj': stats,
    'distill:retry:old': retry,
  })
  await startSession($)
  expect((w.get('seen') as Record<string, number> | undefined)?.['stats:session:old']).toBe(0)
  await w.clock.set(DAY)
  w.put('stats:session:recent', stats)
  await startSession($)
  await w.clock.set(30 * DAY)
  await startSession($)
  expect(w.get('stats:session:boundary')).toEqual(stats)
  await w.clock.set(31 * DAY)
  await startSession($)
  expect(w.get('stats:session:old')).toBeUndefined()
  expect(w.get('stats:session:boundary')).toBeUndefined()
  expect(w.get('stats:session:recent')).toEqual(stats)
  expect(w.get('stats:C--proj')).toEqual(stats)
  expect(w.get('distill:retry:old')).toEqual(retry)
})

test('\u80cc\u666f\u7528\u91cf\u53ea\u7d2f\u52a0\u5be6\u5831\u6578\u503c，\u672a\u77e5\u7d50\u679c\u4e0d\u5192\u5145\u96f6\u6210\u672c', () => {
  const first = addBackgroundUsage(undefined, 10, 'P', { input: 2, cacheRead: 3, cacheCreation: 4, output: 5, ms: 6 })
  const second = addBackgroundUsage(first, 20, 'P')
  expect(second.background).toEqual({ since: 10, project: 'P', usage: { input: 2, cacheRead: 3, cacheCreation: 4, output: 5, ms: 6 }, unknownResults: 1 })
})

test('\u672csession\u80cc\u666f\u7528\u91cf\u5305\u542b\u6709usage\u7684\u5931\u6557，\u7121usage\u5931\u6557\u53e6\u8a18\u672a\u77e5', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  ctl.completeAborts = true
  await distillNow($)
  ctl.failHandoff = true
  await cmd($, 'dry')
  const background = (w.get('stats:session:S1') as Stats).background
  expect(background).toMatchObject({ project: 'C--proj', usage: { input: 1, output: 1, cacheRead: 0, cacheCreation: 0 }, unknownResults: 1 })
  expect((await cmd($, '')).text).toContain('1 \u6b21\u8acb\u6c42\u7528\u91cf\u672a\u77e5')
})

test('clear\u5f8c\u80cc\u666f\u7528\u91cf\u4ecd\u6b78\u539f\u59cb\u4f86\u6e90session，\u4e0d\u91cd\u8907\u7b97handoff\u751f\u6210', async ($, on) => {
  const w = world(on, 650_000, 1_000_000, { distill: false })
  ctl.onClear = () => { ctl.curSid = 'S2' }
  await stop($)
  await w.clock.settle()
  expect((w.get('stats:session:S1') as Stats).background).toMatchObject({ usage: { input: 1, cacheRead: 650_000, output: 1 }, unknownResults: 0 })
  expect(w.get('stats:session:S2')).toBeUndefined()
})

test('\u7d71\u8a08：\u5728\u5834\u4ea4\u63a5\u6210\u529f\u8207\u4ea4\u63a5\u671f\u9593\u6514\u4e0b\u7684\u8a0a\u606f', async ($, on) => {
  const w = world(on, 650_000, 1_000_000, {}, [], 5)
  ctl.handoffGate = async () => { await say($, '\u4e2d\u9014\u8a0a\u606f') }
  await stop($)
  await w.clock.settle()
  //  distill.ok
  expect(statsOf(w)?.counts).toEqual({ 'handoff.present.ok': 1, held: 1, 'distill.ok': 1 })
})

test('\u7d71\u8a08：\u4ea4\u63a5\u5931\u6557\u8a18\u6b21\u6578\u8207\u539f\u56e0；\u6514\u4e0b\u7684\u8a0a\u606f\u9001\u56de\u820a\u5c0d\u8a71\u4e0d\u7b97\u907a\u5931', async ($, on) => {
  const w = world(on, 650_000, 1_000_000, {}, [], 5)
  ctl.failHandoff = true
  ctl.handoffGate = async () => { await say($, '\u4e2d\u9014\u8a0a\u606f') }
  await stop($)
  await w.clock.settle()
  const s = statsOf(w)
  expect(s?.counts).toEqual({ 'handoff.present.fail': 1, held: 1, 'distill.ok': 1 })
  expect(s?.failures.map(f => f.what)).toEqual(['handoff.present.fail'])
})

test('\u7d71\u8a08：\u96e2\u5e2d\u4ea4\u63a5\u904e\u6642\u522a\u6389、\u9078 continue、\u9078 resume \u5404\u8a18\u4e00\u6b21', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, { 'away:S1': { handoff: 'H' } })
  await endTurn($)
  w.put('away:S1', { handoff: 'H', held: '\u6211\u56de\u4f86\u4e86' })
  await cmd($, 'continue')
  w.put('away:S1', { handoff: 'H' })
  await resume($)
  await w.clock.advance(0)
  expect(statsOf(w)?.counts).toEqual({ 'away.stale': 1, 'away.continue': 1, 'away.resume': 1 })
})

test('\u7d71\u8a08：\u6574\u7406\u6210\u529f\u8207\u5931\u6557\u5206\u958b\u8a18，\u5931\u6557\u7559\u539f\u56e0', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  // ，
  ctl.completeAborts = true
  await distillNow($)
  ctl.completeAborts = false
  await distillNow($)
  const s = statsOf(w)
  expect(s?.counts['distill.ok']).toBe(1)
  expect(s?.counts['distill.fail']).toBe(1)
  expect(s?.failures[0]?.detail).toContain('timeout')
})

test('\u7d71\u8a08：\u5b88\u9580\u547d\u4e2d\u7559\u4e0b\u6307\u4ee4\u7247\u6bb5\u7d66\u8a55\u4f30\u5224\u65b7\u64cb\u5f97\u5c0d\u4e0d\u5c0d；\u7591\u4f3c\u91d1\u9470\u4e0d\u8a18\u5167\u5bb9', async ($, on) => {
  const w = world(on, 1000, 1_000_000, { 'guards:C--proj': [pushGuard('on')] })
  await $.tool.call({ tool: 'Bash', command: 'git push origin main' })
  await $.tool.call({ tool: 'Bash', command: 'GH=ghp_abc git push' })
  const s = statsOf(w)
  expect(s?.counts['guard.hit.1']).toBe(2)
  expect(s?.hits.map(h => h.detail)).toEqual(['#1 Bash: git push origin main', '\u7591\u4f3c\u91d1\u9470'])
})
