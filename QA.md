# SENDAS 1.3.1 — Control de calidad · 29/10/2026

## Resultados ejecutados en esta compilación

- **58 verificaciones de interacción aprobadas** con Chromium + Playwright, incluidas comprobaciones de botones y flujos (no equivalen a 58 partidas independientes). Se completó el capítulo I a través de sus tres misiones: reparación de la red, plantas para Irit, manuscrito y manantial.
- **60/60 verificaciones estáticas aprobadas**: existencia de recursos, scripts y hojas de estilo, caché, referencias y archivos esenciales.
- Resoluciones comprobadas: 390 × 844, 360 × 640, 800 × 1280 y 1365 × 768. No se observó desbordamiento horizontal.
- En las rutas probadas no aparecieron excepciones JavaScript.
- **1.3.1:** visor de imágenes, botón de ampliación y final de capítulo probados.

## Método y límites

Chromium bloquea el acceso directo a `localhost`, `file://` y dominios de prueba en este entorno. Las interacciones se ensayaron con el HTML y los recursos **incrustados en la página**, conservando el código JS y CSS real; el almacenamiento se simuló con una API `localStorage` de prueba.

**No probado físicamente:** rendimiento en tabletas Android antiguas, funcionamiento real de Service Worker/PWA sin conexión, gestos multitáctiles y persistencia en navegadores reales. La publicación en GitHub Pages deberá verificarse por separado.

**Rigor:** las variantes de tarde y noche son tratamientos de iluminación sobre fotografías artísticas existentes. Mantienen encuadres y rostros, pero no representan una reconstrucción arqueológica comprobada.

## Reproducibilidad

- `tests/qa_runtime.py`: necesita Python, Playwright, navegador Chromium y los activos del proyecto.
- `tests/qa_static.py`: necesita Python y Pillow.
- Resultados: `qa_results/QA_RUNTIME.json` y `qa_results/QA_STATIC.txt`.
