// ： AI 、、、（， $； store  register.ts）
// AI ：（in_project），
import type { Guard } from './guards'
import { NOTE_TAG, procSteps, procWhen, projectOf, ruleText } from './notes'
import type { Notes } from './notes'

// 、， AI  repo（AI 、、 commit； skill）。
// ： context ，
export const PROMOTE_MIN_COUNT = 3
const PROMOTE_ITEMS = 3

// 、。（）；
// （session.end），，，
export type PromoteAsk = { sid: string; at: number }

//  repo（）：、、
export function promoteCandidates(guardList: Guard[], notes: Notes) {
  const guards = guardList.filter(g => g.state === 'on' && g.project === undefined).map(g => ({
    key: `g:${g.id}`,
    id: `G${g.id}`,
    name: g.rule,
    line: `- \u5b88\u9580 #${g.id}（${g.mode === 'deny' ? '\u64cb\u4e0b' : '\u63d0\u9192'}）：${g.rule}｜\u5de5\u5177 ${g.tool}｜\u7b26\u5408 /${g.match}/${g.unless ? `，\u9664\u975e /${g.unless}/` : ''}｜\u8a0a\u606f：${g.message}`,
  }))
  const rules = notes.rules.map((r, i) => ({ r, i })).filter(({ r }) => r.count >= PROMOTE_MIN_COUNT && projectOf(r) === undefined)
    .sort((a, b) => b.r.count - a.r.count)
    .map(({ r, i }) => ({ key: `r:${r.name}`, id: `R${i + 1}`, name: r.name, line: `- \u898f\u5247「${r.name}」（${r.count} \u6b21）：${ruleText(r)}` }))
  const procedures = notes.procedures.map((p, i) => ({ p, i })).filter(({ p }) => p.count >= PROMOTE_MIN_COUNT && projectOf(p) === undefined)
    .sort((a, b) => b.p.count - a.p.count)
    .map(({ p, i }) => ({ key: `p:${p.name}`, id: `P${i + 1}`, name: p.name, line: `- \u6d41\u7a0b「${p.name}」（${p.count} \u6b21）：${procWhen(p)}｜\u6b65\u9a5f：${procSteps(p).map((s, k) => `${k + 1}. ${s}`).join('；')}` }))
  return [...guards, ...rules, ...procedures]
}

// ：， PROMOTE_ITEMS 
export const promoteItems = (guardList: Guard[], notes: Notes, asked: Record<string, PromoteAsk>) =>
  promoteCandidates(guardList, notes).filter(c => asked[c.key] === undefined).slice(0, PROMOTE_ITEMS)

// （ asked）
export function markAsked(asked: Record<string, PromoteAsk>, items: { key: string }[], sid: string, now: number) {
  for (const c of items) asked[c.key] = { sid, at: now }
}

// （before：）；（ asked）
export function releaseAsked(asked: Record<string, PromoteAsk>, sid: string, before = Number.POSITIVE_INFINITY) {
  let changed = false
  for (const [k, a] of Object.entries(asked)) {
    if (a.sid === sid && a.at < before) { delete asked[k]; changed = true }
  }
  return changed
}

