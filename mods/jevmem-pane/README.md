# jevmem pane

Un panel lateral para Claude Code, junto a tu chat, que muestra lo que [jevmem](https://github.com/Avinash-jetwani/jevmem) hizo con el mensaje que acabas de enviar y el turno que acaba de terminar:

1. **Recordado para este mensaje**: cada línea de memoria entregada a Claude (su id, tipo y texto) y cuántas se retuvieron.
2. **El guardián**: la última llamada sobre la que el guardián preguntó o que denegó, con la regla y su puntuación, correspondientes a la llamada.
3. **Guardado del último turno**: la línea que jevmem guardó del turno y su tipo, o el motivo por el que se omitió el turno.

Cada línea tiene botones `why`, `wrong` y `forget`. `forget` y `wrong` modifican `JEVMEM.md` (la línea se conserva como `[retirada]`), por lo que piden confirmación antes; una regla se retira solo en un terminal, como ocurre con `jevmem trust`. El panel lee tres archivos locales bajo `.jevmem/` y ejecuta el comando `jevmem` mediante un vector de argumentos; no envía nada a ningún sitio ni lee claves.

## Instalación

En Claude Code, con el mercado añadido (`claude plugin marketplace add claude-code-mods/claude-code-mods-es`):

```
/plugin install jevmem-pane@claude-code-mods-es
```

Necesita el comando jevmem (`npm install -g jevmem`) y un proyecto que esté activado (`jevmem setup`). El panel se abre por sí solo en un terminal de 144 columnas o más; `/jevmem` lo abre o lo cierra a cualquier anchura (acoplado junto al chat a partir de 110 columnas en el terminal a pantalla completa, sobre el mensaje por debajo de esa anchura). Solo para Claude Code: Cursor no dispone de panel.

La descripción completa, con el significado de cada estado, está en [docs/pane.md](https://avinash-jetwani.github.io/jevmem/pane/).

## Fuente y licencia

- Autor original: [Avinash Jetwani](https://github.com/Avinash-jetwani)
- Repositorio original: https://github.com/Avinash-jetwani/jevmem
- Licencia: MIT
- Traducción al español y localización de interfaz: proyecto claude-code-mods-es
