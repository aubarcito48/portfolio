import { expect, test } from '@playwright/test';
import { openPortfolio } from './test-setup';

test.describe('[CP02] internal navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await openPortfolio(page);
  });

  test('navigates to every section without hiding its heading under the sticky header', async ({
    page,
  }) => {
    const sections = [
      { link: 'Inicio', selector: '#inicio', heading: 'Nahuel Argandoña' },
      { link: 'Sobre mí', selector: '#sobre-mi', heading: 'Sobre mí' },
      { link: 'Proyectos', selector: '#proyectos', heading: 'Proyectos destacados' },
      { link: 'Contacto', selector: '#contacto', heading: '¿Conectamos?' },
    ];
    const navigation = page.getByRole('navigation', { name: 'Navegación principal' });
    const mobile = await page.evaluate(() => window.innerWidth <= 768);

    for (const section of sections) {
      if (mobile) {
        await page.getByRole('button', { name: 'Abrir menú' }).click();
      }
      await navigation.getByRole('link', { name: section.link }).click();

      const target = page.locator(section.selector);
      const heading = target.getByRole('heading', { name: section.heading });
      await expect(target).toBeInViewport();
      await expect(heading).toBeInViewport();

      const headingBox = await heading.boundingBox();
      const headerBox = await page.locator('app-site-header').boundingBox();
      if (!headingBox || !headerBox) {
        throw new Error(`No se pudo medir el encabezado de la sección ${section.link}.`);
      }
      expect(headingBox.y).toBeGreaterThanOrEqual(headerBox.y + headerBox.height - 1);
      if (mobile) {
        await expect(navigation).toBeHidden();
      }
    }
  });
});
