# Operator Memory para Claude Code

Operator Memory ofrece a Claude Code un contexto duradero de proyecto y usuario, mantenido por agentes como Markdown legible.

## Instalación

Requiere Claude Code `v2.1.287` o superior y Operator Helper en `PATH`.

```sh
operator-helper install claude-code
```

Inicia un proceso nuevo de Claude Code tras la instalación. Ejecuta `claude plugin list` para confirmar que `operator@operator-memory` está activado y pregunta al agente si las instrucciones de Operator Memory están disponibles.

El plugin inyecta el preámbulo en el prompt principal del sistema y en los prompts de tareas de los subagentes. Renderiza la memoria una vez por proceso; reinicia Claude Code para recargarla. `/clear` no actualiza el preámbulo en caché.

## Comandos

- `/operator:user-init` — Configura la partición de usuario.
- `/operator:project-init` — Configura el cerebro del proyecto.
- `/operator:index` — Crea o actualiza el índice del proyecto.

## Actualización

El asistente activa la actualización automática del marketplace de Operator durante la instalación, también en instalaciones repetidas. Puedes desactivarla después en `/plugin` → Marketplaces.

Vuelve a ejecutar `operator-helper install claude-code` o usa `claude plugin update operator@operator-memory` y reinicia Claude Code.

Consulta la [guía de Claude Code](https://github.com/aerovato/operator-memory/blob/main/docs/harnesses/claude-code.md) para verificar, actualizar y resolver problemas. Para desarrollo local, ejecuta `bun run preview:claude-code` desde la raíz del espacio de trabajo.

Traducción al español y localización de interfaz: proyecto claude-code-mods-es
