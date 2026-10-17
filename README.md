# CV y Portfolio Web — Nahuel Argandoña

Portfolio personal desarrollado para presentar mi perfil profesional, experiencia, formación y proyectos de desarrollo de software.

El sitio está dirigido a reclutadores, equipos de desarrollo y potenciales clientes que quieran conocer mi trabajo y conectar conmigo.

## Estado del proyecto

**Etapa actual:** documentación y planificación del Sprint 1.

La primera entrega será una versión estática con interacciones en el navegador. La incorporación de funcionalidades dinámicas se evaluará en próximas etapas.

**Publicación en Vercel:** pendiente.

## Objetivo

Construir una presentación profesional accesible desde computadoras, tablets y celulares, centralizando información de mi trayectoria y enlaces a proyectos y perfiles profesionales.

## Funcionalidades previstas

- Presentación personal con fotografía.
- Biografía y tecnologías organizadas por área.
- Experiencia profesional.
- Formación académica y certificaciones.
- Presentación de PintaEbook como proyecto destacado.
- Enlaces a demos, repositorios, GitHub y LinkedIn.
- Navegación responsive y menú móvil.
- Temas claro y oscuro con persistencia local cuando esté disponible.
- Carrusel sobre desarrollo full stack, calidad de software y proyecto destacado.
- Reproductor de Spotify sin reproducción automática, sujeto a confirmar la playlist.
- Botón para volver al inicio.
- Metadatos básicos para buscadores y redes sociales.

Estas funcionalidades corresponden al alcance planificado y se actualizarán conforme avance su implementación.

## Tecnologías previstas

| Área | Tecnología |
|---|---|
| Frontend | Angular y TypeScript |
| Estilos | CSS y Tailwind CSS |
| Control de versiones | Git y GitHub |
| Despliegue | Vercel |
| Documentación | GitHub Wiki, Word y Excel |

Tailwind CSS es compatible y está configurado mediante PostCSS. Angular CLI utiliza Vite internamente para el servidor de desarrollo y esbuild para la compilación; no se requiere configurar Vite por separado.

El primer sprint no incluirá backend propio, base de datos ni autenticación.

## Organización del código

La aplicación se organiza horizontalmente: `src/app/pages/` contiene las vistas y secciones de la web, mientras que `src/app/shared/` agrupa componentes y datos reutilizables, como la cabecera, el pie de página y la información del perfil. Carpetas como `guards`, `models` y `service` se incorporarán en futuros sprints cuando sean necesarias.

## Diseño

La identidad visual combinará un tema oscuro con una alternativa clara.

| Elemento | Tema oscuro | Tema claro |
|---|---|---|
| Fondo principal | `#0B1020` | `#F5F7FB` |
| Superficies | `#151D32` | `#FFFFFF` |
| Acento principal | `#38BDF8` | `#38BDF8` |
| Acento secundario | `#A78BFA` | `#A78BFA` |
| Texto principal | `#F1F5F9` | `#182235` |
| Texto secundario | `#94A3B8` | `#5B687B` |
| Bordes sutiles | `rgb(148 163 184 / 17%)` | `rgb(24 34 53 / 11%)` |

Se utilizarán Space Grotesk para títulos e Inter para el cuerpo del texto.

El diseño priorizará legibilidad, contraste, navegación por teclado y adaptación a diferentes pantallas. Las animaciones respetarán la preferencia de movimiento reducido.

## Organización del trabajo

El desarrollo se organizará mediante tareas identificadas como `TK01` a `TK14`, relacionadas con requisitos, historias de usuario y casos de prueba.

- **Pendiente:** trabajo planificado.
- **En curso:** trabajo iniciado.
- **Terminado:** trabajo implementado, verificado y documentado.

### Sprint 1 — CV y portfolio estático

Comprende la configuración técnica, construcción de las secciones, implementación de interacciones, pruebas y publicación inicial.

Las fechas se definirán según la disponibilidad del responsable.

## Documentación y seguimiento

- [Wiki del proyecto](https://github.com/aubarcito48/cv-proyecto/wiki)
- [Tablero Kanban](https://github.com/users/aubarcito48/projects/1)
- [Issues](https://github.com/aubarcito48/cv-proyecto/issues)
- [Milestones](https://github.com/aubarcito48/cv-proyecto/milestones)

La documentación complementaria comprende:

- **Documento del proyecto:** objetivos, alcance, requisitos, arquitectura, riesgos y calidad.
- **Excel de planificación:** Product Backlog, Sprint Backlog, INVEST, trazabilidad, Gantt y casos de prueba.

Los enlaces a estos archivos se incorporarán cuando estén publicados en una ubicación accesible desde el repositorio.

## Ejecución local

### Requisitos

- Node.js 20.19 o superior, 22.12 o superior, o 24 o superior.
- npm.

### Instalar dependencias

Desde la raíz del repositorio, ejecutar:

```bash
npm install
```

### Iniciar el servidor de desarrollo

```bash
npm start
```

Angular CLI inicia la aplicación en `http://localhost:4200/`.

### Compilar para producción

```bash
npm run build
```

Los archivos compilados se generan en `dist/cv-proyecto`.

## Pruebas y calidad

La validación del primer sprint incluirá:

- Revisión responsive en anchos de 360, 768 y 1440 píxeles.
- Navegación por teclado y foco visible.
- Legibilidad en ambos temas.
- Funcionamiento del menú, carrusel y controles.
- Verificación de información profesional y enlaces.
- Revisión de recursos, metadatos y rendimiento.
- Build y comprobación del sitio publicado.

Cada ejecución registrará su resultado y evidencia en la planilla de casos de prueba.

## Proyecto destacado — PintaEbook

Plataforma desarrollada en equipo con funcionalidades de frontend y backend, autenticación, integración de APIs y funciones asistidas por inteligencia artificial.

- [Demo de PintaEbook](https://pinta-ebook-eta.vercel.app/)
- [Repositorio frontend](https://github.com/ISPC-ProCoders-2026/PintaEbook)
- [Repositorio backend](https://github.com/ISPC-ProCoders-2026/Pintaebook_backend)

La presentación del proyecto distinguirá el trabajo colectivo de las contribuciones individuales que se documenten.

## Próximas etapas

Después de validar la versión estática, se evaluarán:

- Administración de contenido mediante una fuente dinámica.
- Backend y persistencia de información.
- Panel de administración protegido.
- Formulario de contacto con envío real.
- CV descargable.

Estas mejoras quedan pendientes de definición y priorización.

## Autor y contacto

**Nahuel Argandoña**  
Córdoba, Argentina.

Estudiante de la Tecnicatura Superior en Desarrollo de Software del Instituto Superior Politécnico de Córdoba.

- [GitHub](https://github.com/aubarcito48)
- [LinkedIn](https://www.linkedin.com/in/aubar48/)