# SENDAS 1.1 - Informe QA (29/10/2026)

**Estado: refactor gráfico integrado, pruebas automáticas superadas, sin validación en hardware Android/iOS real.**

## Ejecución real

- `tests/test_full_chapter.py`: **21/21** comprobaciones superadas. Se completaron la red, pesca, plantas, manuscrito, manantial, ayuda al viajero y final del capítulo. Se verificó la recuperación del progreso y las pantallas móvil/tableta/escritorio.
- `tests/test_alternates.py`: **14/14** comprobaciones superadas. Hotspots, rutas bloqueadas, caza opcional, recursos consumidos, error en pistas, importación real de JSON, texto grande, ancho móvil pequeño y ausencia de errores JavaScript.
- `tests/test_premium.py`: **7/7** comprobaciones superadas sobre el HTML autónomo: cuatro escenas nuevas decodificadas, seis retratos en el diario, pan ilustrado y nueve recursos clave cargados.
- `tests/test_delivery.py`: **25/25** comprobaciones superadas: integridad ZIP, recursos y dependencias, accesibilidad de archivos mediante servidor Python HTTP, reconocimiento de una partida 1.0 y uso del nuevo epílogo.

**Total: 67 verificaciones superadas** (varias miden el mismo flujo desde ángulos diferentes, por lo que no representan 67 casos de juego distintos). No se detectaron errores JavaScript en las rutas ensayadas.

## Vista y recursos

- Se crearon e integraron 36 WebP. La ilustración de portada y la escena de Jesús usan recursos de 1536 x 1024 antes de optimización; los fondos extraídos de hojas de 2 x 2 tienen unos 760 x 500 píxeles. **No son archivos 4K nativos**: se busca un acabado cinematográfico de alta calidad adaptado a móvil.
- Capturas guardadas en `screenshots/`: portada, casa, aldea, muelle, curandera, colina y enseñanza, versión de 360 x 640, galería de rostros y epílogo nocturno.
- Se mantuvo una sola perspectiva narrativa y se abandonó el sistema de colisiones de los prototipos 0.x.

## Limitaciones honestas

- La navegación del Chromium automatizado a `localhost` está bloqueada por el entorno. Las interacciones de navegador se ensayaron con el HTML **completo embebido**, y la presencia/MIME de los archivos se comprobó por separado mediante HTTP de Python. No se simula que GitHub Pages haya sido publicado o abierto en el navegador.
- No se han probado gestos, rendimiento ni persistencia en dispositivos Android o iOS reales, ni en navegadores `content://` que pueden impedir `localStorage`.
- Los personajes comparten ficha y retratos coherentes, pero las escenas de fondo se generaron por separado: algunas caras secundarias aún pueden variar sutilmente. La fidelidad arqueológica no está certificada.
- Los fondos 2 x 2 se optimizaron para coste y peso; la siguiente iteración puede producir fondos de una sola imagen para mayor resolución sin cambiar el motor.

## Seguridad y preservación

- Sin dependencias remotas, IA integrada, anuncios ni recolección de datos.
- Clave de guardado compatible con la versión 1.0. Importación y exportación JSON preservadas.
- La 1.0 sigue disponible; la 1.1 se entrega de forma experimental y no se ha publicado en GitHub.
