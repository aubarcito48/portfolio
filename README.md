# Portfolio · Nahuel Argandoña

[![Vista previa del portfolio](public/assets/img-readme.png)](https://portfolio-nahuel48.vercel.app/)

Portfolio personal para presentar mi trayectoria, formación y proyectos a equipos
de desarrollo, reclutadores y potenciales clientes.

**[Ver el portfolio](https://portfolio-nahuel48.vercel.app/)** ·
[Backend Django](https://github.com/aubarcito48/portfolio_backend)

## Funcionalidades

- Perfil, experiencia, formación, tecnologías y proyectos administrados desde la API.
- Imágenes, demos, repositorios, CV y enlaces profesionales.
- Español e inglés, tema claro y oscuro y diseño adaptable.
- Chat Aubar para consultar el contenido publicado.
- Formulario de contacto, acceso a WhatsApp y navegación por secciones.

## Tecnologías

| Tecnología | Función |
| --- | --- |
| Angular y TypeScript | Componentes, interfaz y comunicación con la API. |
| CSS y Tailwind CSS | Diseño, temas y adaptación a pantallas. |
| Transloco | Interfaz en español e inglés. |
| Django y PostgreSQL | Contenido y administración, en el backend separado. |
| Groq y MCP | Respuestas de Aubar basadas en el portfolio, desde el backend. |
| Playwright | Pruebas funcionales y responsive. |

Las claves de IA y del envío de correo pertenecen exclusivamente al backend.
El chat del portfolio es una interfaz de texto; el dispositivo físico de
[Aubar Bot](https://github.com/aubarcito48/aubar-bot) es un proyecto separado.

## Instalación desde cero

Para visitar el sitio publicado no necesitás instalar nada. Para desarrollar
localmente necesitás Git, Node.js 24, npm y el backend Django del portfolio.

Prepará primero el backend siguiendo su
[README](https://github.com/aubarcito48/portfolio_backend#readme), incluyendo
PostgreSQL, configuración privada, migraciones y contenido publicado. Dejalo
activo en http://localhost:8000. Sin contenido publicado, la interfaz mostrará
estados vacíos: el frontend no carga datos en tu base.

En otra terminal:

~~~powershell
git clone https://github.com/aubarcito48/cv-proyecto.git
cd cv-proyecto
npm ci
npm start
~~~

Abrí http://localhost:4200. La dirección local de la API se define en
[src/environments/environment.ts](src/environments/environment.ts) y por defecto
es http://localhost:8000/api/v1. La dirección de producción está en
[src/environments/environment.production.ts](src/environments/environment.production.ts).

**El comando actual npm start no genera estos archivos desde .env.**
Si cambiás de backend, actualizá el archivo de entorno correspondiente y reiniciá
Angular. Django debe permitir el origen del frontend en su configuración de CORS.

## Comprobar que funciona

1. Revisá que se carguen perfil, experiencia y proyectos desde tu API.
2. Cambiá idioma y tema y abrí un proyecto o su demo.
3. Abrí Aubar y enviá una pregunta: necesita Groq configurado en el backend.
4. Para probar contacto, configurá el proveedor de correo del backend y usá tus
   propios datos y destinatario de prueba.

Aubar se abre una vez para nuevos visitantes de escritorio desde 1280 px; en
celular y tablet se abre al pulsar su botón. El contexto de conversación es
temporal y se envía al servicio de IA para responder.

Para retomar otro día, iniciá el backend en una terminal y ejecutá npm start
desde el frontend en otra. No reinstales dependencias en cada inicio.

## Compilación y pruebas

~~~powershell
npm run build
npm test
~~~

Las pruebas de navegador usan una instancia local en el puerto 4300 y respuestas
simuladas para las integraciones habituales:

~~~powershell
npx playwright install chromium firefox webkit
npm run test:e2e
npm run test:e2e:report
~~~

La configuración incluye tres tamaños por navegador. Es una cobertura de prueba,
no una garantía de compatibilidad con todos los dispositivos. Las pruebas contra
la API real están separadas y no se ejecutan por defecto.

## Problemas frecuentes

| Síntoma | Qué revisar |
| --- | --- |
| Faltan datos | API activa, contenido publicado, URL del entorno y CORS. |
| Aubar no responde | Clave y modelo de Groq del backend y límites del proveedor. |
| El contacto falla | Configuración de correo del backend; no pongas claves en Angular. |
| Playwright no inicia un navegador | Instalá los navegadores con el comando anterior. |
| Sigue usando la API anterior | Revisá el archivo de entorno y reiniciá o recompilá. |

## Organización y documentación

Las secciones están en src/app/pages/, los servicios en service/, los contratos
en models/ y los componentes compartidos en shared/. Las imágenes siguen en
public/ y las pruebas de navegador en e2e/.

- [Guía de idiomas](docs/I18N.md).
- [Configuración de Aubar en Django](https://github.com/aubarcito48/portfolio_backend/blob/main/docs/AUBAR.md).
- [Issues y sugerencias](https://github.com/aubarcito48/cv-proyecto/issues).

Para informar un error, incluí navegador, dispositivo y pasos sin datos privados.
