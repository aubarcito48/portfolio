import {
  afterNextRender,
  Component,
  ElementRef,
  inject,
  Injector,
  signal,
  viewChild,
} from '@angular/core';
import { portfolioContent } from '../../shared/data/profile.data';

@Component({
  selector: 'app-about-section',
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class AboutSection {
  protected readonly content = portfolioContent.about;
  protected readonly certificateOpen = signal(false);
  private readonly injector = inject(Injector);
  private readonly certificateTrigger = viewChild<ElementRef<HTMLButtonElement>>(
    'certificateTrigger',
  );
  private readonly certificateDialog = viewChild<ElementRef<HTMLDialogElement>>(
    'certificateDialog',
  );

  protected openCertificate(): void {
    this.certificateOpen.set(true);
    afterNextRender(
      () => {
        const dialog = this.certificateDialog()?.nativeElement;
        if (!dialog) {
          throw new Error('No se encontró el diálogo del certificado después de renderizarlo.');
        }
        dialog.showModal();
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

}
