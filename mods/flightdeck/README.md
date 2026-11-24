# flightdeck

> Versión en español por el proyecto claude-code-mods-es. El README original en inglés está en [README.en.md](README.en.md).

Flightdeck: panel de agentes en tiempo real para Claude Code. Signos vitales del modelo principal, arquitecto de guardia, cada comprobación de permisos, tarjetas de subagentes y carriles, recibo de un turno y registro de la sesión, todo a partir de eventos reales de la sesión.

## Instalación

En Claude Code (2.1.289 o superior):

```
/plugin marketplace add scasella/claude-flightdeck
/plugin install flightdeck@claude-flightdeck
/reload-plugins
/flightdeck
```

El instalador puede avisar de que faltan opciones de configuración; los valores por defecto bastan y se pueden cambiar en `/config`.

Los mods son una función temprana de Claude Code y su API puede cambiar entre versiones. Si algo falla, consulta la sección de solución de problemas.

## Lo que verás

Panel acoplado junto a la transcripción o mini panel en línea sobre el prompt. Los paneles son: main, architect, gate, agents, loops, receipt y log. Los números provienen de eventos reales de la sesión y no salen de tu máquina.

## Uso

| Comando | Acción |
| --- | --- |
| `/flightdeck` | Abre el panel |
| `/flightdeck close` | Cierra el panel |
| `/flightdeck reset` | Limpia agentes, comprobaciones, consultas, registro y turnos (se conservan coste, límites y compresión) |
| `/flightdeck layout auto\|compact\|wide\|mini` | Sobrescribe el diseño de esta sesión |

Con `ctrl+x tab` se enfoca el panel y luego `1`, `2`… expanden tarjetas y `f` `s` `o` abren desgloses.

## Configuración

En `/config` o en `settings.json` bajo `pluginConfigs[<id>].options`. Ver la tabla completa en README.en.md.

## Solución de problemas

Consulta README.en.md para los casos detallados (panel que no aparece, VS Code, Team/Enterprise, opciones ignoradas, colores, animación, contadores obsoletos).

## Cómo funciona

El estado vive en átomos `$.state`. Cada lectura fusiona valores por defecto. Ver `hooks/register.tsx`, `hooks/core.ts`, `hooks/rail.tsx`, `hooks/elapsed.tsx`.

## Proyectos relacionados

claude-hud, zoetrope, ccusage, awesome-claude-code-mods.

## Desarrollo

```
claude --plugin-dir .
claude plugin validate .
claude plugin test .
npx -p typescript tsc -p .
```

## Fuente y licencia

- Autor original: [scasella](https://github.com/scasella/claude-flightdeck)
- Repositorio original: https://github.com/scasella/claude-flightdeck
- Licencia: MIT
- Traducción al español y localización de interfaz: proyecto claude-code-mods-es
