import { TestBed } from '@angular/core/testing';
import { LanguageService, providePortfolioTranslations } from '../../../service/language.service';
import { PortfolioSlider } from './portfolio-slider';

describe('Portfolio profile banner', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [PortfolioSlider],
      providers: [providePortfolioTranslations()],
    }).compileComponents();
  });

  it('shows four slides and translates project links and the personal introduction', () => {
    const fixture = TestBed.createComponent(PortfolioSlider);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const dots = root.querySelectorAll<HTMLButtonElement>('.slider-dot');
    expect(dots).toHaveLength(4);
    expect(root.textContent).not.toContain('Calidad de software');
    TestBed.inject(LanguageService).setLanguage('en');
    dots[2].click();
    fixture.detectChanges();
    const weather = root.querySelector<HTMLElement>('.slider-slide[aria-hidden="false"]')!;
    expect(weather.querySelector('.slide-title')?.textContent).toBe('StitchWeather');
    expect(weather.querySelector('img')?.getAttribute('src')).toContain('stitchweather.png');
    expect(weather.querySelector('.slide-description')?.textContent).toContain('AI recommendations');
    expect(weather.querySelector('a')?.textContent).toContain('Explore StitchWeather');
    expect(weather.querySelector('a')?.href).toBe('https://app-clima-ecru.vercel.app/');
    TestBed.inject(LanguageService).setLanguage('es');
    fixture.detectChanges();
    expect(weather.querySelector('a')?.textContent).toContain('Explorar StitchWeather');
    TestBed.inject(LanguageService).setLanguage('en');

    dots[3].click();
    fixture.detectChanges();
    const dges = root.querySelector<HTMLElement>('.slider-slide[aria-hidden="false"]')!;
    expect(dges.querySelector('.slide-title')?.textContent).toBe('Web development at DGES');
    expect(dges.querySelector('.slide-description')?.textContent).toContain('internship through ISPC');
    expect(dges.querySelector('img')?.getAttribute('src')).toBe('/assets/dges.png');
    expect(dges.querySelector('a')?.href).toBe('https://dges-cba.edu.ar/wp/');
    TestBed.inject(LanguageService).setLanguage('es');
    fixture.detectChanges();
    expect(dges.querySelector('.slide-title')?.textContent).toBe('Desarrollo web en la DGES');
    expect(dges.querySelector('a')?.textContent).toContain('Ver sitio de la DGES');
    TestBed.inject(LanguageService).setLanguage('en');
    root.querySelector<HTMLButtonElement>('.slider-arrow-next')!.click();

    dots[0].click();
    fixture.detectChanges();
    const banner = root.querySelector<HTMLElement>('.slider-slide[aria-hidden="false"]')!;
    expect(banner.classList.contains('profile-banner')).toBe(true);
    expect(banner.querySelector('img')?.getAttribute('src')).toContain('cielo-nocturno.gif');
    expect(dots[0].getAttribute('aria-current')).toBe('true');
    expect(dots[0].getAttribute('aria-label')).toContain('Personal introduction');
    expect(banner.querySelector('img')?.getAttribute('src')).toContain('cielo-nocturno.gif');
    expect(banner.querySelector('.slide-content')).toBeNull();
    expect(banner.querySelector('.banner-artwork')).toBeNull();
    expect(banner.querySelector('.profile-name')?.textContent).toBe('Nahuel Argandoña');
    expect(banner.querySelector('.profile-role')?.textContent).toBe('Full-Stack Developer');
    expect(banner.querySelector('.profile-specialties')?.textContent).toContain('Quality');
    expect(banner.querySelector('a[href="https://www.linkedin.com/in/aubar48/"]')).toBeTruthy();
    TestBed.inject(LanguageService).setLanguage('es');
    fixture.detectChanges();
    expect(banner.querySelector('.profile-role')?.textContent).toBe('Desarrollador Full Stack');
    expect(banner.querySelector('.profile-specialties')?.textContent).toContain('Calidad');

    root.querySelector<HTMLButtonElement>('.slider-arrow-next')!.click();
    fixture.detectChanges();
    expect(dots[1].getAttribute('aria-current')).toBe('true');
    expect(banner.querySelector('img')?.getAttribute('src')).toContain('cielo-nocturno.png');
    fixture.destroy();
  });

  it('uses static localized artwork when reduced motion is requested', () => {
    const original = window.matchMedia;
    window.matchMedia = (() => ({
      matches: true,
      addEventListener: () => {},
      removeEventListener: () => {},
    })) as unknown as typeof window.matchMedia;
    const fixture = TestBed.createComponent(PortfolioSlider);
    try {
      fixture.detectChanges();
      const root = fixture.nativeElement as HTMLElement;
      root.querySelectorAll<HTMLButtonElement>('.slider-dot')[0].click();
      fixture.detectChanges();
      expect(root.querySelector('.profile-banner img')?.getAttribute('src')).toContain('cielo-nocturno.png');
      TestBed.inject(LanguageService).setLanguage('en');
      fixture.detectChanges();
      expect(root.querySelector('.profile-banner img')?.getAttribute('src')).toContain('cielo-nocturno.png');
    } finally {
      fixture.destroy();
      window.matchMedia = original;
    }
  });
});
