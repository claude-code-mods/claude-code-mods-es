# fast-jev-compaction

Plugin de Claude Code que sustituye el resumen de compactación por decisiones de Jev:
cada llamada y resultado de herramienta se puntúa en una única petición rápida, los obsoletos se
descartan o se truncan, y todo lo que se conserva permanece literal. También se puede usar como biblioteca npm.

## Qué es y por qué

La mayor parte de la compactación de contexto pide a un LLM que resuma los turnos antiguos. Un resumen
 pierde información: una ruta de archivo, un error exacto, una restricción o un comando pueden desaparecer incluso cuando
importan después. Esta biblioteca nunca reescribe nada. Solo elimina las llamadas y los resultados de herramienta que Jev dice que ya no se necesitan, y le pregunta a Jev
mostrándole toda la conversación. El texto del usuario y del asistente permanece literal y
 en orden.

El repositorio es a la vez un paquete npm (`src/`) y un plugin de Claude Code
(`hooks/`, `.claude-plugin/`) que usa el paquete para sustituir el resumen de compactación
integrado de Claude Code por los mensajes originales.

## Cómo funciona

1. Cada `tool_use` se empareja con su `tool_result` mediante `tool_use_id`. Las llamadas
   del primer mensaje o de los mensajes `preserveRecentMessages` más recientes están
   fijadas y nunca se tocan.
2. El **estado** enviado a Jev es toda la conversación hasta ahora, primero la más antigua,
   con cada resultado de herramienta sustituido por una nota breve (`ok, 4213 chars (omitted)`).
   Las entradas de herramienta se incluyen, los textos se incluyen, no se resume nada.
3. El estado se ajusta a `maxStateTokens` (25.000 por defecto) por etapas, cada una
   aplicada solo si la anterior no bastó: entradas de herramienta truncadas a
   1.000, luego 200 y luego 60 caracteres; textos largos recortados a principio + final,
   primero los mensajes no fijados más antiguos; mensajes antiguos no fijados condensados en una
   nota `[… N chars omitted …]`; llamadas antiguas de herramienta reducidas a una línea cada una
   (`t12 Read file_path=src/a.ts → ok 480ch`); mensajes antiguos sin llamadas omitidos;
   secuencias de mensajes antiguos solo con llamadas plegados en una entrada. Si todavía
   no cabe, la compactación lanza un error. Los tokens se estiman sin tokenizador (una palabra por cada seis letras, medio token por dígito, ~uno por otro símbolo),
   calibrado para quedar algo por encima de los recuentos que informa Jev.
4. Para cada llamada no fijada, Jev recibe dos preguntas `noul`: ¿debe permanecer la **llamada**
   (saber que se hizo, con su entrada, sigue siendo importante) y debe permanecer el
   **resultado** literal (su contenido sigue siendo necesario y volver a ejecutar la
   herramienta no serviría)?
5. Las preguntas se reparten en tantas peticiones como haga falta para que el estado más las preguntas
   se mantengan por debajo de `maxRequestTokens` (30.000 por defecto, bajo el límite de 32.000 de Jev).
   El mismo estado completo se reenvía en cada petición; las peticiones se ejecutan
   concurrentemente y sus respuestas se fusionan.
6. Las decisiones por llamada, frente a `keepThreshold`:
   - `keepResult ≥ threshold` → conservar llamada y resultado;
   - si no, `keepCall ≥ threshold` → conservar la llamada, truncar el resultado a sus
     primeros `truncateHeadChars` caracteres más una nota de una línea;
   - si no → eliminar la llamada junto con su resultado.
7. Se reconstruye la lista de mensajes: un mensaje que pierde todo su contenido se
   elimina, los mensajes intactos se devuelven como los mismos objetos y ningún resultado
   se deja sin su llamada.

Los fallos de Jev, las respuestas mal formadas, una clave ausente o un historial que no
se puede ajustar lanzan un error; quien llama (o el hook de Claude Code) decide con qué alternativa continuar.

## Instalación y uso

```sh
npm install fast-jev-compaction
export TYPESAFE_API_KEY=...
```

```ts
import { compactMessages, reductionRatio, type Message } from 'fast-jev-compaction';

const transcript: Message[] = [
  { role: 'user', text: 'Fix the failing test. Never edit src/generated.', toolUses: [] },
  {
    role: 'assistant',
    text: '',
    toolUses: [{ tool_use_id: 'toolu_1', tool: 'Read', input: { file_path: 'src/a.ts' } }],
  },
  { role: 'user', text: '', toolUses: [], toolResults: [{ tool_use_id: 'toolu_1', text: '…file…' }] },
  // …
];

const result = await compactMessages(transcript, { preserveRecentMessages: 4 });
console.log(result.messages, result.decisions, result.stats);
if (reductionRatio(result) < 0.25) {
  // not worth it: keep the original transcript, or summarize instead
}
```

`Message` es un subconjunto de `SessionMessage` de Claude Code, así que se puede pasar
 una transcripción de sesión tal cual.

Para aportar tu propio transporte, implementa `JevAsker` (un método `ask(state, questions)`)
 y llama a `compact(messages, asker, options)`; `buildJevRequest` y
`parseJevResponse` te dan el cuerpo de la petición HTTP y la validación de la respuesta.
Los componentes (`collectToolCalls`, `fitState`, `batchCalls`,
`decideCall`, `applyDecisions`) también se exportan.

