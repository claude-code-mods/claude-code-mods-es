<h1 align="center">compact-adviser</h1>

<p align="center">
  <a href="https://github.com/kunchenguid/compact-adviser/blob/main/LICENSE"
    ><img
      alt="Licencia"
      src="https://img.shields.io/badge/license-MIT-green?style=flat-square"
  /></a>
  <a
    href="https://img.shields.io/badge/platform-macOS%20%7C%20Linux-blue?style=flat-square"
    ><img
      alt="Plataforma"
      src="https://img.shields.io/badge/platform-macOS%20%7C%20Linux-blue?style=flat-square"
  /></a>
  <a href="https://x.com/kunchenguid"
    ><img
      alt="X"
      src="https://img.shields.io/badge/X-@kunchenguid-black?style=flat-square"
  /></a>
  <a href="https://discord.gg/Wsy2NpnZDu"
    ><img
      alt="Discord"
      src="https://img.shields.io/discord/1439901831038763092?style=flat-square&label=discord"
  /></a>
</p>

**compact-adviser** es un plugin de agente que responde a una sola pregunta: ¿debo ejecutar /compact ahora?

![Línea de estado de compact-adviser: "Compact adviser: work appears completed or recorded. Run /compact to save tokens." mostrada sobre un prompt de terminal](https://raw.githubusercontent.com/kunchenguid/compact-adviser/main/docs/hint-status-line.png)

Usa [Jev](https://typesafe.ai) para juzgar al instante si la sesión actual está probablemente en un límite seguro para compactar.

Puede darte una pista para ejecutar `/compact` o, en Pi y Claude Code, si tú lo activas, ejecutarlo automáticamente en el momento adecuado. Codex CLI y Grok solo muestran pistas: nada fuera de sus sesiones puede disparar `/compact`.

El juicio son dos preguntas de una frase a Jev en una sola petición (¿está terminada la unidad? ¿es trabajo práctico o coordinación?), compuestas en código en una única puntuación. El umbral mínimo de la pista es 0,90 mientras el contexto está casi vacío (hasta aproximadamente el 10 %) y se relaja hasta 0,50 alrededor del 90 % de ocupación: una pista errónea cuesta más cuando todavía queda espacio. «Lleno» significa el punto en el que el host compacta: en Claude Code, su umbral de compactación automática cuando está activada; en los demás, la ventana del modelo. Si prefieres compactar mucho antes (los contextos largos cuestan más en cada turno), establece un presupuesto de contexto: entonces el umbral se relaja a medida que el contexto se acerca al menor entre tu presupuesto y ese punto. El modo automático es la misma comprobación, más una confirmación en el primer uso.

## Inicio rápido

Requisitos: Node 22 o superior (22.18 o superior para Codex y Grok), y una de [Pi](https://pi.dev) 0.82.0 o superior (verificado en **0.85.1**), Claude Code 2.1.274 o superior (verificado en **2.1.275**), Codex CLI 0.153.0 o superior (verificado en **0.153.4**) o [Grok Build](https://docs.x.ai/build/overview) 1.0.34 o superior (verificado en **1.0.34**), además de una [clave de API de TypeSafe](https://console.typesafe.ai/settings/keys). Proporciónala como `TYPESAFE_API_KEY` en el entorno de lanzamiento o colócala en el `./.env` del directorio de la sesión; Pi y Claude Code también pueden guardarla mediante sus ajustes, mientras que Codex y Grok ofrecen una CLI externa de compact-adviser. Jev es el modelo de decisión estructurada de TypeSafe; este paquete le hace dos preguntas de clasificación de una frase y nunca le pide que escriba un resumen.

Instalar el paquete supone consentir el envío del contexto de puntos de control aptos a TypeSafe cuando hay una clave disponible y se cumplen las demás condiciones del producto. Con `TYPESAFE_BASE` definido, ese contexto y la clave se envían a esa base en su lugar.

### Pi

```sh
pi install npm:compact-adviser
```

Reinicia Pi o ejecuta `/reload` y luego `/compact-adviser`.
`/compact-adviser status` debería indicar `Key: env`, `Key: saved` o `Key: .env`.

Para instalar desde git: `pi install git:github.com/kunchenguid/compact-adviser` (añade `-l` para instalarlo solo en el proyecto).

### Claude Code

Este plugin usa Claude Mod, una función experimental que requiere `CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1` en tu entorno.

```sh
claude plugin marketplace add kunchenguid/compact-adviser
claude plugin install compact-adviser@claude-code-mods-es
CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1 claude
```

Después, `/compact-adviser`.

### Codex CLI

La compatibilidad con Codex es **solo para macOS y Linux**. Los hooks del plugin se ejecutan mediante `sh` POSIX, acorde con la insignia de plataformas de este repositorio; Windows no es compatible en esta versión.

```sh
codex plugin marketplace add kunchenguid/compact-adviser
codex plugin add compact-adviser@claude-code-mods-es
```

Reinicia Codex y revisa una vez el hook en `/hooks` para que sea de confianza. Tras un punto de control completado, el consejo aparece como una línea `↳ Hook · Compact adviser: ...` bajo la respuesta.

Codex solo ofrece **pistas**: no tiene ninguna superficie que permita a otro proceso ejecutar `/compact`, así que allí no hay modo automático. Los ajustes están en una pequeña CLI en lugar de un comando de barra; pide a Codex «compact-adviser status» y el skill incluido lo ejecutará, o ejecútalo tú mismo:

```sh
node "$(ls -d "${CODEX_HOME:-$HOME/.codex}"/plugins/cache/*/compact-adviser/*/ | tail -1)src/cli.ts" status
```

### Grok Build

Grok solo ofrece **pistas**: nada fuera de una sesión en curso puede disparar `/compact`, así que aquí no hay modo automático. La pista se pinta en la fila de estado y nunca entra en el contexto del modelo.

```sh
grok plugin install kunchenguid/compact-adviser#packages/grok-plugin --trust
```

(Instala desde el subdirectorio, no desde la raíz del repositorio: Grok también lee el índice del marketplace de Claude en este repo, así que un `grok plugin marketplace add` normal ofrece dos plugins con el mismo nombre y rechaza una instalación sin calificar.)

Después hay dos pasos únicos, porque Grok no permite que un plugin los haga por ti. Inicia Grok y ejecuta:

```
/compact-adviser-install
```

Eso escribe `${GROK_HOME:-~/.grok}/hooks/compact-adviser.json`, porque **Grok 1.0.34 enumera el `hooks/hooks.json` propio de un plugin pero nunca lo carga en una sesión**. Los hooks de tu propia carpeta Grok son siempre de confianza, así que no hace falta nada más; elimina ese archivo para quitarlos. Desde un shell sería `node "$(node -e 'const l=JSON.parse(require("child_process").execFileSync("grok",["plugin","list","--json"],{encoding:"utf8"})); const p=(Array.isArray(l)?l:[]).find(x=>x&&x.name==="compact-adviser"); if(!p||typeof p.path!=="string") throw new Error("compact-adviser is not installed"); process.stdout.write(p.path)')/bin/adviser.ts" install`. Tras `install`, `${GROK_HOME:-~/.grok}/compact-adviser/adviser.sh` resuelve el plugin instalado actualmente de la misma manera.

Después pega el bloque `[ui.status_line]` que imprimió `install` en la ruta config.toml que indicó y reinicia Grok. La fila de estado está desactivada por defecto y solo tu propia configuración puede activarla; no pueden hacerlo un plugin ni un repositorio. Grok tiene una sola fila de estado, así que este script pinta también los segmentos integrados (`cwd`, `model`, `context`). El modo de renderizado minimalista no tiene fila de estado.

En Grok, guarda la clave de TypeSafe como `TYPESAFE_API_KEY`, en un `.env` del directorio de trabajo o con el comando `key` de la CLI desde un shell fuera de Grok. No escribas secretos después de un comando de barra de Grok; Grok añade esas palabras al modelo.

## Si no hace nada

| Síntoma | Causa |
| --- | --- |
| TypeSafe exige pago (HTTP 402) | Comprueba la facturación y los créditos de la cuenta de TypeSafe; esperar no resolverá un requisito de pago. El contexto permanece sin cambios. |
| `Key: missing` en `/compact-adviser status` (Pi, Claude Code) o `/compact-adviser` (Grok) | No hay `TYPESAFE_API_KEY` en el entorno de lanzamiento, los ajustes guardados ni el `./.env` del directorio de la sesión |
| No hay comando `/compact-adviser` en Claude Code | `CLAUDE_CODE_ENABLE_FUNCTION_HOOKS` no es exactamente `1` |
| El comando existe, pero no hay pista | El contexto está por debajo del mínimo constante de 40.000 tokens, la sesión no está inactiva o el último turno no fue una respuesta final asentada |
| Claude Code: «tráfico no esencial» | `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` bloquea las peticiones de red del plugin |
| Sin pista en Codex | El hook no es de confianza (revísalo en `/hooks`), Node es anterior a 22.18 o el hook no encuentra Node: Codex reconstruye su PATH, así que define `COMPACT_ADVISER_NODE` con una ruta absoluta a `node` |
| Grok: no aparece ninguna fila de pista | `[ui.status_line]` no está configurado en el `config.toml` que indicó `install`, o Grok está en modo de renderizado minimalista |
| Grok: no hay pista tras un turno completado | No se ha ejecutado `/compact-adviser-install`, así que ningún hook Stop está juzgando |
| Salida print / RPC / JSON de Pi, `-p` de Claude o `codex exec` | El asesor permanece inactivo en sesiones no interactivas detectadas de forma fiable |
| Nada en absoluto, en ningún host | `COMPACT_ADVISER_DISABLE` tiene un valor verdadero |

## Variables de entorno

| Variable | Efecto |
| --- | --- |
| `TYPESAFE_API_KEY` | La clave de Jev; si no está definida, se usa una clave guardada o el `./.env` del directorio de la sesión |
| `TYPESAFE_BASE` | Reemplaza la URL base de la API de TypeSafe, `https://api.typesafe.ai` por defecto; la petición va a `<base>/v1/systemone`, sin la barra final. Se lee solo del entorno de lanzamiento, nunca de un ajuste guardado ni de `./.env`. Debe ser una URL `https`; `http` simple solo se acepta para un host de loopback (`127.0.0.1`, `[::1]`, `localhost`). Cualquier otro valor, o uno que contenga credenciales, consulta o fragmento, es un error de configuración: no hay petición ni consejo |
| `COMPACT_ADVISER_DISABLE` | `1`, `true`, `yes` u `on` (en cualquier caso) dejan la sesión inactiva: sin petición a TypeSafe, sin pista, sin compactación automática, sin comando. prevalece sobre un modo `hint` o `auto` guardado |
| `CLAUDE_CODE_ENABLE_FUNCTION_HOOKS` | Solo Claude Code; debe ser exactamente `1` para que se cargue el mod |
| `COMPACT_ADVISER_NODE` | Solo Codex; ruta absoluta a un ejecutable Node 22.18 o superior cuando el hook no encuentra uno en su PATH reconstruido |

Exporta `COMPACT_ADVISER_DISABLE=1` para sesiones de agente desatendidas, donde nadie puede leer los consejos.

## Qué se envía a TypeSafe

| Incluido | No se envía |
| --- | --- |
| Restricciones del usuario acotadas, hasta las últimas 64 respuestas y resultados de herramientas visibles (recortados), extractos breves de resultados de herramientas, un resumen existente, nombres de artefactos guardados, marcadores de omisión | Prompts de sistema, razonamiento oculto, imágenes, variables de entorno, la clave de API en el contexto y el cuerpo de la petición, transcripciones completas |
| Ocultación por el mejor esfuerzo de patrones de clave conocidos y resultados obvios de archivos sensibles | Una garantía. Desinstala o establece el modo Off para el material que no deba salir de la máquina |

Las peticiones van a `https://api.typesafe.ai/v1/systemone`, o a `<TYPESAFE_BASE>/v1/systemone` si está definido, están limitadas a 32.000 bytes UTF-8 serializados y nunca tratan un error como un juicio afirmativo.
La clave de API de TypeSafe nunca entra en el contexto del modelo ni en el cuerpo de la petición; se envía como cabecera Authorization para autenticar la llamada.
Detalles: [SECURITY.md](https://github.com/kunchenguid/compact-adviser/blob/main/SECURITY.md).

## Cómo funciona

```
settled turn
      │
      ▼
┌───────────────────┐
│ cheap local gates │  mode, 40k minimum, idle session, key, cooldowns
└─────────┬─────────┘
          ▼
┌───────────────────┐
│ TypeSafe Jev      │  done × shape score, floor slides 0.90→0.50 with usage
└─────────┬─────────┘
          ▼
 hint: run /compact     or, with explicit auto, native compaction
```

La compactación automática está disponible en Pi y Claude Code. En Codex, el mismo juicio solo produce la pista, como una línea `↳ Hook ·` en el historial. En Grok, las dos mitades son procesos separados: un hook `Stop` juzga y registra un veredicto, y el script `[ui.status_line]` lee ese veredicto y pinta la pista. El hook de Grok siempre permite la parada y no imprime nada, así que una pista nunca puede realimentarse en el modelo.

En Claude Code, un ajuste opcional `beforeCompactPrompt` (vacío por defecto; configúralo en `/config`) ejecuta un turno antes de esa compactación automática, y solo después de confirmarse el modo automático. Define `/stow` para ejecutar primero el comando `stow`. Claude Code no expande comandos de barra ni menciones `@file` en una solicitud enviada por un plugin, y rechaza una solicitud de plugin que empiece por `/`, así que un valor que empieza por `/` se ejecuta como comando en lugar de enviarse al modelo como texto. Si envías tu propia solicitud o ejecutas un comando de por medio, o ese turno se interrumpe, da error o no termina en 5 minutos, no se compacta nada. El modo de pista, desactivado y un ajuste vacío no cambian. Pi, Codex y Grok no tienen este ajuste.

## Uso

| Comando | Efecto |
| --- | --- |
| `/compact-adviser` (Pi y Claude Code) | Ajustes (modo, mínimo, registro de peticiones, clave de API de TypeSafe) |
| `/compact-adviser auto` / `hint` / `off` (Pi y Claude Code) | Guarda ese modo; auto pide confirmación en el primer uso |
| `/compact-adviser status` (Pi y Claude Code) | Modo, mínimo, presupuesto, contexto, origen de la clave (`env` / `saved` / `.env` / `missing`), enfriamiento |
| `/compact-adviser threshold 60000` (Pi y Claude Code) | Guarda un mínimo absoluto de tokens |
| `/compact-adviser budget 450000` / `budget off` (Pi y Claude Code) | Guarda un presupuesto de contexto: el umbral de la pista se relaja por completo a ese número de tokens, o en el punto de compactación del host si es menor (desactivado por defecto) |
| `/compact-adviser snooze` / `dismiss` (Pi y Claude Code) | Suprime las próximas tres respuestas o borra la pista actual |
| `beforeCompactPrompt` en `/config` (Claude Code) | Texto opcional que se ejecuta antes de la compactación automática. Vacío por defecto. `/stow` ejecuta ese comando |
| `/compact-adviser` (Grok) | Muestra el estado; no añadas argumentos porque Grok los envía al modelo |
| `/compact-adviser-hint` / `/compact-adviser-off` (Grok) | Guarda el modo solo de pista o desactiva el asesor |
| `/compact-adviser-snooze` / `/compact-adviser-dismiss` (Grok) | Suprime las próximas tres respuestas o borra la pista actual |
| `/compact-adviser-install` (Grok) | Registra los hooks e imprime el bloque de línea de estado para pegar en el `config.toml` indicado |
| `${GROK_HOME:-$HOME/.grok}/compact-adviser/adviser.sh threshold 60000` (shell de Grok) | Guarda un mínimo absoluto de tokens; `budget <tokens\|off>` guarda un presupuesto de contexto; `help` enumera los demás ajustes exclusivos del shell |

En Codex, los mismos comandos son argumentos del `src/cli.ts` del plugin (`status`, `hint`, `off`, `threshold`, `budget <tokens|off>`, `log on|off`, `key set|clear|status`) en lugar de un comando de barra, porque los plugins de Codex no pueden registrar un comando con código detrás. Codex no tiene snooze ni dismiss: la CLI no sabe qué sesión es la actual.

## Perfiles de juez

Un [perfil de juez](https://github.com/kunchenguid/compact-adviser/blob/main/docs/judge-profiles.md) opcional cambia las dos preguntas, el peso de la puntuación o la progresión del umbral sin modificar los valores predeterminados. Los cuatro hosts aceptan la misma cadena JSON acotada en el ajuste `profile`. Mantén el modo de pista mientras evalúas un perfil. Los perfiles no válidos desactivan los consejos, y cargar un perfil nunca otorga consentimiento para el modo automático.

## Evaluación

La evaluación local del juicio usa puntos de control reales de sesiones para puntuar cuándo el asesor debería sugerir `/compact`. La curva siguiente procede de un conjunto de referencia sensible al seguimiento (96 puntos de control, 40 sesiones): a medida que se llena la ventana de contexto, el umbral de puntuación se relaja de **0,90** (≤10 % usado) a **0,50** (≥90 % usado) para que **aumente la recuperación** mientras la precisión se mantiene alta, favoreciendo el ahorro de tokens cuando la compactación va a ser forzosa de todos modos.

![Usa Jev para responder «¿debo ejecutar /compact ahora?»: la precisión se mantiene alta mientras aumenta la recuperación a medida que el contexto usado pasa de ≤10 % a ≥90 %](https://raw.githubusercontent.com/kunchenguid/compact-adviser/main/docs/eval-usage-floor-curve.png)

El arnés de evaluación está en [packages/pi-extension/eval/](https://github.com/kunchenguid/compact-adviser/blob/main/packages/pi-extension/eval/README.md). No es un conjunto de datos publicado: apúntalo a tus propias sesiones y mantén las transcripciones en local.

## Fuente y licencia

- Autor original: [kunchenguid](https://github.com/kunchenguid/compact-adviser)
- Repositorio original: https://github.com/kunchenguid/compact-adviser
- Licencia: MIT

Traducción al español y localización de interfaz: proyecto claude-code-mods-es
