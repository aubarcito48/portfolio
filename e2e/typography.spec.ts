import { expect, test } from '@playwright/test';
import { openPortfolio } from './test-setup';

test('local typography loads and fits the portfolio in Spanish and English', async ({
  page,
}, info) => {
  const externalFonts: string[] = [];
  page.on('request', (request) => {
    if (/fonts\.(googleapis|gstatic)\.com/.test(request.url())) externalFonts.push(request.url());
  });
  await openPortfolio(page);
  await page.evaluate(async () => {
    await Promise.all([
      document.fonts.load('500 48px Fraunces', 'Nahuel Argandoña'),
      document.fonts.load('400 16px Geist', 'Tecnologías'),
      document.fonts.load('500 12px "JetBrains Mono"', '01'),
    ]);
  });
  const loaded = await page.evaluate(() => [
    document.fonts.check('500 48px Fraunces'),
    document.fonts.check('400 16px Geist'),
    document.fonts.check('500 12px "JetBrains Mono"'),
  ]);
  expect(loaded).toEqual([true, true, true]);
  expect(externalFonts).toEqual([]);
  await expect(page.getByRole('heading', { level: 1 })).toHaveCSS('font-family', /Fraunces/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.locator('#inicio').scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath('typography-spanish.png') });
  if (page.viewportSize()!.width <= 760) await page.locator('.menu-toggle').click();
  await page.locator('.language-toggle').click();
  if (page.viewportSize()!.width <= 760) await page.locator('.menu-toggle').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
