import { providePortfolioTranslations } from './service/language.service';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { App } from './app';
import { createLoadedApp } from './shared/data/portfolio-app-test-helpers';

describe('App', () => {
  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [providePortfolioTranslations(), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('should create the app', async () => {
    const fixture = await createLoadedApp();
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the profile introduction and accessible portrait', async () => {
    const fixture = await createLoadedApp();
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

  it('should provide a skip link and a coherent heading order', async () => {
    const fixture = await createLoadedApp();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const skipLink = compiled.querySelector<HTMLAnchorElement>('.skip-link');
    const main = compiled.querySelector<HTMLElement>('#contenido');
    const headings = Array.from(compiled.querySelectorAll('h1, h2, h3'));

    expect(skipLink?.getAttribute('href')).toBe('#contenido');
    expect(main?.tabIndex).toBe(-1);
    expect(headings[0]?.tagName).toBe('H1');
    expect(headings.filter((heading) => heading.tagName === 'H1')).toHaveLength(1);
    expect(
      Array.from(compiled.querySelectorAll('img')).every((image) =>
        image.alt.length > 0 ||
        (image.hasAttribute('alt') && !!image.closest('a[aria-label], [aria-hidden="true"]')),
      ),
    ).toBe(true);
  });

  it('should provide the optional Spotify track player in the footer without autoplay', async () => {
    const fixture = await createLoadedApp();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const section = compiled.querySelector('.focus-chill-section');
    const player = section?.querySelector<HTMLIFrameElement>('iframe');
    const spotifyLink = section?.querySelector<HTMLAnchorElement>('a');

    expect(section?.closest('footer')).toBeTruthy();
    expect(section?.textContent).not.toContain('Focus & Chill');
    expect(section?.textContent).not.toContain('Un momento para bajar un cambio');
    expect(section?.textContent).not.toContain(
      'Si te gusta, escuchá esta canción mientras recorrés el portfolio.',
    );
    expect(player?.getAttribute('src')).toBe(
      'https://open.spotify.com/embed/track/7upAH0ezzsThyvr33YKn4u?autoplay=1&start=0',
    );
    expect(player?.title).toBe('Reproductor de Spotify: Pasos Al Costado de Turf');
    expect(player?.getAttribute('loading')).toBe('lazy');
    expect(player?.getAttribute('src')).toContain('autoplay=1');
    expect(player?.getAttribute('src')).toContain('start=0');
    expect(player?.getAttribute('allow')).toContain('autoplay');
    expect(spotifyLink?.href).toBe(
      'https://open.spotify.com/intl-es/track/7upAH0ezzsThyvr33YKn4u?si=28f3020c45534233',
    );
  });

  it('should render the photo slider before the profile introduction', async () => {
    const fixture = await createLoadedApp();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const slider = compiled.querySelector('app-portfolio-slider');
    const hero = compiled.querySelector('app-home-section');

    expect(slider).toBeTruthy();
    expect(slider?.nextElementSibling).toBe(hero);
    expect(slider?.querySelectorAll('.slider-slide')).toHaveLength(3);
    expect(
      Array.from(slider?.querySelectorAll('.slider-slide img') ?? []).map((image) =>
        image.getAttribute('src'),
      ),
    ).toEqual([
      '/assets/bandera-argentina.png',
      '/assets/morgan.png',
      '/assets/nahuel-carrousel.png',
    ]);
    expect(slider?.textContent).toContain('Desarrollador Full Stack');
    expect(slider?.textContent).toContain('Calidad de software');
    expect(slider?.querySelector('a[href="https://pinta-ebook-eta.vercel.app/"]')).toBeTruthy();
    const slides = slider?.querySelectorAll<HTMLElement>('.slider-slide');
    expect(slides?.[1].querySelector('.slide-title')?.textContent).toContain('PintaEbook');
    expect(slides?.[1].querySelector('img')?.getAttribute('src')).toBe('/assets/morgan.png');
    expect(slides?.[2].querySelector('.slide-title')?.textContent).toContain('Calidad de software');
    expect(slides?.[2].querySelector('img')?.getAttribute('src')).toBe(
      '/assets/nahuel-carrousel.png',
    );
    expect(slides?.[2].querySelector('.slide-link')).toBeNull();
    expect(slider?.querySelector('.slider-watermark')?.textContent?.trim()).toBe('dev nahuel');
    expect(compiled.querySelector('footer .footer-watermark')).toBeNull();
    expect(slider?.querySelector('.slider-window .slider-track')).toBeTruthy();
    expect(slider?.querySelector('.slider-window .slider-controls')).toBeTruthy();
    expect(slider?.querySelector('.slider-autoplay-toggle')?.getAttribute('aria-pressed')).toBe(
      'false',
    );
  });

  it('should navigate slider slides with buttons, indicators, and arrow keys', async () => {
    const fixture = await createLoadedApp();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const slider = compiled.querySelector<HTMLElement>('.slider-section');

    expect(slider?.querySelector('[aria-current="true"]')?.getAttribute('aria-label')).toContain(
      'diapositiva 1',
    );
    slider?.querySelector<HTMLButtonElement>('[aria-label="Diapositiva siguiente"]')?.click();
    fixture.detectChanges();
    expect(slider?.querySelector('[aria-current="true"]')?.getAttribute('aria-label')).toContain(
      'diapositiva 2',
    );
    expect(slider?.querySelector('.slider-track')?.getAttribute('style')).toContain(
      'translate3d(-100%, 0, 0)',
    );

    slider?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    expect(slider?.querySelector('[aria-current="true"]')?.getAttribute('aria-label')).toContain(
      'diapositiva 3',
    );

    slider?.querySelector<HTMLButtonElement>('[aria-label^="Mostrar diapositiva 1"]')?.click();
    fixture.detectChanges();
    expect(slider?.querySelector('[aria-current="true"]')?.getAttribute('aria-label')).toContain(
      'diapositiva 1',
    );
  });

  it('should let users pause and resume automatic slider movement', async () => {
    const fixture = await createLoadedApp();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const toggle = compiled.querySelector<HTMLButtonElement>('.slider-autoplay-toggle');

    expect(toggle?.getAttribute('aria-label')).toBe('Pausar avance automático');
    toggle?.click();
    fixture.detectChanges();
    expect(toggle?.getAttribute('aria-pressed')).toBe('true');
    expect(toggle?.getAttribute('aria-label')).toBe('Reanudar avance automático');

    toggle?.click();
    fixture.detectChanges();
    expect(toggle?.getAttribute('aria-pressed')).toBe('false');
    expect(toggle?.getAttribute('aria-label')).toBe('Pausar avance automático');
  });

  it('should provide the requested technology groups and section links', async () => {
    const fixture = await createLoadedApp();
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
    const fixture = await createLoadedApp();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const toggle = compiled.querySelector<HTMLButtonElement>('.theme-toggle');

    expect(compiled.querySelector('.site-shell')?.getAttribute('data-theme')).toBe('dark');
    toggle?.click();
    await fixture.whenStable();

    expect(compiled.querySelector('.site-shell')?.getAttribute('data-theme')).toBe('light');
    expect(toggle?.getAttribute('aria-pressed')).toBe('true');
  });

  it('should link directly to the published certificate in a new tab', async () => {
    const fixture = await createLoadedApp();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    const link = compiled.querySelector<HTMLAnchorElement>('a.certificate-button');
    expect(link?.getAttribute('href')).toBe('https://example.com/certificate.pdf');
    expect(link?.target).toBe('_blank');
    expect(link?.relList.contains('noopener')).toBe(true);
    expect(link?.relList.contains('noreferrer')).toBe(true);
    expect(link?.textContent).toContain('Ver certificado');
    expect(compiled.querySelector('dialog')).toBeNull();
  });
});
