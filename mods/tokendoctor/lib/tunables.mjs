// The settings tokendoctor-set may change: keys that move token use or cost, each checked against
// settings-reference.md or env-vars.md. `live`: Claude Code reloads settings files on change, except
// model and effortLevel (settings.md#when-edits-take-effect); env values are read at session start.
// Hooks, permissions and anything that widens what Claude
// may do are deliberately absent, so a model driving this tool cannot grant itself more.
const n = (min, max) => (v) => Number.isInteger(v) && v >= min && v <= max
const oneOf = (...xs) => (v) => xs.includes(v)
const bool = (v) => typeof v === 'boolean'
const str = (v) => typeof v === 'string' && v.length > 0 && v.length < 200
// A model alias or a full model id: anything else would be sent to the API as a model name.
const model = (v) => typeof v === 'string' && /^(default|best|opusplan|(opus|sonnet|haiku|fable)(\[1m\])?|claude-[a-z0-9.-]+(\[1m\])?)$/.test(v)
const envNum = (min, max) => (v) => /^\d+$/.test(String(v)) && Number(v) >= min && Number(v) <= max

export const TUNABLES = {
  autoCompactWindow: { check: n(100000, 1000000), live: true, about: 'tokens in context before auto-compaction' },
  autoCompactEnabled: { check: bool, live: true, about: 'automatic compaction on or off' },
  idleCompaction: { check: bool, live: true, about: 'compact a long idle conversation before its one-hour cache expires' },
  model: { check: model, live: false, about: 'default model for new sessions' },
  advisorModel: { check: model, live: true, about: 'advisor model' },
  effortLevel: { check: oneOf('low', 'medium', 'high', 'xhigh'), live: false, about: 'reasoning effort' },
  alwaysThinkingEnabled: { check: bool, live: true, about: 'extended thinking by default' },
  fastMode: { check: bool, live: true, about: 'fast mode (higher price per token)' },
  fastModePerSessionOptIn: { check: bool, live: true, about: 'fast mode only after /fast in a session' },
  includeGitInstructions: { check: bool, live: true, about: 'built-in git instructions and status in the system prompt' },
  bashOutputMaxChars: { check: n(1000, 150000), live: true, about: 'Bash output kept inline' },
  promptSuggestionEnabled: { check: bool, live: true, about: 'prompt suggestions (a small request after each reply)' },
  skillListingBudgetFraction: { check: (v) => typeof v === 'number' && v > 0 && v <= 0.1, live: true, about: 'share of context for the skill listing' },
  skillListingMaxDescChars: { check: n(100, 5000), live: true, about: 'characters per skill description in the listing' },
  outputStyle: { check: str, live: true, about: 'output style' },
  cleanupPeriodDays: { check: n(1, 3650), live: true, about: 'days transcripts are kept' },
  disableClaudeAiConnectors: { check: bool, live: true, about: 'claude.ai connectors off' },
  promptCacheTtl: { check: oneOf('5m', '1h'), live: true, about: 'main-conversation prompt cache TTL' },
  subagentPromptCacheTtl: { check: oneOf('5m', '1h'), live: true, about: 'subagent prompt cache TTL' },
  // tokendoctor's own options, kept where Claude Code keeps a plugin's: pluginConfigs.
  'tokendoctor.slide': { path: 'pluginConfigs.tokendoctor@tokendoctor.options.slide', check: bool, live: false, about: 'where Claude Code compacts, elide old tool outputs instead of summarizing the conversation' },
  'tokendoctor.slideTo': { path: 'pluginConfigs.tokendoctor@tokendoctor.options.slideTo', check: n(20, 90), live: false, about: 'how far a slide frees the context, in percent of where Claude Code compacts' },
  'env.CLAUDE_CODE_SUBAGENT_MODEL': { check: model, live: false, about: 'model for subagents without their own' },
  'env.CLAUDE_CODE_EFFORT_LEVEL': { check: oneOf('low', 'medium', 'high', 'xhigh', 'max'), live: false, about: 'effort, over /effort and effortLevel' },
  'env.CLAUDE_CODE_AUTO_COMPACT_WINDOW': { check: (v) => /^(\d+[kK]?|1[mM])$/.test(String(v)), live: false, about: 'auto-compact window, over the setting' },
  'env.CLAUDE_AUTOCOMPACT_PCT_OVERRIDE': { check: envNum(1, 100), live: false, about: 'percent of the window where auto-compaction triggers (can only lower it)' },
  'env.CLAUDE_CODE_IDLE_COMPACT_MIN_TOKENS': { check: envNum(100000, 1000000), live: false, about: 'context size from which idle compaction applies (default 200,000)' },
  maxEffortLevel: { check: oneOf('low', 'medium', 'high', 'xhigh', 'max'), live: true, about: 'highest effort any session, skill or subagent may use' },
  'env.MAX_MCP_OUTPUT_TOKENS': { check: envNum(1000, 200000), live: false, about: 'MCP tool output limit' },
  'env.BASH_MAX_OUTPUT_LENGTH': { check: envNum(1000, 150000), live: false, about: 'Bash output limit (bashOutputMaxChars wins)' },
  'env.ENABLE_TOOL_SEARCH': { check: (v) => /^(true|false|auto(:\d+)?)$/.test(String(v)), live: false, about: 'defer MCP tool definitions' },
  'env.CLAUDE_CODE_MAX_OUTPUT_TOKENS': { check: envNum(1000, 200000), live: false, about: 'max output tokens per response' },
  'env.CLAUDE_CODE_FILE_READ_MAX_OUTPUT_TOKENS': { check: envNum(1000, 200000), live: false, about: 'Read tool output limit' },
  'env.CLAUDE_CODE_DISABLE_GIT_INSTRUCTIONS': { check: oneOf('1', '0'), live: false, about: 'drop built-in git instructions' },
}

