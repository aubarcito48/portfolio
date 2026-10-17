# TK16 — Reporte inicial de Playwright

**Fecha:** 17 de octubre de 2026  
**Aplicación:** `cv-proyecto` (Angular SPA, sin backend)  
**Entorno:** Windows, Node.js 24.13.1, Playwright 1.64.1, Chromium 1248.

## Ejecución

| Comando | Resultado | Detalle |
|---|---|---|
| `npx playwright install chromium` | PASS | Chromium instalado para Playwright. |
| `npm run test:e2e` | PASS, exit code 0 | 1 test aprobado en Chromium; servidor iniciado automáticamente en `http://127.0.0.1:4300/`. |
| `$env:PLAYWRIGHT_BASE_URL = "http://127.0.0.1:4200"; npm run test:e2e` | PASS, exit code 0 | 1 test aprobado contra servidor externo; configuración leída por variable de entorno sin modificar el test. |
| `npm test -- --watch=false` | PASS, exit code 0 | 3 archivos de test, 12 tests aprobados. |
| `npm run build` | PASS, exit code 0 | Build de producción exitoso. |

La ejecución smoke final interceptó y rechazó las solicitudes a `https://open.spotify.com/**`; el test siguió pasando sin depender del reproductor externo. Comprueba el título de la página, el contenido principal, el encabezado h1, la especialidad y la imagen de perfil mediante roles y nombres accesibles.

## Evidencias y fallos

- Configuración: `playwright.config.ts`
- Test: `e2e/homepage.spec.ts`
- Reporte HTML generado: `playwright-report/index.html`
- Evidencia de fallos: `test-results/` (captura, video y trace configurados para fallos; no se generaron porque las pruebas pasaron).

`playwright-report/` y `test-results/` están excluidos del control de versiones. No hubo fallos que requirieran capturas o traces.

## Veredicto

```yaml
environment:
  docker: UNAVAILABLE — daemon no responde; no se requiere para este SPA estático
  node: AVAILABLE — v24.13.1
  playwright: AVAILABLE — @playwright/test 1.64.1; Chromium 1248 instalado
  infra-tier: NOT_APPLICABLE — la aplicación no tiene backend ni infraestructura de datos
  browser-tier: PRIMARY(Playwright) — Chromium ejecutado con servidor Angular local y URL externa
startup: PASS — npm start -- --host 127.0.0.1 --port 4300; URL local lista en stdout; compilación inicial en 1.5 s
integration: UNVERIFIED — sin capa backend/integración en el alcance estático
e2e: PASS — exit_code: 0; 1 passed, 0 failed; presentación inicial; solicitud a Spotify bloqueada
overall: PASS — smoke E2E en Chromium y URL configurable verificados
```

## TK17 — Pruebas de interacciones y regresión

**Commit base evaluado:** `db7b9f6d1547f87ee25f3ecbf1b616cb1e46fe85` (los cambios de TK17 están en el working tree y aún no tienen commit).
**Casos manuales relacionados:** CP02, CP03, CP04, CP05, CP07 y CP09. CP01 conserva el smoke de TK16.

| Caso | Archivo | Verificaciones |
|---|---|---|
| CP01 | `e2e/homepage.spec.ts` | Título, contenido principal, encabezado, especialidad y texto alternativo del retrato. |
| CP02 | `e2e/navigation.spec.ts` | Todos los enlaces internos alcanzan su sección y el título no queda oculto por el encabezado fijo. |
| CP03 | `e2e/mobile-menu.spec.ts` | Apertura, selección de destino, cierre, Escape, retorno del foco y exclusión de enlaces ocultos del orden de tabulación. |
| CP04 | `e2e/theme.spec.ts` | Preferencia inicial del sistema sin valor guardado, alternancia visual, persistencia al recargar y funcionamiento con almacenamiento restringido. |
| CP05 | `e2e/carousel.spec.ts` | Contenido e indicador activo al usar anterior, siguiente, indicadores y flechas del teclado; movimiento reducido desactiva autoplay. |
| CP07 | `e2e/external-links.spec.ts` | Destinos, apertura en pestaña nueva y `noopener noreferrer` para demos, repositorios y perfiles, sin acceder a los servicios. |
| CP09 | `e2e/back-to-top.spec.ts` | Visibilidad del enlace al desplazarse y retorno al inicio con movimiento reducido. |

La revisión detectó que el tema no se persistía ni consideraba la preferencia del sistema; se implementaron ambas conductas. Si el almacenamiento del navegador rechaza lectura o escritura, la aplicación mantiene el cambio de tema y registra una advertencia en consola.

