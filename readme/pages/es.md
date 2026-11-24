# Claude Code: selección de mods

{{languages}}

**Seleccionados, validados y fijados a una versión. Añádelos una vez y tendrás {{count}} mods.**

> **Los {{count}} mods están completamente localizados al español.** Todas las etiquetas, los comandos, los paneles, las sugerencias y la documentación están traducidos; las fuentes de los plugins se incluyen en este repositorio, así que la interfaz ya está en español después de instalarlos, sin configuración adicional. Solo los identificadores de código, los nombres de eventos de hooks, las skills y las instrucciones dirigidas al modelo permanecen en inglés para no alterar el comportamiento.

Los mods son plugins de Claude Code escritos con hooks de funciones: pueden observar, modificar o tomar el control del comportamiento de Claude Code, y también dibujar su propia interfaz. Este mercado reúne los mejores mods de la comunidad. Cada uno se ha validado con `claude plugin validate` y se ha fijado al commit verificado, de modo que los cambios posteriores de sus autores no te llegan sin revisión.

Se necesita Claude Code 2.1.287 o superior.

## Instalación

Escribe esto en una sesión de terminal de Claude Code:

```
/plugin marketplace add claude-code-mods/claude-code-mods-es
/plugin install <nombre-del-mod>@claude-code-mods-es
```

Por ejemplo: `/plugin install terminal-browser@claude-code-mods-es`. Ejecuta `/plugin marketplace update claude-code-mods-es` para obtener mods nuevos y actualizaciones.

## Catálogo

Los **permisos** de cada tarjeta indican, según informa el validador, qué puede hacer ese mod además de dibujar la interfaz. Revisa su código antes de instalarlo: la validación solo lee el código de forma estática, no lo ejecuta y no equivale a una auditoría de seguridad.

{{catalog}}

## Recomienda un mod

Abre un issue con el enlace al repositorio del mod. También puedes añadirlo tú mismo: agrega una entrada en `community.json` (repositorio, directorio, commit verificado, categoría y licencia), escribe una descripción de una línea en `readme/summaries.json`, ejecuta `python3 scripts/build-catalog.py` y envía un pull request.

## Agradecimientos y localización

Cada mod pertenece a su autor original y conserva su propia licencia. Además de recopilarlos, este repositorio ofrece una **localización al español**: los plugins se incluyen en el directorio `mods/`, se traducen sus etiquetas, descripciones de comandos, paneles y sugerencias, y también se traduce la documentación de cada mod (el original se conserva como `README.en.md`). El autor original y la licencia se indican al final de cada documento. Si quieres que se retire una copia localizada o que se cambie su atribución, abre un issue.

Proyecto no oficial, sin relación con Anthropic.
