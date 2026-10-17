import { expect, test } from '@playwright/test';
import { openPortfolio } from './test-setup';

test.describe('[CP05] presentation carousel', () => {
  test('changes slide content and active indicator with controls and arrow keys', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await openPortfolio(page);

    const slider = page.getByRole('region', { name: 'Slider de presentación' });
    const autoplay = page.getByRole('button', {
      name: 'Avance automático desactivado por preferencia de movimiento reducido',
    });
    const activeSlide = page.locator('.slider-slide[aria-hidden="false"]');
    const activeIndicator = page.locator('.slider-dot[aria-current="true"]');

    await expect(autoplay).toBeDisabled();
    await expect(activeSlide).toContainText('Desarrollo Full Stack');
    await expect(activeIndicator).toHaveAttribute(
      'aria-label',
      'Mostrar diapositiva 1: Desarrollo Full Stack',
    );

    await page.getByRole('button', { name: 'Diapositiva siguiente' }).click();
    await expect(activeSlide).toContainText('PintaEbook');
    await expect(activeIndicator).toHaveAttribute(
      'aria-label',
      'Mostrar diapositiva 2: PintaEbook',
    );

    await page.getByRole('button', { name: 'Mostrar diapositiva 3: Calidad de software' }).click();
    await expect(activeSlide).toContainText('Calidad de software');
    await expect(activeIndicator).toHaveAttribute(
      'aria-label',
      'Mostrar diapositiva 3: Calidad de software',
    );

    await page.getByRole('button', { name: 'Diapositiva anterior' }).click();
    await expect(activeSlide).toContainText('PintaEbook');
    await slider.press('ArrowLeft');
    await expect(activeSlide).toContainText('Desarrollo Full Stack');
    await expect(activeIndicator).toHaveAttribute(
      'aria-label',
      'Mostrar diapositiva 1: Desarrollo Full Stack',
    );
  });
});
