// ：、、
import { expect, test } from 'claude-code/testing'
import { cmd, ctl, endTurn, NOTES_PATH, pushGuard, BAND_MOUNT, openPanel, PANEL_NOTES, world } from './test-world'

test('\u9762\u677f\u8207\u6307\u4ee4\u5171\u7528\u672c\u5c0d\u8a71\u96e2\u5e2d\u63a7\u5236，\u5217\u51fa\u5de5\u4f5c\u5340\u8207\u80cc\u666f\u7528\u91cf\u672a\u77e5\u72c0\u614b', async ($, on) => {
  const w = world(on, 100_000)
  await endTurn($)
  const ui = await openPanel($)
  expect(await ui.find({ type: 'Text', text: /\u672c\u5c0d\u8a71\u80cc\u666f\u7528\u91cf\u5c1a\u672a\u6536\u96c6/ })).toBeDefined()
  await ui.press({ key: 'away-toggle' })
  expect((await cmd($, '')).text).toContain('\u96e2\u5e2d\u5de5\u4f5c\u5df2\u66ab\u505c')
  await w.clock.advance(55 * 60_000)
  expect(w.forks).toEqual([])
  await cmd($, 'away resume')
  expect(await ui.find({ type: 'Button', text: '\u66ab\u505c\u672c\u5c0d\u8a71\u96e2\u5e2d\u5de5\u4f5c' })).toBeDefined()
  await w.clock.advance(55 * 60_000)
  expect(w.forks).toEqual(['\u53ea\u56de\u8986 OK'])
  await ui.unmount()
})

// ----------  ----------

test('\u9762\u677f：/handoff panel \u5728\u8f38\u5165\u6846\u4e0a\u65b9\u958b\u95dc；\u554f\u5377\u4f54\u8457\u6642\u8b93\u51fa；\u6309\u95dc\u9589\u4e5f\u6703\u6536\u8d77', async ($, on) => {
  const w = world(on, 1000)
  w.files.set(NOTES_PATH, PANEL_NOTES)
  // （ plugin）
  on('ui.render', () => h('Text', null, '\u4e0b\u5c64\u7684\u5167\u5bb9') as never)
  const closed = await $.ui.mount(BAND_MOUNT)
  expect(await closed.find({ type: 'Text', text: '\u4e0b\u5c64\u7684\u5167\u5bb9' })).toBeDefined()
  expect(await closed.find({ type: 'Text', text: /\u5b88\u9580/ })).toBeUndefined()
  await closed.unmount()
  const r = await cmd($, 'panel')
  expect(r.text).toContain('\u9762\u677f\u5df2\u958b\u5728\u8f38\u5165\u6846\u4e0a\u65b9')
  const ui = await $.ui.mount(BAND_MOUNT)
  expect(await ui.find({ type: 'Text', text: 'ctx-handoff' })).toBeDefined()
  await ui.unmount()
  const survey = await $.ui.mount({ ...BAND_MOUNT, props: { ...BAND_MOUNT.props, hasSurvey: true } })
  expect(await survey.find({ type: 'Text', text: 'ctx-handoff' })).toBeUndefined()
  await survey.unmount()
  const again = await $.ui.mount(BAND_MOUNT)
  await again.press({ key: 'close' })
  expect(await again.find({ type: 'Text', text: 'ctx-handoff' })).toBeUndefined()
  await again.unmount()
  //  ctx-handoff:， [ctx-handoff] （2026-10-07 ）
  const opened = (await cmd($, 'panel')).text
  expect(opened).toContain('\u9762\u677f\u5df2\u958b')
  expect(opened).not.toContain('[ctx-handoff]')
  expect((await cmd($, 'panel')).text).toContain('\u9762\u677f\u5df2\u95dc\u9589')
})

