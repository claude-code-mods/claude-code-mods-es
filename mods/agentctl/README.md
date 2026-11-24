# agentctl — Plano de control de agentes para una sesión de Claude Code

Probado con **Claude Code 2.1.288** (headless) y **2.1.289** (interactivo, tras la actualización automática del host) (`claude plugin validate .`, `claude plugin test .`: 203 pruebas); la 0.2.x se reverificó en directo en la 2.1.289 (§ Verificado en directo, 0.2.x).
La API de mods está marcada como susceptible de cambiar entre versiones; las declaraciones de tipos que el host escribe en
`.claude-plugin/types/` son la autoridad para la versión instalada. Ejecuta `claude plugin validate .`
después de cada actualización de Claude Code.

Diseño: `docs/features/agent-control-plane-mod/` en este repositorio (requisitos, estudio de viabilidad,
especificación técnica, tickets de solicitud). Este directorio no forma parte del plugin sd0x-dev-flow: instalar el
plugin no instala el mod. Para instalarlo, ejecuta `/agentctl-setup` (comprueba el host, instala
`agentctl@sd0xdev-marketplace` tras tu aprobación y prepara tu primera línea de tarea; `/agentctl-setup --task`
y los skills de flujo de trabajo preparan una propuesta para que la aceptes), o cárgalo durante una
sesión con `claude --plugin-dir mods/agentctl`.

## Primera ejecución

Escribe qué estás haciendo; no necesitas ningún otro comando:

```text
/agentctl 測試一下這個新功能
```

1. El mod pone una solicitud para Claude en tu cuadro de entrada (nunca la envía). Pulsa **Enter**.
2. Claude lee el proyecto y prepara un alcance — qué puede editar, qué comprobaciones cuentan como evidencia,
   qué significa «hecho» — y lo escribe con la utilidad incluida en el mod (`bin/propose.mjs`). Si algo no está claro te lo pregunta en lugar de inventar permisos.
3. Al final de esa respuesta, el mod muestra el alcance y ofrece `/agentctl accept <digest>` en el cuadro:
   **Tab** y después **Enter**. Aceptar vincula el alcance; no inicia ningún trabajo.
4. Pide a Claude que empiece. `/agentctl` muestra cómo van las cosas y qué hacer a continuación — ejecuta las comprobaciones
   y después `/agentctl handoff` — y `/agentctl help` enumera el resto.

Un probador que no había leído el diseño siguió los pasos 1–4 y la entrega sin ayuda (§ Ejecución sin instrucciones).

Enviar la solicitud es un turno ordinario de Claude; el mod no llama a ningún modelo. Las respuestas usan
chino tradicional cuando tu objetivo está escrito en chino, e inglés en caso contrario: una heurística sencilla, no detección de idioma.

## Qué hace

