// （）：，
import { expect, test } from 'claude-code/testing'
import { PAIRS, SIMPLIFIED_ONLY, TRADITIONAL_ONLY, clearNext, countOf, freshReply, isReplyLangSetting, judge, noteStep, peekNext, proseOf, replyLangOfSetting, reminderText, resolveReplyLang, takePending } from './lang'

// 、
const TW_MIXED = '\u6211\u628a `watchCall` \u6539\u6210\u5728 turn.step \u4e4b\u5f8c\u8a2d\u5b9a pending flag，\u4e0b\u4e00\u500b tool result \u6703\u5e36\u4e0a\u63d0\u9192。\u9019\u6a23\u4e3b\u5c0d\u8a71\u7684\u56de\u8986\u5982\u679c\u4e0d\u662f\u7e41\u9ad4\u4e2d\u6587，\u53ea\u6703\u63d0\u9192\u4e00\u6b21，\u4e4b\u5f8c\u6709\u4e00\u6b65\u7b26\u5408\u8a9e\u8a00\u624d\u6703\u91cd\u7b97。\u6e2c\u8a66\u4e5f\u88dc\u597d\u4e86：mid-turn、final answer、subagent \u4e09\u7a2e\u60c5\u6cc1\u90fd\u6709\u8986\u84cb，`node tools/check.mjs` \u5168\u90e8\u901a\u904e。'
// 、（）
const TW_HEAVY = '\u9019\u6b21\u7684 refactor \u628a session.start \u7684 tool registration \u62c6\u6210\u7368\u7acb\u7684 helper，hot reload \u6642 engine \u6703 retract \u6c92\u6709\u91cd\u65b0 register \u7684 tool，\u6240\u4ee5\u6bcf\u6b21 session.start \u90fd\u8981 register \u540c\u4e00\u4efd definition。\u53e6\u5916 prompt cache \u4e0d\u53d7\u5f71\u97ff，\u56e0\u70ba deferred tools \u53ea\u591a\u4e00\u7b46 hint，\u4e0d\u52d5 prefix。'
const CN = '\u6211\u628a watchCall \u6539\u6210\u5728 turn.step \u4e4b\u540e\u8bbe\u7f6e\u6807\u8bb0，\u4e0b\u4e00\u4e2a\u5de5\u5177\u7ed3\u679c\u4f1a\u5e26\u4e0a\u63d0\u9192。\u8fd9\u6837\u5982\u679c\u4e3b\u5bf9\u8bdd\u7684\u56de\u590d\u4e0d\u662f\u7b80\u4f53\u4e2d\u6587，\u53ea\u4f1a\u63d0\u9192\u4e00\u6b21，\u4e4b\u540e\u6709\u4e00\u6b65\u7b26\u5408\u8bed\u8a00\u624d\u4f1a\u91cd\u65b0\u8ba1\u7b97。\u6d4b\u8bd5\u4e5f\u5df2\u7ecf\u8865\u597d\u4e86，\u4e09\u79cd\u60c5\u51b5\u90fd\u6709\u8986\u76d6，\u6240\u6709\u68c0\u67e5\u90fd\u901a\u8fc7\u4e86。'
const CN_HEAVY = '\u8fd9\u6b21\u7684 refactor \u628a session.start \u7684 tool registration \u62c6\u6210\u72ec\u7acb\u7684 helper，hot reload \u65f6 engine \u4f1a retract \u6ca1\u6709\u91cd\u65b0 register \u7684 tool，\u6240\u4ee5\u6bcf\u6b21\u90fd\u8981 register \u540c\u4e00\u4efd definition。\u53e6\u5916 prompt cache \u4e0d\u53d7\u5f71\u54cd，\u56e0\u4e3a deferred tools \u53ea\u591a\u4e00\u7b14 hint，\u6574\u4f53\u884c\u4e3a\u6ca1\u6709\u6539\u53d8。'
const EN = 'I updated the hook so that it sets a pending flag after each step. When the reply is not in the configured language, the reminder is attached to the next tool result, once per streak. All checks pass, and I added tests for the mid-turn and final answer cases.'
const JA = 'フックを\u66f4\u65b0して、\u5404ステップの\u5f8cに\u4fdd\u7559フラグを\u8a2d\u5b9aするようにしました。\u8fd4\u4fe1が\u8a2d\u5b9aした\u8a00\u8a9eでない\u5834\u5408は、\u6b21のツール\u7d50\u679cにリマインダーを\u4e00\u5ea6だけ\u4ed8けます。テストも\u8ffd\u52a0して、すべてのチェックが\u901aっています。'
const JA_HEAVY = 'この\u5909\u66f4で session.start の tool registration を helper に\u5206けました。hot reload のときに engine が retract する tool を、\u6bce\u56de\u540cじ definition で register します。cache には\u5f71\u97ffしません。ただし deferred tools の hint が\u4e00\u4ef6\u5897えるので、prefix は\u5909わらないことを\u78ba\u8a8dしてください。'
const KO = '훅을 수정해서 각 단계가 끝난 뒤에 보류 플래그를 설정하도록 했습니다. 응답이 설정한 언어가 아니면 다음 도구 결과에 알림을 한 번만 붙입니다. 테스트도 추가했고 모든 검사가 통과했습니다.'

