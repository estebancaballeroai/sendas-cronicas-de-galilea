# SENDAS — Crónicas de Galilea

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
