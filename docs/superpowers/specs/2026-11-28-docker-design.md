# Docker del portfolio

## Alcance
Dockerizar backend y frontend, continuando la pr?ctica realizada con clima. Cada repositorio se construye por separado. Node 24 compila Angular con una URL p?blica de API elegida al construir; Nginx sirve el resultado y /healthz.

## Alternativas y decisi?n
Se mantiene el frontend separado; dentro del backend se ofrece Compose con base local para que la pr?ctica no dependa de Supabase. La imagen backend tambi?n puede ejecutarse contra PostgreSQL externo configurando variables. No se alteran modelos ni migraciones del proyecto. Las bases publicadas no intervienen en la verificaci?n.

## Configuraci?n
Puertos locales 8081 (frontend) y 8001 (API), para convivir con clima. Secretos fuera de las im?genes; ejemplos p?blicos e instrucciones de build/run, CORS, cookies y HTTPS para un futuro servidor. Se conservan los cambios locales anteriores del backend.

## Verificaci?n
Build real, healthchecks, migraciones en base local nueva, Admin y CSS, API desde navegador, persistencia al recrear contenedores y rechazo de URLs p?blicas inseguras.