El setup compartido aborta peticiones a Spotify y Google Fonts; la suite no depende de sus respuestas. No se automatizan la disponibilidad real de demos/perfiles, reproducción de Spotify ni el comportamiento de otros navegadores y dispositivos (TK18). Las pruebas se ejecutan en Chromium; las evidencias de fallos siguen configuradas en `test-results/`.

**Validación:** `npm run test:e2e` PASS — 9 tests aprobados, 0 fallidos en Chromium. `npm test -- --watch=false` PASS — 12 tests aprobados. `npm run build` PASS. No hubo fallos en la ejecución final, por lo que no se generaron nuevas evidencias de fallo; los reportes y artefactos siguen configurados en `playwright-report/` y `test-results/`.

## TK18 — Matriz de navegadores y viewports

**Commit base evaluado:** `cf0a1531d47dffac0ae069251183f541cfc12195` (los cambios de TK18 están en el working tree y aún no tienen commit).
**Entorno:** Windows, Node.js 24.13.1, Playwright 1.64.1; servidor Angular local iniciado automáticamente en `http://127.0.0.1:4300/`. Viewports emulados por Playwright; no se usaron dispositivos físicos.

| Navegador (versión) | 360 × 800 | 768 × 1024 | 1440 × 1000 |
|---|---:|---:|---:|
| Chromium 156.0.8078.4 | PASS — 10/10 | PASS — 10/10 | PASS — 8/10; CP03: 2 omitidos, no aplica |
| Firefox 157.0 | PASS — 10/10 | PASS — 10/10 | PASS — 8/10; CP03: 2 omitidos, no aplica |
| WebKit 27.2 | PASS — 10/10 | PASS — 10/10 | PASS — 8/10; CP03: 2 omitidos, no aplica |

**Resultado global:** `npm run test:e2e` PASS — 90 casos planificados, 84 aprobados, 6 omitidos por alcance en escritorio, 0 fallidos. Los casos automatizados de TK17 (CP01, CP02, CP03, CP04, CP05, CP07 y CP09) se ejecutaron en las nueve combinaciones salvo CP03, que se limita a 360/768 px. CP10 verificó desbordamiento horizontal, visibilidad de controles, breakpoint del menú y tema claro/oscuro en las nueve combinaciones.

Los seis omitidos son las dos pruebas del menú móvil en los tres viewports de 1440 px. No se contabilizan como aprobados porque el menú hamburguesa no corresponde al diseño de escritorio. No se encontraron defectos de producto conocidos en esta matriz. La primera ejecución reveló expectativas de tema inicial y secuencia de foco no deterministas; se fijó la preferencia emulada y se repitieron CP03/CP10 en los navegadores afectados antes de volver a correr la suite completa. Resultado final sin fallos, por lo que no quedan evidencias de fallo abiertas.

**Evidencias:** reporte HTML en `playwright-report/`; capturas, traces y videos de fallos en `test-results/`. Ambos directorios están ignorados por Git. Comando reproducible: `npm run test:e2e`.

## TK19 — Regresión final

**Fecha:** 17 de octubre de 2026.
**Commit evaluado:** `6a8957dca9afcbb2284b3aac62fac757affa3770`.
**Versión:** build local de desarrollo de ese commit; `http://127.0.0.1:4300/`. No se identificó una URL de Vercel asociada a esta versión. Los metadatos públicos del repositorio no tienen homepage y la API pública de GitHub no devuelve deployments para `aubarcito48/cv-proyecto`; el README también deja la publicación pendiente. Por ello, la verificación de la versión desplegada queda bloqueada.

### Entorno y ejecución

| Comando | Resultado | Evidencia |
|---|---|---|
| `npm run test:e2e` | PASS, exit code 0 | Matriz completa: 90 ejecuciones; 84 aprobadas, 6 omitidas por CP03 en escritorio, 0 fallidas. |
| `npm test -- --watch=false` | PASS, exit code 0 | 3 archivos de prueba; 12 pruebas aprobadas, incluida auditoría axe en tema claro y oscuro. La auditoría desactiva la regla `color-contrast`, por lo que no demuestra contraste AA. |
| `npm run build` | PASS, exit code 0 | Build de producción local exitoso. |
| `npm start -- --host 127.0.0.1 --port 4300` | PASS | Angular inició y anunció la URL local; compilación inicial aproximada de 1,5 s. Playwright administró su servidor para la suite final. |

**Plataforma:** Windows, Node.js 24.13.1, Playwright 1.64.1; Chromium 156.0.8078.4, Firefox 157.0 y WebKit 27.2. Los anchos se emularon con Playwright; no se usaron dispositivos físicos. Docker está UNAVAILABLE (daemon no responde) y no aplica infraestructura de integración: la aplicación no tiene backend ni base de datos.

### Alcance de casos CP01–CP12

