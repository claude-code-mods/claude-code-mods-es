//  process  register.ts （； $.state）。， $
import type { Timer } from 'claude-code'
import type { Change } from './notes'
import { freshWork } from './loops'
import type { Streak, Work } from './loops'
import { freshReply } from './lang'
import type { ReplyLang, ReplyState } from './lang'

export const rt = {
  distillTask: undefined as { sid: string; why: string; at: number } | undefined,
  handoffTask: undefined as { sid: string; phase: 'refresh' | 'generating' | 'submitting'; at: number } | undefined,
  idle: undefined as Timer | undefined,
  refreshes: 0,
  // ： handoff（）
  busy: false,
  activity: 0,
  // （ /handoff now）：，
  presenting: false,
  held: [] as string[],
  // （undefined＝），
  presentStartedAt: undefined as number | undefined,
  // ： session id ，
  pendingNotes: new Map<string, { changes: Change[]; file: string }>(),
  //  process 、 handoff（ session id）
  myPending: undefined as { sid: string } | undefined,
  pendingToasted: false,
  //  process  handoff，/handoff resend 
  lastHandoff: undefined as { text: string } | undefined,
  retryAfter: undefined as { turns: number; at: number } | undefined,
  // classic.Stop ；deferral  handoff 
  snapshot: undefined as { tasks: number; oneShot: number; recurring: number } | undefined,
  deferral: undefined as string | undefined,
  deferToasted: false,
  seenKnown: new Set<string>(),
  distilling: false,
  //  resolve：
  distillDone: undefined as Promise<void> | undefined,
  // （writeStat ，）
  statQueue: Promise.resolve() as Promise<void>,
  // （）， /handoff distill 
  distillFailed: false,
  // ： session root （ root ）
  workspaceCache: undefined as { root: string; dir: string } | undefined,
  // ：（）
  langReady: undefined as Promise<void> | undefined,
  // ：，／。，
  streaks: new Map<string, Streak>(),
  work: freshWork() as Work,
  // ：（undefined＝；{ lang: undefined }＝）。，
  replyTarget: undefined as { lang: ReplyLang | undefined } | undefined,
  reply: freshReply() as ReplyState,
  //  handoff  session（）：，
  handed: new Set<string>(),
}

// （）
export function resetRuntime() {
  rt.distillTask = undefined
  rt.handoffTask = undefined
  rt.idle?.cancel()
  rt.idle = undefined
  rt.refreshes = 0
  rt.busy = false
  rt.activity = 0
  rt.presenting = false
  rt.held = []
  rt.presentStartedAt = undefined
  rt.pendingNotes.clear()
  rt.myPending = undefined
  rt.pendingToasted = false
  rt.lastHandoff = undefined
  rt.retryAfter = undefined
  rt.snapshot = undefined
  rt.deferral = undefined
  rt.deferToasted = false
  rt.seenKnown.clear()
  rt.distilling = false
  rt.distillDone = undefined
  rt.statQueue = Promise.resolve()
  rt.distillFailed = false
  rt.workspaceCache = undefined
  rt.langReady = undefined
  rt.streaks.clear()
  rt.work = freshWork()
  rt.replyTarget = undefined
  rt.reply = freshReply()
  rt.handed.clear()
}
