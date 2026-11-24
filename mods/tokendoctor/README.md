<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/logo.svg">
    <img src="docs/logo-light.svg" width="72" height="72" alt="tokendoctor">
  </picture>
</p>

<h1 align="center">tokendoctor</h1>

<p align="center">
  <strong>El mismo Claude Code, hasta un 38 % menos</strong>
  <br>
  Reproduce tus propias sesiones pasadas para mostrar cuánto habría ahorrado cada cambio y después modifica solo lo que tú eliges.
</p>

<p align="center">
  <a href="https://github.com/localixai/tokendoctor/actions/workflows/ci.yml"><img src="https://github.com/localixai/tokendoctor/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="CHANGELOG.md"><img src="https://img.shields.io/github/v/tag/localixai/tokendoctor?label=version" alt="Versión"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="Licencia: MIT"></a>
</p>

<p align="center">
  <a href="#instalación">Instalación</a> &bull;
  <a href="https://tokendoctor.localix.ai/docs">Documentación</a> &bull;
  <a href="https://tokendoctor.localix.ai">Sitio web</a> &bull;
  <a href="CHANGELOG.md">Historial de cambios</a>
</p>

<p align="center">
  <img src="docs/demo.gif" alt="tokendoctor en una sesión real de Claude Code: /tokendoctor:sessions y, a continuación, la tendencia diaria" width="880">
</p>

**Tus sesiones pasadas deciden, no el benchmark de nadie.** Lo que ahorra un ajuste depende de cómo trabajes: de la duración de tus sesiones, de los modelos que uses y del tipo de trabajo. Una cifra procedente de las sesiones de otra persona, incluidas las mías, dice poco sobre las tuyas. Por eso tokendoctor empieza mirando tus propias sesiones.

**① Revisa tus últimos 30 días.** `/tokendoctor:sessions` reproduce cada una de tus sesiones, solicitud por solicitud, con ventanas de compactación de 200K, 300K, 400K y 600K, y muestra lo que habría costado cada una. Solo lee tus transcripciones, no hace llamadas a modelos y no cambia nada. La cifra es un límite superior: una reproducción no puede ver el trabajo que el modelo habría rehecho tras un resumen.

**② Cambia solo lo que tus sesiones demuestran que compensa, y deshazlo.** `/tokendoctor:optimize` propone cambios a partir de esas cifras y comprueba tus ajustes con la documentación de Claude Code; aplica solo los que tú eliges, y muestra cada uno primero como un diff. `/tokendoctor undo` permite revertir cualquiera de ellos.

**③ Opcional: deslizar en lugar de resumir.** Cuando Claude Code se detendría a resumir la conversación, tokendoctor descarta la salida antigua de las herramientas y conserva todos los mensajes. No hay ninguna llamada a un modelo, así que tarda milisegundos, no un minuto.

## Instalación

```bash
claude plugin marketplace add claude-code-mods/claude-code-mods-es
claude plugin install tokendoctor@claude-code-mods-es
```

Reinicia Claude Code y ejecuta `/tokendoctor:sessions` para ver cuánto habrían costado tus últimos 30 días con cada ventana. No cambia nada hasta que tú lo eliges.

## Lo que encontré en mis sesiones

Cada solicitud envía la conversación completa al modelo. En modelos con una ventana de 1M, Claude Code compacta solo cerca de 967K tokens, así que el final de una sesión larga es la parte costosa. En mi caso, dos tercios del coste del hilo principal correspondieron a solicitudes con más de 400K de contexto.

Por eso configuré una ventana de 400K y Sonnet para los subagentes. Comparando el mes anterior con la semana posterior, unas 23K y 19K solicitudes del hilo principal, el contexto por solicitud pasó de 412K a 219K y el coste por solicitud cayó un 38 % a precios de lista de la API. Es un antes y un después de una sola persona, no un experimento controlado.

