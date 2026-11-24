// First run (tech spec § 3.7, 2026-10-07): parsing `/agentctl …`, the drafting request a goal
// prepares, and the copy a first-time user reads. Pure: no `$`, no I/O.
//
// Found by a user's first run of 0.2.2: every path assumed the vocabulary, so a sentence after
// `/agentctl` got the usage grammar. A goal now prepares a request for Claude in the person's own
// prompt box; nothing here sends or binds anything.

import { renderArgv } from './policy.js'

// Verbs and how many words may follow each. `task` and `events` check their own arguments.
export const VERBS = {
  status: { max: 1, args: ['--details'] },
  help: { max: 1, args: ['advanced'] },
  proposal: { max: 0 },
  accept: { max: 1 },
  discard: { max: 0 },
  task: { max: Infinity },
  policy: { max: 0 },
  events: { max: 1 },
  handoff: { max: 0 },
  last: { max: 0 },
  stop: { max: 0 },
}

function distance(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)])
  for (let j = 1; j <= b.length; j++) d[0][j] = j
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
    }
  }
  return d[a.length][b.length]
}

// What the line after `/agentctl` is: a verb (with its words), a near-miss of a verb, or a goal.
// Only a line that looks like command syntax — one ASCII word, optionally a digest or a number —
// can be a near-miss, so "test the login flow" stays a goal while "accepet ab12cd34" is corrected.
export function parseCommand(raw) {
  const text = String(raw ?? '').trim()
  if (!text) return { kind: 'status', words: [] }
  const words = text.split(/\s+/)
  const head = words[0].toLowerCase()
  if (Object.hasOwn(VERBS, head)) {
    const rest = words.slice(1)
    const v = VERBS[head]
    if (rest.length > v.max) return { kind: 'extra', verb: head, rest }
    if (v.args && rest.length && !v.args.includes(rest[0])) return { kind: 'extra', verb: head, rest }
    return { kind: 'verb', verb: head, rest }
  }
  if (/^[a-z]{3,}(\s+[0-9a-z]{1,24})?$/i.test(text)) {
    let best = null
    for (const v of Object.keys(VERBS)) {
      const d = distance(head, v)
      if (d <= 2 && (!best || d < best.d)) best = { v, d }
    }
    if (best) return { kind: 'typo', verb: best.v, words }
  }
  return { kind: 'goal', text }
}

// A limited English / Traditional Chinese copy heuristic over the goal text — not locale detection.
export function languageOf(goal) {
  return /\p{Script=Han}/u.test(String(goal ?? '')) ? 'zh' : 'en'
}

