# Agent Standup band

![Agent Standup](.claude-plugin/icon.png)

Une ligne au-dessus de votre invite Claude Code lorsqu'une autre session Claude Code sur cet ordinateur a besoin de vous :

    ✋ web-shop (VS Code) needs an approval
    Agent Standup · /agent-standup:open shows them all   Hide

et une courte notification lorsqu'une session commence à vous attendre, ou termine son tour. Vous restez dans la session sur laquelle vous travaillez, tout en sachant si une autre est bloquée sur une question ou une confirmation.

C'est un mod : un plugin des hooks de fonctions de Claude Code. Il s'affiche dans le terminal et dans l'onglet Code de l'application de bureau Claude. Dans VS Code, l'[extension Agent Standup](https://marketplace.visualstudio.com/items?itemName=DoubleGeste.agent-standup) affiche la même chose dans sa barre d'état.

## Installation

Dans Claude Code 2.1.294 ou version ultérieure :

    /plugin install agent-standup-band --marketplace Atoll92/agent-standup

Avec une version antérieure, il se charge mais ne fait rien : ces versions n'exécutent pas les mods (et avant 2.1.221 dans le terminal, 2.1.269 ailleurs, elles n'écrivent pas non plus le statut qu'il lit).

Pour voir chaque session comme un appel d'équipe en direct, installez aussi le plugin principal : `/plugin install agent-standup --marketplace Atoll92/agent-standup`, puis `/agent-standup:open`.

## Ce qu'il lit et exécute

- Toutes les 4 secondes, le fichier de statut que Claude Code conserve pour chaque session ouverte, dans `~/.claude/sessions/<pid>.json` (ou sous `CLAUDE_CONFIG_DIR`) : quelle session, son dossier, et si elle est occupée, inactive ou en attente de vous. Pas les conversations. Une session démarrée par un programme avec `claude -p` est exclue : ses questions vont à ce programme. Une application Agent SDK (Zed, une application maison) est conservée, car elle peut afficher ses menus à une personne.
- `ps`, pour vérifier qu'une session dite en attente tourne encore : une session qui a planté laisse son fichier derrière elle.

Il n'écrit rien et n'envoie rien nulle part.

## Plus

Source et problèmes : https://github.com/Atoll92/agent-standup. Non officiel : non affilié ni approuvé par Anthropic. Sous licence MIT.

## Source et licence

- Auteur d'origine : [Atoll92](https://github.com/Atoll92/agent-standup)
- Dépôt d'origine : https://github.com/Atoll92/agent-standup
- Licence : MIT
- Traduction en français et localisation de l'interface : projet claude-code-mods-es

Traduction en français et localisation de l'interface : projet claude-code-mods-es

Traducción al español y localización de interfaz: proyecto claude-code-mods-es
