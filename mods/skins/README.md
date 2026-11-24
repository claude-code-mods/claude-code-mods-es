<h1 align="center">
  <picture>
    <source media="(prefers-color-scheme: light)" srcset="docs/brand/banner-light.svg">
    <img alt="skins" src="docs/brand/banner-dark.svg" width="640">
  </picture>
</h1>

> Versión en español por el proyecto claude-code-mods-es. El README original en inglés está en [README.en.md](README.en.md).

<p align="center">
  <a href="https://github.com/hellosverre/claude-skins/releases/latest"><img alt="release" src="https://img.shields.io/github/v/release/hellosverre/claude-skins?style=flat-square&color=555"></a>
  <a href="LICENSE"><img alt="licencia MIT" src="https://img.shields.io/badge/license-MIT-555?style=flat-square"></a>
  <img alt="Claude Code 2.1.287+" src="https://img.shields.io/badge/Claude%20Code-2.1.287%2B-555?style=flat-square">
</p>

<p align="center">Llamadas a herramientas con iconos y tiempos, ediciones como tarjetas de diff, tablas, código y gráficos de Mermaid como tarjetas,<br>una banda de uso en vivo y dieciséis skins que puedes repintar o que Claude puede diseñar para ti.</p>

<img alt="Claude Code cambiando de skin con /skin: un turno de código en Noir y Tokyo Night, y luego tarjetas de gráficos de Mermaid en Dracula (gráfico xy), Catppuccin (sankey), Rosé Pine (radar) y Gruvbox (treemap)" src="docs/demo.gif">

## Instalar

Requiere Claude Code **2.1.287** o posterior, en una terminal o en la pestaña Code de la aplicación de escritorio. Ejecuta ambos dentro de Claude Code:
```
/plugin marketplace add hellosverre/claude-skins
```
```
/plugin install skins@hellosverre-mods
```
Reinicia Claude Code. La skin **noir** está activada; escribe `/skin` para cambiarla.

¿Buscas más mods? `/plugin install mod-store@hellosverre-mods`, y luego `/mods` navega e instala unos 2.700 desde un panel, mostrando primero a qué puede acceder cada uno.

## Actualizar

skins comprueba si hay una versión nueva una vez al día y muestra un aviso cuando estás por detrás. Para actualizar:
```bash
claude plugin marketplace update hellosverre-mods
```
```bash
claude plugin update skins@hellosverre-mods
```
Luego reinicia Claude Code. Las sesiones abiertas conservan la versión con la que se iniciaron.

## Desinstalar
```bash
claude plugin uninstall skins@hellosverre-mods
```
Para mantenerlo instalado pero volver al dibujo propio de Claude Code, ejecuta `/skin off`.

## Uso

`/skin help` lista todos los comandos de Claude Code; `/skin list` muestra todas las skins y ajustes.

**Skins**

| Comando | Qué hace |
|---|---|
| `/skin` | Ajustes: elige una skin con vista previa en vivo, activa o desactiva partes, repinta cualquier color |
| `/skin <name>` | Cambia de skin (nombres más abajo) |
| `/skin list` | Todas las skins, incluida la tuya, y todos los ajustes |
| `/skin help` | Todos los comandos, en una tabla |
| `/skin off` · `on` | Vuelve al dibujo propio de Claude Code, o activa skins de nuevo |
| `/skin gallery` | Todos los elementos que dibuja la skin, numerados, para señalarlos |
| `/skin pin` · `unpin` · `share` | Dale a esta carpeta su propio aspecto, quítalo, o hazlo el predeterminado |
| `/skin copy` · `copy code` | Copia la última respuesta de Claude, o solo su último bloque de código |
| `/skin calm` · `calm off` | Sin movimiento, una línea por fila de herramienta, salidas de solo lectura plegadas, fallos siempre completos; `calm off` devuelve lo que tenías |

