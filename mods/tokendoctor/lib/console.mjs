// `/tokendoctor`: read and change the tunable settings by name, with no model call. Pure functions over
// the merged settings and the audit findings, so the hooks module and node's tests both use them.
import { aboutOf, TUNABLES, tunableOp } from './tunables.mjs'

const ON_OFF = ['on', 'off']
// Short names for the settings people change most, with the values worth suggesting and their range.
export const NAMES = {
  window: { key: 'autoCompactWindow', values: ['200k', '400k', '600k', '1m'], range: '100k a 1m' },
  compact: { key: 'autoCompactEnabled', values: ON_OFF },
  'idle-compact': { key: 'idleCompaction', values: ON_OFF },
  'idle-compact-at': { key: 'env.CLAUDE_CODE_IDLE_COMPACT_MIN_TOKENS', values: ['150k', '200k'], range: '100k a 1m tokens' },
  'compact-at': { key: 'env.CLAUDE_AUTOCOMPACT_PCT_OVERRIDE', values: ['75', '90'], range: '1 a 100 (porcentaje de la ventana, solo se puede reducir)' },
  'max-effort': { key: 'maxEffortLevel', values: ['medium', 'high', 'xhigh', 'max'] },
  slide: { key: 'tokendoctor.slide', values: ON_OFF, fallback: false },
  'slide-to': { key: 'tokendoctor.slideTo', values: ['25', '40', '60'], range: '20 a 90 (porcentaje)', fallback: 25 },
  cache: { key: 'promptCacheTtl', values: ['5m', '1h'] },
  'subagent-cache': { key: 'subagentPromptCacheTtl', values: ['5m', '1h'] },
  model: { key: 'model', values: ['opus', 'sonnet', 'haiku'], range: 'alias de modelo o id claude-…' },
  subagents: { key: 'env.CLAUDE_CODE_SUBAGENT_MODEL', values: ['sonnet', 'haiku', 'opus'], range: 'alias de modelo o id claude-…' },
  advisor: { key: 'advisorModel', values: ['opus', 'sonnet'], range: 'alias de modelo o id claude-…' },
  effort: { key: 'effortLevel', values: ['low', 'medium', 'high', 'xhigh'] },
  thinking: { key: 'alwaysThinkingEnabled', values: ON_OFF },
  fast: { key: 'fastMode', values: ON_OFF },
  'git-instructions': { key: 'includeGitInstructions', values: ON_OFF },
  suggestions: { key: 'promptSuggestionEnabled', values: ON_OFF },
  'bash-output': { key: 'bashOutputMaxChars', values: ['30k', '60k'], range: '1k a 150k caracteres' },
  'tool-search': { key: 'env.ENABLE_TOOL_SEARCH', values: ['true', 'auto', 'false'] },
  'mcp-output': { key: 'env.MAX_MCP_OUTPUT_TOKENS', values: ['25k', '50k'], range: '1k a 200k tokens' },
  'read-output': { key: 'env.CLAUDE_CODE_FILE_READ_MAX_OUTPUT_TOKENS', values: ['25k', '50k'], range: '1k a 200k tokens' },
  'max-output': { key: 'env.CLAUDE_CODE_MAX_OUTPUT_TOKENS', values: ['32k', '64k'], range: '1k a 200k tokens' },
  'keep-transcripts': { key: 'cleanupPeriodDays', values: ['30', '90'], range: '1 a 3650 días' },
  'fast-opt-in': { key: 'fastModePerSessionOptIn', values: ON_OFF },
  'skill-budget': { key: 'skillListingBudgetFraction', values: ['0.01', '0.02'], range: 'mayor que 0, como máximo 0.1' },
  'skill-desc': { key: 'skillListingMaxDescChars', values: ['250', '500'], range: '100 a 5000 caracteres' },
  'output-style': { key: 'outputStyle', values: ['default', 'Explanatory', 'Learning'] },
  'no-connectors': { key: 'disableClaudeAiConnectors', values: ON_OFF },
  'effort-env': { key: 'env.CLAUDE_CODE_EFFORT_LEVEL', values: ['low', 'medium', 'high', 'xhigh', 'max'] },
  'window-env': { key: 'env.CLAUDE_CODE_AUTO_COMPACT_WINDOW', values: ['200k', '400k'], range: 'tokens, tiene prioridad sobre el ajuste de ventana' },
  'bash-output-env': { key: 'env.BASH_MAX_OUTPUT_LENGTH', values: ['30k'], range: '1k a 150k caracteres' },
  'no-git-instructions': { key: 'env.CLAUDE_CODE_DISABLE_GIT_INSTRUCTIONS', values: ['1', '0'] },
}
/** What `/tokendoctor` alone shows; the rest is under `/tokendoctor all`. */
export const MAIN = ['window', 'slide', 'cache', 'effort', 'model', 'subagents']
const COMMAND = '/tokendoctor'

