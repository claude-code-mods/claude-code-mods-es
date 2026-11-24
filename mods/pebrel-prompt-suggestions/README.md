# Predicciones de prompt nativas de Claude Code

> Versión en español por el proyecto claude-code-mods-es. El README original en inglés está en [README.en.md](README.en.md).

Este adaptador usa los hooks de función nativos de Claude Code. Está verificado con Claude Code 2.1.310; versiones anteriores no están soportadas. Se carga para un nuevo proceso con `--plugin-dir <directorio-absoluto-del-adaptador>` y `CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1`. Cargar el adaptador no lo instala en la configuración global de Claude del usuario.

El lanzador debe proporcionar `PEBREL_PREDICTION_ENDPOINT` (una dirección HTTP IPv4 de loopback con puerto), `PEBREL_PREDICTION_TOKEN` y `CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION=false`. La última variable suprime la inferencia de predicción integrada de Claude Code para ese proceso. Sin ella el adaptador no hace nada, evitando dos solicitudes de inferencia para el mismo turno completado. No se modifica ningún ajuste global ni del modelo principal.

Solo un turno principal exitoso con un compositor de terminal vacío y montado es elegible. `$.session.messages()` proporciona texto de usuario/asistente en memoria; las cargas de herramientas no se envían. El puente recibe como máximo 24 mensajes, 3000 unidades UTF-16 por mensaje y 12000 unidades en total. Pebrel se encarga del prompt de predicción, el proveedor configurado, el idioma y otros límites de contexto. El adaptador no añade ningún prompt de estilo de habla ni persistencia.

El `loading_text` localizado del puente aparece en el pie `PromptHint` atenuado de Claude Code, seguido de `.`, `..` y `...` cada 400 ms. No es editable y nunca se envía a `prompt.suggest`. Un candidato completado usa `$.prompt.suggest({text})` nativo, por lo que el comportamiento nativo de Tab/flecha derecha rellena el compositor sin enviarlo. El compositor sigue siendo propiedad de Claude Code.

La edición, los cambios de prompt, los nuevos turnos, el fin de sesión y un plazo de diez segundos invalidan el trabajo de interfaz pendiente. Cada resultado vuelve a verificar la revisión, la sesión y el borrador vacío. La API nativa `http.fetch` no tiene señal de aborto: la cancelación aquí solo suprime resultados obsoletos, mientras que el puente gestiona el plazo de red/solicitud. No quedan sondeos de disco ni temporizadores cuando la interfaz de predicción está inactiva.

Ejecuta el contrato de comportamiento con `node --test tests/*.test.mjs`, y el escáner real de Claude con `claude plugin validate --strict --json <directorio-del-adaptador>`. Las pruebas simuladas no establecen la aceptación visual del terminal nativo ni la compatibilidad con una versión de Claude no probada.

## Instalación

```
/plugin install pebrel-prompt-suggestions@claude-code-mods-es
```

## Fuente y licencia

- Autor original: [Kuddev](https://github.com/Kuddev/pebrel)
- Repositorio original: https://github.com/Kuddev/pebrel
- Licencia: GPL-3.0
- Traducción al español y localización de interfaz: proyecto claude-code-mods-es
