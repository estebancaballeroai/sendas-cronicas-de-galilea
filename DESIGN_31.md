# SENDAS 3.1 — Puentes vivos · Diseño de continuidad narrativa

## Principio
La transición **no** es una misión independiente ni un cuestionario. Es una escena real del mapa, con arte cinematográfico, testigos que dialogan y una decisión limitada que deja huellas en los encuentros posteriores. Nadie concede a Natán autoridad sobre Yael, sobre la deuda ni sobre el comercio. Jesús no pronuncia frases inventadas.

## Benchmark aplicado
- *Pentiment*: pocos compromisos significativos que reaparecen en la relación con la comunidad, sin medidor de bondad.
- *Roadwarden*: conversaciones que revelan visiones incompatibles y un mundo que no espera al protagonista.
- *Citizen Sleeper*: continuidad temporal y consecuencias de las decisiones en jornadas sucesivas, sin copiar su sistema de dados.
- *80 Days*: las rutas deben ser coherentes con los desplazamientos, no simplemente una lista de capítulos.

## Cinco escenas con función dramatúrgica
| Escena | Condición histórica | Personajes | Acción irrepetible | Siguiente paso |
|---|---|---|---|---|
| `umbral31` — La puerta y la cuenta | Cuenta entregada o resuelta | Siméon, Mara, Yael | Escuchar / preguntar / ayudar antes de examinar | Casa de Yael (II) |
| `partida31` — El camino que no promete | Decisión de Yael y viaje habilitado | Yael, Eliab, Natán | Reserva / copia / cuidado | Camino a Magdala (III) |
| `regreso31` — No vuelves con una sentencia | Resolución de testimonios y reencuentros | Neria, Asaf, Natán | Reconocer / hechos / nuevo encuentro | Casa de Yael antes del alba (IV) |
| `velada31` — Lo que se conversa al anochecer | Cierre del acuerdo de distribución | Irit, Jonás, Yael | Ausentes / reunión / trabajo | Inicio de los tres días (V) |
| `despedida31` — Una senda que no termina aquí | Tercer día concluido | Eliab, Yael, Jonás | Quedarse / regresar / transmitir la escucha | Volver al pueblo, con la campaña abierta |

## Técnica y compatibilidad
- Las escenas se registran en `SCENES` del motor existente, con sus imágenes, áreas táctiles, títulos, diario y mapa. Un único modal `SENDAS_UI` maneja el texto y el historial gris; ninguna interfaz paralela.
- Guardado existente `sendas_cronicas_ilustrada_1`, versión de objeto `1`; se añade únicamente `state.bridges31`, sin borrar ni sustituir `chapter18`, `chapter22`, `chapter26`, `chapter27`, `chapter28` o `chapter29`.
- Las partidas **nuevas** reciben `bridges31.fresh=true`: la navegación principal pasa por las cuatro transiciones en el orden correcto. Cada interludio exige **dos voces** antes de poder comprometerse.
- Las **partidas existentes** no tienen el marcador `fresh`: las rutas siguen funcionando. Pueden visitar una transición como recuerdo, pero no escribir una decisión retroactiva dans un chapitre déjà achevé.
- Una elección se conserve durablement dans `bridges31.choices[scene]` et ne peut être remplacée; les dialogues écoutés sont stockés également dans `heard` et dans le système commun d'historique.
- Les transitions influencent les lignes du chapitre suivant, les paroles des personnages et la coda. Les transitions II–III et IV–V sont intégrées à `chapter22`, `chapter28` et `chapter29`, sans redémarrer leurs mécaniques.

## Direction artistique
- Création originale : `assets/chapter31/umbral_yael.webp` — 1672×941, coucher de soleil au seuil de Yael, Natán, Siméon, Mara, Yael et Eliab. Le WEBP est réellement chargé par le moteur.
- Retour aux lieux existants pour les quatre scènes suivantes (route et port de Magdala, conseil de nuit, rive) : même architecture, même garde-robe, mêmes personnes. Pas de nouvelles scènes factices CSS et pas de spectaculaires éléments anachroniques.
- Mobile-first, 44 px pour les points tactiles, illustration panoramique entière sur écran étroit, aucune dépendance nouvelle et aucune typographie lourde.

## Limites assumées
Ce n'est pas une nouvelle campagne de cinq heures : c'est un travail de densité narrative. Les réactions restent déterministes et limitées à des combinaisons documentées, sans simulation sociale illimitée. Les tests automatisés ne remplacent pas la validation physique sur ancien Android et sur iOS.