/** The same descriptions in the interface's language (lib/console.mjs, bin/tokendoctor-set). */
export const ABOUT = {
  autoCompactWindow: 'Número de tokens en el contexto antes de la compactación automática',
  autoCompactEnabled: 'Activación o desactivación de la compactación automática',
  idleCompaction: 'Compactar conversaciones inactivas antes de que caduque la caché de una hora',
  model: 'Modelo predeterminado de las nuevas sesiones',
  advisorModel: 'Modelo del asesor',
  effortLevel: 'Nivel de razonamiento',
  alwaysThinkingEnabled: 'Activar el pensamiento extendido por defecto',
  fastMode: 'Modo rápido (mayor precio por token)',
  fastModePerSessionOptIn: 'Activar el modo rápido solo al escribir /fast en la sesión',
  includeGitInstructions: 'Instrucciones y estado de git integrados en el prompt del sistema',
  bashOutputMaxChars: 'Salida de Bash conservada en el contexto',
  promptSuggestionEnabled: 'Sugerencias de prompt (se envía una pequeña petición tras cada respuesta)',
  skillListingBudgetFraction: 'Fracción del contexto ocupada por la lista de habilidades',
  skillListingMaxDescChars: 'Caracteres de la descripción de cada habilidad en la lista',
  outputStyle: 'Estilo de salida',
  cleanupPeriodDays: 'Días que se conservan las transcripciones',
  disableClaudeAiConnectors: 'Desactivar los conectores de claude.ai',
  promptCacheTtl: 'TTL de la caché de prompting de la conversación principal',
  subagentPromptCacheTtl: 'TTL de la caché de prompting de los subagentes',
  'tokendoctor.slide': 'Omitir la salida antigua de herramientas donde Claude Code compactaría en lugar de resumir la conversación',
  'tokendoctor.slideTo': 'Grado de liberación del contexto del deslizamiento, como porcentaje del punto de compactación de Claude Code',
  'env.CLAUDE_CODE_SUBAGENT_MODEL': 'Modelo de los subagentes que no especifican uno propio',
  'env.CLAUDE_CODE_EFFORT_LEVEL': 'Nivel de razonamiento, con prioridad sobre /effort y effortLevel',
  'env.CLAUDE_CODE_AUTO_COMPACT_WINDOW': 'Ventana de compactación automática, con prioridad sobre el ajuste del mismo nombre',
  'env.CLAUDE_AUTOCOMPACT_PCT_OVERRIDE': 'Porcentaje de la ventana que activa la compactación automática (solo se puede reducir)',
  'env.CLAUDE_CODE_IDLE_COMPACT_MIN_TOKENS': 'Tamaño del contexto a partir del cual se compacta una sesión inactiva (predeterminado: 200 000)',
  maxEffortLevel: 'Nivel máximo de razonamiento disponible en cualquier sesión, habilidad o subagente',
  'env.MAX_MCP_OUTPUT_TOKENS': 'Límite de salida de las herramientas MCP',
  'env.BASH_MAX_OUTPUT_LENGTH': 'Límite de salida de Bash (bashOutputMaxChars tiene prioridad)',
  'env.ENABLE_TOOL_SEARCH': 'Cargar las definiciones de herramientas MCP de forma diferida',
  'env.CLAUDE_CODE_MAX_OUTPUT_TOKENS': 'Número máximo de tokens de salida por respuesta',
  'env.CLAUDE_CODE_FILE_READ_MAX_OUTPUT_TOKENS': 'Límite de salida de la herramienta Read',
  'env.CLAUDE_CODE_DISABLE_GIT_INSTRUCTIONS': 'Eliminar las instrucciones de git integradas',
}

export function aboutOf(key) {
  return ABOUT[key] ?? TUNABLES[key]?.about ?? key
}

// Parses a command-line value as JSON when it is one (true, 400000, "1h"), else keeps the text.
export function parseValue(raw) {
  try {
    return JSON.parse(raw)
  } catch {
    return raw
  }
}

// Returns the settings op for a change, or throws with the reason it is refused.
export function tunableOp(key, value) {
  const t = TUNABLES[key]
  if (!t) throw new Error(`"${key}" is not a setting tokendoctor changes. Allowed: ${Object.keys(TUNABLES).join(', ')}`)
  const path = t.path ?? key
  if (value === undefined) return { op: 'unset', key: path }
  const v = key.startsWith('env.') ? String(value) : value
  if (!t.check(v)) throw new Error(`${JSON.stringify(value)} is not a valid value for ${key} (${t.about})`)
  return { op: 'set', key: path, value: v }
}