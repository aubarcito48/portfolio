import type { Page } from '@playwright/test';
import { environment } from '../src/app/config/environment';
import {
  testEducation,
  testExperiences,
  testLinks,
  testPage,
  testProfile,
  testProjects,
  testTechnologyGroups,
} from '../src/app/shared/data/portfolio-test-data';
import type { Profile } from '../src/app/shared/data/portfolio.models';

interface PortfolioOptions {
  profile?: Profile;
  profileFailures?: number;
}

export async function openPortfolio(page: Page, options: PortfolioOptions = {}): Promise<void> {
  await page.route(
    /^https:\/\/(open\.spotify\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)\//,
    (route) => route.abort(),
  );
  const apiBase = new URL(environment.apiBaseUrl);
  let profileFailures = options.profileFailures ?? 0;
  const responses = new Map<string, unknown>([
    ['/perfil/', options.profile ?? testProfile],
    ['/tecnologias/', testPage(testTechnologyGroups)],
    ['/experiencias/', testPage(testExperiences)],
    ['/formacion/', testPage(testEducation)],
    ['/proyectos/', testPage(testProjects)],
    ['/enlaces/', testPage(testLinks)],
  ]);

  await page.route(`${environment.apiBaseUrl}/**`, async (route) => {
    const requestUrl = new URL(route.request().url());
    const path = requestUrl.pathname.slice(apiBase.pathname.length);

    if (path === '/perfil/' && profileFailures > 0) {
      profileFailures -= 1;
      await route.fulfill({
        status: 503,
        contentType: 'application/json',
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ detail: 'Servicio temporalmente no disponible.' }),
      });
      return;
    }

    const body = responses.get(path);
    if (body === undefined) {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ detail: 'No se encontró el recurso.' }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(body),
    });
  });

  const apiResponses = [
    '/perfil/',
    '/tecnologias/',
    '/experiencias/',
    '/formacion/',
    '/proyectos/',
    '/enlaces/',
  ].map((path) =>
    page.waitForResponse(
      (response) => new URL(response.url()).pathname === `${apiBase.pathname}${path}`,
    ),
  );

  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await Promise.all(apiResponses);
  await page.waitForFunction(
    () =>
      !Array.from(document.querySelectorAll('.portfolio-status')).some((status) =>
        status.textContent?.includes('Cargando'),
      ),
  );
}