Skins incluidas: `noir`, `tokyo-night`, `dracula`, `catppuccin`, `rose-pine`, `nord`, `gruvbox`,
`kanagawa`, `everforest`, `one-dark`, `solarized`, `night-owl`, `ayu`, `github`, `mono`, `terminal`.

**Opciones**

| Comando | Qué hace |
|---|---|
| `/skin tables on/text/off` | Tablas como tarjetas, como texto seleccionable en el escritorio, o las de Claude Code |
| `/skin prompt left/right/plain` | En la terminal, en qué lado se sitúa el contorno de tu prompt, o un marcador inicial sencillo. El escritorio conserva los mensajes de Claude Code, con copia y retroceso |
| `/skin words claude/skin` | De quién son las palabras que muestran el indicador de actividad y el pie de turno: de Claude Code, o de la skin (por defecto) |
| `/skin icons unicode/ascii` | El conjunto de iconos, y diagramas solo ASCII en la terminal |

**Partes**, cada una activada con `/skin <part> on` u `off`:

| Parte | Qué hace |
|---|---|
| `rail` | El carril de color junto a las filas de herramienta |
| `shimmer` | La banda de luz que cruza la palabra del indicador de actividad |
| `band` | Los medidores de uso sobre el prompt |
| `countdown` | Tiempo restante de cada límite en la banda |
| `compact` | El botón Compact en la banda, con un aviso a partir del 70 % de contexto (activado por defecto) |
| `clip` | Recorta la salida propia del shell de Claude Code a su principio y su final |
| `markdown` | Alertas y listas de tareas dibujadas |
| `quiet` | Lecturas, búsquedas y comandos de solo lectura plegados en una línea |
| `charts` | Vallas de Mermaid como gráficos |
| `math` | Matemáticas compuestas |
| `commands` | Salida de comandos con barra como tablas y tarjetas |
| `shell` | Salida del shell como una tarjeta |
| `highlight` | Bloques de código resaltados con los colores de la skin |
| `hints` | Indica a Claude que los gráficos se dibujan aquí |
| `links` | URL y rutas como enlaces |
| `copy` | Botones de copia en las tarjetas |
| `fold` | Los bloques largos se pliegan detrás de `▾ N more` |
| `expand` | Cada serie de lecturas y búsquedas abierta, en lugar de la línea `Read 3 · Search 2 ▸`; desactivado por defecto |

**Diseña una con Claude.** Pide "hazme una skin que se sienta como un atardecer". skins le da a Claude una
herramienta `design`, de modo que construye la skin y la aplica mientras tú miras. Repintar una skin
incluida la guarda como tuya `my-<skin>`. Las elecciones se recuerdan entre sesiones.

## Vista previa

Dibujado por el propio código de tarjetas del mod (`scripts/previews.ts`), no con capturas de pantalla.

<picture>
  <source media="(prefers-color-scheme: light)" srcset="docs/previews/hero-light.svg">
  <img alt="Un turno de Claude Code con la skin noir: filas de herramientas con iconos, una edición como tarjeta de diff y una tabla" src="docs/previews/hero-dark.svg">
</picture>

<picture>
  <source media="(prefers-color-scheme: light)" srcset="docs/previews/spinners-light.svg">
  <img alt="Las cuatro animaciones del indicador de actividad: pensando, ejecutando una herramienta, escribiendo, esperando" src="docs/previews/spinners-dark.svg">
</picture>

<picture>
  <source media="(prefers-color-scheme: light)" srcset="docs/previews/terminal-light.svg">
  <img alt="Salida del shell en una tarjeta de terminal" src="docs/previews/terminal-dark.svg">
</picture>

<picture>
  <source media="(prefers-color-scheme: light)" srcset="docs/previews/code-light.svg">
  <img alt="Un bloque de código como tarjeta con números de línea" src="docs/previews/code-dark.svg">
</picture>

<picture>
  <source media="(prefers-color-scheme: light)" srcset="docs/previews/usage-light.svg">
  <img alt="Anillos de límite de contexto y de plan" src="docs/previews/usage-dark.svg">
