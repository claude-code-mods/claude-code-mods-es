/**
 * The command the mod answers, and the fixed texts it prints.
 *
 * The name is namespaced by the plugin (`shunt` + `commands/usage.md`), which
 * is what keeps it off the built-in `/usage`: `$.command.register` takes a
 * bare global name and refuses `usage` outright ("it is the built-in /usage"),
 * while a plugin's markdown command lists as `shunt:usage` and is free.
 */
export const COMMAND_NAME = 'shunt:usage'

/**
 * The path `[server.usage]` registers on the gateway.
 */
export const USAGE_PATH = '/usage'

export const NO_BASE_URL_TEXT =
  'No hay pasarela que consultar: ni SHUNT_BASE_URL ni ANTHROPIC_BASE_URL están ' +
  'configuradas, por lo que esta sesión se conecta directamente a Anthropic.Apunta Claude Code a ' +
  'Tu pasarela（export ANTHROPIC_BASE_URL=http://127.0.0.1:3001)，y vuelve a ejecutar ' +
  '/shunt:usage。'

export const NO_TOKEN_TEXT =
  'No hay credenciales disponibles: SHUNT_TOKEN,' +
  'ANTHROPIC_AUTH_TOKEN y ANTHROPIC_API_KEY no están configuradas y no hay ' +
  'token de pasarela en apiKeyHelper para leer el inicio de sesión.Usa ' +
  'shunt gateway login o pide un token de cliente al administrador.'

export const NOT_ENABLED_TEXT =
  'La pasarela responde, pero GET /usage no está habilitado. Añade la tabla ' +
  '[server.usage] a la configuración y reinicia; no necesita claves, pero también requiere ' +
  '[server.auth] (token de cliente) o [server.gateway] (inicio de sesión).'

export const REFUSED_TEXT =
  'La pasarela rechazó las credenciales de esta sesión. SHUNT_TOKEN、ANTHROPIC_AUTH_TOKEN、' +
  'ANTHROPIC_API_KEY  y el token de la pasarela shout en apiKeyHelper ' +
  'se envía la primera configurada y se ignoran las demás.El token de cliente debe ser uno aceptado por ' +
  '[server.auth] ; el inicio de sesión puede haber caducado. Usa ' +
  'shunt gateway login para volver a iniciar sesión.'

export const HOOK_FAILED_TEXT =
  'No se pudo leer el uso del pool: el hook que responde a este comando ' +
  'falló o agotó el tiempo asignado.Vuelve a ejecutar /shunt:usage; si ' +
  'falla, comprueba que la pasarela esté activa y accesible.'

export const NO_POOL_TEXT =
  'La pasarela no informó de ningún proveedor agrupado, por lo que no hay cuota compartida que mostrar.' +
  'Cuando un proveedor tenga cuentas en pool ' +
  '(modo de autenticación oauth o chatgpt), se mostrará el uso del pool.'
