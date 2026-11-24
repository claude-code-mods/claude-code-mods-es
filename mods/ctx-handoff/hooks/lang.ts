// （ $）：、、。
// 「」：、、、，、、。
// ：、、
import { tag } from './notes'

export type ReplyLang = 'zh-TW' | 'zh-CN' | 'en' | 'ja'
export type ReplyLangSetting = 'auto' | 'off' | ReplyLang
export const REPLY_LANG_SETTINGS: readonly ReplyLangSetting[] = ['auto', 'off', 'zh-TW', 'zh-CN', 'en', 'ja']
export const isReplyLangSetting = (v: unknown): v is ReplyLangSetting => REPLY_LANG_SETTINGS.includes(v as ReplyLangSetting)

// ----------  →  ----------

const TW = /\u7e41\u9ad4|\u7e41\u4f53|traditional|zh[-_ ]?(?:tw|hk|hant)|\u53f0\u7063|\u81fa\u7063|taiwan/i
const CN = /\u7b80\u4f53|\u7c21\u9ad4|\u7b80\u9ad4|simplified|zh[-_ ]?(?:cn|hans|sg)|\u5927\u9646|\u5927\u9678|mainland/i
const JA = /^ja\b|japanese|\u65e5\u672c\u8a9e|\u65e5\u672c\u8bed|\u65e5\u8bed|\u65e5\u8a9e|nihongo/i
const EN = /^en\b|english|\u82f1\u8a9e|\u82f1\u8bed|\u82f1\u6587/i

// Claude Code  language （，「」「English」「」）；
// 「」「Chinese」， undefined（）
export function replyLangOfSetting(setting: unknown): ReplyLang | undefined {
  if (typeof setting !== 'string') return undefined
  const s = setting.trim()
  if (!s) return undefined
  if (TW.test(s)) return 'zh-TW'
  if (CN.test(s)) return 'zh-CN'
  if (JA.test(s)) return 'ja'
  if (EN.test(s)) return 'en'
  return undefined
}

//  + Claude Code  language → （undefined＝）
export function resolveReplyLang(setting: ReplyLangSetting, claudeLanguage: unknown): ReplyLang | undefined {
  if (setting === 'off') return undefined
  return setting === 'auto' ? replyLangOfSetting(claudeLanguage) : setting
}

// ----------  ----------

