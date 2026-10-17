import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the profile introduction and accessible portrait', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('h1')).toHaveLength(1);
    expect(compiled.querySelector('h1')?.textContent).toContain('Nahuel');
    expect(compiled.querySelector('h1')?.textContent).toContain('Argandoña');
    expect(compiled.querySelector('.hero-specialty')?.textContent).toContain('QA & Testing');
    expect(compiled.querySelector('.hero-location')?.textContent).toContain('Córdoba, Argentina');

    const portrait = compiled.querySelector('.hero-portrait img');
    expect(portrait?.getAttribute('src')).toBe('/assets/nahuel.jpg');
    expect(portrait?.getAttribute('alt')).toBe('Retrato de Nahuel Argandoña');
    expect(portrait?.getAttribute('width')).toBe('972');
    expect(portrait?.getAttribute('height')).toBe('1296');
  });

  it('should provide the requested technology groups and section links', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('#sobre-mi')).toBeTruthy();
    expect(compiled.querySelector('#proyectos')).toBeTruthy();
    expect(compiled.querySelector('#contacto')).toBeTruthy();
    expect(compiled.querySelector('#contacto')?.closest('footer')).toBeTruthy();
    expect(compiled.querySelectorAll('.project-card')).toHaveLength(2);
    const projectImages = Array.from(compiled.querySelectorAll('.project-image img'));
    expect(projectImages.map((image) => image.getAttribute('src'))).toEqual([
      '/assets/pintaebook.png',
      '/assets/dges.png',
    ]);
    const dgesTechnologies = Array.from(
      compiled.querySelectorAll('.project-card:nth-child(2) .project-technologies li'),
    ).map((technology) => technology.textContent?.trim());
    expect(dgesTechnologies).toEqual(['PHP', 'WordPress', 'HTML', 'CSS', 'REST APIs', 'AJAX']);
    expect(compiled.textContent).toContain('Junior Full Stack Developer');
    expect(compiled.textContent).toContain('Frontend');
    expect(compiled.textContent).toContain('Backend');
    expect(compiled.textContent).toContain('Bases de datos y herramientas');
    expect(compiled.textContent).toContain('Calidad de software');
    const technologyLinks = Array.from(
      compiled.querySelectorAll<HTMLAnchorElement>('.technology-group li a'),
    );
    expect(technologyLinks).toHaveLength(21);
    expect(technologyLinks.every((link) => link.target === '_blank')).toBe(true);
    expect(technologyLinks.every((link) => link.rel.includes('noopener'))).toBe(true);
    expect(technologyLinks.find((link) => link.textContent?.trim() === 'Angular')?.href).toBe(
      'https://angular.dev/overview',
    );
    expect(compiled.querySelector('a[href="https://github.com/aubarcito48"]')).toBeTruthy();
    expect(compiled.querySelector('a[href="https://www.linkedin.com/in/aubar48/"]')).toBeTruthy();
    expect(compiled.querySelector('a[href="https://pinta-ebook-eta.vercel.app/"]')).toBeTruthy();
    expect(
      compiled.querySelector('a[href="https://github.com/ISPC-ProCoders-2026/PintaEbook"]'),
    ).toBeTruthy();
    expect(
      compiled.querySelector('a[href="https://github.com/ISPC-ProCoders-2026/Pintaebook_backend"]'),
    ).toBeTruthy();
    expect(compiled.querySelector('a[href="https://dges-cba.edu.ar/wp/"]')).toBeTruthy();
    expect(compiled.querySelector('a[href="https://github.com/ispc-pasantia-2025"]')).toBeTruthy();
  });

  it('should toggle between dark and light themes', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const toggle = compiled.querySelector<HTMLButtonElement>('.theme-toggle');

    expect(compiled.querySelector('.site-shell')?.getAttribute('data-theme')).toBe('dark');
    toggle?.click();
    await fixture.whenStable();

    expect(compiled.querySelector('.site-shell')?.getAttribute('data-theme')).toBe('light');
    expect(toggle?.getAttribute('aria-pressed')).toBe('true');
  });

  it('should open and close the Junior Full Stack certificate PDF modal', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    compiled.querySelector<HTMLButtonElement>('.certificate-button')?.click();
    fixture.detectChanges();

    const dialog = compiled.querySelector('[role="dialog"]');
    expect(dialog).toBeTruthy();
    expect(dialog?.querySelector('iframe')?.getAttribute('src')).toBe(
      '/assets/certificado-ispc-nahuel.pdf',
    );
    expect(dialog?.querySelector('a[href="/assets/certificado-ispc-nahuel.pdf"]')).toBeTruthy();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();
    expect(compiled.querySelector('[role="dialog"]')).toBeNull();

    compiled.querySelector<HTMLButtonElement>('.certificate-button')?.click();
    fixture.detectChanges();
    compiled.querySelector<HTMLButtonElement>('.certificate-close')?.click();
    fixture.detectChanges();
    expect(compiled.querySelector('[role="dialog"]')).toBeNull();
  });
});
