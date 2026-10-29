# SENDAS - Biblia visual 1.1

## Principio artístico

**Realismo cinematográfico premium, épico cuando lo exige el relato, histórico y cercano cuando la escena es cotidiana.** Estilo de fotografía narrativa con contraste alto pero legible, materiales bien definidos, profundidad atmosférica, luz volumétrica y paleta mediterránea. Evitar el aspecto de ilustración genérica, videojuego medieval, comic, fantasía, 2D pixelado o colage promocional.

Colores principales: piedra `#D7B48A`, ámbar `#DBA765`, cobre `#8E4F35`, oliva `#5D6847`, lago `#27516B`, sombra `#0D1A22`, lino `#EFE3CF`. No utilizar el atardecer naranja en todas las escenas: alternar mañanas azules, interiores en claroscuro, tardes cálidas y noches oscuras con puntos de luz.

## Escenarios

- Viviendas y patios: piedra irregular, muros de basalto/caliza, tejados planos, vigas, barro, tejidos, cerámica, madera sin barnizar.
- Lago: embarcaciones de madera de escala verosímil, redes de fibras naturales, orillas pedregosas, agua azul con brillos reales.
- Naturaleza: olivares, arbustos autóctonos, tierra seca, hierbas y animales, sin flora tropical fantástica.
- Lugares de enseñanza: multitud diversa con túnicas sencillas, sin aureolas, sin iconografía posterior ni efectos sobrenaturales no narrados en el Evangelio.
- Interfaz: negro azulado, acentos dorados discretos y tipografía serif de lectura fácil. Textos y botones **nunca incrustados en la imagen**.

## Fichas canónicas de personajes

| Personaje | Ficha visual | Función |
|---|---|---|
| Natán | 24 años aproximados, piel oliva, cabello oscuro rizado medio, barba corta, túnica de lino crudo, manto azul grisáceo gastado, bolsa de cuero | Protagonista ficticio, seguidor periférico de Jesús |
| Irit | Mujer madura de unos 55-60 años, cabello canoso parcialmente cubierto, manto de terracota, verde oliva y lino, rostro afable con arrugas | Curandera ficticia |
| Jonás | Pescador de 40-50 años, curtido por el sol, barba entrecana, turbante sencillo beige, tejidos gris tierra, manos de trabajador | Vecino ficticio del lago |
| Siméon | Escriba de unos 65-70 años, barba blanca, ojos observadores, manto marrón y lino, manuscritos | Testigo ficticio del pasado de Natán |
| Mara | Comercianta joven adulta, cabello oscuro, manto rojizo, expresión decidida | Personaje ficticio del mercado |
| Jesús | Representación artística no histórica: hombre judío del Levante, adulto, tez oliva, barba oscura, túnica sencilla de lino o lana, manto en tonos tierra | Maestro, nunca avatar controlable ni emisor de frases inventadas |

**Regla:** la misma cara y el mismo conjunto principal en retrato y escenas futuras. Crear fichas de frente, tres cuartos y perfil antes de ampliar capítulos. Nunca suponer que los retratos artísticos son fotografías reales.

## Arte realmente integrado

`assets/` contiene 36 WebP, `ASSETS_MANIFEST.json` identifica fuente, recorte, tamaño y hash. `tools/build_assets.py` y `tools/apply_upgrade.py` documentan la transformación de los atlas a imágenes del juego. En la release ZIP se incluyen los WebP optimizados; los grandes atlas originales permanecen en el espacio de trabajo.

## Referencias históricas y comparables

- Museo Yigal Allon (barca antigua del Kinneret): https://yigal-allon-centre.org.il/en/the-museum/the-ancient-boat/
- Vestimenta judía antigua: https://www.posenlibrary.com/guide/early-jewish-dress-and-adornment
- Referencias mecánicas ya estudiadas: *Heaven's Vault*, *80 Days*, *Pentiment*, *The Case of the Golden Idol*. Su arte no se reproduce.
