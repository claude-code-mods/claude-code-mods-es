<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/banner-dark.svg">
    <img src="docs/assets/banner-light.svg" width="900" alt="ctx-handoff: el kit de herramientas para sesiones largas de Claude Code">
  </picture>
</p>

<p align="center">
  <b>Haz que Claude recuerde lo que le enseñaste, detecte sus descuidos habituales<br>y retome las sesiones largas cuando vuelvas.</b>
</p>

<p align="center">
  <a href="https://github.com/cablate/ctx-handoff-mod/releases"><img src="https://img.shields.io/github/v/release/cablate/ctx-handoff-mod?include_prereleases&display_name=release&label=release&color=7dd3fc" alt="Última versión"></a>
  <a href="https://github.com/cablate/ctx-handoff-mod/actions/workflows/check.yml"><img src="https://github.com/cablate/ctx-handoff-mod/actions/workflows/check.yml/badge.svg" alt="CI"></a>
  <img src="https://img.shields.io/badge/Claude_Code-2.1.287%2B-a78bfa" alt="Claude Code 2.1.287 o posterior">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="Licencia MIT"></a>
</p>

<p align="center">
  <b>English</b> · <a href="README.zh-TW.md">繁體中文</a> · <a href="#instalación">Instalación</a> · <a href="#qué-incluye">Funciones</a> · <a href="docs/guide.md">Guía</a> · <a href="CHANGELOG.md">Registro de cambios</a>
</p>

<p align="center">
  <img src="docs/assets/handoff.svg" width="900" alt="Animación: una sesión larga llena su contexto hasta el umbral; ctx-handoff escribe un resumen del trabajo verificado, los intentos fallidos, tus límites y el siguiente paso, lo limpia y una sesión nueva continúa desde ahí">
</p>

## Por qué

Las sesiones largas de Claude Code se topan una y otra vez con las mismas tareas domésticas. ctx-handoff se encarga de ellas en segundo plano, así que en el uso normal no escribes ningún comando.

| Cuando… | Sin él | Con ctx-handoff |
|---|---|---|
| la conversación está casi llena | Escribes un resumen, `/clear` y lo pegas de nuevo | Se escribe un resumen, se limpia la conversación y una nueva continúa |
| te ausentas una hora | Tu siguiente mensaje vuelve a leer todo a precio completo | La caché se mantiene caliente hasta unas 4 horas |
| repites una instrucción | La siguiente conversación la olvida | Se convierte en una nota del proyecto y, tras 3 veces, en una línea de tu repositorio |
| haces `/clear` o vuelves a abrir Claude Code | La nueva conversación empieza a ciegas | Se le indica dónde se detuvo la anterior |
| Claude reintenta un comando que falla o dice «hecho» sin probarlo | Te enteras más tarde | Claude recibe al instante un recordatorio de una línea |

## Instalación

Requiere Claude Code 2.1.287 o posterior. Probado hasta la 2.1.302.

```sh
claude plugin marketplace add cablate/ctx-handoff-mod
claude plugin install ctx-handoff@claude-code-mods-es
```

Inicia una sesión nueva y escribe `/handoff`. Deberías ver:

```
context 12034 / threshold 600000 (window 1000000)
Cache refresh on, refreshed 0/3 this idle period, timer not started
```

Eso es todo. Actualiza con `claude plugin update ctx-handoff@ctx-handoff-mod`, o activa la actualización automática en **Marketplaces** de `/plugin`.

> [!NOTE]
> Creado para suscripciones de Claude y sesiones largas (por ejemplo, en un modelo de contexto de 1 M). Con clave de API, Bedrock o Vertex, la caché dura solo 5 minutos, así que ejecuta `/handoff refresh off`; todo lo demás funciona. ctx-handoff es experimental, porque los mods de Claude Code siguen en acceso anticipado.

## Qué incluye

ctx-handoff es un kit de herramientas en crecimiento para sesiones largas: aquí llegan las funciones nuevas para trabajar con Claude durante horas.

### Entrega antes de que se llene el contexto (opcional)

Desactivado por defecto, para que la compactación propia de Claude Code tome el relevo. Activa `auto_handoff` en la pestaña Settings del panel y, a 600.000 tokens, espera a que Claude y sus subagentes terminen, escribe un resumen que separa el trabajo verificado de los cambios sin verificar, enumera lo que falló, los límites que pusiste con tus propias palabras y lo que ya se averiguó, termina con un siguiente paso, limpia y continúa en una conversación nueva. Todo lo que escribas mientras tanto se conserva.

### Mantiene la caché caliente mientras estás fuera

Tras unos 50 minutos de inactividad, envía una petición minúscula para que la caché de la conversación no caduque (y se adelante a la compactación por inactividad de Claude Code a los 54 minutos en chats grandes), hasta 3 veces (unas 3,5 horas); después guarda un resumen de entrega sin limpiar, para que a tu vuelta elijas empezar de cero a partir de él (`/handoff resume`) o quedarte donde estabas (`continue`).