| Función | Cómo |
|---|---|
| Alcance de tarea | Claude prepara una propuesta (`/agentctl-setup --task`, o `/feature-dev`, `/bug-fix`, `/refactor` cuando el mod está instalado); el mod la muestra y `/agentctl accept` escrito en tu propio prompt vincula exactamente lo que se mostró — véase § Propuestas. `/agentctl task set <json>` escrito en tu prompt también vincula una tarea al worktree. La salida de herramientas, los archivos y los mensajes no pueden cambiarlo: solo un comando que escribas tú. El vínculo es por worktree, así que tu propio `task set` / `task clear` en otra sesión del mismo worktree sí lo reemplaza o borra. Los registros de tareas y las entregas se conservan por worktree, de modo que el mismo id de tarea en dos worktrees nombra dos tareas distintas. Un error del almacén se informa como tal y sigue aplicando la tarea anterior; un vínculo cuyo registro falta lo rechaza todo salvo las lecturas en el worktree |
| Rechazo | Una lista de denegación. Las escrituras directas reconocidas en producción y las escrituras remotas de git se rechazan **con o sin tarea**; mientras hay una tarea vinculada, también se rechazan sus propias entradas `forbid` y las ediciones fuera de sus raíces. Las raíces de edición vinculan las herramientas de edición (Write, Edit, NotebookEdit); un archivo escrito mediante redirección de shell es un comando Bash que el mod no puede clasificar, así que va al host: el rechazo dice a Claude que no busque el mismo resultado por otro camino, pero las raíces no son un entorno aislado. Todo lo que el mod no puede clasificar —scripts, shell compuesto, herramientas desconocidas— va al cuadro de permisos propio de Claude Code o al modo automático, y se registra como `delegated`. Un rechazo posterior nunca se debilita ni se crea un permiso. **Al mejor esfuerzo**: el mod lee cada llamada a herramienta, nunca el contenido de un script ni los comandos que este inicia, así que un push dentro de un script es competencia del host y de ese flujo de trabajo |
| Evidencia | Una ejecución cuenta cuando coincide con un `check` ejecutor declarado: primero sus palabras, así que añadir argumentos sigue contando y puede comprobar menos de lo declarado, mientras que una tubería, redirección o envoltorio (`npm test \| grep pass`) no cuenta; la respuesta de aceptación y `/agentctl` nombran cada comprobación como una línea que coincide con ella, o —cuando el formateador no puede citar una palabra entera— como sus palabras JSON, que no coinciden si se copian tal cual (sí coincide una forma correctamente entrecomillada de esas mismas palabras). Una llamada coincidente se enmarca con lecturas del árbol derivadas de Git (los ejecutores se comparan primero, así que una comprobación declarada `git status` es una comprobación); una edición posterior muestra el resultado como obsoleto en un plazo de 30 s; una comprobación en segundo plano sigue como «finalización no observada» hasta que se ve un resultado terminal. La evidencia pertenece a la tarea y a la versión de política bajo las que se observó, y una lectura con cobertura parcial nunca se lista como verificada |
| Panel | La banda sobre el prompt es compacta: tarea, entorno de ejecución y su duración, qué necesita de ti, la lectura de la compuerta con su antigüedad (y `stale` pasados 30 s) y la hora de la última entrega. `/agentctl` es una respuesta de estado compacta —siguiente paso, tarea, qué necesita de ti, compuerta y evidencia—; `/agentctl status --details` añade salud del almacén, entorno de ejecución, contexto y la ventana de 5 h. Las líneas de compuerta, contexto y ventana nombran su origen y antigüedad, o indican `missing` / `unavailable`, y cada línea de evidencia su resultado, frescura, cobertura y antigüedad |
| Entrega | `/agentctl handoff` — ocho respuestas a partir de registros, sin modelo, sin red, sin proceso; se registra completa al reabrir (solo transcripción); el `/agentctl` sin argumentos solo la señala, y `/agentctl last` la imprime |
| Stop | `/agentctl stop` — guarda la entrega, solicita la cancelación del turno actual, enumera las operaciones seguidas; nunca dice «todo detenido» |

## Propuestas

Claude escribe `~/.claude/agentctl/proposals/<URI-encoded worktree>.json` (fuera del worktree) mediante
`bin/propose.mjs` incluido en el mod (la ruta `/agentctl <goal>`) o `agentctl-setup.js propose` de sd0x-dev-flow
(instalación y skills de flujo de trabajo); ambos aplican primero la validación propia del mod. Al iniciar la sesión y al
final de cada turno principal, el mod lo lee una vez, lo valida de nuevo y conserva el objeto **efectivo**:
el worktree se toma de la sesión, y se rechaza una propuesta que nombre otro worktree, que se haya preparado para una tarea que
ya no está vinculada o que se solape con una clase integrada (el motivo se registra). La vista previa
enumera cada permiso que se acepta con un resumen SHA-256 (24 hexadecimales) en la transcripción y la banda.
Cada entrada se muestra hasta 160 caracteres; una más larga termina en `…`, y el resumen —y lo que vincula la aceptación—
sigue cubriéndola entera, así que descarta un borrador cuyas entradas no puedas ver completas.

| Comando | Quién | Qué hace |
|---|---|---|
| `/agentctl proposal` | cualquiera | Imprime la vista previa pendiente |
| `/agentctl accept [digest prefix]` | **solo tu prompt** | Vincula el objeto retenido —nunca el archivo releído— si la tarea vinculada no ha cambiado desde la vista previa |
| `/agentctl discard` | cualquiera | Descarta la propuesta pendiente; la tarea vinculada permanece |