// ----------  ----------

test('\u7c21\u7e41\u5b57\u8868：\u4e00\u5c0d\u4e00、\u4e92\u4e0d\u91cd\u758a、\u6c92\u6709\u5169\u500b\u5b57\u76f8\u540c', () => {
  expect(SIMPLIFIED_ONLY.size).toBe(PAIRS.length)
  expect(TRADITIONAL_ONLY.size).toBe(PAIRS.length)
  for (const p of PAIRS) {
    expect([...p].length).toBe(2)
    expect(p[0]).not.toBe(p[1])
    expect(TRADITIONAL_ONLY.has(p[0])).toBe(false)
    expect(SIMPLIFIED_ONLY.has(p[1])).toBe(false)
  }
  // 
  for (const shared of '\u7406\u540e\u53f0\u91cc\u53ea\u5e72\u4e91\u590d\u4e8e\u5185\u5468\u51b2\u5e76\u542c\u5f02\u515a\u5382\u9762\u51fa\u6587\u4ef6\u884c\u7528\u9664\u4fee\u5165\u5b58\u7a0b') {
    expect(SIMPLIFIED_ONLY.has(shared)).toBe(false)
    expect(TRADITIONAL_ONLY.has(shared)).toBe(false)
  }
  expect(PAIRS.length).toBeGreaterThanOrEqual(150)
})

// ----------  ----------

test('Claude Code \u7684 language \u8a2d\u5b9a\u5c0d\u61c9\u5230\u76ee\u6a19\u8a9e\u8a00；\u53ea\u5beb\u4e2d\u6587\u5206\u4e0d\u51fa\u7e41\u7c21\u5c31\u4e0d\u63d0\u9192', () => {
  const cases: [unknown, string | undefined][] = [
    ['\u7e41\u9ad4\u4e2d\u6587', 'zh-TW'], ['Traditional Chinese', 'zh-TW'], ['zh-TW', 'zh-TW'], ['zh-Hant', 'zh-TW'], ['zh_HK', 'zh-TW'], ['\u53f0\u7063\u4e2d\u6587', 'zh-TW'],
    ['\u7b80\u4f53\u4e2d\u6587', 'zh-CN'], ['\u7c21\u9ad4\u4e2d\u6587', 'zh-CN'], ['Simplified Chinese', 'zh-CN'], ['zh-CN', 'zh-CN'], ['zh-Hans', 'zh-CN'],
    ['English', 'en'], ['english', 'en'], ['en', 'en'], ['en-US', 'en'],
    ['Japanese', 'ja'], ['\u65e5\u672c\u8a9e', 'ja'], ['ja', 'ja'], ['ja-JP', 'ja'],
    ['\u4e2d\u6587', undefined], ['Chinese', undefined], ['zh', undefined], ['Français', undefined], ['', undefined], ['  ', undefined], [undefined, undefined], [42, undefined],
  ]
  for (const [setting, want] of cases) expect(replyLangOfSetting(setting)).toBe(want)
})

test('\u8a2d\u5b9a\u503c：auto \u8ddf\u8457 language、off \u95dc\u9589、\u6307\u5b9a\u8a9e\u8a00\u76f4\u63a5\u7528', () => {
  expect(resolveReplyLang('auto', '\u7e41\u9ad4\u4e2d\u6587')).toBe('zh-TW')
  expect(resolveReplyLang('auto', undefined)).toBeUndefined()
  expect(resolveReplyLang('off', '\u7e41\u9ad4\u4e2d\u6587')).toBeUndefined()
  expect(resolveReplyLang('ja', '\u7e41\u9ad4\u4e2d\u6587')).toBe('ja')
  expect(isReplyLangSetting('zh-CN')).toBe(true)
  expect(isReplyLangSetting('fr')).toBe(false)
  expect(isReplyLangSetting(true)).toBe(false)
})

