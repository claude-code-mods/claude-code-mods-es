# Flightdeck

> Versión en español por el proyecto claude-code-mods-es. El README original en inglés está en [README.en.md](README.en.md).

[![Release](https://img.shields.io/github/v/release/scasella/claude-flightdeck)](https://github.com/scasella/claude-flightdeck/releases/latest)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Claude Code 2.1.289+](https://img.shields.io/badge/Claude%20Code-2.1.289%2B%20mod-d97757.svg)](https://claude.com/blog/claude-code-mods)
[![Listed on statuslin.es](https://img.shields.io/badge/listed%20on-statuslin.es-c96442)](https://statuslin.es/mods/flightdeck)

**Un mod de Claude Code que coloca un panel de agentes en vivo en tu terminal**: contexto y coste, una línea de tiempo del asesor, cada verificación de permisos, y tus subagentes como tarjetas o carriles. Cada número proviene de un evento real de la sesión, y nada sale de tu máquina.

<p align="center">
  <img src="docs/media/demo.gif" alt="Flightdeck durante una sesión en vivo: cinco subagentes de auditoría se despliegan como tarjetas, cambian a carriles y terminan, mientras la barrera de permisos se llena de verificaciones" width="520">
</p>

<p align="center">
  <a href="#install">Instalación</a> · <a href="#what-you-see">Lo que ves</a> · <a href="#what-it-can-reach">A qué tiene acceso</a> · <a href="#configure">Configurar</a> · <a href="#troubleshooting">Solución de problemas</a> · <a href="CHANGELOG.md">Novedades</a>
</p>

## Instalación

Dentro de Claude Code (2.1.289 o posterior):
```
/plugin marketplace add scasella/claude-flightdeck
/plugin install flightdeck@claude-flightdeck
/reload-plugins
/flightdeck
```
<details>
<summary><strong>Desde la terminal, o desde un clon</strong></summary>
```sh
claude plugin marketplace add scasella/claude-flightdeck
claude plugin install flightdeck@claude-flightdeck
```
O cárgalo directamente desde un clon, para una sola sesión:
```sh
git clone https://github.com/scasella/claude-flightdeck
claude --plugin-dir ./claude-flightdeck
```
</details>

El instalador puede decir que las opciones de configuración no están establecidas; los valores predeterminados están bien, y [`/config`](#configurar) los cambia.

Los mods son una función de acceso anticipado de Claude Code y su API puede cambiar entre versiones. Si algo falla, consulta [Solución de problemas](#solución-de-problemas).

## Lo que ves

https://github.com/user-attachments/assets/9ad0fcc3-c81c-427a-a743-f7b6c49f5885

<p align="center">
  <img src="docs/media/docked-session.png" alt="Claude Code en pantalla completa con el panel de Flightdeck acoplado junto a la transcripción" width="820">
</p>

| Acoplado junto a la transcripción | En línea encima del prompt |
| --- | --- |
| <img src="docs/media/docked-pane.png" alt="El panel acoplado: signos vitales del modelo principal, línea de tiempo del arquitecto, barrera de permisos, cinco agentes como carriles, recibo de la última vuelta y registro de la sesión" width="380"> | <img src="docs/media/inline-mini.png" alt="La distribución mini en línea: el modelo, el indicador de contexto, el coste de la sesión y las consultas del arquitecto; la franja y los totales de la barrera de permisos; la duración, agentes, ediciones, errores y coste de la última vuelta" width="420"><br><br>En la pantalla principal, sin pantalla completa, el panel es un resumen de máximo 8 filas; hasta 3 agentes se unen a él cuando la sesión tiene subagentes. |

| Panel | Muestra | Fuente |
| --- | --- | --- |
| **main** | modelo, esfuerzo, modo de permisos, número de peticiones; un indicador de contexto con compactaciones (⟲, o ⟲~ cuando se [estima](#qué-se-infiere-no-qué-se-mide)), medido contra la ventana de compactación cuando la sesión compacta en una menor que la del modelo (`autoCompactWindow`, o la de Claude Code); coste y las dos primeras ventanas de límite de tasa cuando tu plan las informa, con el tiempo hasta cada reinicio (↻) desde 56 columnas; el tiempo hasta el primer token de la última petición del bucle principal | `turn.step`, `session.measure`, `session.compact`, `$.session.usage()` (en cada petición del bucle principal, y su desglose local `summary`, una vez por modelo, para la ventana de compactación); el modo de permisos a partir de `classic.UserPromptSubmit` y `agent.spawn` |
| **architect** | consultas en una línea de tiempo, si hay alguna en curso, cuánto duró la última; opcionalmente el momento de cada consulta; la primera línea del consejo de un arquitecto subagente | un spawn de un tipo de agente coincidente, o una herramienta de servidor coincidente en las filas del asistente |
| **gate** | una casilla por cada verificación de permiso: verde permitida sin preguntar, azul decidida por el clasificador del modo automático o por ti y luego ejecutada, ámbar pendiente, roja ✗ denegada, tenue si se hizo dentro de un subagente. Totales, y un desglose por familia de herramientas con las credenciales enmascaradas | `tool.check`, resuelta por el `tool.call` que la rodea |
| **agents** | tarjetas lado a lado mientras quepan: la tarea, el tipo, el contexto en vivo y los tokens de salida, los pasos, un reloj en marcha, `max_tokens` en rojo. Más allá de eso, carriles sobre un único eje temporal | `agent.spawn`, `turn.step`, `tool.call`, `turn.complete` |
| **loops** | bucles del modelo que no coinciden con ninguna tarjeta: agentes de flujo de trabajo, compactaciones, bifurcaciones de memoria | ids de `turn.step` que ninguna tarjeta reclama |
| **receipt** | la vuelta en curso, o la última: duración, agentes, ediciones, errores, coste añadido | `turn.start`, `turn.complete` |
| **log** | prompts, spawns, completions, consultas, ediciones, errores y denegaciones; filtrado a un solo agente mientras ves su transcripción | todo lo anterior |

Los conectores se animan solo mientras fluye el trabajo: hay una vuelta en curso, un agente en curso o una consulta abierta. Los paneles que no tienen nada que mostrar no ocupan espacio, así que una sesión sin subagentes muestra solo la caja principal y el registro.

## Uso

| Comando | Acción |
| --- | --- |
| `/flightdeck` | abre el panel |
| `/flightdeck close` | lo cierra |
| `/flightdeck reset` | borra agentes, verificaciones, consultas, registro y la vuelta (el coste, los límites de tasa y las compactaciones permanecen) |
| `/flightdeck layout auto\|compact\|wide\|mini` | anula la distribución para esta sesión |

Enfoca el panel con `ctrl+x tab`, y luego:

| Tecla | Acción |
| --- | --- |
| `1`, `2`, … | expande la tarjeta o el carril de un agente: su tarea completa, las últimas 3 llamadas a herramientas, el inicio de su respuesta |
| `f` `s` `o` | abre el desglose de archivo / shell / otro de la barrera: las últimas 5 verificaciones y sus veredictos |

`/clear` restablece el panel junto con la conversación.

## Dónde se ejecuta

- **Terminal a pantalla completa:** acoplado junto a la transcripción; dos columnas desde 110 columnas de ancho.
- **Terminal en pantalla principal:** en línea encima del prompt, como el resumen de 8 filas.
- **Aplicación de escritorio, VS Code, móvil:** los mismos paneles, más los agentes dibujados como un eje temporal SVG. VS Code y móvil no pueden animar, así que ahí los conectores y los relojes son estáticos. (La extensión de VS Code puede no mostrar ningún panel aún: consulta [Solución de problemas](#solución-de-problemas).)

Con `openOnStart`, el panel se abre solo cuando comienza una sesión, en terminales de al menos 144 columnas de ancho; por debajo de eso, `/flightdeck` lo abre. Los colores provienen de tu tema de Claude Code, así que los temas claro, oscuro y aptos para daltonismo se leen todos correctamente.

## A qué tiene acceso

Flightdeck solo observa. Cada hook pasa su evento sin modificar: nunca deniega, reescribe ni retrasa una llamada a herramientas, un prompt ni un subagente.
| Lo que ve | A través de |
| --- | --- |
| el nombre y la entrada de cada llamada de herramienta, y si falló | `tool.call` |
| cada veredicto de permiso | `tool.check` |
| los lanzamientos de subagentes, sus solicitudes de modelo y uso de tokens, y sus respuestas finales | `agent.spawn`, `turn.step`, `turn.complete` |
| los primeros 70 caracteres de tus prompts, para el registro | `turn.start` |
| lecturas de contexto, coste y límite de tasa | `session.measure`, `$.session.usage()` |
| el desglose de contexto que muestra `/context` (sus categorías, rutas de archivos de memoria, herramientas MCP, agentes y skills), estimado localmente una vez por modelo; solo conserva de él la ventana de compactación | `$.session.usage({ breakdown: 'summary' })` |
| las llamadas de herramienta del advisor en las respuestas del asistente (su contenido está cifrado) | `session.append` |

Qué conserva: resúmenes cortos (el nombre de una herramienta más una ruta o un comando, el inicio de cada prompt, la tarea y la respuesta de un agente, el consejo del architect, todo con las credenciales enmascaradas) en el estado de la sesión, que termina junto con la sesión. **No** realiza peticiones de red, no ejecuta procesos, no lee ni escribe archivos, no guarda nada entre sesiones y no llama a ningún modelo. `claude plugin validate .` imprime exactamente a qué hooks llama y qué invoca.

## Qué se infiere, no qué se mide

- **Momentos del architect.** «Before a plan» significa que aún no hay ediciones en este turno, «error repeats» significa 2+ errores seguidos del bucle principal, «before done» significa que se hicieron ediciones. Se etiquetan como `(inferred)`; desactívalos con `moments: false`.
- **Compactaciones bajo la guarda integrada.** Donde la guarda de Claude Code impide que `session.compact` llegue a Flightdeck (ver [Solución de problemas](#solución-de-problemas)), el recuento se estima. Claude Code no reporta relleno de contexto hasta la primera respuesta después de una sesión nueva, un `/clear` o una compactación. Así que una petición del bucle principal que no encuentra relleno después de que una respuesta regresó cuenta como una compactación. El cuadro principal muestra `⟲~1`, con `(estimated)` cuando hay espacio, y el registro dice `context compacted (estimated)`. Un retroceso hasta tu primer prompt se lee de la misma manera, así que también cuenta. Dondequiera que se ejecute `session.compact`, su recuento reemplaza a la estimación.
- **El consejo del lado del servidor está cifrado.** Para una herramienta de servidor como el `advisor` de Claude Code, el panel cuenta y cronometra la consulta pero no puede mostrar lo que dijo.
- **El contexto por agente es la entrada completa de la última solicitud** (sin caché + lectura de caché + escritura de caché). Se etiqueta como `ctx`, no como coste: la API no tiene coste por agente.
- **Otros bucles** no pueden distinguir un agente de un workflow de una bifurcación de compactación; ambos son bucles de modelo que ninguna tarjeta reclama.
- **El primer paso de un agente en segundo plano** puede llegar antes de que exista su tarjeta, así que su uso puede mostrarse un paso tarde.
- **Contexto frente a la ventana de compactación.** Cuando la sesión compacta en una ventana más pequeña que la del modelo, el indicador, `tokens/window` y el `ctx N%` de la línea de estado se miden contra esa ventana, así que se leen más altos que el porcentaje de la propia línea de estado de Claude Code (y el de claude-hud), que se miden contra la ventana del modelo. La auto-compactación se ejecuta un poco antes del 100%, en su umbral dentro de esa ventana.
- **Tiempo hasta el primer token.** `ttft` se cronometra en el hook `turn.step` propio de Flightdeck, así que incluye todo lo que hay debajo: los hooks de otros plugins, el motor, la red y cualquier reintento. Cuando el pensamiento del modelo no se transmite en streaming, la primera pieza llega después de él, así que `ttft` incluye el pensamiento. Medido, no inferido, pero no la cifra propia de la API. No hay tasa de salida: los tokens reportados incluyen el pensamiento, así que una tasa sobre el flujo visible no es una velocidad real.

## Configurar

En `/config`, o bajo `pluginConfigs[<id>].options` en tu `settings.json` de usuario, donde `<id>` es cómo Claude Code cargó el plugin: `flightdeck@claude-flightdeck` cuando se instaló desde el marketplace, `flightdeck` (o `flightdeck@inline`) con `--plugin-dir`. Una entrada bajo otra clave, o en la configuración del proyecto (`.claude/settings.json`), se ignora sin avisar. Desde una terminal, `claude plugin configure flightdeck@claude-flightdeck` lista las opciones y cuáles no están definidas, y las guarda con `--values-stdin`.

| Opción | Predeterminado | Significado |
| --- | --- | --- |
| `architectPattern` | `advisor\|architect` | regex distinguiendo mayúsculas de minúsculas para tipos de agente y herramientas de servidor que cuentan como el architect |
| `matchDescriptions` | `false` | hacer coincidir también las descripciones de los agentes, no solo los nombres de tipo |
| `architectLabel` | `ARCHITECT` | el nombre del architect en el panel |
| `gateLabel` | `GATE` | el nombre del panel de permisos |
| `panels` | `main,architect,gate,agents,loops,receipt,log` | qué paneles se muestran, en orden |
| `layout` | `auto` | `mini`, `compact`, `wide` o `auto` (mini en línea, wide desde 110 columnas anclado) |
| `maxCards` | `3` | tarjetas en paralelo antes de las swimlanes (1–6); menos si el panel es demasiado estrecho |
| `paneColumns` | `66` | columnas que pide el panel anclado, 40 o más. Claude Code limita el dock al 45% de la terminal, y un ancho al que lo arrastraste, en esta sesión o en una anterior, prevalece. El layout wide empieza en 110, así que necesita una terminal de unas 245 columnas, o `layout: wide` |
| `motion` | `while-active` | `off` mantiene los conectores quietos |
| `moments` | `true` | mostrar los momentos de consulta inferidos |
| `palette` | `theme` | `pastel` usa colores fijos ajustados para terminales oscuras |
| `openOnStart` | `true` | preguntar si abrir el panel cuando inicia una sesión |
| `statusLine` | `true` | contexto, agentes en ejecución, consultas y denegaciones en la línea de estado |

## Solución de problemas

**El panel no aparece.**
- Comprueba que `claude --version` sea 2.1.289 o posterior, luego ejecuta `/reload-plugins` y `/flightdeck`. En una versión anterior, la transcripción dice `flightdeck: hooks module did not load: …`.
- Por debajo de 144 columnas, Claude Code no colocará un panel que nadie pidió; `/flightdeck` lo abre en cualquier ancho.
- Busca en la transcripción una línea tenue que empiece por `flightdeck:`. Nombra el hook que falló o el motivo por el que se rechazó el panel. Por favor [abre un issue](https://github.com/scasella/claude-flightdeck/issues) con ella.
- Si el panel muestra solo `draw failed (…)`, su hook de dibujo lanzó una excepción; incluye esa línea en el issue también.

**No se muestra nada en la extensión de VS Code.** En un informe, su compilación 2.1.296 ejecutaba los hooks de Flightdeck pero no mostraba ningún panel, ni tampoco para otro mod ([#5](https://github.com/scasella/claude-flightdeck/issues/5)). Ejecuta `claude` en la terminal integrada de VS Code en su lugar, y luego `/flightdeck`: una terminal integrada suele ser más estrecha que las 144 columnas que el panel necesita para abrirse por sí solo.
**Con un inicio de sesión de Team o Enterprise, el modo de permisos falta o está desactualizado, y las compactaciones se estiman.** En una máquina con configuración administrada, o en una sesión de Team o Enterprise con `/login`, Claude Code carga un guard integrado, `cc-plugin-sec-default`, que nunca ejecuta los hooks de un plugin instalado por el usuario en los eventos `classic.*` ni en `session.compact` (consulta "Know which hooks of a user's mod don't run" en [Manage mods for your organization](https://code.claude.com/docs/en/plugins/mods/admin)). Ningún otro evento al que un plugin del usuario pueda enganchar lleva el modo de permisos, salvo el inicio de un subagente. Así que la casilla principal no muestra ningún modo hasta que arranca un subagente, y luego el modo tal como estaba en ese arranque. Hasta entonces, en modo automático, el gate asigna las llamadas que el clasificador aprobó a `you`. Las compactaciones se cuentan en cambio a partir del contexto que Claude Code reporta en cada solicitud, así que la casilla principal las marca `⟲~` y el registro dice `context compacted (estimated)` (consulta [Qué se infiere, no qué se mide](#qué-se-infiere-no-qué-se-mide)). En 2.1.299 o posterior, `/plugin` muestra una nota que nombra esos dos hooks. El resto del panel funciona. Un administrador puede permitir que los hooks se ejecuten instalando Flightdeck como uno de los mods de la propia organización ([#23](https://github.com/scasella/claude-flightdeck/issues/23)).

**Las opciones parecen ignoradas.** Revisa la clave en tu `settings.json` de usuario: `pluginConfigs["flightdeck@claude-flightdeck"]` cuando está instalado, `pluginConfigs["flightdeck"]` con `--plugin-dir`. Consulta [Configurar](#configurar).

**Los colores se ven mal.** Pon `palette` a `pastel` en `/config`.

**Hay demasiado movimiento.** Pon `motion` a `off`.

**Los contadores parecen desactualizados después de una actualización.** Ejecuta `/flightdeck reset`.

## Cómo funciona

| Archivo | Contenido |
| --- | --- |
| [`hooks/register.tsx`](hooks/register.tsx) | los hooks de eventos, el acceso al estado y una función por panel |
| [`hooks/core.ts`](hooks/core.ts) | cada reducer, formateador y regla de diseño como funciones puras, para que el comportamiento sea comprobable directamente |
| [`hooks/rail.tsx`](hooks/rail.tsx), [`hooks/elapsed.tsx`](hooks/elapsed.tsx) | módulos de superficie: conectores animados y relojes en vivo que se redibujan solo a sí mismos, con el reloj de frames propio de la superficie |
| [`types/index.d.ts`](types/index.d.ts) | el contrato del estado |
| [`tests/`](tests) | 65 pruebas: comportamiento puro, más dibujos montados en cada superficie a 24–120 columnas, con cada ancho de 24 a 40 comprobado por si desborda su caja |

El estado vive en átomos de `$.state`. Cada lectura se fusiona sobre los valores predeterminados, así que un campo ausente o antiguo nunca rompe el panel; un cambio que altera la forma del estado aún puede reiniciar sus contadores una vez. ¿Nuevo en los mods? Empieza con [Claude Code mods](https://claude.com/blog/claude-code-mods) y [Getting started with Claude Code mods](https://claude.dev/blog/getting-started-with-claude-code-mods/).

## Proyectos relacionados

Flightdeck funciona junto a estas, y les debe ideas:

- [claude-hud](https://github.com/jarrodwatts/claude-hud): contexto, límites, herramientas y agentes en tu línea de estado. Usa ambas: esa es la línea de estado, este es el panel.
- [zoetrope](https://github.com/furkankly/zoetrope): una sesión de Claude Code o Codex como grafo de flujo en vivo.
- [ccusage](https://github.com/ccusage/ccusage): informes de coste a partir de los registros de tu sesión.
- [awesome-claude-code-mods](https://github.com/karanb192/awesome-claude-code-mods): el índice de mods de Claude Code.

## Desarrollo
```sh
claude --plugin-dir .            # load it; edits hot-reload
claude plugin validate .
claude plugin test .
npx -p typescript tsc -p .       # después de la primera carga, que escribe .claude-plugin/types/
```
Consulta [CONTRIBUTING.md](CONTRIBUTING.md). Los cambios se enumeran en [CHANGELOG.md](CHANGELOG.md).

## Licencia

[MIT](LICENSE)

## Fuente y licencia

- Autor original: [scasella](https://github.com/scasella/claude-flightdeck)
- Repositorio original: https://github.com/scasella/claude-flightdeck
- Licencia: MIT
- Traducción al español y localización de interfaz: proyecto claude-code-mods-es