Cambiar el archivo después produce una nueva vista previa y un nuevo resumen; un resumen antiguo ya no coincide.
Las sesiones concurrentes en un worktree comparten un vínculo y un almacén, que no son atómicos entre
sesiones: acepta en la sesión que mostró la vista previa.

## JSON de tarea

```json
{
  "goal": "investigate the quiz service timeout",
  "allow": ["edit"],
  "editRoots": ["src", "tests"],
  "forbid": ["terraform apply"],
  "executors": [{ "argv": ["npm", "test"], "check": true }],
  "needsUser": [["npm", "publish"]],
  "tools": ["mcp__docs__search"],
  "acceptance": ["unit tests pass on the final tree"]
}
```

Las clases integradas prohibidas se aplican con o sin tarea, además de las propias de la tarea: escrituras en producción (`kubectl apply|delete|patch|rollout|scale|edit|replace`,
`helm install|upgrade|uninstall|rollback`, `gcloud … deploy|delete|update`) y escrituras remotas de git
(`git push`, `gh pr merge`). Los secretos nunca deben estar en una tarea: un valor parecido a una credencial
en un campo de política se rechaza.

`needsUser` pregunta únicamente donde se ha visto a una persona responder: el terminal interactivo bajo los
modos de permisos `default` (manual), `acceptEdits` y `auto` (`lib/verdict.js`). El modo se lee
de las entradas del hook clásico en cada solicitud y al terminar cada herramienta; hasta que se haya visto uno, y en cualquier otra
superficie o modo —`-p`, `dontAsk`, `plan`, `bypassPermissions`, Desktop, VS Code, móvil— una
llamada `needsUser` se rechaza. Un modo cambiado a mitad de un turno se ve al terminar la siguiente herramienta.

## Lo que no es

- **No es una frontera de aislamiento.** Se ejecuta con tus permisos. La protección de solo lectura en producción es competencia de
tus credenciales y del IAM/RBAC del destino.
- **No es la única línea de defensa.** Si el host omite su hook (mod desactivado, fallo del proceso de trabajo), nada aquí rechaza.
  Mantén los comandos peligrosos conocidos en tu propio `permissions.deny`, por ejemplo:

  ```json
  { "permissions": { "deny": ["Bash(kubectl delete:*)", "Bash(kubectl rollout:*)", "Bash(helm upgrade:*)"] } }
  ```

  Esas reglas coinciden con el texto del comando, no con los programas (`git -C . push` es un texto distinto), que es por lo que
existen ambas capas. `Bash(git push:*)` se omite a propósito: `/push-ci` de sd0x-dev-flow lo ejecuta.
- Otro mod puede cambiar un veredicto en `tool.check`; este mod lo revela en `/agentctl policy`.
- Los ejecutores autorizados (p. ej. `npm test`) se ejecutan con sus efectos sin clasificar.

## Desarrollo

```bash
cd mods/agentctl            # desde la raíz del repositorio
claude plugin validate .   # hooks y llamadas $: sin $.model.*, $.http.*, $.tool.register, $.prompt.submit (fill/suggest/read permitidos)
claude plugin test .       # todos los *.test.ts bajo tests/
```

## Versión

El mod tiene versionado propio y se publica con etiquetas `agentctl-v<version>`
(`.github/workflows/release-agentctl.yml`), separado de las versiones de sd0x-dev-flow. Claude Code almacena en caché un
plugin instalado por versión, así que cualquier cambio que no sea este README ni `tests/` requiere subir la versión:
aumenta `"version"` en `.claude-plugin/plugin.json` y ejecuta `node .github/scripts/agentctl-version.js update`
desde la raíz del repositorio (o `/bump-version agentctl`). El bloqueo de versión de CI falla hasta que ambos estén hechos, y
CI también ejecuta `claude plugin validate` y `claude plugin test` aquí.

## Verificado en directo (2026-10-04, repositorio de prueba: `claude -p --plugin-dir` headless en 2.1.288, tmux interactivo en 2.1.289)

Estas filas registran la versión 0.1.0. Desde la 0.2.0, una llamada no clasificada se delega al host en lugar
de rechazarse, y existen los comandos de propuesta; las filas de la 0.2.x siguen a la tabla.

