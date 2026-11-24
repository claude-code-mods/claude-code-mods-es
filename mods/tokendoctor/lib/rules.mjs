// Pure audit rules. Each rule reads a snapshot (see collect.mjs) and returns a finding or null.
// Nothing here touches the disk, so every rule is unit-testable on a fixture snapshot.
//
// A finding: { id, severity: 'error'|'warn'|'info', title, detail, doc, fixes?: Fix[] }
// A Fix is one of:
//   { scope, ops: [{ op: 'set'|'unset'|'add', key, value|values }] }   settings edit
//   { scope, template }                                                 copy templates/agents/<template>.md

import { blockedNote, ORG_ID, USER_ID } from './guard.mjs'

const DOCS = {
  model: 'https://code.claude.com/docs/en/model-config.md',
  costs: 'https://code.claude.com/docs/en/costs.md',
  subagents: 'https://code.claude.com/docs/en/sub-agents.md',
  advisor: 'https://code.claude.com/docs/en/advisor.md',
  settings: 'https://code.claude.com/docs/en/settings.md',
  skills: 'https://code.claude.com/docs/en/skills.md',
}

const SCOPES = ['user', 'project', 'local']
const COMPACT_WINDOW = 400000

export function compareVersions(a, b) {
  const pa = String(a).split('.').map(Number)
  const pb = String(b).split('.').map(Number)
  for (let i = 0; i < 3; i++) {
    const d = (pa[i] || 0) - (pb[i] || 0)
    if (d !== 0) return d
  }
  return 0
}

export function modelFamily(name) {
  const m = String(name ?? '').toLowerCase()
  for (const family of ['fable', 'opus', 'sonnet', 'haiku']) if (m.includes(family)) return family
  return null
}

const RANK = { haiku: 0, sonnet: 1, opus: 2, fable: 3 }

export function mainModel(snapshot) {
  const { settings, env } = snapshot
  // ANTHROPIC_DEFAULT_MODEL counts only when nothing else picks one (model-config.md#set-a-default-model-for-new-sessions).
  return env.ANTHROPIC_MODEL ?? settings.local.model ?? settings.project.model ?? settings.user.model ?? env.ANTHROPIC_DEFAULT_MODEL ?? null
}

const truthy = (v) => v !== undefined && v !== '' && v !== '0' && v !== 'false'

// Variables that stop Claude Code fetching feature flags (env-vars.md#features-that-need-feature-flag-fetching).
// DISABLE_TELEMETRY and CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC count even when set to 0 or false.
function flagFetchBlockers(env) {
  const set = (k) => env[k] !== undefined && env[k] !== ''
  return [
    set('DISABLE_TELEMETRY') && 'DISABLE_TELEMETRY',
    set('CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC') && 'CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC',
    truthy(env.DO_NOT_TRACK) && 'DO_NOT_TRACK',
    truthy(env.DISABLE_GROWTHBOOK) && 'DISABLE_GROWTHBOOK',
  ].filter(Boolean)
}

function scopesWith(snapshot, key) {
  return SCOPES.filter((s) => snapshot.settings[s][key] !== undefined)
}