`apiKey` vale por defecto `process.env.TYPESAFE_API_KEY`. Nunca subas la clave a un
repositorio ni la pongas en un archivo fuente.

## Opciones

| Opción | Valor por defecto | Descripción |
| --- | --- | --- |
| `apiKey` | `TYPESAFE_API_KEY` | Clave de API de TypeSafe (`compactMessages`/`JevClient`) |
| `model` | `jev-latest` | Nombre del modelo Jev |
| `baseUrl` | `https://api.typesafe.ai/v1/systemone` | Endpoint de System One |
| `fetch` | `fetch` nativo | Implementación de fetch inyectable para pruebas |
| `goal` | últimas 3 solicitudes del usuario | Descripción de la tarea en curso incluida en el estado |
| `keepThreshold` | `0.5` | Probabilidad mínima de conservación para que una llamada o resultado permanezca |
| `preserveRecentMessages` | `6` | Mensajes más recientes que nunca se tocan (el primero siempre se conserva) |
| `maxStateTokens` | `25000` | Techo estimado de tokens para el estado |
| `maxRequestTokens` | `30000` | Techo estimado para el estado más un lote de preguntas |
| `truncateHeadChars` | `300` | Caracteres de un resultado descartado que se conservan antes de su nota |

`result.stats` informa de los recuentos de mensajes y caracteres antes y después, los
recuentos de decisiones por motivo, el tamaño del estado en tokens estimados, qué etapa
 de ajuste se necesitó y el número de peticiones.

## Limitaciones

- Solo las llamadas y los resultados de herramienta son candidatos; los mensajes de texto nunca se
  eliminan ni se acortan en la salida (solo se recortan en el estado que ve Jev).
- Los tamaños de tokens son estimaciones a partir del recuento de caracteres, no de un tokenizador.
- La calibración es a nivel de petición; una probabilidad no es una prueba de que un
  resultado se pueda borrar sin riesgo. El asistente siempre puede volver a ejecutar la herramienta.
- El estado completo se repite en cada petición, así que un historial cercano al techo
  de estado cuesta una petición por cada puñado de preguntas.

## Plugin de Claude Code

La raíz del repositorio es un plugin de function hooks de Claude Code: `hooks/fast-jev.ts`
es un adaptador delgado que hace pasar las transcripciones de `session.compact` por `src/` y
recurre al resumen integrado de Claude Code ante errores o una reducción insuficiente. Consulta [`hooks/README.md`](hooks/README.md) para la configuración y la
referencia de tipos de Claude Code 2.1.274.

### Instalación en Claude Code

Los function hooks son una función de acceso anticipado de Claude Code (2.1.274+), así que
hay que activar la bandera de participación allí donde se ejecute Claude Code, p. ej. en `~/.claude/settings.json`:

```json
{ "env": { "CLAUDE_CODE_ENABLE_FUNCTION_HOOKS": "1", "TYPESAFE_API_KEY": "<your key>" } }
```

Después añade este repositorio como marketplace de plugins e instala el plugin,
 ya sea desde el shell o como comandos de barra dentro de una sesión:

```sh
claude plugin marketplace add tamaratran/fast-jev-compaction
claude plugin install fast-jev-compaction@claude-code-mods-es
```

La instalación pide las opciones del plugin (clave de API, umbrales, `truncateHeadChars`,
…); déjalas en sus valores por defecto para usar `TYPESAFE_API_KEY` del entorno.
Reinicia Claude Code o ejecuta `/reload-plugins`. A partir de entonces `/compact` (y
la compactación automática) pasa por Jev: el aviso dice
`fast-jev-compaction: kept N/M messages, no summary (…)` cuando el historial podado
sustituyó al resumen integrado, o `fallback to built-in summary (…)` cuando Jev
no pudo eliminar suficiente (sesiones cortas o si falla).

Para ejecutarlo desde un checkout sin instalar: `CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1 claude --plugin-dir .`
desde la raíz del repositorio. No se requiere publicar nada; el marketplace es
simplemente el `.claude-plugin/marketplace.json` del repositorio.

## Desarrollo

```sh
npm install
npm run typecheck        # library + hook
npm test
npm run build
npm run validate:plugin  # claude plugin validate
TYPESAFE_API_KEY="$(cat ~/.typesafe_key)" npm run demo
```

Las pruebas unitarias usan un Jev falso y nunca contactan con TypeSafe. La demo es la
comprobación real de red.

## Demo animada (macOS)

`demo/JevDemo` es una pequeña aplicación SwiftUI nativa que reproduce una versión
coreografiada y dramatizada del flujo de compactación dentro de una terminal estilo Claude Code: las
llamadas de herramienta de una transcripción preparada se puntúan, los resultados y llamadas que Jev deja ir
se ponen rojos y se pliegan, y el resto permanece literal. Nunca llama a la API; existe
para grabarse en pantalla.

```sh
demo/JevDemo/build.sh   # builds demo/JevDemo/build/JevDemo.app and launches it
```

Pulsa espacio en la aplicación para repetir desde el principio.

## Fuente y licencia

- Autor original: [tamaratran](https://github.com/tamaratran/fast-jev-compaction)
- Repositorio original: https://github.com/tamaratran/fast-jev-compaction
- Licencia: MIT

Traducción al español y localización de interfaz: proyecto claude-code-mods-es
