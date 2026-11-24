# Inbox
> Versión en español por el proyecto claude-code-mods-es. El README original en inglés está en [README.en.md](README.en.md).


Tengo TDAH. Trabajar con un agente en un formato de hilo de chat es muy agotador a nivel cognitivo. La cantidad de cosas que tienes que mantener en la cabeza empieza a acumularse cuanto más dura la sesión. Las preguntas, los errores, las ideas y las tareas comienzan a amontonarse y entremezclarse, lo que dificulta mantener todo en orden.

Inbox proporciona un alivio inmediatamente evidente aquí al darle a tu agente un lugar organizado y estable para exponer todo lo que necesita una decisión. Inbox también se asegura de que tu agente siempre proporcione un conjunto proactivo y anticipatorio de acciones rápidas en cada elemento, incluyendo una acción recomendada.

Aún mejor, Inbox le da a tu agente un lugar para exponer problemas y oportunidades latentes, aquellos que de otro modo podría pasar por alto en aras de abordar exclusivamente la tarea en cuestión.

Inbox está disponible para Claude Code en la terminal y la aplicación de escritorio, Codex en la aplicación de escritorio de ChatGPT, y omp en la terminal. En la aplicación Herdr, también puede abrirse en un panel junto a la terminal. Cada variante está diseñada de forma única para cada plataforma, pero funciona de la misma manera fundamental en todas ellas.

## Cómo funciona
https://github.com/user-attachments/assets/a493119c-4d8b-46e0-a18a-bd0ecf041b6b


## Instalación

Si eres como yo, simplemente pega un enlace a este repositorio de GitHub a tu agente y pídele que lo instale.

Si quieres hacer las cosas a la manera antigua, continúa...

### Claude Code

En una sesión de Claude Code en la terminal, escribe:
```
/plugin install inbox --marketplace petekp/inbox
```
Responde `y` para agregar el marketplace, luego elige un alcance. Empieza a funcionar en
esa sesión. Una instalación con alcance de usuario también cubre las sesiones de Code en la
aplicación de escritorio de Claude en esta máquina.

Para instalar desde la aplicación de escritorio de Claude en su lugar, abre una sesión de Code:

1. Haz clic en **+** junto al prompt, luego en **Plugins**, luego en **Manage plugins**.
2. En la página Plugins, haz clic en **Add** en la parte superior derecha, luego en **Add
   marketplace**, luego en **Add from a repository**.
3. Escribe `petekp/inbox`, elige **inbox / petekp** de la lista y haz clic en
   **Sync**.
4. En Inbox, haz clic en **Add to this computer**.
5. Vuelve a tu sesión y escribe `/inbox` para abrir el panel.

Esto lo instala para tu cuenta de usuario, así que también funciona en la terminal.
`/plugin` no se ejecuta en la aplicación de escritorio, y el inbox no llega a las
sesiones en la nube de la aplicación.

Si tu organización administra Claude Code, un inbox que instales tú mismo
funciona con dos diferencias. Después de `/clear` o de reanudar, carga la
lista de esa conversación en tu primer mensaje. Una solicitud de permiso llega al
inbox aproximadamente un segundo y medio después de aparecer. Para obtener todo, pídele
a un administrador que incluya el inbox en la configuración administrada de tu organización.

