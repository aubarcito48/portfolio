import { DOCUMENT } from '@angular/common';
import { inject, Injectable, isDevMode, signal } from '@angular/core';
import { provideTransloco, TranslocoService } from '@jsverse/transloco';
import { messageKeys, translations } from '../shared/data/translations';

export type Language = 'es' | 'en';

export function providePortfolioTranslations() {
  return provideTransloco({
    config: {
      availableLangs: ['es', 'en'], defaultLang: 'es', fallbackLang: 'es',
      reRenderOnLangChange: true, prodMode: !isDevMode(),
    },
  });
}

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly transloco = inject(TranslocoService);
  private readonly document = inject(DOCUMENT);
  private readonly selected = signal<Language>('es');
  readonly language = this.selected.asReadonly();

  constructor() {
    this.transloco.setTranslation(translations.es, 'es');
    this.transloco.setTranslation(translations.en, 'en');
    let initial: Language = 'es';
    try {
      if (this.document.defaultView?.localStorage.getItem('portfolio-language') === 'en') {
        initial = 'en';
      }
    } catch { /* A blocked storage must not prevent reading the portfolio. */ }
    this.applyLanguage(initial);
  }

  setLanguage(language: Language): void {
    if (language !== 'es' && language !== 'en') return;
    this.applyLanguage(language);
    try {
      this.document.defaultView?.localStorage.setItem('portfolio-language', language);
    } catch { /* The selected language still works for this visit. */ }
  }

  toggle(): void {
    this.setLanguage(this.language() === 'es' ? 'en' : 'es');
  }

  text(source: string): string {
    const language = this.language();
    const key = messageKeys.get(source);
    return key ? this.transloco.translate<string>(key, {}, language) : source;
  }

  private applyLanguage(language: Language): void {
    this.transloco.setActiveLang(language);
    this.selected.set(language);
    this.document.documentElement.lang = language;
    this.document.querySelector('meta[name="description"]')?.setAttribute(
      'content', this.text('Portfolio de Nahuel Argandoña, desarrollador de software de Córdoba, Argentina.'),
    );
  }
}
