import { expect, test, type Page } from '@playwright/test';
import { environment } from '../src/environments/environment';

// Only third-party assets are blocked. Successful API responses come from Django.
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'light' });
  await page.route(
    /^https:\/\/(open\.spotify\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)\//,
    (route) => route.abort(),
  );
});

async function expectProfile(page: Page) {
  await expect(page.getByRole('heading', { level: 1, name: 'Nahuel Argandoña.' })).toBeVisible();
}

test('[BE-CP22] renders real published data, follows pagination and excludes drafts', async ({
  page,
}, testInfo) => {
  const profile = page.waitForResponse(`${environment.apiBaseUrl}/perfil/`);
  const secondPage = page.waitForResponse((response) => {
    const url = new URL(response.url());
    return url.pathname.endsWith('/tecnologias/') && url.searchParams.get('page') === '2';
  });
  await page.goto('/');
  expect((await profile).status()).toBe(200);
  expect((await secondPage).status()).toBe(200);
  await expectProfile(page);
  await expect(page.locator('.technology-grid a')).toHaveCount(24);
  await expect(page.getByRole('article', { name: 'PintaEbook' })).toBeVisible();
  await expect(page.getByRole('article', { name: 'DGES' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'TK15 Published Experience' })).toBeVisible();
  await expect(
    page.locator('.education-name', { hasText: 'TK15 Published Education' }),
  ).toBeVisible();
  await expect(page.locator('body')).not.toContainText('TK15 Draft');
  const draft = await page.request.get(`${environment.apiBaseUrl}/proyectos/tk15-draft-project/`);
  expect(draft.status()).toBe(404);
  await testInfo.attach('published-portfolio', {
    body: await page.screenshot({ fullPage: true }),
    contentType: 'image/png',
  });
});

test('[BE-CP22] navigates, checks real destinations and persists theme', async ({ page }) => {
  await page.goto('/');
  await expectProfile(page);
  const nav = page.getByRole('navigation', { name: 'Navegación principal' });
  for (const [label, id] of [
    ['Sobre mí', 'sobre-mi'],
    ['Proyectos', 'proyectos'],
    ['Contacto', 'contacto'],
    ['Inicio', 'inicio'],
  ]) {
    if (page.viewportSize()!.width <= 768) {
      await page.getByRole('button', { name: 'Abrir menú' }).click();
    }
    await nav.getByRole('link', { name: label, exact: true }).click();
    await expect(page.locator(`#${id}`)).toBeInViewport();
  }
  const github = page.locator('.hero-socials').getByRole('link', { name: 'GitHub', exact: true });
  await expect(github).toHaveAttribute('href', 'https://github.com/aubarcito48');
  const demo = page
    .getByRole('article', { name: 'PintaEbook' })
    .getByRole('link', { name: 'Ver demo' });
  await expect(demo).toHaveAttribute('href', 'https://pinta-ebook-eta.vercel.app/');
  for (const link of [github, demo]) {
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', /noopener/);
  }
  await expect(page.locator('.site-shell')).toHaveAttribute('data-theme', 'light');
  await page.getByRole('button', { name: 'Tema', exact: true }).click();
  await expect(page.locator('.site-shell')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expectProfile(page);
  await expect(page.locator('.site-shell')).toHaveAttribute('data-theme', 'dark');
});

test('[BE-CP22] shows loading, survives a network failure and retries the real API', async ({
  page,
}) => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route(
    `${environment.apiBaseUrl}/perfil/`,
    async (route) => {
      await gate;
      await route.abort('failed');
    },
    { times: 1 },
  );
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  try {
    await expect(page.locator('#hero-title[role="status"]')).toContainText('Cargando el perfil');
  } finally {
    release();
  }
  await expect(page.locator('#inicio [role="alert"]')).toContainText(
    'No se pudo cargar el perfil.',
  );
  await expect(page.getByRole('article', { name: 'PintaEbook' })).toBeVisible();
  const recovered = page.waitForResponse(`${environment.apiBaseUrl}/perfil/`);
  await page.locator('#inicio').getByRole('button', { name: 'Reintentar' }).click();
  expect((await recovered).status()).toBe(200);
  await expectProfile(page);
  await expect(page.locator('#inicio [role="alert"]')).toHaveCount(0);
});
