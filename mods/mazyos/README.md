# MazyOS: el sistema operativo de tu negocio en Claude Code
> Versión en español por el proyecto claude-code-mods-es. El README original en inglés está en [README.en.md](README.en.md).


> Plugin de Claude Code, en portugués. Memoria de tu empresa, identidad
> visual y 17 skills de marketing, SEO, Google Ads y prospección de clientes.
> Tú diriges, Claude trabaja.

Instalas una vez. Después, en cualquier carpeta que sea tu negocio, Claude
ya empieza la conversa sabiendo quién eres, cómo hablas y qué
importa esta semana. Pide un carrusel, sale con tu identidad. Pide
leads, busca en Google Maps y monta el sitio de vista previa. Pide el informe
de los anuncios, lee el CSV y te muestra dónde se te está fugando el dinero.

Vamos a volar.

---

## Qué es MazyOS

Claude Code es la herramienta de Anthropic que ejecuta Claude dentro de tu
ordenador, en una carpeta tuya. MazyOS es un plugin para él: un paquete de
skills (guiones que Claude sigue) más un mod (un trozo de código que
modifica el propio Claude Code mientras trabajas).

Juntos, transforman Claude en un agente de IA que conoce tu
negocio. En la práctica:

**Recuerda.** Tres archivos de texto en `_memoria/` guardan quién es la
empresa, el tono de voz y el enfoque actual. Cada sesión empieza con ellos en el
contexto. Cuando corriges algo ("no escribas así", "este cliente
se fue"), Claude pregunta si quieres guardarlo y lo guarda en el lugar correcto.

**Tiene tu cara.** `identidade/design-guide.md` guarda colores, fuentes y
logo. Carrusel, propuesta, slide: todo sale con la marca.

**Hace el trabajo repetitivo.** 17 skills listas y una forma de crear las
tuyas: cuentas qué repites cada semana y Claude lo convierte en skill.

No necesitas saber programar. Necesitas saber responder preguntas sobre tu
negocio.

---

## Cómo instalar MazyOS en Claude Code

Abre Claude Code en cualquier carpeta y pega:
```
/plugin install mazyos --marketplace mazzeoia/MazyOS
```
Pregunta si puede añadir el marketplace (`y`) y en qué ámbito.
Elige `user`, que sirve para todas tus carpetas. Después aparecen tres
opciones (panel, línea de estado, freno de git). Puedes dejar todo activado;
se puede cambiar en `/config` cuando quieras.

¿Prefieres la terminal? Da igual:
```bash
claude plugin install mazyos --marketplace mazzeoia/MazyOS
```
En la app de Claude para escritorio, donde `/plugin` no existe: haz clic en `+`
junto al cuadro de texto, después Plugins, Add marketplace con
`mazzeoia/MazyOS`, y Add plugin.

¿Todavía no tienes Claude Code? Es de Anthropic, se instala desde el sitio
([code.claude.com](https://code.claude.com)), funciona en Mac, Windows y
Linux y requiere un plan de pago de Claude (Pro, Max, Team) o una
clave de API.

---

## Activando el sistema en tu empresa

Crea una carpeta con el nombre de tu negocio (o usa una que ya exista), abre
Claude Code en ella y ejecuta:
```
/mazyos:instalar
```
Monta la estructura (`_memoria/`, `identidade/`, `marketing/`,
`saidas/`, `dados/`, `scripts/`) y hace una entrevista de unos cinco
minutos: qué vendes, para quién, cómo escribes, cuál es el cuello de botella
de hoy, cuáles son los colores de la marca. Tú solo respondes. Al final, la memoria
está rellena y el sistema te conoce.

Se ejecuta una sola vez. Después basta con abrir Claude en la carpeta y pedir las cosas.

---

## Qué cambia en Claude Code con MazyOS

Esta es la parte del mod. Dentro de una carpeta de MazyOS:

- **La memoria entra sola.** Empresa, preferencias y estrategia van al
  contexto como instrucciones del proyecto, junto a `CLAUDE.md`. Si el archivo
  cambia, Claude recibe la versión nueva. Nadie tiene que pedir que lo lea.
- **Las reglas vienen juntas.** Leer la memoria antes de responder, preguntar
  antes de guardar una corrección, avisar cuando el contexto cambió, sugerir
  skill para tareas que se repiten. Todo esto entra en cada sesión, directo
  del plugin, sin depender de un archivo que puedes borrar sin querer.
- **Panel junto al chat.** Muestra el negocio, el enfoque, el tono, qué
  archivos de memoria están rellenos y cuándo se actualizaron, y botones de
  atajo: abrir sesión, actualizar memoria, guardar en GitHub. Se abre solo en
  terminal ancho. `/mazyos` abre en cualquier momento.
- **Línea de estado.** `MazyOS · Acme · foco: fechar 3 clientes` queda debajo
  del prompt, para que no pierdas el hilo.
- **Aviso cuando la memoria cambia.** ¿Claude editó `estrategia.md`? El panel
  y el estado se actualizan al instante y aparece un aviso.
- **Freno de git.** `git push --force`, `git reset --hard` y afines solo se
  ejecutan después de que tú confirmas. Si no hay forma de preguntar, no se ejecuta.

Fuera de una carpeta de MazyOS, el plugin se queda quieto. Solo avisa una vez,
por carpeta, de que `/mazyos:instalar` existe.

---

## MazyOS en VS Code y en Antigravity

El mismo sistema también existe como extensión de editor, en la carpeta [vscode/](vscode/). Lee la
misma memoria, trae las mismas 17 skills y te deja elegir quién ejecuta el trabajo: Claude Code
(tu cuenta Claude), Codex (tu cuenta ChatGPT) o Antigravity (tu cuenta Google). Cada uno entra
por el login oficial de su propio CLI, y la extensión solo arma la petición y muestra lo que está pasando
en una consola junto al editor. Funciona en VS Code, en Antigravity IDE y en Cursor.

Mientras no está en el marketplace, instálala desde el archivo `.vsix` generado en `vscode/`:
```
cd vscode && npm install && npm run empacotar
code --install-extension mazyos-0.1.0.vsix
```
El resto está en el [README de la extensión](vscode/README.md).

## Las skills

Son 17 skills de Claude Code, listas para usar. Escribe `/mazyos:` y aparece la
lista.

### Para el día a día

- `/mazyos:abrir` resume el contexto en cinco líneas y pregunta qué vamos a hacer.
- `/mazyos:salvar` hace commit y push en GitHub, incluso para quien nunca usó git.
- `/mazyos:atualizar` compara la memoria con lo que hay en la carpeta y propone qué actualizar.
- `/mazyos:novo-projeto` crea una carpeta aislada para cada cliente o iniciativa, con contexto propio.
- `/mazyos:mapear-rotinas` pregunta qué repites cada semana y crea una skill para cada cosa.
- `/mazyos:criacao-canonica-de-skills` crea, refactoriza y audita skills con un método más profundo.

### Contenido y SEO

- `/mazyos:carrossel` crea carrusel para Instagram (1080×1350) con la identidad de la marca, con o sin foto generada por IA, y ya deja el pie de foto listo.
- `/mazyos:publicar-tema` toma un tema y entrega artículo de blog, carrusel y tres pies de foto (Instagram, Facebook, LinkedIn), todo conectado.
- `/mazyos:seo` ejecuta el flujo de SEO en 8 pasos: demanda, competencia, Google Meu Negócio, on-page, contenido, Google Ads, monitoreo y GEO (aparecer en ChatGPT, Gemini y Perplexity).
- `/mazyos:responder-avaliacoes` escribe respuestas humanas para las reseñas de Google.
- `/mazyos:aprovar-post` publica blog, Instagram y Facebook con un solo comando.

### Google Ads y Meta Ads

- `/mazyos:anuncio-google` arma la campaña completa en un CSV listo para importar en Google Ads Editor.
- `/mazyos:relatorio-ads` lee las exportaciones de Google Ads y Meta Ads y devuelve el informe de la semana, con alertas y qué hacer.

### Prospección de clientes

- `/mazyos:prospecta-maps` parte de un nicho y una ciudad, busca las empresas en Google Maps, verifica el CNPJ en la Receita, arma un sitio de vista previa para cada lead y deja listos el primer mensaje y los follow-ups. La propuesta en PDF sale cuando tú la pides. Sin clave de API.

### Producción
- `/mazyos:analisar-dados` lee CSV, hoja de cálculo o PDF y devuelve un resumen ejecutivo.
- `/mazyos:email-profissional` redacta un correo electrónico a partir de lo que cuentes.

Las skills que crees para tu negocio están en `.claude/skills/` de tu
pasta, fuera del plugin, y las invocas como `/<nombre>`.

---

## Preguntas que siempre aparecen

**¿Es gratis MazyOS?** El plugin es abierto y gratuito. Lo que pagas es el
Claude Code: plan Pro, Max o Team de Claude, o la API de Anthropic.

**¿Necesitas saber programar?** No. Hablas en portugués y respondes
preguntas sobre tu negocio. Los comandos son una barra y un nombre.

**¿Funciona en Windows?** Sí. Mac, Windows y Linux, en la terminal, en VS
Code o en la app de Claude.

**¿Dónde están mis datos?** En tu carpeta, en tu computadora. Memoria,
identidad y todo lo que el sistema genera son archivos de texto tuyos, que
puedes abrir, editar y versionar en GitHub. El plugin es solo lectura y se
actualiza mediante `/plugin`.

**¿Qué es un plugin de Claude Code?** Un paquete que añade skills,
comandos y comportamiento a Claude Code, instalado con una línea. MazyOS
es uno de ellos.

**¿Se puede ver lo que el plugin hace en mi Claude?** Sí, es todo código abierto
aquí. `hooks/sistema.ts` tiene las reglas que entran en el contexto;
 `hooks/register.tsx` tiene el mod.

**Yo usaba MazyOS clonando este repositorio. ¿Y ahora?** Instala el plugin
y, en la carpeta del negocio: borra `.claude/skills/` (las skills vienen del plugin;
las que creaste pueden quedarse), quita de `CLAUDE.md` las reglas generales del
MazyOS (el plugin ya inyecta todas) y cambia `/abrir` por `/mazyos:abrir` en el
hábito. Memoria, identidad y salidas se quedan como están.

---

## La tesis

La IA no es una herramienta que tu empresa usa. Es el sistema operativo en el
que funciona.

La diferencia no es la velocidad. Es una capacidad nueva: una persona con IA construye
lo que antes exigía un equipo entero. Cada proceso que hoy funciona en bucle
abierto (decide, ejecuta, no mide, repite a ciegas) se convierte en un bucle cerrado dentro
del MazyOS (decide, ejecuta, captura, realimenta, ajusta solo).

El sistema no te sustituye. Se convierte en parte de tu empresa.

---

## Para quien quiere meterse con el código

Este repositorio es el plugin y el marketplace al mismo tiempo.
```
.claude-plugin/   plugin.json e marketplace.json
hooks/            register.tsx (o mod), memoria.ts (lê o workspace), sistema.ts (as regras)
types/            contrato do estado do mod
tests/            testes do mod
skills/           as 17 skills
templates/        perfis de CLAUDE.md, catálogos e o esqueleto do workspace
```
```bash
claude plugin validate .     # manifesto, marketplace e hooks
claude plugin test .         # testes do mod
claude --plugin-dir .        # en una carpeta de negocio, carga este checkout
```
---

[mazyos.com.br](https://mazyos.com.br)

## Fuente y licencia

- Autor original: [Mazzeo-Marketing](https://github.com/Mazzeo-Marketing/MazyOS)
- Repositorio original: https://github.com/Mazzeo-Marketing/MazyOS
- Licencia: NOASSERTION

Traducción al español y localización de interfaz: proyecto claude-code-mods-es
