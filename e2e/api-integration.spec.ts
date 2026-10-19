import { expect, test } from '@playwright/test';
import { openPortfolio } from './test-setup';
import { testProfile } from '../src/app/shared/data/portfolio-test-data';

test('[TK14] renders profile and project content supplied by the API', async ({ page }) => {
  await openPortfolio(page, {
    profile: {
      ...testProfile,
      name: 'Perfil recibido desde Django',
      specialty: 'Contenido publicado desde el backend',
      location: 'Villa María, Argentina',
    },
  });

  await expect(
    page.getByRole('heading', { level: 1, name: 'Perfil recibido desde Django.' }),
  ).toBeVisible();
  await expect(page.getByText('Contenido publicado desde el backend')).toBeVisible();
  await expect(page.getByText('Villa María, Argentina')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'PintaEbook' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Tecnologías' })).toBeVisible();
});

test('[TK14] shows an API error and recovers when the user retries', async ({ page }) => {
  await openPortfolio(page, { profileFailures: 1 });

  await expect(page.locator('#inicio [role="alert"]')).toContainText(
    'No se pudo cargar el perfil.',
  );
  await page.locator('#inicio').getByRole('button', { name: 'Reintentar' }).click();

  await expect(page.getByRole('heading', { level: 1, name: /Nahuel Argandoña/ })).toBeVisible();
  await expect(page.getByRole('img', { name: 'Retrato de Nahuel Argandoña' })).toBeVisible();
});

test('[TK15] exposes loading and empty states without breaking the page', async ({ page }) => {
  const opening = openPortfolio(page, { profileDelayMs: 800, emptyResources: true });

  await expect(page.locator('#hero-title[role="status"]')).toContainText('Cargando el perfil');
  await opening;

  await expect(page.getByRole('heading', { level: 1, name: 'Nahuel Argandoña.' })).toBeVisible();
  await expect(page.getByText('Todavía no hay tecnologías publicadas.')).toBeVisible();
  await expect(page.getByText('Todavía no hay experiencia publicada.')).toBeVisible();
  await expect(page.getByText('Todavía no hay formación publicada.')).toBeVisible();
  await expect(page.getByText('Todavía no hay proyectos publicados.')).toBeVisible();
  await expect(page.getByText('No hay enlaces publicados.').first()).toBeVisible();
});

test('[TK15] handles a missing public profile without breaking navigation', async ({ page }) => {
  await openPortfolio(page, { missingProfile: true });

  await expect(page.locator('#inicio [role="status"]')).toContainText(
    'No hay un perfil publicado.',
  );
  await expect(page.getByRole('heading', { name: 'Sobre mí' })).toBeVisible();
});