/** A name typed by the person (short name or full key) as its entry, or null. */
export function resolve(name) {
  if (NAMES[name]) return { name, ...NAMES[name] }
  const short = Object.keys(NAMES).find(n => NAMES[n].key === name)
  if (short) return { name: short, ...NAMES[short] }
  return TUNABLES[name] ? { name, key: name, values: [] } : null
}

/** Every setting, short names first, then the keys that have none. */
export function every() {
  const named = Object.keys(NAMES).map(resolve)
  const rest = Object.keys(TUNABLES).filter(k => !named.some(e => e.key === k)).map(resolve)
  return [...named, ...rest]
}

/**
 * The person's words as an action: overview, all, explain, set (value undefined to unset), fix (id
 * undefined to list), or unknown. `--project`, `--local` or `--user` anywhere picks the file.
 */
export function parse(args) {
  const words = String(args ?? '').trim().split(/\s+/).filter(Boolean)
  const flag = words.find(w => ['--user', '--project', '--local'].includes(w))
  const scope = flag ? flag.slice(2) : 'user'
  const [first, raw] = words.filter(w => !w.startsWith('--'))
  if (!first || ['help', 'settings', 'list'].includes(first)) return { action: 'overview', scope }
  if (first === 'all') return { action: 'all', scope }
  if (first === 'undo') return { action: 'undo', n: raw }
  // A fix has a scope of its own unless the person names one.
  if (first === 'fix') return { action: 'fix', id: raw, scope: flag ? scope : undefined }
  const entry = resolve(first)
  if (!entry) return { action: 'unknown', name: first, scope }
  if (raw === undefined) return { action: 'explain', entry, scope }
  if (raw === 'reset') return { action: 'set', entry, value: undefined, scope }
  return { action: 'set', entry, value: value(entry.key, raw), scope }
}

/** A typed value as the setting takes it: on/off as booleans, 400k as 400000. */
export function value(key, raw) {
  const t = TUNABLES[key]
  if (t?.check(true)) {
    if (['on', 'true', 'yes'].includes(raw)) return true
    if (['off', 'false', 'no'].includes(raw)) return false
  }
  // 400k is a number only where the setting takes one: 5m stays five minutes for the cache.
  const m = /^(\d+(?:\.\d+)?)([km])?$/i.exec(raw)
  if (!m || !t) return raw
  const n = Math.round(Number(m[1]) * (m[2] ? (m[2].toLowerCase() === 'k' ? 1_000 : 1_000_000) : 1) * 1e6) / 1e6
  return t.check(key.startsWith('env.') ? String(n) : n) ? n : raw
}

/** The change as the settings op, or the reason it is refused. */
export function op(entry, v) {
  try {
    return { op: tunableOp(entry.key, v) }
  } catch (e) {
    const values = entry.values.length ? ` Prueba: ${entry.values.join(', ')}${entry.range ? ` (${entry.range})` : ''}.` : ''
    return { error: `${display(v)} no es un valor válido para ${entry.name}.${values}` }
  }
}

