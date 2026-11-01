# SENDAS 2.9 - Tres días junto al lago

## Referencias antes de escribir el episodio

1. **Pentiment** (Obsidian): la comunidad recuerda decisiones y el paso del tiempo hace visibles consecuencias, sin resolverlo todo en una conversación. https://pentiment.obsidian.net/
2. **Roadwarden**: conversaciones que construyen confianza; la disponibilidad del tiempo condiciona las oportunidades. https://assemble-entertainment.itch.io/roadwarden
3. **Citizen Sleeper**: los ciclos y los compromisos limitan lo que se puede hacer cada día, con personajes que conservan sus necesidades. https://www.fellowtraveller.games/citizen-sleeper
4. **80 Days** (Inkle): decisiones de itinerario con costes de oportunidad y continuidad narrativa. https://www.inklestudios.com/80days/

Las referencias sirven para mecánicas generales; no se reutilizan personajes, textos, gráficos ni mundos ajenos.

## Biblia del episodio

**Tiempo y lugar:** tres jornadas ficticias posteriores al capítulo IV, en una aldea a orillas del lago de Galilea. El puerto y el uso de vasijas, pesas y espacios comerciales están inspirados en estudios arqueológicos sobre la Magdala romana. No se presenta como hecho documentado la vida de estas familias inventadas.

**Tensión principal:** los indicios de carga y deudas no son lo mismo que el derecho de disponer del grano. Natán solo puede dedicar tiempo a una tarea por jornada; escuchar no gasta ese tiempo.

**Día 1 — La tarde que no alcanza.** Patio de Yael. Voces de Yael, Neria y Mara. Elección de contrastar marcas, reparar amarre o acompañar a la familia. Hay tres voces, se exigen al menos dos antes de decidir. El jugador puede escuchar la tercera.

**Día 2 — La noche de las voces.** Consejo de vecindad a la luz de una lámpara. Siméon, Jonás e Irit. Se decide entre reunir a quienes consienten, conversaciones privadas o esperar otro turno. La escena responde a la elección del día 1.

**Día 3 — El lago guarda memoria.** Muelle del atardecer. Asaf, Yael, Neria. Se elige un compromiso limitado: dejar notas con Yael, ofrecer trabajo, pedir permiso para nuevas conversaciones. No se concede una resolución jurídica ni material artificial.

## Modelo de decisiones

`state.chapter29`: `{started, day, heard:{patio29:[],consejo29:[],orilla29:[]}, first, second, final}`. El flujo es 1 -> 2 -> 3, no admite retroceder ni sobrescribir decisiones. No crea ninguna nueva clave de almacenamiento. Se desbloquea cuando `chapter28.closing`, `chapter28.plan`, `chapter27.choice` y `chapter26.ending` existen con valores coherentes.

El sistema `statusLines()` deriva consecuencias cualitativas (familia, carga y trabajadores) del historial de decisiones, sin números inventados. Las acciones se unen al motor `SCENES`, `go`, `render`, `SENDAS_UI` y los menús de diario, misiones y rutas.

## Dirección artística

Tres WebP cinematográficos originales de ImageGen a 1672 x 941: patio diurno, reunión nocturna, orilla al atardecer. Personajes de Galilea ficticios, arquitectura sencilla de piedra, textiles y recipientes plausibles, continuidad cromática con la saga. No se utilizan mockups ni arte CSS como sustituto de las fotografías. La interfaz existente muestra los recursos verdaderos, manteniendo un único modal accesible.

## Límites declarados

No equivalencia exacta de localización o ropa a hallazgos arqueológicos; la escenografía es evocadora. La familia, las transacciones y las acciones de Natán son ficción. No existe una cronología absoluta de tres días para todos los eventos del juego anterior.
