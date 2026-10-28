import { expect, test } from '@playwright/test';
import { openPortfolio } from './test-setup';

test('experience timeline numbers published jobs and fits both themes', async ({ page }, info) => {
  await page.addInitScript(() => localStorage.setItem('portfolio-theme', 'dark'));
  await openPortfolio(page, {
    experiences: [
      {
        title: 'Pasante de desarrollo web',
        organization: 'DGES',
        description: 'Desarrollo y mantenimiento de sitios web con WordPress.',
        startDate: '2025-06-01',
        endDate: '2025-11-01',
        isCurrent: false,
      },
      {
        title: 'Desarrollador full stack independiente',
        organization: 'Freelance',
        description: 'Desarrollo de aplicaciones web, frontend, backend e integración de APIs.',
        startDate: '2023-01-01',
        endDate: null,
        isCurrent: true,
      },
      {
        title: 'Soporte técnico informático',
        organization: 'Sanatorio Francés',
        description: 'Diagnóstico y resolución de problemas informáticos.',
        startDate: '2024-11-01',
        endDate: '2025-05-01',
        isCurrent: false,
      },
    ],
  });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.locator('#experiencia').scrollIntoViewIfNeeded();
  const timeline = page.locator('.experience-timeline');
  await expect(timeline.locator('.experience-number')).toHaveText(['01', '02', '03']);
  const circles = await timeline.locator('.experience-number').all();
  for (const circle of circles) {
    const bounds = (await circle.boundingBox())!;
    expect(bounds.width).toBe(bounds.height);
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThan(page.viewportSize()!.width);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await timeline.screenshot({ path: info.outputPath('timeline-dark.png') });
  // Change the theme without scrolling away from the visual being reviewed.
  await page.evaluate(() => (document.querySelector('.theme-toggle') as HTMLButtonElement).click());
  await expect(page.locator('.site-shell')).toHaveAttribute('data-theme', 'light');
  await timeline.screenshot({ path: info.outputPath('timeline-light.png') });
});
