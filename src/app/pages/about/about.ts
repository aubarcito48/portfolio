import {
  afterNextRender,
  Component,
  ElementRef,
  inject,
  Injector,
  signal,
  viewChild,
  computed,
} from '@angular/core';
import { portfolioContent } from '../../shared/data/profile.data';
import { PortfolioApiService } from '../../shared/data/portfolio-api.service';

@Component({
  selector: 'app-about-section',
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class AboutSection {
  protected readonly content = portfolioContent.about;
  protected readonly certificateOpen = signal(false);
  protected readonly certificateUrl = signal('');
  protected readonly certificateTitle = signal('');
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
  private readonly injector = inject(Injector);
  private readonly certificateTrigger =
    viewChild<ElementRef<HTMLButtonElement>>('certificateTrigger');
  private readonly certificateDialog =
    viewChild<ElementRef<HTMLDialogElement>>('certificateDialog');

  protected openCertificate(url: string, title: string): void {
    this.certificateUrl.set(url);
    this.certificateTitle.set(title);
    this.certificateOpen.set(true);
    afterNextRender(
      () => {
        const dialog = this.certificateDialog()?.nativeElement;
        if (!dialog) {
          throw new Error('No se encontró el diálogo del certificado después de renderizarlo.');
        }
        dialog.showModal();
      },
      { injector: this.injector },
    );
  }

  protected closeCertificate(): void {
    const dialog = this.certificateDialog()?.nativeElement;
    if (dialog?.open) {
      dialog.close();
    }

    this.certificateOpen.set(false);
    this.certificateTrigger()?.nativeElement.focus();
  }

  protected closeCertificateOnCancel(event: Event): void {
    event.preventDefault();
    this.closeCertificate();
  }

  protected closeCertificateOnBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeCertificate();
    }
  }

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
    return new Intl.DateTimeFormat('es-AR', { year: 'numeric', month: 'long' }).format(
      new Date(year, month - 1, day),
    );
  }
}