// 「 」，、。
// ：、（）、、、、、、、、、、、、、、、（）
export const PAIRS = [
  '\u8fd9\u9019', '\u4eec\u5011', '\u8bf4\u8aaa', '\u65f6\u6642', '\u4f1a\u6703', '\u4e3a\u70ba', '\u5bf9\u5c0d', '\u53d1\u767c', '\u7ecf\u7d93', '\u8fc7\u904e', '\u8fd8\u9084', '\u8fdb\u9032', '\u6ca1\u6c92', '\u95ee\u554f', '\u4e48\u9ebc', '\u6837\u6a23',
  '\u73b0\u73fe', '\u5e94\u61c9', '\u8be5\u8a72', '\u4e0e\u8207', '\u4e2a\u500b', '\u4ece\u5f9e', '\u52a8\u52d5', '\u89c1\u898b', '\u957f\u9577', '\u5f00\u958b', '\u5173\u95dc', '\u9898\u984c', '\u8bbe\u8a2d', '\u8ba1\u8a08', '\u6570\u6578', '\u636e\u64da',
  '\u8bb0\u8a18', '\u5f55\u9304', '\u5904\u8655', '\u9a8c\u9a57', '\u8bc1\u8b49', '\u6d4b\u6e2c', '\u8bd5\u8a66', '\u8f93\u8f38', '\u9519\u932f', '\u8bef\u8aa4', '\u5b9e\u5be6', '\u9645\u969b', '\u9879\u9805', '\u6863\u6a94', '\u8bfb\u8b80', '\u5199\u5beb',
  '\u8bf7\u8acb', '\u8ba9\u8b93', '\u7ed9\u7d66', '\u53d8\u8b8a', '\u5c06\u5c07', '\u8282\u7bc0', '\u70b9\u9ede', '\u5355\u55ae', '\u7b80\u7c21', '\u4f53\u9ad4', '\u8bed\u8a9e', '\u8f83\u8f03', '\u7ebf\u7dda', '\u7f51\u7db2', '\u9875\u9801', '\u52a1\u52d9',
  '\u4ea7\u7522', '\u4e1a\u696d', '\u4e1c\u6771', '\u95e8\u9580', '\u95f4\u9593', '\u673a\u6a5f', '\u8f6f\u8edf', '\u6267\u57f7', '\u7801\u78bc', '\u7c7b\u985e', '\u8c03\u8abf', '\u7ed3\u7d50', '\u6784\u69cb', '\u521b\u5275', '\u5220\u522a', '\u5bfc\u5c0e',
  '\u5e93\u5eab', '\u6001\u614b', '\u72b6\u72c0', '\u51b5\u6cc1', '\u603b\u7e3d', '\u65e0\u7121', '\u5f53\u7576', '\u7535\u96fb', '\u8111\u8166', '\u89c6\u8996', '\u89c9\u89ba', '\u5b66\u5b78', '\u4e60\u7fd2', '\u5e08\u5e2b', '\u5458\u54e1', '\u62a5\u5831',
  '\u8ba4\u8a8d', '\u8bc6\u8b58', '\u522b\u5225', '\u9009\u9078', '\u62e9\u64c7', '\u53c2\u53c3', '\u534f\u5354', '\u8bae\u8b70', '\u50a8\u5132', '\u7f13\u7de9', '\u533a\u5340', '\u5757\u584a', '\u8fb9\u908a', '\u7f18\u7de3', '\u538b\u58d3', '\u7f29\u7e2e',
  '\u4f20\u50b3', '\u9012\u905e', '\u8f7d\u8f09', '\u672f\u8853', '\u7f16\u7de8', '\u8bd1\u8b6f', '\u8fd0\u904b', '\u73af\u74b0', '\u6743\u6b0a', '\u7ea7\u7d1a', '\u5907\u5099', '\u542f\u555f', '\u7ec8\u7d42', '\u663e\u986f', '\u56fe\u5716', '\u6807\u6a19',
  '\u51fb\u64ca', '\u952e\u9375', '\u76d8\u76e4', '\u9488\u91dd', '\u629b\u62cb', '\u91ca\u91cb', '\u8651\u616e', '\u62c5\u64d4', '\u54cd\u97ff', '\u4f18\u512a', '\u7eed\u7e8c', '\u7ee7\u7e7c', '\u65ad\u65b7', '\u8054\u806f', '\u7edc\u7d61', '\u94fe\u93c8',
  '\u5c42\u5c64', '\u89c8\u89bd', '\u8bdd\u8a71', '\u8ba8\u8a0e', '\u8bba\u8ad6', '\u96be\u96e3', '\u786e\u78ba', '\u5417\u55ce', '\u8c22\u8b1d', '\u5e2e\u5e6b', '\u4e70\u8cb7', '\u5356\u8ce3', '\u94b1\u9322', '\u8d39\u8cbb', '\u8d2d\u8cfc', '\u8d26\u5e33',
  '\u53f7\u865f', '\u94a5\u9470', '\u4e66\u66f8', '\u6761\u689d', '\u89c4\u898f', '\u5219\u5247', '\u56f4\u570d', '\u4e3e\u8209', '\u4e24\u5169', '\u95fb\u805e', '\u9605\u95b1', '\u961f\u968a', '\u9636\u968e', '\u968f\u96a8', '\u4e49\u7fa9', '\u4e71\u4e82',
  '\u5934\u982d', '\u5174\u8208', '\u4eb2\u89aa', '\u4ec5\u50c5', '\u4ed3\u5009', '\u4f17\u773e', '\u4f24\u50b7', '\u4fa7\u5074', '\u517b\u990a', '\u519b\u8ecd', '\u519c\u8fb2', '\u51cf\u6e1b', '\u521a\u525b', '\u5267\u5287', '\u529e\u8fa6', '\u52b3\u52de',
  '\u52bf\u52e2', '\u53cc\u96d9',
] as const
export const SIMPLIFIED_ONLY = new Set(PAIRS.map(p => p[0]))
export const TRADITIONAL_ONLY = new Set(PAIRS.map(p => p[1]))

// ----------  ----------

// （「OK.」「Done.」），：（2026-10-30 ）
export const MIN_UNITS = 4
// 「」。： 1 、 2 （）
export const DOMINANT = 0.75
//  3 、 6%，
export const MIX_MIN = 3
export const MIX_SHARE = 0.06
// ，
const MAX_TEXT = 20_000

export type Counts = { han: number; kana: number; hangul: number; latin: number; simp: number; trad: number }

