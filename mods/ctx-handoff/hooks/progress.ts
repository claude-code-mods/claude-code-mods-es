// ：「」。（set_progress）， $.store，
// ；，（， $； store  register.ts）
import { NOTE_TAG } from './notes'

export const PROGRESS_STATES = ['done', 'in_progress', 'blocked'] as const
export type ProgressState = (typeof PROGRESS_STATES)[number]
const STATE_LABEL: Record<ProgressState, string> = { done: '\u5b8c\u6210', in_progress: '\u9032\u884c\u4e2d', blocked: '\u5361\u4f4f\u4e86' }

// （7 ；）
export const PROGRESS_MAX_AGE_DAYS = 7
export const PROGRESS_MAX_AGE_MS = PROGRESS_MAX_AGE_DAYS * 24 * 60 * 60_000
// （），： 2026-10-09 
// （ 80–120 、 600 ），（decisions）
export const PROGRESS_TOTAL_MAX = 4000
// 「」
const OFFERED_KEEP = 5

// decisions：（、 PR ）；，
export type ProgressFields = { task: string; state: ProgressState; verified?: string; next?: string; decisions?: string[]; files: string[] }
// sid： session；handed： session  handoff （handoff ，）；
// offered： session（ compaction ）
export type Progress = ProgressFields & { sid: string; at: number; handed?: true; offered?: string[] }

export const progressKey = (workspaceKey: string) => `progress:${workspaceKey}`

export const isProgressState = (v: unknown): v is ProgressState => typeof v === 'string' && (PROGRESS_STATES as readonly string[]).includes(v)
export const stateLabel = (s: ProgressState) => STATE_LABEL[s]

export const progressSize = (p: ProgressFields) =>
  [p.task, p.verified, p.next, ...(p.decisions ?? []), ...p.files].reduce((n, s) => n + [...(s ?? '')].length, 0)

// 
export function agoText(ms: number) {
  const min = Math.round(Math.max(0, ms) / 60_000)
  if (min < 1) return '\u525b\u624d'
  if (min < 60) return `${min} \u5206\u9418\u524d`
  const hr = Math.round(min / 60)
  return hr < 24 ? `${hr} \u5c0f\u6642\u524d` : `${Math.round(hr / 24)} \u5929\u524d`
}

// （）
const bodyText = (p: ProgressFields) =>
  `\u4efb\u52d9「${p.task}」、\u72c0\u614b${STATE_LABEL[p.state]}${p.verified ? `、\u6700\u5f8c\u9a57\u8b49：${p.verified}` : ''}${p.next ? `、\u4e0b\u4e00\u6b65：${p.next}` : ''}${p.decisions?.length ? `、\u9019\u4ef6\u5de5\u4f5c\u7684\u6c7a\u5b9a：${p.decisions.join('；')}` : ''}${p.files.length ? `、\u76f8\u95dc\u6a94\u6848：${p.files.join('、')}` : ''}`

// ； undefined：
//  session （）、、、 session 
export function progressOffer(p: Progress | undefined, sid: string, now: number) {
  if (!p || p.sid === sid || p.handed || p.offered?.includes(sid) || now - p.at > PROGRESS_MAX_AGE_MS) return undefined
  return [
    `${NOTE_TAG} \u4e0a\u4e00\u6bb5\u5c0d\u8a71（${agoText(now - p.at)}）\u505c\u5728：${bodyText(p)}。`,
    '\u9019\u662f\u80cc\u666f\u6574\u7406\u7559\u4e0b\u7684\u7c21\u77ed\u5099\u5fd8，\u53ef\u80fd\u843d\u5f8c\u5e7e\u5247\u8a0a\u606f。\u4f7f\u7528\u8005\u8981\u63a5\u7e8c\u6642\u4ee5\u6b64\u70ba\u8d77\u9ede，\u52d5\u624b\u524d\u5148\u770b\u5be6\u969b\u7684\u6a94\u6848\u8207 git \u72c0\u614b；\u4f7f\u7528\u8005\u5728\u505a\u5225\u7684\u4e8b\u5c31\u5ffd\u7565，\u4e0d\u8981\u4e3b\u52d5\u63d0\u8d77。',
  ].join('\n')
}

// ： session 
export const withOffered = (p: Progress, sid: string): Progress => ({ ...p, offered: [...(p.offered ?? []), sid].slice(-OFFERED_KEEP) })

// （）
export const progressForPrompt = (p: Progress | undefined, now: number) =>
  p && now - p.at <= PROGRESS_MAX_AGE_MS ? `${agoText(now - p.at)}：${bodyText(p)}` : '（\u7121）'
