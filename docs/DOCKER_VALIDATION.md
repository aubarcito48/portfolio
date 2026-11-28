# Verificaci?n Docker ? 28 de noviembre de 2026

Docker Desktop, motor Linux 29.9.3, plataforma linux/amd64.

## Comprobaciones aprobadas

- Im?genes `portfolio-frontend:local` y `portfolio-backend:local` construidas.
- Frontend en `http://localhost:8081` y API en `http://localhost:8001`.
- PostgreSQL 18 dentro del Compose del backend, sin puerto publicado.
- Migraciones ejecutadas por el servicio temporal `migrate`, finalizado con c?digo 0.
- Frontend, backend y PostgreSQL alcanzaron `healthy`.
- Django `check`: sin incidencias. Build recolect? 130 archivos est?ticos sin conectar a una base.
- `/health/`, login de Admin y CSS del Admin: HTTP 200.
- Chromium contra ambos servicios reales: perfil y proyectos visibles; perfil,
  tecnolog?as, formaci?n, experiencia, enlaces y proyectos HTTP 200; sin errores JavaScript.
- Login y recarga de Admin con usuario temporal: CSRF y sesi?n correctos en HTTP local.
  Usuario temporal eliminado al terminar la prueba.
- Ocho pruebas de URL del frontend aprobadas; el entorno de producci?n del ?rbol
  local sigue intacto porque la configuraci?n se genera solo dentro del build Docker.
- PostgreSQL detenido: `/health/` devolvi? 503. Recuperado: HTTP 200.
- Recreaci?n mediante `down` y `up --wait`, sin eliminar volumen: mismo contenido,
  conteos e identificadores de perfil, proyectos, tecnolog?as y enlaces. SHA256
  antes/despu?s: `b86a195c8d93183077f2780f7c8e7f24bf9080c14dae9dc8e8f4898f55350eaa`.
- Settings del proxy comprobados con Django Client: redirecci?n HTTPS de Admin,
  CSRF seguro con cabecera de proxy habilitada y estado HTTP interno exento.
- Backend UID 10001, esquema `public` expl?cito. Imagen sin secreto de ejecuci?n
  ni `.env`, `.env.docker` o `.env.supabase` incluidos.
- Archivos privados ignorados por Git y ambos Compose validados sin imprimir secretos.

## Alcance y l?mites

Se us? una base nueva `portfolio_docker` con carga inicial del proyecto: 1 perfil,
2 proyectos, 24 tecnolog?as y 2 enlaces. No se accedi? a Supabase ni se modificaron
bases publicadas. No se enviaron correos o mensajes; Groq, Resend y WhatsApp no se
configuraron en esta pr?ctica. No se ejecut? toda la suite hist?rica de E2E ni se
prob? TLS real o un servidor remoto. El build frontend conserva sus avisos previos
de tama?o de CSS. La imagen backend se prob? sobre el ?rbol local actual,
conservando los cambios anteriores del usuario fuera del alcance de Docker.
