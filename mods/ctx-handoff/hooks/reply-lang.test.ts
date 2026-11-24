// （ turn.step、tool.call、prompt.submit、/handoff ）
import { expect, test } from 'claude-code/testing'
import { NOTE_TAG, cmd, ctl, distillNow, say, step, stop, world } from './test-world'

const TW = '\u6211\u628a\u9019\u500b hook \u6539\u6210\u5728\u6bcf\u4e00\u6b65\u4e4b\u5f8c\u6aa2\u67e5\u8aaa\u660e\u7684\u8a9e\u8a00，\u5982\u679c\u4e0d\u662f\u7e41\u9ad4\u4e2d\u6587，\u5c31\u5728\u4e0b\u4e00\u500b\u5de5\u5177\u7d50\u679c\u5f8c\u9762\u9644\u4e00\u6bb5\u63d0\u9192。\u9019\u6a23\u4e3b\u5c0d\u8a71\u53ef\u4ee5\u53ca\u65e9\u6536\u5230\u901a\u77e5，\u800c\u4e14\u6bcf\u4e00\u6bb5\u53ea\u6703\u63d0\u9192\u4e00\u6b21，\u6e2c\u8a66\u4e5f\u90fd\u88dc\u597d\u4e86。'
const EN = 'I changed the hook so that it checks the language of the explanation after every step. If it is not the configured language, a reminder is attached to the next tool result, once per streak, and tests are added. The new tests cover the mid-turn reminder, the final answer case, and the subagent case as well.'
const CN = '\u6211\u628a\u8fd9\u4e2a hook \u6539\u6210\u5728\u6bcf\u4e00\u6b65\u4e4b\u540e\u68c0\u67e5\u8bf4\u660e\u7684\u8bed\u8a00，\u5982\u679c\u4e0d\u662f\u7b80\u4f53\u4e2d\u6587，\u5c31\u5728\u4e0b\u4e00\u4e2a\u5de5\u5177\u7ed3\u679c\u540e\u9762\u9644\u4e00\u6bb5\u63d0\u9192。\u8fd9\u6837\u4e3b\u5bf9\u8bdd\u53ef\u4ee5\u53ca\u65e9\u6536\u5230\u901a\u77e5，\u800c\u4e14\u6bcf\u4e00\u6bb5\u53ea\u4f1a\u63d0\u9192\u4e00\u6b21，\u6d4b\u8bd5\u4e5f\u90fd\u8865\u597d\u4e86。'
const REMIND_TW = '\u7e41\u9ad4\u4e2d\u6587'
const toolCall = ($: Parameters<typeof step>[0], agentId?: string) =>
  $.tool.call({ tool: 'Bash', command: 'ls', ...(agentId ? { agentId } : {}) } as never)

test('\u56de\u8986\u8a9e\u8a00：\u6b65\u9a5f\u7684\u56de\u61c9\u539f\u5c01\u4e0d\u52d5\u5f80\u4e0b\u50b3（\u4e0d\u6539 model、effort、\u7b54\u6848\u8207\u5de5\u5177）', async ($, on) => {
  world(on, 1000)
  const r = await step($, EN, { tools: 2 })
  expect(r.answer).toBe(EN)
  expect(r.toolUses.length).toBe(2)
  expect(r.stopReason).toBe('tool_use')
  expect(ctl.stepSeen?.model).toBe('m')
  expect(ctl.stepSeen?.effort).toBeUndefined()
})

test('\u56de\u8986\u8a9e\u8a00：\u9019\u6b65\u4e0d\u662f\u7e41\u9ad4\u4e2d\u6587\u53c8\u8981\u547c\u53eb\u5de5\u5177，\u4e0b\u4e00\u500b\u5de5\u5177\u7d50\u679c\u9644\u4e00\u6b21\u63d0\u9192', async ($, on) => {
  world(on, 1000)
  await step($, EN, { tools: 1 })
  const r1 = await toolCall($)
  expect(r1.context?.[0]).toStartWith('[ctx-handoff] ')
  expect(r1.context?.[0]).toContain(REMIND_TW)
  expect(r1.context?.[0]).toContain('\u7a0b\u5f0f\u78bc\u8207\u5c08\u6709\u540d\u8a5e\u7167\u539f\u6587')
  // 
  expect((await toolCall($)).context).toBeUndefined()
  // ：
  await step($, EN, { tools: 1 })
  expect((await toolCall($)).context).toBeUndefined()
})

