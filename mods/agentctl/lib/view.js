// What the band, `/agentctl` and `/agentctl policy|events` say (requirements FR-2, FR-3, FR-17,
// FR-23; tech spec § 3.3). Pure: every input arrives as data, every line names its source and age,
// and a field whose source did not answer says so instead of showing a value.

import { checkLine } from './firstrun.js'
import { digest } from './fingerprint.js'
import { sanitize } from './sanitize.js'

// The opaque key evidence for a declared check is stored under: arguments never become a stored
// identifier in plaintext.
export function checkKey(argv) {
  return 'check-' + digest(argv.join('\u0000'))
}

// Evidence counts as current only when the check reported no error, the tree did not change during
// the run, the run's reading matches the last one, and no reading was partial.
export function evidenceCurrent(ev, fingerprint) {
  if (!fingerprint || !ev || ev.outcome !== 'ok' || !ev.before || !ev.after) return false
  if (ev.before.value !== ev.after.value || ev.after.value !== fingerprint.value) return false
  return ![ev.coverage, ev.before.coverage, ev.after.coverage, fingerprint.coverage].includes('partial')
}

// Where the task's declared checks stand on the current tree: how many there are, how many have run
// at all, and which are not current (never run, failed, or stale).
export function checkProgress(task, evidence, fingerprint) {
  const rows = (task?.executors ?? []).filter((e) => e.check).map((e) => {
    const ev = evidence?.[checkKey(e.argv)]
    // Never shortened: the line is one Claude runs, and a cut command would not match the check.
    return { argv: sanitize(checkLine(e.argv), Infinity), ran: Boolean(ev), current: evidenceCurrent(ev, fingerprint) }
  })
  return { declared: rows.length, ran: rows.filter((r) => r.ran).length, pending: rows.filter((r) => !r.current).map((r) => r.argv) }
}

// The four states a field can be in (FR-3).
export function field(label, reading, now) {
  if (!reading) return `${label}: ausente`
  if (reading.failed) return `${label}: no disponible (${reading.failed})`
  const age = Math.max(0, Math.round((now - reading.at) / 1000))
  const stale = reading.staleAfterMs !== undefined && now - reading.at > reading.staleAfterMs
  return `${label}: ${reading.value} — ${reading.source}, hace ${age} s${stale ? ' (obsoleto)' : ''}`
}

// review-state.js check --format=json → a gate reading. A gate pass is a gate pass, never a test pass.
export function gateReading(run, at) {
  if (typeof run === 'string') return { failed: run, at }
  if (!run || run.exitCode !== 0) return { failed: `la comprobación terminó con ${run ? run.exitCode : 'sin resultado'}`, at }
  let s
  try { s = JSON.parse(run.stdout) } catch { return { failed: 'no es JSON', at } }
  const word = (p) => (!p ? '?' : p.passed ? '✅' : p.verdict === 'fail' && p.digest_match ? '⛔' : p.noted && !p.digest_match ? '⏳ stale' : p.owed ? '⏳ owed' : '·')
  return { value: `code ${word(s.code_review)} · doc ${word(s.doc_review)} · precommit ${word(s.precommit)}`, source: 'review-state.js check', at }
}

// Usage windows are read by kind; a missing window is missing, never 0%. One account's windows are
// shown for this session only and never summed with other sessions.
export function usageReading(usage, kind, at) {
  if (!usage) return null
  const w = (usage.rateLimits ?? []).find((r) => r.kind === kind)
  if (!w) return null
  return { value: `${Math.round(w.percentUsed)}%${w.resetsAt ? ` (se reinicia ${w.resetsAt})` : ''}`, source: `uso de la sesión (${w.source ?? 'host'})`, at }
}

export function contextReading(usage, at) {
  const p = usage?.context?.percent
  return typeof p === 'number' ? { value: `${Math.round(p)}%`, source: 'uso de la sesión', at } : null
}