Para actualizar, ejecuta estos comandos, luego `/reload-plugins` en cualquier sesión que ya esté
abierta:
```sh
claude plugin marketplace update inbox
claude plugin update inbox
```
- Hace dos llamadas a Sonnet después de cada una de las respuestas de Claude, una para las filas y otra para la pestaña Status. Consulta [Costo](#cost).
- Fue construido y probado con Claude Code 2.1.300.

### Codex
```sh
codex plugin marketplace add petekp/inbox
codex plugin add inbox@inbox
```
Si tu shell dice `command not found: codex`, usa la copia dentro de la
aplicación de ChatGPT en lugar de `codex` en ambos comandos:
```sh
/Applications/ChatGPT.app/Contents/Resources/codex-cli/CodexCLI.app/Contents/MacOS/codex
```
Luego, en la aplicación de escritorio de ChatGPT, confía en los hooks del plugin: haz clic en el icono de hook
junto a la configuración de aprobación del prompt, luego en Allow all. Si el icono no está ahí,
abre Settings, luego Hooks, luego Inbox, luego Trust all. Codex ejecuta los hooks de un plugin
solo después de que confíes en ellos. En Codex 0.164.0 y posteriores, una actualización detiene
los hooks, así que vuelve a confiar en ellos después de cada actualización. Para abrir el inbox, abre el
panel lateral y elige el menú ⋯ junto a New, luego Inbox. Esto se verificó el
2026-11-14 en la aplicación de ChatGPT con Codex 0.169.

[codex/README.md](codex/README.md) cubre la actualización y la ejecución del comando `codex`
desde dentro de la aplicación.

### omp
```sh
omp plugin marketplace add petekp/inbox
omp plugin install inbox@inbox-omp
```
El inbox empieza a funcionar en la siguiente sesión de omp. `omp plugin list` lo muestra
como `inbox@inbox-omp`. Lee `.omp-plugin/marketplace.json`, que omp busca
antes que la carpeta `.claude-plugin/` que lee Claude Code.

Para actualizar, ejecuta estos comandos, luego reinicia omp:
```sh
omp plugin marketplace update inbox-omp
omp plugin upgrade inbox@inbox-omp
```
Después de cada respuesta, el inbox hace dos llamadas al modelo, una para actualizar las filas y otra para escribir la pestaña Status. Usa
la primera de estas que tu omp pueda ejecutar:

1. El modelo que nombra tu rol `@inbox`.
2. El Sonnet más reciente de tus proveedores, `anthropic` primero.
3. Tu rol `@smol`.

Para configurar `@inbox`, agrégalo bajo `modelRoles` en el `config.yml` de omp, luego reinicia
omp:
```yaml
modelRoles:
  inbox: anthropic/claude-sonnet-5-5
```
Solo Sonnet está probado. Otro modelo puede funcionar, pero nadie ha comprobado qué tan bien.

Tu proveedor factura cada llamada según la tarifa de ese modelo.

Si `@inbox` no está configurado, o nombra un modelo que omp no puede usar, como un modelo desconocido
o uno en el que no has iniciado sesión, el inbox usa la siguiente opción. El pie del panel
muestra el modelo que usa. Un modelo que omp puede usar pero que falla cuando
se llama no pasa a la siguiente opción: esa actualización falla, y la siguiente respuesta lo reintenta.
Sin un modelo utilizable, el pie dice "no inbox model: set @inbox" y el
inbox no puede actualizarse.

### Para todos

La pestaña PRs necesita la CLI de GitHub, `gh`, con sesión iniciada.

## Cómo usarlo

Escribe `/inbox` en Claude Code o omp, o abre la pestaña Inbox en la aplicación de ChatGPT. El
inbox tiene cuatro pestañas: Status, Asks, Finds y PRs.

El inbox empieza vacío. Dale una tarea a tu agente, y las primeras filas llegan después
de su respuesta: una pregunta que te hizo, con sus respuestas como botones, y el Status
del trabajo. En Claude Code, la línea sobre el prompt se muestra una vez que el inbox
tiene algo.

Para ver cada parte con elementos de ejemplo, ejecuta `/inbox demo` en Claude Code o omp.
Las pulsaciones sobre ellos solo cambian los ejemplos. En Claude Code, pulsa Hide demo o ejecuta
el comando de nuevo para volver. `/inbox demo recording` omite los avisos
que marcan los ejemplos, para un video. En omp, duran hasta que se cierra el panel.

### Status

Dónde se encuentra el trabajo de la sesión, para alguien que vuelve a él sin contexto. La página
nombra en qué está enfocada la sesión ahora, luego cada parte del trabajo con
su estado. Una parte inactiva durante un día indica cuánto tiempo. Los subagentes y otro trabajo
que se ejecuta bajo una parte se muestran debajo de ella. Una parte que espera una pregunta o tarea
tuya lo indica, y View la abre. Una línea marca dónde miraste por última vez, así
que lo que cambió desde entonces queda arriba. El trabajo terminado se pliega en un conteo que puedes
abrir.

Puedes establecer un objetivo con una meta clara, como "2.5 en la tienda". La página
entonces agrupa el trabajo bajo los hitos del objetivo, y el inbox mantiene el objetivo
y sus hitos actualizados. Puedes editar o eliminar el objetivo en cualquier momento. Uno
que escribiste permanece hasta que se cumple. Uno que el inbox infirió avanza cuando lo hace el trabajo.

La página es una guía del trabajo, no un registro. La segunda llamada al modelo después de cada
respuesta la escribe. Cuando esa llamada falla, la página lo indica.

### Asks

Preguntas que te hizo el agente y tareas que solo tú puedes hacer.
El agente no tiene que hacer nada especial para poner una pregunta aquí. Después
de cada respuesta, un modelo lee lo que escribió el agente y registra cada pregunta en
él, con sus posibles respuestas. La respuesta recomendada por el agente va primero.
Pulsa una respuesta y esta llega al agente como tu mensaje, unos segundos después,
para que Deshacer pueda revertir una pulsación equivocada. También puedes escribir
tu propia respuesta, o pulsar Explicar para que el agente diga más antes de que decidas.

Cuando una pregunta es una decisión de diseño, como dos diseños o dos formas de construir una
función, Comparar hace que el agente pruebe cada respuesta con tu código y cree una
página que las muestra lado a lado, que se abre desde la pregunta. La página
empieza con la elección del agente, y la respuesta del agente da la elección, su motivo
y la ruta de la página. Cuando el agente puede ejecutar un subagente en segundo plano, la
comparación se ejecuta allí, para que puedas seguir trabajando. La pregunta dice
"Comparando…" hasta que el agente responde. Tras 30 minutos sin respuesta, dice
"No llegó ninguna comparación", y puedes pulsar Comparar de nuevo.

Una tarea es algo como iniciar sesión o añadir una clave de API. Viene con
botones para sus pasos, como copiar un comando o abrir un archivo. En Claude
Code, ejecutar el comando con `!` cierra la tarea cuando tiene éxito. Descartar
descarta una tarea que no vas a hacer, sin enviar un mensaje al agente.

### Hallazgos

Errores, riesgos e ideas que el agente notó fuera de la tarea en la que trabaja. El
agente los registra y sigue con su tarea, y tú decides después cuáles
abordar. Corregir en una incidencia, o Hacerlo en una idea, lo pasa al agente.
Crear incidencia hace que el agente la registre en tu gestor de incidencias, como Linear o
GitHub, o vincule la incidencia que ya la cubre. Responder envía tus propias palabras
al respecto. Explicar hace que el agente diga por qué importa y qué implicaría corregirla,
sin actuar. Debatir lo analiza contigo, y Descartar lo descarta.

### PRs

Solicitudes de extracción de esta sesión y de tu rama actual. Cada una está marcada
como Bloqueada, Lista o En espera, y enumera qué la bloquea: comentarios de revisión que esperan
tu respuesta, comprobaciones fallidas y conflictos de fusión. Los botones pasan el trabajo al
agente: atender un comentario de revisión o todos, redactar una respuesta, corregir una
comprobación fallida, resolver conflictos o fusionar. Corregir y Resolver conflictos aparecen solo
mientras GitHub sigue mostrando el problema. Un PR que se fusiona o se cierra sale de la pestaña
por sí solo, y Deshacer lo mantiene allí. Borrar fusionados y cerrados, arriba de
la pestaña, borra los que queden, excepto los de tu rama actual.

Tu agente también puede ordenar los PR, por ejemplo cuál fusionar primero. La
pestaña los muestra entonces primero, numerados, bajo el propósito y el motivo del orden. Cuando
cambia un PR ordenado, la pestaña lo indica y ofrece Volver a ordenar.

### Se mantiene al día

Cuando respondes una pregunta en tu propio mensaje, se completa una tarea o el
agente corrige un hallazgo, el inbox cierra el elemento. Los elementos cerrados se pliegan bajo
los abiertos, cada uno con cómo terminó. El que descartaste mantiene Reabrir allí durante
el resto de la sesión.

El agente también lee el inbox. Junto a cada uno de tus prompts, ve qué sigue
abierto y qué respondiste, incluso después de que la conversación se haya compactado.

Cada pulsación muestra de inmediato qué hizo. Debatir dice "Debatiendo…" hasta que
el agente responde, y luego "✓ Debatido".

### En cada app

Ayuda enumera las teclas y qué significa cada marca.

- **Terminal:** cada acción muestra la letra que la ejecuta. Las teclas numéricas
  cambian de pestaña, y `j` y `k` suben y bajan. En Estado, se mueven
  entre las filas que tienen un botón, y la letra junto a un botón lo
  pulsa. ctrl+x tab mueve el foco del prompt a la línea de arriba, luego al
  panel y después de vuelta al prompt.
- **Claude desktop app:** haces clic. Escribe `/inbox` para abrir el panel. Los clics en
  el panel se comprueban en el motor de Claude Code 2.1.309 y posteriores. En la 2.1.295,
  un clic después de pulsar solo podía devolverle el foco al panel.
- **ChatGPT app:** haces clic o pulsas las mismas teclas que en el terminal. La
  pestaña no muestra letras.
- **Herdr app:** consulta [panel de Herdr app](#herdr-app-pane).
- **omp:** `/inbox` abre el panel sobre la conversación y esc lo cierra.
  Cada acción muestra la letra que la ejecuta, y Responder es `t`. Las flechas se
  mueven entre filas y entre los botones de una fila, y enter pulsa el botón
  enfocado. Tab o las teclas numéricas cambian de pestaña. En Estado, `j` y `k`
  se mueven entre las filas que tienen un botón, y las flechas arriba y abajo desplazan
  la página.

En Claude Code, una línea encima de tu prompt cuenta lo que requiere tu atención y los
hallazgos pendientes, con un botón que abre el panel. Cuando Claude se detiene por un
error, una segunda línea indica el motivo, con un botón Reanudar tras un error de API. La
ChatGPT app no tiene esa línea. omp tiene una línea con los mismos recuentos. Indica
que `/inbox` abre el panel y que no tiene línea de parada.

### Panel de Herdr app

En un terminal de Herdr app, el inbox puede abrirse en un panel junto al terminal.

1. Inicia Claude Code u omp en un terminal de Herdr app y escribe `/inbox`. La
   primera vez, el inbox se abre en el terminal y pregunta "¿Instalar el mod de Herdr del
   inbox?". Pulsa Instalar. La ChatGPT app hace la misma pregunta en su
   pestaña Inbox.
2. Escribe `/inbox` de nuevo. El inbox se abre en un panel a la derecha del
   terminal. El botón Abrir inbox de Claude Code hace lo mismo. Si pulsaste
   Instalar en otra sesión o app y el inbox sigue abriéndose en el
   terminal, reinicia Claude Code.
3. El panel muestra el inbox del terminal en el que pusiste el foco por última vez en su pestaña. Tiene
   Preguntas, Hallazgos y PRs, y puedes pulsar todos los botones. ← y → cambian de pestaña,
   `j` y `k` se mueven entre filas, y esc devuelve las teclas al terminal.
   Ayuda enumera el resto.

No instalar guarda tu respuesta. Ejecuta `/inbox herdr` en Claude Code o en omp para que
vuelva a preguntarte.

La Codex CLI no tiene `/inbox`. Abre el panel para ella con
`herdr-app do pane.split '{\"direction\":\"right\",\"pane\":\"<pane id>\",\"mod\":\"inbox\"}'`,
tomando el id del panel de `herdr-app ls`.

Dentro de un panel de Herdr, Claude Code, omp y la Codex CLI también informan a la
barra lateral de Herdr, como tokens de panel:

| Token | Contiene |
|---|---|
| `inbox` | Lo que espera tu atención, en una línea |
| `inbox-needs-you`, `inbox-findings`, `inbox-prs` | Solo el recuento de la pestaña, como `2`. `inbox-needs-you` es de la pestaña Preguntas, y `inbox-findings` de la de Hallazgos. Vacío cuando la pestaña no tiene nada pendiente. |
| `inbox-stop` | Por qué se detuvo el agente. Los tokens de recuento siguen vacíos hasta que se resuelve la parada, para que la barra lateral tenga espacio. |
| `inbox-focus` | En qué está enfocada la sesión, según su Estado. Una sesión que inició esta como delegado de Herdr lo muestra como la fila del delegado. Ninguna fila de la barra lateral lo necesita. |

Para distinguir los recuentos por el color de cada pestaña, añade esta fila a `rows` bajo
`[ui.sidebar.agents]` en la configuración de Herdr:
```toml
[
  { token = "$inbox-stop", fg = "#ffa3b0" },
  { token = "$inbox-needs-you", fg = "#ffae42" },
  { token = "$inbox-findings", fg = "#cab0ff" },
  { token = "$inbox-prs", fg = "#8cc8c0" },
],
```
Herdr coloca ` · ` entre los tokens que tienen un valor y omite la línea
cuando ninguno lo tiene.

## Costo

En Claude Code, el inbox añade dos cosas:
| Qué añade el inbox | Tokens | Costo a precios de API |
|---|---|---|
| Una llamada a Sonnet después de cada respuesta de Claude, para actualizar el inbox | 3–4k de entrada, unos 2k de ellos en caché. 100–250 de salida. | Unos 0.5¢ por respuesta, o 1¢ tras 5 minutos inactivos |
| Una segunda llamada a Sonnet, para escribir la pestaña Estado | Unos 1.2k de entrada y 14–44 de salida en un intercambio breve (tres ejecuciones de evaluación: 1,175–1,214 de entrada). Una puesta al día de toda una conversación lee más: 1,358 de entrada y 100 de salida en la única ejecución. | Menos que la primera llamada, que lee unos 3k de entrada |
| Sus instrucciones y herramientas, enviadas con cada solicitud que hace Claude | Unos 1,350, en caché | Menos de 0.1¢ por solicitud |

En un plan de Claude, estos cuentan para tus límites de uso.

En Codex, la actualización posterior a cada respuesta se ejecuta mediante el binario `codex` dentro
la aplicación de escritorio, con tu inicio de sesión de Codex. Realiza dos llamadas por respuesta. Cada
una lleva unos 12,000 tokens de entrada de instrucciones base, que cada llamada a
`codex exec` incluye, además de su propio prompt. La llamada única anterior ascendió
a unos 16,000. Cuenta para el uso de tu plan.

## Qué ejecuta, envía y cambia

Esto cubre el mod de Claude Code. [codex/README.md](codex/README.md) cubre
el plugin de Codex. La extensión omp ejecuta las mismas consultas `gh`. Su solicitud
de actualización pasa por la propia conexión de omp con el proveedor del modelo
que usa, y contiene lo mismo que la solicitud de Claude Code.

**Qué sale de tu máquina.** Tres cosas, y nada más:

- Tras cada una de las respuestas de Claude, el inbox envía dos solicitudes Sonnet a
  Anthropic mediante la propia conexión de modelo de Claude Code. Ambas contienen tu último
  prompt, la respuesta de Claude, los elementos abiertos del inbox y una línea por cada herramienta
  que ejecutó Claude. Una línea de herramienta dice algo como `ran: npm test` o
  `edited src/app.ts`. [Costo](#cost) indica el tamaño de la solicitud.
- Cuando el inbox puede haber perdido un turno, pide al mismo modelo, con las mismas dos llamadas, que lo actualice
  a partir de toda la conversación. Para ello bifurca la conversación o
  lee la transcripción tras una reanudación.
- Para llenar la pestaña de PR, ejecuta consultas `gh` de solo lectura: `gh pr view`, y
  `gh api graphql` para los hilos de revisión. Llegan a GitHub con tu propio inicio
  de sesión de `gh`. El inbox nunca lee tu token de GitHub.

**Programas que inicia.**

| Programa | Cuándo |
|---|---|
| `gh` | Para llenar la pestaña de PR |
| `open` | Cuando pulsas un botón que abre un enlace, archivo o carpeta |
| `test -x` | Antes de abrir un archivo. Un archivo ejecutable se muestra en Finder, no se ejecuta. |
| `herdr pane report-metadata` | Solo dentro de un panel de Herdr, para mostrar qué espera por ti y el recuento de cada pestaña en la barra lateral de Herdr |

**Mensajes que envía en tu nombre.** Cuando pulsas un botón de respuesta o de acción, el
inbox envía a Claude un mensaje en tu nombre. El mensaje es la respuesta que
elegiste, o una solicitud sobre el elemento, como pedirle a Claude que corrija un hallazgo.
Reanudar, en un turno detenido, envía `Continue`. Cada mensaje que envía parte
de una pulsación. Cuando marcas como completada una tarea que Claude está esperando, el inbox
se lo dice a Claude unos segundos después, o cuando termina el turno en curso de Claude.

**Qué añade al contexto de Claude.**

- Sus instrucciones, unos 1,350 tokens, en cada solicitud.
- Una nota junto a tu prompt cuando respondes a una de las preguntas numeradas
  de Claude, o cuando el inbox cambió desde la última vez que Claude lo vio.
- Sus elementos abiertos después de que la conversación se compacta, para que Claude los conserve.

**Qué ven sus hooks.**

- Llamadas a herramientas. El inbox lee cada llamada para escribir las líneas de herramienta anteriores, para
  mostrar una pregunta mientras el diálogo de preguntas de Claude está abierto y para encontrar un PR
  que esta sesión abre con `gh pr create`. Pasa cada llamada sin cambios,
  excepto las llamadas a sus dos propias herramientas. `record` guarda una pregunta, una tarea o un
  hallazgo y `close` cierra un elemento. El inbox responde estas llamadas él mismo, por lo que se ejecutan
  sin un prompt de permiso.
- Prompts de permiso. Mientras Claude Code te pide aprobar una llamada a una herramienta, el
  inbox muestra una fila para ella y luego pasa la solicitud sin cambios. Nunca
  aprueba ni deniega un prompt de permiso.
- Descripciones de herramientas. Enumera sus dos propias herramientas a Claude desde el principio, en lugar
  de detrás de la búsqueda de herramientas. Deja sin cambios las descripciones de las demás herramientas.
- Comandos de shell que ejecutas con `!` y su salida. Un comando que termina
  sin nada en stderr cierra una tarea que te pidió ejecutarlo.
- Inicios de sesión. Tras `/clear`, una reanudación o una bifurcación, el inbox carga
  los elementos de esa conversación. Pasa el evento sin cambios.
- Tu ajuste de tema, para que sus colores coincidan.

**Qué conserva.** El inbox guarda los elementos de cada sesión y los PR que
sigue en el almacenamiento de plugins de Claude Code en esta máquina. Conserva las 40
sesiones más recientes y elimina las más antiguas. Un elemento puede resumir parte de
la conversación, por lo que puede mencionar a las personas que participan en ella. Nada se envía al
autor del plugin.

También añade el comando `/inbox`.

## Desarrollo

[docs/developing.md](docs/developing.md) explica cómo ejecutar y compilar el inbox desde un clon.

## Fuente y licencia

- Autor original: [petekp](https://github.com/petekp/inbox)
- Repositorio original: https://github.com/petekp/inbox
- Licencia: MIT
- Traducción al español y localización de interfaz: proyecto claude-code-mods-es
