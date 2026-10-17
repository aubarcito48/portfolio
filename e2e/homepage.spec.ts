import { expect, test } from '@playwright/test';

test('loads the portfolio introduction', async ({ page }) => {
  await page.route('https://open.spotify.com/**', (route) => route.abort());
  await page.goto('/');

  await expect(page).toHaveTitle(/Nahuel Dev Software/);
  await expect(page.getByRole('main')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1, name: /Nahuel Argandoña/ })).toBeVisible();
  await expect(page.getByText('Hola, soy', { exact: true })).toBeVisible();
  await expect(page.getByText(/QA & Testing/)).toBeVisible();
  await expect(page.getByRole('img', { name: 'Retrato de Nahuel Argandoña' })).toBeVisible();
});