// 「」：、、、、、@、、 a.b 。
// 、，
export function proseOf(text: string): string {
  const kept: string[] = []
  let fence: string | undefined
  for (const line of text.split('\n')) {
    const head = line.trimStart()
    const mark = head.startsWith('```') ? '```' : head.startsWith('~~~') ? '~~~' : undefined
    if (fence !== undefined) {
      if (mark === fence) fence = undefined
      continue
    }
    if (mark !== undefined) { fence = mark; continue }
    if (head.startsWith('>')) continue
    kept.push(line)
  }
  return kept.join('\n')
    .replace(/`[^`\n]*`/g, ' ')
    .replace(/\b[a-z][a-z0-9+.-]*:\/\/\S+/gi, ' ')
    .replace(/\bwww\.\S+/gi, ' ')
    .replace(/\b[A-Za-z]:[\\/][^\s"'`)\]>]*/g, ' ')
    .replace(/(?:\.{1,2}\/|~\/|\/)?(?:[\w.@~-]+\/)+[\w.@~-]*/g, ' ')
    .replace(/(?<!\w)@[\w./-]+/g, ' ')
    .replace(/(?<![\w/])\/[A-Za-z][\w:-]*/g, ' ')
    .replace(/\b[\w-]+(?:\.[\w-]+)+\b/g, ' ')
}

// ：2 、。（API、JSON）、、
const WORD = /^[A-Z]?[a-z]{2,}$/
const HAN_RE = /\p{Script=Han}/u
const KANA_RE = /[\p{Script=Hiragana}\p{Script=Katakana}]/u
const HANGUL_RE = /\p{Script=Hangul}/u

export function countOf(prose: string): Counts {
  const c: Counts = { han: 0, kana: 0, hangul: 0, latin: 0, simp: 0, trad: 0 }
  for (const ch of prose) {
    if (ch <= '\u007f') continue
    if (HAN_RE.test(ch)) {
      c.han += 1
      if (SIMPLIFIED_ONLY.has(ch)) c.simp += 1
      else if (TRADITIONAL_ONLY.has(ch)) c.trad += 1
    } else if (KANA_RE.test(ch)) c.kana += 1
    else if (HANGUL_RE.test(ch)) c.hangul += 1
  }
  // I'll、don't 
  for (const w of prose.match(/[A-Za-z0-9_]+(?:'[A-Za-z]+)?/g) ?? []) if (WORD.test(w.replace(/'[A-Za-z]+$/, ''))) c.latin += 1
  return c
}

export type Verdict = 'on' | 'off' | 'short'

export function judge(text: string, target: ReplyLang): Verdict {
  const c = countOf(proseOf(text.slice(0, MAX_TEXT)))
  const cjk = c.han + c.kana + c.hangul
  const cjkUnits = cjk / 2
  const total = cjkUnits + c.latin
  if (total < MIN_UNITS) return 'short'
  const latinShare = total > 0 ? c.latin / total : 0
  const mixed = (n: number) => n >= MIX_MIN && c.han > 0 && n / c.han > MIX_SHARE
  switch (target) {
    case 'en':
      return 1 - latinShare > DOMINANT ? 'off' : 'on'
    case 'ja':
      if (latinShare > DOMINANT) return 'off'
      if (c.hangul > c.han + c.kana) return 'off'
      // ；，
      return c.han >= 30 && c.kana / (c.han + c.kana) < 0.1 ? 'off' : 'on'
    case 'zh-TW':
      if (latinShare > DOMINANT) return 'off'
      if (c.kana >= 10 && c.kana > c.han * 0.2) return 'off'
      return mixed(c.simp) ? 'off' : 'on'
    case 'zh-CN':
      if (latinShare > DOMINANT) return 'off'
      if (c.kana >= 10 && c.kana > c.han * 0.2) return 'off'
      return mixed(c.trad) ? 'off' : 'on'
  }
}

// ----------  ----------

export const LANG_NAMES: Record<ReplyLang, string> = { 'zh-TW': '\u7e41\u9ad4\u4e2d\u6587', 'zh-CN': '\u7b80\u4f53\u4e2d\u6587', en: 'English', ja: '\u65e5\u672c\u8a9e' }

