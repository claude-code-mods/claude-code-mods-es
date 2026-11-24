# Lot Map para Claude Code

> Versión en español por el proyecto claude-code-mods-es. El README original en inglés está en [README.en.md](README.en.md).

`lot-map` es un mod para Claude Code: un mapa en vivo del trabajo, en un panel junto al chat. Cada llamada de herramienta, paso de modelo, hook y skill envía un pulso del centro a su estación, así que ves memoria, archivos, shell, web y agentes trabajando en lugar de leer una lista de comandos.

Se ejecuta en tu máquina y no envía nada a ninguna parte. Local no significa ciego: como cualquier mod que sigue las llamadas de herramientas, recibe cada llamada completa y toma solo los nombres de ella. Ver [PRIVACY.md](PRIVACY.md) y [PRINCIPLES.md](PRINCIPLES.md).

![El mapa durante una sesión de trabajo](https://github.com/alexeyw/lot-map/raw/main/docs/demo.gif)

## Instalación

En el prompt de una sesión de terminal:

```
/plugin install lot-map --marketplace alexeyw/lot-map
```

Responde `y` para añadir el marketplace y elige un alcance. Desde un shell:

```bash
claude plugin install lot-map --marketplace alexeyw/lot-map
```

Si responde que el plugin no se encuentra en ningún marketplace, añádelo primero:

```bash
claude plugin marketplace add alexeyw/lot-map
claude plugin install lot-map@lot-map
```

En la app de escritorio: haz clic en **+** junto al cuadro de prompt, luego **Plugins**, **Add marketplace** con `alexeyw/lot-map`, y **Add plugin**.

El panel se abre solo al iniciar una sesión; con `openAtStart` desactivado espera a `/lot-map`. En terminal necesita al menos 144 columnas; de lo contrario escribe `/lot-map`, y dibuja solo texto salvo que pidas el mapa como imagen o en puntos braille. Ver [En un terminal](#en-un-terminal). Construido y probado en Claude Code 2.1.321 en macOS; los usuarios reportan que funciona en Windows y Linux.

## Actualización

Desde un shell:

```bash
claude plugin marketplace update lot-map
claude plugin update lot-map@lot-map
```

Luego inicia una nueva sesión. El primer comando es necesario: sin él, el segundo informa la versión instalada como la última.

Los cambios de cada versión están en [CHANGELOG.md](CHANGELOG.md).

## Fuente y licencia

- Autor original: [alexeyw](https://github.com/alexeyw/lot-map)
- Repositorio original: https://github.com/alexeyw/lot-map
- Licencia: MIT
- Traducción al español y localización de interfaz: proyecto claude-code-mods-es