function evidenceLines(evidence, currentFingerprint, now) {
  const out = []
  for (const ev of Object.values(evidence ?? {})) {
    const fresh = currentFingerprint && ev.after && ev.after.value === currentFingerprint.value && ev.before && ev.before.value === ev.after.value
    const state = ev.outcome === 'backgrounded' ? 'iniciada, finalización no observada'
      : ev.outcome === 'refused' ? 'refused'
      : !ev.after || !ev.before ? 'evidencia no disponible'
      : ev.before.value !== ev.after.value ? 'el árbol cambió durante la ejecución — sin vínculo'
      : fresh && [ev.coverage, ev.before.coverage, ev.after.coverage, currentFingerprint.coverage].includes('partial') ? 'coincide, pero una lectura fue parcial'
      : fresh ? 'actual'
      : 'obsoleta (el árbol cambió después)'
    const age = Math.max(0, Math.round((now - ev.at) / 1000))
    out.push(`  ${sanitize(ev.requested, 120)}: ${ev.outcome === 'ok' ? 'sin errores notificados' : ev.outcome} · ${state} · ${ev.coverage ?? 'cobertura desconocida'} · hace ${age} s`)
  }
  return out
}

const REASON_LABEL = {
  input: 'esperando tu entrada',
  permission: 'esperando una decisión de permiso',
  'policy-denied': 'rechazado por la política de la tarea',
  'rate-limit': 'límite de tasa alcanzado',
  'suspected-stall': 'sin actividad (bloqueo sin confirmar)',
}

function interventionLines(state, now) {
  return Object.entries(state.interventions ?? {}).map(([reason, v]) => {
    const age = Math.max(0, Math.round((now - v.since) / 1000))
    const detail = typeof v.detail === 'string' ? sanitize(v.detail, 120) : v.detail?.resetsAt ? `se reinicia ${v.detail.resetsAt}` : ''
    return `  ${REASON_LABEL[reason] ?? reason}${detail ? ` — ${detail}` : ''} · desde hace ${age} s`
  })
}

// Compact by default — it reaches Claude — and the diagnostic lines on `/agentctl status --details`.
// Labels say what they measure (found in a first-run test: "Observation: ok" read as "work passed").
export function statusText(m, { details = false } = {}) {
  const { now, task, state } = m
  const lines = []
  lines.push(task ? `Tarea: ${sanitize(task.goal, 120)} (${task.id})` : 'Tarea: ninguna vinculada')
  const iv = interventionLines(state, now)
  lines.push(iv.length ? 'Requiere atención:' : 'Requiere atención: nada observado')
  lines.push(...iv)
  lines.push(field('Comprobaciones de revisión', m.gate, now))
  const ev = evidenceLines(m.evidence, m.fingerprint, now)
  lines.push(ev.length ? 'Evidencia de ejecución (no es un veredicto de revisión):' : 'Evidencia de ejecución: no se ejecutó ninguna comprobación declarada')
  lines.push(...ev)
  const bg = Object.entries(state.background ?? {}).filter(([, b]) => b.status === 'started' || b.status === 'in-flight')
  if (bg.length) lines.push(`En segundo plano en curso: ${bg.length} (${bg.map(([id]) => id).join(', ')})`)
  if (!details) {
    lines.push('Más: /agentctl status --details · /agentctl help')
    return lines.join('\n')
  }
  lines.push(`Almacén de estado: ${m.health === 'ok' ? 'saludable' : m.health}`)
  lines.push(`Runtime: ${state.runtime.value}${state.runtime.tool ? ` (${state.runtime.tool})` : ''} since ${Math.max(0, Math.round((now - state.runtime.since) / 1000))}s ago · fase ${state.phase.value} · resultado ${state.result.value}`)
  // A usage reading arrives with Claude's first reply in the session; before that it is absent.
  const usage = (label, r) => (r ? field(label, r, now) : `${label}: ausente (se lee tras la primera respuesta de Claude)`)
  lines.push(usage('Contexto', m.context))
  lines.push(usage('Ventana de 5 h', m.fiveHour))
  return lines.join('\n')
}