// （）；、、
export function reminderText(target: ReplyLang): string {
  switch (target) {
    case 'zh-TW': return `${tag} \u8acb\u7528\u7e41\u9ad4\u4e2d\u6587\u8aaa\u660e（\u7a0b\u5f0f\u78bc\u8207\u5c08\u6709\u540d\u8a5e\u7167\u539f\u6587；\u4f7f\u7528\u8005\u6307\u5b9a\u5176\u4ed6\u8a9e\u8a00\u7684\u5167\u5bb9\u7167\u5beb）。`
    case 'zh-CN': return `${tag} \u8bf7\u7528\u7b80\u4f53\u4e2d\u6587\u8bf4\u660e（\u4ee3\u7801\u548c\u4e13\u6709\u540d\u8bcd\u4fdd\u6301\u539f\u6587；\u7528\u6237\u6307\u5b9a\u5176\u4ed6\u8bed\u8a00\u7684\u5185\u5bb9\u7167\u5199）。`
    case 'en': return `${tag} Please explain in English (keep code and proper nouns as is; content the user asked for in another language stays).`
    case 'ja': return `${tag} \u8aac\u660eは\u65e5\u672c\u8a9eで\u66f8いてください（コードと\u56fa\u6709\u540d\u8a5eは\u539f\u6587のまま。ユーザーが\u5225の\u8a00\u8a9eで\u983cんだ\u5185\u5bb9はそのまま）。`
  }
}

// ，：，（，）
export function rewriteText(target: ReplyLang): string {
  switch (target) {
    case 'zh-TW': return `${tag} \u6700\u5f8c\u7684\u56de\u8986\u4e0d\u662f\u7e41\u9ad4\u4e2d\u6587，\u8acb\u7528\u7e41\u9ad4\u4e2d\u6587\u91cd\u5beb\u4e00\u6b21（\u7a0b\u5f0f\u78bc\u8207\u5c08\u6709\u540d\u8a5e\u7167\u539f\u6587；\u82e5\u662f\u4f7f\u7528\u8005\u6307\u5b9a\u5176\u4ed6\u8a9e\u8a00\u7684\u5167\u5bb9，\u4e0d\u7528\u91cd\u5beb）。`
    case 'zh-CN': return `${tag} \u6700\u540e\u7684\u56de\u590d\u4e0d\u662f\u7b80\u4f53\u4e2d\u6587，\u8bf7\u7528\u7b80\u4f53\u4e2d\u6587\u91cd\u5199\u4e00\u6b21（\u4ee3\u7801\u548c\u4e13\u6709\u540d\u8bcd\u4fdd\u6301\u539f\u6587；\u82e5\u662f\u7528\u6237\u6307\u5b9a\u5176\u4ed6\u8bed\u8a00\u7684\u5185\u5bb9，\u4e0d\u7528\u91cd\u5199）。`
    case 'en': return `${tag} Your final reply was not in English. Rewrite it in English (keep code and proper nouns as is; skip this if the user asked for that language).`
    case 'ja': return `${tag} \u6700\u5f8cの\u8fd4\u4fe1が\u65e5\u672c\u8a9eではありません。\u65e5\u672c\u8a9eで\u66f8き\u76f4してください（コードと\u56fa\u6709\u540d\u8a5eは\u539f\u6587のまま。ユーザーが\u5225の\u8a00\u8a9eを\u6307\u5b9aした\u5185\u5bb9なら\u4e0d\u8981）。`
  }
}

// （Stop）：。stop_hook_active（），
// ；，
export function stopRewrite(state: ReplyState, message: string | undefined, stopHookActive: boolean, target: ReplyLang): string | undefined {
  if (stopHookActive || !message || judge(message, target) !== 'off') return undefined
  clearNext(state)
  state.nudged = true
  return rewriteText(target)
}

// ：nudged＝（）；
// pending＝；next＝
export type ReplyState = { nudged: boolean; pending: string | undefined; next: string | undefined }
export const freshReply = (): ReplyState => ({ nudged: false, pending: undefined, next: undefined })

// 。（，）：
// ，；（）
export function noteStep(state: ReplyState, answer: string, hasToolUses: boolean, target: ReplyLang) {
  const verdict = judge(answer, target)
  if (verdict === 'on') state.nudged = false
  if (verdict !== 'off' || state.nudged) return
  state.nudged = true
  if (hasToolUses) state.pending = reminderText(target)
  else state.next = reminderText(target)
}

// （）
export function takePending(state: ReplyState): string | undefined {
  const text = state.pending
  state.pending = undefined
  return text
}

// ： pending 
export function peekNext(state: ReplyState): string[] {
  return [...new Set([state.pending, state.next].filter((s): s is string => s !== undefined))]
}
export function clearNext(state: ReplyState) {
  state.pending = undefined
  state.next = undefined
}
