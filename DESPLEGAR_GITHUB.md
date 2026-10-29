# SENDAS - Cronicas de Galilea - Edicion cinematografica premium v1.1

Juego HTML5 sin servidor ni dependencias externas. Compatible con GitHub Pages.

## Publicar por primera vez

1. Crear repositorio publico llamado `sendas-cronicas-de-galilea` en GitHub.
2. Subir todos los archivos y carpetas de este paquete a la raiz del repositorio (no el ZIP sin descomprimir).
3. En el repositorio: Settings > Pages > Build and deployment > Source: Deploy from a branch.
4. Branch: `main`, carpeta: `/ (root)`; guardar.
5. Visitar https://estebancaballeroai.github.io/sendas-cronicas-de-galilea/ cuando GitHub Pages haya terminado de publicar.

La URL indicada es la direccion prevista y no confirma que el sitio ya este publicado.

## Estructura

- index.html, styles.css, premium.css y game.js: motor del juego.
- assets/: escenas, retratos y objetos optimizados para web.
- sw.js y manifest.webmanifest: experiencia PWA/offline cuando se sirve en HTTPS.
- README.md, VISUAL_BIBLE.md, CHANGELOG.md, QA.md: documentacion de la version.

## Actualizaciones

Conservar una copia de la version anterior antes de sustituir archivos. Probar el juego publicado en movil y verificar que una partida guardada sigue siendo accesible.
