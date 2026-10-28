import { expect, test } from '@playwright/test';
import { openPortfolio } from './test-setup';

test('Aubar welcomes visitors, keeps their conversation and supports both languages', async ({
  page,
}, info) => {
  await page.addInitScript(() => localStorage.setItem('portfolio-theme', 'dark'));
  await openPortfolio(page);
  const requests: {
    mensaje: string;
    idioma: string;
    historial: { role: string; content: string }[];
  }[] = [];
  await page.route('**/api/v1/chat/', async (route) => {
    const body = route.request().postDataJSON();
    requests.push(body);
    await route.fulfill({
      contentType: 'application/json',
      headers: { 'access-control-allow-origin': '*' },
      body: JSON.stringify({
        respuesta: body.idioma === 'en' ? 'Hi Juan, I am Aubar.' : '¡Hola, Juan! Soy Aubar.',
      }),
    });
  });
  const launcher = page.getByRole('button', { name: 'Hablar con Aubar', exact: true });
  await launcher.click();
  const panel = page.locator('#aubar-panel');
  await expect(panel).toBeVisible();
  await expect(panel.getByRole('button', { name: /Angular|Django|contactarlo/ })).toHaveCount(3);
  const input = panel.getByRole('textbox', { name: 'Mensaje para Aubar' });
  await expect(input).toBeFocused();
  await input.fill('Hola, soy Juan');
  await input.press('Enter');
  await expect(panel.locator('.chat-message:not(.from-user)')).toContainText(
    '¡Hola, Juan! Soy Aubar.',
  );
  await input.fill('¿Y qué proyectos tiene con Angular?');
  await panel.getByRole('button', { name: 'Enviar mensaje', exact: true }).click();
  await expect.poll(() => requests.length).toBe(2);
  expect(requests[1].historial).toEqual([
    { role: 'user', content: 'Hola, soy Juan' },
    { role: 'assistant', content: '¡Hola, Juan! Soy Aubar.' },
  ]);
  expect(requests[0].idioma).toBe('es');
  await expect(panel.locator('.chat-loading')).toHaveCount(0);
  const bounds = await panel.boundingBox();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(page.viewportSize()!.width);
  expect(bounds!.y).toBeGreaterThanOrEqual(0);
  await page.screenshot({ path: info.outputPath('aubar-dark.png') });
  await input.press('Escape');
  await expect(panel).toHaveCount(0);
  await expect(launcher).toBeFocused();
  if (page.viewportSize()!.width <= 760) await page.locator('.menu-toggle').click();
  await page.locator('.language-toggle').click();
  if (page.viewportSize()!.width <= 760) await page.locator('.menu-toggle').click();
  await page.getByRole('button', { name: 'Chat with Aubar', exact: true }).click();
  await panel.getByRole('button', { name: 'New conversation', exact: true }).click();
  await expect(panel.locator('.chat-message')).toHaveCount(0);
  await panel.getByRole('button', { name: 'What projects has Nahuel built with Angular?' }).click();
  await expect(panel.locator('.chat-message:not(.from-user)')).toContainText(
    'Hi Juan, I am Aubar.',
  );
  expect(requests.at(-1)!.idioma).toBe('en');
  expect(requests.at(-1)!.historial).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('Aubar retries failed messages once and renders replies as text', async ({ page }) => {
  await openPortfolio(page);
  let calls = 0;
  const attack = '<img src=x onerror="window.aubarAttack=true">';
  await page.route('**/api/v1/chat/', async (route) => {
    calls++;
    await route.fulfill({
      status: calls === 1 ? 503 : 200,
      contentType: 'application/json',
      headers: { 'access-control-allow-origin': '*' },
      body: JSON.stringify(calls === 1 ? { codigo: 'AUBAR_NO_DISPONIBLE' } : { respuesta: attack }),
    });
  });
  await page.getByRole('button', { name: 'Hablar con Aubar', exact: true }).click();
  const panel = page.locator('#aubar-panel');
  await panel.getByRole('button', { name: '¿Tiene experiencia con Django?' }).click();
  await expect(panel.getByRole('alert')).toContainText('No pude responder');
  await panel.getByRole('button', { name: 'Reintentar', exact: true }).click();
  await expect(panel.locator('.chat-message:not(.from-user)')).toContainText(attack);
  expect(calls).toBe(2);
  await expect(panel.locator('.from-user')).toHaveCount(1);
  await expect(panel.locator('img')).toHaveCount(0);
  expect(await page.evaluate(() => 'aubarAttack' in window)).toBe(false);
  await panel.getByRole('link', { name: 'Contacto', exact: true }).click();
  await expect(panel).toHaveCount(0);
  await expect(page).toHaveURL(/#contacto$/);
});
