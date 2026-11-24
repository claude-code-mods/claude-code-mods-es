# shunt

> Versión en español por el proyecto claude-code-mods-es. El README original en inglés está en [README.en.md](README.en.md).

Un **Claude Mod** — un plugin de Claude Code cuyo comportamiento es un módulo de [function hook](https://github.com/anthropics/claude-code/issues/91870) — que muestra uso en la banda de estado sobre el prompt: si se configura el gateway [shunt](https://github.com/pleaseai/shunt), el uso del pool de cuentas compartido; si no, los límites de tasa de la sesión de Claude. También responde `/shunt:usage` con el detalle completo del pool.

## Instalación

```
/plugin marketplace add pleaseai/shunt
/plugin install shunt@shunt
```

## Fuente y licencia

- Autor original: [pleaseai](https://github.com/pleaseai/shunt)
- Repositorio original: https://github.com/pleaseai/shunt
- Licencia: MIT o Apache-2.0 (igual que el proyecto shunt)
- Traducción al español y localización de interfaz: proyecto claude-code-mods-es