test('\u9762\u677f：\u5217\u51fa\u5b88\u9580\u8207\u8a18\u61b6，\u6309\u6838\u51c6\u5f8c\u5b88\u9580\u751f\u6548；\u522a\u9664\u5b88\u9580\u8981\u6309\u5169\u6b21\u78ba\u8a8d', async ($, on) => {
  const w = world(on, 1000, 1_000_000, { 'guards:C--proj': [{ ...pushGuard('proposed'), replay: { hits: 1, calls: 4 } }] })
  w.files.set(NOTES_PATH, PANEL_NOTES)
  const ui = await openPanel($)
  expect(await ui.find({ type: 'Text', text: /\u8349\u7a3f.*#1・\u64cb\u4e0b.*\u63a8\u9001\u524d\u5148\u8dd1 preflight/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /4 \u6b21\u5de5\u5177\u547c\u53eb\u4e2d\u547d\u4e2d 1 \u6b21/ })).toBeDefined()
  await ui.press({ key: 'on1' })
  await w.clock.advance(0)
  expect((w.get('guards:C--proj') as { state: string }[])[0]?.state).toBe('on')
  expect(await ui.find({ type: 'Text', text: /\u5b88\u9580 #1 \u5df2\u6838\u51c6/ })).toBeDefined()
  const blocked = await $.tool.call({ tool: 'Bash', command: 'git push' })
  expect(blocked.deny).toContain('\u5b88\u9580 #1')
  await ui.press({ key: 'ask:g:1' })
  await w.clock.advance(0)
  expect((w.get('guards:C--proj') as unknown[]).length).toBe(1)
  await ui.press({ key: 'no:g:1' })
  await w.clock.advance(0)
  expect((w.get('guards:C--proj') as unknown[]).length).toBe(1)
  await ui.press({ key: 'ask:g:1' })
  await w.clock.advance(0)
  await ui.press({ key: 'drop1' })
  await w.clock.advance(0)
  expect(w.get('guards:C--proj')).toEqual([])
  await ui.press({ key: 'tab:memory' })
  expect(await ui.find({ type: 'Text', text: /\u4f7f\u7528\u8005\u8981\u6c42\u6bcf\u6b21\u90fd\u5148\u8dd1\u6e2c\u8a66/ })).toBeDefined()
})

test('\u9762\u677f：\u522a\u9664\u8a18\u61b6\u8981\u6309\u5169\u6b21，\u5beb\u6a94\u524d\u5099\u4efd\u539f\u6a94', async ($, on) => {
  const w = world(on, 1000)
  w.files.set(NOTES_PATH, PANEL_NOTES)
  const ui = await openPanel($, 'memory')
  const key = 'm:[feedback] \u4f7f\u7528\u8005\u8981\u6c42\u6bcf\u6b21\u90fd\u5148\u8dd1\u6e2c\u8a66'
  await ui.press({ key: `del:${key}` })
  await w.clock.advance(0)
  // ，
  expect(w.files.get(NOTES_PATH)).toBe(PANEL_NOTES)
  await ui.press({ key: `yes:${key}` })
  await w.clock.advance(0)
  const after = w.files.get(NOTES_PATH) ?? ''
  expect(after).not.toContain('\u4f7f\u7528\u8005\u8981\u6c42\u6bcf\u6b21\u90fd\u5148\u8dd1\u6e2c\u8a66')
  expect(after).toContain('\u820a\u7684\u8a18\u61b6')
  expect(after).toContain('### \u63a8\u9001\u524d\u5148\u8dd1 preflight（3 \u6b21）')
  const backup = [...w.files.keys()].find(p => p.includes('/memory/.ctx-handoff-backup/'))
  expect(backup && w.files.get(backup)).toBe(PANEL_NOTES)
  expect(await ui.find({ type: 'Text', text: /\u5df2\u522a\u9664\u8a18\u61b6/ })).toBeDefined()
})

test('\u9762\u677f：\u9577\u8a18\u61b6\u4f9d\u5bec\u5ea6\u622a\u6210\u4e00\u884c，\u6309\u5c55\u958b\u624d\u986f\u793a\u5168\u6587', async ($, on) => {
  const w = world(on, 1000)
  const long = `- [reference] ${'\u5f88\u9577\u7684\u8a18\u61b6\u5167\u5bb9'.repeat(40)}\u7d50\u5c3e`
  w.files.set(NOTES_PATH, ['# ctx-handoff \u5c08\u6848\u7d93\u9a57', '', '## \u8a18\u61b6', long, '', '## \u898f\u5247'].join('\n'))
  const ui = await openPanel($, 'memory')
  const row = await ui.find({ type: 'Text', text: /\u5f88\u9577\u7684\u8a18\u61b6\u5167\u5bb9/ })
  expect(row?.text).toContain('…')
  expect(row?.text).not.toContain('\u7d50\u5c3e')
  // ；120  60 。
  expect([...(row?.text ?? '')].length).toBeLessThanOrEqual(61)
  await ui.press({ key: `t:m:${long.slice(2)}` })
  expect(await ui.find({ type: 'Text', text: /\u7d50\u5c3e$/ })).toBeDefined()
  await ui.press({ key: `t:m:${long.slice(2)}` })
  expect(await ui.find({ type: 'Text', text: /\u7d50\u5c3e$/ })).toBeUndefined()
})

// （2026-10-06）： store，
test('\u9762\u677f：\u5207\u5206\u9801\u8207\u91cd\u756b\u4e0d\u91cd\u8b80\u7d93\u9a57\u6a94；\u6307\u4ee4\u6539\u4e86\u5b88\u9580，\u9762\u677f\u8ddf\u8457\u66f4\u65b0', async ($, on) => {
  const w = world(on, 1000, 1_000_000, { 'guards:C--proj': [pushGuard('proposed')] })
  w.files.set(NOTES_PATH, PANEL_NOTES)
  const ui = await openPanel($)
  w.reads.length = 0
  for (const tab of ['memory', 'rules', 'distill', 'guard']) await ui.press({ key: `tab:${tab}` })
  await ui.press({ key: 'tab:memory' })
  expect(await ui.find({ type: 'Text', text: /\u4f7f\u7528\u8005\u8981\u6c42\u6bcf\u6b21\u90fd\u5148\u8dd1\u6e2c\u8a66/ })).toBeDefined()
  await ui.unmount()
  const again = await $.ui.mount(BAND_MOUNT)
  expect(await again.find({ type: 'Text', text: /\u4f7f\u7528\u8005\u8981\u6c42\u6bcf\u6b21\u90fd\u5148\u8dd1\u6e2c\u8a66/ })).toBeDefined()
  expect(w.reads).toEqual([])
  await again.press({ key: 'tab:guard' })
  await cmd($, 'guard on 1')
  expect(await again.find({ type: 'Text', text: /\u555f\u7528.*#1/ })).toBeDefined()
})

// ---------- ： /config  ----------

test('\u9762\u677f\u8a2d\u5b9a：\u6578\u5b57\u6309＋\u52a0\u4e00\u683c、\u958b\u95dc\u6309\u5207\u63db，\u5b58\u9032 store \u7684 settings \u4e26\u99ac\u4e0a\u751f\u6548；\u9084\u539f\u56de\u5230 settings.json', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  ctl.pluginOptions = { threshold: 200_000 }
  w.files.set(NOTES_PATH, PANEL_NOTES)
  const ui = await openPanel($)
  await ui.press({ key: 'tab:settings' })
  expect(await ui.find({ type: 'Text', text: /\u4ea4\u63a5\u9580\u6abb 200k settings\.json/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /\u56de\u8986\u8a9e\u8a00\u63d0\u9192 auto → zh-TW \u9810\u8a2d/ })).toBeDefined()
  await ui.press({ key: 'inc:threshold' })
  await w.clock.advance(0)
  expect(w.get('settings')).toEqual({ threshold: 250_000 })
  expect((await cmd($, '')).text).toContain('\u9580\u6abb 250000')
  expect(await ui.find({ type: 'Text', text: /\u4ea4\u63a5\u9580\u6abb 250k \u9762\u677f/ })).toBeDefined()
  await ui.press({ key: 'set:retry_nudge' })
  await w.clock.advance(0)
  expect(w.get('settings')).toEqual({ threshold: 250_000, retry_nudge: false })
  expect((await cmd($, '')).text).toContain('\u91cd\u8907\u5931\u6557 off')
  await ui.press({ key: 'reset:threshold' })
  await w.clock.advance(0)
  expect(w.get('settings')).toEqual({ retry_nudge: false })
  expect((await cmd($, '')).text).toContain('\u9580\u6abb 200000')
})

test('\u9762\u677f\u8a2d\u5b9a：\u6578\u5b57\u4e0d\u8d85\u51fa\u7bc4\u570d，\u9078\u9805\u4f9d\u5e8f\u8f2a；\u4fdd\u6301\u5feb\u53d6\u8207\u5c08\u6848\u7b46\u8a18\u7684\u958b\u95dc\u548c\u6307\u4ee4\u5171\u7528', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  ctl.panelSettings = { idle_minutes: 55, reply_language: 'ja' }
  w.files.set(NOTES_PATH, PANEL_NOTES)
  const ui = await openPanel($)
  await ui.press({ key: 'tab:settings' })
  await ui.press({ key: 'inc:idle_minutes' })
  await w.clock.advance(0)
  expect((w.get('settings') as Record<string, unknown>).idle_minutes).toBe(59)
  await ui.press({ key: 'set:reply_language' })
  await w.clock.advance(0)
  expect((w.get('settings') as Record<string, unknown>).reply_language).toBe('auto')
  await ui.press({ key: 'set:refresh' })
  await w.clock.advance(0)
  expect(w.get('refresh')).toBe(false)
  expect((await cmd($, 'refresh')).text).toContain('off')
})