/** Whether a change to the key reaches the running session. */
export function live(key) {
  return Boolean(TUNABLES[key]?.live)
}

/** A setting's current value in the merged settings, undefined when unset. */
export function current(merged, key) {
  const path = TUNABLES[key]?.path ?? key
  return path.split('.').reduce((node, p) => (node && typeof node === 'object' ? node[p] : undefined), merged)
}

/** A value as people read it: on/off, 400K, 1M. */
export function display(v) {
  if (v === undefined || v === null) return 'predeterminado'
  if (typeof v === 'boolean') return v ? 'activado' : 'desactivado'
  if (typeof v === 'number' && v >= 1000 && v % 1000 === 0) return v >= 1_000_000 && v % 100_000 === 0 ? `${v / 1_000_000}M` : `${v / 1000}K`
  return String(v)
}

/** The audit findings whose fix changes this key. */
function fixesFor(key, findings) {
  const path = TUNABLES[key]?.path ?? key
  return (findings ?? []).filter(f => (f.fixes ?? []).some(fix => (fix.ops ?? []).some(o => o.key === path)))
}

/** The value now, the default spelled out where it is known (tokendoctor's own, the window's point). */
function now(entry, merged, compactsAt) {
  const v = current(merged, entry.key)
  if (v !== undefined) return display(v)
  if (entry.fallback !== undefined) return `${display(entry.fallback)} (predeterminado)`
  if (entry.key === 'autoCompactWindow' && compactsAt) return `predeterminado, compacta en ${display(Math.round(compactsAt / 1000) * 1000)}`
  return 'predeterminado'
}

const WIDTH = Math.max(...Object.keys(NAMES).map(n => n.length)) + 2

function row(entry, merged, compactsAt) {
  const later = TUNABLES[entry.key].live ? '' : ' (siguiente sesión)'
  return `  ${entry.name.padEnd(WIDTH)}${now(entry, merged, compactsAt).padEnd(26)} ${aboutOf(entry.key)}${later}`
}

const HOW = [
  `Cambia uno: ${COMMAND} <nombre> <valor>, por ejemplo`,
  `  ${COMMAND} window 600k     ${COMMAND} slide off     ${COMMAND} cache reset (volver al valor predeterminado)`,
  `${COMMAND} <nombre> explica uno. Escribe la primera letra de un nombre y aparece la lista;`,
  `tras el nombre y un espacio, la primera letra de un valor muestra sus opciones. --project o --local escriben ahí, no en tus`,
  `ajustes de usuario. ${COMMAND} undo enumera los cambios hechos aquí y restaura uno.`,
]

function fixList(findings) {
  const fixable = (findings ?? []).filter(f => f.fixes)
  if (!fixable.length) return []
  return ['', 'La auditoría tiene correcciones para:', ...fixable.map(f => `  ${COMMAND} fix ${f.id.padEnd(28)} ${f.title}`)]
}

/** `/tokendoctor`: the main settings, how to change them, and the audit's fixes. */
export function overview(merged, findings, compactsAt) {
  return [
    'ajustes',
    ...MAIN.map(n => row(resolve(n), merged, compactsAt)),
    `  ${every().length - MAIN.length} más: ${COMMAND} all`,
    ...((findings ?? []).some(f => f.id === 'slide-blocked-by-guard') ? ['  el deslizamiento está activado pero no puede ejecutarse con este inicio de sesión: ' + `${COMMAND} slide dice el motivo`] : []),
    '',
    ...HOW,
    ...fixList(findings),
  ].join('\n')
}

/** `/tokendoctor all`: every setting tokendoctor changes. */
export function all(merged, compactsAt) {
  return ['todos los ajustes que modifica', ...every().map(e => row(e, merged, compactsAt)), '', ...HOW].join('\n')
}

