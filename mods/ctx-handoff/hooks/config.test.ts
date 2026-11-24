// （）（/config、pluginConfigs）
import { expect, test } from 'claude-code/testing'
import { pickLang } from './i18n'
import { cmd, resume, say, startSession, endTurn, stop, NOTES, distillNow, pushGuard, openPanel, PANEL_NOTES, ctl, world } from './test-world'

// ---------- ： ----------
const EN = 'English'
const HAS_CJK = /[\u3400-\u9fff\uff00-\uffef]/

test('\u82f1\u6587：\u72c0\u614b\u5217、\u7d00\u9304\u8207 toast \u6c92\u6709 [ctx-handoff] \u524d\u7db4', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5, EN)
  await endTurn($)
  expect(w.statuses.at(-1)).toBe('25 more messages until notes update')
  await distillNow($)
  expect(w.statuses).toContain('Updating notes…')
  expect(w.statuses.at(-1)).toBe('30 more messages until notes update')
  const toast = w.toasts.find(t => t.includes('Notes updated'))
  expect(toast).toContain('Notes updated: 2 changes, sent along with your next message')
  expect(toast).toContain(NOTES)
  await cmd($, 'distill off')
  expect(w.statuses.at(-1)).toBeUndefined()
  expect([...w.statuses, ...w.toasts, ...w.logs].filter(x => x?.includes('[ctx-handoff]'))).toEqual([])
})

test('\u82f1\u6587：\u5c0d\u8a71\u9084\u77ed\u6642\u7684\u72c0\u614b\u5217', async ($, on) => {
  const w = world(on, 10_000, 1_000_000, {}, [], 30, EN)
  await endTurn($)
  expect(w.statuses.at(-1)).toBe('Conversation is short, notes not updated yet')
})

test('\u82f1\u6587：/handoff \u72c0\u614b\u8207\u7528\u6cd5\u56de\u8986\u4e0d\u52a0 [ctx-handoff]（\u5f15\u64ce\u6703\u52a0 ctx-handoff:），\u5167\u6587\u6c92\u6709\u4e2d\u6587', async ($, on) => {
  const w = world(on, 650_000, 1_000_000, {}, [], 5, EN)
  const s = await cmd($, '')
  expect(s.text).toStartWith('context 650000 / threshold 600000 (window 1000000)')
  expect(s.text).toContain('Cache refresh on')
  expect(s.text).toContain('/handoff now')
  expect(s.text).toContain('Guards: 0 on, 0 draft, 0 off')
  expect(s.text).not.toMatch(HAS_CJK)
  const u = await cmd($, 'nwo')
  expect(u.text).toContain('Unknown subcommand "nwo"')
  expect(w.forks.length).toBe(0)
})

test('\u82f1\u6587：\u96e2\u5e2d\u8207\u4ea4\u63a5\u7684\u63d0\u793a', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, { 'away:S1': { handoff: 'HANDOFF: test' } }, [], 0, EN)
  const r = await say($, 'hello')
  expect(r.drop).toContain('There is an away handoff')
  expect(r.drop).not.toMatch(HAS_CJK)
  await resume($)
  await w.clock.advance(0)
  expect(w.submits[0]).toContain('The previous conversation went idle')
  expect(w.submits[0]).toContain('HANDOFF: test')
})

test('\u82f1\u6587：\u4ea4\u63a5\u51fa\u932f\u6642\u7684 toast \u8207\u7d00\u9304', async ($, on) => {
  const w = world(on, 650_000, 1_000_000, {}, [], 0, EN)
  ctl.failHandoff = true
  await stop($)
  await w.clock.advance(0)
  expect(w.toasts.some(t => t.includes('Handoff failed'))).toBe(true)
  expect(w.logs.some(l => l.includes('handoff failed: nothing-to-fork: '))).toBe(true)
})

test('\u82f1\u6587：\u9762\u677f\u8207\u5b88\u9580\u6e05\u55ae', async ($, on) => {
  const w = world(on, 1000, 1_000_000, { 'guards:C--proj': [pushGuard('proposed')] }, [], 0, EN)
  w.files.set(NOTES, PANEL_NOTES)
  const ui = await openPanel($)
  expect(await ui.find({ type: 'Text', text: /draft/ })).toBeDefined()
  expect(await ui.find({ type: 'Button', text: /Approve/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /Project notes and guards/ })).toBeDefined()
  expect((await cmd($, 'guard')).text).toContain('[draft · block]')
})