export function bandText(m) {
  const { task, state, now } = m
  const iv = Object.keys(state.interventions ?? {})
  const attention = iv.length ? `⚠ ${iv.map((r) => REASON_LABEL[r] ?? r).join(', ')}` : 'no requiere atención'
  const head = task ? `agentctl · ${sanitize(task.goal, 40)}` : 'agentctl · sin tarea'
  const rt = `${state.runtime.value}${state.runtime.tool ? `:${state.runtime.tool}` : ''} ${Math.max(0, Math.round((now - state.runtime.since) / 1000))}s`
  let gate = 'comprobaciones ausentes'
  if (m.gate?.failed) gate = 'comprobaciones no disponibles'
  else if (m.gate) {
    const age = Math.max(0, Math.round((now - m.gate.at) / 1000))
    const stale = m.gate.staleAfterMs !== undefined && now - m.gate.at > m.gate.staleAfterMs
    gate = `${m.gate.value} (${age}s${stale ? ', obsoleto' : ''})`
  }
  const resume = m.checkpoint ? ` · última entrega ${new Date(m.checkpoint.savedAt).toISOString()}` : ''
  const proposal = m.pending ? ` · propuesta ${m.pending.digest.slice(0, 8)} en espera — /agentctl accept` : ''
  return `${head} · ${rt} · ${attention} · ${gate}${proposal}${resume}${m.health === 'ok' ? '' : ` · ${m.health}`}`
}

export const LIMITS = [
  'Este mod es un control y una vista, no un límite de aislamiento; el acceso de solo lectura a producción lo imponen las credenciales y los permisos del objetivo.',
  'Si el host omite el hook de este mod (fallo del worker, mod desactivado), nada aquí rechaza; mantén los comandos peligrosos en tus reglas permissions.deny.',
  'Las reglas nativas de permisos coinciden con el texto del comando, no con los programas; otro mod puede cambiar un veredicto en tool.check.',
  'Los ejecutores autorizados se ejecutan con sus efectos sin clasificar.',
]

export function policyText(task) {
  if (!task) return ['Ninguna tarea vinculada: las clases integradas de escritura en producción y escritura remota en git siguen rechazadas; todo lo demás va al flujo de permisos del host.', ...LIMITS].join('\n')
  const one = (x) => (Array.isArray(x) ? x.join(' ') : Array.isArray(x?.argv) ? x.argv.join(' ') + (x.check ? ' (check)' : '') : String(x))
  const fmt = (xs) => (xs?.length ? xs.map((x) => sanitize(one(x), 200)).join('; ') : 'ninguno')
  return [
    `Tarea ${task.id} · versión de política ${task.policyVersion ?? 1}`,
    ...(task.recordMissing ? ['Falta el registro de la tarea vinculada: se rechaza todo salvo las lecturas dentro del árbol de trabajo. Define la tarea de nuevo.'] : []),
    `Árbol de trabajo: ${sanitize(task.worktree, 200)}`,
    `Edits: ${(task.allow ?? []).includes('edit') ? `permitidas en ${fmt(task.editRoots ?? ['.'])}` : 'no permitidas'}`,
    `Prohibido (tarea): ${fmt(task.forbid)} · más las clases integradas de escritura en producción y escritura remota en git`,
    `Ejecutores autorizados: ${fmt(task.executors)}`,
    `Necesita una persona: ${fmt(task.needsUser)}`,
    `Otras herramientas permitidas: ${fmt(task.tools)}`,
    'Todo lo demás va al flujo de permisos del host (o modo automático): el mod no lo clasifica.',
    'En el mejor de los casos: el mod lee cada llamada a herramienta, nunca el contenido de un script ni los comandos que inicia.',
    ...LIMITS,
  ].join('\n')
}

export function eventsText(decisions, n, now) {
  const list = (decisions ?? []).slice(-n)
  if (!list.length) return 'No se registraron decisiones en esta sesión.'
  return list.map((d) => `${Math.max(0, Math.round((now - d.at) / 1000))}s ago · ${d.outcome} · ${d.tool} · ${sanitize(d.requested, 160)} · ${sanitize(d.rule, 160)}`).join('\n')
}