| Comprobación | Resultado |
|---|---|
| Cargar y `/agentctl` bajo `-p` | Se carga solo para la sesión; responde en ~3,7 s sin turno de modelo |
| `task set` desde un prompt `-p` | Rechazado: un prompt `-p` no está marcado como `composer`. Las ejecuciones headless no pueden fijar una tarea; hazlo desde un prompt interactivo |
| Llamadas Bash prohibidas y no clasificadas | Rechazadas antes de ejecutarse, con la regla indicada (`task-forbid: …`, `unclassified: python3 has no adapter`) |
| Una lectura permitida (`git status`) | Fue a la ruta de permisos propia del host y se ejecutó |
| Una comprobación que termina con código distinto de cero (`sh check.sh` → exit 1) | Registrada como `error`: una salida Bash distinta de cero llega al mod como `isError` |
| Marco de evidencia | Lecturas antes/después registradas, cobertura `git-hybrid` |
| Dos sesiones concurrentes | Se escribieron los registros de ambas sesiones; se conservó el registro de la tarea |
| Procesos sobrantes tras la salida | Ninguno |
| Coste de la lectura del árbol | ~90 ms con 500 archivos modificados o sin seguimiento; ~75 ms en un repositorio limpio de 974 archivos |
| Ventana de 5 h tras un turno del modelo (V7) | `1% (resets …)` leído del host, con su origen y antigüedad |
| Comprobación en segundo plano (V5, mitad en segundo plano) | Cerrada desde la notificación de tarea del host (`<task-id>`, `<status>`) como `error` — sin sondeo. `TaskGet` es la herramienta de lista de tareas; `GetTask` lee tareas en segundo plano |
| Llamadas a herramientas de subagentes (V4) | El `danger-cmd` de un subagente fue rechazado por la misma regla |
| `ask` bajo `-p` (V3, solo `-p`) | Con una copia de prueba que respondía `ask`, ninguna de las configuraciones headless probadas (con y sin regla de permiso para Bash) ejecutó el comando en 2.1.288 — el `ask` de la prueba no se aprobó automáticamente |
| `/agentctl stop` bajo entrada de flujo `-p` (V6) | La entrada se procesó después de terminar el turno, así que `immediate` no se aplica allí; la respuesta dijo que no se observó ningún turno en curso — nunca «detenido» |
| Llamadas a herramientas MCP (V4) | Una herramienta MCP de prueba se rechazó como no clasificada hasta que la tarea la nombró; entonces se ejecutó |
| Terminal interactivo en tmux (V10) | La banda muestra correctamente texto de objetivo CJK a 80 y 50 columnas, con salto a dos y tres líneas |
| `/agentctl stop` durante una herramienta en primer plano en curso, interactivo (V6) | Se ejecutó al instante (`immediate`); el turno se canceló; el host pasó el comando en curso a segundo plano, donde siguió ejecutándose — la respuesta lo listó como en curso y nunca dijo «detenido»; al terminar, la notificación del host cerró su evidencia |
| `ask` en el terminal interactivo en modo manual (V3) | Con una copia de prueba que respondía `ask`, el host mostró su propio diálogo de aprobación con el motivo del mod (Sí / No, sin «no volver a preguntar»); rechazar interrumpió la llamada; se volvió a ejecutar con el código publicado (manual: diálogo; `dontAsk`: rechazado por el mod), y con una copia de prueba bajo `acceptEdits` y `auto` (diálogo) y `dontAsk` (rechazado). Las cadenas que envía el host se leyeron desde un hook clásico simple `UserPromptSubmit` (2.1.289): `default`, `acceptEdits`, `auto`, `plan` y `dontAsk` llegan literalmente; en un modelo sin modo automático (Haiku), `--permission-mode auto` vuelve a `default` |
| Inicio interactivo (encontrado en directo) | `session.start` y el primer render de la banda llegan juntos; dos construcciones de contexto concurrentes dejaron la banda en un contexto huérfano (`gates missing`). Corregido: una sola construcción compartida |
| Instalar, desactivar, desinstalar (Signal 12) | Instalado desde un marketplace local, ejecutado, desactivado (desaparece `/agentctl`) y desinstalado: no quedó ningún proceso del mod, los ajustes `permissions` byte-idénticos. El propio host dejó una clave vacía `extraKnownMarketplaces`, un directorio de caché de plugins y un `installed_plugins.json` vacío; el mod deja solo su archivo de almacén. Todo se restauró y se verificó byte-idéntico después |