// ----------  ----------

test('proseOf：\u7a0b\u5f0f\u78bc、\u7db2\u5740、\u8def\u5f91、@\u63d0\u53ca、\u659c\u7dda\u6307\u4ee4、\u6a94\u540d\u90fd\u4e0d\u7b97\u8aaa\u660e', () => {
  const text = [
    '\u770b\u4e00\u4e0b `const veryLongIdentifier = 1` \u8207 https://example.com/some/page?q=1 \u9084\u6709 C:\\work\\a\\b.ts、hooks/loops.ts、./x/y、@someone，',
    '\u8dd1 /handoff \u548c config.test.ts。',
    '```ts',
    'const english = "this is a long english sentence inside a fenced block"',
    '```',
    '> \u5f15\u7528\u7684\u82f1\u6587 quoted english text from a tool',
    '\u7d50\u5c3e',
  ].join('\n')
  const c = countOf(proseOf(text))
  expect(c.latin).toBe(0)
  expect(c.han).toBeGreaterThanOrEqual(8)
  // ：
  expect(countOf(proseOf('\u8aaa\u660e\n```\nhello world this is code')).latin).toBe(0)
  // ~~~ 
  expect(countOf(proseOf('~~~\nhello world\n~~~\n')).latin).toBe(0)
})

test('\u82f1\u6587\u55ae\u5b57\u53ea\u7b97\u81ea\u7136\u55ae\u5b57：\u7e2e\u5beb、\u99dd\u5cf0、\u5e95\u7dda、\u593e\u6578\u5b57\u7684\u4e0d\u7b97', () => {
  expect(countOf('API JSON CI watchCall snake_case 30ms v2 I a OK').latin).toBe(0)
  expect(countOf('The cache stays warm for an hour').latin).toBe(7)
  expect(countOf("I'll check what isn't there").latin).toBe(4)
})

// ---------- （） ----------

test('zh-TW：\u593e\u82f1\u6587\u8853\u8a9e\u7684\u7e41\u9ad4\u4e2d\u6587\u4e0d\u89f8\u767c', () => {
  expect(judge(TW_MIXED, 'zh-TW')).toBe('on')
  expect(judge(TW_HEAVY, 'zh-TW')).toBe('on')
})

test('zh-TW：\u5c08\u6709\u540d\u8a5e、\u7a0b\u5f0f\u78bc、\u6307\u4ee4、\u8def\u5f91、\u7db2\u5740、\u8868\u683c\u4e0d\u89f8\u767c', () => {
  const table = ['| \u6a94\u6848 | \u8aaa\u660e |', '|---|---|', '| `hooks/lang.ts` | \u5224\u65b7\u8a9e\u8a00\u7684\u7d14\u51fd\u5f0f，\u4e0d\u78b0 session \u72c0\u614b |', '| `hooks/register.ts` | \u8a3b\u518a hook，\u4e26\u5728\u5de5\u5177\u7d50\u679c\u9644\u4e0a\u63d0\u9192 |'].join('\n')
  expect(judge(`${table}\n\n\u4ee5\u4e0a\u662f\u9019\u6b21\u52d5\u5230\u7684\u6a94\u6848，\u5176\u4ed6\u5730\u65b9\u90fd\u6c92\u6709\u6539。`, 'zh-TW')).toBe('on')
  const code = '\u6211\u628a\u5224\u65b7\u8a9e\u8a00\u7684\u51fd\u5f0f\u62c6\u5230\u7368\u7acb\u7684\u6a94\u6848，\u9019\u6a23\u4e0d\u7528\u78b0 session \u72c0\u614b\u4e5f\u80fd\u6e2c，\u4fee\u597d\u4e86，\u6539\u52d5\u5982\u4e0b：\n```ts\nexport function judge(text: string, target: ReplyLang): Verdict {\n  const prose = proseOf(text)\n  return prose.length > 40 ? "on" : "short"\n}\n```\n\u518d\u57f7\u884c `node tools/check.mjs`，\u7d50\u679c\u5168\u90e8\u901a\u904e，\u53e6\u5916\u4e5f\u88dc\u4e86\u56fa\u5b9a\u6e2c\u8a66，\u8acb\u4f60\u770b\u4e00\u4e0b https://example.com/pull/12 \u9019\u500b\u9023\u7d50，\u6709\u554f\u984c\u518d\u8ddf\u6211\u8aaa。'
  expect(judge(code, 'zh-TW')).toBe('on')
  // ：
  expect(judge('```\nI updated the hook so that it sets a pending flag after each step and the reply language is checked\n```', 'zh-TW')).toBe('short')
  expect(judge('/handoff guard on 3 @user hooks/lang.ts `npm test` API JSON CI TS HTTP URL SQL CLI SDK OK', 'zh-TW')).toBe('short')
})

