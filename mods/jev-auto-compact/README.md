# jev-auto-compact

> Versión en español por el proyecto claude-code-mods-es. El README original en inglés está en [README.en.md](README.en.md).

Compresión literal impulsada por Jev: cuando el contexto alcanza el 60%, recorta las llamadas de herramientas obsoletas sin generar ningún contenido. Si no hay nada que recortar, se omite directamente (nunca se recurre a un resumen por LLM); además registra evidencia para learning.db.

## Instalación

```
/plugin install jev-auto-compact@claude-code-mods-es
```

## Fuente y licencia

- Autor original: [notque](https://github.com/notque/vexjoy-agent)
- Repositorio original: https://github.com/notque/vexjoy-agent
- Licencia: MIT
- Traducción al español y localización de interfaz: proyecto claude-code-mods-es
