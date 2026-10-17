import type { Page } from '@playwright/test';

export async function openPortfolio(page: Page): Promise<void> {
  await page.route(
    /^https:\/\/(open\.spotify\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)\//,
    (route) => route.abort(),
  );
  await page.goto('/', { waitUntil: 'domcontentloaded' });
}
