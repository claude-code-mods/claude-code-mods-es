# Token Optimizer Desktop

Una barra de estado para la aplicación de escritorio de Claude. Se dibuja encima de tu mensaje y muestra la calidad de la sesión, el llenado del contexto, la cuenta atrás de la caché y tus límites de 5 horas y semanal, con Clawd representando lo que hace la sesión.

## Instalación

Se incluye en el complemento Token Optimizer (`hooks/hooks.json` nombra `hooks/register.tsx` de esta carpeta bajo `modules`), así que no hay nada adicional que instalar. Esta carpeta conserva su propio manifiesto solo para que sus pruebas se ejecuten por separado con `claude plugin test`. `npm run typecheck` y `npm test` cubren los módulos puros (CI); `npm run typecheck:engine` comprueba `hooks/` y `tests/engine/` con las declaraciones de la API de complementos de Claude Code, que solo escribe la CLI de claude, por lo que se ejecuta localmente.

Requiere Claude Code 2.1.287 o posterior y la función de mods de Anthropic. Anthropic puede desactivar los mods de forma remota; cuando están desactivados, nada se rompe, simplemente la barra no aparece. El terminal conserva su línea de estado actual. VS Code no es compatible.

Para comprobar que está activa, abre una sesión de escritorio de Claude con el complemento Token Optimizer habilitado. Busca la banda de Token Optimizer encima del mensaje, con Clawd y la cuenta atrás de la caché. Si no aparece, comprueba que el complemento esté habilitado, que los mods estén disponibles y que `TOKEN_OPTIMIZER_STATUS_BAR` no sea `0`; después reinicia la sesión. El `hooks/hooks.json` del complemento registra `desktop/token-optimizer-desktop/hooks/register.tsx`.

Para verificar la contabilidad sin usar tu sesión, ejecuta `python3 <plugin>/skills/token-optimizer/scripts/measure.py mod-action --selftest`. Imprime `PASS` o `FAIL` y usa un directorio de datos temporal. Los diagnósticos de acciones fallidas se registran en el directorio de datos de Token Optimizer como `mod-actions.log`.

## Qué obtienes

- Una frase sobre lo más urgente, con un botón como máximo.
- Cinco marcadores con tarjetas al pasar el cursor: calificación de calidad, llenado del contexto, cuenta atrás de la caché, límite de 5 horas y límite semanal.
- La **flecha junto a Clawd** despliega una línea más: rama, duración de la sesión, llamadas a herramientas, compactaciones (si las hay), cuándo se guardó el último punto de control (de cualquier tipo, o uno relevante de una sesión anterior) y los tokens que Token Optimizer te ha ahorrado en los últimos 30 días, el mismo total que muestra el panel.
- Botones: **Limpiar** (compacta siguiendo las indicaciones de Token Optimizer), **Empezar de nuevo** (el segundo clic guarda un punto de control, limpia y lo entrega a tu primer mensaje) y **Mantener caliente** (actualización manual de la caché con un clic, solo mientras está caliente, nunca automática; consume una pequeña cantidad de uso).
- **Panel completo**: un enlace en texto sin formato al final de la línea desplegada, en ambos tamaños de banda (la banda plegada no lo muestra). Al hacer clic se ejecuta `measure.py dashboard`, el mismo comando de la habilidad `token-dashboard`: regenera la página del panel y la abre en tu navegador predeterminado (`open` en macOS, `xdg-open` en Linux, la asociación de archivos en Windows). Mientras se ejecuta, la banda dice «Opening the dashboard.»; si falla, la banda dice «Could not open the dashboard.» durante unos segundos y no ocurre nada más. Un segundo clic mientras se ejecuta se ignora. El enlace es un Button dibujado con el estilo `plain` (su prop está en la lista permitida de Button del motor en Claude Code 2.1.287, 2.1.294 y 2.1.296, leída de las cadenas de cada compilación; se ejecuta en 2.1.294 a 2.1.296). El clic ejecuta `measure.py dashboard --user`: `--user` lo marca como clic de una persona para que el presupuesto de 20 segundos del hook no interrumpa una reconstrucción pesada (unos 80 segundos en frío con un historial real extenso), y la banda espera hasta 5 minutos. Solo este enlace espera tanto: Limpiar y Empezar de nuevo siguen abandonando después de 2 minutos.

La cuenta atrás de la caché es una estimación: 1 hora en los planes de Claude, 5 minutos en la API, medida a partir de la propia sesión cuando es posible.

## Ajustes

`TOKEN_OPTIMIZER_STATUS_BAR=0` oculta la barra y `TOKEN_OPTIMIZER_STATUS_BAR_ANIMATE=0` mantiene a Clawd quieto, ajustados en el bloque `env` de `~/.claude/settings.json`. `TOKEN_OPTIMIZER_STATUS_BAR_TIME_FORMAT=24h` (o `12h`) fuerza el formato del reloj para las horas de renovación de los límites; si no se define, siguen tu configuración regional.

El botón `–` junto a la flecha reduce la banda a una línea y `+` la restaura; la flecha sigue desplegando la fila de detalles debajo, y la elección se recuerda entre sesiones y reinicios. `TOKEN_OPTIMIZER_STATUS_BAR_SIZE=slim` define el tamaño inicial antes de que se almacene una elección, y la línea de estado del terminal usa la misma variable para imprimir una sola línea.

El marcador de contexto mide con respecto a tu propia ventana de compactación si la has definido: `CLAUDE_CODE_AUTO_COMPACT_WINDOW`, `/autocompact` o el ajuste `autoCompactWindow`, dentro de los límites de 100K-1M de Claude Code y nunca por encima de la ventana del modelo. Una ventana indicada solo con `--autocompact` para un lanzamiento no es visible para él.

## Documentación completa

Consulta el [README de Token Optimizer](../../README.md#desktop-status-bar) y la página de documentación «Claude desktop app».

Para reservar un intento de Mantener caliente desde la CLI, envía un recibo JSON por entrada estándar:

```bash
printf '%s' '{"action":"warm-prepare","action_id":"ATTEMPT_ID","session_id":"SESSION_ID","timestamp":UNIX_SECONDS,"transcript_path":"/path/to/SESSION_ID.jsonl","byte_size":FILE_SIZE,"transcript_mtime":FILE_MTIME}' | python3 <plugin>/skills/token-optimizer/scripts/measure.py mod-action
```

Sustituye los marcadores por el tamaño exacto del archivo y la hora de modificación de la transcripción actual, un ID de intento único y la hora Unix actual. La respuesta es JSON. Esto reserva la operación; quien llama debe realizar la solicitud de calentamiento y enviar su uso como recibo `warm`, o enviar `warm-cancel` si no se ejecuta.

## Fuente y licencia

- Autor original: [Alex Greenshpun](https://linkedin.com/in/alexgreensh)
- Repositorio original: https://github.com/alexgreensh/token-optimizer
- Licencia: PolyForm-Noncommercial-1.0.0
- Traducción al español y localización de interfaz: proyecto claude-code-mods-es
