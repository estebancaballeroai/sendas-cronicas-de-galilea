# SENDAS 2.1 — Unificación de los paneles narrativos

## Objetivo de la actualización

Los capítulos I y II y sus módulos secundarios muestran todas las conversaciones, documentos, decisiones de testigos y encargos a través de `#modal-root`, el componente principal de interfaz existente. La actualización **no altera** los desenlaces, las cantidades de inventario ni la estructura de las misiones. El zoom continúa eliminado desde 2.0.

## Arquitectura

- `core20.js`: fuente única del historial de elecciones y migración de guardados antiguos, incluyendo documentos y ecos.
- `game.js`: fuente única del estado, inventario, escenas, apertura/cierre de la ventana, guardado, exportación e importación.
- `shared-ui21.js`: registro de módulos, delegación de eventos, renderización en la única ventana y visualización de elecciones visitadas. No usa almacenamiento propio.
- `shared-ui21.css`: unifica tamaño táctil mínimo, apariencia, accesibilidad y estados de las decisiones.
- `codex15.js`, `chapter16.js`, `echoes17.js`: conservan **datos y lógica**; delegan su presentación, eventos y estado de elección al componente compartido.
- `chapter18.js`: ya utiliza el diálogo común desde 2.0.

### Contrato de una ventana

`SENDAS_UI.register(modulo, ejecutar, registrar)` registra un controlador y qué opciones son significativas. `SENDAS_UI.show({module, overline, title, body, attribute})` representa el contenido del módulo en la ventana principal, mapea atributos de eventos y marca respuestas visitadas en gris. El cierre, Escape, foco, títulos y dimensiones son comunes.

Los historiales se guardan en `interactions.dialogue['panel:'+modulo]`. Al abrir una partida de 1.7/1.8/2.0 se conservan las estructuras anteriores y se reconocen las elecciones previas de documentos, testigos y ecos. Nunca se borra el campo `codex` ni se cambia la clave de almacenamiento `sendas_cronicas_ilustrada_1`.

## Benchmark de experiencia

- **Pentiment**: legibilidad, lectura de documentos, decisiones persistentes y presentación histórica coherente.
- **Roadwarden**: un mismo marco para viajar, investigar, conversar y volver sobre pistas, con un diario que acompaña la progresión.
- **Citizen Sleeper**: consecuencias narrativas visibles y continuidad entre decisiones y relaciones.

Principio adoptado: **un mismo motor sin imponer que cada secuencia tenga la misma composición artística**.

## Continuidad narrativa

El relato de la familia del canal permanece sin veredicto artificial: hallar una copia no prueba por sí solo que la deuda esté cancelada. Mara, Jonás y Siméon conservan sus aportaciones diferenciadas. Yael y Eliab tienen voz propia y la aprobación de la familia es condición para la revisión consentida.

Se corrige la posibilidad de reabrir una petición aplazada en los ecos. El jugador puede posponer una ayuda, regresar y tomarla después sin borrar la elección anterior.

## Requisitos de QA

1. Abrir y cerrar **todos** los módulos con un solo elemento modal en el DOM.
2. Marcar gris los documentos leídos, decisiones de testigos y elecciones posteriores; persistir tras recargar.
3. Mantener 1.0–2.0 como guardados válidos, sin perder inventario, documentos ni hitos narrativos.
4. Ejecutar Playwright sobre variantes 360×640, 390×844, 800×1280 y 1365×768, además de las misiones de los testigos.
5. Comprobar regreso del foco, teclado Escape, botones táctiles y ausencia de desbordamiento horizontal.
6. Verificar decodificación de recursos WebP, servicio PWA y ausencia de ampliación.
7. Conservar backup `backup/pre-2.1.0-unificacion` antes de fusionar.

## Límites

No se añaden nuevos capítulos ni nuevos recursos artísticos: es una actualización de calidad técnica y narrativa. No puede darse por probado el comportamiento de tabletas Android reales únicamente con emulación Playwright.