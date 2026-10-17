import { TestBed } from '@angular/core/testing';
import { SiteHeader } from './site-header';

describe('SiteHeader', () => {
  it('opens and closes the mobile navigation accessibly', async () => {
    await TestBed.configureTestingModule({
      imports: [SiteHeader],
    }).compileComponents();

    const fixture = TestBed.createComponent(SiteHeader);
    fixture.componentRef.setInput('theme', 'dark');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const menuButton = compiled.querySelector<HTMLButtonElement>('.menu-toggle');
    const navigation = compiled.querySelector<HTMLElement>('#primary-navigation');

    expect(menuButton?.getAttribute('aria-expanded')).toBe('false');
    expect(menuButton?.getAttribute('aria-label')).toBe('Abrir menú');
    expect(navigation?.classList.contains('is-open')).toBe(false);

    menuButton?.click();
    fixture.detectChanges();

    expect(menuButton?.getAttribute('aria-expanded')).toBe('true');
    expect(menuButton?.getAttribute('aria-label')).toBe('Cerrar menú');
    expect(navigation?.classList.contains('is-open')).toBe(true);

    navigation?.querySelector<HTMLAnchorElement>('a[href="#contacto"]')?.click();
    fixture.detectChanges();

    expect(menuButton?.getAttribute('aria-expanded')).toBe('false');
    expect(navigation?.classList.contains('is-open')).toBe(false);

    menuButton?.click();
    menuButton?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    expect(menuButton?.getAttribute('aria-expanded')).toBe('false');
    expect(navigation?.classList.contains('is-open')).toBe(false);
  });
});
