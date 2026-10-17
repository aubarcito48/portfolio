import { Component, HostListener, signal } from '@angular/core';
import { portfolioContent } from '../../shared/data/profile.data';

@Component({
  selector: 'app-about-section',
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class AboutSection {
  protected readonly content = portfolioContent.about;
  protected readonly certificateOpen = signal(false);

  protected openCertificate(): void {
    this.certificateOpen.set(true);
  }

  protected closeCertificate(): void {
    this.certificateOpen.set(false);
  }

  protected closeCertificateOnBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeCertificate();
    }
  }

  @HostListener('document:keydown.escape')
  protected closeCertificateOnEscape(): void {
    if (this.certificateOpen()) {
      this.closeCertificate();
    }
  }
}