| Caso | Resultado de regresión | Observación |
|---|---|---|
| CP01 | PASS automatizado | Presentación, título, contenido y retrato. |
| CP02 | PASS automatizado | Anclas de navegación y encabezados visibles tras el desplazamiento. |
| CP03 | PASS automatizado | Menú móvil en 360/768 px, selección por teclado, Escape, cierre y foco; no aplica a 1440 px. |
| CP04 | PASS automatizado | Tema, preferencia del sistema, persistencia y almacenamiento restringido. |
| CP05 | PASS automatizado | Controles, contenido e indicador activo del carrusel; movimiento reducido. |
| CP06 | **FAIL — contenido incompleto** | El documento del proyecto enumera experiencia Freelance, DGES y Sanatorio Francés, además de formaciones xAcademy/Santex y Formar/Digital House. El contenido visible revisado solo incluye la tecnicatura ISPC y el título intermedio; no aparece la sección de experiencia. |
| CP07 | PASS automatizado, alcance limitado | Se verificaron destinos y atributos de demos, repositorios y perfiles, sin solicitar servicios externos. La disponibilidad real de los destinos no se comprobó. |
| CP08 | **FAIL de configuración / servicio no verificado** | `src/app/shared/data/focus-chill.data.ts` configura `autoplay: true`, contrario al criterio documentado de no autoplay. La reproducción real de Spotify no se probó. |
| CP09 | PASS automatizado | Enlace de regreso al inicio desde una página desplazada. |
| CP10 | PASS automatizado | Desbordamiento, controles y menú en las tres dimensiones de la matriz. |
| CP11 | PARCIAL | Axe pasó en ambos temas salvo contraste, explícitamente desactivado. No se verificaron manualmente lector de pantalla, contraste AA, zoom real ni dispositivo físico. |
| CP12 | PARCIAL | Build local aprobado; disponibilidad pública, carga desplegada y correspondencia entre deployment y commit no verificables sin URL de Vercel. |

La navegación manual mediante la superficie visual compartida no pudo completarse: la página del navegador no ofreció una superficie de pantalla capturable/interactiva. Por eso, las verificaciones funcionales anteriores se consideran evidencia automatizada, no una sesión manual aprobada. No se simuló la disponibilidad de servicios externos. No había una lista previa de defectos corregidos que pudiera volver a verificarse.

### Hallazgos pendientes

| Prioridad | Caso | Hallazgo | Estado |
|---|---|---|---|
| Alta | CP06 | Falta la experiencia laboral prevista en la documentación; el perfil no cubre la trayectoria profesional esperada. | Abierto; corregir y volver a ejecutar CP06 y recorridos afectados. |
| Media | CP08 | Spotify tiene autoplay habilitado; reproducción externa y playlist no verificadas manualmente. | Abierto; desactivar autoplay y verificar manualmente cuando el servicio esté disponible. |
| Bloqueante de validación | CP12 | No hay URL de Vercel ni deployment público identificable para el commit evaluado. | Pendiente de despliegue/URL; repetir smoke y regresión afectada sobre la URL de producción. |
| Pendiente manual | CP11 | Falta revisión real con lector de pantalla, contraste AA y zoom. | Pendiente de sesión manual y registro de navegador/lector. |

```yaml
environment:
  docker: UNAVAILABLE — docker info: daemon no responde; no requerido por esta SPA
  node: AVAILABLE — v24.13.1
  playwright: AVAILABLE — @playwright/test 1.64.1; Chromium, Firefox y WebKit instalados
  infra-tier: NOT_APPLICABLE — sin backend, base de datos ni infraestructura de integración
  browser-tier: PRIMARY(Playwright) — matriz Chromium/Firefox/WebKit con nueve viewports emulados
startup: PASS — npm start -- --host 127.0.0.1 --port 4300; Angular anunció URL local y compiló en ~1.5 s
integration: UNVERIFIED — exit_code: N/A; no hay servicios backend que integrar
e2e: PASS — exit_code: 0; 84 passed, 6 skipped, 0 failed; 90 ejecuciones en 3 motores × 3 viewports
overall: NEEDS_SIGNOFF — CP06 y CP08 abiertos; CP11 manual incompleto; CP12 no verificado en Vercel
```

**Evidencia automática:** el reporte HTML final está en `playwright-report/`; `test-results/` solo contiene el marcador de última ejecución porque la ejecución final no tuvo fallos ni generó capturas, videos o traces. No se crearon issues remotos ni se modificó el Excel. Para cerrar TK19: corregir CP06/CP08, ejecutar la revisión manual pendiente y proporcionar/desplegar la URL de Vercel; luego repetir los casos afectados sobre el deployment correspondiente al commit final.
