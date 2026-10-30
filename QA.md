# SENDAS 1.4.1 + 1.5 — validación

## Alcance

- 14 escenas y tres misiones principales preservadas.
- Apertura en interior, 4 variaciones de iluminación con una única geometría.
- 14 escritos recuperables sin textos modernos de arqueología o ficción en la interfaz.
- Compatibilidad de partida anterior mediante flags y la misma clave.

## Pruebas

El repositorio incluye un flujo GitHub Actions `sendas-test.yml` que ejecuta comprobaciones estáticas, sintaxis JavaScript, decodificación/consistencia de imágenes y recorrido completo con Playwright en Chromium. **No se declararán aprobadas hasta observar sus resultados.**

## Limitaciones

- La ejecución automatizada en Chromium no sustituye una prueba física Android/iOS.
- Las variantes de iluminación son la misma fotografía tratada, no escenas con personas reposicionadas.
- La fidelidad arqueológica se documenta por fuente en archivos técnicos, no en la UI.
