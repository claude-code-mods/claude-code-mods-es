# shunt
> Versión en español por el proyecto claude-code-mods-es. El README original en inglés está en [README.en.md](README.en.md).


Un **Claude Mod** — un plugin de Claude Code cuyo comportamiento es un módulo de
[hooks de función](https://github.com/anthropics/claude-code/issues/91870) —
que muestra el uso en una banda sobre el prompt — el
[shunt](https://github.com/pleaseai/shunt) pool de cuentas compartidas del gateway en
shunt, de lo contrario, los límites de tasa de Claude de la sesión — y responde
`/shunt:usage` con el desglose completo del pool.
```
shunt · 5H 5% ↻1h 41m · WK 46% ↻1d 7h · Fable 31% ↻1d 7h ⚠ anthropic degraded
```
```
> /shunt:usage

shunt: pool — degraded   http://127.0.0.1:3001

  5h    ▓▓▓▓▓▓░░░░  62% left   resets 04:11
  7d    ▓▓▓▓▓▓▓▓░░  81% left   resets Sun 01:11
  fable ▓▓░░░░░░░░  19% left   resets Sun 01:11

  claude  ok         5h  71%  7d  84%  fable  19%
  codex   exhausted  5h   0%  7d  40%  fable    —

  headroom left, averaged over the pool's accounts; a shared figure, not a promise about your next request
```
El mod lee del gateway el [`GET /usage`](https://shunt.sh/reference/endpoints/)
endpoint y lo muestra. Responde al propio comando — el hook devuelve sin
llamar a `next`, por lo que no se envía nada al modelo y la respuesta no cuesta tokens.

## La banda de uso

En un gateway shunt la banda muestra el pool, con la etiqueta `shunt ·`. Cada cifra es
cuánto de la ventana está **usado** — `1 - remaining`, la misma media de todo el pool
que el comando informa como margen — seguida del tiempo hasta el reinicio más
temprano de esa ventana. Usado en lugar de restante, para que se lea igual que el `/usage` de
Claude propio y que la banda lee desde shunt. Una cifra se vuelve ámbar a partir del
70% y roja a partir del 90%. Cada proveedor agrupado cuyo estado no sea `ok` se señala
al final (`⚠ anthropic degraded`: ámbar para `degraded`, rojo para `exhausted`
o `capped`), o el propio pool cuando no se lista ningún proveedor. Una ventana que ninguna
cuenta informa se omite.

Fuera de shunt — sin gateway configurado, un gateway que responde `GET /usage` con 404, una
respuesta correcta que no sea un informe del pool, o una que no agrupa ningún proveedor — la
banda muestra en su lugar los límites de tasa propios de la sesión, sin etiqueta, tal como
`$.session.usage()` y `session.measure` los informan:
```
5H 5% ↻1h 41m · WK 46% ↻1d 7h
```
En shunt lo lee al iniciarse la sesión, cada minuto después,
y tras cada turno — justo cuando se acaba de consumir del pool — y
ignora los límites propios de la sesión, que provienen de la cuenta del pool que
haya respondido en último lugar. Un token rechazado (401 o 403), un gateway inalcanzable, otro
estado de error o una utilidad `shunt gateway token` que falla es una falla en shunt,
por lo que se señala en lugar de reemplazarse: `shunt · ⚠ credential refused`, o
`shunt · ⚠ gateway login unavailable` para la utilidad. Sin gateway ni límites de tasa (una
clave de API enviada directamente a Anthropic) la banda no dibuja nada. Lo que otro
plugin dibuje en la banda queda a su izquierda.

Contrae la banda para la sesión con su `[-]` (ctrl+x ctrl+a), o desactívala
con la opción `usageBand` que aparece abajo.

## Lectura de las cifras

`remaining` es la fracción de la capacidad combinada del pool que sigue siendo **utilizable**, por lo que
`62%` significa que queda el 62% del margen, no que se haya gastado el 62%. Es
`mean(clamp(cap - utilization, 0, 1))` sobre las cuentas no deshabilitadas que informan
la ventana, donde `cap` es el límite estricto `max_utilization` de la cuenta para esa
ventana (`100%` si no se define): nueve cuentas agotadas más una nueva sin límite
dan `10%`, no `100%`, y una cuenta al 44% bajo un límite del 50% solo cuenta `6%`.
Una cuenta que un límite ya excluye de las solicitudes de la ventana cuenta cero; un límite de 5h o
7d la excluye de toda solicitud, incluidas las de Fable.

Es un **agregado de todo el pool, no una predicción** — el enrutamiento también pondera
la disponibilidad, el modelo, la afinidad de sesión y la prioridad, por lo que una cifra saludable no es
una promesa de que se admita tu próxima solicitud. Para el peor caso teniendo en cuenta el enrutamiento, usa
`GET /api/oauth/usage` en su lugar.

| Ventana | Qué cubre |
| ------- | -------------- |
| `5h`    | La ventana móvil de sesión de 5 horas |
| `7d`    | La ventana semanal compartida |
| `fable` | La ventana semanal con ámbito Fable (`7d_oi`) |

Una ventana muestra `—` cuando ninguna cuenta no deshabilitada la informa. ChatGPT/Codex
rellenan `5h` y `7d` a partir de las cabeceras de respuesta `x-codex-*` y no tienen
una señal propia con ámbito Fable.

`pool` es el agregado de todos los proveedores agrupados; las filas inferiores son el
mismo agregado por proveedor, por lo que una sesión enrutada a un proveedor puede mostrar
el margen de ese proveedor en lugar de la cifra combinada. El endpoint nunca
incluye nombres de cuentas, recuentos, prioridades ni cifras por cuenta — ese detalle
queda detrás de `GET /admin/api/pool`, solo para administradores.

## Requisitos previos

1. **Apunta Claude Code a tu gateway**, como ya haces para enrutarlo a través de él:
   ```bash
   export ANTHROPIC_BASE_URL=http://127.0.0.1:3001
   export ANTHROPIC_AUTH_TOKEN=<your client token>
   ```
2. **Habilita el endpoint** en el gateway. `GET /usage` es de activación explícita y requiere
   `[server.auth]` (tokens de cliente) o `[server.gateway]` (inicio de sesión en el gateway),
   junto a la tabla `[server.usage]` en `shunt.toml`:
   ```toml
   [server.auth]

   # Presence alone opts in; the table takes no keys.
   [server.usage]
   ```
Con `[server.gateway]` en lugar de `[server.auth]`, consulta
   [sesiones de `shunt gateway claude`](#shunt-gateway-claude-sessions) más abajo.
   `[server.auth]` toma sus tokens del entorno en lugar del TOML —
   por defecto `SHUNT_CLIENT_TOKENS`, como pares `name:token` — y el gateway
   no arranca si no está definido. Expórtalo donde se ejecuta el gateway, usando el
   mismo token que estableciste como `ANTHROPIC_AUTH_TOKEN` más arriba:
   ```bash
   export SHUNT_CLIENT_TOKENS="claude-code:<your client token>"
   ```
3. **Ejecuta Claude Code con los hooks de función habilitados** — la función está en acceso anticipado:
   ```bash
   CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1 claude
   ```
Sin el paso 3 no hay banda, y el comando sigue existiendo pero recurre a
`commands/usage.md`, que pide al modelo leer el endpoint con una llamada a una herramienta en su lugar.

## Instalación
```
/plugin marketplace add pleaseai/shunt
/plugin install shunt@shunt
```
## Configuración

Una opción, una fila en `/config` (guardada en settings.json bajo `pluginConfigs`):

| Opción | Valor predeterminado | Propósito |
| ------ | ------- | ------- |
| `usageBand` | `true` | Muestra la banda sobre el prompt. Desactivado, el mod no registra ninguna banda y no sondea nada; `/shunt:usage` sigue respondiendo |

El mod lee cinco variables de entorno y no escribe ninguna. Por defecto envía la
credencial propia de la sesión al gateway al que la sesión ya envía cada
mensaje, por lo que no alcanza ningún host que la sesión no estuviera usando ya;
`SHUNT_BASE_URL` es la única excepción deliberada y lo dirige a un gateway que
nombra en su lugar. Sin ninguna URL base definida, no realiza ninguna consulta, en lugar de enviar
la credencial a la API de Anthropic.

| Variable | Propósito |
| -------- | ------- |
| `SHUNT_BASE_URL` | URL base del gateway; anula `ANTHROPIC_BASE_URL` |
| `ANTHROPIC_BASE_URL` | El gateway por el que esta sesión ya enruta |
| `SHUNT_TOKEN` | El token de cliente; anula los dos siguientes, se envía como `Authorization: Bearer` |
| `ANTHROPIC_AUTH_TOKEN` | Se envía como `Authorization: Bearer`, tal como lo envía Claude Code |
| `ANTHROPIC_API_KEY` | Se envía como `x-api-key`, tal como lo envía Claude Code |

`SHUNT_BASE_URL` es lo que te permite leer el pool de un gateway mientras enrutas el
tráfico a través de otro.

### Sesiones de `shunt gateway claude`
`shunt gateway claude` elimina `ANTHROPIC_AUTH_TOKEN` y `ANTHROPIC_API_KEY` del
entorno que entrega a Claude Code y conecta `apiKeyHelper` con `shunt gateway
token` en su lugar; Claude Code consume la salida del helper por sí mismo y nunca
la reexporta. Cuando ninguna de las variables anteriores contiene una credencial, el mod
lee por tanto la configuración fusionada (incluido `--settings`) y, si
`apiKeyHelper` es propio de shunt — `shunt gateway token`, por nombre simple o por ruta,
tal como lo escribe el lanzador — lo ejecuta directamente, sin shell, y envía el
token de inicio de sesión del gateway que imprime como `Authorization: Bearer`. Como no hay
shell, un `~/` inicial en una ruta de helper sin comillas se expande al directorio
de inicio (`HOME`, si no `USERPROFILE`) por el propio mod; una ruta entre comillas `'~/…'` sigue
siendo literal, como en una shell. El inicio de sesión pertenece al gateway con el que habla la sesión
(`ANTHROPIC_BASE_URL`), por lo que se envía solo cuando `SHUNT_BASE_URL` no está definida o
indica esa misma URL base — comparada como cadena tras recortar espacios en blanco y
barras finales, de modo que `localhost` y `127.0.0.1` cuentan como diferentes — y el
helper ni siquiera se ejecuta en otros casos; para leer el pool de otro gateway, exporta
`SHUNT_TOKEN` para él. Si ese helper falla — código de salida distinto de cero, sin salida, o si no
se puede iniciar — la banda marca `shunt · ⚠ gateway login unavailable` y
`/shunt:usage` indica ejecutar `shunt gateway login`, en lugar de mostrar silenciosamente
los límites propios de la sesión.

El token se reutiliza durante cinco minutos, así que un sondeo cada minuto no ejecuta el
helper cada minuto. Un token reutilizado que el gateway rechaza se descarta y se
pide al helper una vez más, ya que una renovación puede haberlo rotado. Cualquier otro
`apiKeyHelper` — un gestor de contraseñas, un script que pide datos — nunca se ejecuta: el
mod, de lo contrario, lo ejecutaría cada pocos minutos para obtener una cifra de uso. En esa
sesión, exporta en su lugar `SHUNT_TOKEN` con un token de cliente de `[server.auth]`, o la
banda recurre a los límites de velocidad propios de la sesión.

El gateway debe aceptar un inicio de sesión del gateway en `GET /usage`, lo cual requiere una
compilación de shunt que autentique los inicios de sesión de `[server.gateway]` allí; `[server.usage]` con
solo `[server.gateway]` configurado es suficiente.

## Por qué `/shunt:usage` y no `/usage`

`/usage` es una función integrada propia de Claude Code y el motor se niega a permitir que un plugin
tome el nombre de una función integrada:
```
$.command.register: "/usage" refused: it is the built-in /usage
```
`$.command.register` toma un nombre simple y global. El comando **markdown** de un plugin
queda dentro del espacio de nombres del plugin, así que `commands/usage.md` en un plugin llamado
`shunt` aparece como `shunt:usage` y no colisiona con nada. El módulo de hooks, entonces,
intercepta `command.run` para ese nombre y lo responde directamente.

## Estructura

| Ruta | Qué es |
| ---- | ---------- |
| `hooks/register.tsx` | Los hooks: `command.run` en `shunt:usage` y los `session.start`, `session.measure`, `turn.complete` y `ui.render` de la banda en `AbovePrompt` |
| `hooks/endpoint.ts` | Resuelve la URL del gateway y la cabecera de credencial |
| `hooks/report.ts` | Lee el cuerpo de `GET /usage` de forma defensiva |
| `hooks/reading.ts` | Convierte una ida y vuelta en un informe o un problema, completo y breve |
| `hooks/views.ts` | Renderiza las barras, los porcentajes y los tiempos de reinicio del comando |
| `hooks/band.ts` | Las celdas, alertas, niveles y cuentas atrás de la banda, a partir del pool o de los límites propios de la sesión |
| `hooks/names.ts` | El nombre del comando y los textos fijos |
| `types/index.d.ts` | El contrato de `$.state`: la instantánea del pool, los límites de la sesión y el reloj del que se alimenta la banda |
| `commands/usage.md` | El comando y el fallback sin hooks de función |
| `tests/*.spec.ts` | Suite de Vitest para los módulos puros |
| `tests/mod/*.test.tsx` | Suite del motor para los hooks, ejecutada con `claude plugin test` |

## Desarrollo
```bash
# The static side-effect analysis: which events it hooks, which $ calls and
# environment variables it makes and reads.
CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1 claude plugin validate plugins/shunt

# The pure modules' suite and typecheck (both CI gates).
cd plugins/shunt && npm ci && npm run typecheck && npm test

# The hooks against the engine itself: the band and the command, with the
# gateway, clock and environment mocked. Needs a Claude Code binary, so CI
# does not run it.
claude plugin test plugins/shunt

# Run it from source against a live gateway.
CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1 claude --plugin-dir plugins/shunt
```
`hooks/register.tsx` es el único archivo de hooks que importa `claude-code`. Verificarlo
necesita el propio `claude-code.d.ts` del motor, que Claude Code escribe en el proyecto de un
autor de plugins mediante `/plugin-types`; los demás módulos no importan nada del
motor, por eso la suite los cubre sin él. Por la misma razón,
`tsconfig.json` excluye `hooks/register.tsx` de `npm run typecheck`, junto con
`tests/mod`, la suite del motor — esa exclusión es deliberada, no un descuido, y verificar el tipo de ese único archivo implica
ejecutar `/plugin-types` primero.

> Los hooks de función están en acceso anticipado. Los módulos de hooks se cargan solo donde están
> habilitados, y la API contra la que está escrito este mod puede cambiar entre versiones de Claude Code
> sin previo aviso.

## Licencia

MIT OR Apache-2.0, igual que el proyecto shunt.

## Fuente y licencia

- Autor original: [pleaseai](https://github.com/pleaseai/shunt)
- Repositorio original: https://github.com/pleaseai/shunt
- Licencia: MIT o Apache-2.0 (igual que el proyecto shunt)
- Traducción al español y localización de interfaz: proyecto claude-code-mods-es
