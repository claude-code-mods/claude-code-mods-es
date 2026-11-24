// （ $）：、。
//  runtime.ts  rt（；，）
import { tag } from './notes'

// ---------- A： ----------

export type Streak = { sig: string; count: number }

const MAX_SIG = 200
// （，）
const ANSI = new RegExp(String.raw`${String.fromCharCode(27)}\[[0-9;]*[A-Za-z]`, 'g')
const MAX_STREAKS = 200
// 「」，
const USER_STOP = /doesn't want to proceed|user rejected|interrupted by user|request interrupted|user denied/i

// ：、、（、、id）， 200 
export function failureSignature(text: string | undefined): string {
  return (text ?? '')
    .replace(ANSI, '')
    .replace(/[A-Za-z]:[\\/][^\s'"`)>\]]*/g, '<p>')
    .replace(/(?:\.{0,2}\/)?(?:[\w.@~-]+\/)+[\w.@~-]*/g, '<p>')
    .replace(/\d+/g, '#')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_SIG)
}

// ：， 80 
const briefOf = (text: string | undefined) => {
  const line = (text ?? '').split('\n').map(l => l.trim()).find(Boolean) ?? ''
  return line.length > 80 ? `${line.slice(0, 80)}…` : line
}

export const retryNudgeText = (tool: string, text: string | undefined) => {
  const sample = briefOf(text) || '\u6c92\u6709\u932f\u8aa4\u6587\u5b57'
  if (tool === 'Edit' || tool === 'MultiEdit')
    return `${tag} ${tool} \u9023\u7e8c\u5169\u6b21\u56e0\u540c\u6a23\u539f\u56e0\u5931\u6557（${sample}）。\u8acb\u52ff\u6191\u8a18\u61b6\u8de8\u6a94\u76f2\u731c\u7e2e\u6392\u6216\u4e0a\u4e0b\u6587：\u5148\u7528 Grep (rg -F) \u6216 Read (\u6307\u5b9a offset/limit) \u78ba\u8a8d\u7cbe\u78ba\u884c\u865f\u8207\u539f\u6587；\u82e5\u70ba\u591a\u8655\u66ff\u63db\u8acb\u6539\u7528 node ~/.claude/tools/safe-replace.mjs。`
  if (tool === 'Read')
    return `${tag} Read \u9023\u7e8c\u5169\u6b21\u5931\u6557（${sample}）。\u8acb\u52ff\u7e7c\u7e8c\u731c\u6e2c\u8def\u5f91，\u5148\u7528 Glob \u641c\u5c0b\u6a94\u540d\u6216\u78ba\u8a8d\u7236\u76ee\u9304。`
  return `${tag} \u9019\u500b\u5de5\u5177（${tool}）\u9023\u7e8c\u5169\u6b21\u56e0\u540c\u6a23\u539f\u56e0\u5931\u6557（${sample}）。\u932f\u8aa4\u770b\u8d77\u4f86\u662f\u66ab\u6642\u6027\u7684（\u903e\u6642、\u9084\u5728\u8f09\u5165、\u9023\u7dda\u4e2d\u65b7）\u5c31\u7a0d\u7b49\u518d\u8a66\u4e00\u6b21；\u4e0d\u662f\u7684\u8a71\u5148\u627e\u51fa\u539f\u56e0\u4e26\u63db\u4e00\u500b\u505a\u6cd5，\u4e0d\u8981\u539f\u6a23\u91cd\u8a66。`
}

// ； 2  4 。
// key：＋；
export function trackFailure(streaks: Map<string, Streak>, key: string, tool: string, isError: boolean, text: string | undefined): string | undefined {
  if (!isError) { streaks.delete(key); return undefined }
  if (USER_STOP.test(text ?? '')) { streaks.delete(key); return undefined }
  const sig = failureSignature(text)
  const prev = streaks.get(key)
  if (!prev || prev.sig !== sig) {
    // ；
    if (!prev && streaks.size >= MAX_STREAKS) streaks.clear()
    streaks.set(key, { sig, count: 1 })
    return undefined
  }
  prev.count += 1
  if (prev.count !== 2 && prev.count !== 4) return undefined
  return retryNudgeText(tool, text)
}

// ---------- B：， ----------

// ：seq ；lastEdit／lastCheck ／（0＝）；checkFailed 
export type Work = { seq: number; lastEdit: number; lastCheck: number; checkFailed: boolean; reminded: boolean }
export const freshWork = (): Work => ({ seq: 0, lastEdit: 0, lastCheck: 0, checkFailed: false, reminded: false })

const EDIT_TOOLS = new Set(['Edit', 'Write', 'MultiEdit', 'NotebookEdit'])
//  scratchpad 
const DOC_FILE = /\.(md|mdx|txt|rst|adoc)$/i
const SCRATCH_PATH = /(?:^|[\\/])scratchpad[\\/]/i
// ，
const NOT_RUNNING = new Set(['ls', 'cat', 'echo', 'grep', 'rg', 'find', 'head', 'tail', 'git', 'cd', 'mkdir', 'rm', 'cp', 'mv', 'sed', 'awk', 'type', 'wc', 'diff', 'open', 'pwd', 'which', 'printf'])
const CHECK_WORDS = /\b(tests?|pytest|unittest|jest|vitest|mocha|rspec|phpunit|tsc|typecheck|lint|eslint|biome|ruff|mypy|pyright|flake8|clippy|check|build|compile|verify|validate|vet)\b/i

//  Bash／PowerShell 、（）
export function isCheckCommand(command: string | undefined): boolean {
  return (command ?? '').split(/&&|\|\||;|\||\n/).some(seg => {
    const words = seg.trim().split(/\s+/)
    const first = (words[0] ?? '').replace(/^.*[\\/]/, '').toLowerCase()
    return first !== '' && !NOT_RUNNING.has(first) && CHECK_WORDS.test(seg)
  })
}

type CallInput = Record<string, unknown>

// 「」。failed：（； checkFailed，）
export function noteCall(work: Work, tool: string, input: CallInput, failed: boolean) {
  work.seq += 1
  if (EDIT_TOOLS.has(tool)) {
    if (failed) return
    const file = [input.file_path, input.notebook_path, input.path].find((p): p is string => typeof p === 'string')
    if (file && (DOC_FILE.test(file) || SCRATCH_PATH.test(file))) return
    work.lastEdit = work.seq
    work.checkFailed = false
  } else if ((tool === 'Bash' || tool === 'PowerShell') && typeof input.command === 'string' && isCheckCommand(input.command)) {
    if (failed) {
      work.checkFailed = true
    } else {
      work.lastCheck = work.seq
      work.checkFailed = false
    }
  }
}

// 「」：，（／／／）
const CLAIM = /(?<![\u672a\u6c92\u4e0d\u5c1a])(\u5b8c\u6210\u4e86|\u5df2\u5b8c\u6210|\u5df2\u7d93\u5b8c\u6210|\u505a\u597d\u4e86|\u90fd\u597d\u4e86|\u5df2\u4fee\u597d|\u4fee\u597d\u4e86|\u5df2\u7d93\u4fee\u597d|\u641e\u5b9a\u4e86?|\u5168\u90e8\u5b8c\u6210|\u90fd\u8655\u7406\u597d\u4e86)|\b(all done|all set|i(?:'ve| have) (?:finished|completed|fixed)|(?:is|are|now|it's) (?:done|fixed|complete(?:d)?|finished)|fixed it|everything (?:is )?(?:done|working|fixed))\b/i
// ，
const HONEST = /\u6c92\u6709?(?:\u8dd1|\u57f7\u884c|\u505a)?(?:\u9a57\u8b49|\u6e2c\u8a66|\u6aa2\u67e5)|\u672a(?:\u7d93)?(?:\u9a57\u8b49|\u6e2c\u8a66)|\u7121\u6cd5(?:\u9a57\u8b49|\u6e2c\u8a66)|\u6c92\u8fa6\u6cd5(?:\u9a57\u8b49|\u6e2c\u8a66)|(?:\u6e2c\u8a66|\u9a57\u8b49|\u6aa2\u67e5|\u7de8\u8b6f)(?:\u5931\u6557|\u672a\u901a\u904e|\u672a\u904e|\u6c92\u904e)|not (?:been )?(?:tested|verified)|couldn't (?:run|verify|test)|could not (?:run|verify|test)|unable to (?:run|verify|test)|haven't (?:run|tested|verified)|(?:tests?|checks?|build) failed/i

export function claimsDone(message: string | undefined): boolean {
  const text = (message ?? '').trim()
  if (!text || /[?？]$/.test(text)) return false
  const ends = text.length <= 600 ? text : `${text.slice(0, 200)}\n${text.slice(-400)}`
  return CLAIM.test(ends) && !HONEST.test(ends)
}

export const doneCheckText = (checkFailed = false) =>
  checkFailed
    ? `${tag} \u4f60\u8aaa\u5b8c\u6210\u4e86，\u4f46\u9019\u4e00\u8f2a\u6539\u6a94\u5f8c\u7684\u6e2c\u8a66\u6216\u6aa2\u67e5\u6c92\u6709\u901a\u904e。\u8acb\u4fee\u597d\u554f\u984c\u4e26\u91cd\u65b0\u8dd1\u904e\u6e2c\u8a66\u6216\u6aa2\u67e5，\u5728\u56de\u8986\u9644\u4e0a\u7d50\u679c；\u82e5\u7121\u6cd5\u4fee\u597d\u6216\u8207\u9019\u6b21\u6539\u52d5\u7121\u95dc，\u8acb\u5728\u56de\u8986\u8aa0\u5be6\u8aaa\u660e\u5931\u6557\u539f\u56e0，\u4e0d\u8981\u76f4\u63a5\u8aaa\u5b8c\u6210。\u6536\u5c3e\u6642\u8acb\u660e\u78ba\u6a19\u793a\u56db\u7d1a\u72c0\u614b\u4e4b\u4e00：[\u5df2\u5b8c\u6210\u4e14\u5df2\u5be6\u6e2c]、[\u5df2\u90e8\u7f72\u4f46\u5f85\u6b63\u5f0f\u9a57\u6536]、[\u5df2\u4fee\u6539\u4f46\u672a\u5be6\u6e2c（\u9644\u539f\u56e0）]、[\u5f85\u4f60\u62cd\u677f]。`
    : `${tag} \u4f60\u8aaa\u5b8c\u6210\u4e86，\u4f46\u9019\u4e00\u8f2a\u6539\u4e86\u6a94\u6848\u4e4b\u5f8c\u6c92\u6709\u8dd1\u4efb\u4f55\u6e2c\u8a66\u6216\u6aa2\u67e5。\u8acb\u8dd1\u548c\u9019\u6b21\u6539\u52d5\u76f8\u95dc\u7684\u6e2c\u8a66\u6216\u6aa2\u67e5，\u5728\u56de\u8986\u9644\u4e0a\u8dd1\u4e86\u4ec0\u9ebc、\u7d50\u679c\u5982\u4f55；\u6c92\u8fa6\u6cd5\u9a57\u8b49\u7684，\u8aaa\u660e\u54ea\u4e9b\u6c92\u9a57\u8b49、\u70ba\u4ec0\u9ebc，\u4e0d\u8981\u8aaa\u5b8c\u6210。\u6536\u5c3e\u6642\u8acb\u660e\u78ba\u6a19\u793a\u56db\u7d1a\u72c0\u614b\u4e4b\u4e00：[\u5df2\u5b8c\u6210\u4e14\u5df2\u5be6\u6e2c]、[\u5df2\u90e8\u7f72\u4f46\u5f85\u6b63\u5f0f\u9a57\u6536]、[\u5df2\u4fee\u6539\u4f46\u672a\u5be6\u6e2c（\u9644\u539f\u56e0）]、[\u5f85\u4f60\u62cd\u677f]。`

// 、。；stopHookActive＝ hook 
export function doneCheck(work: Work, message: string | undefined, stopHookActive: boolean): string | undefined {
  if (work.reminded || stopHookActive) return undefined
  if (work.lastEdit === 0 || (work.lastCheck > work.lastEdit && !work.checkFailed)) return undefined
  if (!claimsDone(message)) return undefined
  work.reminded = true
  return doneCheckText(work.checkFailed)
}
