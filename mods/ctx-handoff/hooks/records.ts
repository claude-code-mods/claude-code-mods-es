// store （、）、，（， $）
import { t } from './i18n'
import type { Rejected } from './distill'
import type { Change } from './notes'

export type Kind = 'present' | 'away' | 'manual' | 'dry'
export type Usage = { input: number; cacheRead: number; cacheCreation: number; output: number; ms: number }
export type Saved = { at: number; sessionId: string; kind: Kind; tokens: number | null; text: string; usage?: Usage }

export function describeUsage(u: Usage) {
  const total = u.input + u.cacheRead + u.cacheCreation
  const ratio = total === 0 ? 0 : (u.cacheRead / total) * 100
  const n = (v: number) => v.toLocaleString('en-US')
  return t().usage(n(total), n(u.cacheRead), ratio.toFixed(2), n(u.cacheCreation), n(u.input), n(u.output), (u.ms / 1000).toFixed(1))
}
export type Away = { handoff: string; held?: string }
export type PendingSubmit = { text: string; project: string }
// ：kind  handoff ，reason 
export type HandoffError = { at: number; sessionId: string; kind: Kind; reason: string; tokens: number | null; turns: number }

export const awayKey = (sessionId: string) => `away:${sessionId}`
export const pendingKey = (sessionId: string) => `pendingSubmit:${sessionId}`

export type DistillLast = { at: number; why: string; changes: Change[]; file: string; usage: string; rejected?: Rejected }
export type DistillError = { at: number; why: string; reason: string }

//  session （）： seen， 30 
const PRUNE_MS = 30 * 24 * 60 * 60_000
const isSessionKey = (k: string) => /^(?:distill|away|last|pendingSubmit|stats:session):[^:]+$/.test(k)

//  seen（），（ seen ）
export function pruneSeen(keys: readonly string[], seen: Record<string, number>, now: number) {
  let changed = false
  const expired: string[] = []
  for (const k of keys) {
    if (isSessionKey(k) && seen[k] === undefined) { seen[k] = now; changed = true }
  }
  for (const [k, at] of Object.entries(seen)) {
    if (now - at <= PRUNE_MS) continue
    expired.push(k)
    delete seen[k]
    changed = true
  }
  return { changed, expired }
}

// （docs/north-star.md ）：，、。
// counts：；failures：；hits：（，）
export type StatEvent = { at: number; what: string; detail: string }
export type BackgroundUsage = { since: number; project: string; usage: Usage; unknownResults: number }
export type Stats = { since: number; counts: Record<string, number>; failures: StatEvent[]; hits: StatEvent[]; background?: BackgroundUsage }

export function addBackgroundUsage(prev: Stats | undefined, now: number, project: string, usage?: Usage): Stats {
  const base = prev ?? { since: now, counts: {}, failures: [], hits: [] }
  const background = base.background ?? { since: now, project, usage: { input: 0, cacheRead: 0, cacheCreation: 0, output: 0, ms: 0 }, unknownResults: 0 }
  return { ...base, background: { ...background, usage: usage ? {
    input: background.usage.input + usage.input,
    cacheRead: background.usage.cacheRead + usage.cacheRead,
    cacheCreation: background.usage.cacheCreation + usage.cacheCreation,
    output: background.usage.output + usage.output,
    ms: background.usage.ms + usage.ms,
  } : background.usage, unknownResults: background.unknownResults + (usage ? 0 : 1) } }
}
// ，
export const STATS_RECENT = 20
export const STATS_DETAIL_MAX = 200
export const statsKey = (projectKey: string) => `stats:${projectKey}`

export function addStat(prev: Stats | undefined, now: number, what: string, n = 1, event?: { failure?: string; hit?: string }): Stats {
  const s: Stats = prev ?? { since: now, counts: {}, failures: [], hits: [] }
  const push = (list: StatEvent[], detail: string) => [...list, { at: now, what, detail: detail.slice(0, STATS_DETAIL_MAX) }].slice(-STATS_RECENT)
  return {
    since: s.since,
    counts: { ...s.counts, [what]: (s.counts[what] ?? 0) + n },
    failures: event?.failure === undefined ? s.failures : push(s.failures, event.failure),
    hits: event?.hit === undefined ? s.hits : push(s.hits, event.hit),
  }
}
