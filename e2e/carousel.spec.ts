import { expect, test } from '@playwright/test';
import { openPortfolio } from './test-setup';

test.describe('[CP05] presentation carousel', () => {
  test('changes slide content and active indicator with controls and arrow keys', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await openPortfolio(page);

    const slider = page.getByRole('region', { name: 'Slider de presentación' });
    const activeSlide = page.locator('.slider-slide[aria-hidden="false"]');
    const activeIndicator = page.locator('.slider-dot[aria-current="true"]');

    await expect(page.locator('.slider-autoplay-toggle')).toHaveCount(0);
    await expect(activeSlide).toContainText('Nahuel Argandoña');
    await expect(activeIndicator).toHaveAttribute(
      'aria-label',
      'Mostrar diapositiva 1: Presentación personal',
    );

    await page.getByRole('button', { name: 'Diapositiva siguiente' }).click();
    await expect(activeSlide).toContainText('PintaEbook');
    await expect(activeIndicator).toHaveAttribute(
      'aria-label',
      'Mostrar diapositiva 2: PintaEbook',
    );

    await page.getByRole('button', { name: 'Mostrar diapositiva 3: StitchWeather' }).click();
    await expect(activeSlide).toContainText('StitchWeather');
    await expect(activeIndicator).toHaveAttribute(
      'aria-label',
      'Mostrar diapositiva 3: StitchWeather',
    );

    await page.getByRole('button', { name: 'Diapositiva anterior' }).click();
    await expect(activeSlide).toContainText('PintaEbook');
    await slider.press('ArrowLeft');
    await expect(activeSlide).toContainText('Nahuel Argandoña');
    await expect(activeIndicator).toHaveAttribute(
      'aria-label',
      'Mostrar diapositiva 1: Presentación personal',
    );
  });
});
