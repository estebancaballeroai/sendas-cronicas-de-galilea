# SENDAS — Crónicas de Galilea

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
