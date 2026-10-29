# SENDAS 1.3 — Informe de calidad (29/10/2026)

## Estado

**Verificaciones locales superadas.** Publicación y funcionamiento en un dispositivo físico pendiente de comprobación independiente. Este informe distingue resultados observados de aspectos aún no comprobados.

## Verificaciones realizadas

- **Ruta principal completa en Chromium con controles táctiles simulados:** 13 comprobaciones finales, incluidas las tres misiones, la nueva perspectiva de la aldea, cinco observaciones opcionales, la llegada a Jesús, el epílogo y ausencia de errores JavaScript detectados. Registro: `QA_RESULTS.txt`.
- **Cuatro resoluciones:** 360 × 640, 390 × 844, 800 × 1280 y 1365 × 768. Se verificaron la pantalla de inicio, el inicio de juego, la carga de imágenes, la ausencia de desbordamiento horizontal y de errores JavaScript; en móviles se verificó el acceso directo a las acciones.
- **Guardado:** probado con almacenamiento simulado en un contexto del navegador; una partida se conservó al volver a cargar el HTML de prueba. No se ha validado la persistencia real bajo el dominio de GitHub Pages ni en un teléfono físico.
- **Integridad estática:** 132 verificaciones técnicas automatizadas superadas, incluyendo existencia e integridad de cada WebP, manifiesto de imágenes, referencias de la caché, código JavaScript, fichas históricas, recursos esenciales y respuestas HTTP 200/MIME del servidor. Registro: `QA_STATIC_RESULTS.txt`. Muchas son verificaciones repetitivas por archivo, **no 132 partidas jugadas**.
- **Revisión visual manual:** inspección de capturas de 360 y 390 píxeles. El botón `Ver acciones` permite llegar al área de decisiones sin perder el espacio reservado a la ilustración.

## Restricción del navegador automatizado

Chromium bloquea la navegación directa a `localhost` y a nombres de dominio interceptados en este entorno (`ERR_BLOCKED_BY_ADMINISTRATOR`). Por eso las interacciones de Playwright se ejecutaron con el HTML completo y sus recursos incrustados como datos, mientras que los ficheros del sitio estático se comprobaron por separado mediante HTTP y hashes. **No se presenta esto como una navegación real por GitHub Pages.**

## Limitaciones conocidas

- No se ha probado en hardware Android/iOS ni en tabletas antiguas reales.
- No se ha verificado la instalación PWA ni la actualización de Service Worker con modo sin conexión real en el dispositivo.
- Los seis escenarios secundarios antiguos fueron limpiados, recortados y remuestreados. Su aumento de resolución no genera nuevos detalles fotográficos; la consistencia con los ocho fondos históricos de mayor resolución aún puede mejorarse.
- La historia no constituye una reconstrucción arqueológica certificada. El cuaderno histórico separa las evidencias, las hipótesis y la ficción para no confundirlas.
- Los puntos de interacción se recolocan al recortar la escena, pero es recomendable revisar sus anclajes manualmente en el dispositivo final.

## No regresiones previstas

- Las tres misiones principales permanecen inalteradas en su lógica de progreso.
- Se conserva la clave `sendas_cronicas_ilustrada_1` y el formato `version: 1` para partidas anteriores.
- Se conserva la importación/exportación JSON.
- La versión anterior de GitHub se preservará en una rama de respaldo antes de la actualización.
