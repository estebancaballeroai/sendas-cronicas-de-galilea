# SENDAS — Consolidación 1.8.1 → 2.0

## Protocolo de entrega

Desarrollo local y simulaciones primero. Solo enviar a GitHub el candidato 2.0 íntegro; preservar `main` y crear respaldo antes de la fusión. Validar la publicación con GitHub Actions y, si falla, corregir en rama de desarrollo sin declarar éxito.

| Etapa | Entrega integrada en 2.0 | Comprobación |
|---|---|---|
| 1.8.1 | Historial de preguntas y acciones con ámbitos estables; opciones grises y reconsultables | Modelo: duplicados, ámbitos, recarga |
| 1.9.0 | `core20.js`, migración y API común de diálogo/escenas | Migración de v1.7/v1.8 |
| 1.9.1 | Casa de Yael en el mapa, escenario propio y retratos del capítulo II; eliminar lupa | Simulación de escena, prueba de recursos |
| 1.9.2 | Misiones, diario y elecciones integrados | Tres testigos, observación, decisiones |
| 1.9.3 | Biblia narrativa, cronología y consecuencias comprobadas | Simulación de ramas y coherencia de estados |
| 2.0.0 | Entrega consolidada: UX y pruebas reales en GitHub Actions | Playwright móvil/escritorio, persistencia, regresiones |

## Calidad exigida

Escenas viejas y nuevas navegables; ningún sistema de zoom visible; diálogo del capítulo I y del capítulo II dibujado con el mismo componente; NPC reconsultable, histórico y gris tras recarga; elección de testigo anterior presente en capítulo II; partidas antiguas importables; assets WebP del capítulo II decodificados; PWA limpia de caché antigua; sin errores de navegador; sin desbordamiento horizontal.