// A path for a POSIX shell, single-quoted: the only character needing care inside is `'` itself.
export function shellQuote(s) {
  return `'${String(s).replace(/'/g, `'\\''`)}'`
}

// The helper lives in the mod; `$.plugin.root` is the plugin's directory, but tolerate a root that
// points at `.claude-plugin` itself.
export function helperPath(root) {
  const r = String(root ?? '').replace(/\/+$/, '')
  return `${r.endsWith('/.claude-plugin') ? r.slice(0, -'/.claude-plugin'.length) : r}/bin/propose.mjs`
}

// The request the person sends to Claude. The goal is quoted verbatim and never truncated; the rest
// is fixed text kept short, since it becomes one ordinary model turn.
export function draftingRequest({ goal, worktree, base, root, lang }) {
  const helper = `node ${shellQuote(helperPath(root))} --worktree ${shellQuote(worktree)} --stdin`
  const baseText = base ? `"${base}"` : 'null'
  if (lang === 'zh') {
    return [
      `Redacta un alcance de tarea de agentctl para: "${goal}"`,
      `Primero ejecuta ${helper.replace(' --stdin', ' --help')} para ver los campos. Lee el proyecto y propón el alcance más estrecho (rutas de edición, comandos de comprobación, aceptación). Si algo no está claro, pregúntame y espera mi respuesta: no escribas el proposal ni añadas permisos por tu cuenta antes de que responda.`,
      `Escríbelo con ${helper} (base ${baseText}; un delimitador heredoc entre comillas que no aparezca en el JSON). Escribe solo el proposal y espera a que lo acepte.`,
    ].join('\n')
  }
  return [
    `Draft an agentctl task scope for: "${goal}"`,
    `First run ${helper.replace(' --stdin', ' --help')} for the fields. Read the project and propose the narrowest scope (edit paths, check commands, acceptance). If something is unclear, ask me and wait for my answer — write no proposal before it, and never invent permissions.`,
    `Write it with ${helper} (base ${baseText}; a quoted heredoc delimiter that does not occur in the JSON). Write the proposal only, then wait for me to accept.`,
  ].join('\n')
}

const COPY = {
  en: {
    filled: (bound) => `A request for Claude to draft the scope is in your prompt box — press Enter to send it. ${bound ? 'The current task stays in force until you accept the new scope.' : 'Nothing is bound yet.'}`,
    mixed: (bound) => `The request was added after text you typed meanwhile; both are in your prompt box. Edit it before you press Enter. ${bound ? 'The current task stays in force until you accept the new scope.' : 'Nothing is bound yet.'}`,
    copy: (bound) => `Send this to Claude to have it draft the scope (${bound ? 'the current task stays in force until you accept the new one' : 'nothing is bound yet'}):`,
    typo: (v) => `Did you mean "/agentctl ${v}"? To start a task, describe it: /agentctl <what you are doing>`,
    extra: (v) => `"/agentctl ${v}" takes no such arguments. ${v === 'proposal' ? 'It shows a waiting draft; to make one, describe the work: /agentctl <what you are doing>' : 'See /agentctl help.'}`,
    acceptLine: (d) => `Accept this scope: /agentctl accept ${d} — it binds the scope only; it does not start any work.`,
    accepted: 'Scope bound. Next: ask Claude to start the work.',
    runChecks: (checks) => `To leave evidence, run each check as written: ${checks.join(' · ')} — a pipe, redirect or wrapper keeps a run from counting, and added arguments may check less than declared.`,
    wholeScope: '/agentctl policy shows the whole scope.',
    noTaskLast: 'No task is bound, so there is no hand-over yet. Start one: /agentctl <what you are doing>',
    noHandover: 'This task has no saved hand-over yet: /agentctl handoff saves one.',
    next: {
      none: 'Next: describe the work — /agentctl <what you are doing>. Built-in refusals (direct git push, production writes) apply even now.',
      proposal: (d) => `Next: review /agentctl proposal, then /agentctl accept ${d}`,
      task: 'Next: ask Claude to work; /agentctl handoff saves where things stand.',
      taskThenChecks: (checks) => `Next: ask Claude to work, then to run the checks exactly as written: ${checks.join(' · ')}. Once they are current: /agentctl handoff`,
      rerun: (checks) => `Next: not current on this tree — ask Claude to run exactly as written: ${checks.join(' · ')}. Then: /agentctl handoff`,
      checksCurrent: 'Next: every declared check is current on this tree — /agentctl handoff saves the hand-over.',
    },
  },
  zh: {
    filled: (bound) => `Hay una solicitud para que Claude redacte el alcance en tu campo de prompt: pulsa Enter para enviarla. ${bound ? 'La tarea actual sigue vigente hasta que aceptes el nuevo alcance.' : 'Aún no hay nada vinculado.'}`,
    mixed: (bound) => `La solicitud se añadió después del texto que escribiste; ambos están en el campo. Edítalo antes de pulsar Enter. ${bound ? 'La tarea actual sigue vigente hasta que aceptes el nuevo alcance.' : 'Aún no hay nada vinculado.'}`,
    copy: (bound) => `Envía esto a Claude para que redacte el alcance (${bound ? 'la tarea actual sigue vigente hasta que aceptes la nueva' : 'nada está vinculado aún'}):`,
    typo: (v) => `¿Querías decir "/agentctl ${v}"? Para iniciar una tarea, descríbela: /agentctl <lo que estás haciendo>`,
    extra: (v) => `"/agentctl ${v}" no acepta estos argumentos. ${v === 'proposal' ? 'Muestra un borrador en espera; para crear uno, describe el trabajo: /agentctl <lo que estás haciendo>' : 'Consulta /agentctl help.'}`,
    acceptLine: (d) => `Acepta este alcance: /agentctl accept ${d} — solo vincula el alcance; no inicia ningún trabajo.`,
    accepted: 'Alcance vinculado. Siguiente: pide a Claude que empiece el trabajo.',
    runChecks: (checks) => `Para dejar evidencia, ejecuta cada comprobación tal como está escrita: ${checks.join(' · ')} — una tubería, redirección o envoltorio hace que no cuente, y añadir argumentos puede comprobar menos de lo declarado.`,
    wholeScope: '/agentctl policy muestra el alcance completo.',
    noTaskLast: 'No hay ninguna tarea vinculada, así que aún no hay entrega. Inicia una: /agentctl <lo que estás haciendo>',
    noHandover: 'Esta tarea aún no tiene entrega guardada: /agentctl handoff guarda una.',
    next: {
      none: 'Siguiente: describe el trabajo — /agentctl <lo que estás haciendo>. Las negativas integradas (git push directo, escrituras en producción) se aplican ya.',
      proposal: (d) => `Siguiente: revisa /agentctl proposal y luego /agentctl accept ${d}`,
      task: 'Siguiente: pide a Claude que trabaje; /agentctl handoff guarda el estado.',
      taskThenChecks: (checks) => `Siguiente: pide a Claude que trabaje y ejecute las comprobaciones tal como están escritas: ${checks.join(' · ')}. Cuando estén actualizadas: /agentctl handoff`,
      rerun: (checks) => `Siguiente: no está actualizado en este árbol — pide a Claude ejecutar tal como está escrito: ${checks.join(' · ')}. Luego: /agentctl handoff`,
      checksCurrent: 'Siguiente: todas las comprobaciones declaradas están actualizadas en este árbol — /agentctl handoff guarda la entrega.',
    },
  },
}

export function copy(lang) {
  return COPY[lang === 'zh' ? 'zh' : 'en']
}

// A check as a line Claude can run as written: quoted so it reads back as the declared argv, never
// shortened. An argv no quoting can carry is shown as its JSON array instead, which says to run it as
// those words.
export function checkLine(argv) {
  return renderArgv(argv) ?? `${JSON.stringify(argv)} (as these words)`
}

// The task's declared checks, as the command lines Claude must run as written.
export function checkArgv(task) {
  return (task?.executors ?? []).filter((e) => e.check).map((e) => checkLine(e.argv))
}

// The next step for a bound task, from where its declared checks stand (`checkProgress` in view.js).
// Found in an uncoached run: with the work done, "ask Claude to start" was still the next step.
export function nextForTask(t, progress) {
  if (!progress.declared) return t.next.task
  if (!progress.pending.length) return t.next.checksCurrent
  return progress.ran ? t.next.rerun(progress.pending) : t.next.taskThenChecks(progress.pending)
}

export function helpText(lang, advanced) {
  if (lang === 'zh') {
    return advanced ? [
      '\u9032\u968e：',
      '  /agentctl task show | set <json> | clear — \u76f4\u63a5\u6aa2\u8996\u6216\u8a2d\u5b9a\u4efb\u52d9',
      '  /agentctl policy — \u76ee\u524d\u7bc4\u570d\u8207\u9650\u5236',
      '  /agentctl events [n] — \u6700\u8fd1\u7684\u62d2\u7d55\u8207\u4ea4\u7d66 host \u7684\u547c\u53eb',
      '  /agentctl handoff · last — \u5b58\u4e0b\u4ea4\u63a5 · \u986f\u793a\u4e0a\u6b21\u7684\u4ea4\u63a5',
      '  /agentctl stop — \u53d6\u6d88\u76ee\u524d\u56de\u5408\u4e26\u5b58\u4e0b\u4ea4\u63a5',
      '  /agentctl status --details · discard — \u5b8c\u6574\u72c0\u614b · \u4e1f\u68c4\u8349\u7a3f',
    ].join('\n') : [
      'agentctl \u8b93 Claude \u5728\u4f60\u78ba\u8a8d\u7684\u7bc4\u570d\u5167\u5de5\u4f5c，\u4e26\u8a18\u9304\u6aa2\u67e5\u8b49\u64da。',
      '  /agentctl <\u4f60\u8981\u505a\u7684\u4e8b> — Claude \u8d77\u8349\u7bc4\u570d（\u4e0d\u6703\u7d81\u5b9a）',
      '  /agentctl accept <digest> — \u4f60\u78ba\u8a8d\u7bc4\u570d（\u4e0d\u6703\u958b\u59cb\u5de5\u4f5c）',
      '  /agentctl — \u76ee\u524d\u72c0\u614b\u8207\u4e0b\u4e00\u6b65',
      '\u66f4\u591a：/agentctl help advanced',
    ].join('\n')
  }
  return advanced ? [
    'Advanced:',
    '  /agentctl task show | set <json> | clear — view or set the task directly',
    '  /agentctl policy — the scope in force and its limits',
    '  /agentctl events [n] — recent refusals and calls left to the host',
    '  /agentctl handoff · last — save a hand-over · show the last one',
    '  /agentctl stop — cancel the turn and save a hand-over',
    '  /agentctl status --details · discard — full status · drop a draft',
  ].join('\n') : [
    'agentctl keeps Claude inside a scope you confirm and records check evidence.',
    '  /agentctl <what you are doing> — Claude drafts a scope (binds nothing)',
    '  /agentctl accept <digest> — you confirm it (starts no work)',
    '  /agentctl — where things stand and what to do next',
    'More: /agentctl help advanced',
  ].join('\n')
}

// What the box should suggest while a proposal waits (found live on 2.1.292: the host's own guess —
// "\u78ba\u8a8d" — took the box, so Tab + Enter sent that word to Claude instead of accepting). Only the
// host's own guess is replaced, and only while a proposal is waiting; a plugin's suggestion, ours
// included, passes unchanged.
export function suggestionWhileWaiting(originKind, pendingDigest) {
  return originKind === 'suggestion' && pendingDigest ? `/agentctl accept ${String(pendingDigest).slice(0, 8)}` : null
}
