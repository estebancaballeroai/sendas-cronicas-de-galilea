# SENDAS 2.6 — Las voces de Magdala

## Vertical slice y promesa

**Género:** RPG narrativo de investigación y relaciones, sin combates. **Idioma:** español. **Protagonista:** Natán, discípulo ficticio (no es uno de los Doce). **Lugar:** puerto de Magdala, Galilea, hacia el año 30. **Duración del nuevo contenido:** depende de la lectura y las decisiones; no se promete una duración medida sin sesiones reales.

La premisa no es demostrar un fraude con una elección, sino confrontar cuatro tipos de indicios, distinguir testimonio, inferencia y prueba, y dejar que Yael decida qué hacer con la información que afecta a su familia. Ningún personaje ficticio habla en nombre de Jesús.

## Benchmark de sistemas (inspiración, nunca reproducción)

| Referente | Sistema observado | Adaptación original SENDAS |
|---|---|---|
| Pentiment (Obsidian) | Investigaciones sociales y consecuencias de acusaciones | Un relato apresurado a Yael puede herir confianza, pero no crea un culpable automáticamente |
| Roadwarden (Moral Anxiety Studio) | Entrevistas, observación del entorno y elecciones textuales | 2 testigos y objetos en un mismo espacio con bitácora persistente |
| Citizen Sleeper (Jump Over the Age) | Relojes de progreso y relaciones | Indicador de cuatro indicios, sin recursos artificiales ni temporizador punitivo |
| 80 Days (inkle) | Pequeñas rutas, decisiones y replayability | Alternativas de interpretación y respuesta que sobreviven al regreso al puerto |

Fuentes: https://www.obsidian.net/news/obsidian/obsidian-entertainment-announces-pentiment ; https://store.steampowered.com/app/1155970/Roadwarden/ ; https://store.steampowered.com/app/1578650/Citizen_Sleeper/ ; https://www.inklestudios.com/80days/ .

## Diseño narrativo

1. **Puerta del almacén** (`magdala3 → almacen26`): Neria y Asaf aparecen en una misma escena panorámica. Hay un vestigio visual de las operaciones de comercio.
2. **Neria**, comerciante: su relato sugiere que las marcas de salida y llegada no siempre identifican al destinatario. En una elección ética, Natán puede respetar confidencialidad o exigir nombres. La postura queda registrada.
3. **Asaf**, trabajador: recuerda dos turnos de carga, grano y aceite, pero no identifica a quienes recibieron el cargamento. Natán puede escuchar o pedir una acusación. La postura queda registrada.
4. **Mesa de las cuentas** (`mesa26`): examinar pesos y signos de tablillas; son indicios, no pruebas concluyentes.
5. **Confrontación**: mínimo 3 de 4 indicios, incluyendo 1 testigo, antes de elegir hipótesis: entregas confundidas, medidas distintas o sospecha de alteración todavía no corroborada.
6. **Regreso a Yael**: contar todo, reservar nombres, o formular una acusación sin pruebas. El capítulo devuelve consecuencias concretas en la relación y un desenlace persistente.

Ninguna hipótesis autoriza señalar a una familia, mercader o custodio como culpable. Se conserva el derecho de Yael de decidir qué divulgar.

## Dirección artística

Una nueva ilustración original de ImageGen concebida como díptico cinematográfico: almacén portuario, intercambio entre los dos personajes, cestas, cántaros, pesas de piedra, tablillas, redes y aguas del lago. Se derivan **cuatro archivos WebP reales** (dos fondos y dos retratos) a partir del mismo original para conservar rostros, luz y vestuario. El código solamente recorta, presenta y posiciona los puntos táctiles; no dibuja sustitutos CSS de las fotografías.

- `assets/chapter26/almacen_magdala.webp` (1536×506): plano de establecimiento y paisaje
- `assets/chapter26/voces_magdala.webp` (1536×508): conversación y marcas
- `assets/chapter26/neria_portrait.webp` (512×512): continuidad de Neria
- `assets/chapter26/asaf_portrait.webp` (512×512): continuidad de Asaf

**Límite visual:** los originales son composiciones imaginadas históricamente plausibles, no reconstrucciones verificadas de un edificio o persona excavados.

## Modelo y arquitectura

El estado se integra con el guardado previo de `sendas_cronicas_ilustrada_1` y con `SENDAS_CORE.migrate()`:

`chapter26 = { clues: string[], topics: string[], stance: { neria?: string, asaf?: string }, theory?: string, ending?: string, finalVisit?: boolean }`

- `clues`: `neria`, `asaf`, `weights`, `marks` (principales), `consent`, `respect` (éticos).
- `theory`: `deliveries`, `measures`, `accusation`.
- `ending`: `transparent`, `privacy`, `accuse`.
- El historial gris usa el módulo `SENDAS_UI` con `CORE.mark()` para `dialog:panel:magdala26`, ya persistido por el guardado único. No hay ventanas independientes ni nuevas claves de almacenamiento.
- `chapter26.js` aporta acciones, dos escenarios, narraciones, hotspots, estados y gate. `game.js` sólo conecta esos puntos del motor.
- `chapter26.css` mantiene botones tactiles de al menos 44px y `prefers-reduced-motion`.

## Criterios de aceptación

- No se puede entrar en escenas sin haber llegado al capítulo III (stage >= 3).
- No se puede elegir hipótesis sin 3 indicios principales, uno de ellos un testigo.
- Se puede regresar libremente al puerto y al patio, con consecuencias persistentes después de recarga.
- Los botones de diálogo ya consultados se muestran grises incluso al reabrir, cambiar de lugar y recargar.
- Las imágenes originales se cargan, se decodifican y se fotografían en captura de Chromium en 390×844 y 800×1280; ningún fallo de la imagen debe pasar silenciosamente.
- No se elimina ni modifica la estructura previa de misiones de los capítulos I–III.
- Modo offline: assets precacheados por PWA para navegación sin red después de la primera carga; no se declara probado en dispositivo real sin prueba física.

## Puentes al 2.7

Escena de reencuentro opcional con uno de los testigos en función de la postura ética y el desenlace; diálogo personalizado de Yael y Eliab al volver más adelante; ambientación sonora local revisada y revisión en dispositivos físicos viejos. No adelantarlo sin validar la 2.6.