La contrapartida son más resúmenes, y cada uno supone una pausa: 79 segundos de media en mis sesiones. Para eso sirve el deslizamiento. Tus sesiones pueden mostrar algo completamente distinto; precisamente por eso conviene mirarlas primero.

## Qué muestra el benchmark

En el [benchmark](bench/README.md), Claude Code construye un proyecto TypeScript frente a pruebas que no puede modificar, por lo que una ejecución solo cuenta si las pruebas pasan. El coste es por tarea, con Haiku 5.5:

| Comparación | Coste | Tiempo |
| --- | --- | --- |
| Deslizar frente a resumir, un día de trabajo | −19 % | −33 % |
| Deslizar frente a resumir, un arnés de evaluación | −35 % | −28 % |
| Deslizar frente a resumir, una tarea breve | +6 % | −17 % |
| Solo el consejo de ajustes, frente a Claude Code tal como se entrega | más caro en 3 de 4 ejecuciones | |
| El consejo y el deslizamiento, una semana de trabajo | −11 % a −21 % | |

Todas las pruebas pasaron en todas las ejecuciones. El consejo por sí solo no compensó aquí porque estas tareas rara vez superan 400K, que es donde empieza a importar la ventana. Si tus sesiones tampoco lo hacen, tu reproducción lo mostrará y conviene no tocar la ventana. Todas las ejecuciones, también las que salieron peor, están en [bench/HISTORY.md](bench/HISTORY.md).

<p align="center">
  <img src="docs/dashboard.png" alt="Panel de tokendoctor del autor: el 57 % del gasto se debió a que Claude volvía a leer la conversación" width="880"><br>
  <sub><code>/tokendoctor:dashboard</code>: adónde fue a parar cada token, por día, modelo, subagente y proyecto. Un único archivo local; este es el mío.</sub>
</p>

## Comandos

| Comando | Qué hace |
| --- | --- |
| `/tokendoctor:sessions [days]` | Reproduce tus sesiones pasadas (30 días, o `days`) con ventanas más pequeñas: cuánto habría ahorrado cada una y adónde fueron tus tokens. Solo lectura. |
| `/tokendoctor:audit` | Revisa tus ajustes, memoria y CLAUDE.md con la documentación, por gravedad. Solo lectura. |
| `/tokendoctor:dashboard [days]` | Abre un panel local con todas las sesiones de este equipo. |
| `/tokendoctor:optimize [focus]` | Propone hasta cinco cambios a partir de tus cifras y aplica los que eliges. |
| `/tokendoctor [name] [value]` | Muestra, explica o cambia un ajuste, sin llamadas a un modelo. |
| `/tokendoctor undo [n]` | Enumera todos los cambios que hizo tokendoctor y revierte uno. |

Nada sale de tu equipo: la única llamada de red es a dos páginas públicas de la documentación de Claude Code, una vez al día. Nunca cambia tus modelos por su cuenta.

## Documentación

**[tokendoctor.localix.ai/docs](https://tokendoctor.localix.ai/docs)** contiene el resto: las [38 comprobaciones](https://tokendoctor.localix.ai/docs/audit), todos los [ajustes](https://tokendoctor.localix.ai/docs/settings), [cómo funciona el deslizamiento](https://tokendoctor.localix.ai/docs/slide) (y los inicios de sesión de Team y Enterprise), los comandos desde un shell, las [mediciones](https://tokendoctor.localix.ai/docs/proof) y los [límites](https://tokendoctor.localix.ai/docs/limits). Para trabajar en el propio tokendoctor, consulta [CONTRIBUTING.md](CONTRIBUTING.md).

## Licencia

MIT

## Fuente y licencia

- Autor original: [rsaryev](https://github.com/localixai/tokendoctor)
- Repositorio original: https://github.com/localixai/tokendoctor
- Licencia: MIT
- Traducción al español y localización de interfaz: proyecto claude-code-mods-es
