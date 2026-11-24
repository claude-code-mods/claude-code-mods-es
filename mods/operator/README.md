# Operator Memory para Claude Code

Operator Memory ofrece a Claude Code un contexto duradero de proyecto y usuario, mantenido por los agentes en Markdown legible.

## Installation

Requiere Claude Code `v2.1.287` o posterior y Operator Helper en el `PATH`.

```sh
operator-helper install claude-code
```

Démarrez un nouveau processus Claude Code après l'installation. Lancez `claude plugin list` pour confirmer que `operator@operator-memory` est activé, puis demandez à l'agent si les indications Operator Memory sont disponibles.

Le plugin injecte le préambule dans le prompt système principal et dans les prompts de tâche des sous-agents. Il rend la mémoire une fois par processus ; redémarrez Claude Code pour recharger la mémoire. `/clear` ne rafraîchit pas le préambule mis en cache.

## Commandes

- `/operator:user-init` — Configurer la partition utilisateur.
- `/operator:project-init` — Configurer le cerveau du projet.
- `/operator:index` — Construire ou rafraîchir l'index du projet.

## Mise à jour

Helper active la mise à jour automatique pour le marketplace Operator lors de l'installation, y compris lors des réinstallations. Désactivez-la ensuite dans `/plugin` → Marketplaces si vous le souhaitez.

Relancez `operator-helper install claude-code` ou utilisez `claude plugin update operator@operator-memory`, puis redémarrez Claude Code.

Voir le [guide Claude Code](https://github.com/aerovato/operator-memory/blob/main/docs/harnesses/claude-code.md) pour la vérification, les mises à jour et le dépannage. Pour le développement local, lancez `bun run preview:claude-code` depuis la racine de l'espace de travail.

## Source et licence

- Auteur d'origine : [aerovato](https://github.com/aerovato/operator-memory)
- Dépôt d'origine : https://github.com/aerovato/operator-memory
- Licence : MIT
- Traduction en français et localisation de l'interface : projet claude-code-mods-es

Traduction en français et localisation de l'interface : projet claude-code-mods-es

Traducción al español y localización de interfaz: proyecto claude-code-mods-es
