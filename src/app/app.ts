import { LanguageService } from './service/language.service';
import { Component, inject, signal } from '@angular/core';
import { AboutSection } from './pages/about/about';
import { HomeSection } from './pages/home/home';
import { SiteFooter } from './shared/components/site-footer/site-footer';
import { SiteHeader } from './shared/components/site-header/site-header';
import { PortfolioSlider } from './shared/components/portfolio-slider/portfolio-slider';
import { PortfolioApiService } from './service/portfolio-api.service';

@Component({
  selector: 'app-root',
  imports: [AboutSection, HomeSection, PortfolioSlider, SiteFooter, SiteHeader],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly i18n = inject(LanguageService);
  protected readonly theme = signal<'dark' | 'light'>('dark');
  private readonly portfolioApi = inject(PortfolioApiService);

  constructor() {
    this.theme.set(this.getInitialTheme());
    this.portfolioApi.loadAll();
  }

  protected toggleTheme(): void {
    const nextTheme = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(nextTheme);

    try {
      window.localStorage.setItem('portfolio-theme', nextTheme);
    } catch (error) {
      if (!(error instanceof DOMException)) {
        throw error;
      }

      console.warn('No se pudo guardar la preferencia de tema en este navegador.', error);
    }
  }

  private getInitialTheme(): 'dark' | 'light' {
    try {
      const savedTheme = window.localStorage.getItem('portfolio-theme');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
      }
    } catch (error) {
      if (!(error instanceof DOMException)) {
        throw error;
      }

      console.warn('No se pudo leer la preferencia de tema en este navegador.', error);
    }

    return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
}
