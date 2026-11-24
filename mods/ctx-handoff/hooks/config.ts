// 、、，（， $； register.ts）
import type { Lang } from './i18n'
import { REPLY_LANG_SETTINGS } from './lang'
import type { ReplyLangSetting } from './lang'

// ：「」， $.store  settings（）；
// settings.json  pluginConfigs["ctx-handoff@<marketplace>"].options ，。
//  userConfig：/config （ 2026-10-08 ）。、、
type Config = {
  //  handoff：，context  min(threshold,  × windowRatio)  handoff → /clear → ；
  // ， Claude Code  compact（ 2026-10-14 ）
  autoHandoff: boolean; threshold: number; windowRatio: number
  // 1 ： idleMs ， maxRefresh ， handoff
  idleMs: number; maxRefresh: number
  //  context ，、 handoff 
  minTokens: number
  // （）
  distillEvery: number
  // ：，（ Sonnet 5.5）
  notesModel: string
  // （、toast、、、）：auto  Claude Code  language ，
  language: 'auto' | Lang
  // ：；
  retryNudge: boolean; doneCheck: boolean
  // ：Claude ，（auto  Claude Code  language ）
  replyLanguage: ReplyLangSetting
  // （）
  resumeHint: boolean
  // （）， /handoff resume 
  awayHandoff: boolean
}

// ：、（ step，）
export type SettingSpec =
  | { key: string; kind: 'num'; min: number; max: number; step: number; d: number }
  | { key: string; kind: 'bool'; d: boolean }
  | { key: string; kind: 'choice'; options: readonly string[]; d: string; free?: boolean }
export const SETTINGS: readonly SettingSpec[] = [
  { key: 'auto_handoff', kind: 'bool', d: false },
  { key: 'threshold', kind: 'num', min: 50_000, max: 2_000_000, step: 50_000, d: 600_000 },
  { key: 'window_ratio', kind: 'num', min: 0.3, max: 0.95, step: 0.05, d: 0.8 },
  { key: 'idle_minutes', kind: 'num', min: 5, max: 59, step: 5, d: 50 },
  { key: 'max_refresh', kind: 'num', min: 0, max: 10, step: 1, d: 3 },
  { key: 'min_tokens', kind: 'num', min: 0, max: 500_000, step: 10_000, d: 30_000 },
  { key: 'distill_every', kind: 'num', min: 5, max: 200, step: 5, d: 30 },
  // free：settings.json ；
  { key: 'notes_model', kind: 'choice', options: ['claude-sonnet-5-5', 'claude-opus-5-5'], d: 'claude-sonnet-5-5', free: true },
  { key: 'language', kind: 'choice', options: ['auto', 'zh-TW', 'en'], d: 'auto' },
  { key: 'reply_language', kind: 'choice', options: REPLY_LANG_SETTINGS, d: 'auto' },
  { key: 'retry_nudge', kind: 'bool', d: true },
  { key: 'done_check', kind: 'bool', d: true },
  { key: 'resume_hint', kind: 'bool', d: true },
  { key: 'away_handoff', kind: 'bool', d: true },
]
export const specOf = (key: string) => SETTINGS.find(s => s.key === key)

// ：，
export function settingValue(spec: SettingSpec, v: unknown): number | boolean | string {
  if (spec.kind === 'num') return typeof v === 'number' && Number.isFinite(v) ? Math.min(spec.max, Math.max(spec.min, v)) : spec.d
  if (spec.kind === 'bool') return typeof v === 'boolean' ? v : spec.d
  if (spec.free) return typeof v === 'string' && v.trim() ? v.trim() : spec.d
  return typeof v === 'string' && spec.options.includes(v) ? v : spec.d
}

// ： step（），，（）
export function stepSetting(spec: SettingSpec, now: unknown, dir: 1 | -1) {
  const v = settingValue(spec, now)
  if (spec.kind === 'num') return settingValue(spec, Math.round(((v as number) + dir * spec.step) * 100) / 100)
  if (spec.kind === 'bool') return !v
  const i = spec.options.indexOf(v as string)
  return spec.options[(i + dir + spec.options.length) % spec.options.length] as string
}

// ：（store）、settings.json，
export const settingSource = (key: string, panel: Record<string, unknown>, options: Record<string, unknown>) =>
  panel[key] !== undefined ? 'panel' : options[key] !== undefined ? 'file' : 'default'

const CONFIG_DEFAULTS: Config = {
  autoHandoff: false, threshold: 600_000, windowRatio: 0.8, idleMs: 50 * 60_000, maxRefresh: 3, minTokens: 30_000, distillEvery: 30,
  notesModel: 'claude-sonnet-5-5', language: 'auto', retryNudge: true, doneCheck: true, replyLanguage: 'auto', resumeHint: true,
  awayHandoff: true,
}
// ：、， import 
export const cfg: Config = { ...CONFIG_DEFAULTS }
export const resetConfig = () => { Object.assign(cfg, CONFIG_DEFAULTS) }

export const KEEP = 5
// fork ：（、），
// 2026-10-09 ， 45–120 （ 25–50 ），3 
export const HANDOFF_TIMEOUT_MS = 5 * 60_000
export const DISTILL_TIMEOUT_MS = 8 * 60_000
export const DISTILL_EFFORT = 'low'
export const DISTILL_MAX_TOKENS = 32_000
export const GUARD_MAX_TOKENS = 4_000
//  handoff ， 3  10 
export const RETRY_TURNS = 3
export const RETRY_MS = 10 * 60_000
//  handoff；
export const DEFER_CAP_EXTRA = 150_000
export const DEFER_CAP_RATIO = 0.9
export const STOPPED = new Set(['completed', 'failed', 'killed', 'stopped', 'cancelled', 'canceled', 'error'])
// ：（TTL 60 、 55 ）
export const RELOAD_GRACE_MS = 5 * 60_000

export const thresholdOf = (window: number) => Math.min(cfg.threshold, Math.floor(window * cfg.windowRatio))

// settings.json  pluginConfigs  plugin  options（key  "ctx-handoff@<marketplace>"）
export function optionsOf(all: Record<string, { options?: Record<string, unknown> }> | undefined) {
  const id = Object.keys(all ?? {}).find(k => k.startsWith('ctx-handoff@'))
  return (id && all?.[id]?.options) || {}
}

// ， settings.json， SETTINGS 
export function resolveConfig(options: Record<string, unknown>, panel: Record<string, unknown> = {}): Config {
  const get = (key: string) => {
    const spec = specOf(key)
    if (!spec) throw new Error(`unknown setting ${key}`)
    return settingValue(spec, panel[key] ?? options[key])
  }
  return {
    autoHandoff: get('auto_handoff') as boolean,
    threshold: get('threshold') as number,
    windowRatio: get('window_ratio') as number,
    idleMs: (get('idle_minutes') as number) * 60_000,
    maxRefresh: Math.round(get('max_refresh') as number),
    minTokens: get('min_tokens') as number,
    distillEvery: Math.round(get('distill_every') as number),
    notesModel: get('notes_model') as string,
    language: get('language') as Config['language'],
    retryNudge: get('retry_nudge') as boolean,
    doneCheck: get('done_check') as boolean,
    replyLanguage: get('reply_language') as ReplyLangSetting,
    resumeHint: get('resume_hint') as boolean,
    awayHandoff: get('away_handoff') as boolean,
  }
}