Para pausar las actualizaciones y los resúmenes en ausencia solo en esta conversación, pulsa el botón de arriba del panel o ejecuta `/handoff away pause` (`resume` reinicia el temporizador). Las actualizaciones de notas siguen activas y las demás conversaciones no se ven afectadas. El panel y `/handoff` también muestran la actividad en segundo plano en directo y el uso de tokens en segundo plano que informa la sesión desde esta actualización (no es una factura; las peticiones ya enviadas no se pueden cancelar).

<img src="docs/assets/cache.svg" width="900" alt="Animación: tras irte, la caché se actualiza a los 55, 110 y 165 minutos; después se guarda un resumen y, a tu vuelta, eliges reanudar o continuar">

### Aprende de tu proyecto y se lo entrega a tu repositorio

<img src="docs/assets/memory.svg" width="900" alt="Animación: la misma instrucción en tres días se convierte en una regla del proyecto y después en una línea de CLAUDE.md para que la revises">

Las preferencias, correcciones y datos se convierten en un archivo de notas Markdown por proyecto, que se carga en cada conversación nueva. Las rutinas que repites se convierten en skills del proyecto. Solo se lee la parte nueva de la conversación, con Sonnet 5.5 y esfuerzo bajo.

Si una actualización de notas falla o produce algo inutilizable, ese fragmento de la conversación se conserva para el siguiente reintento, sin contar dos veces la misma regla o procedimiento. Los recuerdos que borras solo vuelven si los mencionas de nuevo en otro fragmento de conversación.

### Recuerda dónde te detuviste

<img src="docs/assets/resume.svg" width="900" alt="Animación: tras /clear, a la siguiente conversación se le indican la última tarea, su estado y el siguiente paso">

### Detecta los descuidos habituales

<img src="docs/assets/nudges.svg" width="900" alt="Animación: recordatorios por el mismo fallo dos veces, por decir que se ha terminado sin comprobarlo y por salirte de tu idioma">

### Guardias que tú apruebas, un panel para todo

Cuando una regla ya está escrita pero sigue incumpliéndose, ctx-handoff redacta una guardia: una comprobación de las llamadas a herramientas que recuerda el asunto a Claude o lo bloquea. Claude te pregunta por ella en la siguiente conversación, y nada se aplica hasta que digas que sí. `/handoff panel` abre un panel sobre el prompt con guardias, recuerdos, reglas, la última actualización de notas y todos los ajustes.

<img src="docs/assets/guard.svg" width="900" alt="Animación: una regla en CLAUDE.md que se sigue incumpliendo se convierte en una guardia; Claude pregunta si hay que activarla, tú dices que sí y el siguiente git push recibe un recordatorio. Junto a ello, el panel sobre el prompt recorre sus pestañas: guardias, memoria, reglas, última actualización y ajustes">

## Ajustes

Todo está en la pestaña Settings del panel (`/handoff panel` y luego <kbd>5</kbd>), con el origen de cada valor y un botón de restablecimiento. Los valores por defecto están pensados para no tocarlos. La [guía](docs/guide.md#settings) enumera todos los ajustes.

## Coste y privacidad

- **No tiene servidores propios.** Funciona con tu sesión iniciada de Claude Code y no envía nada a ningún sitio que no sea Anthropic, igual que la propia conversación.
- **Costes pequeños y previsibles.** Una entrega es una petición; una actualización de caché lee desde la caché a una décima parte del precio de entrada; una actualización de notas envía solo la parte nueva de la conversación. Los recordatorios no cuestan nada.
- **Archivos sencillos que te pertenecen.** Las notas son Markdown en `~/.claude/projects/`. Comprueba qué puede hacer el mod con `claude plugin validate`; la [guía](docs/guide.md#cost-privacy-and-permissions) explica cada entrada.

## Documentación

- [Guía](docs/guide.md): todas las funciones en detalle, ajustes, comandos, permisos, entornos compatibles, limitaciones, resolución de problemas y desinstalación.
- [Registro de cambios](CHANGELOG.md): qué cambió en cada versión y por qué merece la pena actualizar.
- [Contribuir](CONTRIBUTING.md): cómo ejecutarlo desde el código fuente y enviar cambios. Los informes de errores y las ideas van en [issues](https://github.com/cablate/ctx-handoff-mod/issues/new/choose).
- [Seguridad](SECURITY.md): cómo informar de una vulnerabilidad de forma privada.

## Historial de estrellas

<a href="https://star-history.com/#cablate/ctx-handoff-mod&Date">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=cablate/ctx-handoff-mod&type=Date&theme=dark" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=cablate/ctx-handoff-mod&type=Date" />
    <img alt="Gráfico del historial de estrellas" src="https://api.star-history.com/svg?repos=cablate/ctx-handoff-mod&type=Date" />
  </picture>
</a>

## Licencia

[MIT](LICENSE)

## Fuente y licencia

- Autor original: [cablate](https://github.com/cablate/ctx-handoff-mod)
- Repositorio original: https://github.com/cablate/ctx-handoff-mod
- Licencia: MIT

Traducción al español y localización de interfaz: proyecto claude-code-mods-es
