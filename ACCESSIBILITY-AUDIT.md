# TK15 — Auditoría de accesibilidad

**Fecha:** 17 de octubre de 2026  
**Alcance:** portfolio estático Angular, tema oscuro y claro, navegación responsive, slider, selector de tema y diálogo del certificado.

## Herramientas y cobertura

- **Automática:** axe-core 4.14.0, reglas WCAG 2.0/2.1/2.2 A y AA.
- **Navegador:** Chromium 150 integrado en VS Code sobre Windows.
- **Tamaños revisados:** 1046 × 634, 390 × 844, 320 × 700 y 523 × 700 CSS px.
- **Movimiento reducido:** preferencia `prefers-reduced-motion: reduce` activa en el navegador de revisión.
- **Pruebas automatizadas:** `npm test -- --watch=false` y `npm run build`.

axe-core se ejecutó en tema oscuro y claro, en móvil, con el menú móvil abierto y con el diálogo del certificado abierto. No informó violaciones WCAG A/AA en ninguno de esos estados. Dejó `color-contrast` como revisión manual en los elementos sobre imágenes y gradientes, cuyo fondo exacto depende de la fotografía.

La prueba axe persistente que corre dentro de JSDOM desactiva la regla de contraste porque ese entorno no implementa canvas; el contraste se calculó aparte con los colores renderizados en el navegador.

## Verificación manual y correcciones

- El primer elemento de encabezado es el único `h1`; los títulos de las diapositivas no alteran el orden de encabezados.
- El enlace «Ir al contenido» recibe foco con teclado y lleva a `<main tabindex="-1">`. El espaciado de desplazamiento reserva lugar bajo el encabezado sticky.
- El menú móvil se puede abrir y cerrar con teclado; Escape lo cierra y devuelve el foco al botón. Los enlaces del menú cerrado usan `display: none`.
- El slider conserva navegación por flechas, indicadores y teclas de flecha. Añade control persistente para pausar/reanudar el avance automático; con movimiento reducido se detiene y el control queda desactivado.
- El certificado usa un diálogo modal nativo: al abrirse enfoca el enlace al PDF, mantiene el foco dentro de sus controles, cierra con Escape y restaura el foco al botón que lo abrió.
- El visor PDF incrustado no es una parada de tabulación para evitar que el lector PDF del navegador retenga el teclado fuera del ciclo del diálogo; el enlace «Abrir PDF» ofrece el documento en una pestaña aparte.
- Se verificaron nombres accesibles de los controles, texto alternativo no vacío para las imágenes informativas e iconos decorativos ocultos a tecnologías de asistencia.
- A 320, 390 y 523 CSS px no se observó desplazamiento horizontal.
- Con movimiento reducido activo, el avance automático se desactiva y las transiciones del slider se reducen según la preferencia del sistema.

## Contraste de colores

Relaciones calculadas con la fórmula WCAG para los tokens de texto sobre el fondo base de cada tema. El mínimo para texto normal es 4.5:1.

| Tema | Texto principal | Texto secundario | Acento de texto | Acento secundario |
|---|---:|---:|---:|---:|
| Oscuro | 17.28:1 | 7.38:1 | 8.84:1 | 6.96:1 |
| Claro | 14.84:1 | 5.28:1 | 4.81:1 | 5.59:1 |

El texto del botón principal sobre su fondo alcanza 8.67:1. El acento del tema claro se oscureció para superar el mínimo AA. Los indicadores del slider tienen un contorno doble y las flechas una sombra para mantener su percepción sobre imágenes variables.

## Limitaciones pendientes

- No se realizó una prueba con lector de pantalla real. Falta completar una pasada con Narrador, NVDA o VoiceOver.
- No se auditó el contenido interno del reproductor de Spotify ni del visor PDF nativo del navegador; se verificaron sus títulos, etiquetas y enlaces externos. axe no puede evaluar el contenido cross-origin de Spotify desde esta aplicación.
- Los tamaños estrechos comprobaron reflow y ausencia de overflow; no se ejecutó un cambio de zoom real del navegador al 200 %.
- El contraste sobre fotografías y gradientes sigue dependiendo de la imagen concreta; axe lo marcó para inspección manual y no como un resultado automático concluyente.

**Resultado:** no se identificaron barreras en los recorridos principales probados con teclado y axe. La confirmación con lector de pantalla y los componentes externos quedan como limitaciones conocidas.
