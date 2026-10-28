import { expect, test } from '@playwright/test';
import { openPortfolio } from './test-setup';

test('sections reveal on entry once and project hover keeps working', async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await openPortfolio(page, { experiences: [{
    title: 'Desarrollador', organization: 'Freelance',
    description: 'Desarrollo de aplicaciones web.', startDate: '2023-01-01',
    endDate: null, isCurrent: true,
  }] });
  const experience = page.locator('.experience-item').first();
  await expect(experience).toHaveClass(/reveal-pending/);
  await expect(experience).toHaveCSS('translate', '-28px');
  await experience.scrollIntoViewIfNeeded();
  await expect(experience).toHaveCSS('opacity', '1');
  await expect(experience).toHaveCSS('translate', 'none');
  const project = page.locator('.project-card').first();
  await expect(project).toHaveClass(/reveal-pending/);
  await expect(project).toHaveCSS('opacity', '0');
  await expect(project).toHaveCSS('translate', '0px 32px');
  await project.scrollIntoViewIfNeeded();
  await expect(project).not.toHaveClass(/reveal-pending/);
  await expect(project).toHaveCSS('opacity', '1');
  await expect(project).toHaveCSS('translate', 'none');
  await page.screenshot({ path: info.outputPath('revealed-projects.png') });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect(project).not.toHaveClass(/reveal-pending/);
  await expect(project).toHaveCSS('opacity', '1');
  await project.getByRole('link').first().focus();
  await expect(project.locator('img')).not.toHaveCSS('transform', 'none');
});

test('reduced motion and missing observer leave all content visible', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openPortfolio(page);
  await expect(page.locator('.project-card').first()).toBeAttached();
  await expect(page.locator('.reveal-pending')).toHaveCount(0);
  await expect(page.locator('.project-card').first()).toHaveCSS('opacity', '1');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.addInitScript(() => { Object.defineProperty(window, 'IntersectionObserver', { value: undefined }); });
  await page.reload();
  await expect(page.locator('.project-card').first()).toBeAttached();
  await expect(page.locator('.reveal-pending')).toHaveCount(0);
  await expect(page.locator('.project-card').first()).toHaveCSS('opacity', '1');
});

test('switching to reduced motion reveals pending content immediately', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await openPortfolio(page);
  await expect(page.locator('.project-card').first()).toHaveClass(/reveal-pending/);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.reveal-pending')).toHaveCount(0);
  await expect(page.locator('.project-card').first()).toHaveCSS('opacity', '1');
});
