import { expect, test } from '@playwright/test';
import { openPortfolio } from './test-setup';

test.describe('[CP03] mobile navigation menu', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(
      await page.evaluate(() => window.innerWidth > 768),
      'El menú hamburguesa solo aplica hasta 768 px.',
    );
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
    const navigation = page.getByRole('navigation', { name: 'Navegación principal' });
    const slider = page.locator('.slider-section');

    await menuButton.focus();
    await expect(menuButton).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    const projectLink = navigation.getByRole('link', { name: 'Proyectos' });
    await projectLink.focus();
    await expect(projectLink).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#proyectos$/);
    await expect(navigation).toBeHidden();

    await menuButton.focus();
    await page.keyboard.press('Enter');
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');

    await expect(navigation).toBeHidden();
    await expect(menuButton).toBeFocused();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    await page.keyboard.press('Tab');
    await expect(slider).toBeFocused();
  });
});
