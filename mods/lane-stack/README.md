# lane-stack (plugin Claude Code)

Moitié tournée vers Claude de Claude Lane Stack : agents PM, commandes slash et skills de playbook.

À installer depuis le marketplace du dépôt (pas en copiant dans `~/.claude/agents` / `~/.claude/skills`) :

```bash
claude plugin marketplace add VKirill/claude-lane-stack
claude plugin install lane-stack@claude-lane-stack -y
```

`./install.sh` enregistre ce marketplace GitHub avec `autoUpdate: true` et synchronise toujours le runtime hôte (`bin/`, tableau, profils d'auteur) vers `~/.agents`. Les fichiers hôtes ne se mettent pas à jour automatiquement — relancez `./install.sh`. Checkout en direct : `LANE_INSTALL_LOCAL_MARKETPLACE=1 ./install.sh`.

Les skills sont sous l'espace de noms `/lane-stack:<skill>`. Aide-mémoire : `/lane-stack:info` ou `/info`. Nouvelle application/service : `/lane-stack:app-architect`. Documentation vivante : `/lane-stack:docs-maintain`. Corpus de faits : `/lane-stack:lane-memory`. Les playbooks PM (`orchestrator-lanes`, `orchestrator-workflow`, `info`, `app-architect`) ne vivent que dans ce plugin + `~/.agents/pm-skills` — ils ne sont pas copiés dans le catalogue partagé des auteurs.

## Source et licence

- Auteur d'origine : [VKirill](https://github.com/VKirill/claude-lane-stack)
- Dépôt d'origine : https://github.com/VKirill/claude-lane-stack
- Licence : MIT
- Traduction en français et localisation de l'interface : projet claude-code-mods-es

Traduction en français et localisation de l'interface : projet claude-code-mods-es

Traducción al español y localización de interfaz: proyecto claude-code-mods-es
