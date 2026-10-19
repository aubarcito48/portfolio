import { LanguageService } from '../../service/language.service';
import { Component, computed, inject } from '@angular/core';
import { PortfolioApiService } from '../../service/portfolio-api.service';
import { portfolioContent } from '../../shared/data/profile.data';

@Component({
  selector: 'app-home-section',
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeSection {
  protected readonly i18n = inject(LanguageService);
  protected readonly content = portfolioContent.home;
  private readonly portfolioApi = inject(PortfolioApiService);
  protected readonly profile = this.portfolioApi.profile;
  protected readonly links = this.portfolioApi.links;
  protected readonly profileSummary = computed(() => {
    const profile = this.profile();
    return profile.status === 'success' ? (profile.data.biography.split(/\n\s*\n/)[0] ?? '') : '';
  });
  protected readonly nameParts = computed(() => {
    const profile = this.profile();
    if (profile.status !== 'success') {
      return null;
    }

    const [firstName = '', ...lastName] = profile.data.name.trim().split(/\s+/);
    return { firstName, lastName: lastName.join(' ') };
  });

  protected retryProfile(): void {
    this.portfolioApi.loadProfile();
  }

  protected retryLinks(): void {
    this.portfolioApi.loadLinks();
  }
}