test('\u56de\u8986\u8a9e\u8a00：\u7b26\u5408\u76ee\u6a19\u8a9e\u8a00\u7684\u6b65\u9a5f\u4e0d\u63d0\u9192；\u4e00\u6b65\u7b26\u5408\u5f8c，\u4e0b\u4e00\u6bb5\u4e0d\u7b26\u5408\u518d\u63d0\u9192', async ($, on) => {
  world(on, 1000)
  await step($, TW, { tools: 1 })
  expect((await toolCall($)).context).toBeUndefined()
  await step($, EN, { tools: 1 })
  expect((await toolCall($)).context?.[0]).toContain(REMIND_TW)
  await step($, EN, { tools: 1 })
  expect((await toolCall($)).context).toBeUndefined()
  await step($, TW, { tools: 1 })
  await step($, EN, { tools: 1 })
  expect((await toolCall($)).context?.[0]).toContain(REMIND_TW)
})

test('\u56de\u8986\u8a9e\u8a00：\u4e00\u53e5\u82f1\u6587\u65c1\u767d\u5c31\u63d0\u9192；\u593e\u82f1\u6587\u8853\u8a9e\u7684\u7e41\u9ad4\u4e2d\u6587\u4e0d\u63d0\u9192', async ($, on) => {
  world(on, 1000)
  await step($, 'Let me read the file first.', { tools: 1 })
  expect((await toolCall($)).context?.[0]).toContain(REMIND_TW)
  await step($, '\u6211\u5148\u628a `watchCall` \u7684 context \u62c6\u958b，\u518d\u770b turn.step \u7684 result \u600e\u9ebc\u63a5 tool result，\u78ba\u8a8d prompt cache \u4e0d\u6703\u56e0\u70ba\u591a\u4e00\u6bb5 hint \u800c\u5931\u6548，\u7136\u5f8c\u88dc\u4e0a\u5c0d\u61c9\u7684 fixed test。', { tools: 1 })
  expect((await toolCall($)).context).toBeUndefined()
})

test('\u56de\u8986\u8a9e\u8a00：\u6700\u7d42\u56de\u7b54\u4e0d\u662f\u76ee\u6a19\u8a9e\u8a00（\u6c92\u6709\u5de5\u5177），\u63d0\u9192\u8ddf\u8457\u4f7f\u7528\u8005\u7684\u4e0b\u4e00\u5247\u8a0a\u606f，\u53ea\u4e00\u6b21', async ($, on) => {
  const w = world(on, 1000)
  await step($, EN)
  // ，
  expect((await toolCall($)).context).toBeUndefined()
  expect(w.submits.length).toBe(0)
  await say($, '\u597d，\u7e7c\u7e8c')
  expect(w.contexts[0]?.[0]).toContain(REMIND_TW)
  await say($, '\u518d\u4e00\u500b\u554f\u984c')
  expect(w.contexts[1]).toBeUndefined()
})

test('\u56de\u8986\u8a9e\u8a00：\u9644\u5728\u8a0a\u606f\u4e0a\u7684\u63d0\u9192\u548c\u80cc\u666f\u6574\u7406\u7684\u5dee\u7570\u4e26\u5b58，\u5404\u662f\u4e00\u6bb5', async ($, on) => {
  const w = world(on, 100_000, 1_000_000, {}, [], 5)
  await say($, '\u8acb\u5e6b\u6211\u6574\u7406\u9019\u6bb5\u5c0d\u8a71')
  await distillNow($)
  await step($, EN)
  await say($, '\u4e0b\u4e00\u5247')
  expect(w.contexts[1]?.length).toBe(2)
  expect(w.contexts[1]?.[0]).toContain(NOTE_TAG)
  expect(w.contexts[1]?.[1]).toContain(REMIND_TW)
})

test('\u56de\u8986\u8a9e\u8a00：\u8a0a\u606f\u88ab\u4e1f\u68c4\u6642\u63d0\u9192\u4fdd\u7559\u5230\u771f\u7684\u9001\u9032\u5c0d\u8a71', async ($, on) => {
  const w = world(on, 1000)
  await step($, EN)
  ctl.failSubmits = 1
  await say($, '\u7b2c\u4e00\u5247')
  expect(w.contexts.length).toBe(0)
  await say($, '\u7b2c\u4e8c\u5247')
  expect(w.contexts[0]?.[0]).toContain(REMIND_TW)
})

test('\u56de\u8986\u8a9e\u8a00：\u9019\u8f2a\u88ab\u4e2d\u65b7、\u63d0\u9192\u6c92\u9644\u51fa\u53bb，\u6539\u8ddf\u8457\u4f7f\u7528\u8005\u7684\u4e0b\u4e00\u5247\u8a0a\u606f', async ($, on) => {
  const w = world(on, 1000)
  await step($, EN, { tools: 1 })
  await say($, '\u7b97\u4e86，\u63db\u500b\u554f\u984c')
  expect(w.contexts[0]?.[0]).toContain(REMIND_TW)
  expect((await toolCall($)).context).toBeUndefined()
})

