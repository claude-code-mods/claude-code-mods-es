# plugin de terminal-browser para Claude Code

> Este plugin es experimental y tiene algunas [limitaciones conocidas](#caveats)




https://github.com/user-attachments/assets/a79e7667-6fcb-49a4-9967-44d0f942102c



## Instalación

Instala terminal-browser
```
curl -fsSL https://terminal-browser.sh/install | bash # or brew install terminal-browser
```

Asegúrate de tener la última versión de Claude Code
```
claude update
```

Activa los plugins de interfaz de Claude Code añadiendo esto a `~/.claude/settings.json`:
```json
{
  "env": { "CLAUDE_CODE_ENABLE_FUNCTION_HOOKS": "1" }
}
```




Instala el plugin de terminal-browser
```
# configurar el marketplace
claude plugin marketplace add zenbu-labs/terminal-browser

# instalar el plugin
claude plugin install terminal-browser@claude-code-mods-es
```

Ahora puedes ejecutar "/browser" dentro de Claude Code para abrir el navegador

### Actualización

Actualiza el plugin de Claude Code
```
claude plugin update terminal-browser@claude-code-mods-es
```

Actualiza terminal-browser
```
terminal-browser upgrade
```

### Configuración

Puedes configurar el plugin de terminal-browser para incluir una herramienta que Claude pueda usar para abrir el navegador. Viene desactivada por defecto, ya que Claude ya puede usar la CLI `terminal-browser` para abrir el navegador dentro de la terminal en un panel dividido. Puedes activar la herramienta añadiendo lo siguiente a tu `~/.claude/settings.json`:

```json
{
  "pluginConfigs": {
    "terminal-browser@terminal-browser": {
      "options": {
        "agentTool": true
      }
    }
  }
}
```


## API del plugin de terminal-browser

El plugin de terminal-browser incluye una API que puedes usar desde otro plugin de Claude Code para abrir el navegador y cargar una URL mediante programación. Algunos ejemplos de plugins útiles que puedes construir con ella:
- Comando de barra `/tldraw` que abre tldraw en el panel dividido de Claude Code
- Comando de barra `/open-pr` que abre el PR asociado a la rama en la que trabajas

```typescript
export type BrowserOpenInput = { url?: string }

export type BrowserOpenResult =
  | { ok: true; url: string }
  | { ok: false; error: string }

export type Browser = {
  open: (input: BrowserOpenInput) => Promise<BrowserOpenResult>
  close: (input?: Record<string, never>) => Promise<boolean>
}

// usage: in your plugin's hooks module
on('command.run', { command: 'tldraw' }, async ($) => {
  const result = await $.browser.open({ url: 'https://www.tldraw.com/' })
  return { text: result.ok ? 'Opened tldraw' : result.error }
})
```

## ¿Cómo funciona?

terminal-browser usa el [protocolo de gráficos de kitty] para mostrar dentro de la terminal los píxeles generados por un navegador real. Para mostrar el navegador dentro de Claude Code usamos la nueva [API de function hooks](https://github.com/anthropics/claude-code/issues/91870) de Claude Code.

Los componentes internos de terminal-browser se han extraído a una biblioteca de JavaScript: https://github.com/zenbu-labs/terminal-browser/tree/main/pixel , por si quieres construir tu propia aplicación gráfica dentro de Claude Code o de la terminal.


## Terminales compatibles

El plugin de terminal-browser para Claude Code solo funciona en terminales que admiten el [protocolo de gráficos de kitty] e implementan los [ marcadores de posición unicode de kitty](https://sw.kovidgoyal.net/kitty/graphics-protocol/#unicode-placeholders). Las terminales más populares que admiten esta función son:
- [ghostty](https://ghostty.org)
- [kitty](https://sw.kovidgoyal.net/kitty/)

Si tu terminal no admite las funciones necesarias, intentar abrir el navegador dentro de Claude Code puede desordenar la TUI

Además, cualquier terminal basada en libghostty admite esta función; algunos ejemplos:
- [cmux](https://cmux.com/)
- [supacode](https://supacode.sh/)

Puedes encontrar más terminales basadas en libghostty aquí: [awesome-libghostty](https://github.com/Uzaaft/awesome-libghostty)

Incluso si tu terminal admite la función gráfica necesaria, si usas un multiplexor el plugin puede no funcionar. Esto se debe a que los multiplexores reescriben la salida de los programas de terminal y rompen los comandos gráficos de la terminal. La compatibilidad con tmux llegará pronto (terminal-browser funciona en tmux, aunque todavía no a través del plugin de Claude Code), y dentro de herdr el rendimiento es muy malo cuando se ejecuta a través del plugin de Claude Code, pero probablemente mejorará pronto. No he probado otros multiplexores, así que si no funciona, abre un issue y veré si podemos darle soporte.




## Advertencias
- depende de que tu terminal admita el [protocolo de gráficos de kitty]
- la posición del ratón a veces estará ligeramente desviada, porque Claude Code no activa el informe de coordenadas de píxeles del ratón
- el plugin necesita hacer peticiones fetch a un servidor HTTP local para comunicarse con la CLI de terminal-browser, lo que puede hacer que tu sistema operativo muestre un aviso de que la terminal quiere acceder a la red local
- Claude Code establece un ancho mínimo muy alto para el área de chat, así que a veces no es posible redimensionar el navegador al tamaño que quieres
- el plugin depende de la API experimental de function hooks de Claude Code, que es inestable, así que el plugin puede dejar de funcionar entre versiones

[kitty graphics protocol]: https://sw.kovidgoyal.net/kitty/graphics-protocol/

## Fuente y licencia

- Autor original: [zenbu-labs](https://github.com/zenbu-labs/terminal-browser)
- Repositorio original: https://github.com/zenbu-labs/terminal-browser
- Licencia: MIT

Traducción al español y localización de interfaz: proyecto claude-code-mods-es
