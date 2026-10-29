# SENDAS - Crónicas de Galilea

**Edición cinematográfica premium 1.1 | Capítulo I: Los que escuchan**

Aventura narrativa cristiana para móvil y navegador, ambientada en una Galilea ficticia del siglo I. Natán es un seguidor de Jesús que no forma parte de los Doce. Explora 14 lugares mediante escenas interactivas, conversa, recoge plantas, pesca, repara una red, interpreta pistas y toma decisiones con consecuencias.

## Jugar

- **HTML local:** abrir el archivo `SENDAS_v1_1_CINE_PREMIUM_OFFLINE.html` en el navegador compatible del teléfono. No depende de servidores.
- **GitHub Pages:** extraer el ZIP de GitHub Pages y servir `index.html` desde la raíz del repositorio. Todos los ficheros son estáticos.
- Tocar las zonas luminosas o las acciones situadas bajo la escena. Hay pestañas de Rutas, Bolsa, Diario y Camino.
- Se guarda con `localStorage` cuando el navegador lo permite. Se conservó la clave de la versión ilustrada 1.0 para continuar partidas anteriores; también se pueden importar o exportar partidas JSON.

## Mejoras 1.1

- **36 recursos fotográficos originales integrados**: 14 lugares, una imagen de epílogo, portada, mapa, seis retratos y 13 objetos.
- Dirección artística única: Galilea histórica con profundidad cinematográfica, tonos piedra, azul de lago, oliva, ámbar y sombras azuladas.
- Natán, Irit, Jonás, Siméon, Mara y Jesús tienen fichas visuales coherentes; galería de personajes en el diario.
- Se corrigió la imagen del pan en el inventario.
- Tras el final, la escena de Jesús cambia a un campamento nocturno que marca la transición al próximo capítulo.
- Una interfaz cinematográfica más sobria, adaptada a pantallas móviles.

## Relación con las Escrituras

La historia y los diálogos ficticios no son citas evangélicas. La presencia de Jesús es central, sin convertirlo en personaje controlable ni atribuirle frases inventadas. Referencias de contexto: Lucas 8,1-3 y Mateo 5,1-12. La indumentaria, embarcaciones y materiales se inspiraron en bibliografía histórica, pero las imágenes **no son reconstrucciones arqueológicas certificadas**.

## Calidad y limitaciones

Se ejecutaron pruebas de ruta principal y secundaria con Playwright en Chromium, controles táctiles simulados, tamaños móvil/tableta/escritorio, importación y recuperación de guardado, y decodificación de recursos. Consulta `QA.md`.

Una restricción del entorno bloqueó la navegación del navegador automatizado a `localhost`: las pruebas de interfaz se ejecutaron sobre el HTML autónomo y se comprobó por separado el ZIP estático. **Pendiente:** prueba real en teléfonos Android/iOS, rendimiento en tabletas antiguas y publicación en GitHub Pages.

## Versiones

Esta carpeta es un proyecto experimental nuevo; no sustituye los archivos estables de la versión 1.0. Ninguna versión se ha publicado automáticamente.
