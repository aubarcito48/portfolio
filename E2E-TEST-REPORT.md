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
