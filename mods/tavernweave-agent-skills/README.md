# TavernWeaveX无限月读
> Versión en español por el proyecto claude-code-mods-es. El README original en inglés está en [README.en.md](README.en.md).


> **2.4.0 lanzamiento oficial**: se añade **adaptación nativa de Antigravity(AGY)**——plantilla de plugin host de AGY, archivos de instrucciones y adaptación persistente de cuatro bandas de preferencias de guía; y se alinean los manifiestos de los plugins de Codex y Claude y la descripción de marketplace con el manifiesto principal de instalación, restaurando la consistencia de versión. Los nombres y la cantidad de los 23 Skill no cambian. Los activos de lanzamiento y los archivos de verificación están en [v2.4.0 página oficial de lanzamiento](https://github.com/LiarMTTT/TavernWeave/releases/tag/v2.4.0). La instalación desde fuente verifica los 23 Skill según el manifiesto local; el alcance completo de validación está en CHANGELOG y el contrato DSH.

> Esta versión se basa en **2.3.6** y añade la adaptación nativa de Antigravity, manteniendo los 23 Skill. El plugin de Claude Code introducido en 2.2.0 sigue ofreciendo inyección automática de Host Front Door, el `tavernweave` agent y el cambio de modo Soul situado sobre el cuadro de entrada; el paquete de plugin **TavernWeave X DSH** ahora incluye integrado el panel del cliente 神之手 (rueda, ventana flotante completa, Libro del Mundo, base de datos de diseño ＆ animación de frontend, gestión de proyectos/tarjetas), con una sola instalación; la entrada de diseño y escritura del Libro del Mundo sigue disponible. El paquete completo, el paquete de plugin y los archivos de verificación están en [v2.4.0 página oficial de lanzamiento](https://github.com/LiarMTTT/TavernWeave/releases/tag/v2.4.0); el origen y el registro de fusión están en [notas de actualización](docs/dual-task-upgrade.md).

<p align="center">
  <img src="docs/assets/tavernweave-v1-cover.png" alt="un telar digital situado en una taberna de fantasía que teje tarjetas de personaje, Libro del Mundo, materiales de diseño y módulos de ingeniería en un flujo de trabajo unificado" width="100%">
</p>

<p align="center"><strong>Teje inspiración, materiales, código y validación en una tarjeta de personaje realmente mantenible.</strong></p>

TavernWeaveX无限月读 (se mantiene la abreviatura TW) te ayuda a convertir tus ideas en tarjetas de personaje, páginas web o pequeñas herramientas que se puedan usar y seguir modificando. Puedes decir directamente qué quieres hacer o qué ha fallado; TW organiza los requisitos, propone un plan, crea y comprueba, y explica cómo probarlo a continuación. Organiza este trabajo mediante Skill que se cargan por tarea (capacidades de trabajo invocadas según la tarea), admite Codex y Claude Code, y también admite DeepSeek Harness a través del paquete de plugin **TavernWeave X DSH**; el paquete DSH también incluye el panel del cliente 神之手.

El código fuente actual es **TavernWeaveX无限月读 2.4.0, lanzamiento oficial**, con adaptación nativa de Antigravity(AGY) y persistencia de cuatro bandas de preferencias de guía, y corrige la consistencia de versión entre hosts; en total hay 23 Skill nativos, con nombres y cantidad sin cambios. El plugin de Claude Code introducido en 2.2.0 sigue ofreciendo inyección automática de Host Front Door, el `tavernweave` agent y el cambio de modo Soul (consulta [plugin de Claude Code](#claude-code-plugin)); el paquete de plugin **TavernWeave X DSH** incluye integrado el panel del cliente 神之手, y la entrada de diseño y escritura del Libro del Mundo sigue disponible. El identificador de instalación de la máquina `tavernweave-agent-skills`, los nombres de las habilidades existentes y la dirección del repositorio se mantienen respecto a la versión original, para facilitar la comprobación de la actualización. El paquete completo y los archivos de verificación están en [v2.4.0 página oficial de lanzamiento](https://github.com/LiarMTTT/TavernWeave/releases/tag/v2.4.0); las páginas históricas de lanzamiento de [v2.2.0](https://github.com/LiarMTTT/TavernWeave/releases/tag/v2.2.0), [v2.1.0](https://github.com/LiarMTTT/TavernWeave/releases/tag/v2.1.0), [v1.9.1](https://github.com/LiarMTTT/TavernWeave/releases/tag/v1.9.1) y [v1.9.0](https://github.com/LiarMTTT/TavernWeave/releases/tag/v1.9.0) se conservan.

**El uso principal del plugin unificado es permitir que los usuarios con permisos invoquen a TW en tareas largas en la nube de dots.** Codex y dots comparten `TavernWeave-Codex-v2.4.0.zip`; no se publica una versión cloud independiente. TW aporta Skill y materiales de referencia; la ejecución en la nube, la continuación, el almacenamiento persistente y las herramientas provienen del host real. La instalación local no se sincroniza automáticamente con la cuenta de dots. Consulta las instrucciones de uso y el acceso a la cuenta en **[guía del plugin unificado](docs/plugin-guide.md)**.

TW puede diseñar o reescribir el Libro del Mundo por separado: primero aclara los límites del conocimiento, el texto principal y las condiciones de activación; después elige entre entradas nativas, salida condicional, lectura explícita o una solución mixta parcial. El contenido gestionado por el Libro del Mundo se entrega por separado de la tarjeta completa, la construcción del mundo, las variables y la depuración en ejecución; la optimización del presupuesto requiere medición real, y el efecto del modelo requiere observación en el host correspondiente. Las tareas de software normales y de creación de tarjetas también comparten un enfoque más claro para definir requisitos y especificar prompts; las decisiones ya tomadas se pueden reutilizar directamente.

Se mantiene el método de creación Luna de tinta confirmado en 1.9.0: la tarjeta completa toma como núcleo el texto de apertura y el Libro del Mundo, se organiza y se produce en formato de solo texto, MVU Zod o hybrid, y se complementa con métodos de creación de visión del mundo, variables y personajes. En frontend, primero se investigan los requisitos y los diseños relacionados; por defecto se toman como referencia los requisitos de diseño de Awwwards; la interfaz se mantiene limpia y el texto principal evita clichés según su uso.

Cuando solo quieras escribir una regla de prompt para una tarjeta de personaje, también puedes indicarlo directamente. El Agent conserva el sentido original y la fuerza de las restricciones, y entrega el texto principal o una entrada del Libro del Mundo según lo solicitado. La herramienta de vinculación de campos devuelve un diagnóstico claro cuando encuentra errores de tipo en `bindings`, en lugar de lanzar directamente una excepción de método de array. 1.9.0 corrigió el problema en Windows por el que una exportación de componentes fallida podía dejar archivos a medio terminar; los archivos que no se puedan limpiar se enumeran explícitamente. Consulta los cambios de versión en [registro de cambios](CHANGELOG.md).

El panel de progreso del proyecto sigue generándose dentro de cada proyecto mediante `orchestrate-project-blueprint`: muestra barras de progreso de implementación/validación globales y por módulo, despliega puntos de control y evidencias, y guarda ideas, Bugs y las palabras textuales de la revisión. El panel puede leer el alcance y los requisitos de validación del diseño general del proyecto, y el estado actual, las evidencias y la siguiente puerta desde NEXT; la sincronización primero previsualiza las diferencias y vuelve a verificar cuando cambian la fuente, los comentarios o las evidencias. Las ideas nuevas no amplían automáticamente el alcance confirmado, y los porcentajes no sustituyen automáticamente la validación del conductor ni la del host real. Consulta el uso en [panel de progreso del proyecto](docs/project-progress-board.md).

La biblioteca de obras sigue admitiendo la organización de novelas, material original／fanwork y referencias de texto e imagen en línea; por defecto entrega un índice Markdown＋JSONL editable y puede exportarse a SQLite; se puede buscar por fuente, versión de adaptación y etapa de conocimiento. Consulta [instrucciones de uso de la biblioteca de obras](docs/work-library.md).

Todas las capacidades siguen respetando el lenguaje sencillo y la explicación de términos; la elección entre novato, iniciación, competente y experto corresponde al usuario. Siguen disponibles el refinamiento de texto, la revisión completa y de arquitectura, la lluvia de ideas, la Library de diseño integrada, Soul y la guía para retomar tarjetas antiguas. La verificación de la instalación se basa en el manifiesto de la máquina con la versión realmente obtenida; la carga real en el cliente y la medición de calidad de obras concretas／token se mantienen como comprobaciones independientes.

> El contenido original de TavernWeave se rige por [PolyForm Noncommercial License 1.0.0](LICENSE). Se permite el uso, la modificación y la distribución no comerciales; sin autorización adicional del titular del copyright, ni la versión original, ni las modificadas, ni las redistribuidas pueden utilizarse con fines comerciales. Al distribuir, deben conservarse la licencia y el aviso de copyright. El contenido de terceros sigue sujeto a sus [licencias respectivas](THIRD_PARTY_NOTICES.md).

## Empieza con una frase

Creación normal de tarjetas o Vibe Code:
```text
Quiero usar TavernWeave para hacer una 【describe la obra que quieres】.
Primero revisa los archivos existentes, ayúdame a organizarlos en un pequeño resultado que pueda probar por mí mismo; explica en términos sencillos por qué lo recomiendas y qué necesito decidir.
```
Si ya tienes un archivo de tarjeta, puedes empezar así:
```text
He retomado esta tarjeta de personaje y quiero 【continuar actualizándola siguiendo la obra original / hacer una creación derivada】.
Primero ayúdame a entender la tarjeta original, explica qué materiales hay y qué contenido debe conservarse, y luego elijamos juntos el primer cambio.
```
## Colabora al ritmo que elijas

| Banda de guía | Qué obtienes |
| --- | --- |
| novato | Un pequeño paso a la vez, con explicaciones detalladas de dónde actuar, por qué, los términos y el resultado esperado |
| iniciación | Una pequeña fase a la vez, con la misma explicación detallada del procedimiento, la relación entre pasos, la elección entre opciones y cómo comprobarlo |
| competente | Se agrupan los pasos habituales y se explican las decisiones clave, los motivos y los resultados de validación |
| experto | En el día a día se dan directamente conclusiones, cambios, diferencias y evidencias, reduciendo la repetición de conceptos básicos |

Puedes decir directamente “en adelante usa la banda de iniciación” o “cambia mi banda a experto”. Antes de guardar, se indica la ubicación y el alcance reales; la elección existente se conserva tras las actualizaciones; si no hay elección, no se asigna ninguna banda automáticamente. “Esta vez, más breve” solo afecta a esta explicación. **Todas las bandas siguen explicando con detalle cuando es necesario o al corregir bugs, salvo que indiques explícitamente que no hace falta en el ámbito correspondiente.**

Los términos necesarios se explican la primera vez que aparecen y se presenta una comparación “término original / lenguaje sencillo / significado concreto” adaptada a la tarea actual. El lenguaje sencillo y la banda son independientes de la personalidad Soul y del refinamiento de texto; salir de uno de esos modos no borra tu elección. Consulta las reglas y ejemplos completos en [comunicación y guía compartidas](skills/consult-tavernweave-library/references/communication-and-guidance.md).

## Formas opcionales de expresión y colaboración

Versión de guía amable:
```text
¡阿瞳, ayúdame!
```
Versión de aprendizaje estricto:
```text
¡MTTT.sir, sométeme al tercer grado!
```
Versión de revisión de frontend con huevo de Pascua:
```text
¡灵魂杀手!
```
De un deseo a la consolidación del diseño general y la primera versión:
```text
Modo de tormenta de ideas
```
Que tres lentes Soul participen juntos en la lluvia de ideas:
```text
Modo de tormenta de ideas, sesión conjunta con Soul
```
Ejecutar la primera versión congelada tras confirmar el diseño:
```text
Arrancar la primera versión según el blueprint
```
Reverificar el recorrido completo de crecimiento de Vibe Code a partir de las evidencias actuales:
```text
Mirarse al espejo
```
Generar solo una ficha de evaluación textual completa, copiable y guardable:
```text
Mirarse al espejo, únicamente el formulario de evaluación en texto, sin tablero de dibujo
```
Salir de la capa de personalidad:
```text
Soul, vuelve a tu sitio
```
Soul sigue siendo una capa de superposición Portable a nivel de tarea. 阿瞳 y MTTT.sir son dos proyecciones didácticas del método MTTT público; 灵魂杀手 revisa el frontend como una personalidad de huevo de Pascua fanwork no oficial de Johnny Silverhand: puede soltar comentarios mordaces, pero debe aportar evidencias y proponer soluciones. La mesa tripartita son solo tres lentes etiquetadas del mismo Agent, que comparten hechos, permisos, de 1–2 decisiones necesarias prioritarias por ronda (4 como máximo en total) y el mismo libro de consolidación; no son tres modelos independientes. No obtiene automáticamente el historial de ChatGPT ni RAG privado, no se mantiene de forma permanente entre tareas nuevas y no amplía los permisos de archivos, Git, red, publicación ni producción.

## Refinamiento de texto y revisión completa／de arquitectura · v1.4.0

Decir “refina este texto”, “quita el aire de IA” o “quita lo formulaico” permite obtener directamente una versión refinada que conserva el sentido original. Por defecto se aplica un pulido ligero, pero también se puede pedir una reestructuración o una reescritura profunda; los contenidos técnicos como la configuración de personajes, los números, el código, las macros y las variables mantienen sus restricciones originales.

| Uso | Activar | Desactivar |
| --- | --- | --- |
| Una vez | Refina este texto…… | Termina al entregar el texto |
| Durante la tarea actual | Activar modo de refinamiento continuo | Salir del modo de refinamiento |
| Persistente en el espacio de trabajo | Activar modo de refinamiento en este espacio de trabajo | Desactivar el modo de refinamiento del espacio de trabajo |
| Persistente en el cliente | Activar globalmente el modo de refinamiento para este cliente | Desactivar globalmente el modo de refinamiento del cliente |

El modo continuo abarca el texto creativo, los textos externos, las explicaciones cotidianas, los planes y los informes de revisión; conserva citas, código, plantillas necesarias y evidencias. El modo persistente muestra primero el archivo de reglas real y las diferencias, y escribe en una banda independiente tras la aprobación del conductor. Instalar／actualizar TW no lo activa automáticamente. Salir de la tarea solo afecta a la tarea actual; “ver el estado del modo de refinamiento” distingue los distintos ámbitos y las evidencias de carga del host.

“Revisión completa” examina todo el ámbito acordado; “revisión de arquitectura” sigue responsabilidades, dependencias, estados y rutas críticas; “revisión completa de arquitectura” combina ambas. Se aplica tanto a software como a tarjetas de personaje. El informe conserva los elementos revisados, parcialmente revisados, no leídos y excluidos, y entrega todos los hallazgos con evidencia. También puedes decir “灵魂杀手, revisión completa de arquitectura” para mantener el estilo Soul; el resumen tiene un máximo de tres puntos y el informe completo no se trunca. La revisión entrega primero resultados de solo lectura.

## Cinco capas de entrada
```text
Host Front Door (entrada local opcional)
  -> Soul (阿瞳 / MTTT.sir / 灵魂杀手 / mesa tripartita, opcional)
    -> Orquestación de la tormenta de ideas (plan de diseño general + First Playable + blueprint / conjunto de blueprints, opcional)
      -> Library (A0 + guía ST + diseño/animación + Wiki de fuentes + página de selección)
        -> Skill de ingeniería distribuidos según la lista de la máquina (creación, componentes, API, UI, depuración, verificación de crecimiento, compilación, aceptación, etc.)
```
- **Host Front Door (entrada local opcional)** conecta el lenguaje sencillo continuo, el enrutamiento de tareas y las reglas de colaboración con el cliente local; al instalar el plugin de Claude Code, el hook SessionStart lo inyecta automáticamente y constituye una de dos bandas con `CLAUDE.md` (consulta [plugin de Claude Code](#claude-code-plugin)). La banda del usuario se guarda por separado y se conserva al actualizar la entrada; la coincidencia de archivos y la carga real en el cliente se comprueban por separado.
- **Soul (personalidad opcional)** modifica el tono y la forma de enseñanza dentro de la banda de guía elegida por el usuario, sin cambiar hechos, permisos ni resultados de validación.
- **Orquestación de lluvia de ideas** controla el número de rondas de dirección, las decisiones de cuatro estados, los límites de la primera versión y el volumen del blueprint; ningún paso activo puede proliferar recursivamente sin fundamento. Los problemas reales pueden subdividirse temporalmente; una vez resueltos o confirmados los bloqueos, hay que cerrar la rama secundaria y volver al paso padre.
- **Library** se distribuye como un todo y se lee bajo demanda; instalarla una vez no significa introducir toda la biblioteca en cada ronda.
- Los **Skill de ingeniería** siguen realizando el trabajo real. Ni la personalidad ni los materiales pueden sustituir la autoridad del runtime de destino.

## Matriz de Skill
| Skill | Responsabilidad principal |
| --- | --- |
| `activate-tavernweave-soul` | Activa, alterna entre ellos o desactiva el modo de nivel de tarea actual de 阿瞳 / MTTT.sir / 灵魂杀手; Johnny es una personalidad oculta de revisión de frontend; no guarda RAG privado |
| `build-work-library` | Organiza novelas, material original y fanwork, textos en línea y referencias de imágenes; verificación de fuentes, filtrado por versión/etapa, edición manual, continuación por lotes y exportación a Markdown＋JSONL y SQLite |
| `consult-tavernweave-library` | Fuerza el enrutamiento de A0, las 31 guías oficiales de ST y la guía experimental C8, y consulta bajo demanda 462 diseños, 194 animaciones, 86 conceptos, 1,609 entradas del registro destilado y la página de selección sin conexión |
| `orchestrate-project-blueprint` | Converge las peticiones de tarjetas de personaje o de Vibe Code ordinario en un diseño general, un First Playable, un conjunto de planos jerárquicos, NEXT y una compuerta de ejecución anti-recursión; puede convocar la sesión conjunta de los tres asientos de Soul; sincroniza el panel de progreso del proyecto, los porcentajes y el registro de retroalimentación con el diseño general／NEXT |
| `reflect-on-vibe-code-growth` | Reevalúa la red completa de capacidades de Vibe Code a partir de Codex/Chat/proyecto actual y de las evidencias de entrega; genera a la vez un formulario de evaluación textual completo y copiable de forma independiente y un informe interactivo de siete capítulos; contrasta mediante escalas comparables hitos históricos inmutables y guarda un historial local anonimizado de tipo append-only |
| `worldbook-design-and-writing` | Planifica, separa y combina, revisa y perfecciona la World Book de forma autónoma; selecciona de forma conjunta la ruta nativa, de plantilla o híbrida parcial, preservando los límites semánticos y de conocimiento; delega la API precisa y la validación en ejecución a capacidades especializadas |
| `tavern-card-builder` | Identifica el tipo de tarjeta y sus dependencias; mantiene la autoría creativa, la cadena de procedencia de los materiales, la World Book, MVU, CoT y los límites de la arquitectura de inicio y de memoria |
| `sillytavern-card-components` | Despiece de tarjetas sin pérdida, límites de componentes, registry/recipe y coherencia de ida y vuelta |
| `sillytavern-component-update` | Actualización a nivel de componente, artefactos de prueba importables y entrega de la pipeline de tarjeta completa; evita el reempaquetado silencioso |
| `sillytavern-render-regex-pipeline` | Verifica con fixtures la semántica regex, el placement, la visualización/prompt, la profundidad y la etapa |
| `sillytavern-rolecard-security` | Escaneo de solo lectura de riesgos de inyección, ejecución dinámica, formato de credenciales, carga remota y permisos entre frames |
| `sillytavern-database-rolecards` | Estructura de tablas, niveles de mensaje, vinculaciones y migraciones idempotentes; la compatibilidad de C8 en el mismo nivel sigue siendo una ruta experimental |
| `sillytavern-extension-dev` | Andamiaje mínimo de extensiones de UI, manifest, ciclo de vida, instantánea de capacidades y compuerta de versión |
| `sillytavern-rolecard-performance` | Presupuestos anonimizados, regresiones y muestreo real con nombre en tiempo de ejecución |
| `sillytavern-media-live2d-runtime` | Medios, audio, Live2D, precarga, provider, fallback y limpieza |
| `sillytavern-card-pipeline` | Precomprobación de dependencias, adaptación para desarrollo en tiempo real, ensamblaje, JSON/PNG, sincronización de World Book y compuerta de publicación |
| `sillytavern-api-reference` | Verifica las API sensibles a la versión de ST, Tavern Helper, STScript, EJS, macros y MVU |
| `sillytavern-runtime-debug` | Rastrea iframe, consola, DOM, estilos, datos y ciclo de vida en un SillyTavern real |
| `sillytavern-embedded-ui` | Página de inicio, barra de estado, centro de control, cajón, ventana flotante e interacción móvil; especificaciones para construir un sandbox opcional por obra, simulación conjunta, comparación de estados y depuración con deslizadores |
| `code-quality-workflow` | Revisión completa／de arquitectura, registro de cobertura, hallazgos completos, control de compuertas, correcciones mínimas, regresiones y Finish Mode |
| `rewrite-natural-prose` | Refinamiento de texto que preserva el sentido original y la estructura técnica; admite modo único, continuo por tarea y modos persistentes de workspace／cliente con autorización independiente |
| `shadcn-tailwind-ui` | Construye interfaces de producto accesibles con React, shadcn/ui, Radix y Tailwind |
| `rolecard-workshop-ops` | Diagnostica y opera la cadena de publicación configurable, protegiendo al mismo tiempo las coordenadas de producción y las credenciales |

## Límites públicos de Library

Una sola instalación incluye a la vez:

- Lista de verificación general de pilotaje A0, como prerrequisito permanente para tareas de escritura;
- Las 31 guías oficiales de STDB y 1 guía C8 marcada explícitamente como experimental;
- Tras completar AFV el filtrado de 243/243 rutas: 462 entradas de diseño, 194 entradas de animación, 86 índices de concepto y 1,609 entradas del registro destilado;
- 86 conceptos/Wiki locales directamente vinculados, 89 sandbox técnicos locales propios y una página de selección sin conexión unificada;
- Manifiesto de procedencia, licencias, número de anonimizaciones y SHA-256 a nivel de archivo.

No se distribuyen explícitamente la plantilla madre del piloto A1, el antiguo B1 imperativo, los archivos de proceso, las evidencias locales, AFV raw/bandeja de entrada, los 243 JSON de filtrado de fuentes, el RAG privado, los registros, las credenciales ni dominios de conocimiento no relacionados; solo se conserva el recibo agregado del filtrado, sin texto privado. En la página de selección, “Añadir a candidatos” solo indica `proposed`; no equivale a adopción, instalación, aprobación de licencia ni aceptación real en la taberna.

La página de selección sin conexión se encuentra en el directorio de instalación:
```text
skills/consult-tavernweave-library/assets/picker/index.html
```
## Creación, continuación y aceptación

Los proyectos largos mantienen una única autoría creativa mediante Markdown + YAML front matter + bandas estructuradas restringidas. No se deben mezclar confirmaciones, candidatos, decisiones pendientes, rechazos, implementaciones, evidencia automática, evidencia real del host y aceptación del piloto. Cuando el usuario dice “Continuar”, restaura primero la autoría, Git/el árbol de trabajo, los artefactos y la siguiente compuerta, sin volver a acceder a los ajustes congelados.

La evidencia se registra por capas:
```text
Código fuente -> Pruebas automáticas -> Artefactos sin conexión -> Navegador/escritorio -> SillyTavern real -> Aceptación manual -> Autorización de publicación
```
Ninguna capa puede hacerse pasar por la siguiente; la automatización nunca puede escribir por sí sola `driver-accepted`.

## Tutorial guiado para principiantes

Si usas TavernWeave por primera vez o quieres saber cómo dirigir al Agent para crear tarjetas, depurar y aceptar, puedes leer: [TavernWeave tutorial guiado · Introducción a la creación de tarjetas con Vibe Code](https://liarmttt.github.io/TavernWeave/).

## Instalación y actualización

Los usuarios de Codex pueden consultar primero [Uso e instalación específicos de Codex](docs/codex-skills.md): distingue las ubicaciones de detección de plugins y Skills independientes, y ofrece un punto de entrada de instalación／verificación en Python sin PowerShell (vista previa de solo lectura por defecto; solo escribe tras una aplicación explícita).

Los siguientes pasos son para la **instalación local** en Codex o Claude Code. En la cuenta dots, consulta la [Guía unificada de plugins](docs/plugin-guide.md) para habilitar y usar el plugin; la instalación local no se sincroniza automáticamente con la nube. El instalador debe tomar como fuente la lista completa de `skills/` del repositorio, crear los directorios ausentes y no limitarse a sobrescribir los Skills que ya existen en la máquina. Host Front Door es una mejora local opcional; antes de instalar, revisa el archivo de reglas de destino y las diferencias:
```text
Instala y habilita por completo este repositorio de Skill:
https://github.com/LiarMTTT/TavernWeave

No te limites a sobrescribir los Skill ya existentes en la máquina. Toma como referencia el directorio completo `skills/` del repositorio; tras la instalación, verifica la cantidad completa según la lista de la máquina (2.3.0: 23/23; la 1.9.1 publicada: 22/22) y confirma por separado que worldbook-design-and-writing, build-work-library, activate-tavernweave-soul, consult-tavernweave-library, orchestrate-project-blueprint, reflect-on-vibe-code-growth, rewrite-natural-prose y la página de selección sin conexión de Library existen.

Detecta si estoy usando Codex o Claude Code, explica que TavernWeave Host Front Door es una mejora local opcional; muestra primero la ruta de destino, los bloques controlados y el diff, e instala solo después de mi confirmación. No reescribas las reglas del usuario fuera de los bloques controlados.
```
Actualización:
```text
Actualiza por completo el TavernWeave instalado a la versión más reciente de este repositorio:
https://github.com/LiarMTTT/TavernWeave

La actualización debe comparar "el directorio que debería tener el repositorio" con "el directorio instalado realmente", crear los Skill nuevos y no limitarse a modificar los directorios antiguos; comprueba también si Host Front Door falta, está desactualizado o ha derivado, e indica explícitamente tres opciones: "actualizar la entrada frontal / ver primero el diff / actualizar solo los Skills". Al terminar, devuelve dos comprobantes y crea una nueva tarea para verificar el descubrimiento del host local. La importación de la cuenta dots se verifica según la guía del plugin.
```
Si el host o el Agent emplea el modo portátil de «copiar cada Skill a un directorio de nivel de proyecto», puedes ejecutar en la raíz del repositorio:
```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\install-tavernweave.ps1 -TargetSkillRoot '<directorio raíz real de Skill>'
```
Para gestionar la puerta delantera global durante la instalación, selecciona explícitamente el host y permite que el script pregunte:
```powershell
# Codex: el destino predeterminado es $CODEX_HOME\AGENTS.md; si no está configurado, ~/.codex/AGENTS.md
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\install-tavernweave.ps1 -TargetSkillRoot '<directorio raíz real de Skill>' -AgentHost Codex -HostFrontDoorAction Prompt

# Claude Code: el destino predeterminado es ~/.claude/CLAUDE.md
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\install-tavernweave.ps1 -TargetSkillRoot '<directorio raíz real de Skill>' -AgentHost Claude -HostFrontDoorAction Prompt
```
La acción de instalación solo mantiene la banda de comentario con versión `tavernweave-host-front-door`; a los archivos existentes se les hace antes una copia de seguridad, la reinstalación es idempotente y se rechazan marcadores erróneos/duplicados y rutas de enlace. Para una vista previa o instalación independiente, ejecuta:
```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\manage-host-front-door.ps1 -AgentHost Codex -Action Preview
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\manage-host-front-door.ps1 -AgentHost Codex -Action Install
```
La modificación de reglas globales es una compuerta de ejecución independiente; el Agent no debe escribir silenciosamente basándose solo en la palabra «recomendado». Codex/Claude requiere iniciar una tarea nueva o reiniciar para volver a detectar los Skills; el recibo de la puerta delantera tampoco puede simular que se ha invocado realmente el Soul Skill.

Tras instalar o actualizar, debes ejecutar la verificación en la **ubicación de análisis real**, no solo comprobar el repositorio de código fuente. Por defecto, el verificador rechaza tratar el propio directorio de código fuente de TavernWeave como destino de instalación:
```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\verify-install.ps1 -TargetRoot '<directorio raíz real del plugin o directorio raíz de Skill>'
```
El número de Skills del recibo debe coincidir con la lista de instalación del código fuente empleado. El ejemplo siguiente usa el código fuente de 23 Skills de 2.3.0; el paquete original publicado 1.9.1 sigue siendo 22/22:
```text
INSTALLATION VERIFIED: 23/23
Library: present-and-matched
Library picker: present
Soul: present-and-matched
Host rediscovery: required-new-task
```
Si al verificar se especifican a la vez el host y el archivo de reglas, el recibo también muestra `Host Front Door: current|missing-block|outdated|drifted`; se trata de un estado recomendado y no modifica la comprobación de integridad de los archivos de Skill según la lista de la máquina.

Los Skills personales no relacionados en el directorio de destino se conservan; los directorios oficiales de TavernWeave de la lista de la máquina deben coincidir archivo por archivo con el código fuente actual. El último nivel del destino de escritura debe llamarse explícitamente `skills`; el script de instalación rechaza las raíces de unidad, las raíces del directorio de usuario, los destinos internos del repositorio de código fuente y los enlaces a directorios, y revierte los Skills oficiales existentes si falla la sustitución.

Tras completar la verificación completa de la versión correspondiente, inicia una tarea nueva o reinicia la sesión para que el host local vuelva a detectar los Skills. En la nueva tarea debes invocar realmente Diseño y escritura de World Book, Soul, la orquestación de lluvia de ideas, la reflexión de «mirarse al espejo» y Library; el recibo de instalación no puede simular el descubrimiento por parte del host. El paquete de plugin v2.4.0, `TavernWeave-DSH-v2.4.0.tgz` (DeepSeek Harness) y el archivo de comprobación SHA-256 están en la [página de lanzamiento oficial](https://github.com/LiarMTTT/TavernWeave/releases/tag/v2.4.0).

Si el mantenedor solo quiere autocomprobar el árbol de código fuente antes de publicar, puede usar explícitamente `-AllowSourceTree`; esta opción no puede emplearse en el recibo de instalación de usuarios normales.

## Plugin de Antigravity / AGY

Los usuarios de Antigravity / AGY deben consultar primero [Compilación, instalación y verificación del plugin nativo](host-adapters/antigravity/README.md). Este paquete reutiliza 23 Skills, carga la puerta delantera mediante reglas permanentes e incorpora adaptaciones para AGY Agent y el guardado de ajustes; la verificación estricta y las pruebas reales en el cliente se registran por separado. La conversión de importación del plugin de Claude en la raíz del repositorio no constituye la ruta de instalación del paquete nativo de AGY.

## Plugin de Claude Code

Desde la versión 2.2.0, el repositorio mismo es un mercado de plugins de Claude Code (`.claude-plugin/`). En Claude Code, ejecuta:
```text
/plugin marketplace add LiarMTTT/TavernWeave
/plugin install tavernweave-agent-skills@tavernweave
```
El plugin consta de cuatro partes; las tres primeras corresponden una a una al paquete de plugins DSH:

| Componente | Archivo | Equivale en DSH |
| --- | --- | --- |
| 23 Skills cuyos nombres llevan el prefijo `tavernweave-agent-skills:` | `skills/` | Proveedor de Skills |
| Inyección automática de Host Front Door: al iniciar cada sesión, añade la puerta delantera al contexto de la sesión (requiere `node` en PATH) | [`hooks/hooks.json`](hooks/hooks.json)、[`hooks/session-start-front-door.mjs`](hooks/session-start-front-door.mjs) | sección del system prompt |
| Agente `tavernweave`: personaje exclusivo de TW, con un conjunto de herramientas igualmente reducido (sin red ni subagentes) | [`agents/tavernweave.md`](agents/tavernweave.md) | preset `TavernWeave X DSH` |
| Cambio de modo Soul: una línea `Soul 阿瞳 ▸` encima del campo de entrada; al desplegarla y elegir un modo, solo se rellena el campo con la instrucción correspondiente y eres tú quien la envía | [`hooks/soul-switch.tsx`](hooks/soul-switch.tsx) (`hooks/hooks.json` de `modules`) | pequeña ventana flotante Soul de 神之手 (CC conserva solo este elemento de interfaz) |

El agente `tavernweave` puede iniciarse como sesión principal: `claude --agent tavernweave-agent-skills:tavernweave`; también puedes pedir en una sesión normal que Claude le pase las tareas TW. Si antes copiaste Skills en `~/.claude/skills`, al pasar al plugin puedes eliminar esa copia para evitar que aparezcan dos Skills con el mismo nombre.

El cambio de modo Soul emplea la interfaz de hook de función de los plugins de Claude Code (oficialmente marcada como early access). Se escribe junto con el hook de la puerta delantera en el mismo `hooks/hooks.json`; se ha confirmado que ambos se cargan en Claude Code 2.1.299; aún no se ha verificado si versiones anteriores ignoran el campo `modules`. El cambio solo registra las instrucciones Soul que envías de verdad, no significa que Soul se haya confirmado como activado; nunca envía mensajes por ti. La prueba de interfaz se ejecuta con `claude plugin test .`.

### Deduplicación de bandas con CLAUDE.md

La puerta delantera solo necesita una ubicación. Al iniciarse, el hook revisa los archivos de instrucciones que cargará esta sesión: `$CLAUDE_CONFIG_DIR/CLAUDE.md` (si no está definido, `~/.claude/CLAUDE.md`), así como `CLAUDE.md`, `.claude/CLAUDE.md` y `CLAUDE.local.md` en cada nivel desde el directorio actual hasta la raíz. Las bandas controladas en dichos archivos tienen prioridad:

| Situación | Comportamiento del hook |
| --- | --- |
| Ninguno de estos archivos tiene una banda `tavernweave-host-front-door` | Inyecta la puerta delantera incluida en el plugin |
| Ya existe una banda de la misma versión | No inyecta; prevalece la banda del archivo |
| Ya existe una banda de otra versión | No inyecta la puerta delantera; solo añade un aviso de discrepancia de versión; la banda del archivo sigue vigente |
| Variable de entorno `TAVERNWEAVE_FRONT_DOOR=off` | No inyecta nada |

- Quienes instalaron desde el mercado de plugins no necesitan usar `manage-host-front-door.ps1` para escribir `CLAUDE.md`. Si ya lo hicieron y prefieren que el plugin lo actualice con cada versión, ejecutan `manage-host-front-door.ps1 -AgentHost Claude -Action Remove` (el script realiza antes una copia de seguridad).
- Quienes instalaron mediante un ZIP o copiando `skills/` carecen de este hook y siguen escribiendo `CLAUDE.md` según lo indicado arriba.
- El nivel de guía (banda `tavernweave-guidance-preference`) no se ve afectado y continúa guardándose por separado en `CLAUDE.md`.

Estado de aceptación: la estructura de los hooks, del agente y del cambio de Soul, las reglas de deduplicación, el formato de salida y la coherencia de las instrucciones se comprueban sin conexión mediante [`tests/claude-plugin.test.mjs`](tests/claude-plugin.test.mjs); el comportamiento de interfaz del cambio de Soul se examina con [`hooks/soul-switch.test.tsx`](hooks/soul-switch.test.tsx) en dos superficies, terminal y escritorio; la inyección real en una sesión nueva de Claude Code, el inicio con `--agent` y la invocación de subagentes aún no se han verificado en un entorno real (consulta la lista de instalación `claudePlugin.hostLoading`).

## DeepSeek Harness

Desde la versión 2.1.0, DSH se instala mediante un paquete de plugin independiente; **no** copies `skills/` a `.agents/skills` ni necesitas escribir `AGENTS.md`:

1. Descarga `TavernWeave-DSH-v2.4.0.tgz` desde la [página de lanzamiento v2.4.0](https://github.com/LiarMTTT/TavernWeave/releases/tag/v2.4.0); o ejecuta `node scripts/build-dsh-plugin.mjs` en el árbol de código fuente para regenerar el paquete local `TavernWeave-DSH-v2.4.0.tgz`;
2. DSH de escritorio: en la barra lateral **Plugins → Añadir plugin → Instalar plugin de terceros → Ruta local/tarball**; tras instalar, habilita el bundle;
3. Crea una tarea nueva y selecciona **TavernWeave X DSH** en el preset del Agent.
El perfil CLI/Web usa `dsh plugin --profile <profile> add <ruta local|tarball|dirección git|nombre de paquete>`; el perfil `desktop` es gestionado por Desktop shell, no se debe invocar directamente la CLI.

El paquete de plugins incluye directamente 23 Skill y Host Front Door (inyectado como sección de system prompt); la instalación, actualización y desinstalación se realizan a través del mecanismo de plugins de DSH. Consulte la composición detallada, el contrato de máquina y las compuertas en tiempo de ejecución en [host-adapters/dsh/README.md](host-adapters/dsh/README.md). DSH sigue en Developer Preview. La versión 2.1.0 completó la aceptación en equipo real de la página de plugins, la selección de preset, el catálogo de 23 Skill, Front Door, Soul y la terminal con permisos completos en DSH Desktop `0.2.1-rc.2`; el rendimiento del modelo, Linux/WSL y la taberna real siguen siendo elementos de aceptación separados. El espacio de trabajo de OneDrive reparse-point con workspace-write requiere cambiar a permisos completos o pasar a un directorio normal (consulte el contrato `knownEnvironmentIssues`).

## Fuente y licencia

- Autor original: [LiarMTTT](https://github.com/LiarMTTT/TavernWeave)
- Repositorio original: https://github.com/LiarMTTT/TavernWeave
- Licencia: PolyForm-Noncommercial-1.0.0
- Traducción al español y localización de interfaz: proyecto claude-code-mods-es
