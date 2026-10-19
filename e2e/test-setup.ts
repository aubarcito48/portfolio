import type { Page } from '@playwright/test';
import { environment } from '../src/environments/environment';
import {
  testEducation,
  testExperiences,
  testLinks,
  testPage,
  testProfile,
  testProjects,
  testTechnologyGroups,
} from '../src/app/shared/data/portfolio-test-data';
import type { Profile } from '../src/app/models/portfolio.models';

interface PortfolioOptions {
  profile?: Profile;
  profileFailures?: number;
  profileDelayMs?: number;
  emptyResources?: boolean;
  missingProfile?: boolean;
}

export async function openPortfolio(page: Page, options: PortfolioOptions = {}): Promise<void> {
  await page.route(
    /^https:\/\/(open\.spotify\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)\//,
    (route) => route.abort(),
  );
  const apiBase = new URL(environment.apiBaseUrl);
  let profileFailures = options.profileFailures ?? 0;
  const emptyPage = testPage<unknown>([]);
  const responses = new Map<string, { status: number; body: unknown }>([
    [
      '/perfil/',
      options.missingProfile
        ? { status: 404, body: { detail: 'No hay un perfil publicado.' } }
        : { status: 200, body: options.profile ?? testProfile },
    ],
    [
      '/tecnologias/',
      {
        status: 200,
        body: options.emptyResources ? emptyPage : testPage(testTechnologyGroups),
      },
    ],
    [
      '/experiencias/',
      { status: 200, body: options.emptyResources ? emptyPage : testPage(testExperiences) },
    ],
    [
      '/formacion/',
      { status: 200, body: options.emptyResources ? emptyPage : testPage(testEducation) },
    ],
    [
      '/proyectos/',
      { status: 200, body: options.emptyResources ? emptyPage : testPage(testProjects) },
    ],
    ['/enlaces/', { status: 200, body: options.emptyResources ? emptyPage : testPage(testLinks) }],
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

    const response = responses.get(path);
    if (response === undefined) {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ detail: 'No se encontró el recurso.' }),
      });
      return;
    }

    if (path === '/perfil/' && options.profileDelayMs) {
      await new Promise((resolve) => setTimeout(resolve, options.profileDelayMs));
    }

    await route.fulfill({
      status: response.status,
      contentType: 'application/json',
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(response.body),
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
