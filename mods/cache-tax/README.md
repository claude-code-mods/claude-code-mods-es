<picture>
  <source media="(prefers-color-scheme: dark)" srcset="site/assets/cache-tax-dark.svg">
  <img src="site/assets/cache-tax-light.svg" alt="Cache Tax" width="64" height="64">
</picture>

# Cache Tax para Claude Code

**Mantén caliente la caché de solicitudes de Claude Code durante las pausas.**

Cache Tax es un mod de Claude Code que actualiza tu caché de solicitudes mientras te ausentas y muestra el coste estimado de reescritura antes de un envío en frío. Ejecuta `/keepwarm 90m` antes de una pausa. Los pings cuestan tokens; elige una ventana en la que esperes volver.

**[Instalación](#install)** · [Sitio web](https://cachetax.aidojo.si/) · [Cómo funciona](#how-it-works) · [Costes y límites](#cost-and-the-plan-limit-question) · [Comandos](#commands)

![Grabación real de cache-tax deteniendo un envío en frío con una estimación de 6,61 $](https://github.com/karanb192/cache-tax/raw/main/site/assets/refusal.gif)

Un resumen de dos líneas en una sesión de 330.000 tokens provocó una **estimación de 6,61 $**. Tras reenviar, la escritura de caché informada fue de **6,28 $**. Grabado en la 2.1.1; la redacción actual dice «hasta» el número estimado de tokens. Son costes equivalentes a API, no cargos adicionales de la suscripción.

## Instalación

Necesita [Claude Code 2.1.287 o posterior](https://code.claude.com/docs/en/plugins/mods/overview#turn-mods-on-or-off), una caché de una hora y Claude Code dejado en ejecución. Los mods están activados por defecto. Los pings cuestan tokens, incluida la salida sin límite.

```sh
claude plugin marketplace add karanb192/claude-code-mods
claude plugin install cache-tax@claude-code-mods-es
```

Reinicia Claude Code o ejecuta `/reload-plugins` en una sesión abierta. No hace falta ninguna bandera de acceso anticipado. Si antes definiste `CLAUDE_CODE_ENABLE_FUNCTION_HOOKS`, elimínala; el Claude Code actual la ignora.

En una sesión caliente, ejecuta `/keepwarm` para armar seis horas. Usa `/keepwarm 90m` para una ventana más corta o `/keepwarm off` para detenerla.

**Comprueba la duración de la caché principal.** El uso incluido en la suscripción tiene una hora por defecto. Las sesiones con clave de API, créditos de uso o proveedores en la nube tienen cinco minutos por defecto, así que define [`promptCacheTtl`](https://code.claude.com/docs/en/prompt-caching#choose-the-ttl-yourself) como `"1h"` para esas vías de facturación. Un temporizador de 50 minutos no puede proteger una caché principal de cinco minutos. Consulta [Límites](#limits) para ver la evidencia de las bifurcaciones.

**¿Prefieres un hook de ajustes?** La [versión hook](https://github.com/karanb192/claude-code-hooks/tree/main/plugins/cache-tax) avisa por defecto, rechaza una vez con `CACHE_TAX_BLOCK=1` y ofrece una cuenta atrás independiente en la línea de estado. El calentamiento forma parte de este mod.

Creado por [Karan Bansal](https://karanbansal.in/). Lee [la historia de Cache Tax y los costes de caché registrados](https://karanbansal.in/blog/cache-tax/).

## Opciones

En `/config`, bajo cache-tax:

    Auto keepwarm:    on | off
    Display:          band | status
    Ping floor:       2 (un número, 0 o más)
    Headless prompts: guard | send

`on` (el valor por defecto) mantiene el comportamiento de hoy: tras pagar una escritura de caché en frío, keepwarm se arma solo durante tres horas. `off` deja keepwarm intacto hasta que lo armes con `/keepwarm`; entonces la redacción del guardia dice que keepwarm sigue desactivado, o nombra el tiempo restante de una ventana que armaste. `/keepwarm always` lo activa de todos modos.

Ping floor divide el coste estimado de reescritura en frío en un presupuesto para pausas inactivas: 2 permite que el gasto estimado en pings quede por debajo de la mitad de una reescritura; 0 desactiva el límite. Antes de un ping, el gasto ya observado en esta pausa más la estimación del siguiente ping deben estar por debajo de ese presupuesto. La estimación usa el más barato de los cinco recibos calientes más recientes, recalculado para el modelo y contexto actuales, incluido su nivel de solicitud. Un turno principal nuevo reinicia el gasto; ampliar o detener y volver a armar una ventana no lo reinicia. Un ping omitido deja que la caché se enfríe. El registro y el estado dicen el motivo, y `$.cacheTax.status()` expone `pingSkipped` e `idlePingUsd`.

El primer ping no tiene recibo, así que se envía. Una respuesta posterior puede costar más de lo estimado, así que este es un límite basado en estimaciones, no una factura máxima garantizada. Sin precio de modelo, contexto ni recibos con precio, no se puede hacer comparación. Los recibos y el gasto están en memoria: un reinicio o una conversación nueva los borra. Los pings pueden terminar antes de la ventana de calentamiento solicitada.

Display elige dónde se muestra el estado mientras keepwarm está armado. `band` (el valor por defecto) es la fila sobre el prompt, con un icono de texto en terminales y el cubo en Desktop. `status` pone el mismo texto en la entrada de estado bajo el prompt y no dibuja ninguna fila: úsalo cuando otro mod sea dueño del espacio sobre el prompt. No hay ningún ajuste que lo oculte: los pings cuestan tokens, así que la pantalla siempre dice cuándo se ejecutan.

## Cómo funciona

**Antes de una pausa:** `/keepwarm` arma una ventana acotada. Tras 50 minutos inactivos, un temporizador dentro de Claude Code envía una bifurcación sin herramientas sobre la transcripción de la sesión. Lee el uso tras cada ping y se detiene si las lecturas son cero o las escrituras alcanzan el 10 % de las lecturas. El límite de gasto inactivo puede omitir pings posteriores antes de que termine la ventana. No hay ningún bucle de sondeo de transcripción en segundo plano.

**Cuando vuelves con la caché fría:** para un contexto de al menos 50.000 tokens, el guardia pregunta antes de que salga tu mensaje ordinario cuando su reloj de una hora indica frío. La pregunta muestra el coste estimado de reescritura y consejos de calentamiento. **Enviar de todos modos** envía ese mensaje; **No enviar** lo descarta. Si se descarta el diálogo o el host no puede responderlo, el guardia rechaza una vez y el reenvío pasa. Los hosts SDK que pueden responder al diálogo conservan esa elección. `/cache-tax guard refuse 5` pregunta a partir de 5 $, incluido un modelo sin fila de precio; los envíos más baratos registran su precio y continúan.

`Headless prompts: send` hace que las solicitudes no interactivas de origen `sdk` decidan enviar de inmediato con la configuración por defecto del guardia. Claude Code usa esos mismos campos tanto para los turnos `claude -p` como para los del Agent SDK, así que la opción cubre ambos; no puede distinguir la CLI de un host SDK. El valor por defecto, `guard`, sigue preguntando, o rechaza una vez donde nadie puede responder. Un `/cache-tax guard refuse` explícito, con o sin suelo en dólares, sigue aplicándose con `send`; `/cache-tax guard default` borra esa preferencia explícita. Los mensajes humanos remotos (orígenes `composer`, `bridge`, `unclassified` y de canales) conservan el guardia, incluso en un host no interactivo. Las notificaciones en segundo plano y las solicitudes programadas se envían con el precio registrado, porque nadie puede reenviarlas.

Un rechazo headless devuelve su motivo y lo registra en la transcripción o el registro de depuración. Usa `--debug-file` de Claude Code al diagnosticar un script. La API de mods no puede definir el código de salida del proceso ni escribir un rechazo en stderr; un rechazo no tiene que producir una salida distinta de cero ni un motivo en stdout. Una ejecución activada que alcance un suelo en dólares debe reintentarse de forma deliberada.

Por defecto, una escritura en frío detectada arma automáticamente al menos tres horas de keepwarm, la ventana always (seis horas salvo que definas otra) con `always` activado, e imprime lo que costó; la [opción](#options) Auto keepwarm desactiva la parte automática. `/cache-tax` muestra la estimación actual de caché, la ventana de calentamiento y el recuento de escrituras en frío de esta sesión.

El recuento sigue los recibos de caché. Para cada solicitud, estima el contexto anterior reescrito como el menor entre la escritura informada y el contexto previo menos la lectura informada. Una cola ausente menor del 10 % de la lectura se trata como acierto de caché. El contenido nuevo en un acierto no cuenta ni arma keepwarm; una reescritura parcial sustancial sí puede. Cada reescritura usa el modelo y nivel de precio de esa solicitud.

Si el host informa solo del uso agregado del turno, la estimación puede pasar por alto una reescritura oculta por lecturas de caché posteriores, y un turno compactado queda sin puntuar sin recibos por solicitud.

Cuando un envío permitido por el guardia no tiene una reescritura detectada, una nota final explica que no se abrió ninguna ventana automática de escritura en frío, o nombra el estado de calentamiento existente. Esto no confirma el estado de caché del servidor a partir del uso agregado. Una finalización de escritura en frío interrumpida por `/clear` no puede abrir su ventana automática en la conversación de reemplazo.

Preparar u omitir una compactación deja el calentamiento intacto. Una compactación aplicada lo pausa hasta que una solicitud principal lee o escribe el nuevo prefijo. Entonces una ventana armada puede reanudar los pings mientras el turno espera una herramienta o una respuesta del usuario. Las escrituras de resumen quedan fuera del recuento; una reescritura pagada antes de la compactación conserva su contexto y precio originales.

Las ventanas pertenecen a sesiones concretas. Una sesión ya fría espera a tu siguiente turno antes de hacer ping, y también una ventana restaurada tras reiniciar Claude Code, hasta que el nuevo proceso tenga un turno que bifurcar. Si un ping no encuentra nada que bifurcar, una nota de una línea lo dice una vez y los pings empiezan tras tu siguiente mensaje. Un ping rechazado por una API ocupada (429, 529, 5xx) se reintenta a los 1, 2 y 4 minutos mientras todavía pueda llegar antes de que la caché se enfríe. Con `always` activado, cada uno de tus turnos que llega a la caché deja al menos la ventana always (seis horas por defecto) en el periodo por defecto, sujeto al límite de gasto inactivo y a una lectura caliente correcta. `/keepwarm always 24h` convierte ese suelo en 24 horas para todas las sesiones (de 1 h a 168 h; `/keepwarm always` sin valor vuelve a seis). El mismo turno recupera una ventana detenida, alarga una más corta hasta la ventana always y reinicia un periodo de prueba; una ventana más larga que hayas definido se conserva. `/keepwarm off` en cualquier sesión detiene todas las sesiones a partir de su siguiente turno. Una ventana termina en su fecha límite; `/keepwarm off` también la cancela y borra el ajuste always.

### Un ping de calentamiento registrado

![Estado real de keepwarm mostrando una lectura de caché de 75.000 tokens por 0,02 $](site/assets/keepwarm-receipt.png)

Sonnet 5, 16 de septiembre de 2026: el estado informó de **75.000 tokens leídos por 0,02 $**. Nada apareció en la conversación durante la ejecución real. Esta captura usó el intervalo de prueba de un minuto en la 2.0.0; la estimación de reescritura de 0,45 $ de su tarjeta usaba una fila de precio de Sonnet antigua, frente a 0,30 $ para el mismo contexto con la fila actual. El ping de dos centavos es un recibo de esa sesión, no un precio fijo.

## Por qué un mensaje corto puede costar tanto

Cuando caduca el prefijo en caché, incluso «resúmeme» puede desencadenar una reescritura del contexto anterior antes de la respuesta. La fila de precios de Fable 5.1 de Cache Tax compara una escritura de 1 h de 20 $ con una lectura de caché de 0,25 $ por millón de tokens: 80x por token, no 80x de ahorro total. Consulta las [suposiciones de precio](#cost-and-the-plan-limit-question) y la [tabla de precios de Anthropic](https://platform.claude.com/docs/en/about-claude/pricing).

[Ver la descripción de 23 segundos](docs/assets/cache-cost-explainer.mp4). Sus escenas diseñadas etiquetan los precios de lista de Fable 5.1; cada píxel de terminal y línea de estado procede de la grabación real del rechazo y del recibo de calentamiento anteriores. El rechazo se grabó en la 2.1.1 y el recorte de calentamiento en la 2.0.0.

¿No conoces la caché? [Anthropic explica cómo la usa Claude Code](https://code.claude.com/docs/en/prompt-caching).

## Comandos

    /keepwarm               mantener caliente durante seis horas
    /keepwarm 90m           mantener caliente durante una ventana propia, de 1m a 168h (también 2h30m, 6h)
    /keepwarm always        mantener caliente cada sesión hasta seis horas después de su último turno, recordado entre sesiones
    /keepwarm always 24h    igual, hasta 24 horas después del último turno (de 1h a 168h)
    /keepwarm 6h every 2m   ping cada dos minutos; un ajuste de prueba, de 1m a 59m, olvidado tras esta ventana (con always activado, en tu siguiente turno)
    /keepwarm status        la ventana de calentamiento, el siguiente ping y el último recibo
    /keepwarm off           detener, olvidar la ventana y desactivar always
    /cache-tax              la tarjeta
    /cache-tax guard warn   mostrar el precio y enviar (el valor por defecto del hook)
    /cache-tax guard default
                            restaurar el guardia por defecto y dejar que Headless prompts controle los envíos SDK no interactivos
    /cache-tax guard refuse preguntar antes de un envío en frío, anulando Headless prompts: send
    /cache-tax guard refuse 5
                            preguntar solo a partir de 5 $; por debajo, mostrar el precio y enviar
    /cache-tax guard test   preguntar una vez en la siguiente solicitud que envíes como si la caché estuviera fría, con el precio del contexto de esta sesión; la prueba no puntúa nada, un envío a una caché realmente fría se puntúa como siempre

`/keepwarm` rechaza palabras extra, duraciones no válidas y ventanas fuera de los límites sin cambiar la ventana de calentamiento actual. También descarta al inicio fechas límite guardadas no válidas o demasiado largas. Una ventana que termina antes de que venza su primer ping lo dice en su respuesta.

La pregunta, literalmente, con **Enviar de todos modos (4,01 $)** y **No enviar** debajo:

    cache-tax: the prompt cache went cold 2h00m ago. Sending this re-writes up to 200,502 tokens at $20/MTok = $4.01 (a warm turn would have cost $0.05). Don't send saves $4.01; after Send anyway, keepwarm is armed for up to 3h00m. The cache read alone is about $0.05 per ping. Pings may stop sooner at the idle spending limit, leaving the cache to go cold. Send it anyway?

Cuando se descarta la pregunta o una ejecución headless con guardia no puede mostrarla, aparece en cambio el rechazo y el reenvío pasa:

    cache-tax: the prompt cache went cold 2h00m ago. Sending this re-writes up to 200,502 tokens at $20/MTok = $4.01 (a warm turn would have cost $0.05). Send it again to pay it, and keepwarm will be armed for up to 3h00m, but may stop sooner at the idle spending limit. Or /clear and start from a note.

La cifra es un límite superior. El recuento de contexto que el motor informa para una sesión reanudada es la entrada, lectura de caché, escritura de caché y salida de la última respuesta juntas, y la carga de reanudación no lleva un recuento de salida separado que restar; en una sesión de 15 días el guardia dijo 330.316 tokens y 6,61 $ y la escritura que siguió fue de 314.000 tokens, 6,28 $.

Mientras keepwarm está armado, la terminal y la pestaña Code de Desktop muestran una fila sobre el prompt, salvo que Display sea `status`. Las terminales usan un icono de texto `[>]` en negrita con el color del estado. Desktop muestra el cubo de Cache Tax, con tapa verde para caliente, naranja para frío y gris antes del primer turno o tras una compactación. La etiqueta de estado en negrita coincide; el temporizador y el texto del recibo usan peso normal. Un `NO_COLOR` no vacío selecciona un icono de texto en negrita en ambas superficies y elimina el color del estado. Ambas opciones de visualización dicen `warm`, `cold` u `unknown`, así que el color nunca es la única señal. Estos estados usan el mismo reloj de una hora que `/cache-tax`; son estimaciones, no una comprobación en directo de la caché del servidor.

La fila y el respaldo de estado simple se actualizan una vez por minuto mientras keepwarm está armado, incluso inactivo. Actualizar solo cambia la visualización; no envía ninguna solicitud al modelo.

La fila incluye la ventana de calentamiento, el siguiente ping y la última lectura. Un bucle detenido muestra un símbolo neutro y su motivo. `/keepwarm off` o una ventana caducada elimina la fila. Las encuestas tienen prioridad temporal, y el contenido de otros mods permanece en la banda. La visualización `status` muestra el mismo texto etiquetado en la entrada de estado; las superficies sin banda conservan el texto de estado simple cuando Display sigue siendo `band`.

El cubo de Desktop y el color de estado frío de la terminal siguen el tema claro u oscuro de Claude. Los SVG incrustados proceden de los recursos oficiales del sitio web; los mantenedores pueden regenerarlos con `python3 tools/generate-status-icons.py`. No se lee ni se descarga ningún archivo de imagen en tiempo de ejecución.

El mod lee el tema y `NO_COLOR` una vez al iniciar la sesión. Los cambios de tema aceptados actualizan el icono de inmediato; los redibujados ordinarios no vuelven a leer ninguna de las dos opciones. Define `NO_COLOR` antes de iniciar la sesión.

## Ambas formas instaladas

El hook y el mod comparten nombre y función, así que tener ambos significa dos guardias en cada envío en frío. El mod comprueba al iniciar la sesión si existe el comando `/cache-tax:status` del hook y lo dice una vez. Conserva un solo guardia. El hook sigue siendo una opción para quienes prefieren hooks de ajustes. Antes de desinstalarlo, comprueba tu línea de estado: la fila 🧊 conectada a `cache-tax.js` viene de los archivos del hook. Este mod dibuja sobre el prompt mientras keepwarm está armado; no sustituye tu línea de estado del shell.

## Qué puede alcanzar

Validado en Claude Code 2.1.312:

    ❯ ./register.ts hooks: config.set{key=theme}, ui.render{component=AbovePrompt}, session.start, session.end, classic.SessionStart, command.run{command=keepwarm}, command.run{command=cache-tax}, prompt.submit, turn.step, turn.complete, session.compact
    ❯ ./register.ts calls: $.clock.after (via arm, ping), $.clock.every (via updateStatus), $.clock.now, $.command.list, $.command.register, $.config.list, $.env.get, $.model.fork (via ping), $.session.id (via reseat, seat), $.session.model, $.session.usage, $.store.delete, $.store.get, $.store.set, $.ui.ask (via ask), $.ui.invalidate, $.ui.log, $.ui.resolve, $.ui.status
    ❯ ./register.ts env reads: NO_COLOR

Alcance L2, conduce a Claude. Ve cada solicitud que escribes, el momento de cada petición al modelo y los recuentos de tokens de cada respuesta.

El mismo análisis está en [la página de cache-tax en Awesome Claude Code Mods](https://mods.aidojo.si/mods/karanb192--cache-tax--cache-tax/), que registra qué pueden alcanzar miles de mods más.

    Threat model for cache-tax (reach L2, drives Claude)
    1. Reads:    of each prompt, whether it starts with a slash and nothing else (the text is passed on untouched, never kept, never logged); the time; the token counts and model id the engine already holds on turn.complete and on the fork's reply; the resume fields Claude Code computes for settings hooks; the command list; the session id, the session's model and the engine's own context figure and start time, once per conversation the process runs, and the model again before pricing a cold send and before each ping; the reason and session id of a conversation ending under /clear or an in-process resume; each main request's message count; from its own $.store, the keepwarm deadline and the ping period keyed by session id, plus the global always switch (and its window) and guard mode with its dollar floor; at load, its Auto keepwarm, Display, Ping floor and Headless prompts options; whether the session starts interactive
    2. Runs:     one $.model.fork per idle stretch inside a keepwarm window, one per ping period (50 minutes unless the testing knob set it, floor 1 minute), never outside the window, never onto a cache the mod already knows is cold, never after a readback that read nothing or wrote at least a tenth of what it read, when prices and receipts are known, only while observed idle spend plus the next estimated ping stays below the rewrite cost divided by Ping floor (0 disables the limit); one question in Claude Code's own dialog before a cold send goes out, or on the next prompt after /cache-tax guard test
    3. Sends:    nothing leaves the machine except the fork, an API request over the session's own transcript with a fixed one-line prompt
    4. Persists: in $.store, the keepwarm deadline and the ping period under this session's id (with always on, rewritten after each turn), and the always switch (true, or its window in milliseconds) and the guard mode (a dollar floor is stored in its place) for every session; after a refusal, the time of the last response under this session's id, so a resend from a new process (claude -p starts one per turn) goes through, deleted by that resend or /clear; a window that has ended is deleted at stop and at this session's next start, together with the bare keys of a 2.1.0 store; another session's keys are never deleted here, because a read followed by a delete cannot be made atomic against that session renewing its window, so a session that armed keepwarm and never came back leaves two small keys behind; the session's cold-write tally, up to five warm ping receipts and idle ping spend live in memory and die with the process
    5. Hostile input: the only text it parses is the argument of its two commands, matched against a duration regex, a dollar amount and a few literals; the dialog's answer is only compared with its own two labels; of the prompt text only the first non-blank character is inspected, for a slash; tool results and files never reach a branch; the fork's prompt is a constant, so nothing crafted can be sent through it; the guard only ever drops the user's own message: after Don't send the resend is asked about again, and after a dismissed or unanswerable question the resend is unconditional; if a hook throws, the engine skips it and the message enters unguarded, with one dim line

## Coste y la pregunta del límite del plan

Los precios son la tabla de lista, donde Fable 5.1 lee a 0,25 $, escribe el nivel 1 h a 20 $ y responde a 50 $ por millón de tokens; Fable 5.2 (0,20 $, 16 $, 40 $) y Sonnet 5 (0,20 $, 4 $, 10 $) tienen sus propias filas. Solo se ponen a precio las versiones listadas: un modelo más nuevo que la tabla muestra `n/a` en dólares y una línea diciendo que aún no tiene fila de precio, y nunca toma la tarifa de un modelo anterior. Con clave de API la aritmética es clara. Un ping factura la lectura de caché, sus propios pocos tokens sin caché a la tarifa base y lo que el modelo responda a la tarifa de salida; el coste de ping mostrado cuenta todo, porque una bifurcación no impone límite de salida y un modelo con mucho esfuerzo puede pensar antes de decir «caliente». Un regreso tras el caducidad es una escritura. La tarjeta imprime el límite superior solo de lectura para tu modelo, 80 pings en Fable 5.1, con el tiempo inactivo que cubren al periodo actual de ping; un ping real cuesta algo más que una lectura, así que el punto de equilibrio real está por debajo de esa cifra. En una suscripción los dólares son una referencia, no la factura, y cómo pesa una lectura de caché frente a los límites de 5 horas y semanales no está documentado en ningún sitio que haya encontrado. Observa la fila de límites de tasa de tu línea de estado durante la primera ventana.

## Límites

- Los mods requieren Claude Code 2.1.287+. Están activados por defecto, pero los ajustes locales, el modo seguro o la política de la organización pueden impedir que se carguen. Consulta [controles de mods](https://code.claude.com/docs/en/plugins/mods/overview#turn-mods-on-or-off).
- El programador de 50 minutos necesita una caché principal de una hora. El uso incluido en la suscripción la tiene por defecto. Otras vías de facturación necesitan [`promptCacheTtl`](https://code.claude.com/docs/en/prompt-caching#choose-the-ttl-yourself) definido como `"1h"`.
- Un retorno verificado en la transcripción con el intervalo por defecto, Fable 5.1 en una suscripción, 19 de septiembre de 2026: `/keepwarm` se armó en el minuto 42 de una pausa, el ping se disparó en el minuto 50 y leyó 157 mil, y el mensaje enviado en el minuto 62 leyó 156.886 tokens de caché y escribió 2.255. La cuenta atrás de caché propia de Claude Code se reinició a 58 minutos tras el ping, así que la bifurcación arrastró el TTL de una hora. Una ejecución, una configuración: muestra que el ping mantuvo esa caché viva más allá de la hora, no un ahorro neto en todas las configuraciones. Claude Code documenta las bifurcaciones en su cubo de solicitudes no principales, normalmente cinco minutos. En esta ejecución, la bifurcación siguió leyendo el prefijo de sesión de una hora y reinició la cuenta nativa. Ese es un comportamiento observado en una configuración, no la prueba de que todos los proveedores gestionen los cubos igual.
- Un ping que lee caliente prueba que la caché estaba caliente entonces. Los cambios de prefijo pueden invalidar la caché con independencia del tiempo. El efecto exacto depende del modelo y de cuándo Claude Code aplique el cambio; consulta [el comportamiento de caché de Claude Code](https://code.claude.com/docs/en/prompt-caching).
- Los campos de reanudación permiten al guardia comprobar el primer envío ordinario tras reanudar. Si esos campos faltan, el primer turno siembra su reloj y su contexto.
- En cuentas Team y Enterprise, un plugin administrado situado por encima de este mod gestiona los eventos clásicos y la compactación y continúa por debajo de él, así que nunca llegan al mod. Entonces aprende un `/clear` del final de la sesión, de modo que keepwarm se detiene y la nueva conversación tiene su propia ventana; el contexto de una transcripción reanudada a partir de las cifras del motor, sin hora de su última respuesta, de modo que a una hora del primer lanzamiento de esa transcripción el primer mensaje registra lo que costaría un envío en frío en lugar de rechazarlo; y una compactación a partir de una solicitud con menos de la mitad de los mensajes de la anterior (un rewind quita unos pocos, un resumen sustituye decenas), de modo que un ping o un envío entre la compactación y esa solicitud sigue viendo el contexto antiguo. El resumen escrito tras una compactación nunca se puntúa como escritura en frío; una escritura en frío pagada en el mismo turno antes de ella sí, cuando el host informa del uso por solicitud. Una ventana arrastrada mediante una reanudación en el mismo proceso pasa a las claves de la nueva sesión.
- El recuento de tokens del guardia es un límite superior: es el contexto que el motor informa para la última respuesta, que en una reanudación incluye la salida de esa respuesta, y el mod no tiene un recuento de salida separado que restar.
- El recuento de escrituras en frío es por sesión y está en memoria; `/clear` lo vacía.
- El tamaño de contexto es la cifra de ventana en directo del motor. El uso de un turno es la suma de sus respuestas, lo que en un turno de diez pasos son diez lecturas del contexto, así que solo es el respaldo cuando el host no informa de una cifra en directo.

## Desarrollo local

Desde un checkout local, cárgalo para una sesión:

    claude --plugin-dir .

Para mantenerlo instalado, usa los [comandos de marketplace](#install).

¿Enviando un cambio? [CONTRIBUTING.md](CONTRIBUTING.md) dice qué evidencia necesita un PR.

## Compruébalo en tu propia sesión

Las pruebas con reloj simulado demuestran el temporizador, el guardia y la puntuación, no que una bifurcación alcance la caché principal. Un ping lo demuestra, y cuesta una lectura de caché más la respuesta. En cualquier sesión caliente:

    > Reply with one word: ready
    > /keepwarm 1h every 1m

Observa la fila sobre el prompt tras un minuto, o la entrada de estado cuando Display es `status` o la superficie no tiene banda. `last ping read 20k $0.01` informa de la lectura de la bifurcación. `keepwarm stopped: the ping read ... and wrote ...` significa que la lectura no alcanzó el umbral caliente; el bucle se ha detenido. `API busy, ping retry 1 of 3` significa que se está reintentando un 429, 529 o 5xx; el bucle se detiene si la API sigue ocupada tras tres reintentos o un minuto antes de que la caché se enfríe. `nothing to fork yet` significa que el proceso no tiene conversación que bifurcar, como tras un reinicio; la ventana espera tu siguiente mensaje. Cualquier otro error de API, una interrupción o una respuesta vacía detiene el bucle con un motivo. Los motores antiguos que devuelven null muestran un mensaje combinado de instantánea fría o fallo de API. Termina con `/keepwarm off`. Esta comprobación breve establece una lectura de caché, no la retención durante el intervalo por defecto de 50 minutos.

## Pruebas y comprobación de tipos

Ejecuta desde la raíz del repositorio:

```sh
claude plugin validate .claude-plugin/plugin.json
claude plugin test .
```

Las [366 pruebas](tests/register.test.ts) usan un reloj y un motor simulados. Cubren:

- **Opción Auto keepwarm:** desactivada puntúa una escritura en frío pagada sin armar keepwarm y lo dice en el rechazo y la pregunta; una ventana armada a mano se mantiene hasta su fecha límite y sigue haciendo pings; always sigue renovando seis horas.
- **Opción Ping floor:** el gasto acumulado detiene una pausa larga, un turno principal lo reinicia, volver a armar no lo reinicia, un recibo barato reciente sobrevive a un valor atípico caro, un cambio de modelo se pone a precio antes del siguiente ping, y un comando off durante la lectura del modelo cancela ese ping. Un ping facturado a través de una parada sigue contando, uno que termina después de un turno no, y un turno con error conserva la omisión. Siguen las coberturas existentes de omisión, compactación, clear, contexto desconocido y límite desactivado.
- **Opción Headless prompts:** activación para solicitudes SDK no interactivas, respuestas al diálogo SDK, guardias SDK interactivos y humanos remotos, rechazo explícito y suelos en dólares, vuelta al valor por defecto, y una solicitud que llega mientras aún se cargan las preferencias guardadas.
- **Guardia:** la pregunta Enviar de todos modos / No enviar, su respaldo al descartarse y la prueba del guardia, rechazar una vez y reenviar, incluso desde un proceso nuevo y tras un error de API sin respuesta, modo warn, un suelo en dólares (por debajo, en él, un modelo sin precio, un modelo cambiado desde el último turno), comandos de barra, contextos pequeños, solicitudes que nadie escribió, siembra al reanudar y puntuación de escritura en frío.
- **Calentamiento:** valores por defecto del comando y ventanas y periodos rechazados, always/off, always con su propia ventana y las ventanas que rechaza, always tras `/clear`, always rodando desde el último turno, reinicios por inactividad, parada según uso, caducidad de ventana fría y temporizadores retrasados tras suspensión.
- **Estado de sesión:** claves de almacén aisladas, ventanas restauradas, limpieza de versiones antiguas, reinicios por clear/compactación y aislamiento de subagentes. Un clear durante el reloj o la espera de almacén de una ventana automática no puede armar la conversación siguiente ni borrar su ventana manual.
- **Preparación para compactación:** preparar u omitir un resumen deja el calentamiento intacto. Tras una compactación aplicada, una respuesta principal que lee o escribe caché permite reanudar el calentamiento mientras el turno espera herramientas o una respuesta del usuario. Las escrituras de resumen quedan fuera del recuento de escrituras en frío; las solicitudes fallidas y las respuestas obsoletas tras clear, stop o una compactación más reciente no pueden reiniciar los pings.
- **Plugins administrados por encima del mod:** `/clear`, reanudación, una ventana restaurada y compactación con los eventos clásicos y de compactación continuados por debajo de la capa de usuario, los mismos eventos entregados dos veces o desordenados sin una segunda ventana, aviso o reinicio, una ventana y un cambio de modelo arrastrados por una reanudación en el mismo proceso, una transcripción que envejece lo suficiente para estar fría tras su reanudación, un rewind distinguido de una compactación, una escritura de resumen que no es escritura en frío junto a una que sí (un envío con guardia compactado antes de su primera solicitud, dos compactaciones en un turno), un final de la conversación antigua que se solapa o dura más que la reanudación clásica, y una ejecución de `/keepwarm` antes de que el host informe del id de la conversación siguiente.
- **Precios y visualización:** una fila para cada modelo listado en sus grafías con fecha, proveedor y nombre de visualización, ninguna fila prestada para una versión que la tabla no lista, una escritura en frío sin fila de precio contada aparte del total en dólares, el nivel de prompt largo de Haiku 5.5 con precio por solicitud, un turno caliente largo cuyas solicitudes juntas escriben la mitad del contexto separado de una escritura en frío, aciertos de caché con guardia y pegotes grandes sin puntuar, reescrituras parciales separadas del contenido nuevo, lecturas posteriores que no pueden ocultar una pérdida por solicitud, recibos antiguos descartados a través de una solicitud retenida o una lectura de contexto durante clear, Opus 4 y 4.1 separados de Opus 4.5, costes de salida y entrada sin caché, recuentos de contexto, formato de duración y la cifra de equilibrio solo de lectura.
- **Indicador:** iconos de texto de terminal sin elementos de imagen, SVG de escritorio, selección de tema, transiciones caliente/frío, reanudación, compactación, clear, caducidad, encuestas, contenido de otros mods y respaldo `NO_COLOR`.
- **Opción Display:** `band` dibuja la fila; `status` mueve el texto, incluidas sus etiquetas cache-tax y de estado, a la entrada de estado en superficies de terminal y Desktop sin fila. Cualquier otro valor, como un `off` antiguo, cae a la fila.
- **Preferencias:** una lectura por sesión, actualizaciones inmediatas de tema, cambios denegados y el tema efectivo devuelto por el escritor de ajustes.
- **Fallos de bifurcación:** una API ocupada se reintenta mientras la caché está caliente, un reintento que despierta demasiado tarde se descarta, nada que bifurcar espera al siguiente turno, solo un ping a la vez, una respuesta que llega después de una solicitud, `/clear` o una compactación se descarta, y otros fallos y el resultado null devuelto por versiones anteriores se detienen sin reintentar.

Las pruebas de renderizado comprueban el árbol de elementos, no los píxeles nativos de terminal o escritorio. No validan la retención de caché en el servidor. Consulta [la comprobación real](#prove-it-on-your-own-session).

### Comprobación de tipos

Carga este checkout con `claude --plugin-dir .` para generar declaraciones junto al plugin. Después, desde la raíz del repositorio:

```sh
npx -p typescript tsc -p .
```

Las declaraciones generadas están en `.claude-plugin/types/`. Déjalas sin seguimiento.

## Leer el estado desde otro mod

cache-tax añade un `$.cacheTax.status()` de solo lectura a la API de mods, así que una banda de estado puede mostrar keepwarm sin analizar `/cache-tax`. Es experimental hasta la 3.0: los campos pueden cambiar en una versión menor. `cold` es la misma estimación de una hora que muestra `/cache-tax`, no una comprobación de la caché del servidor. Resuelve a `{ keepwarm: 'on' | 'off' | 'stopped', leftMs, always, alwaysMs, autoWarm, guard, guardFloorUsd, cold, stopped, coldWrites, pingSkipped, idlePingUsd }`; los tipos están en `types/index.d.ts`. Donde cache-tax no está instalado no existe `$.cacheTax`, así que quien llama envuelve la llamada en `try`/`catch`.

## Más mods de Claude Code

cache-tax es uno de los [mods de caché de solicitudes para Claude Code](https://mods.aidojo.si/topics/prompt-cache/) listados en [Awesome Claude Code Mods](https://github.com/karanb192/awesome-claude-code-mods). Explora el catálogo completo en [mods.aidojo.si](https://mods.aidojo.si/) para encontrar un mod por tarea y ver a qué puede acceder antes de instalarlo.

## Fuente y licencia

- Autor original: [Karan Bansal](https://karanbansal.in/) (karanb192)
- Repositorio original: https://github.com/karanb192/cache-tax
- Licencia: MIT

Traducción al español y localización de interfaz: proyecto claude-code-mods-es
