import { LanguageService } from '../../service/language.service';
import { Component, computed, inject } from '@angular/core';
import { portfolioContent } from '../../shared/data/profile.data';
import { PortfolioApiService } from '../../service/portfolio-api.service';

@Component({
  selector: 'app-about-section',
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class AboutSection {
  protected readonly i18n = inject(LanguageService);
  protected readonly content = portfolioContent.about;
  private readonly portfolioApi = inject(PortfolioApiService);
  protected readonly profile = this.portfolioApi.profile;
  protected readonly experiences = this.portfolioApi.experiences;
  protected readonly education = this.portfolioApi.education;
  protected readonly technologies = this.portfolioApi.technologies;
  protected readonly projects = this.portfolioApi.projects;
  protected readonly biographyParagraphs = computed(() => {
    const profile = this.profile();
    return profile.status === 'success'
      ? profile.data.biography.split(/\n\s*\n/).filter((paragraph) => paragraph.trim())
      : [];
  });
  protected retryProfile(): void {
    this.portfolioApi.loadProfile();
  }

  protected retryExperiences(): void {
    this.portfolioApi.loadExperiences();
  }

  protected retryEducation(): void {
    this.portfolioApi.loadEducation();
  }

  protected retryTechnologies(): void {
    this.portfolioApi.loadTechnologies();
  }

  protected retryProjects(): void {
    this.portfolioApi.loadProjects();
  }

  protected formatDate(value: string): string {
    const [year, month, day] = value.split('-').map(Number);
    return new Intl.DateTimeFormat(this.i18n.language() === 'en' ? 'en-US' : 'es-AR', { year: 'numeric', month: 'long' }).format(
      new Date(year, month - 1, day),
    );
  }
}
