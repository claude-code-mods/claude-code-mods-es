// ：。、、（， $）
import { t } from './i18n'
import { ACTIONS_END, ACTIONS_START } from './distill'
import { NOTE_TAG, PROJECT_DECLINED, inProject, projectOf, promotedAtOf, ruleText } from './notes'
import type { Rule } from './notes'
import { clip } from './transcript'

// ---------- ：， ----------
// （proposed）， /handoff guard on N ； $.store，
export const GUARD_MIN_COUNT = 3
//  AI ： context （ PROMOTE_ITEMS ），
export const GUARD_ASK_ITEMS = 3
const GUARD_PATTERN_MAX = 300
export const GUARD_MODES = ['deny', 'remind'] as const
// tool.call 
const RESERVED_KEYS = new Set(['tool', 'tool_use_id', 'consent', 'agentId'])

export type GuardMode = typeof GUARD_MODES[number]
export type GuardState = 'proposed' | 'on' | 'off'
export type Guard = {
  id: number; rule: string; tool: string; match: string; unless?: string; message: string
  mode: GuardMode; state: GuardState; at: number
  // ：bad 、good 
  bad?: string; good?: string
  // ：、
  replay?: { hits: number; calls: number }
  // ：「 <>」（）「」
  project?: string
}
// ：，（$.store ， CLAUDE.md ）。
//  stats:<>  guard.hit.<>，
// recent：，（issue #6：10 ）
export type GuardView = Guard & { hits: number; recent: string[] }
export const guardHitKey = (id: number) => `guard.hit.${id}`
export const GUARD_RECENT_SHOWN = 3
export const withHits = (guards: Guard[], counts: Record<string, number> = {}, events: { what: string; detail: string }[] = []): GuardView[] =>
  guards.map(g => ({
    ...g,
    hits: counts[guardHitKey(g.id)] ?? 0,
    // 「# : 」，、
    recent: events.filter(e => e.what === guardHitKey(g.id)).slice(-GUARD_RECENT_SHOWN)
      .map(e => clip(e.detail.replace(/^#\d+ [^:]*: /, '').replace(/\s+/g, ' ').trim(), 100)),
  }))

// ：（Bash  command）， JSON，
export function inputText(input: Record<string, unknown>) {
  return Object.entries(input)
    .filter(([k, v]) => !RESERVED_KEYS.has(k) && v !== undefined)
    .map(([, v]) => (typeof v === 'string' ? v : JSON.stringify(v)))
    .join('\n')
}

const toolMatches = (pattern: string, tool: string) =>
  pattern.endsWith('*') ? tool.startsWith(pattern.slice(0, -1)) : pattern === tool

export function guardHits(g: Pick<Guard, 'tool' | 'match' | 'unless'>, tool: string, text: string) {
  if (!toolMatches(g.tool, tool)) return false
  try {
    if (!new RegExp(g.match, 'i').test(text)) return false
    return g.unless === undefined || !new RegExp(g.unless, 'i').test(text)
  } catch {
    return false
  }
}

// ，（ Write／Edit  JSON.stringify）
export function findGuardHit(guards: readonly Guard[], tool: string, input: Record<string, unknown>) {
  const active = guards.filter(g => g.state === 'on' && toolMatches(g.tool, tool))
  if (active.length === 0) return undefined
  const text = inputText(input)
  const hit = active.find(g => guardHits(g, tool, text))
  return hit ? { hit, text } : undefined
}

export function guardPrompt(rules: Rule[], tools: string[]) {
  return [
    '\u4f60\u66ff\u4e00\u500b Claude Code \u5de5\u4f5c\u5340\u8a2d\u8a08「\u5b88\u9580」：\u5728 AI \u547c\u53eb\u5de5\u5177\u4e4b\u524d，\u7528\u6b63\u898f\u8868\u9054\u5f0f\u6bd4\u5c0d\u5de5\u5177\u53c3\u6578，\u6514\u4e0b\u9055\u53cd\u898f\u5247\u7684\u547c\u53eb。',
    '\u4e0b\u9762\u662f\u9019\u500b\u5de5\u4f5c\u5340\u88ab\u53cd\u8986\u63d0\u9192\u7684\u898f\u5247。\u9010\u689d\u5224\u65b7：\u9055\u898f\u6642，\u5de5\u5177\u53c3\u6578\u88e1\u6709\u6c92\u6709\u660e\u78ba、\u53ef\u6bd4\u5c0d\u7684\u7279\u5fb5？',
    '',
    '\u53ea\u5728\u9019\u4e9b\u60c5\u6cc1\u63d0\u51fa\u5b88\u9580：',
    '- \u9055\u898f\u4e00\u5b9a\u7d93\u904e\u67d0\u500b\u5de5\u5177，\u53c3\u6578\u6709\u660e\u78ba\u7279\u5fb5（\u6307\u4ee4、\u5de5\u5177\u540d\u7a31、SQL \u95dc\u9375\u5b57、\u8def\u5f91）',
    '- \u6709 unless \u53ef\u4ee5\u6392\u9664「\u7167\u898f\u5247\u505a」\u7684\u6b63\u78ba\u5beb\u6cd5，\u4f8b\u5982\u6539\u7528\u898f\u5247\u6307\u5b9a\u7684\u5de5\u5177\u6216\u5305\u88dd\u8173\u672c',
    '\u4e0d\u8981\u63d0\u51fa：\u898f\u5247\u8b1b\u7684\u662f\u56de\u7b54\u88e1\u7684\u8aaa\u6cd5、\u5224\u65b7\u9806\u5e8f、\u5beb\u4f5c\u5167\u5bb9，\u6216\u7279\u5fb5\u592a\u6a21\u7cca\u6703\u64cb\u5230\u6b63\u5e38\u5de5\u4f5c\u7684。',
    '',
    '\u6bd4\u5c0d\u65b9\u5f0f：',
    '- tool：\u5de5\u5177\u540d\u7a31\u539f\u6a23，\u4f8b\u5982 Bash、Edit、mcp__supabase__execute_sql；\u7d50\u5c3e * \u8868\u793a\u524d\u7db4',
    '- \u6bd4\u5c0d\u6587\u5b57：\u5de5\u5177\u53c3\u6578\u7684\u5b57\u4e32\u503c\u4ee5\u63db\u884c\u4e32\u8d77\u4f86（Bash \u5c31\u662f command \u672c\u8eab）；\u4e0d\u5206\u5927\u5c0f\u5beb\u7684 JavaScript \u6b63\u898f\u8868\u9054\u5f0f',
    `- match／unless \u5404\u4e0d\u8d85\u904e ${GUARD_PATTERN_MAX} \u5b57；\u5be7\u53ef\u7a84、\u4e0d\u8981\u5bec，\u4e0d\u8981\u5beb\u6210\u4ec0\u9ebc\u90fd\u547d\u4e2d\u7684\u6a23\u5f0f`,
    '- \u7279\u6b8a\u5b57\u5143\u8981\u8df3\u812b：\u6bd4\u5c0d\u5b57\u9762\u7684 $$ \u8981\u5beb \\$\\$，. \u5beb \\.；\u5beb\u9032 JSON \u6642\u6bcf\u500b\u53cd\u659c\u7dda\u518d\u5beb\u6210 \\\\',
    '- MCP \u7684 SQL \u5de5\u5177\u53c3\u6578\u542b project_id：\u898f\u5247\u53ea\u7ba1\u6b63\u5f0f\u7ad9\u6642，\u7528\u5b83\u5206\u8fa8\u6b63\u5f0f\u7ad9\u548c\u6e2c\u8a66\u74b0\u5883',
    '- bad：\u4e00\u6bb5\u9055\u898f\u7684\u6bd4\u5c0d\u6587\u5b57\u7bc4\u4f8b（\u8981\u88ab match \u547d\u4e2d、\u4e0d\u88ab unless \u6392\u9664）；good：\u4e00\u6bb5\u7167\u898f\u5247\u505a、\u4e5f\u7528\u540c\u4e00\u500b\u5de5\u5177\u7684\u6b63\u78ba\u7bc4\u4f8b（\u4e0d\u80fd\u88ab\u64cb）。\u7a0b\u5f0f\u6703\u5be6\u969b\u6bd4\u5c0d，\u4e0d\u7b26\u5c31\u4e1f\u6389',
    '- mode：deny（\u57f7\u884c\u524d\u64cb\u4e0b）\u53ea\u7528\u5728\u4e0d\u53ef\u9006、\u6b63\u5f0f\u74b0\u5883\u6216\u4ee3\u50f9\u9ad8\u7684\u932f\u8aa4；\u5176\u4ed6\u7528 remind（\u7167\u5e38\u57f7\u884c，\u4e4b\u5f8c\u63d0\u9192）',
    '- message：\u7d66 AI \u770b\u7684\u4e00\u53e5\u8a71，\u8aaa\u8a72\u6539\u6210\u600e\u9ebc\u505a（\u5f15\u7528\u898f\u5247\u88e1\u7684\u5de5\u5177\u6216\u6307\u4ee4）',
    '',
    `\u9019\u500b\u5c0d\u8a71\u7528\u904e\u7684\u5de5\u5177：${tools.length ? tools.join(', ') : '（\u7121\u7d00\u9304）'}`,
    '',
    `\u8f38\u51fa：\u5728 ${ACTIONS_START} \u8207 ${ACTIONS_END} \u4e4b\u9593，\u6bcf\u884c\u4e00\u500b JSON，\u6bcf\u689d\u898f\u5247\u6700\u591a\u4e00\u500b；\u6c92\u6709\u9069\u5408\u7684\u5c31\u5169\u884c\u6a19\u8a18\u4e4b\u9593\u7559\u7a7a。`,
    '{"rule":"<\u898f\u5247\u540d\u7a31，\u539f\u6a23>","tool":"Bash","match":"<regex>","unless":"<regex，\u53ef\u7701\u7565>","mode":"remind","message":"<\u4e00\u53e5\u8a71>","bad":"<\u9055\u898f\u7bc4\u4f8b>","good":"<\u6b63\u78ba\u7bc4\u4f8b>"}',
    '',
    '=== \u898f\u5247 ===',
    ...rules.flatMap(r => [`### ${r.name}`, ...r.body]),
  ].join('\n')
}

type ProposedGuard = Pick<Guard, 'rule' | 'tool' | 'match' | 'unless' | 'mode' | 'message' | 'bad' | 'good'>

export function parseGuards(text: string, names: Set<string>) {
  const out: ProposedGuard[] = []
  const rejected: string[] = []
  const start = text.indexOf(ACTIONS_START)
  const end = text.indexOf(ACTIONS_END, start + 1)
  const p = t().guard.parse
  if (start === -1 || end === -1) return { out, rejected: [p.noMarker] }
  for (const line of text.slice(start + ACTIONS_START.length, end).split('\n')) {
    if (!line.trim()) continue
    try {
      const g = JSON.parse(line) as Record<string, unknown>
      const str = (k: string) => (typeof g[k] === 'string' && (g[k] as string).trim() ? (g[k] as string) : undefined)
      const rule = str('rule'), tool = str('tool'), match = str('match'), message = str('message')
      const unless = str('unless')
      const mode = GUARD_MODES.find(m => m === g.mode)
      if (!rule || !names.has(rule)) throw new Error(p.notCandidate)
      if (!tool || !/^[\w.-]+\*?$/.test(tool)) throw new Error(p.badTool)
      if (!match || !message || !mode) throw new Error(p.missingFields)
      for (const pattern of [match, unless]) {
        if (pattern === undefined) continue
        if (pattern.length > GUARD_PATTERN_MAX) throw new Error(p.tooLong)
        new RegExp(pattern, 'i')
      }
      // ：、；
      const bad = str('bad'), good = str('good')
      if (!bad || !good) throw new Error(p.missingExamples)
      const probe = { tool, match, ...(unless ? { unless } : {}) }
      const self = tool.replace(/\*$/, '')
      if (!guardHits(probe, self, bad)) throw new Error(p.badNotBlocked)
      if (guardHits(probe, self, good)) throw new Error(p.goodBlocked)
      if (out.some(o => o.rule === rule)) throw new Error(p.duplicate)
      out.push({ ...probe, rule, mode, message, bad, good })
    } catch (err) {
      rejected.push(p.wrap(clip(line.trim(), 80), err instanceof Error ? err.message : String(err)))
    }
  }
  return { out, rejected }
}

// ---------- （register.ts  store） ----------
// （ 2026-10-09）： repo （），
//  repo、 GUARD_MIN_COUNT 。 repo  repo；（，）
const escalated = (r: Rule) => {
  if (inProject(r)) { const at = promotedAtOf(r); return at !== undefined && r.count > at }
  return projectOf(r) === PROJECT_DECLINED && r.count >= GUARD_MIN_COUNT
}
export const guardCandidatesOf = (rules: Rule[], guards: Guard[]) =>
  rules.filter(r => escalated(r) && !guards.some(g => g.rule === r.name))

//  AI ：AI ，
export const guardAskText = (drafts: { guard: Guard; rule: Rule | undefined }[]) => [
  `${NOTE_TAG} \u4e0b\u9762\u9019\u4e9b\u898f\u5247\u5df2\u7d93\u5beb\u6210\u6587\u5b57，AI \u9084\u662f\u4e00\u518d\u9055\u53cd，ctx-handoff \u8d77\u8349\u4e86\u5b88\u9580：\u5728 AI \u547c\u53eb\u5de5\u5177\u4e4b\u524d\u6bd4\u5c0d\u53c3\u6578，\u9055\u898f\u6642\u63d0\u9192\u6216\u64cb\u4e0b。\u5148\u505a\u5b8c\u4f7f\u7528\u8005\u9019\u6b21\u4ea4\u4ee3\u7684\u4e8b，\u518d\u5728\u56de\u8986\u6700\u5f8c\u7528\u4e00\u5169\u53e5\u767d\u8a71\u554f\u4f7f\u7528\u8005\u8981\u4e0d\u8981\u63a1\u7528：\u8aaa\u660e\u5b83\u5728\u4ec0\u9ebc\u60c5\u6cc1\u6703\u51fa\u73fe、\u6703\u505a\u4ec0\u9ebc。\u4f7f\u7528\u8005\u6b63\u5728\u8655\u7406\u7dca\u6025\u554f\u984c\u5c31\u4e0d\u8981\u554f。`,
  ...drafts.map(({ guard: g, rule: r }) => `- \u5b88\u9580 #${g.id}（${g.mode === 'deny' ? '\u64cb\u4e0b' : '\u63d0\u9192'}）：\u898f\u5247「${g.rule}」${r ? `（\u4f7f\u7528\u8005\u63d0\u904e ${r.count} \u6b21；${ruleText(r)}）` : ''}｜\u5de5\u5177 ${g.tool} \u7b26\u5408 /${g.match}/${g.unless ? `，\u9664\u975e /${g.unless}/` : ''}\u6642，\u544a\u8a34 AI：${g.message}`),
  '\u4f7f\u7528\u8005\u60f3\u8a0e\u8ad6\u5c31\u56de\u7b54\u554f\u984c，\u4f8b\u5982\u6703\u4e0d\u6703\u64cb\u5230\u6b63\u5e38\u5de5\u4f5c、\u8981\u63d0\u9192\u9084\u662f\u64cb\u4e0b。\u4f7f\u7528\u8005\u8aaa\u8981\u6216\u4e0d\u8981，\u4e0d\u7528\u547c\u53eb\u4efb\u4f55\u5de5\u5177，\u80cc\u666f\u6574\u7406\u6703\u5f9e\u5c0d\u8a71\u8a18\u4e0b；\u4f7f\u7528\u8005\u6c92\u56de\u61c9\u5c31\u4e0d\u8981\u8ffd\u554f。',
].join('\n')

// 、（）
export function withProposals(out: ReturnType<typeof parseGuards>['out'], guards: Guard[], calls: { tool: string; input: Record<string, unknown> }[], at: number) {
  let id = guards.reduce((n, g) => Math.max(n, g.id), 0)
  return out.map(g => ({
    ...g, id: ++id, state: 'proposed' as const, at,
    replay: { hits: calls.filter(c => toolMatches(g.tool, c.tool) && guardHits(g, c.tool, inputText(c.input))).length, calls: calls.length },
  }))
}

export function guardListText(guards: GuardView[]) {
  const m = t()
  if (guards.length === 0) return m.guard.none(GUARD_MIN_COUNT)
  return [
    m.guard.listHead,
    ...guards.flatMap(g => [
      m.guard.entry(g.id, m.guard.state[g.state], m.guard.mode[g.mode], g.rule, g.hits),
      `${m.ind}${m.guardMatch(g.tool, g.match, g.unless)}`,
      `${m.ind}→ ${g.message}`,
      ...(g.bad && g.good ? [`${m.ind}${m.guard.example(clip(g.bad, 80), clip(g.good, 80))}`] : []),
      ...(g.replay ? [`${m.ind}${m.guard.replay(g.replay.calls, g.replay.hits)}`] : []),
      ...(g.recent.length ? [`${m.ind}${m.guard.recentHits}`, ...g.recent.map(r => `${m.ind}　${r}`)] : []),
    ]),
  ].join('\n')
}

export function guardSummaryText(guards: Guard[], candidates: number) {
  const count = (s: GuardState) => guards.filter(g => g.state === s).length
  return t().guard.summary(count('on'), count('proposed'), count('off')) +
    (candidates ? t().guard.summaryMore(candidates, GUARD_MIN_COUNT) : '')
}

// /handoff guard ：on／off／drop ，mode ， undefined
export const guardChangeOf = (action: string, modeText: string) =>
  action === 'on' || action === 'off' || action === 'drop' ? action
    : action === 'mode' ? GUARD_MODES.find(m => m === modeText) : undefined

// ／／／；， undefined
export function applyGuardChange(guards: Guard[], id: number, change: 'on' | 'off' | 'drop' | GuardMode) {
  const g = guards.find(x => x.id === id)
  if (!g) return undefined
  const updated = change === 'drop' ? guards.filter(x => x !== g)
    : guards.map(x => (x !== g ? x : change === 'on' || change === 'off' ? { ...x, state: change } : { ...x, mode: change }))
  return { g, updated }
}
