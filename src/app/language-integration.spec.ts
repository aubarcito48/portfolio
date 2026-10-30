import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { App } from './app';
import { providePortfolioTranslations } from './service/language.service';
import { createLoadedApp } from './shared/data/portfolio-app-test-helpers';
import { testEducation, testPage, testProfile, testProjects } from './shared/data/portfolio-test-data';

describe('Portfolio languages', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting(), providePortfolioTranslations()],
    }).compileComponents();
  });

  it('switches interface, API content and dates together, keeping asset paths and links', async () => {
    const fixture = await createLoadedApp();
    const element = fixture.nativeElement as HTMLElement;
    const http = TestBed.inject(HttpTestingController);
    element.querySelector<HTMLButtonElement>('.language-toggle')!.click();
    fixture.detectChanges();
    TestBed.tick();
    const requests = http.match((request) => new URL(request.url).searchParams.get('lang') === 'en');
    expect(requests).toHaveLength(6);
    for (const request of requests) {
      const path = new URL(request.request.url).pathname;
      if (path.endsWith('/perfil/')) {
        request.flush({ ...testProfile, biography: 'I am a software developer from Córdoba, Argentina.' });
      } else if (path.endsWith('/experiencias/')) {
        request.flush(testPage([{
          title: 'Web Development Intern', organization: 'DGES',
          description: 'Worked with WordPress in a professional environment.',
          startDate: '2025-06-01', endDate: null, isCurrent: true,
        }]));
      } else if (path.endsWith('/formacion/')) {
        request.flush(testPage(testEducation.map((item) => ({ ...item, name: 'Software Development' }))));
      } else if (path.endsWith('/proyectos/')) {
        request.flush(testPage(testProjects.map((item) => ({ ...item, description: 'A team project.' }))));
      } else {
        request.flush(testPage([]));
      }
    }
    fixture.detectChanges();
    await fixture.whenStable();
    expect(document.documentElement.lang).toBe('en');
    expect(element.querySelector('#experience-title')?.textContent).toBe('Experience');
    expect(element.querySelector('.biography')?.textContent).toContain('I am a software developer');
    expect(element.querySelector('.experience-item')?.textContent).toContain('Web Development Intern');
    expect(element.querySelector('.experience-dates')?.textContent).toContain('June 2025');
    expect(element.querySelector('.experience-dates')?.textContent).toContain('Present');
    expect(element.querySelector('.slide-title')?.textContent).toBe('Full-Stack Developer');
    expect(element.querySelector('.menu-toggle')?.getAttribute('aria-label')).toBe('Open menu');
    expect(element.querySelector('.hero-portrait img')?.getAttribute('src')).toBe('/assets/nahuel.jpg');
    expect(element.querySelector('.certificate-button')?.getAttribute('target')).toBe('_blank');
    expect(localStorage.getItem('portfolio-language')).toBe('en');
    http.verify();
    fixture.destroy();
  });
});
