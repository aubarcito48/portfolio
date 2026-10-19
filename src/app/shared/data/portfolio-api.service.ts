import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { EMPTY, Observable, catchError, expand, reduce } from 'rxjs';
import { environment } from '../../config/environment';
import {
  Education,
  Experience,
  PaginatedResponse,
  ProfessionalLink,
  Profile,
  Project,
  ResourceState,
  TechnologyGroup,
} from './portfolio.models';

@Injectable({ providedIn: 'root' })
export class PortfolioApiService {
  readonly profile = signal<ResourceState<Profile>>({ status: 'loading' });
  readonly technologies = signal<ResourceState<TechnologyGroup[]>>({ status: 'loading' });
  readonly experiences = signal<ResourceState<Experience[]>>({ status: 'loading' });
  readonly education = signal<ResourceState<Education[]>>({ status: 'loading' });
  readonly projects = signal<ResourceState<Project[]>>({ status: 'loading' });
  readonly links = signal<ResourceState<ProfessionalLink[]>>({ status: 'loading' });

  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = new URL(environment.apiBaseUrl, window.location.origin)
    .toString()
    .replace(/\/+$/, '');
  private readonly requests = new Map<string, { unsubscribe(): void }>();

  loadAll(): void {
    this.loadProfile();
    this.loadTechnologies();
    this.loadExperiences();
    this.loadEducation();
    this.loadProjects();
    this.loadLinks();
  }

  loadProfile(): void {
    this.loadResource(
      'profile',
      this.profile,
      this.http.get<Profile>(this.endpoint('perfil/')),
      true,
    );
  }

  loadTechnologies(): void {
    const request = this.getAllResults<TechnologyGroup>('tecnologias/').pipe(
      reduce(
        (groups, pageGroups) => this.mergeTechnologyGroups(groups, pageGroups),
        [] as TechnologyGroup[],
      ),
    );
    this.loadResource('technologies', this.technologies, request);
  }

  loadExperiences(): void {
    this.loadResource(
      'experiences',
      this.experiences,
      this.getAllResults<Experience>('experiencias/'),
    );
  }

  loadEducation(): void {
    this.loadResource('education', this.education, this.getAllResults<Education>('formacion/'));
  }

  loadProjects(): void {
    this.loadResource('projects', this.projects, this.getAllResults<Project>('proyectos/'));
  }

  loadLinks(): void {
    this.loadResource('links', this.links, this.getAllResults<ProfessionalLink>('enlaces/'));
  }

  getProject(slug: string): Observable<Project> {
    return this.http.get<Project>(this.endpoint(`proyectos/${encodeURIComponent(slug)}/`));
  }

  private endpoint(path: string): string {
    return `${this.apiBaseUrl}/${path}`;
  }

  private getAllResults<T>(path: string): Observable<T[]> {
    return this.http.get<PaginatedResponse<T>>(this.endpoint(path)).pipe(
      expand((page) =>
        page.next ? this.http.get<PaginatedResponse<T>>(this.validateNextPage(page.next)) : EMPTY,
      ),
      reduce((results, page) => results.concat(page.results), [] as T[]),
    );
  }

  private validateNextPage(next: string): string {
    const base = new URL(`${this.apiBaseUrl}/`);
    const pageUrl = new URL(next, base);
    const apiPath = base.pathname.replace(/\/+$/, '');

    if (pageUrl.origin !== base.origin || !pageUrl.pathname.startsWith(`${apiPath}/`)) {
      throw new Error('La API devolvió un enlace de paginación fuera de su origen configurado.');
    }

    return pageUrl.toString();
  }

  private mergeTechnologyGroups(
    existing: TechnologyGroup[],
    incoming: TechnologyGroup[],
  ): TechnologyGroup[] {
    const merged = new Map(existing.map((group) => [group.name, group]));

    for (const group of incoming) {
      const current = merged.get(group.name);
      if (current) {
        current.technologies.push(...group.technologies);
      } else {
        merged.set(group.name, {
          name: group.name,
          technologies: [...group.technologies],
        });
      }
    }

    return Array.from(merged.values());
  }

  private loadResource<T>(
    key: string,
    state: WritableSignal<ResourceState<T>>,
    request: Observable<T>,
    notFoundIsEmpty = false,
  ): void {
    this.requests.get(key)?.unsubscribe();
    state.set({ status: 'loading' });

    const subscription = request
      .pipe(
        catchError((error: unknown) => {
          if (notFoundIsEmpty && error instanceof HttpErrorResponse && error.status === 404) {
            state.set({ status: 'empty' });
            return EMPTY;
          }

          console.error(`No se pudo cargar el recurso público "${key}".`, error);
          state.set({ status: 'error' });
          return EMPTY;
        }),
      )
      .subscribe((data) => state.set({ status: 'success', data }));

    this.requests.set(key, subscription);
  }
}