test('\u56de\u8986\u8a9e\u8a00：\u5b50\u4ee3\u7406\u7684\u6b65\u9a5f\u4e0d\u770b，\u5b50\u4ee3\u7406\u7684\u5de5\u5177\u7d50\u679c\u4e5f\u4e0d\u5e36\u8d70\u4e3b\u5c0d\u8a71\u7684\u63d0\u9192', async ($, on) => {
  const w = world(on, 1000)
  await step($, EN, { tools: 1, agentId: 'sub1' })
  expect((await toolCall($)).context).toBeUndefined()
  await step($, EN, { agentId: 'sub1' })
  await say($, '\u55e8')
  expect(w.contexts[0]).toBeUndefined()
  // 
  await step($, EN, { tools: 1 })
  expect((await toolCall($, 'sub1')).context).toBeUndefined()
  expect((await toolCall($)).context?.[0]).toContain(REMIND_TW)
})

test('\u56de\u8986\u8a9e\u8a00：\u6c92\u6709\u8aaa\u660e\u6587\u5b57（\u53ea\u547c\u53eb\u5de5\u5177）\u4e0d\u5224\u65b7', async ($, on) => {
  world(on, 1000)
  await step($, '', { tools: 1 })
  expect((await toolCall($)).context).toBeUndefined()
})

test('\u56de\u8986\u8a9e\u8a00：reply_language \u8a2d off \u4e0d\u63d0\u9192', async ($, on) => {
  const w = world(on, 1000)
  ctl.panelSettings.reply_language = 'off'
  await step($, EN, { tools: 1 })
  expect((await toolCall($)).context).toBeUndefined()
  await step($, EN)
  await say($, '\u55e8')
  expect(w.contexts[0]).toBeUndefined()
})

test('\u56de\u8986\u8a9e\u8a00：\u8a2d\u5b9a\u8d70 pluginConfigs \u4e5f\u751f\u6548；\u6307\u5b9a\u8a9e\u8a00\u4e0d\u770b language \u8a2d\u5b9a，\u63d0\u9192\u7528\u8a72\u8a9e\u8a00\u5beb', async ($, on) => {
  world(on, 1000)
  ctl.pluginOptions = { reply_language: 'en' }
  //  en 
  await step($, TW, { tools: 1 })
  const r = await toolCall($)
  expect(r.context?.[0]).toContain('Please explain in English')
  await step($, EN, { tools: 1 })
  expect((await toolCall($)).context).toBeUndefined()
})

test('\u56de\u8986\u8a9e\u8a00：\u4e0d\u5408\u6cd5\u7684\u8a2d\u5b9a\u503c\u56de\u5230 auto', async ($, on) => {
  world(on, 1000)
  ctl.panelSettings.reply_language = 'klingon'
  await step($, EN, { tools: 1 })
  expect((await toolCall($)).context?.[0]).toContain(REMIND_TW)
})

test('\u56de\u8986\u8a9e\u8a00：auto \u8ddf\u8457 Claude Code \u7684 language \u8a2d\u5b9a', async ($, on) => {
  world(on, 1000, 1_000_000, {}, [], 0, 'English')
  await step($, TW, { tools: 1 })
  expect((await toolCall($)).context?.[0]).toContain('Please explain in English')
})

test('\u56de\u8986\u8a9e\u8a00：auto \u9047\u5230\u7c21\u9ad4\u4e2d\u6587\u8a2d\u5b9a，\u6293\u51fa\u7e41\u9ad4\u4e2d\u6587', async ($, on) => {
  world(on, 1000, 1_000_000, {}, [], 0, '\u7b80\u4f53\u4e2d\u6587')
  await step($, CN, { tools: 1 })
  expect((await toolCall($)).context).toBeUndefined()
  await step($, TW, { tools: 1 })
  expect((await toolCall($)).context?.[0]).toContain('\u8bf7\u7528\u7b80\u4f53\u4e2d\u6587\u8bf4\u660e')
})

//  hook ，
for (const language of [null, '\u4e2d\u6587', 'Chinese', 'Français']) {
  test(`\u56de\u8986\u8a9e\u8a00：auto \u9047\u5230 language \u662f ${JSON.stringify(language)}，\u4e0d\u63d0\u9192`, async ($, on) => {
    world(on, 1000, 1_000_000, {}, [], 0, language)
    await step($, EN, { tools: 1 })
    expect((await toolCall($)).context).toBeUndefined()
  })
}