</picture>

## Qué redibuja
| Parte | Aplicación de escritorio | Terminal |
|---|---|---|
| Llamadas a herramientas | Icono por tipo, spinner mientras se ejecuta, líneas modificadas, tiempo transcurrido. `▸` abre la fila: la entrada completa de la llamada y su respuesta (el texto de una lectura con números de línea, las coincidencias de una búsqueda, la tarjeta de shell, el diff); una llamada fallida se abre por sí sola | Un nodo en el riel del turno, con el mismo `▸` |
| Ediciones | Tarjeta de diff con `+N −M` y líneas numeradas | El diff propio de Claude Code |
| Comandos de shell | Tarjeta de terminal con estado, stderr aparte, salida larga plegada; rutas, números y palabras de error, advertencia y éxito coloreadas | Tarjeta con el comando, la salida coloreada de la misma forma, `✓` o `✗ exit N`, stderr en rojo bajo su propia etiqueta, cada flujo plegado a 8 + 4 líneas (`/skin shell off` para el propio de Claude Code) |
| Salida silenciosa (desactivada por defecto) | Las lecturas, búsquedas y comandos de solo lectura se pliegan en una fila; un fallo conserva su línea de error | Lo mismo |
| Tablas | Tarjeta con regla de encabezado, filas cebra, muestras de color | Cuadrícula de celdas con una banda de encabezado |
| Gráficos | ` ```mermaid ` como tarjeta: flowchart, xy, pie, gantt, timeline, journey, kanban, mindmap, quadrant, radar, sankey, gitGraph, treemap, packet, block, architecture, C4 | Los mismos diecisiete dibujados en celdas, ASCII con `/skin icons ascii` |
| Matemáticas | `$$…$$`, `\[…\]` y ` ```math ` como tarjeta compuesta: fracciones, raíces, sumas e integrales con límites, matrices, líneas alineadas; `$…$` en línea se convierte en Unicode | Fracciones y límites apilados en celdas, `$…$` en línea como Unicode |
| Salida de comandos | `/cost`, `/context` y salida de plugins: tablas, código y secuencias `key: value` como tarjetas | Lo mismo como cuadrículas de celdas |
| Alertas y listas de tareas | `> [!NOTE]` como un recuadro con título, `- [ ]` con marcas y un recuento de completadas | Lo mismo |
| Bloques de código | Tarjeta con lenguaje, números de línea, resaltado; los bloques de shell conservan el botón Ejecutar | Enmarcado, el lenguaje en el marco, resaltado con los colores del skin: TS/JS, JSON, shells, PowerShell, Python, Rust, Go, C/C++, C#, F#, Java, YAML, TOML, HTML/XML, CSS, SQL, diff, Markdown, Lua (`/skin highlight off` para el propio de Claude Code) |
| Spinner | Icono animado por fase | La palabra del skin con una banda de luz |
| Sobre el prompt | Anillos de contexto y límite del plan, botón Compactar, aviso al 70% | Medidores de bloques, mismo botón |
| Tus prompts | El propio de Claude Code, para que copiar, rebobinar y la selección se mantengan | Contorno redondeado, o un marcador simple |
| Enlaces y archivos | Las URL son los enlaces propios de la aplicación; las filas de herramientas colorean los archivos que este turno creó (`ok`) o editó (`warn`) | Las URL en prosa son enlaces OSC 8 donde la terminal los renderiza (`FORCE_HYPERLINK=1` o `0` anula la comprobación), texto plano en otros casos; rutas con `:line`, números y versiones coloreados, los archivos de este turno en `ok` o `warn` en filas y prosa |
| Bloques diff | ` ```diff ` como la tarjeta de diff, con Copiar y `new only` (el código después del cambio) | Líneas antiguas y nuevas numeradas, el `+` y el `-` en los colores del skin y el código resaltado en el lenguaje que indica su ruta `+++` o una etiqueta ` ```diff-fsharp `, las mismas dos copias |
| Lado a lado | Dos o más tablas o gráficos en una fila la comparten cuando cada uno obtiene 75 columnas; de lo contrario, se apilan | Las tablas y diagramas en una fila se colocan lado a lado mientras sus anchos naturales quepan; de lo contrario, se apilan |
| Bloques largos | Las tarjetas de código de más de 24 líneas se cortan ahí, con `▾ N more` | El código de más de 24 líneas, las tablas de más de 14 filas y la salida de shell de más de 8 + 4 líneas se pliegan detrás de `▾ N more` / `▴ less` |

