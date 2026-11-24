# agent-usage-guard

> Evita que Claude Code se gaste tu ventana de uso de cinco horas en diez minutos.

`agent-usage-guard` es un [mod](https://code.claude.com/docs/en/plugins/mods/overview) de Claude Code: se ejecuta dentro de Claude Code y contiene el gasto desbocado antes de que ocurra. Lee el uso en directo de tu plan y frena la proliferación de subagentes, el trajín de contexto intenso y los bucles de reintento.

<p align="center">
  <a href="https://www.producthunt.com/products/agent-usage-guard?embed=true&amp;utm_source=badge-featured&amp;utm_medium=badge&amp;utm_campaign=badge-agent-usage-guard" target="_blank" rel="noopener noreferrer">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1289693&amp;theme=dark">
      <img alt="agent-usage-guard on Product Hunt" width="250" height="54" src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1289693&amp;theme=light">
    </picture>
  </a>
</p>

<p align="center">
  <img src="https://github.com/rbartoli/agent-usage-guard/releases/download/agent-usage-guard--v1.0.0/agent-usage-guard.gif" alt="Four scenes in Claude Code's interactive UI. The guard asks before a prompt re-writes the expired cache of a 486k-token session resumed after two hours, before a fifth parallel agent starts against a limit of four, before a twenty-first tool call at 433k context, and before a new agent once subagents have processed 10.9M tokens." width="900">
</p>

<p align="center">
  <sub>Recordado desde la interfaz interactiva de Claude Code con el guardia cargado. Una <a href="demo/scripted-api.ts">API local guionizada</a> sustituye a Claude, de modo que las sesiones y los recuentos de tokens son ficticios y no se gasta ningún uso. Cada pregunta en pantalla es del propio guardia. <a href="demo/render.sh">Vuelve a generarlo</a> a partir del <a href="demo/fixture/northstar-api">fixture Northstar</a>.</sub>
</p>

Actúa antes del gasto, no después: antes de que arranque un agente, se envíe una solicitud o se ejecute una llamada a herramienta. Los límites de agentes se mantienen en todas las sesiones de Claude Code de tu equipo, y la proliferación y el contexto intenso se limitan a cualquier nivel de uso, no solo cerca del límite. Cuando estás ante el teclado, te pregunta en el cuadro de diálogo propio de Claude Code. Cuando nadie puede responder, rechaza la acción y le dice por qué a Claude, para que el modelo espere, agrupe el trabajo o se detenga. `/agent-guard report` muestra lo que hizo.

- **Consciente del plan.** Lee los porcentajes de 5 horas y semanales que informa Claude Code y te reserva el final de la ventana.
- **Una respuesta sirve para un rato.** Una aprobación levanta su condición hasta que se resuelve o caduca, así que la misma pregunta no vuelve en cada llamada.
- **Local y con privacidad mínima.** Sin red, sin procesos. Guarda recuentos y cubos gruesos, nunca texto de solicitudes, entradas de herramientas ni salidas del modelo.
- **Falla abierto.** Si uno de sus hooks falla, el evento sigue adelante: un guardia averiado nunca rompe tu sesión. La única excepción es un agente que no pudo evaluar, que se rechaza para que Claude lo inicie de nuevo.

## Instalación

Ejecuta estos comandos dentro de Claude Code v2.1.287 o posterior:

```text
/plugin marketplace add rbartoli/agent-usage-guard
/plugin install agent-usage-guard@claude-code-mods-es
/reload-plugins
```

Después ejecuta `/agent-guard` para ver qué detecta y `/agent-guard simulate concurrency` para ver la pregunta que hace cuando hay demasiados agentes en marcha, sin retener ni gastar nada. Los mods están activados por defecto; la [visión general](https://code.claude.com/docs/en/plugins/mods/overview#turn-mods-on-or-off) enumera los ajustes que los desactivan.

## Por qué existe

Una tarde di a Claude Code una solicitud de investigación con esfuerzo máximo. Generó **394 llamadas a subagentes, 341 de ellas ejecutándose a la vez, y metió 84 M de tokens de contexto por la API en diez minutos.** Sesión terminada: *"Claude usage limit reached."* Sin acceso hasta que se reiniciara la ventana.

No fue un caso aislado. Sesenta días de mis propios registros contenían **12 bloqueos** y 166 ventanas de diez minutos con ráfagas de agentes. El modo de fallo se multiplica: *un contexto grande × bucles rápidos de herramientas × agentes paralelos × reintentos ciegos*. Cada protección siguiente elimina uno de esos factores.

Y no solo me pasa a mí: [339 subagentes a partir de una sola solicitud](https://www.reddit.com/r/ClaudeAI/comments/1u5d02w/), [la mitad de un plan semanal Max consumida por generación recursiva](https://github.com/anthropics/claude-code/issues/68619) y ejecuciones multiagente que usan [~15× los tokens de una sesión de chat](https://www.anthropic.com/engineering/built-multi-agent-research-system).

## Qué hace

| Ámbito | Regla | Valor por defecto | Qué ocurre |
|---|---|---|---|
| Ventanas del plan | Los agentes nuevos necesitan aprobación cuando la ventana está tan llena | 80 % | pregunta; la aprobación dura hasta que se reinicia esa ventana |
| | Los agentes nuevos se rechazan cuando la ventana está tan llena | 95 % | rechaza |
| | `ScheduleWakeup` y `CronCreate` se rechazan cuando la ventana está tan llena, para que ningún turno se inicie directamente contra el límite | 95 % | rechaza |
| | A cada sesión se le dice una vez que termine su paso y diga qué queda | 95 % | añade una nota a la siguiente solicitud |
| | Los agentes nuevos necesitan aprobación cuando la ventana de 5 horas sube tan rápido | 20 puntos / 10 min | pregunta |
| | Los agentes nuevos necesitan aprobación cuando el ritmo de la ventana de 5 horas en los últimos 10 minutos la llenaría en una hora, antes de que se reinicie | al menos 2 puntos en 2 min | pregunta |
| Agentes | Agentes ejecutándose a la vez, en todas las sesiones de este equipo | 4 | pregunta |
| | Agentes iniciados o reanudados cada 10 minutos, en todo el equipo | 12 | pregunta |
| | Tokens procesados por subagentes cada 10 minutos, en todo el equipo; una aprobación dura una hora | 10 M | pregunta |
| | Los subagentes no pueden iniciar sus propios agentes | profundidad 1 | rechaza |
| Contexto | Se le dice a Claude una vez que mantenga el turno acotado | 300 mil tokens | añade una nota a la solicitud |
| | Una solicitud que volvería a leer tanto contexto | 500 mil tokens | pregunta: compactar y enviar, enviar de todos modos o cancelar |
| | Llamadas a herramientas cada 10 minutos mientras una conversación o agente lleva tanto contexto | 20 llamadas con 400 mil | pregunta: continuar, compactar tras este turno o detenerse |
| | Una sesión intensa inactiva el tiempo suficiente para que caduque su caché de solicitudes | 150 mil tokens, 1 h inactiva | pregunta antes de reescribir la caché |
| Bucles | La misma llamada a herramienta falla una y otra vez, sin otra llamada de por medio | 3 fallos idénticos | rechaza el reintento idéntico |
| | Llamadas a agentes rechazadas en 10 minutos | 5 | pausa la creación de agentes durante 10 min |

Agentes cubre subagentes, compañeros de equipos de agentes, agentes de flujos de trabajo y subagentes terminados que se reanudan con `SendMessage`. Los agentes Haiku quedan fuera de los límites de agentes en ejecución y de inicios, tanto si Claude pide Haiku como si la propia definición del agente lo elige; siguen contando para el presupuesto de tokens de subagentes y para todas las reglas de ventana del plan. Cada llamada a herramienta se evalúa según el contexto del bucle que la realiza, así que un subagente pequeño nunca hereda el tamaño de la conversación principal.

**Cuando pregunta.** La pregunta aparece en el cuadro de diálogo propio de Claude Code, el mismo que usa Claude para preguntarte algo, y la llamada espera tu respuesta. Los agentes iniciados en paralelo mientras está abierta se retienen, y Claude los inicia de nuevo cuando respondes. Si lo permites, esa condición sigue permitida un rato: una ventana del plan hasta que se reinicia, un contexto intenso hasta que se reduce (para llamadas a herramientas, una hora como máximo), los recuentos de agentes durante 10 minutos. Si rechazas o descartas la pregunta, o se cierra sin respuesta por cualquier otro motivo, se le dice a Claude que no inicie agentes durante los próximos 10 minutos (`AGENT_GUARD_WINDOW_SECONDS`), y no se le vuelve a preguntar en ese tiempo. Tus palabras llegan a Claude, así que puedes responder «usa agentes haiku en su lugar».

**Cuando nadie puede responder.** En `claude -p`, el Agent SDK y el modo `dontAsk`, una compuerta de agente o herramienta rechaza en lugar de preguntar. Una solicitud intensa se retiene con el motivo, y también una reanudación intensa latente cuando se alcanza el límite de una por cada 10 minutos en todo el equipo. Las solicitudes que inician un turno por sí solas, como una programación o un `/loop` que se dispara, un mensaje relayado desde un canal como Slack o un ping de Slack, se retienen igual, incluso en una sesión en la que se podría preguntar a alguien; nunca levantan límites. Claude lee cada rechazo como el resultado de la herramienta. Los rechazos repetidos de la misma condición se redactan de forma distinta cada vez y escalan: el segundo dice que no ha cambiado nada y que pruebes otra cosa, el tercero dice que termines el turno. Si un hook Stop como `/goal` sigue reabriendo el turno, el rechazo dice que tiene que decidir el usuario.

**Qué muestra.** Mientras hay agentes en marcha en este equipo, o el guardia está reteniendo o acaba de rechazar algo, una línea sobre el prompt lo indica: `Usage guard · 3 of 4 agents running · 5 of 12 started in the last 10 min · last refusal 14:22: concurrency`. Se muestra en negrita cuando se alcanza un límite o se retiene algo, y desaparece cuando no hay nada que decir. El `[-]` de Claude Code a su lado la contrae. Las ventanas del plan y el contexto permanecen en la línea de estado.

**Qué deja intacto.** Nunca retiene la notificación de una tarea en segundo plano ni el mensaje de otra sesión, porque se perdería el resultado. Ya no bloquea solicitudes tras un límite de uso: desde la v2.1.234, Claude Code espera en el límite y continúa solo al reiniciarse (`autoContinueAtUsageLimit`). El trabajo del guardia es impedir que llegues al límite, y su diario cuenta los bloqueos que no evitó. Cerca del límite solo añade una nota: a partir del 95 %, la siguiente solicitud de cada sesión le dice a Claude que termine el paso en curso, no empiece nada grande y cierre el turno con lo hecho y lo pendiente, para que un bloqueo encuentre todas las sesiones en un punto limpio.

**Compactación por inactividad.** Desde la v2.1.299, Claude Code compacta una conversación de 200 mil tokens o más que permanece inactiva unos 54 minutos, antes de que caduque su caché de solicitudes de una hora (`idleCompaction`, activada por defecto). El guardia lee el tamaño compactado, así que no pregunta por esa sesión. Desde la v2.1.314 también se ejecuta en VS Code y en la pestaña Code de Claude Desktop, para suscriptores con telemetría desactivada, y en Bedrock, Vertex, Foundry y pasarelas LLM cuando la caché de solicitudes de una hora está activada. Su pregunta sobre sesiones latentes cubre lo que la compactación por inactividad deja fuera: conversaciones de 150 mil a 200 mil tokens, sesiones `claude -p` y del SDK, un equipo que estaba dormido en el minuto 54 y configuraciones con la compactación por inactividad o la compactación automática desactivadas.

**El aviso propio de reanudación de Claude Code.** Desde la v2.1.304, en los planes Pro y Max, Claude Code avisa antes de reanudar una conversación inactiva, o de enviar una a la que se le enfrió la caché mientras estaba inactiva, cuando eso consumiría una parte notable de tu límite de 5 horas: reanudas de todos modos o inicias una conversación nueva. Solo aparece a partir de una parte mínima, que Anthropic define por plan y modelo, así que para la mayoría de modelos aparece solo en conversaciones muy grandes. La pregunta del guardia sobre sesiones latentes arranca en 150 mil tokens, así que sigue cubriendo la mayoría de reanudaciones frías, y en las más grandes puede que veas ambas.

## Comandos

```text
/agent-guard [status]                          what the guard sees right now
/agent-guard allow [agents|context] [minutes]  lift its limits for this session (default: all, 10 min)
/agent-guard pause [minutes]                   the same as allow, for every limit
/agent-guard resume                            end an allow early, lift the agent pause, and let declined questions ask again
/agent-guard report [days]                     what it did on this machine (default: 7 days)
/agent-guard simulate <rule>                   show what a rule does, with nothing held or spent
/agent-guard help                              these commands
```

`/agent-guard` se ejecuta al instante, incluso a mitad de turno, y nunca inicia un turno del modelo, así que Claude nunca ve una anulación y no puede tomarla como permiso. Solo tú puedes levantar límites: cuando otro plugin ejecuta `/agent-guard allow` o `pause`, el guardia se niega y lo dice en la transcripción. Enviar `[allow-usage-guard]` o `[allow-agent-burst]` solos como solicitud, los marcadores de versiones anteriores, hace lo mismo que `/agent-guard allow` o `allow agents`.

## Qué puede y qué no puede ver

Comprobado con Claude Code v2.1.316:

| Ruta | Cobertura |
|---|---|
| Subagentes, compañeros de equipo y agentes de flujo de trabajo | Se retienen antes de arrancar (`agent.spawn`) |
| Un subagenté terminado al que se envía trabajo nuevo con `SendMessage` | Se retiene antes de reanudarse y se cuenta como un inicio, una vez |
| Un compañero de equipo recuperado del disco (Claude Code 2.1.299 o posterior) | Se retiene antes de reanudarse y se cuenta como un inicio |
| Bifurcaciones `/subtask` y cualquier otra cosa que arranque sin `agent.spawn` | Se cuentan al arrancar, nunca se retienen: Claude Code no ofrece ningún evento previo. Las bifurcaciones que Claude inicia con la herramienta Agent se retienen como cualquier agente |
| Agentes internos de Claude Code (sugerencias de solicitudes, compactación) | No se cuentan |
| Porcentajes de ventana del plan | De la última respuesta de API en una suscripción, también en `claude -p`. Las sesiones con clave de API no informan de ninguno, así que solo se aplican los presupuestos de tokens y recuentos |
| Compañeros que se ejecutan en sus propios paneles de terminal | No se ven: sus bucles corren en otros procesos |
| Sesiones en otros equipos | No se cuentan: los registros entre sesiones viven en el almacén del mod de este equipo |
| Herramientas que ejecuta la propia API, como el asesor | No se pueden retener: no se dispara ningún evento de herramienta para ellas |

Los mods se ejecutan en `claude` en una terminal, en la pestaña Code de la app de escritorio, en `claude -p` y en el Agent SDK. No se ejecutan en una sesión WSL de la app de escritorio ([dónde se ejecutan los mods](https://code.claude.com/docs/en/plugins/mods/overview#where-mods-run)).

**En los planes Team y Enterprise**, y en equipos con ajustes administrados, Claude Code ejecuta su plugin integrado `cc-plugin-sec-default` antes que cualquier otro, salvo que un `prependPlugins` administrado lo excluya. Ese plugin envía los eventos clásicos de hooks de Claude Code a los plugins de usuario anteriores, y Claude Code muestra una línea por cada hook del guardia que omitió, como «agent-usage-guard: its classic.PostToolUse hook was skipped». El guardia sigue las compactaciones, los bloqueos, `/clear` y las reanudaciones, y los hooks Stop que reabren un turno mediante eventos que todavía le llegan. Dos cosas necesitan los eventos clásicos: el modo de permisos llega al guardia solo cuando arranca un agente, así que puede preguntarte en modo `dontAsk`, y las bifurcaciones `/subtask` no se cuentan.

**Los límites nativos siguen importando.** Claude Code limita una sesión a 20 subagentes concurrentes (`CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS`) y tres niveles de anidamiento (`CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH`). No tiene límite para el número total de agentes que inicia una sesión. Desde la v2.1.316, `CLAUDE_CODE_SUBAGENT_EFFORT` define el esfuerzo con que se ejecutan los subagentes cuando nadie más lo especifica, en lugar del de la sesión: uno más bajo abarata cada agente, y el guardia sigue limitando cuántos se ejecutan. Los valores por defecto del guardia son más estrictos y abarcan varias sesiones; los límites nativos siguen siendo el muro exterior para las rutas que el guardia solo cuenta.

## Mira lo que hizo

```text
/agent-guard report 30
```

El informe cuenta los bloqueos por límite de uso (una vez por ventana bloqueada), los cruces de umbral de ventana del plan, las notas de cierre y cada pregunta y rechazo por regla, con lo que respondiste. Lee el diario de cada sesión de este equipo y nunca sale de él. Define `AGENT_GUARD_JOURNAL=0` para dejar de registrar.

## Seguridad y privacidad

Un mod se ejecuta dentro de Claude Code con tus permisos; lee [qué puede alcanzar un mod](https://code.claude.com/docs/en/plugins/mods/overview#what-a-mod-can-reach) antes de instalar uno. Este tiene unas 3.000 líneas de TypeScript sin dependencias, y `claude plugin validate .` enumera todas las API que llama y todas las variables de entorno que lee:

- No hace peticiones de red ni inicia procesos. El único archivo que lee es su propio `plugin.json`, para la versión que muestra `/agent-guard status`.
- Solo decide lo que describen las reglas anteriores: si arranca un agente, se envía una solicitud o se ejecuta una llamada a herramienta. Te pregunta cuando puedes responder y da el motivo cuando rechaza. Lee los modos de permisos pero nunca los cambia, y no escribe ajustes.
- La única solicitud que envía es la tuya. Tras «Compactar y enviar», toma la solicitud que escribiste en el cuadro de entrada y la envía sin cambios cuando termina la compactación, o la devuelve si la compactación falla. Una solicitud con imagen o mención @ permanece en el cuadro para que la envíes tú, porque reenviarla las perdería.
- Su hook de solicitud deja pasar tu solicitud sin cambios, añade una nota única para Claude cuando el contexto supera 300 mil o una ventana del plan alcanza el 95 %, o retiene la solicitud para preguntarte primero (cuando nadie puede responder, dice el motivo en su lugar). Su hook `SessionStart` no cambia nada.
- Guarda su estado en el almacén del mod, un archivo JSON bajo `~/.claude/plugins/store/`. Cada sesión escribe sus propios recuentos (agentes en ejecución, inicios y reanudaciones latentes recientes, tokens de subagentes por minuto, su última lectura de 5 horas), cuándo estuvo activa por última vez (conservado 30 días, para que una sesión reanudada sepa cuánto tiempo estuvo inactiva) y las filas de su diario (hora, prefijo de id de sesión, regla, nombre de herramienta, cubo de contexto como `400-500k`, ventana del plan y porcentaje, número de rechazo y tu respuesta). Cada registro se guarda bajo el id completo de la sesión, que también es el nombre del archivo de transcripción de esa sesión. Si el almacén deja de guardar, por ejemplo si está lleno, la línea de estado lo indica: entonces las demás sesiones dejan de contar esta.
- Nunca guarda texto de solicitudes, entradas de herramientas, texto de errores ni salidas del modelo. Cuando un turno termina con un error de API, lee el último mensaje de la conversación, el error que mostró Claude Code, para distinguir un bloqueo por límite de uso de otros fallos. Una llamada a herramienta se reduce a una huella de 13 caracteres. Los nombres de agentes permanecen en memoria y nunca se escriben.
- Los días del diario anteriores a 90 días se eliminan (`AGENT_GUARD_JOURNAL_DAYS`).
- `demo/`, que genera el GIF anterior, no forma parte de lo que se ejecuta. Inicia Claude Code en un directorio personal temporal con una clave de API inventada para una API local guionizada, y no lee ninguna de tus credenciales.

Define `AGENT_GUARD=0` para desactivarlo sin desinstalarlo.

## Configuración

Define estas variables de entorno, o bajo `env` en `~/.claude/settings.json`. Los tiempos van en segundos; un valor que no sea un número en el rango conserva su valor por defecto, y `/agent-guard` lo indica.

| Variable | Significado (valor por defecto) |
|---|---|
| `AGENT_GUARD` | `0`, `false`, `off` o `no` desactivan el guardia (`1`) |
| `AGENT_GUARD_JOURNAL` | `0` detiene el diario (`1`) |
| `AGENT_GUARD_HAIKU_EXEMPT` | `0` cuenta los agentes Haiku en los límites de agentes en ejecución e inicios como cualquier otro (`1": quedan fuera) |
| `AGENT_GUARD_JOURNAL_DAYS` | Días de diario conservados (`90`) |
| `AGENT_GUARD_WINDOW_SECONDS` | Ventana móvil para presupuestos, consumo y rechazos (`600`) |
| `AGENT_GUARD_AGENT_MAX` | Agentes ejecutándose a la vez en este equipo (`4`) |
| `AGENT_GUARD_ROLLING_MAX` | Inicios y reanudaciones de agentes por ventana en este equipo (`12`) |
| `AGENT_GUARD_AGENT_TOKENS_MAX` | Tokens de subagentes por ventana en este equipo (`10000000`) |
| `AGENT_GUARD_DEPTH_MAX` | Niveles de agentes por debajo de la conversación principal (`1`) |
| `AGENT_GUARD_LIMIT_ASK_PERCENT` | Porcentaje de ventana del plan a partir del cual los agentes nuevos preguntan (`80`) |
| `AGENT_GUARD_LIMIT_DENY_PERCENT` | Porcentaje de ventana del plan a partir del cual se rechazan agentes nuevos, despertares y tareas programadas y se dice a cada sesión que cierre (`95`) |
| `AGENT_GUARD_BURN_PERCENT` | Puntos de la ventana de 5 horas por ventana que hacen preguntar a los agentes nuevos (`20`) |
| `AGENT_GUARD_CONTEXT_WARN` | Contexto en el que se le dice a Claude una vez que mantenga el turno acotado (`300000`) |
| `AGENT_GUARD_CONTEXT_HARD` | Contexto en el que una solicitud pregunta antes de enviarse (`500000`) |
| `AGENT_GUARD_TOOL_CONTEXT` | Contexto por encima del cual las llamadas a herramientas cuentan para el presupuesto de herramientas (`400000`) |
| `AGENT_GUARD_TOOL_MAX` | Llamadas a herramientas por ventana por encima de ese contexto (`20`) |
| `AGENT_GUARD_DORMANT_SECONDS` | Tiempo de inactividad tras el cual la caché de una sesión intensa se considera caducada (`3600`) |
| `AGENT_GUARD_DORMANT_CONTEXT` | Contexto a partir del cual una sesión inactiva se considera intensa (`150000`) |
| `AGENT_GUARD_DORMANT_MAX` | Reanudaciones intensas latentes por ventana en este equipo cuando no se puede preguntar a nadie (`1`) |
| `AGENT_GUARD_TOOL_FAILURE_MAX` | Fallos idénticos antes de rechazar el reintento idéntico (`3`) |
| `AGENT_GUARD_FUSE_MAX` | Llamadas a agentes rechazadas por periodo de fusible que pausan la creación (`5`) |
| `AGENT_GUARD_FUSE_SECONDS` | El periodo del fusible y cuánto dura la pausa (`600`) |
| `AGENT_GUARD_PEER_TTL_SECONDS` | Cuánto siguen contando los recuentos de otra sesión, o un agente sin señal de actividad (`900`) |

El valor por defecto de latencia asume la caché de solicitudes de una hora que obtienen las suscripciones dentro del uso del plan. Con clave de API o uso adicional, la caché dura cinco minutos, así que define `AGENT_GUARD_DORMANT_SECONDS=300`.

## Más allá de Claude Code

Las reglas viven en un núcleo agnóstico al arnés (`core/`) que no realiza E/S. El mod de Claude Code es su primer adaptador. [docs/architecture.md](docs/architecture.md) describe el contrato que cumple un adaptador y qué debe ofrecer otro arnés de agentes para aplicar cada regla.

## Pruebas

```sh
claude plugin validate . --strict
claude plugin test
```

`claude plugin test` ejecuta la suite con el propio kit de pruebas de Claude Code: pruebas unitarias del núcleo y pruebas que disparan eventos reales de Claude Code a través del módulo de hooks, sin sesión, modelo ni red. [TESTING.md](TESTING.md) cubre las capas y qué demuestra cada prueba.

## Licencia

MIT

## Fuente y licencia

- Autor original: [rbartoli](https://github.com/rbartoli/agent-usage-guard)
- Repositorio original: https://github.com/rbartoli/agent-usage-guard
- Licencia: MIT

Traducción al español y localización de interfaz: proyecto claude-code-mods-es
