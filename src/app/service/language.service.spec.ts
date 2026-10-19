import { TestBed } from '@angular/core/testing';
import { LanguageService, providePortfolioTranslations } from './language.service';
import { messageKeys, messages } from '../shared/data/translations';

describe('LanguageService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [providePortfolioTranslations()] });
  });

  it('defaults to Spanish and restores only supported saved preferences', () => {
    localStorage.setItem('portfolio-language', 'fr');
    const language = TestBed.inject(LanguageService);
    expect(language.language()).toBe('es');
    expect(language.text('Experiencia')).toBe('Experiencia');
    expect(document.documentElement.lang).toBe('es');
  });

  it('restores English and toggles the interface and document language', () => {
    localStorage.setItem('portfolio-language', 'en');
    const language = TestBed.inject(LanguageService);
    expect(language.language()).toBe('en');
    expect(language.text('Experiencia')).toBe('Experience');
    expect(document.documentElement.lang).toBe('en');
    language.toggle();
    expect(language.text('Experiencia')).toBe('Experiencia');
    expect(localStorage.getItem('portfolio-language')).toBe('es');
    expect(document.documentElement.lang).toBe('es');
  });

  it('keeps language switching available when browser storage is blocked', () => {
    const read = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('Blocked', 'SecurityError');
    });
    const write = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Blocked', 'SecurityError');
    });
    try {
      const language = TestBed.inject(LanguageService);
      language.toggle();
      expect(language.text('Reintentar')).toBe('Try again');
      expect(language.language()).toBe('en');
    } finally {
      read.mockRestore();
      write.mockRestore();
    }
  });

  it('has no ambiguous source strings and provides both language versions', () => {
    expect(messageKeys.size).toBe(Object.keys(messages).length);
    for (const pair of Object.values(messages)) {
      expect(pair[0].length).toBeGreaterThan(0);
      expect(pair[1].length).toBeGreaterThan(0);
    }
  });
});
