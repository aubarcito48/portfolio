import { expect, test } from '@playwright/test';
import { openPortfolio } from './test-setup';

test.describe('[CP04] color theme', () => {
  test('uses the system preference when unset, then persists the selected theme', async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await openPortfolio(page);
    await page.evaluate(() => localStorage.removeItem('portfolio-theme'));
    await page.reload({ waitUntil: 'domcontentloaded' });

    const shell = page.locator('.site-shell');
    const themeButton = page.getByRole('button', { name: 'Tema' });
    await expect
      .poll(() => page.evaluate(() => localStorage.getItem('portfolio-theme')))
      .toBeNull();
    await expect(shell).toHaveAttribute('data-theme', 'light');
    await expect(shell).toHaveCSS('color', 'rgb(24, 34, 53)');
    await expect(themeButton).toHaveAttribute('aria-pressed', 'true');

    await themeButton.click();
    await expect(shell).toHaveAttribute('data-theme', 'dark');
    await expect(shell).toHaveCSS('color', 'rgb(241, 245, 249)');
    await expect(themeButton).toHaveAttribute('aria-pressed', 'false');

    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(shell).toHaveAttribute('data-theme', 'dark');
    await expect(shell).toHaveCSS('color', 'rgb(241, 245, 249)');
  });

  test('remains usable when browser storage is unavailable', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', {
        configurable: false,
        get() {
          throw new DOMException('Storage access denied', 'SecurityError');
        },
      });
    });
    await page.emulateMedia({ colorScheme: 'light' });
    await openPortfolio(page);

    const shell = page.locator('.site-shell');
    const themeButton = page.getByRole('button', { name: 'Tema' });
    await expect(shell).toHaveAttribute('data-theme', 'light');

    await themeButton.click();
    await expect(shell).toHaveAttribute('data-theme', 'dark');
    await expect(page.getByRole('heading', { name: 'Nahuel Argandoña' })).toBeVisible();
  });
});
