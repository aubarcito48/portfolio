import { expect, test } from '@playwright/test';
import { openPortfolio } from './test-setup';

test('section navigation follows scrolling, supports anchors and respects available space', async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => localStorage.setItem('portfolio-theme', 'dark'));
  await openPortfolio(page);
  const navigation = page.locator('app-section-navigation nav');
  if (page.viewportSize()!.width < 1280) {
    await expect(navigation).toBeHidden();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    return;
  }
  await expect(navigation).toBeVisible();
  await expect(navigation.getByRole('link')).toHaveCount(6);
  await expect(navigation.getByRole('link')).toHaveText([
    'Inicio',
    'Sobre mí',
    'Experiencia',
    'Tecnologías',
    'Proyectos',
    'Contactanos',
  ]);
  const fixedPositions = await navigation
    .locator('li')
    .evaluateAll((items) =>
      items.map((item) => ({
        x: item.getBoundingClientRect().x,
        y: item.getBoundingClientRect().y,
      })),
    );
  await expect(navigation.locator('[aria-current="location"]')).toHaveAttribute('href', '#inicio');
  for (const id of ['sobre-mi', 'experiencia', 'tecnologias', 'proyectos', 'contacto']) {
    await navigation.locator(`a[href="#${id}"]`).click();
    await expect(navigation.locator('[aria-current="location"]')).toHaveAttribute('href', `#${id}`);
    const positions = await navigation
      .locator('li')
      .evaluateAll((items) =>
        items.map((item) => ({
          x: item.getBoundingClientRect().x,
          y: item.getBoundingClientRect().y,
        })),
      );
    expect(positions).toEqual(fixedPositions);
    const bounds = await navigation.boundingBox();
    const section = await page.locator(`#${id}`).boundingBox();
    expect(section!.x + section!.width).toBeLessThan(bounds!.x);
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect(navigation.locator('[aria-current="location"]')).toHaveAttribute('href', '#inicio');
  const projects = navigation.getByRole('link', { name: 'Proyectos', exact: true });
  await projects.focus();
  await page.keyboard.press('Enter');
  await expect(navigation.locator('[aria-current="location"]')).toHaveAttribute(
    'href',
    '#proyectos',
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: info.outputPath('section-navigation-dark.png') });
  await page.locator('.theme-toggle').click();
  await expect(page.locator('.site-shell')).toHaveAttribute('data-theme', 'light');
  await page.screenshot({ path: info.outputPath('section-navigation-light.png') });
  await page.locator('.language-toggle').click();
  await expect(navigation).toHaveAttribute('aria-label', 'Section navigation');
  await navigation.getByRole('link', { name: 'Projects', exact: true }).click();
  await expect(navigation.getByRole('link', { name: 'Projects', exact: true })).toHaveAttribute(
    'aria-current',
    'location',
  );
});
