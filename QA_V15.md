# SENDAS 1.4.1 + 1.5 — Registro de validación

## Probado en esta sesión

- Chromium + Playwright: 4 resoluciones: 360×640, 390×844, 800×1280 y 1365×768, sin errores JavaScript en las rutas examinadas.
- Primera escena: interior de la casa de Natán, imagen integrada, botones de documentos operativos.
- Enigma encadenado: lectura en mercado, muelle y Siméon, ruta al manantial, respuesta incorrecta corregible, respuesta correcta y documento oculto accesible.
- Partida: state.codex.solved y coleccionables dentro del guardado; springSolved funciona independientemente del nuevo enigma.
- Sintaxis: ejecutados node --check de los nuevos módulos y del motor de prueba local.

## Pendiente

- Tests físicos en teléfonos Android/iOS y tabletas antiguas.
- Test automático del dominio público bajo HTTPS y del ciclo de actualización offline del service worker. Los tests locales de Chromium usan HTML embebido.
- Revisión arqueológica formal de todas las ilustraciones. Las notas del mundo son recursos narrativos, no traducciones de documentos originales.
