import { Component, signal } from '@angular/core';
import { AboutSection } from './pages/about/about';
import { HomeSection } from './pages/home/home';
import { SiteFooter } from './shared/components/site-footer/site-footer';
import { SiteHeader } from './shared/components/site-header/site-header';
import { PortfolioSlider } from './shared/components/portfolio-slider/portfolio-slider';

@Component({
  selector: 'app-root',
  imports: [AboutSection, HomeSection, PortfolioSlider, SiteFooter, SiteHeader],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly theme = signal<'dark' | 'light'>('dark');

  protected toggleTheme(): void {
    this.theme.update((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
  }
}
