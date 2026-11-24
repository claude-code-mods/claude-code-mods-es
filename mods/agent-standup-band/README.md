# Banda de agentes en pie

![Agent Standup](.claude-plugin/icon.png)

Una línea sobre tu indicador de Claude Code cuando otra sesión en este equipo te necesita:

    ✋ web-shop (VS Code) needs an approval
    Agent Standup · /agent-standup:open shows them all   Hide

y una notificación breve cuando una sesión empieza a esperarte o termina su turno. Sigues en tu sesión y, al mismo tiempo, sabes si otra está detenida en una pregunta o una aprobación.

Es un mod: un plugin de los hooks de funciones de Claude Code. Se muestra en el terminal y en la pestaña Code de la aplicación de escritorio. En VS Code, la [extensión Agent Standup](https://marketplace.visualstudio.com/items?itemName=DoubleGeste.agent-standup) muestra lo mismo en la barra de estado.

## Instalación

En Claude Code 2.1.294 o posterior:

    /plugin install agent-standup-band --marketplace Atoll92/agent-standup

Con una versión anterior se carga pero no hace nada: esas versiones no ejecutan mods (y antes de 2.1.221 en el terminal, 2.1.269 en otros lugares, tampoco escriben el estado que lee).

Para ver cada sesión como una llamada de equipo en directo, instala también el plugin principal: `/plugin install agent-standup --marketplace Atoll92/agent-standup`, y luego `/agent-standup:open`.

## Qué lee y ejecuta

- Cada 4 segundos, el archivo de estado que Claude Code guarda para cada sesión abierta en `~/.claude/sessions/<pid>.json` (o bajo `CLAUDE_CONFIG_DIR`): qué sesión, su carpeta y si está ocupada, inactiva o esperándote. No lee las conversaciones. Una sesión iniciada por un programa con `claude -p` se excluye: sus preguntas van a ese programa. Se conserva una aplicación Agent SDK (Zed, una aplicación propia), porque puede mostrar sus menús a una persona.
- `ps`, para comprobar que una sesión indicada como en espera sigue activa: una sesión que se ha caído deja su archivo.

No escribe nada ni envía nada a ningún sitio.

## Más información

Fuente e incidencias: https://github.com/Atoll92/agent-standup. No oficial: no está afiliado ni respaldado por Anthropic. Licencia MIT.

## Fuente y licencia

- Autor original: [Atoll92](https://github.com/Atoll92/agent-standup)
- Repositorio original: https://github.com/Atoll92/agent-standup
- Licencia: MIT
- Traducción al español y localización de interfaz: proyecto claude-code-mods-es