Cada tarjeta tiene un botón Copiar (las tablas también `as text`, la tabla tal como se dibuja; una respuesta de varios bloques termina en `copy reply`) y se anima una vez, en el primer renderizado, respetando el movimiento reducido. Solo el
dibujo cambia: la conversación almacenada y lo que lee el modelo permanecen intactos. Los agentes, el modo plan
y el prompt de permisos mantienen el dibujo propio de Claude Code.

**Sugerencias de gráficos.** Mientras los gráficos están activados, Claude recibe una nota corta solo para el modelo (unos 130 tokens, estimados a partir de sus 458 caracteres) que indica que los bloques ` ```mermaid ` se dibujan aquí, para que recurra a un gráfico cuando se lea mejor. Nunca para ejecuciones headless de `claude -p`. `/skin hints off` la elimina y mantiene el dibujo de los gráficos.

**Claro y oscuro.** Cada skin tiene ambos y sigue el tema de Claude Code. En `auto` sigue tu
terminal (`COLORFGBG`) o el sistema. Fuerza uno con `SKINS_THEME=light` o `SKINS_THEME=dark`.

**Los colores de tu terminal.** El skin `terminal` pinta la terminal con su propia paleta de 16 colores
(`ansi256(0)` a `ansi256(15)`), por lo que sigue cualquier tema que tenga la terminal, claro u oscuro. El texto del cuerpo
y las bandas de tabla usan los colores de tema propios de Claude Code; elige un tema ANSI en `/config` para que
estos también sigan la terminal. La aplicación de escritorio no tiene paleta de terminal y lo dibuja como `noir`.

## Para otros mods

skins añade `$.skins.markdown` a `$`. Dibuja markdown de la misma forma en que skins dibuja una respuesta, en el skin de la persona. Devuelve un árbol, o `undefined` cuando skins está desactivado o el texto no contiene nada que dibuje, y lanza un error ante un argumento mal formado. No dibuja controles de copia ni de plegado, porque una pulsación no puede cruzar del árbol de un mod al de otro. Incluye `skins` en `dependencies` en tu `plugin.json` y Claude Code colocará sus tipos en tu `.claude-plugin/types/`.
```tsx
let drawn
try {
  drawn = await $.skins.markdown({ surface: e.surface, text, columns: e.props.bodyColumns })
} catch {}
return drawn ?? <Markdown text={text} />
```
## Compatibilidad

Comprobado manualmente en Windows (terminal y aplicación de escritorio, 0.3.0) y ejecutado en Linux (terminal, 0.5.0,
Claude Code 2.1.288, 168 pruebas del motor). [CI](.github/workflows/ci.yml) ejecuta las pruebas, las
comprobaciones del manifiesto y la comprobación de tipos en Linux, Windows y macOS. macOS, VS Code y móvil no han
sido revisados manualmente. La matriz superficie × SO y
los tiempos de renderizado por fila están en [docs/compat.md](docs/compat.md). Para medir en tu máquina:
```bash
scripts/bench.sh
```
## Limitaciones conocidas
| Qué | Qué obtienes en su lugar | Dónde |
|---|---|---|
| Una fila abierta para una lectura de imagen, PDF o cuaderno, un comando en segundo plano, o una respuesta que no puede leer | La propia fila de Claude Code, dibujada en la fila abierta | `bodyOf` en [`hooks/detail.ts`](hooks/detail.ts); test "an opened image Read is Claude Code's own drawing…" |
| Agentes, modo plan, todos, el prompt de permiso | Las propias filas y diálogos de Claude Code | `kindOf` en [`hooks/tools.ts`](hooks/tools.ts); test "tools a skin cannot redraw faithfully keep their own row" |
| Ediciones en la terminal, ediciones fallidas en todas partes | El propio diff de Claude Code | [`hooks/register.tsx`](hooks/register.tsx) `ToolResult`; test "on the desktop an edit is a diff card…" |
| Bloques de código en la terminal en un lenguaje que el resaltador no conoce | El propio markdown de Claude Code | `languageOf` en [`hooks/highlight.ts`](hooks/highlight.ts); test "a fence in a language it does not know keeps Claude Code's markdown" |
| Vallas de shell (` ```bash `) en el escritorio | El propio bloque de la app, para que su botón Run siga ahí | test "on the desktop a shell fence keeps the app's own block" |
| Diagramas de secuencia, estado, clases y ER en el escritorio | Una tarjeta de código: solo el layout incluido de la terminal los dibuja | `artKind` en [`hooks/mermaid-art.ts`](hooks/mermaid-art.ts), `parseMermaid` en [`hooks/mermaid.ts`](hooks/mermaid.ts) |
| Caracteres coreanos, chinos, japoneses u otros anchos en el id de un nodo o el nombre de un estado de un diagrama de la terminal (`A[開始] --> 請求`) | El código: el layout incluido descarta esos nodos. Las etiquetas anchas se dibujan como arte | `drawsWide` en [`hooks/mermaid-art.ts`](hooks/mermaid-art.ts); test "a diagram the renderer cannot lay out with wide characters falls back to code" |
| Un diagrama demasiado ancho o largo (más de 80 líneas o 8.000 caracteres en la terminal) | Filas para flowchart, xy y pie, si no el código | test "a diagram too wide for the terminal falls back to rows…" |
| Un bloque de respuesta de más de 9.000 caracteres, un prompt de más de 4.000 | El propio dibujo de Claude Code de todo el mensaje | `MAX_MARKDOWN`, `MAX_PROMPT` en [`hooks/register.tsx`](hooks/register.tsx) |
| Tarjetas de código de más de 80 líneas | Las primeras 80 y una nota `N more lines`; Copy toma todo | `MAX_LINES` en [`hooks/svg-code.ts`](hooks/svg-code.ts) |
| Comandos TeX que el parser no conoce | Dibujados tal cual, `\name` | [`hooks/math.ts`](hooks/math.ts) |
| Salida de shell en la terminal vs el escritorio | La tarjeta de terminal nombra el comando y pliega cada stream a 8 + 4 líneas; la tarjeta del escritorio dice `Output` y pliega ambos streams juntos a 6 + 6 | [`hooks/shell-rows.tsx`](hooks/shell-rows.tsx), [`hooks/svg-terminal.ts`](hooks/svg-terminal.ts) |
| Una llamada de shell fallida que devuelve texto de error, no su registro | stdout y stderr llegan fusionados, así que todo el texto se dibuja como stderr | `shellResultOf` en [`hooks/shell.ts`](hooks/shell.ts) |
| Un comando enviado al segundo plano, o una salida que es una imagen | La propia fila de Claude Code, que dice a dónde fue o dibuja la imagen | `keepsOwnRow` en [`hooks/shell.ts`](hooks/shell.ts); test "/skin shell off gives shell output back…" |
| Tarjetas de shell y tiempos de las herramientas tras `/resume` | Sin comando en la cabecera y sin tiempo: ambos se registran mientras corre la llamada | `commandAtom`, `durationAtom` en [`hooks/register.tsx`](hooks/register.tsx) |
| Errores de comandos con barra inclinada y la propia salida de `/skin` | La propia fila de Claude Code | test "slash-command output with key: value lines is a table, prose keeps its row" |
| `/skin calm` y el spinner de Claude Code | Calm devuelve el spinner a Claude Code, cuyo propio spinner sigue moviéndose | `Spinner` en [`hooks/register.tsx`](hooks/register.tsx) |
| El panel de ajustes en móvil | Una línea que dice usar la terminal o la app de escritorio | `Pane` en [`hooks/register.tsx`](hooks/register.tsx) |
| Rutas de archivo como enlaces | De color, no clicables: el `Link` del motor solo acepta `https:` y `http://localhost` | `safeHref` en [`hooks/links.ts`](hooks/links.ts) |
| Plegado en el escritorio | Las tarjetas de código se pliegan; las tarjetas de tabla y la tarjeta de shell mantienen su altura total o su propio pliegue de 6 + 6 | [`hooks/fold.tsx`](hooks/fold.tsx) |
| Iconos y el riel | Iconos solo en el escritorio (la terminal no dibuja ningún `Svg`); el riel solo en la terminal | `lookOf` en [`hooks/register.tsx`](hooks/register.tsx) |