test('\u53ea\u6709\u5e7e\u500b\u5b57\u7684\u4e0d\u5224\u65b7', () => {
  expect(judge('Done.', 'zh-TW')).toBe('short')
  expect(judge('Looks good.', 'zh-TW')).toBe('short')
  expect(judge('\u597d，\u770b\u4e00\u4e0b。', 'en')).toBe('short')
  expect(judge('', 'zh-TW')).toBe('short')
  expect(judge('   \n', 'ja')).toBe('short')
})

test('\u4e00\u5169\u53e5\u82f1\u6587\u65c1\u767d\u4e5f\u7b97\u63db\u4e86\u8a9e\u8a00；\u4e2d\u6587\u593e\u77ed\u82f1\u6587\u4e0d\u7b97', () => {
  expect(judge('Let me read the file.', 'zh-TW')).toBe('off')
  expect(judge("I'll check the tests first, then update the config and the docs.", 'zh-TW')).toBe('off')
  expect(judge('Found the reminder in the ctx-handoff mod. Now checking what language setting it reads.', 'zh-TW')).toBe('off')
  expect(judge('\u5148\u770b config \u518d\u8dd1 test。', 'zh-TW')).toBe('on')
  //  log：
  expect(judge(`${TW_MIXED} The build log shows the cache was warm and every check passed.`, 'zh-TW')).toBe('on')
})

test('zh-TW：\u5076\u723e\u6df7\u9032\u4e00\u5169\u500b\u7c21\u9ad4\u5b57（\u5f15\u7528、\u6253\u5b57）\u4e0d\u89f8\u767c', () => {
  expect(judge(`${TW_MIXED} \u4f7f\u7528\u8005\u539f\u8a71\u662f「\u8fd9\u6837\u53ef\u4ee5」。`, 'zh-TW')).toBe('on')
})

// ----------  ----------

test('zh-TW：\u5e7e\u4e4e\u5168\u82f1\u6587、\u7c21\u9ad4\u4e2d\u6587、\u65e5\u6587\u6703\u89f8\u767c', () => {
  expect(judge(EN, 'zh-TW')).toBe('off')
  expect(judge(CN, 'zh-TW')).toBe('off')
  expect(judge(CN_HEAVY, 'zh-TW')).toBe('off')
  expect(judge(JA, 'zh-TW')).toBe('off')
  expect(judge(`${EN}\n\n${EN}`, 'zh-TW')).toBe('off')
  // 、
  expect(judge('Done. \u5b8c\u6210\u4e86. I updated register.ts and added tests for the new hook, and all of the checks pass now. The change keeps the cache warm, leaves the existing behavior untouched, and the new tests cover the mid-turn reminder, the final answer case, and the subagent case as well.', 'zh-TW')).toBe('off')
})

test('zh-CN：\u7e41\u9ad4\u4e2d\u6587\u8207\u82f1\u6587\u6703\u89f8\u767c，\u7c21\u9ad4\u593e\u8853\u8a9e\u4e0d\u89f8\u767c', () => {
  expect(judge(TW_MIXED, 'zh-CN')).toBe('off')
  expect(judge(TW_HEAVY, 'zh-CN')).toBe('off')
  expect(judge(EN, 'zh-CN')).toBe('off')
  expect(judge(CN, 'zh-CN')).toBe('on')
  expect(judge(CN_HEAVY, 'zh-CN')).toBe('on')
})

