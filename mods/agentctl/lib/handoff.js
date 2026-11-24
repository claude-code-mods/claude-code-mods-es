// Model-free hand-over (requirements FR-15, UC-6; tech spec § 3.4). Pure: built only from records.
// It answers the eight questions and keeps three sources apart: what the user confirmed (the task),
// what tools observed (operations, evidence), and what Claude only claimed (never stored as a fact,
// so the hand-over says plainly that nothing claimed is shown as verified).

import { CAPS, sanitize } from './sanitize.js'
import { HARD_FORBIDDEN } from './policy.js'
import { evidenceCurrent } from './view.js'

const s = (x, n = 200) => sanitize(x, n)

// Each section is { heading, items, fixed }: headings and `fixed` lines always appear; `items` fill the
// remaining budget in order and the rest is counted, so the size cap never drops a heading or the
// limits disclosure (INV-005) the way truncating the finished text would.
function assemble(head, sections, cap) {
  const fixedText = [...head, ...sections.flatMap((x) => ['', x.heading, ...x.fixed])].join('\n')
  const omitLine = (n) => `- … ${n} omitidas (límite de tamaño de la entrega)`
  let budget = cap - fixedText.length - sections.length * omitLine(99999).length
  const out = [...head]
  for (const x of sections) {
    out.push('', x.heading)
    let shown = 0
    for (const it of x.items) {
      if (it.length + 1 > budget) break
      out.push(it); budget -= it.length + 1; shown++
    }
    if (shown < x.items.length) out.push(omitLine(x.items.length - shown))
    out.push(...x.fixed)
  }
  return out.join('\n')
}