const RULES = [
  {
    id: 'compact-window-unset',
    since: '2.1.288',
    run(s) {
      const { settings, env } = s
      const perModel = SCOPES.some((sc) =>
        Object.values(settings[sc].modelSettings ?? {}).some((m) => m?.autoCompactWindow),
      )
      if (SCOPES.some((sc) => settings[sc].autoCompactWindow) || perModel) return null
      if (env.CLAUDE_CODE_AUTO_COMPACT_WINDOW) return null
      // Holds every native-1M model to a 200K window, which is smaller than the one suggested here.
      if (truthy(env.CLAUDE_CODE_DISABLE_1M_CONTEXT)) return null
      return {
        severity: 'warn',
        title: 'No se ha definido una ventana de compactación automática',
        detail:
          'Los modelos con ventana nativa de 1 M (Fable, Sonnet 5+, Haiku 5.5, Opus 4.7+) compactan por defecto solo en ' +
          'unos 967K tokens, así que cada petición arrastra un historial muy largo. Una ventana ' +
          `más pequeña (${COMPACT_WINDOW.toLocaleString('en')} aquí, rango válido de 100K a 1M) compacta antes. ` +
          'Una ventana demasiado pequeña compacta a menudo, vuelve a leer el historial y rompe la caché de prompting.',
        doc: `${DOCS.model}#set-the-auto-compact-window`,
        fixes: [{ scope: 'user', ops: [{ op: 'set', key: 'autoCompactWindow', value: COMPACT_WINDOW }] }],
      }
    },
  },
  {
    id: 'compact-threshold-undocumented',
    run(s) {
      const scopes = scopesWith(s, 'autoCompactThreshold')
      if (!scopes.length) return null
      return {
        severity: 'error',
        title: '`autoCompactThreshold` no es un ajuste documentado',
        detail:
          `Se encontró en los ajustes de ${scopes.join(', ')}. Las claves documentadas son \`autoCompactWindow\` ` +
          '(un número de tokens) y la variable `CLAUDE_CODE_AUTO_COMPACT_WINDOW`, así que esta clave probablemente se ignore y ' +
          'la compactación no esté configurada como parece.',
        doc: `${DOCS.model}#set-the-auto-compact-window`,
        fixes: scopes.map((scope) => ({ scope, ops: [{ op: 'unset', key: 'autoCompactThreshold' }] })),
      }
    },
  },
  {
    id: 'compact-env-bare-number',
    run(s) {
      const raw = s.env.CLAUDE_CODE_AUTO_COMPACT_WINDOW
      if (raw === undefined || !/^\d+$/.test(String(raw))) return null
      if (Number(raw) >= 100000) return null
      return {
        severity: 'error',
        title: '`CLAUDE_CODE_AUTO_COMPACT_WINDOW` está por debajo del mínimo de 100 000',
        detail:
          `Definido en ${raw}. En esta variable un número simple se interpreta como tokens (no como miles), y ` +
          'los valores fuera de 100 000 a 1 000 000 se recortan con una advertencia. Usa 200000 o 200k en ' +
          'Claude Code 2.1.304 y posteriores.',
        doc: `${DOCS.model}#set-the-auto-compact-window`,
      }
    },
  },
  {
    id: 'explore-default-model',
    since: '2.1.251',
    run(s) {
      if ([...s.agents.user, ...s.agents.project].some((a) => a.name === 'Explore')) return null
      return {
        severity: 'info',
        title: 'El agente Explore integrado no tiene anulación',
        detail:
          'Con una suscripción de Claude, una cuenta de Console o una pasarela en ANTHROPIC_BASE_URL, el ' +
          'agente Explore integrado usa Opus, el modelo más caro, para búsquedas de solo lectura. ' +
          'Un agente de usuario o proyecto llamado Explore lo anula; la plantilla incluida fija Haiku ' +
          'y solo habilita herramientas de lectura. Ignora este aviso si necesitas un modelo más potente.',
        doc: `${DOCS.subagents}#built-in-subagent-models`,
        fixes: [{ scope: 'user', template: 'Explore' }],
      }
    },
  },
  {
    id: 'subagent-model-force',
    since: '2.1.257',
    run(s) {
      if (!truthy(s.env.CLAUDE_CODE_SUBAGENT_MODEL_FORCE)) return null
      return {
        severity: 'warn',
        title: 'Todos los subagentes se fuerzan a usar un mismo modelo',
        detail:
          `CLAUDE_CODE_SUBAGENT_MODEL_FORCE ignora el modelo propio de cada agente, incluidos los que ` +
          `necesitan razonar (Plan, revisores). Modelo forzado: ${s.env.CLAUDE_CODE_SUBAGENT_MODEL ?? 'el modelo principal'}. ` +
          'Es mejor fijar modelos baratos en el frontmatter de los agentes de búsqueda y pruebas.',
        doc: `${DOCS.subagents}#forcing-one-model-on-every-subagent`,
      }
    },
  },
  {
    id: 'subagent-model-unset',
    since: '2.1.251',
    run(s) {
      if (s.env.CLAUDE_CODE_SUBAGENT_MODEL) return null
      if (modelFamily(mainModel(s)) === 'sonnet' || modelFamily(mainModel(s)) === 'haiku') return null
      return {
        severity: 'info',
        title: 'Los subagentes heredan el modelo principal',
        detail:
          `El modelo principal es ${mainModel(s) ?? 'el predeterminado'}, así que los subagentes de uso general también lo usan. ` +
          'Definir CLAUDE_CODE_SUBAGENT_MODEL (por ejemplo, sonnet) en el bloque `env` de ' +
          'settings.json los reduce de categoría sin forzar a los agentes que nombran su propio modelo.',
        doc: `${DOCS.subagents}#subagent-model-selection`,
        fixes: [{ scope: 'user', ops: [{ op: 'set', key: 'env.CLAUDE_CODE_SUBAGENT_MODEL', value: 'sonnet' }] }],
      }
    },
  },
  {
    id: 'thinking-tokens-env',
    run(s) {
      const raw = s.env.MAX_THINKING_TOKENS
      if (!truthy(raw)) return null
      return {
        severity: 'info',
        title: '`MAX_THINKING_TOKENS` solo se aplica a modelos con presupuesto fijo',
        detail:
          `Definido en ${raw}. Los modelos de razonamiento adaptativo ignoran un presupuesto distinto de cero, y Opus 5.5, Sonnet 5.5, ` +
          'Haiku 5.5 y los modelos Fable no pueden desactivar el pensamiento. En ellos, reduce el nivel ' +
          'de razonamiento con /effort o modelSettings.',
        doc: `${DOCS.costs}#adjust-extended-thinking`,
      }
    },
  },
  {
    id: 'effort-max-in-settings',
    run(s) {
      const scopes = SCOPES.filter((sc) => s.settings[sc].effortLevel === 'max')
      if (!scopes.length) return null
      return {
        severity: 'warn',
        title: 'La configuración no acepta `effortLevel: "max"`',
        detail:
          `Se encontró en los ajustes de ${scopes.join(', ')}. La clave \`effortLevel\` acepta low, medium, high ` +
          'y xhigh; max solo funciona por sesión (/effort max o --effort max).',
        doc: `${DOCS.model}#effort-levels`,
        fixes: scopes.map((scope) => ({ scope, ops: [{ op: 'set', key: 'effortLevel', value: 'xhigh' }] })),
      }
    },
  },
  {
    id: 'advisor-inactive',
    since: '2.1.260',
    run(s) {
      const advisor = SCOPES.map((sc) => s.settings[sc].advisorModel).find(Boolean)
      if (!advisor) return null
      const reasons = []
      const flagOff = flagFetchBlockers(s.env)
      if (flagOff.length) {
        reasons.push(`${flagOff.join(', ')} desactiva la obtención de indicadores de funciones que necesita el asesor`)
      }
      if (truthy(s.env.CLAUDE_CODE_DISABLE_ADVISOR_TOOL)) {
        reasons.push('CLAUDE_CODE_DISABLE_ADVISOR_TOOL desactiva la herramienta directamente')
      }
      const main = modelFamily(mainModel(s))
      const adv = modelFamily(advisor)
      if (main && adv && RANK[adv] < RANK[main]) {
        reasons.push(`el asesor (${advisor}) es inferior al modelo principal (${mainModel(s)})`)
      }
      if (!reasons.length) return null
      return {
        severity: 'warn',
        title: 'El asesor configurado no se ejecutará',
        detail: `${reasons.join('; ')}. Claude Code envía peticiones sin asesor silenciosamente en estos casos.`,
        doc: DOCS.advisor,
      }
    },
  },
  {
    id: 'instructions-long',
    run(s) {
      const long = s.instructionFiles.filter((f) => f.lines > 200)
      if (!long.length) return null
      return {
        severity: 'info',
        title: 'Los archivos de instrucciones son largos',
        detail:
          long.map((f) => `${f.path}: ${f.lines} líneas`).join('; ') +
          '. Estos se cargan en cada sesión y en cada subagente salvo Explore, Plan y los agentes que ' +
          'definen omitClaudeMd. ' +
          'La documentación recomienda no superar unas 200 líneas. Para reducir el coste, mueve el texto ' +
          'específico de cada flujo a habilidades (que solo se cargan cuando se usan) o a archivos ' +
          '`.claude/rules/*.md` con un frontmatter `paths:` (que solo se cargan cuando Claude trabaja en archivos coincidentes). ' +
          '@import no lo reduce, porque los archivos importados se cargan con el archivo que los importa. ' +
          'Los comentarios HTML de bloque se eliminan antes de la inyección, así que las notas de mantenimiento no cuestan nada.',
        doc: `${DOCS.costs}#move-instructions-from-claudemd-to-skills`,
      }
    },
  },
  {
    id: 'context-surface',
    run(s) {
      const { skills, enabledPlugins, mcpServers } = s
      const parts = []
      if (skills.autoLoaded > 15) parts.push(`${skills.autoLoaded} habilidades cargan sus descripciones en cada sesión`)
      if (enabledPlugins > 6) parts.push(`${enabledPlugins} plugins activados`)
      if (mcpServers > 5) parts.push(`${mcpServers} servidores MCP`)
      if (!parts.length) return null
      return {
        severity: 'info',
        title: 'El contexto siempre activo ocupa mucho',
        detail:
          `${parts.join(', ')}. Las descripciones de habilidades forman parte de cada petición; ` +
          '`disable-model-invocation: true` mantiene una habilidad fuera del contexto hasta que la ejecutas, y un ' +
          'plugin se puede desactivar por proyecto en .claude/settings.local.json; `skillOverrides` ' +
          'oculta tu propia habilidad sin editarla (no afecta a las habilidades de plugins: gestiona ' +
          'esas con /plugin). Las definiciones de herramientas MCP se cargan de forma diferida (solo ' +
          'se cargan nombres e instrucciones del servidor hasta que se usa una herramienta), así que una lista MCP larga ' +
          'cuesta menos que antes; /mcp desactiva un servidor que no usas. Ejecuta /context para ver qué es lo que más cuesta.',
        doc: `${DOCS.skills}`,
      }
    },
  },
  {
    id: 'heavy-dirs-not-denied',
    run(s) {
      const deny = SCOPES.flatMap((sc) => s.settings[sc].permissions?.deny ?? []).filter((d) =>
        String(d).startsWith('Read('),
      )
      const open = s.heavyDirs.filter((d) => !deny.some((rule) => rule.includes(`${d.name}/`)))
      if (!open.length) return null
      const names = [...new Set(open.map((d) => d.name))]
      return {
        severity: 'info',
        title: 'Los directorios generados grandes no se excluyen de las lecturas',
        detail:
          open.map((d) => `${d.path}（${Math.round(d.bytes / 1e6)} MB）`).join('；') +
          '. No hay archivo de ignorados: el mecanismo admitido son las reglas Read en permissions.deny; ' +
          'para Grep y Glob son solo un intento. No impiden que un archivo se lea mediante Bash.',
        doc: 'https://code.claude.com/docs/en/permissions.md',
        fixes: [
          {
            scope: 'project',
            ops: [{ op: 'add', key: 'permissions.deny', values: names.map((n) => `Read(./**/${n}/**)`) }],
          },
        ],
      }
    },
  },
  {
    id: 'every-tool-hooks',
    run(s) {
      const events = ['PreToolUse', 'PostToolUse', 'PostToolUseFailure', 'PermissionRequest']
      const perScope = SCOPES.map((scope) => {
        const hooks = s.settings[scope].hooks ?? {}
        return { scope, n: events.reduce((m, e) => m + (hooks[e] ?? []).filter((h) => h.matcher === '*').length, 0) }
      }).filter((x) => x.n)
      if (!perScope.length) return null
      const count = perScope.reduce((n, x) => n + x.n, 0)
      return {
        severity: 'info',
        title: 'Los hooks se ejecutan en cada llamada a una herramienta',
        detail:
          `${count} hooks de eventos de herramienta coinciden con "*" e inician un proceso por cada llamada. Esto ` +
          'cuesta latencia, no tokens. Reduce el patrón si el hook solo le interesa alguna herramienta. ' +
          'Solo es seguro eliminarlos si nada depende de los eventos: una herramienta que muestra ' +
          'el estado de los agentes a partir de estos hooks (un gestor de terminales, un panel) dejará de actualizarse. ' +
          'La corrección elimina todas las entradas "*" de los eventos de herramienta de ese ámbito tras una ejecución de prueba.',
        doc: 'https://code.claude.com/docs/en/hooks.md',
        fixes: perScope.map(({ scope }) => ({ scope, ops: [{ op: 'dropHooks', matcher: '*' }] })),
      }
    },
  },
  {
    id: 'fast-mode-enabled',
    run(s) {
      const scopes = SCOPES.filter((sc) => s.settings[sc].fastMode === true)
      const optIn = SCOPES.some((sc) => s.settings[sc].fastModePerSessionOptIn === true)
      if (!scopes.length || optIn) return null
      return {
        severity: 'warn',
        title: 'El modo rápido se activa por defecto en cada sesión',
        detail:
          `\`fastMode: true\` está guardado en los ajustes de ${scopes.join(', ')}. El modo rápido cuesta más por ` +
          'token y solo funciona en Opus, así que cada sesión paga ese precio, necesite o no ' +
          'la velocidad. `fastModePerSessionOptIn: true` conserva el ajuste, pero exige ejecutar /fast ',
        doc: 'https://code.claude.com/docs/en/settings-reference.md#fastmodepersessionoptin',
        fixes: [{ scope: scopes[0], ops: [{ op: 'set', key: 'fastModePerSessionOptIn', value: true }] }],
      }
    },
  },
  {
    id: 'code-intelligence-missing',
    run(s) {
      const have = (s.enabledPluginNames ?? []).map((n) => n.split('@')[0])
      const missing = (s.languageMarkers ?? []).filter((p) => !have.includes(p))
      if (!missing.length) return null
      return {
        severity: 'info',
        title: 'Este proyecto no tiene plugin de servidor de lenguaje',
        detail:
          'El proyecto tiene archivos de un idioma con un plugin oficial de inteligencia de código: ' +
          missing.map((p) => `/plugin install ${p}@claude-plugins-official`).join('；') +
          '. Un servidor de lenguaje permite a Claude ir a la definición y ver errores de tipo tras cada edición, ' +
          'así que lee menos archivos candidatos y detecta errores sin compilar. El plugin necesita ' +
          'el binario del servidor en PATH. No funciona en sesiones en la nube.',
        doc: 'https://code.claude.com/docs/en/plugins/code-intelligence.md',
      }
    },
  },
  {
    id: 'settings-unreadable',
    run(s) {
      if (!s.unreadable.length) return null
      return {
        severity: 'error',
        title: 'Un archivo de ajustes no es JSON válido',
        detail:
          `${s.unreadable.join(', ')} existe pero no se puede analizar, así que ninguno de sus ajustes se auditó ` +
          '(y Claude Code informa de un error de ajustes al iniciarse). Los archivos de ajustes son JSON ' +
          'estricto: sin comentarios ni comas finales. `claude doctor` enumera lo que Claude Code rechazó.',
        doc: `${DOCS.settings}#fix-a-broken-settings-file`,
      }
    },
  },
  {
    id: 'compact-window-small',
    since: '2.1.288',
    run(s) {
      const values = [
        ...SCOPES.map((sc) => s.settings[sc].autoCompactWindow),
        ...SCOPES.flatMap((sc) => Object.values(s.settings[sc].modelSettings ?? {}).map((m) => m?.autoCompactWindow)),
      ].filter((v) => typeof v === 'number')
      const small = values.filter((v) => v < 150000)
      if (!small.length) return null
      return {
        severity: 'warn',
        title: 'La ventana de compactación automática es muy pequeña',
        detail:
          `Ventana de ${Math.min(...small).toLocaleString('en')} tokens. La compactación lee toda la conversación ` +
          'y rompe la caché de prompting en cada ocasión, así que compactar a menudo puede costar más de lo que ahorra. ' +
          'Entre 250K y 400K es un rango razonable; el mínimo aceptado es 100K.',
        doc: `${DOCS.model}#set-the-auto-compact-window`,
      }
    },
  },
  {
    id: 'prompt-caching-disabled',
    run(s) {
      const set = Object.keys(s.env).filter((k) => k.startsWith('DISABLE_PROMPT_CACHING') && truthy(s.env[k]))
      if (!set.length) return null
      return {
        severity: 'warn',
        title: 'La caché de prompting está desactivada',
        detail:
          `Definido ${set.join(', ')}. Sin caché, cada petición reprocesa toda la conversación ` +
          'al precio completo de entrada. La documentación describe estas variables como ayuda de depuración; mantén la caché activada.',
        doc: 'https://code.claude.com/docs/en/prompt-caching.md#disable-prompt-caching',
      }
    },
  },
  {
    id: 'prompt-cache-ttl-forced-short',
    since: '2.1.242',
    run(s) {
      if (!truthy(s.env.FORCE_PROMPT_CACHING_5M)) return null
      return {
        severity: 'info',
        title: 'La duración de la caché se fuerza a cinco minutos',
        detail:
          'FORCE_PROMPT_CACHING_5M anula todos los demás controles de TTL. Tras una pausa de más de cinco ' +
          'minutos, el siguiente mensaje vuelve a leer el contexto completo sin caché. La documentación lo recomienda para ' +
          'depurar o comparar TTL; en un plan con una hora de caché se pierde esa ventaja.',
        doc: 'https://code.claude.com/docs/en/prompt-caching.md#choose-the-ttl-yourself',
      }
    },
  },
  {
    id: 'agent-teams-enabled',
    run(s) {
      if (!truthy(s.env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS)) return null
      return {
        severity: 'info',
        title: 'Los equipos de agentes están activados',
        detail:
          'Cada compañero tiene su propia ventana de contexto y la documentación estima que los equipos consumen unas 7 veces ' +
          'los tokens de una sesión estándar cuando los compañeros se ejecutan en modo plan. Mantén equipos pequeños, usa Sonnet ' +
          'para los compañeros y ciérralos cuando terminen su trabajo.',
        doc: `${DOCS.costs}#agent-team-token-costs`,
      }
    },
  },
  {
    id: 'main-model-expensive',
    run(s) {
      const family = modelFamily(mainModel(s))
      if (family !== 'opus' && family !== 'fable') return null
      return {
        severity: 'info',
        title: `El modelo predeterminado es ${mainModel(s)}`,
        detail:
          'La documentación señala dejar Opus como predeterminado como causa habitual de gastos inesperadamente altos. Para la mayoría ' +
          'del trabajo de programación Sonnet basta (`/model sonnet`, o `model` en los ajustes). ' +
          'Conserva el modelo más potente si todo el trabajo lo necesita.',
        doc: `${DOCS.costs}#choose-the-right-model`,
      }
    },
  },
  {
    id: 'agents-inherit-model',
    run(s) {
      const inheriting = [...s.agents.user, ...s.agents.project].filter((a) => !a.model || a.model === 'inherit')
      if (!inheriting.length) return null
      const names = inheriting.map((a) => a.name)
      return {
        severity: 'info',
        title: 'Los agentes personalizados usan el modelo principal',
        detail:
          `${names.slice(0, 8).join(', ')}${names.length > 8 ? ` y ${names.length - 8} más` : ''} ` +
          'no definen `model`, así que usan el modelo de la conversación principal. Fija `model: haiku` o `sonnet` ' +
          'en los agentes que solo buscan, ejecutan comandos o resumen; deja heredado a los que requieren mucho razonamiento.',
        doc: `${DOCS.subagents}#choose-a-model`,
      }
    },
  },
  {
    id: 'compact-instructions-missing',
    run(s) {
      if (!s.instructionFiles.length || s.instructionFiles.some((f) => f.compactInstructions)) return null
      return {
        severity: 'info',
        title: 'No hay sección «Compact instructions»',
        detail:
          'Una sección `# Compact instructions` en CLAUDE.md indica a la compactación qué conservar ' +
          '(salida de pruebas fallidas, archivos modificados, decisiones) y qué descartar, para que el resumen no pierda el hilo. ' +
          'Se escribe para tu proyecto, así que no hay una corrección automática.',
        doc: `${DOCS.costs}#manage-context-proactively`,
      }
    },
  },
  {
    id: 'large-lockfile-readable',
    run(s) {
      const deny = SCOPES.flatMap((sc) => s.settings[sc].permissions?.deny ?? [])
      const open = s.lockfiles.filter((l) => !deny.some((rule) => String(rule).includes(l.name)))
      if (!open.length) return null
      return {
        severity: 'info',
        title: 'Los lockfiles grandes se pueden leer completos',
        detail:
          open.map((l) => `${l.name}（${Math.round(l.bytes / 1000)} KB）`).join('；') +
          '. Un modelo que abre uno gasta decenas de miles de tokens en contenido que podría buscar con grep. ' +
          'Las reglas de denegación son un intento para las herramientas de búsqueda y no cubren lecturas mediante Bash.',
        doc: 'https://code.claude.com/docs/en/permissions.md',
        fixes: [{ scope: 'project', ops: [{ op: 'add', key: 'permissions.deny', values: open.map((l) => `Read(./${l.name})`) }] }],
      }
    },
  },
  {
    id: 'duplicate-skills',
    run(s) {
      const dup = s.userSkillNames.filter((n) => s.projectSkillNames.includes(n))
      if (!dup.length) return null
      return {
        severity: 'info',
        title: 'La misma habilidad existe en el nivel de usuario y de proyecto',
        detail: `${dup.join(', ')}. Cada copia añade una descripción al contexto; conserva la que quieras.`,
        doc: DOCS.skills,
      }
    },
  },
  {
    id: 'mcp-output-limit-raised',
    run(s) {
      const n = Number(s.env.MAX_MCP_OUTPUT_TOKENS)
      if (!Number.isFinite(n) || n <= 50000) return null
      return {
        severity: 'info',
        title: 'El límite de salida de herramientas MCP está elevado',
        detail:
          `MAX_MCP_OUTPUT_TOKENS es ${n.toLocaleString('en')}. Un solo resultado de herramienta puede añadir tanto ` +
          'al contexto y se relee en cada petición posterior. Súbelo solo para un servidor que lo necesite.',
        doc: 'https://code.claude.com/docs/en/env-vars.md',
      }
    },
  },
  {
    id: 'auto-compact-off',
    run(s) {
      // DISABLE_COMPACT turns /compact off too (env-vars.md), and with it the slide, which runs only
      // where Claude Code compacts.
      const vars = ['DISABLE_AUTO_COMPACT', 'DISABLE_COMPACT'].filter((k) => truthy(s.env[k]))
      const scopes = SCOPES.filter((sc) => s.settings[sc].autoCompactEnabled === false)
      if (!vars.length && !scopes.length) return null
      const where = [...vars, ...scopes.map((sc) => `autoCompactEnabled: false en los ajustes de ${sc}`)]
      return {
        severity: 'warn',
        title: 'La compactación automática está desactivada',
        detail:
          `${where.join('; ')}. Sin ella, cada petición arrastra todo el historial hasta que se llena la ` +
          'ventana del modelo, y la compactación por inactividad también está desactivada. /compact sigue funcionando manualmente.',
        doc: `${DOCS.model}#set-the-auto-compact-window`,
        fixes: scopes.map((scope) => ({ scope, ops: [{ op: 'unset', key: 'autoCompactEnabled' }] })),
      }
    },
  },
  {
    id: 'idle-compaction-off',
    since: '2.1.290',
    run(s) {
      const scopes = SCOPES.filter((sc) => s.settings[sc].idleCompaction === false)
      if (!scopes.length) return null
      return {
        severity: 'info',
        title: 'La compactación por inactividad está desactivada',
        detail:
          `\`idleCompaction: false\` en los ajustes de ${scopes.join(', ')}. Esta compactación acorta una conversación ` +
          'larga (más de 200K tokens por defecto) poco antes de que caduque su caché de prompting de una hora, ' +
          'para que al volver tras una pausa no haya que releer todo el historial sin caché.',
        doc: `${DOCS.settings.replace('settings.md', 'settings-reference.md')}#idlecompaction`,
        fixes: scopes.map((scope) => ({ scope, ops: [{ op: 'unset', key: 'idleCompaction' }] })),
      }
    },
  },
  {
    id: 'tool-search-off',
    run(s) {
      if (String(s.env.ENABLE_TOOL_SEARCH ?? '').toLowerCase() !== 'false') return null
      return {
        severity: s.mcpServers ? 'warn' : 'info',
        title: 'La búsqueda de herramientas MCP está desactivada',
        detail:
          'ENABLE_TOOL_SEARCH=false carga cada definición de herramienta MCP en cada petición en lugar de ' +
          `diferirlas hasta su uso${s.mcpServers ? ` (${s.mcpServers} servidores MCP configurados)` : ''}. ` +
          'Desactívala o usa `auto` para diferirlas cuando superen el 10 % de la ventana.',
        doc: 'https://code.claude.com/docs/en/mcp.md#configure-tool-search',
      }
    },
  },
  {
    id: 'bash-output-raised',
    run(s) {
      const setting = SCOPES.map((sc) => s.settings[sc].bashOutputMaxChars).find((v) => v !== undefined)
      const value = Number(setting ?? s.env.BASH_MAX_OUTPUT_LENGTH)
      if (!(value > 30000)) return null
      return {
        severity: 'info',
        title: 'El límite de salida de Bash está elevado',
        detail:
          `${setting !== undefined ? 'bashOutputMaxChars' : 'BASH_MAX_OUTPUT_LENGTH'} es ${value} ` +
          '(predeterminado: 30 000 caracteres). La salida larga de comandos permanece en el contexto el resto de la ' +
          'conversación y se reenvía con cada petición.',
        doc: 'https://code.claude.com/docs/en/tools-reference.md#output-limits',
      }
    },
  },
  // The three below read the current docs (lib/docs.mjs); without them they say nothing.
  {
    id: 'settings-key-undocumented',
    run(s) {
      if (!s.docs) return null
      // Keys with a rule of their own, and the schema pointer editors use.
      const known = new Set(['$schema', 'autoCompactThreshold'])
      const found = SCOPES.flatMap((sc) => Object.keys(s.settings[sc]).filter((k) => !known.has(k) && !s.docs.settings.has(k)).map((k) => `${k} (${sc})`))
      if (!found.length) return null
      return {
        severity: 'warn',
        title: `${found.length} claves de ajustes no figuran en la documentación de Claude Code`,
        detail:
          `${found.join(', ')}. Claude Code ignora las claves que no conoce, así que una clave mal escrita o retirada ` +
          'simplemente no hace nada. Comparueba la ortografía con la referencia de ajustes leída hoy.',
        doc: 'https://code.claude.com/docs/en/settings-reference.md',
      }
    },
  },
  {
    id: 'env-undocumented',
    run(s) {
      if (!s.docs) return null
      // Variables of Claude Code's own families: anything else may well be for a tool or an MCP server.
      const ours = /^(CLAUDE_|ANTHROPIC_|DISABLE_|ENABLE_|MAX_|BASH_|MCP_|FORCE_)/
      const found = SCOPES.flatMap((sc) => Object.keys(s.settings[sc].env ?? {}).filter((k) => ours.test(k) && !s.docs.env.has(k)).map((k) => `${k} (${sc})`))
      if (!found.length) return null
      return {
        severity: 'info',
        title: `${found.length} variables de entorno parecen de Claude Code pero no están documentadas`,
        detail:
          `${found.join(', ')}, definidas bajo \`env\`. Claude Code solo lee las variables que conoce: una mal escrita o ` +
          'retirada no hace nada. Ignora este aviso si la variable es para otro programa.',
        doc: 'https://code.claude.com/docs/en/env-vars.md',
      }
    },
  },
  {
    id: 'setting-needs-newer-version',
    run(s) {
      if (!s.docs || !s.version) return null
      const newer = (v) => v && compareVersions(v, s.version) > 0
      const found = [
        ...SCOPES.flatMap((sc) => Object.keys(s.settings[sc]).filter((k) => newer(s.docs.settings.get(k))).map((k) => `${k} (needs ${s.docs.settings.get(k)})`)),
        ...SCOPES.flatMap((sc) => Object.keys(s.settings[sc].env ?? {}).filter((k) => newer(s.docs.env.get(k))).map((k) => `${k} (needs ${s.docs.env.get(k)})`)),
      ]
      if (!found.length) return null
      return {
        severity: 'warn',
        title: `${found.length} ajustes requieren una versión de Claude Code más reciente que ${s.version}`,
        detail: `${[...new Set(found)].join(', ')}. Una versión anterior los ignora. Actualiza Claude Code (\`claude update\`).`,
        doc: 'https://code.claude.com/docs/en/setup.md#update-claude-code',
      }
    },
  },
  {
    id: 'compact-pct-override',
    run(s) {
      const raw = s.env.CLAUDE_AUTOCOMPACT_PCT_OVERRIDE
      if (raw === undefined || raw === '') return null
      const pct = Number(raw)
      if (!Number.isInteger(pct) || pct < 1 || pct > 100) {
        return {
          severity: 'error',
          title: 'CLAUDE_AUTOCOMPACT_PCT_OVERRIDE no es un porcentaje',
          detail: `Es "${raw}"; Claude Code espera un número entero de 1 a 100 e ignora cualquier otro valor.`,
          doc: 'https://code.claude.com/docs/en/env-vars.md',
        }
      }
      const window = Number(String(SCOPES.map((sc) => s.settings[sc].autoCompactWindow).find(Boolean) ?? '').replace(/k$/i, '000')) || null
      return {
        severity: pct < 50 ? 'warn' : 'info',
        title: `La compactación automática se activa en el ${pct} % de la ventana`,
        detail:
          `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=${pct}${window ? `: unos ${Math.round((window * pct) / 100000)}K de la ventana de ${Math.round(window / 1000)}K` : ''}. ` +
          'Solo puede bajar el umbral (un valor superior al predeterminado se ignora) y también afecta a los subagentes. ' +
          'Definir `autoCompactWindow` con ese tamaño expresa lo mismo en un solo lugar y muestra el punto correcto en la línea de estado. ' +
          (pct < 50 ? 'Por debajo de la mitad, las compactaciones son frecuentes y cada una reenvía la conversación sin caché.' : ''),
        doc: `${DOCS.model}#context-window-and-auto-compaction`,
      }
    },
  },
  {
    id: 'skill-model-switch',
    run(s) {
      // With no model set the default depends on the plan, so only a known main model is compared.
      const main = modelFamily(mainModel(s))
      if (!main) return null
      const switching = (s.skills?.models ?? []).filter((k) => !k.fork && modelFamily(k.model) !== main)
      if (!switching.length) return null
      return {
        severity: 'info',
        title: `${switching.length} habilidades cambian de modelo al usarse`,
        detail:
          `${switching.map((k) => `${k.name} (modelo: ${k.model})`).join(', ')}. Una habilidad cuyo frontmatter nombra otro modelo ` +
          'cambia el modelo en ese turno: cada modelo tiene su propia caché de prompting, así que la petición lee toda ' +
          'la conversación sin caché. Con `context: fork` la habilidad se ejecuta como subagente en ese modelo y la conversación ' +
          'principal conserva su caché; o elimina `model` para seguir con el modelo de la sesión.',
        doc: 'https://code.claude.com/docs/en/prompt-caching.md#switching-models',
      }
    },
  },
  {
    id: 'opusplan-cache',
    run(s) {
      if (mainModel(s) !== 'opusplan') return null
      return {
        severity: 'info',
        title: 'opusplan cambia de modelo en cada alternancia del modo plan',
        detail:
          '`opusplan` usa Opus en modo plan y Sonnet en los demás. Cada modelo tiene su propia caché de prompting, por lo que cada ' +
          'cambio vuelve a leer toda la conversación sin caché en el modelo seleccionado. Barato al inicio de una sesión, ' +
          'costoso en una larga: haz el plan en una sesión nueva o elige un solo modelo.',
        doc: 'https://code.claude.com/docs/en/prompt-caching.md#switching-models',
      }
    },
  },
  {
    id: 'slide-blocked-by-guard',
    run(s) {
      const on = SCOPES.some((sc) =>
        [USER_ID, ORG_ID].some((id) => s.settings[sc].pluginConfigs?.[id]?.options?.slide === true),
      )
      if (!on || !s.guard) return null
      const note = blockedNote(s.guard)
      if (!note) return null
      return {
        severity: 'warn',
        title: 'El deslizamiento está activado pero no puede ejecutarse aquí',
        detail: note,
        doc: 'https://code.claude.com/docs/en/plugins/mods/admin.md#know-which-hooks-of-a-users-mod-dont-run',
      }
    },
  },
  {
    id: 'no-statusline',
    run(s) {
      if (SCOPES.some((sc) => s.settings[sc].statusLine)) return null
      return {
        severity: 'info',
        title: 'No hay línea de estado',
        detail:
          'Una línea de estado puede mostrar la ocupación del contexto y el estado de la caché de prompting (campos `context_window` y ' +
          '`prompt_cache`), la forma más fácil de ver cuándo conviene /clear o compactar. La ' +
          'corrección instala un pequeño script que muestra en una línea discreta el modelo, la carpeta y la rama, ' +
          'los tokens en contexto frente al punto de compactación, cuánto dura la caché, los límites de cinco horas y semanal ' +
          '(con «→ 100% in» cuando al ritmo actual se agotan antes del reinicio) y el coste de la sesión. ' +
          'Necesita jq y es un archivo normal que puedes editar. ' +
          'Otra forma de ver lo mismo: el mod token-weather de anthropics/claude-code-playground ' +
          '(claude-code/mods/token-weather) dibuja una previsión de contexto en la banda sobre el prompt. ' +
          'Requiere Claude Code 2.1.287 o posterior, se comparte tal cual y no es un producto oficial; ' +
          'instálalo desde un clon con `claude plugin marketplace add ./` en la carpeta mods.',
        doc: 'https://code.claude.com/docs/en/statusline.md',
        fixes: [
          { scope: 'user', script: 'statusline.sh' },
          {
            scope: 'user',
            ops: [
              {
                op: 'set',
                key: 'statusLine',
                value: { type: 'command', command: `${s.configDir ?? '~/.claude'}/tokendoctor-statusline.sh`, refreshInterval: 30 },
              },
            ],
          },
        ],
      }
    },
  },
]

export function runRules(snapshot) {
  const findings = []
  for (const rule of RULES) {
    if (rule.since && snapshot.version && compareVersions(snapshot.version, rule.since) < 0) continue
    const f = rule.run(snapshot)
    if (f) findings.push({ id: rule.id, ...f })
  }
  const order = { error: 0, warn: 1, info: 2 }
  return findings.sort((a, b) => order[a.severity] - order[b.severity])
}

export const ruleIds = RULES.map((r) => r.id)