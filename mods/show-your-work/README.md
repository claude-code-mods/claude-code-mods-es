# claude-show-your-work

> Traducción al español y localización de interfaz: proyecto claude-code-mods-es. README original en [README.en.md](README.en.md).

Claude muestra su trabajo en el chat cuando construye o modifica algo visual. También puedes pedirlo directamente: «dame cuatro direcciones para el hero de la portada y muéstrame en paralelo», «construye el formulario de registro, pruébalo y muéstrame la grabación».

- Grabaciones antes/después: la versión antigua y la nueva se graban con los mismos pasos y se reproducen sincronizadas en paralelo.
- Marcadores de cambio: cada modificación lleva su marca de tiempo; al hacer clic saltas al momento correspondiente.
- Comprobaciones en vivo: cada prueba se pone verde o roja cuando el vídeo llega a ese punto.
- Imágenes y vídeos: comparación paralela de varias propuestas, reproductor con línea de tiempo, cambio de versiones y guardado.

## Instalación

```
/plugin marketplace add https://github.com/iamumeransari/claude-show-your-work.git#releases
/plugin install show-your-work@iamumeransari
```

Compatible con Ghostty y kitty en macOS y Linux, requiere Claude Code 2.1.286+. Los vídeos/audios también necesitan ffmpeg, las páginas HTML Chrome/Chromium/Playwright y los PDF poppler.

## Fuente y licencia

- Autor original: [iamumeransari](https://github.com/iamumeransari/claude-show-your-work)
- Repositorio original: https://github.com/iamumeransari/claude-show-your-work
- Licencia: MIT
- Traducción al español y localización de interfaz: proyecto claude-code-mods-es
