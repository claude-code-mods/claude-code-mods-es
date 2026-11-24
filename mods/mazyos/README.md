# MazyOS: el sistema operativo de tu negocio en Claude Code

> Plugin de Claude Code, originalmente en portugués. Memoria de tu empresa, identidad
> visual y 17 skills de marketing, SEO, Google Ads y prospección de clientes.
> Tú diriges, Claude trabaja.

Lo instalas una vez. Después, en cualquier carpeta que sea tu negocio, Claude
empieza la conversación sabiendo quién eres, cómo hablas y qué importa esta semana. Pides un carrusel y sale con tu identidad. Pides
prospectos y busca en Google Maps y prepara un sitio de vista previa. Pides el informe
de los anuncios, lee el CSV y te muestra dónde se te escapa el dinero.

A volar.

---

## Qué es MazyOS

Claude Code es la herramienta de Anthropic que ejecuta Claude dentro de tu
ordenador, en una carpeta tuya. MazyOS es un plugin para él: un paquete de
skills (guiones que Claude sigue) más un mod (un trozo de código que
cambia el propio Claude Code mientras trabajas).

Juntos, convierten Claude en un agente de IA que conoce tu
negocio. En la práctica:

**Recuerda.** Tres archivos de texto en `_memoria/` guardan quién es la
empresa, el tono de voz y el foco actual. Toda sesión empieza con ellos en el
contexto. Cuando corriges algo («no escribas así», «este cliente
se fue»), Claude pregunta si quieres guardarlo y lo guarda en el lugar correcto.

**Tiene tu cara.** `identidad/design-guide.md` guarda colores, tipografías y
logo. Carrusel, propuesta, diapositiva: todo sale con la marca.

**Hace el trabajo repetitivo.** 17 skills listas para usar y una forma de crear las
tuyas: cuentas qué repites cada semana y Claude lo convierte en skill.

No hace falta saber programar. Basta con saber responder preguntas sobre tu
negocio.

---

## Cómo instalar MazyOS en Claude Code

Abre Claude Code en cualquier carpeta y pega:

```
/plugin install mazyos@claude-code-mods-es
```

Pregunta si puede añadir el marketplace (`y`) y en qué ámbito.
Elige `user`, que sirve para todas tus carpetas. Después aparecen tres
opciones (panel, línea de estado, freno para git). Puedes dejar todo activado;
se puede cambiar en `/config` cuando quieras.

¿Prefieres la terminal? Da igual:

```bash
claude plugin install mazyos@claude-code-mods-es
```

En la app de Claude para escritorio, donde no existe `/plugin`, haz clic en el `+`
 junto al cuadro de texto, después en Plugins, Add marketplace con
`mazzeoia/MazyOS` y, por último, Add plugin.