// ：language （），；， pickLang
const PICK_CASES: { name: string; setting: unknown; locale: string | undefined; want: 'zh-TW' | 'en' | 'es' }[] = [
  { name: 'language 設定是 español', setting: 'español', locale: 'en-US', want: 'es' },
  { name: '\u7cfb\u7d71\u8a9e\u7cfb zh-TW', setting: undefined, locale: 'zh-TW', want: 'zh-TW' },
  { name: '\u7cfb\u7d71\u8a9e\u7cfb zh-Hant-TW', setting: undefined, locale: 'zh-Hant-TW', want: 'zh-TW' },
  { name: '\u7cfb\u7d71\u8a9e\u7cfb zh-CN', setting: undefined, locale: 'zh-CN', want: 'zh-TW' },
  { name: '\u7cfb\u7d71\u8a9e\u7cfb en-US', setting: undefined, locale: 'en-US', want: 'en' },
  { name: '\u7cfb\u7d71\u8a9e\u7cfb ja-JP', setting: undefined, locale: 'ja-JP', want: 'en' },
  { name: '\u8b80\u4e0d\u5230\u7cfb\u7d71\u8a9e\u7cfb', setting: undefined, locale: undefined, want: 'en' },
  { name: 'language \u8a2d\u5b9a\u662f\u4e2d\u6587、\u7cfb\u7d71\u82f1\u6587', setting: 'Traditional Chinese', locale: 'en-US', want: 'zh-TW' },
  { name: 'language \u8a2d\u5b9a\u662f\u7e41\u9ad4\u4e2d\u6587', setting: '\u7e41\u9ad4\u4e2d\u6587', locale: 'en-US', want: 'zh-TW' },
  { name: 'language \u8a2d\u5b9a\u662f\u65e5\u6587、\u7cfb\u7d71\u4e2d\u6587', setting: 'japanese', locale: 'zh-TW', want: 'en' },
  { name: 'language \u8a2d\u5b9a\u7a7a\u767d：\u770b\u7cfb\u7d71\u8a9e\u7cfb', setting: '  ', locale: 'zh-TW', want: 'zh-TW' },
]
for (const c of PICK_CASES) {
  test(`\u8a9e\u8a00\u5224\u65b7：${c.name} → ${c.want}`, async () => {
    expect(pickLang(c.setting, c.locale)).toBe(c.want)
  })
}

//  plugin：language 
for (const [language, want] of [['\u7e41\u9ad4\u4e2d\u6587', '\u518d 25 \u5247\u6574\u7406\u7b46\u8a18'], ['English', '25 more messages until notes update']] as const) {
  test(`\u8a9e\u8a00\u5224\u65b7\u7d93\u7531 plugin：language=${language}`, async ($, on) => {
    const w = world(on, 100_000, 1_000_000, {}, [], 5, language)
    await endTurn($)
    expect(w.statuses.at(-1)).toBe(want)
  })
}

// ---------- ：（store  settings）， settings.json  pluginConfigs ----------
test('\u8a2d\u5b9a：\u9762\u677f\u5b58\u7684\u9580\u6abb\u6703\u751f\u6548', async ($, on) => {
  world(on, 100_000, 1_000_000, {}, [], 5)
  ctl.panelSettings = { threshold: 200_000 }
  expect((await cmd($, '')).text).toContain('context 100000 / \u9580\u6abb 200000')
})

test('\u8a2d\u5b9a：\u8d85\u51fa\u7bc4\u570d\u7684\u503c\u62c9\u56de\u7bc4\u570d\u5167（\u9580\u6abb\u6700\u4f4e 50000）', async ($, on) => {
  world(on, 100_000, 1_000_000, {}, [], 5)
  ctl.panelSettings = { threshold: 10 }
  expect((await cmd($, '')).text).toContain('context 100000 / \u9580\u6abb 50000')
})

test('\u8a2d\u5b9a：\u9762\u677f\u6c92\u8a2d\u7684\u503c\u8b80 settings.json \u7684 pluginConfigs', async ($, on) => {
  world(on, 100_000, 1_000_000, {}, [], 5)
  ctl.pluginOptions = { threshold: 200_000, idle_minutes: 30 }
  const text = (await cmd($, '')).text
  expect(text).toContain('context 100000 / \u9580\u6abb 200000')
  expect(text).toContain('\u9592\u7f6e 30 \u5206')
})

test('\u8a2d\u5b9a：\u95dc\u9589\u4fdd\u6301\u5feb\u53d6\u7684\u8a0a\u606f\u7167\u8a2d\u5b9a\u7684\u9592\u7f6e\u5206\u9418\u6578', async ($, on) => {
  world(on, 100_000, 1_000_000, {}, [], 5)
  ctl.pluginOptions = { idle_minutes: 20 }
  expect((await cmd($, 'refresh off')).text).toContain('\u5feb\u53d6\u5237\u65b0\u5df2\u8a2d\u70ba off（\u9592\u7f6e 20 \u5206\u9418')
})

test('\u8a2d\u5b9a：\u5225\u8655\u6539\u4e86\u4ecb\u9762\u8a9e\u8a00，\u4e0b\u4e00\u5247\u8a0a\u606f\u8d77\u4ecb\u9762\u6587\u5b57\u8ddf\u8457\u63db', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  await startSession($)
  ctl.panelSettings = { language: 'en' }
  await say($, 'hi')
  await endTurn($)
  expect(w.statuses.at(-1)).toBe('25 more messages until notes update')
})

test('\u8a2d\u5b9a：\u9762\u677f\u7684\u9592\u7f6e\u5206\u9418\u6578\u6c7a\u5b9a\u591a\u4e45\u5f8c\u4fdd\u6301\u5feb\u53d6', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  ctl.panelSettings = { idle_minutes: 10 }
  await startSession($)
  await endTurn($)
  await w.clock.advance(10 * 60_000)
  expect(w.logs.some(l => l.includes('\u5feb\u53d6\u5237\u65b0 1/3'))).toBe(true)
})
