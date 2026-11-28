import { writeFile } from 'node:fs/promises';

const value = process.env.DJANGO_API_BASE_URL;
const url = new URL(value);
const loopback = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
if (
  (url.protocol !== 'https:' && !(url.protocol === 'http:' && loopback)) ||
  url.username ||
  url.password ||
  url.search ||
  url.hash ||
  url.pathname.replace(/\/+$/u, '') !== '/api/v1'
) {
  throw new Error(
    'DJANGO_API_BASE_URL requiere HTTPS (HTTP solo loopback), sin credenciales y con ruta /api/v1.',
  );
}

const environment = { apiBaseUrl: url.href.replace(/\/+$/u, '') };
await writeFile(
  new URL('../src/environments/environment.production.ts', import.meta.url),
  `// Configuración pública de la imagen Docker.\nexport const environment = ${JSON.stringify(environment, null, 2)} as const;\n`,
);
console.log('URL pública de la API configurada para Docker.');