/** `/tokendoctor <name>`: one setting, its values, when it applies and what the audit says. */
export function explain(entry, merged, findings, compactsAt) {
  const t = TUNABLES[entry.key]
  const lines = [`${entry.name}${entry.name === entry.key ? '' : ` (${entry.key})`}: ${aboutOf(entry.key)}`, `  ahora: ${now(entry, merged, compactsAt)}`]
  if (entry.values.length) lines.push(`  valores: ${entry.values.join(', ')}${entry.range ? `; ${entry.range}` : ''}; reset restaura el predeterminado`)
  lines.push(`  se aplica: ${t.live ? 'ahora' : 'desde la siguiente sesión'}`)
  for (const f of fixesFor(entry.key, findings)) lines.push(`  auditoría: ${f.title} → ${COMMAND} fix ${f.id}`)
  // A finding with no fix the console can apply, but that decides whether this setting does anything.
  const blocked = entry.key.startsWith('tokendoctor.slide') && findings?.find(f => f.id === 'slide-blocked-by-guard')
  if (blocked) lines.push(`  bloqueado: ${blocked.detail}`)
  const is = display(current(merged, entry.key))
  lines.push(`  cambiar: ${COMMAND} ${entry.name} ${entry.values.find(v => v !== is) ?? '<valor>'}`)
  return lines.join('\n')
}

/** Typeahead rows for the word at the cursor of a `/tokendoctor` draft. */
export function complete(text, start, token, findings) {
  const words = text.slice(0, start).trim().split(/\s+/)
  if (words[0] !== COMMAND) return []
  const before = words.filter(w => !w.startsWith('--'))
  const t = token.toLowerCase()
  const rows = (list) => list.filter(r => r.text.toLowerCase().startsWith(t) && r.text.toLowerCase() !== t)
  if (token.startsWith('-')) {
    return rows([
      { text: '--project', description: 'escribir en los ajustes compartidos de este proyecto' },
      { text: '--local', description: 'escribir en los ajustes personales de este proyecto' },
    ])
  }
  if (before.length > 2) return []
  if (before.length === 1) {
    return rows([
      ...every().map(e => ({ text: e.name, description: aboutOf(e.key) })),
      { text: 'all', description: 'todos los ajustes que modifica tokendoctor' },
      { text: 'fix', description: 'aplicar la corrección de un hallazgo de auditoría' },
      { text: 'undo', description: 'enumerar los cambios hechos aquí y restaurar uno' },
    ])
  }
  if (before[1] === 'fix') return rows((findings ?? []).filter(f => f.fixes).map(f => ({ text: f.id, description: f.title })))
  const entry = resolve(before[1])
  if (!entry) return []
  return rows([...entry.values.map(v => ({ text: v })), { text: 'reset', description: 'volver al valor predeterminado' }])
}

/** What an unknown name gets: the names it may have meant. */
export function unknown(name) {
  const n = name.toLowerCase()
  const near = every().filter(e => e.name.toLowerCase().includes(n) || n.includes(e.name.toLowerCase())).map(e => e.name)
  return `No existe el ajuste "${name}".${near.length ? ` ¿Quizás querías escribir ${near.slice(0, 4).join(', ')}?` : ''} ${COMMAND} all los enumera todos.`
}

/** The name a settings path goes by here. */
export function nameOf(path) {
  const key = Object.keys(TUNABLES).find(k => (TUNABLES[k].path ?? k) === path) ?? path
  return resolve(key)?.name ?? path
}

/** `/tokendoctor undo`: the changes tokendoctor wrote, newest first, numbered. */
export function undoList(journal) {
  if (!journal.length) return 'tokendoctor todavía no ha hecho ningún cambio.'
  const lines = journal.map((e, i) => {
    const time = new Date(e.at).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
    const what = e.changes.map(c => `${nameOf(c.key)}: ${display(c.before)} → ${display(c.after)}`).join(', ')
    return `  ${String(i + 1).padStart(2)}  ${time.padEnd(16)} ${e.scope.padEnd(8)} ${what}`
  })
  return ['cambios hechos por tokendoctor, más recientes primero', ...lines, '', `${COMMAND} undo <número> restaura ese cambio.`].join('\n')
}