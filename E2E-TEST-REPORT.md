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
