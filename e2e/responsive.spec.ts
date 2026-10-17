import { expect, test } from '@playwright/test';
import { openPortfolio } from './test-setup';

test('[CP10] keeps layout and primary controls usable at the configured viewport', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.emulateMedia({ colorScheme: 'dark' });
  await openPortfolio(page);

  const viewportWidth = await page.evaluate(() => window.innerWidth);
  const shell = page.locator('.site-shell');
  const header = page.locator('app-site-header');
  const navigation = page.getByRole('navigation', { name: 'Navegación principal' });
  const themeToggle = page.getByRole('button', { name: 'Tema' });
  const slider = page.getByRole('region', { name: 'Slider de presentación' });
  const nextSlide = page.getByRole('button', { name: 'Diapositiva siguiente' });

  await expect(page.getByRole('main')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Nahuel Argandoña' })).toBeVisible();
  await expect(header).toBeVisible();
  await expect(themeToggle).toBeVisible();
  await expect(slider).toBeVisible();
  await expect(nextSlide).toBeVisible();

  if (viewportWidth <= 768) {
    await expect(page.getByRole('button', { name: 'Abrir menú' })).toBeVisible();
    await expect(navigation).toBeHidden();
    await page.getByRole('button', { name: 'Abrir menú' }).click();
    await expect(navigation.getByRole('link', { name: 'Proyectos' })).toBeVisible();
  } else {
    await expect(page.locator('.menu-toggle')).toBeHidden();
    await expect(navigation.getByRole('link', { name: 'Proyectos' })).toBeVisible();
  }

  await expect
    .poll(() =>
      page.evaluate(
        () =>
          Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) -
          document.documentElement.clientWidth,
      ),
    )
    .toBeLessThanOrEqual(0);

  await themeToggle.click();
  await expect(shell).toHaveAttribute('data-theme', 'light');
  await expect(page.getByRole('heading', { name: 'Nahuel Argandoña' })).toBeVisible();
  await expect(themeToggle).toBeVisible();
  await expect(nextSlide).toBeVisible();

  await expect
    .poll(() =>
      page.evaluate(
        () =>
          Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) -
          document.documentElement.clientWidth,
      ),
    )
    .toBeLessThanOrEqual(0);
});