export const promoteText = (items: { key: string; line: string }[]) => [
  `${NOTE_TAG} \u4e0b\u9762\u9019\u4e9b\u505a\u6cd5\u5df2\u5728\u904e\u53bb\u7684\u5c0d\u8a71\u88e1\u88ab\u8b49\u5be6\u591a\u6b21，\u4f46\u9084\u6c92\u5beb\u9032\u9019\u500b repo。\u8acb\u5728\u9019\u4e00\u8f2a\u56de\u8986\u7d50\u675f\u524d\u8655\u7406：\u5148\u505a\u5b8c\u4f7f\u7528\u8005\u9019\u6b21\u4ea4\u4ee3\u7684\u4e8b，\u518d\u9806\u624b\u628a\u5b83\u5011\u653e\u9032 repo，\u4e0d\u7528\u5148\u554f\u4f7f\u7528\u8005；\u53ea\u6709\u4f7f\u7528\u8005\u660e\u8aaa\u6b63\u5728\u8655\u7406\u7dca\u6025\u554f\u984c\u6642\u624d\u5ef6\u5230\u4e4b\u5f8c\u7684\u56de\u5408。`,
  ...[
    '\u4f9d\u5c08\u6848\u6163\u4f8b\u9078\u4f4d\u7f6e（AGENTS.md、CLAUDE.md，\u6216\u65e2\u6709\u7684 .claude/hooks、\u5b88\u9580\u8173\u672c）。\u5148\u8b80\u73fe\u6709\u5167\u5bb9：\u5df2\u6709\u76f8\u540c\u7684\u898f\u5247\u5c31\u4e0d\u8981\u91cd\u8907\u5beb。',
    '\u5b88\u9580（\u6703\u64cb\u4e0b\u6216\u63d0\u9192\u7684\u5de5\u5177\u547c\u53eb）\u512a\u5148\u4f75\u9032\u5c08\u6848\u65e2\u6709\u7684 hook；\u5beb\u6210 hook \u6642\u5be6\u969b\u89f8\u767c\u4e00\u6b21，\u78ba\u8a8d\u6709\u6548。',
    ...(items.some(c => c.key.startsWith('p:'))
      ? ['\u6d41\u7a0b（\u591a\u500b\u6b65\u9a5f\u7684\u56fa\u5b9a\u505a\u6cd5）\u505a\u6210\u5c08\u6848\u7684 skill：\u5efa\u7acb .claude/skills/<kebab-case \u540d\u7a31>/SKILL.md，frontmatter \u6709 name（\u548c\u8cc7\u6599\u593e\u540c\u540d）\u8207 description（\u4e00\u53e5\u8a71\u8aaa\u660e\u4ec0\u9ebc\u60c5\u6cc1\u4e0b\u8a72\u7528，\u8b93\u4e4b\u5f8c\u7684\u5c0d\u8a71\u5224\u65b7\u8981\u4e0d\u8981\u8f09\u5165），\u5167\u6587\u4f9d\u5e8f\u5beb\u6b65\u9a5f，\u4fdd\u7559\u6307\u4ee4\u8207\u6a94\u540d。\u5148\u627e .claude/skills \u548c README、CONTRIBUTING、CLAUDE.md：\u5df2\u6709 skill \u6216\u6587\u4ef6\u6db5\u84cb\u540c\u4e00\u500b\u6d41\u7a0b，\u5c31\u88dc\u5145\u5b83，\u4e0d\u8981\u53e6\u958b\u91cd\u8907\u7684。']
      : []),
    '\u53ea\u6539\u6a94，\u4e0d\u8981 commit \u6216 push。',
    '\u5b8c\u6210\u5f8c\u5728\u56de\u8986\u6700\u5f8c\u7528\u4e00\u53e5\u8a71\u544a\u8a34\u4f7f\u7528\u8005\u6bcf\u689d\u653e\u5728\u54ea\u500b\u6a94\u6848（\u5beb\u51fa repo \u88e1\u7684\u8def\u5f91）；\u5df2\u7d93\u6709\u7684\u4e5f\u8aaa\u5b83\u5728\u54ea\u500b\u6a94\u6848。\u4e0d\u7528\u547c\u53eb\u4efb\u4f55\u5de5\u5177\u56de\u5831，\u80cc\u666f\u6574\u7406\u6703\u5f9e\u5c0d\u8a71\u8a18\u4e0b。',
    '\u4f7f\u7528\u8005\u8aaa\u4e0d\u8981，\u5c31\u9084\u539f\u6539\u52d5，\u4e26\u5728\u56de\u8986\u8aaa\u660e\u4f7f\u7528\u8005\u4e0d\u8981\u653e。',
  ].map((l, i) => `${i + 1}. ${l}`),
  '',
  ...items.map(c => c.line),
].join('\n')

//  repo  hook ： repo（）。
// （2026-10-14，issue #2）：AI 「 .claude/hooks/x.mjs」，，，
// ， repo  hook  ctx-handoff 。，
export const GUARD_FOUND_MIN_CHARS = 20
export function guardsFoundInRepo(guards: Guard[], files: { path: string; text: string }[]) {
  const out: { id: number; where: string }[] = []
  for (const g of guards) {
    if (g.state !== 'on' || g.project !== undefined) continue
    const message = g.message.trim()
    if (message.length < GUARD_FOUND_MIN_CHARS) continue
    const hit = files.find(f => f.text.includes(message))
    if (hit) out.push({ id: g.id, where: hit.path })
  }
  return out
}
