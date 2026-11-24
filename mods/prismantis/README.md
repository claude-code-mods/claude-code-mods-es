# prismantis

Un mod de Claude Code que redibuja las respuestas de Claude en color: tablas, títulos, listas, citas, código resaltado, números, rutas y enlaces, diagramas y gráficos mermaid, y filas de herramientas, con 17 temas y botones de copia. Ejecuta `/prismantis setup` para elegir una apariencia o `/prismantis demo` para ver todo lo que dibuja.

Las capturas de pantalla, todas las opciones y el historial de cambios están en el [README completo](https://github.com/NahumLitvin/prismantis#readme).

## Qué ejecuta, lee y cambia

Prismantis no realiza ninguna llamada de red. Todo lo que se describe aquí ocurre en tu equipo.

- **Programas.** Al hacer clic en `⧉ html` o `▣ png`, se ejecuta la utilidad de portapapeles con la tabla, el diagrama o la figura copiada en la entrada estándar: `osascript` en macOS, `powershell.exe` en Windows (que lee `SystemRoot` para encontrarlo) o `copyq` en Linux. Con `latex` activado, ejecuta `ratex-render` desde tu `PATH` con las fórmulas de la respuesta en la entrada estándar. No ejecuta nada más.
- **Archivos.** Lee un PNG local enlazado en la respuesta como imagen Markdown, de hasta 2 MB, para dibujarlo en kitty o Ghostty. Vuelve a leer los PNG que `ratex-render` escribe en `$TMPDIR/prismantis-latex-<session>-<id>`. No escribe archivos por sí mismo.
- **Ajustes.** `/prismantis setup` y `/prismantis theme` guardan tu elección mediante `/config`, solo en las opciones propias de prismantis (`prismantis.theme`, `prismantis.tableStyle` y el resto de los pasos de configuración). No se modifica ningún otro ajuste.
- **Colores de la aplicación de escritorio.** Solo mientras `desktopColors` está en `match`: al iniciar la sesión y al ejecutar `/prismantis theme`, establece los colores de la aplicación de escritorio para la sesión mediante `$.theme.set`, a partir de la paleta actual. Volver a poner `desktopColors` en `off` llama una vez a `$.theme.clear()`. Nunca lo limpia al iniciar una sesión ni al recargar.
- **Hooks.** Dibuja mediante `ui.render`, responde al comando `/prismantis` mediante `command.run`, vigila su propia opción `desktopColors` en `config.set`, añade la nota de [sugerencias de diagramas](https://github.com/NahumLitvin/prismantis#diagram-hints) visible solo para el modelo y, con `keyPointHint` activado, la nota de puntos clave en `prompt.submit`, y añade `$.prismantis.markdown` para [otros mods](https://github.com/NahumLitvin/prismantis#other-mods) en `engine.create`. `prismantis.markdown` es el evento propio de esa llamada.

## Licencia

[MIT](LICENSE), de Nahum Litvin. El código y las paletas de terceros incluidos se acreditan en [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## Fuente y licencia

- Autor original: [Nahum Litvin](https://github.com/NahumLitvin/prismantis)
- Repositorio original: https://github.com/NahumLitvin/prismantis
- Licencia: MIT
- Traducción al español y localización de interfaz: proyecto claude-code-mods-es
