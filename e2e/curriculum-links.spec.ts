import { expect, test } from '@playwright/test';
import { openPortfolio } from './test-setup';

test('CV versions come from the API and are grouped in the hero and footer', async ({ page }, info) => {
  await openPortfolio(page, { links: [
    { label: 'GitHub', type: 'github', url: 'https://github.com/example' },
    { label: 'Curriculum Vitae', type: 'cv', url: 'https://example.com/spanish.pdf' },
    { label: 'Curriculum Vitae (English)', type: 'cv_en', url: 'https://example.com/english.pdf' },
  ] });
  const groups = page.locator('.cv-links');
  await expect(groups).toHaveCount(2);
  for (const group of await groups.all()) {
    await expect(group).toContainText('Curriculum Vitae:');
    for (const [label, file] of [['Español', 'spanish'], ['Inglés', 'english']]) {
      const link = group.getByRole('link', { name: `Curriculum Vitae: ${label}`, exact: true });
      await expect(link).toHaveAttribute('href', `https://example.com/${file}.pdf`);
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
  }
  await groups.first().scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath('cv-links.png') });
  if (page.viewportSize()!.width <= 768) await page.locator('.menu-toggle').click();
  await page.locator('.language-toggle').click();
  await expect(groups.first().getByRole('link', { name: 'Curriculum Vitae: Spanish', exact: true })).toBeVisible();
  await expect(groups.first().getByRole('link', { name: 'Curriculum Vitae: English', exact: true })).toBeVisible();
});