## Comparado con

Otros mods que cambian la apariencia del transcript, según sus README el 2026-10-10. En blanco significa
que el README no lo dice.
| | skins | [Prismantis](https://github.com/NahumLitvin/prismantis) | [glint](https://github.com/manikosto/glint) | [tweakcc](https://github.com/Piebald-AI/tweakcc) | [claude-gfm-render](https://github.com/briangtn/claude-gfm-render) | [ccstatusline](https://github.com/sirmalloc/ccstatusline) |
|---|---|---|---|---|---|---|
| Cómo | Plugin de function-hooks | Plugin de function-hooks | Plugin de function-hooks, bifurcación de Prismantis | Parchea el JavaScript de Claude Code; reaplicar tras cada actualización | Mod de function-hooks | Comando de línea de estado |
| Claude Code | 2.1.287+ | 2.1.287+ | 2.1.289+ | Verificado en 2.1.162 | 2.1.286+ | |
| Plataformas nombradas | Windows a mano, Linux con pruebas; CI en Linux, Windows, macOS ([compat](docs/compat.md)) | Terminal de macOS a mano; CI en macOS, Linux, Windows | | Windows, macOS, Linux | Terminal y aplicación de escritorio | Guía de Windows en su documentación |
| Temas | 16, repinta cualquier color o deja que Claude diseñe una | 15 y `mono`, 20 ranuras de color | 15 | Los tuyos, para toda la interfaz de Claude Code | | Temas de Powerline |
| Recolorea la interfaz de Claude Code | No | No | No | **Sí** | No | No |
| Filas de herramientas | Iconos, tiempos, riel; **abiertas a la entrada y a la respuesta** | 4 estilos | | | No | No |
| Salida de solo lectura oculta | `/skin quiet` | `toolOutput: quiet` | | | No | No |
| Diffs de edición | Tarjeta en el escritorio; el diff del motor en una fila abierta en la terminal | El de Claude Code | | | No | No |
| Cercas ` ```diff ` | Tarjeta de diff o filas numeradas, copia `new only` | | Numeradas, `⧉ new only` | | | No |
| Salida de shell | Tarjeta en ambas superficies, rutas, números y errores coloreados | En recuadro en grupos expandidos | | | No | No |
| Resaltado de código en la terminal | 20 familias de lenguajes en los colores del skin | Prism, una veintena de lenguajes | Más de 20 lenguajes | | | No |
| Tablas | Tarjeta o cuadrícula de celdas, junto a los diagramas | 4 estilos, junto a los diagramas | | 4 formatos | No | No |
| Mermaid | 17 tipos; secuencia, estado, clase, ER solo en la terminal | Diagrama de flujo, secuencia, estado, clase, ER, xy; sin tartas | Diagrama de flujo, secuencia, xy | | Diagrama de flujo, secuencia, estado, clase, ER, xy; SVG en el escritorio | No |
| Matemáticas | Tarjeta en el escritorio, celdas apiladas en la terminal | Imagen compuesta en kitty y Ghostty mediante RaTeX, texto en el resto | | | No contemplado | No |
| Enlaces | URLs como enlaces OSC 8; archivos de esta vuelta coloreados | Enlaces y URL sin formato pulsables | **URLs y rutas de archivo pulsables**; archivos modificados coloreados; banda de enlaces | | | No |
| Bloques largos plegados | Código, tablas, salida de shell (`/skin fold`) | | Código, listas, tablas | | | No |
| Texto de derecha a izquierda | No | **Hebreo y árabe** | Hebreo y árabe | | | No |
| Medidores de uso | Límites de contexto y de plan sobre el prompt | | | | No | **Muchos widgets**, Powerline |
| Palabras del spinner | Las del skin, con un brillo | | | **Tus propios verbos y animaciones** | No | No |
| Copiar | Tarjetas, tablas como markdown o como dibujadas, `copy reply`, `/skin copy` | Botones, `/prismantis copy`, tablas HTML | Código, tablas, diagramas, listas, citas | | | No |
| API para otros mods | `$.skins.markdown` | `$.prismantis.markdown` | | | | No |

Dónde son mejores: **tweakcc** recolorea todo Claude Code, no solo lo que un hook puede redibujar, a costa de parchear el binario. **Prismantis** maneja texto de derecha a izquierda, copia tablas como HTML y compone matemáticas como imágenes. **glint** hace las rutas de archivo pulsables y conserva una banda con los enlaces de la última respuesta. **ccstatusline** tiene una línea de estado mucho más profunda. **claude-gfm-render** dibuja diagramas de secuencia y otros como SVG en el escritorio, donde skins recurre a una tarjeta de código. Lo que skins planea a continuación está en [ROADMAP.md](ROADMAP.md).

## Privacidad

skins dibuja y recuerda, nada más. Lee el directorio de la sesión, tu uso de contexto y de plan, la configuración del tema y `SKINS_THEME` / `COLORFGBG`, y guarda sus ajustes en el almacén de mods. Su única llamada de red es la comprobación diaria de versión: un GET del [`plugin.json`](.claude-plugin/plugin.json) de este repo en `raw.githubusercontent.com`, sin enviar nada. En `auto` le pregunta al sistema por el modo claro u oscuro (`defaults` en macOS, `gsettings` en GNOME). Compacta o copia solo cuando pulsas el botón. Compruébalo tú mismo con `claude plugin validate .`.

## Código incluido

Los diagramas de la terminal se componen con [beautiful-mermaid](https://github.com/lukilabs/beautiful-mermaid) (MIT), empaquetado en `hooks/vendor/mermaid-ascii.js` con su licencia en la cabecera. Para reconstruirlo:
```bash
cd scripts/vendor && npm install && npm run build
```
## Desarrollo
```bash
git clone https://github.com/hellosverre/claude-skins && cd claude-skins
```
```bash
claude --plugin-dir .
```
Guardar un archivo recarga el mod en la sesión en ejecución. Pruebas: `claude plugin test .`. Vistas previas: `npx tsx scripts/previews.ts`. Un skin integrado nuevo es un archivo: copia `hooks/themes/nord.ts`, cambia los colores y las palabras, añade una línea en `hooks/themes/index.ts`.

## Más mods

- [redgreen](https://github.com/hellosverre/redgreen): resultados de pruebas en un panel junto al chat
- [smart-compact](https://github.com/hellosverre/smart-compact): compacta tras un commit, con pruebas en verde, antes de que caduque la caché del prompt o cuando Claude lo pide
- [mod-store](https://github.com/hellosverre/mod-store): consulta, busca e instala 2,700 mods desde un panel

## Licencia

MIT

## Fuente y licencia

- Autor original: [hellosverre](https://github.com/hellosverre/claude-skins)
- Repositorio original: https://github.com/hellosverre/claude-skins
- Licencia: MIT
- Traducción al español y localización de interfaz: proyecto claude-code-mods-es
