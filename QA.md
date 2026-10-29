# SENDAS 1.3.1 — Informe de pruebas reales (29/10/2026)

## Verificación ejecutada en esta entrega

- **Integridad estática:** 47 referencias estáticas y 37 imágenes WebP. Se comprobaron existencia, lectura y decodificación de todos los WebP incluidos y referencias del Service Worker.
- **Sintaxis:** `node --check` sobre `game.js`, `mobile-ux.js`, `sw.js` y, en 1.4, `ambient.js`, todos sin errores.
- **Navegador real:** Chromium de sistema ejecutó una secuencia de clics y acciones hasta completar las tres misiones esenciales: cuerda y red de Jonás; recolección y entrega a Irit; manuscrito y manantial.
- **Interfaz táctil:** se abrió el visor de imágenes, se amplió y se cerró; se comprobaron los controles de acciones.
- **Conservación:** la partida guarda el esquema `version: 1` y la clave histórica `sendas_cronicas_ilustrada_1`.
- **Sin errores JS:** el navegador no notificó excepciones JavaScript en las rutas ensayadas.
- **Responsive:** inspecciones automatizadas de 360×640, 390×844, 800×1280 y 1365×768 sin desplazamiento horizontal.
- **Compatibilidad guardado (1.4):** partidas anteriores simuladas con 0, 1, 2 y 3 misiones superadas recuperan la etapa correcta; se verifica respaldo automático de estado anterior.
- **1.4:** las 18 variantes mantienen dimensiones idénticas a cada fotografía maestra y se verificaron los tres diálogos de seguimiento, un embarcadero alternativo y la entrada del diario «Un día en Galilea».

## Limitaciones

- Chromium bloqueó `file://` y `localhost` en este entorno. Se ejecutaron pruebas de interfaz con HTML, JS, CSS e imágenes embebidos, y se comprobó la estructura estática por separado. No es prueba directa del dominio GitHub Pages.
- No se ha probado físicamente en Android, iOS ni tabletas antiguas, ni se ha verificado una actualización offline real del Service Worker en dispositivo.
- Los estados de luz son fotometría sobre la **misma imagen**: mantienen identidad arquitectónica pero no constituyen nuevas escenas fotografiadas. No muestran todavía cambios complejos de actividad humana en la imagen.
- No se declara certificación arqueológica; los hechos documentados, hipótesis y ficción se distinguen en el cuaderno.

## Qué se conserva

- Tres misiones principales, decisiones, exportación/importación JSON, progreso, retratos y escenarios anteriores.
- La rama `releases/v1.3-vida-galilea` conserva la versión publicada anterior. También se publicará una rama separada para 1.3.1.
