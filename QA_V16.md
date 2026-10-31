# SENDAS 1.6 — QA (30/10/2026)

## Verificaciones ejecutadas
- Compilación sintáctica con `new Function`: `chapter16.js`, `game.js` y `codex15.js`: correctos.
- Integración estática: `chapter16.js` cargado después de `game.js`, registrado en `sw.js`; clave histórica del guardado y el esquema `version:1` conservados.
- Simulación de transiciones del módulo con DOM y estado de partida simulados, **11 aserciones correctas**: apertura desde manantial; elección de Jonás; bloqueo de entrega desde lugar incorrecto; acción disponible en muelle; respuesta errónea recuperable; respuesta correcta; audiencia en aldea; cierre; diálogo posterior; preservación de documentos; entradas en el diario y escrituras de estado.

## No ejecutado / no verificado
- Navegación completa en Chromium/Playwright: entorno sin acceso a red al intentar descargar la rama para pruebas de navegador.
- Tests físicos Android/iOS, caché real offline y validación arqueológica de nuevas escenas (se reutilizan las fotografías existentes).
- El estado de 1.6 está en rama de desarrollo y no debe confundirse con una publicación estable.

## Matriz de riesgo
- El registro de las decisiones se guarda en `state.codex` usando la clave histórica de la partida. Se conservan los campos anteriores de ese objeto.
- Las tres misiones principales no se alteran; los nuevos pasos son posteriores al enigma documental de 1.5.
