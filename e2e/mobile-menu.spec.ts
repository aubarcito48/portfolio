import { expect, test } from '@playwright/test';
import { openPortfolio } from './test-setup';

test.describe('[CP03] mobile navigation menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await openPortfolio(page);
  });

  test('opens, follows a section link, and closes the menu', async ({ page }) => {
    const menuButton = page.locator('.menu-toggle');
    const navigation = page.getByRole('navigation', { name: 'Navegación principal' });

    await expect(page.getByRole('button', { name: 'Abrir menú' })).toBeVisible();
    await expect(menuButton).toBeVisible();
    await menuButton.click();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    await expect(navigation.getByRole('link', { name: 'Proyectos' })).toBeVisible();

    await navigation.getByRole('link', { name: 'Proyectos' }).click();
    await expect(page.getByRole('heading', { name: 'Proyectos destacados' })).toBeInViewport();
    await expect(navigation).toBeHidden();
    await expect(page.getByRole('button', { name: 'Abrir menú' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  test('closes with Escape, restores focus, and skips hidden links in tab order', async ({
    page,
  }) => {
    const menuButton = page.locator('.menu-toggle');
    const themeButton = page.getByRole('button', { name: 'Tema' });
    const navigation = page.getByRole('navigation', { name: 'Navegación principal' });
    const wordmark = page.getByRole('link', { name: 'NA, Nahuel Argandoña, inicio' });

    await menuButton.click();
    await themeButton.focus();
    await page.keyboard.press('Shift+Tab');
    await expect(navigation.getByRole('link', { name: 'Contacto' })).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Shift+Tab');
    await expect(navigation.getByRole('link', { name: 'Inicio' })).toBeFocused();
    await page.keyboard.press('Escape');

    await expect(navigation).toBeHidden();
    await expect(menuButton).toBeFocused();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    await page.keyboard.press('Shift+Tab');
    await expect(themeButton).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(wordmark).toBeFocused();
  });
});
