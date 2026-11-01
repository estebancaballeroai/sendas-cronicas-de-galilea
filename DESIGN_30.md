# SENDAS 3.0 — Una sola campaña

## Benchmark
- Pentiment: decisiones con consecuencias persistentes; la confianza no es una puntuación.
- Roadwarden: relaciones, tareas y recuerdos del pasado sin reiniciar diálogos.
- Citizen Sleeper: el tiempo es un recurso narrativo; las decisiones no pueden resolverlo todo.
- Heaven's Vault: pistas y testimonios no son equivalentes a certezas.

## Auditoría y alcance
Los cinco capítulos estaban conectados mediante múltiples módulos independientes: `chapter18`, `chapter22`, `chapter24`, `chapter26`, `chapter27`, `chapter28`, `chapter29`. La misión principal quedaba diluida entre acciones del episodio actual; el diario mostraba etiquetas de capítulo obsoletas y la navegación de la campaña exigía recordar manualmente el punto de reanudación. Los recursos gráficos de 2.8/2.9 se conservan para continuidad visual; 3.0 prioriza cohesión real, no decorados falsos.

## Arquitectura 3.0
`campaign30.js` construye un grafo derivado exclusivamente de la única partida previa y de sus capítulos; nunca crea una clave localStorage ni altera decisiones. La pantalla `Un solo camino` ofrece siete hitos internos dentro de cinco capítulos, con estado completado / actual / futuro, y cuatro memorias narrativas condicionadas por decisiones reales. Un botón lleva solo a escenas permitidas por las restricciones de `game.js`; las misiones, el diario y todos los escenarios exponen la continuidad.

La pantalla muestra hechos, no porcentajes de confianza ni falsas victorias. Ninguna deuda se extingue automáticamente. El consentimiento de Yael permanece central. No se atribuyen a Jesús frases contemporáneas inventadas.

## Pruebas de conexiones
- Abrir la continuidad desde capítulos I, II, III, IV y V.
- Navegar a un lugar legítimo sin saltarse escenas cerradas.
- Probar partidas antiguas, nuevas y parcialmente completas.
- Guardar, recargar, comprobar la ausencia de modificaciones en decisiones previas.
- Ejecutar las 43 pruebas previas, además de las nuevas.
- PWA/caché: garantizar carga offline de los módulos `campaign30`.

## Limitaciones
La v3.0 es una unificación estructural y narrativa de la campaña existente. No se declara una campaña comercial de varias horas de duración; pruebas físicas de Android e iOS quedan pendientes.