test('en：\u4e2d\u6587、\u65e5\u6587、\u97d3\u6587\u70ba\u4e3b\u6703\u89f8\u767c；\u82f1\u6587\u593e\u4e00\u9ede\u4e2d\u6587\u4e0d\u89f8\u767c', () => {
  expect(judge(TW_MIXED, 'en')).toBe('off')
  expect(judge(CN, 'en')).toBe('off')
  expect(judge(JA, 'en')).toBe('off')
  expect(judge(KO, 'en')).toBe('off')
  expect(judge(EN, 'en')).toBe('on')
  expect(judge(`${EN} The Chinese UI text 「\u63d0\u9192」 and 「\u5b8c\u6210」 stays as is, and so do the file names in the report.`, 'en')).toBe('on')
})

test('ja：\u4e2d\u6587、\u97d3\u6587、\u82f1\u6587\u6703\u89f8\u767c；\u65e5\u6587\u593e\u82f1\u6587\u8853\u8a9e\u4e0d\u89f8\u767c', () => {
  expect(judge(TW_MIXED, 'ja')).toBe('off')
  expect(judge(CN, 'ja')).toBe('off')
  expect(judge(EN, 'ja')).toBe('off')
  expect(judge(KO, 'ja')).toBe('off')
  expect(judge(JA, 'ja')).toBe('on')
  expect(judge(JA_HEAVY, 'ja')).toBe('on')
})

// ----------  ----------

test('\u63d0\u9192\u72c0\u614b：\u4e0d\u662f\u76ee\u6a19\u8a9e\u8a00\u624d\u6392；\u6709\u5de5\u5177\u6392 pending，\u6c92\u6709\u5de5\u5177\u6392 next；\u6bcf\u6bb5\u53ea\u4e00\u6b21、\u7b26\u5408\u5f8c\u91cd\u7b97', () => {
  const s = freshReply()
  noteStep(s, TW_MIXED, true, 'zh-TW')
  noteStep(s, 'Let me look.', true, 'zh-TW')
  expect(s.pending).toBeUndefined()
  expect(s.next).toBeUndefined()
  noteStep(s, EN, true, 'zh-TW')
  expect(s.pending).toBe(reminderText('zh-TW'))
  expect(takePending(s)).toBe(reminderText('zh-TW'))
  expect(takePending(s)).toBeUndefined()
  // ：；
  noteStep(s, EN, true, 'zh-TW')
  noteStep(s, 'Let me look.', true, 'zh-TW')
  noteStep(s, EN, false, 'zh-TW')
  expect(s.pending).toBeUndefined()
  expect(s.next).toBeUndefined()
  // 
  noteStep(s, TW_MIXED, true, 'zh-TW')
  noteStep(s, EN, false, 'zh-TW')
  expect(s.pending).toBeUndefined()
  expect(peekNext(s)).toEqual([reminderText('zh-TW')])
  clearNext(s)
  expect(peekNext(s)).toEqual([])
})

test('\u63d0\u9192\u72c0\u614b：\u6c92\u9644\u51fa\u53bb\u7684 pending \u6703\u8ddf\u8457\u4f7f\u7528\u8005\u7684\u4e0b\u4e00\u5247\u8a0a\u606f，\u5169\u500b\u4e00\u6a23\u7684\u53ea\u5e36\u4e00\u6b21', () => {
  const s = freshReply()
  noteStep(s, EN, true, 'zh-TW')
  expect(peekNext(s)).toEqual([reminderText('zh-TW')])
  s.next = reminderText('zh-TW')
  expect(peekNext(s)).toEqual([reminderText('zh-TW')])
})

test('\u63d0\u9192\u6587\u5b57：\u7528\u76ee\u6a19\u8a9e\u8a00\u5beb，\u5e36 [ctx-handoff] \u958b\u982d\u4e26\u9ede\u540d\u8a9e\u8a00', () => {
  expect(reminderText('zh-TW')).toContain('\u7e41\u9ad4\u4e2d\u6587')
  expect(reminderText('zh-TW')).not.toMatch(/[\u8fd9\u8bf4\u8bf7\u7801\u4e0e\u4e13]/)
  expect(reminderText('zh-CN')).toContain('\u7b80\u4f53\u4e2d\u6587')
  expect(reminderText('en')).toContain('English')
  expect(reminderText('ja')).toContain('\u65e5\u672c\u8a9e')
  for (const l of ['zh-TW', 'zh-CN', 'en', 'ja'] as const) expect(reminderText(l)).toStartWith('[ctx-handoff] ')
})
