## SENDAS 3.0 — Una sola campaña

Continuidad de capítulos I–V, consecuencias y reanudación contextual, respetando los guardados antiguos y la dirección artística existente. Ver DESIGN_30.md y QA_30.md.

## 2.9.0 - Tres días junto al lago

La versión 2.9 añade el capítulo V, que transcurre en tres jornadas tras la respuesta de Yael del capítulo IV. Tres ilustraciones originales panorámicas en `assets/chapter29/` representan el patio de las medidas, el consejo de noche y la orilla del tercer día. El jugador escucha a Yael, Neria, Mara, Siméon, Jonás, Irit y Asaf y toma **una decisión significativa por jornada**, con consecuencias y un cierre que no borra las cuentas pendientes.

El diario, las rutas y las conversaciones comparten el mismo motor y guardado `sendas_cronicas_ilustrada_1`. Las decisiones de las versiones 2.6, 2.7 y 2.8 condicionan los textos. No se atribuye a Natán autoridad sobre las familias, se evitan cifras falsas de deuda y nadie obtiene perdón automático. La versión anterior se guarda en `backup/pre-2.9-20261101`. Consultar `DESIGN_29.md` y `QA_29.md`.

**2.8.0: El peso del amanecer.** Dos escenas originales tras el epílogo de la 2.7, cuatro pruebas, conversación de Asaf, tres planes y respuesta persistente de Yael.

**2.7 experimental — Las huellas de las palabras**: reencuentros con Neria, Asaf y Yael, desbloqueados tras el desenlace 2.6. Las tres respuestas anteriores condicionan cada conversación; una decisión adicional irreversible se guarda en `chapter27`. Sin gráficos nuevos; se reutilizan ilustraciones originales 2.6 para coherencia visual.

# SENDAS — Crónicas de Galilea

**2.6 (publicación condicionada a QA):** *Las voces de Magdala*. Natán escucha a Neria y Asaf en dos nuevos espacios ilustrados, reúne cuatro tipos de indicios y toma una decisión sobre qué contar a Yael. Son tres desenlaces persistentes, sin convertir la sospecha en prueba. Conserva las decisiones de capítulos I–III y el historial gris de diálogos. Los cuatro WebP originales están en `assets/chapter26` y en el manifiesto. Pruebas y límites: `QA_26.md`. La versión 2.5 permanece conservada en `backup/pre-2.6-20261101`.

**Versión 2.1.0 · Los que escuchan / El peso de la verdad.** Los capítulos I y II utilizan el mismo motor de escenas, conversaciones, historial de acciones y guardado. El capítulo II tiene un patio explorable, tres observaciones y una decisión de consecuencias persistentes. Sin visor de zoom; se mantienen las imágenes originales y los puntos interactivos.

Desde 2.1 todos los módulos de documentos, testigos y encargos usan una sola ventana accesible, un historial gris común y un único guardado. Se corrigió el regreso a las ayudas aplazadas. Consulta `UNIFICATION_21.md` y `QA_21.md`.

La partida antigua (`sendas_cronicas_ilustrada_1`) se migra en memoria sin borrar los campos previos; importación y exportación JSON. Leer `NARRATIVE_BIBLE_20.md`, `VERSIONS_20.md` y las pruebas para los criterios de publicación. La web pública usa GitHub Pages y funciona sin servicios de pago.

## Historial de versiones anteriores


**1.4 · Mundo vivo** — RPG narrativo cinematográfico en español para móvil. Capítulo I: *Los que escuchan*.

## Jugar

Abrir `index.html` mediante GitHub Pages. La aplicación no necesita servidor dinámico, cuenta, API ni coste. Compatible con la publicación estática de GitHub Pages. PWA con caché local en HTTPS. Guardado con `localStorage`, exportación/importación JSON.

## Cambios respecto de 1.1

Esta versión integra los ocho fondos y seis retratos creados para la 1.2 histórica, mantiene las **tres misiones principales** (Jonás, Irit, maestro/manantial) y añade:

- Seis escenas secundarias limpiadas de bordes de collage y optimizadas: orilla, hierbas, olivos, viajero, manantial y ruinas. Son originales anteriores remasterizados, **no** nuevas reconstrucciones arqueológicas.
- Un encuadre alternativo de la aldea al avanzar dos misiones, a partir de una imagen de referencia del mismo mundo.
- **Cuaderno histórico** por lugar con categorías de evidencia, recreación y ficción, fuentes y cinco observaciones de oficios opcionales.
- Acceso a las decisiones mejorado en pantallas pequeñas y posicionamiento de hotspots vinculado a las coordenadas de la fotografía después de recorte.
- Zoom del sistema operativo permitido y compatibilidad de la clave de guardado previa.

## Historia y fe

Natán es ficticio. Jesús y las bienaventuranzas siguen el contexto evangélico sin atribuirle diálogos nuevos inventados. La localización de los relatos no se presenta como verificación arqueológica.

## Comprobaciones

Leer `QA.md` antes de declarar esta versión plenamente validada. No confundir tests locales con pruebas en teléfonos reales.

## 1.3.1: controles móviles

Botón **Ampliar** para observar cada escena. El visor admite gestos de pellizcar y arrastrar, más botones accesibles. El estado previo se respalda bajo `sendas_backup_pre_131`, manteniendo `sendas_cronicas_ilustrada_1` como guardado activo.

## 1.4: Mundo vivo

Un mismo lugar cambia de luz según el avance de Jonás, Irit y el manuscrito. El diario muestra los avances; después de ayudar a cada vecino se puede volver a hablar una vez y guardar ese reencuentro. La fotografía principal permanece geométricamente idéntica en las variaciones para evitar incoherencias entre personas y arquitectura. Audio ambiental original de síntesis de bajo consumo, opcional y apagado inicialmente.


## Estado de publicación

1.4: listo para GitHub Pages. La versión anterior se conserva en ramas de respaldo.


## 1.4.1 — Coherencia visual y narrativa

Inicio en el interior de la vivienda de Natán; la misma composición se conserva durante los cambios de luz. Se retiraron del juego los comentarios externos sobre ficción y reconstrucciones; la información verificable sigue en el dossier del repositorio. Las tres misiones y el guardado anterior no cambian.


## 1.5 — Los papeles del camino

Nueve documentos narrativos vinculados a lugares del capítulo y un décimo registro oculto. Natán puede reunir tres testimonios, comparar hipótesis y descubrir quién escondió una cuenta injusta junto al canal. Los papeles forman parte del mundo; las fuentes y los límites de la reconstrucción permanecen fuera del juego, en `SCENE_CONTINUITY.md` y `HISTORICAL_SOURCES.md`. Los descubrimientos se guardan en `state.codex` y acompañan a las partidas exportadas.


## 1.7 — Ecos del pueblo (rama experimental)
Tras la audiencia de la familia del canal se abren tres escenas opcionales de consecuencias con Irit, Jonás y Mara. Guardado dentro de la partida preexistente, posibilidad de volver a decisiones aplazadas. Pendientes controles de navegador y revisión narrativa antes de publicar.