¿Todavía no tienes Claude Code? Es de Anthropic, se instala desde la web
([code.claude.com](https://code.claude.com)), funciona en Mac, Windows y
Linux, y necesita un plan de pago de Claude (Pro, Max, Team) o una
clave de API.

---

## Poner en marcha el sistema en tu empresa

Crea una carpeta con el nombre de tu negocio (o usa una que ya exista), abre
Claude Code en ella y ejecuta:

```
/mazyos:instalar
```

Prepara la estructura (`_memoria/`, `identidad/`, `marketing/`,
`saidas/`, `dados/`, `scripts/`) y hace una entrevista de unos cinco
minutos: qué vendes, a quién, cómo escribes, cuál es el cuello de botella de
hoy, cuáles son los colores de la marca. Tú solo respondes. Al final, la memoria está
rellena y el sistema te conoce.

Se ejecuta una sola vez. Después basta con abrir Claude en la carpeta y pedir las cosas.

---

## Qué cambia en Claude Code con MazyOS

Esta es la parte del mod. Dentro de una carpeta de MazyOS:

- **La memoria entra sola.** Empresa, preferencias y estrategia pasan al
  contexto como instrucciones del proyecto, junto a `CLAUDE.md`. Si cambia el
  archivo, Claude recibe la versión nueva. Nadie tiene que pedir que lo lea.
- **Las reglas vienen con ella.** Leer la memoria antes de responder, preguntar
  antes de guardar una corrección, avisar cuando cambió el contexto, sugerir
  una skill para la tarea que se repite. Todo eso entra en cada sesión, directamente
  desde el plugin, sin depender de un archivo que puedes borrar sin querer.
- **Panel junto al chat.** Muestra el negocio, el foco, el tono, qué
  archivos de memoria están rellenos y cuándo se actualizaron, y botones de acceso rápido: abrir sesión, actualizar memoria, guardar en GitHub.
  Se abre solo en una terminal ancha. `/mazyos` lo abre cuando quieras.
- **Línea de estado.** `MazyOS · Acme · foco: fechar 3 clientes` aparece
  debajo del prompt para que no pierdas el hilo.
- **Aviso cuando cambia la memoria.** ¿Claude editó `estrategia.md`? El
  panel y el estado se actualizan al instante y aparece un aviso.
- **Freno para git.** `git push --force`, `git reset --hard` y similares solo
  se ejecutan después de que lo confirmes. Si no se puede preguntar, no se ejecutan.

Fuera de una carpeta de MazyOS, el plugin se queda quieto. Solo avisa una vez, por
carpeta, de que existe `/mazyos:instalar`.

---

## MazyOS en VS Code y Antigravity

El mismo sistema también existe como extensión de editor, en la carpeta [vscode/](vscode/). Lee la
misma memoria, trae las mismas 17 skills y te deja elegir quién ejecuta el trabajo: Claude Code
(tu cuenta de Claude), Codex (tu cuenta de ChatGPT) o Antigravity (tu cuenta de Google). Cada uno entra
con el inicio de sesión oficial de su propio CLI, y la extensión solo prepara la petición y muestra lo que está ocurriendo
en una consola junto al editor. Funciona en VS Code, en el IDE Antigravity y en Cursor.

Mientras no esté en el marketplace, instálala desde el archivo `.vsix` generado en `vscode/`:

```
cd vscode && npm install && npm run empacotar
code --install-extension mazyos-0.1.0.vsix
```

El resto está en el [README de la extensión](vscode/README.md).

## Las skills

Son 17 skills de Claude Code, listas para usar. Escribe `/mazyos:` y
aparece la lista.

### Para el día a día

- `/mazyos:abrir` resume el contexto en cinco líneas y pregunta qué vamos a hacer.
- `/mazyos:salvar` hace commit y push en GitHub, incluso para quien nunca usó git.
- `/mazyos:atualizar` compara la memoria con lo que hay en la carpeta y propone qué actualizar.
- `/mazyos:novo-projeto` crea una carpeta aislada para cada cliente o iniciativa, con su propio contexto.
- `/mazyos:mapear-rotinas` pregunta qué repites cada semana y crea una skill para cada cosa.
- `/mazyos:criacao-canonica-de-skills` crea, refactoriza y audita skills con un método más profundo.

### Contenido y SEO

- `/mazyos:carrossel` crea un carrusel para Instagram (1080×1350) con la identidad de la marca, con o sin foto generada por IA, y deja la leyenda preparada.
- `/mazyos:publicar-tema` toma un tema y entrega artículo de blog, carrusel y tres leyendas (Instagram, Facebook, LinkedIn), todo coherente.
- `/mazyos:seo` ejecuta el flujo de SEO en 8 pasos: demanda, competencia, Google Mi Negocio, on-page, contenido, Google Ads, seguimiento y GEO (aparecer en ChatGPT, Gemini y Perplexity).
- `/mazyos:responder-avaliacoes` escribe respuestas humanas para las reseñas de Google.
- `/mazyos:aprovar-post` publica blog, Instagram y Facebook con un solo comando.

### Google Ads y Meta Ads

- `/mazyos:anuncio-google` prepara la campaña completa en un CSV listo para importar en Google Ads Editor.
- `/mazyos:relatorio-ads` lee las exportaciones de Google Ads y Meta Ads y devuelve el informe de la semana, con alertas y qué hacer.

### Prospección de clientes

- `/mazyos:prospecta-maps` parte de un nicho y una ciudad, busca las empresas en Google Maps, comprueba el CNPJ en la Receita, prepara un sitio de vista previa para cada prospecto y deja listos el primer mensaje y los recordatorios. La propuesta en PDF se genera cuando la pides. Sin clave de API.

### Producción

- `/mazyos:analisar-dados` lee CSV, hoja de cálculo o PDF y devuelve un resumen ejecutivo.
- `/mazyos:email-profissional` redacta un correo a partir de lo que le cuentes.

Las skills que crees para tu negocio quedan en `.claude/skills/` de tu
carpeta, fuera del plugin, y las invocas como `/<nombre>`.

---

## Preguntas que siempre aparecen

**¿MazyOS es gratis?** El plugin es abierto y gratuito. Lo que pagas es
Claude Code: el plan Pro, Max o Team de Claude, o la API de Anthropic.

**¿Hace falta saber programar?** No. Hablas en portugués y respondes
preguntas sobre tu negocio. Los comandos son una barra y un nombre.

**¿Funciona en Windows?** Sí. Mac, Windows y Linux, en terminal, en VS
Code o en la app de Claude.

**¿Dónde están mis datos?** En tu carpeta, en tu ordenador. Memoria,
identidad y todo lo que genera el sistema son archivos de texto tuyos, que
puedes abrir, editar y versionar en GitHub. El plugin es solo lectura y se
actualiza con `/plugin`.

**¿Qué es un plugin de Claude Code?** Un paquete que añade skills,
comandos y comportamiento a Claude Code, instalado con una línea. MazyOS
es uno de ellos.

**¿Puedo ver qué hace el plugin en mi Claude?** Sí, todo es código abierto
aquí. `hooks/sistema.ts` tiene las reglas que entran en el contexto;
`hooks/register.tsx` tiene el mod.

**Antes usaba MazyOS clonando este repositorio. ¿Y ahora?** Instala el plugin
y, en la carpeta del negocio: borra `.claude/skills/` (las skills vienen del plugin;
las que creaste pueden quedarse), quita de `CLAUDE.md` las reglas generales de
MazyOS (el plugin ya las inyecta todas) y cambia `/abrir` por `/mazyos:abrir` en
tu costumbre. Memoria, identidad y salidas siguen como están.

---

## La tesis

La IA no es una herramienta que tu empresa usa. Es el sistema operativo en
que opera.

La diferencia no es velocidad. Es capacidad nueva: una persona con IA construye
lo que antes exigía un equipo entero. Cada proceso que hoy corre en bucle
abierto (decide, ejecuta, no mide, repite a ciegas) se convierte en bucle cerrado dentro
de MazyOS (decide, ejecuta, captura, realimenta, se ajusta solo).

El sistema no te sustituye. Se convierte en parte de tu empresa.

---

## Para quien quiere meter mano en el código

Este repositorio es a la vez el plugin y el marketplace.

```
.claude-plugin/   plugin.json y marketplace.json
hooks/            register.tsx (el mod), memoria.ts (lee el workspace), sistema.ts (las reglas)
types/            contrato del estado del mod
tests/            pruebas del mod
skills/           las 17 skills
templates/        perfiles de CLAUDE.md, catálogos y el esqueleto del workspace
```

```bash
claude plugin validate .     # manifesto, marketplace e hooks
claude plugin test .         # pruebas del mod
claude --plugin-dir .        # en una carpeta de negocio, carga este checkout
```

---

[mazyos.com.br](https://mazyos.com.br)

## Fuente y licencia

- Autor original: [Mazzeo-Marketing](https://github.com/Mazzeo-Marketing/MazyOS)
- Repositorio original: https://github.com/Mazzeo-Marketing/MazyOS
- Licencia: NOASSERTION

Traducción al español y localización de interfaz: proyecto claude-code-mods-es
