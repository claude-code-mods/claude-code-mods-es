# lane-stack (plugin de Claude Code)

La mitad orientada a Claude de Claude Lane Stack: agentes PM, comandos slash y habilidades de playbook.

Instálalo desde el marketplace del repositorio (no copies archivos en `~/.claude/agents` / `~/.claude/skills`):

```bash
claude plugin marketplace add VKirill/claude-lane-stack
claude plugin install lane-stack@claude-lane-stack -y
```

`./install.sh` registra ese marketplace de GitHub con `autoUpdate: true` y además sincroniza el runtime del host (`bin/`, tablero y perfiles de escritura) en `~/.agents`. Los archivos del host no se actualizan solos: vuelve a ejecutar `./install.sh`. Para usar el checkout local: `LANE_INSTALL_LOCAL_MARKETPLACE=1 ./install.sh`.

Las habilidades usan el espacio de nombres `/lane-stack:<skill>`. Hoja de trucos: `/lane-stack:info` o `/info`. Para hablar de una app o servicio nuevo: `/lane-stack:app-architect`. Documentación viva: `/lane-stack:docs-maintain`. Corpus de hechos: `/lane-stack:lane-memory`. Los playbooks de PM (`orchestrator-lanes`, `orchestrator-workflow`, `info`, `app-architect`) solo están en este plugin y en `~/.agents/pm-skills`: no se copian al catálogo compartido de escritura.

Traducción al español y localización de interfaz: proyecto claude-code-mods-es
