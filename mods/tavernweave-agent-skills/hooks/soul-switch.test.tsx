import { expect, test } from 'claude-code/testing'

// Run with: claude plugin test .
const BAND = {
  plugin: 'tavernweave-agent-skills',
  component: 'AbovePrompt',
  props: { hasSurvey: false, isWorking: false, maxRows: 4 } as never,
} as const

test('the switch expands to the modes and folds again', async $ => {
  for (const surface of ['terminal', 'desktop'] as const) {
    const band = await $.ui.mount({ ...BAND, surface })
    expect(await band.find({ type: 'Text', text: /^off$/ })).toBeDefined()
    await band.press({ key: 'soul-toggle' })
    expect(await band.find({ key: 'soul-atong' })).toBeDefined()
    await band.press({ key: 'soul-toggle' })
    expect(await band.find({ key: 'soul-atong' })).toBeUndefined()
    await band.unmount()
  }
})

test('a sent Soul phrase moves the switch, other prompts do not', async ($, on) => {
  on('prompt.submit', ($, e) => ({ text: e.text }) as never)
  const band = await $.ui.mount({ ...BAND, surface: 'desktop' })
  await $.prompt.submit({ text: '\u5e2e\u6211\u770b\u770b\u8fd9\u5f20\u5361' } as never)
  expect(await band.find({ type: 'Text', text: /^off$/ })).toBeDefined()
  await $.prompt.submit({ text: 'MTTT.sir，\u62f7\u6253\u6211！' } as never)
  expect(await band.find({ type: 'Text', text: /^MTTT\.sir$/ })).toBeDefined()
  await $.prompt.submit({ text: 'Soul \u5f52\u4f4d' } as never)
  expect(await band.find({ type: 'Text', text: /^off$/ })).toBeDefined()
  await band.unmount()
})

test('a collapsed band stays one row when the prompt area is short', async $ => {
  const band = await $.ui.mount({ ...BAND, surface: 'terminal', props: { hasSurvey: false, isWorking: false, maxRows: 1 } as never })
  await band.press({ key: 'soul-toggle' })
  expect(await band.find({ key: 'soul-atong' })).toBeUndefined()
  await band.unmount()
})
