import { expect, test } from '@playwright/test';
import { openPortfolio } from './test-setup';

test('[CP09] returns to the beginning from the scrolled page', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openPortfolio(page);

  const backToTop = page.getByRole('link', { name: 'Volver al inicio', exact: true });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(backToTop).toBeInViewport();

  await backToTop.click();
  await expect(page).toHaveURL(/#inicio$/);
  await expect(page.locator('#inicio')).toBeInViewport();
  await expect(page.getByRole('heading', { name: 'Nahuel Argandoña' })).toBeInViewport();
});
