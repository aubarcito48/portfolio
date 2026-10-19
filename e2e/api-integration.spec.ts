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