export function handoff({ task, state, evidence, fingerprint, decisions, now, sessionId }) {
  // When the last tree reading was taken: the hand-over starts no process, so it never re-reads.
  const seenAt = typeof fingerprint?.at === 'number' ? ` a fecha de ${new Date(fingerprint.at).toISOString()}` : ''
  const head = [
    `# Entrega — ${task ? s(task.goal, 120) : 'ninguna tarea vinculada'}`,
    '',
    `Generada a partir de registros estructurados el ${new Date(now).toISOString()} (sesión ${s(sessionId, 60)}); no se llamó a ningún modelo.`,
  ]
  const sec = []
  sec.push({ heading: '## 1. Objetivo', items: [], fixed: [task ? s(task.goal, 500) : 'No se declaró ninguna tarea para esta sesión.'] })
  const scope = []
  if (task) {
    scope.push(`- Árbol de trabajo: ${s(task.worktree)}`)
    scope.push(`- Ediciones: ${(task.allow ?? []).includes('edit') ? `permitidas en ${(task.editRoots ?? ['.']).map((r) => s(r)).join(', ')}` : 'no permitidas'}`)
    scope.push(`- Ejecutores autorizados: ${(task.executors ?? []).map((e) => s(e.argv.join(' '))).join('; ') || 'ninguno'}`)
    scope.push(`- Prohibido: ${(task.forbid ?? []).map((f) => s(Array.isArray(f) ? f.join(' ') : f)).join('; ') || 'nada'}, más ${[...new Set(HARD_FORBIDDEN.map((h) => h.rule))].join(', ')}`)
    if (task.acceptance?.length) scope.push(`- Condiciones de aceptación: ${task.acceptance.map((a) => s(a)).join('; ')}`)
  }
  sec.push({ heading: '## 2. Alcance permitido y prohibido', items: scope, fixed: task ? [] : ['- No se declaró ningún alcance.'] })
  const ops = Object.entries(state.ops ?? {})
  const edits = ops.filter(([, o]) => ['Write', 'Edit', 'NotebookEdit', 'MultiEdit'].includes(o.tool) && o.outcome === 'ok')
  sec.push({ heading: '## 3. Cambios', items: [], fixed: [
    fingerprint ? `- Árbol: HEAD ${s(fingerprint.head, 60)}, ${fingerprint.changedCount ?? '?'} rutas modificadas o sin seguimiento (${fingerprint.coverage})${seenAt ? `, leído${seenAt}` : ''}` : '- Árbol: no se leyó para esta entrega',
    // Only the edit tools are counted here; a file changed through Bash shows in the tree line above
    // (found in an uncoached run: "Edits observed: 0" beside a changed README read as "nothing changed").
    `- Llamadas a herramientas de edición esta sesión: ${edits.length} (los cambios hechos con Bash no se cuentan aquí; la línea del árbol es el registro)`,
  ] })
  const ev = Object.values(evidence ?? {})
  const matches = (e) => fingerprint && e.after && e.before && e.before.value === e.after.value && e.after.value === fingerprint.value && e.outcome === 'ok'
  // Partial coverage is never "verified": what a reading did not cover may have changed — the
  // before, the after and the last reading must each be complete. The same rule `/agentctl` uses.
  const current = (e) => evidenceCurrent(e, fingerprint)
  const verified = ev.filter(current).map((e) => `- ${s(e.requested)} — sin errores notificados, coincide con la última lectura del árbol${seenAt} (${e.coverage})`)
  sec.push({ heading: '## 4. Verificado (evidencia de ejecución sobre la última lectura del árbol)', items: verified, fixed: verified.length ? [] : ['- Nada.'] })
  const notVerified = ev.filter((e) => !current(e)).map((e) => {
    const why = e.outcome === 'backgrounded' ? 'iniciada, finalización no observada' : e.outcome !== 'ok' ? `resultado ${e.outcome}` : !e.after || !e.before ? 'evidencia no disponible' : e.before.value !== e.after.value ? 'el árbol cambió durante la ejecución' : matches(e) ? 'cobertura parcial — no se leyó parte del árbol' : 'obsoleta — el árbol cambió después'
    return `- ${s(e.requested)} — ${why}`
  })
  sec.push({ heading: '## 5. No verificado', items: notVerified, fixed: ['- Todo lo que Claude afirmó como hecho, superado o corregido sin un registro de evidencia anterior es solo su propio juicio.'] })
  const open = ops.filter(([, o]) => o.endedAt === undefined && o.outcome !== 'refused')
  const bg = Object.entries(state.background ?? {}).filter(([, b]) => b.status === 'started' || b.status === 'in-flight')
  const running = [
    ...open.map(([id, o]) => `- ${s(o.requested)} (${o.tool}, ${o.outcome}) — ${id}`),
    ...bg.map(([id, b]) => `- en segundo plano ${s(id, 60)} — ${b.status}${b.asOf ? ` a fecha de ${new Date(b.asOf).toISOString()}` : ''}`),
  ]
  sec.push({ heading: '## 6. Aún en curso o desconocido', items: running, fixed: running.length ? [] : ['- No se observó nada aún en curso. Los procesos no registrados tampoco se pueden confirmar ni descartar.'] })
  const iv = Object.keys(state.interventions ?? {})
  sec.push({ heading: '## 7. Siguiente paso', items: [], fixed: [iv.length ? `- Resolver: ${iv.map((x) => s(x, 60)).join(', ')}` : '- Nada registrado. Decide según las secciones 4 a 6.'] })
  const refused = (decisions ?? []).filter((d) => d.outcome === 'deny' || d.outcome === 'unknown' || d.outcome === 'needs-user-refused')
  sec.push({ heading: '## 8. Aún no permitido', items: [], fixed: [
    ...(refused.length ? refused.slice(-10).map((d) => `- ${s(d.requested)} — ${s(d.rule)}`) : ['- No se rechazó ninguna llamada esta sesión; sigue vigente el alcance prohibido de la sección 2.']),
    '- Las aprobaciones anteriores no se heredan: al reanudar, cada llamada se clasifica de nuevo y el host vuelve a preguntar.',
    // INV-005: what this mod cannot refuse is disclosed here as in /agentctl policy, never silent.
    '- Límites: si el host omite el hook de este mod (fallo del worker, mod desactivado), nada aquí rechaza; otro mod puede cambiar un veredicto en tool.check. Las reglas estrictas van en permissions.deny.',
  ] })
  return assemble(head, sec, CAPS.handoff)
}