test('\u56de\u8986\u8a9e\u8a00：\u8a2d\u5b9a\u6539\u4e86，\u4e0b\u4e00\u5247\u8a0a\u606f\u8d77\u76ee\u6a19\u8a9e\u8a00\u8ddf\u8457\u63db', async ($, on) => {
  world(on, 1000)
  await step($, TW, { tools: 1 })
  expect((await toolCall($)).context).toBeUndefined()
  ctl.panelSettings.reply_language = 'ja'
  await say($, '\u63db\u6210\u65e5\u6587')
  await step($, TW, { tools: 1 })
  expect((await toolCall($)).context?.[0]).toContain('\u65e5\u672c\u8a9e')
  ctl.panelSettings.reply_language = 'off'
  await say($, '\u95dc\u6389')
  await step($, EN, { tools: 1 })
  expect((await toolCall($)).context).toBeUndefined()
})

test('\u56de\u8986\u8a9e\u8a00：\u548c\u91cd\u8907\u5931\u6557\u63d0\u9192\u4e26\u5b58，\u5169\u6bb5\u90fd\u5e36\u4e0a', async ($, on) => {
  world(on, 1000)
  ctl.toolReply = () => ({ isError: true as const, result: 'same failure', text: 'same failure' })
  await toolCall($)
  await step($, EN, { tools: 1 })
  const r = await toolCall($)
  expect(r.context?.length).toBe(2)
  expect(r.context?.[0]).toContain('\u9023\u7e8c\u5169\u6b21\u56e0\u540c\u6a23\u539f\u56e0\u5931\u6557')
  expect(r.context?.[1]).toContain(REMIND_TW)
})

test('\u56de\u8986\u8a9e\u8a00：/handoff \u72c0\u614b\u5728\u9632\u5446\u63d0\u9192\u90a3\u884c\u986f\u793a\u8a2d\u5b9a\u8207\u89e3\u6790\u7d50\u679c', async ($, on) => {
  world(on, 1000)
  expect((await cmd($, '')).text).toContain('\u9632\u5446\u63d0\u9192：\u91cd\u8907\u5931\u6557 on，\u5b8c\u6210\u524d\u9a57\u8b49 on，\u56de\u8986\u8a9e\u8a00 auto → zh-TW')
  ctl.panelSettings.reply_language = 'ja'
  await say($, '\u63db\u6210\u65e5\u6587')
  expect((await cmd($, '')).text).toContain('\u56de\u8986\u8a9e\u8a00 ja')
  ctl.panelSettings.reply_language = 'off'
  await say($, '\u95dc\u6389')
  expect((await cmd($, '')).text).toContain('\u56de\u8986\u8a9e\u8a00 off')
})

test('\u56de\u8986\u8a9e\u8a00：/handoff \u72c0\u614b\u5728 language \u6c92\u8a2d\u6642\u986f\u793a auto → off', async ($, on) => {
  world(on, 1000, 1_000_000, {}, [], 0, null)
  // language ：，（2026-10-08 CI ）
  ctl.panelSettings = { language: 'zh-TW' }
  expect((await cmd($, '')).text).toContain('\u56de\u8986\u8a9e\u8a00 auto → off')
})

// ---------- ：， ----------

test('\u56de\u8986\u8a9e\u8a00：\u6700\u5f8c\u7684\u56de\u7b54\u662f\u82f1\u6587，\u64cb\u4e0b\u505c\u6b62\u8acb\u5b83\u7528\u7e41\u4e2d\u91cd\u5beb\u4e00\u6b21，\u4e0b\u4e00\u5247\u8a0a\u606f\u4e0d\u518d\u91cd\u8907\u63d0\u9192', async ($, on) => {
  const w = world(on, 1000)
  await step($, EN)
  const out = await stop($, { last_assistant_message: EN })
  expect(out.block).toStartWith('[ctx-handoff] ')
  expect(out.block).toContain('\u91cd\u5beb')
  expect(w.logs.some(l => l.includes('\u91cd\u5beb'))).toBe(true)
  // （stop_hook_active），
  expect((await stop($, { last_assistant_message: EN, stop_hook_active: true })).block).toBeUndefined()
  await say($, '\u597d，\u7e7c\u7e8c')
  expect(w.contexts[0]).toBeUndefined()
})

test('\u56de\u8986\u8a9e\u8a00：\u6700\u5f8c\u7684\u56de\u7b54\u662f\u7e41\u4e2d、\u593e\u82f1\u6587\u8853\u8a9e、\u5f88\u77ed，\u6216\u8a2d off，\u90fd\u4e0d\u64cb', async ($, on) => {
  world(on, 1000)
  expect((await stop($, { last_assistant_message: TW })).block).toBeUndefined()
  expect((await stop($, { last_assistant_message: '\u5148\u770b config \u518d\u8dd1 test。' })).block).toBeUndefined()
  expect((await stop($, { last_assistant_message: 'Done.' })).block).toBeUndefined()
  ctl.panelSettings.reply_language = 'off'
  await say($, '\u95dc\u6389')
  expect((await stop($, { last_assistant_message: EN })).block).toBeUndefined()
})
