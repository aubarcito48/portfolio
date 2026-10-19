import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../config/environment';
import { PortfolioApiService } from './portfolio-api.service';
import {
  testEducation,
  testExperiences,
  testLinks,
  testPage,
  testProfile,
  testProjects,
  testTechnologyGroups,
} from './portfolio-test-data';

describe('PortfolioApiService', () => {
  let api: PortfolioApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PortfolioApiService, provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(PortfolioApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads every public resource from the versioned API endpoints', () => {
    api.loadAll();

    const responses = new Map<string, object>([
      ['/perfil/', testProfile],
      ['/tecnologias/', testPage(testTechnologyGroups)],
      ['/experiencias/', testPage(testExperiences)],
      ['/formacion/', testPage(testEducation)],
      ['/proyectos/', testPage(testProjects)],
      ['/enlaces/', testPage(testLinks)],
    ]);
    const requests = http.match((request) => request.url.startsWith(environment.apiBaseUrl));

    expect(requests).toHaveLength(6);
    for (const request of requests) {
      expect(request.request.method).toBe('GET');
      const path = request.request.url.slice(environment.apiBaseUrl.length);
      const response = responses.get(path);
      if (response === undefined) {
        throw new Error(`No hay una respuesta de prueba para ${path}.`);
      }
      request.flush(response);
    }

    expect(api.profile()).toEqual({ status: 'success', data: testProfile });
    expect(api.technologies()).toEqual({ status: 'success', data: testTechnologyGroups });
    expect(api.experiences()).toEqual({ status: 'success', data: testExperiences });
    expect(api.education()).toEqual({ status: 'success', data: testEducation });
    expect(api.projects()).toEqual({ status: 'success', data: testProjects });
    expect(api.links()).toEqual({ status: 'success', data: testLinks });
  });

  it('follows paginated results and merges technology groups split across pages', () => {
    api.loadTechnologies();
    http.expectOne(`${environment.apiBaseUrl}/tecnologias/`).flush({
      count: 3,
      next: `${environment.apiBaseUrl}/tecnologias/?page=2&page_size=20`,
      previous: null,
      results: [
        { name: 'Frontend', technologies: [{ name: 'Angular', url: 'https://angular.dev' }] },
        { name: 'Backend', technologies: [{ name: 'Django', url: 'https://djangoproject.com' }] },
      ],
    });
    http.expectOne(`${environment.apiBaseUrl}/tecnologias/?page=2&page_size=20`).flush({
      count: 3,
      next: null,
      previous: `${environment.apiBaseUrl}/tecnologias/?page=1&page_size=20`,
      results: [
        {
          name: 'Frontend',
          technologies: [{ name: 'TypeScript', url: 'https://typescriptlang.org' }],
        },
      ],
    });

    expect(api.technologies()).toEqual({
      status: 'success',
      data: [
        {
          name: 'Frontend',
          technologies: [
            { name: 'Angular', url: 'https://angular.dev' },
            { name: 'TypeScript', url: 'https://typescriptlang.org' },
          ],
        },
        { name: 'Backend', technologies: [{ name: 'Django', url: 'https://djangoproject.com' }] },
      ],
    });
  });

  it('offers retry after a failed request and treats a missing profile as an empty state', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    api.loadLinks();
    http
      .expectOne(`${environment.apiBaseUrl}/enlaces/`)
      .flush({ detail: 'No se pudo cargar.' }, { status: 503, statusText: 'Service Unavailable' });
    expect(api.links()).toEqual({ status: 'error' });

    api.loadLinks();
    http.expectOne(`${environment.apiBaseUrl}/enlaces/`).flush(testPage(testLinks));
    expect(api.links()).toEqual({ status: 'success', data: testLinks });

    api.loadProfile();
    http
      .expectOne(`${environment.apiBaseUrl}/perfil/`)
      .flush({ detail: 'No hay perfil publicado.' }, { status: 404, statusText: 'Not Found' });
    expect(api.profile()).toEqual({ status: 'empty' });
    expect(consoleError).toHaveBeenCalledOnce();
    consoleError.mockRestore();
  });

  it('rejects pagination links outside the configured API origin', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    api.loadProjects();
    http.expectOne(`${environment.apiBaseUrl}/proyectos/`).flush({
      count: 2,
      next: 'https://malicious.example/proyectos/?page=2',
      previous: null,
      results: [],
    });

    expect(api.projects()).toEqual({ status: 'error' });
    http.expectNone('https://malicious.example/proyectos/?page=2');
    expect(consoleError).toHaveBeenCalledOnce();
    consoleError.mockRestore();
  });

  it('requests a project detail as an individual object', () => {
    api.getProject('pintaebook').subscribe((project) => {
      expect(project.slug).toBe('pintaebook');
    });

    http.expectOne(`${environment.apiBaseUrl}/proyectos/pintaebook/`).flush(testProjects[0]);
  });
});