Retirada: `--plugin-dir` no instala nada ni cambia ningún ajuste. Los datos propios del mod permanecen en
`~/.claude/plugins/store/agentctl_*.json` (sesiones, tareas, puntos de control) y las propuestas redactadas en
`~/.claude/agentctl/proposals/`; elimínalos para borrarlos.

## Verificado en directo, 0.2.x (2026-10-05, clon de prueba con un remoto bare de prueba, 2.1.289, Haiku)

| Comprobación | Resultado |
|---|---|
| `git push` directo sin tarea vinculada (`-p`) | Rechazado `remote-git-write` antes de ejecutarse; el remoto siguió vacío |
| `python3 -c …` no clasificado y un script que hace push (`/bin/bash -p push.sh`, `-p`) | Ambos pasaron al host y se ejecutaron; el push del script llegó a git (rechazado por el propio remoto de prueba, no por el mod) — la ceguera ante scripts ya revelada |
| Propuesta escrita por `agentctl-setup.js propose`, inicio interactivo | La vista previa se registró al iniciar la sesión con el resumen de la utilidad, y la banda nombró la propuesta pendiente |
| `/agentctl accept <digest>` escrito en el prompt | Vinculó el alcance mostrado como nueva tarea; sin `base` la utilidad no imprimió resumen, el mod rellenó la tarea vinculada y se aceptó su propio resumen |
| Una comprobación declarada, una llamada no clasificada, una edición fuera de las raíces, un push directo (tarea vinculada) | Comprobación registrada como evidencia `current`; `python3` delegado y listado como tal por `/agentctl events`; la edición rechazada `edit outside the allowed roots`; el push rechazado `remote-git-write` |
| Un archivo sin seguimiento añadido desde fuera | La comprobación leyó `stale (tree changed since)` en menos de 32 s |
| `/agentctl handoff`, reabrir, `/agentctl`, `/agentctl last` | La entrega indica cuándo se leyó el árbol y lista la comprobación obsoleta bajo Not verified; al reabrir aparece en la transcripción, `/agentctl` sin argumentos imprime una línea de puntero y `/agentctl last` la imprime completa |
| Encontrado en directo y corregido en 0.2.1 | Un archivo de propuesta aceptado fue releído por la sesión siguiente como borrador obsoleto (ahora se recuerda por worktree); el rechazo integrado decía «el alcance de la tarea», y Claude proponía ampliar la tarea (ahora: «una clase integrada que ninguna tarea puede levantar»); líneas de transcripción decían `agentctl: agentctl:` |
| Coste de las dos pruebas `-p` | 2–3 turnos cada una, ≈ 0,06 $ cada una en Haiku; las respuestas, vistas previas y banda del mod no llaman a ningún modelo |
| Prueba adversaria independiente (Codex, 2026-10-05), corregida en 0.2.2 | Una ruta de programa absoluta o en mayúsculas (`/usr/bin/git push`, `GIT push`) eludía las clases integradas; una raíz de edición como `../other` autorizaba escrituras fuera del worktree; el límite de la propuesta contaba caracteres, no bytes UTF-8; sin tarea vinculada, las llamadas delegadas no se registraban en `/agentctl events`. La coincidencia de resúmenes, las claves de prototipo, el rechazo de otro worktree, la partición de evidencia y la cobertura parcial resistieron |

## Verificado en directo, 0.3.0 (2026-10-07, clon de prueba con remoto de prueba, tmux interactivo, Haiku)

Signal 13, recorrido en 2.1.289 (pasos 1–3) y de nuevo desde el principio en 2.1.292:

| Paso | Resultado |
|---|---|
| `/agentctl 幫 …/README 加一行測試說明` | La solicitud rellenó el cuadro vacío en chino tradicional con la ruta de la utilidad de `$.plugin.root`; no se envió ni se vinculó nada |
| Enter | Claude ejecutó `--help` de la utilidad, leyó el proyecto, encontró que faltaba el archivo y **preguntó** en lugar de inventar el alcance; tras la respuesta escribió la propuesta con la utilidad |
| Vista previa | Mostrada al final del turno con su resumen y «vincula solo el alcance; no inicia ningún trabajo»; la banda nombró la propuesta pendiente |
| Tab + Enter | Aceptada desde la sugerencia; la respuesta indicó el siguiente paso |
| «start the work» | La edición dentro de la raíz aceptada fue al cuadro de permisos propio del host; la comprobación declarada se registró como evidencia actual |
| `/agentctl`, `handoff`, reabrir, `last` | El estado empezaba por el siguiente paso; la entrega listaba la comprobación como verificada con su hora de lectura; al reabrir se señalaba, y `last` la imprimía |
| Un segundo objetivo con la tarea vinculada | La utilidad entregó bajo la tarea vinculada; la vista previa decía «Replaces: task …»; Tab + Enter la reemplazó |

Encontrado y corregido durante el recorrido: en 2.1.292, la propia sugerencia de siguiente solicitud del host («確認») ocupó el cuadro, así que Tab + Enter habría enviado esa palabra a Claude — el mod ahora reemplaza la sugerencia del host con la línea de aceptación mientras espera una propuesta, y la ofrece de nuevo al final de cada turno; la última línea de la respuesta de aceptación seguía en inglés en una sesión en chino; con una tarea vinculada, la respuesta de relleno decía «nada está vinculado». Dudas registradas: Claude intentó una vez leer los archivos propios del mod fuera del worktree (rechazado en el cuadro del host); el idioma del texto se reinicia en cada sesión nueva.

## Ejecución sin instrucciones, 0.3.0 (2026-10-07, Codex como usuario primerizo, tmux interactivo, un clon desechable)

Al probador solo se le dio `/agentctl <lo que estás haciendo>` y no leyó ni `docs/` ni el código de este mod. Describir → Enter → vista previa (≈ 72 s, alcance solo de README, tres comprobaciones) → Tab + Enter → «start the work» → `/agentctl` → `/agentctl handoff`: completado en seis pasos sin ayuda externa. Corregido en 0.3.1 a partir de lo que se encontró:

| Encontrado | 0.3.1 |
|---|---|
| La entrega decía «Edits observed: 0» junto a un README modificado (Claude había editado mediante Bash) | La línea cuenta llamadas a herramientas de edición y dice que los cambios con Bash están en la línea del árbol |
| Claude ejecutó las pruebas con tubería a `grep`; la entrega llamaba obsoleta la comprobación mientras Claude la decía superada | La respuesta de aceptación nombra literalmente las comprobaciones que hay que ejecutar; `/agentctl` vuelve a pedirlas por su nombre |
| Con el trabajo terminado, `/agentctl` seguía diciendo «pide a Claude que empiece el trabajo» | El siguiente paso sigue las comprobaciones declaradas: trabajar y ejecutarlas, repetir las que no están actualizadas o entregar |
| Se rechazó un Write fuera de las raíces y después se escribió el mismo archivo con un heredoc de Bash | El rechazo dice a Claude que no busque el resultado por otro camino; esta sección y § Qué hace afirman que las raíces vinculan solo las herramientas de edición |
| Claude hizo una pregunta y escribió una propuesta en el mismo turno | La solicitud de redacción dice que espere la respuesta antes de escribir |

Se deja como está: la ejecución tardó varios minutos porque el `CLAUDE.md` propio del clon exige dos rondas de revisión para un cambio de documentación, no por culpa del mod.

## Sin verificar

V3 en Desktop, VS Code y móvil, y bajo `plan` y `bypassPermissions` (aceptar la advertencia del modo de omisión es decisión del operador, así que no se probó): allí `needsUser` sigue rechazándose. La banda se comprobó en tmux, no por SSH.

## Fuente y licencia

- Autor original: [sd0xdev](https://github.com/sd0xdev/sd0x-harness)
- Repositorio original: https://github.com/sd0xdev/sd0x-harness (ruta mods/agentctl)
- Licencia: MIT

Traducción al español y localización de interfaz: proyecto claude-code-mods-es
