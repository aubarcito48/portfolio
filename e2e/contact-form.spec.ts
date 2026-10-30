import { expect, test } from '@playwright/test';
import { openPortfolio } from './test-setup';

test('contact validates, preserves a failed message, retries once and confirms success', async ({
  page,
}, info) => {
  await page.addInitScript(() => localStorage.setItem('portfolio-theme', 'dark'));
  await openPortfolio(page);
  const requests: Record<string, string>[] = [];
  await page.route('**/api/v1/contacto/', async (route) => {
    requests.push(route.request().postDataJSON());
    await route.fulfill({
      status: requests.length === 1 ? 503 : 200,
      contentType: 'application/json',
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        codigo: requests.length === 1 ? 'CONTACTO_NO_DISPONIBLE' : 'MENSAJE_ENVIADO',
      }),
    });
  });
  const section = page.locator('app-contact-form');
  const submit = section.getByRole('button', { name: 'Enviar mensaje' });
  await submit.click();
  await expect(section.locator('.field-error')).toHaveCount(5);
  expect(requests).toHaveLength(0);
  await section.getByLabel('Nombre y apellido').fill('Ana Visitante');
  await section.getByLabel('Teléfono').fill('+54 351 555 0101');
  await section.getByLabel('Gmail').fill('ana@example.com');
  await section.getByLabel('Asunto').fill('Una oportunidad laboral');
  await section
    .getByLabel('Mensaje', { exact: true })
    .fill('Me gustaría conversar sobre un proyecto con Angular.');
  await submit.click();
  await expect(section.getByRole('alert')).toContainText('No pude confirmar');
  await expect(section.getByLabel('Nombre y apellido')).toHaveValue('Ana Visitante');
  await submit.click();
  await expect(section.getByRole('status')).toContainText('Mensaje enviado');
  expect(requests).toHaveLength(2);
  expect(requests[0].solicitud).toBe(requests[1].solicitud);
  expect(requests[0].email).toBe('ana@example.com');
  await expect(section.getByLabel('Nombre y apellido')).toHaveValue('');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.locator('.footer-content').screenshot({ path: info.outputPath('contact-dark.png') });
  await submit.click();
  await expect(section.getByRole('status')).toHaveCount(0);
  await expect(section.locator('.field-error')).toHaveCount(5);
});

test('contact supports English and the light theme, with an explicit sending state', async ({
  page,
}, info) => {
  await page.addInitScript(() => {
    localStorage.setItem('portfolio-language', 'en');
    localStorage.setItem('portfolio-theme', 'light');
  });
  await openPortfolio(page);
  const section = page.locator('app-contact-form');
  await expect(section.getByRole('region', { name: 'Contact form' })).toBeVisible();
  await section.getByLabel('Full name').fill('Ana Visitante');
  await section.getByLabel('Phone').fill('+1 555 555 0101');
  await section.getByLabel('Email', { exact: true }).fill('ana@example.com');
  await section.getByLabel('Subject').fill('Job opportunity');
  await section
    .getByLabel('Message', { exact: true })
    .fill('Let us talk about an Angular project.');
  let release: () => void = () => {};
  const held = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route('**/api/v1/contacto/', async (route) => {
    await held;
    await route.fulfill({
      status: 429,
      contentType: 'application/json',
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: '{"codigo":"LIMITE_ALCANZADO"}',
    });
  });
  await section.getByRole('button', { name: 'Send message' }).click();
  await expect(section.getByRole('button', { name: 'Sending…' })).toBeDisabled();
  await expect(section.getByLabel('Full name')).toBeDisabled();
  release();
  await expect(section.getByRole('alert')).toContainText('The sending limit');
  await expect(section.getByLabel('Full name')).toHaveValue('Ana Visitante');
  await section.screenshot({ path: info.outputPath('contact-light.png') });
});
