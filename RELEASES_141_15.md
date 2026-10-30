# SENDAS — Entregas 1.4.1 y 1.5

## 1.4.1 · Continuidad visual

- Apertura en el interior de la vivienda de Natán, en lugar de la calle exterior.
- Nueva imagen de Natán leyendo una nota, con mobiliario e instrumentos domésticos adecuados al relato.
- Variaciones de luz del mismo archivo, sin modificar anatomía, rostro, manos, ropa o posición de los objetos.
- Matriz de continuidad de los 14 escenarios en `NARRATIVE_VISUAL_MATRIX.md`.
- Se conservan las tres misiones, el zoom y las partidas existentes.

## 1.5 · Los escritos del camino

- 14 documentos y recuerdos que Natán encuentra, examina y guarda.
- Los textos del juego se muestran como escritos del propio mundo; no como apartados de historia modernos.
- Registro de comercio de Mara, anotaciones sobre redes de Jonás, hierbas de Irit, rollo de Siméon, marcas del manantial y otros objetos.
- Las aclaraciones externas sobre reconstrucción y ficción se trasladan a la documentación técnica.
- Se evita atribuir a Jesús nuevas frases literales y se evita presentar evangelios escritos en torno al año 30.

### Compatibilidad

Las partidas existentes usan la misma clave `sendas_cronicas_ilustrada_1` y esquema `version:1`. Los escritos se guardan en `flags.doc_*`. Los cinco descubrimientos previos de oficios pueden recuperarse desde el nuevo diario.

### Revisión antes de desplegar

1. Sintaxis de todos los scripts (`node --check`).
2. Comprobar todos los archivos del Service Worker, incluidas las imágenes nuevas.
3. Probar apertura de documentos y 3 misiones principales en navegador real con interacción.
4. Comprobar 360 × 640 y 390 × 844, imágenes y hotspots.
5. Comprobar el progreso guardado anterior y exportación/importación.
6. Verificar GitHub Pages después del despliegue.

La versión de referencia 1.4 permanece en `releases/v1.4-mundo-vivo`; las mejoras se ensayan primero en ramas experimentales.