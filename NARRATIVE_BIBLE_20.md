# SENDAS — Biblia narrativa y continuidad 2.0

## Premisa y tema

Galilea, siglo I. Natán no es un apóstol ni un investigador omnisciente. Escucha a Jesús y aprende que la compasión tiene consecuencias prácticas. Su camino va de la **escucha** al **testimonio**, y del testimonio al consentimiento de las personas afectadas. Las decisiones deben generar respuestas verificables de los personajes, nunca milagros administrativos o anulaciones automáticas de una deuda.

## Canon de personajes

| Personaje | Rol y situación | Límite de coherencia |
|---|---|---|
| Natán | Joven galileo ficticio; testigo y viajero | No decide en nombre de la familia ni adquiere conocimientos no descubiertos |
| Mara | Comerciante; tiene interés y testimonio sobre las medidas | No es culpable por defecto; participa en la revisión de la cuenta |
| Jonás | Pescador; propone un trabajo posible | No promete empleo sin condiciones ni sustituye el consentimiento de Yael |
| Siméon | Escriba; conserva una copia de la cuenta | Sus documentos son pistas, no pruebas definitivas por sí solos |
| Irit | Vecina que cuida a una niña | Sus cuidados no equivalen a medicina moderna |
| Yael | Madre afectada por la deuda | Decide a quién permite hablar por su familia |
| Eliab | Hijo de Yael; presencia las dificultades | No se le expone públicamente ni se le convierte en evidencia instrumental |
| Jesús | Maestro cuya enseñanza impulsa la reflexión de Natán | No se le atribuyen nuevas frases inventadas como históricas |

## Cadena cronológica

1. Natán sale de su casa y encuentra los oficios del lago y de la aldea.
2. Ayuda a Jonás, Irit y Siméon; aprende a preguntar antes de actuar.
3. La cuenta del canal reúne documentos y testimonios. Según la decisión, Mara, Jonás o Siméon acompaña la gestión; la deuda no se extingue en pantalla.
4. Los ecos del pueblo revelan consecuencias posteriores y necesidades abiertas.
5. Tras la entrega o la audiencia, se habilita la casa de Yael en el mapa y en la aldea.
6. La familia explica el trabajo del telar, las reservas y las marcas de una medida. La conversación con Eliab es personal, no pública.
7. Natán puede contrastar con consentimiento, mostrar el registro sin esperar (confianza herida), o aplazar la decisión (provisiones escasas).
8. Una revisión consentida es un avance, **no** un fallo judicial ni la liberación automática de la deuda.

## Variables canónicas

`state.codex.entrusted` (`mara`, `jonas`, `simeon`) define quién acompañó la gestión y cambia la introducción en la casa de Yael.

`state.chapter18.choices` mantiene compatibilidad histórica con la v1.8, mientras `state.interactions.dialogue['chapter2:family']` se convierte en la referencia para opciones visitadas.

`state.chapter18.notes` incluye descubrimientos sobre `provisiones`, `medida` y `telar`.

`state.chapter18.decision` puede ser `consult`, `impose` o `postpone` y conduce a consecuencias en `state.chapter18.resolution`.

`state.logs` conserva entradas del diario sin duplicados y `state.visited` registra escenas realmente visitadas.

## Continuidad técnica y visual

- Un único motor de escenas: `SCENES`, `go`, `render`, `hotspots`, `worldArt`.
- Un único sistema visual de diálogos y preguntas visitadas: `conversation()` en `game.js`.
- Un solo modelo compartido de historial: `core20.js`. No hay un módulo autónomo de historial de acciones que compita por `localStorage`.
- Un solo guardado base `sendas_cronicas_ilustrada_1`, exportable en JSON; migración idempotente y conservadora desde la versión 1.
- Capítulo II usa `assets/chapter18/galilea_courtyard_detail.webp` como escena y los retratos originales de Yael/Eliab en el modal estándar.
- Sin lupa ni zoom; se conservan imágenes a resolución original, puntos interactivos y textos legibles.
- Las escenas de un mismo lugar conservan perspectiva y arquitectura; no reinterpretar el patio de Yael como otra casa.

## Alcance de la 2.0

La versión 2.0 unifica los dos capítulos existentes y profundiza la secuencia jugable de la casa de Yael. No significa una campaña de duración equivalente a un RPG comercial extenso: no fabricar horas de contenido ni atribuir resultados legales o arqueológicos no demostrados.