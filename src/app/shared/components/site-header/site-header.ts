import { LanguageService } from '../../../service/language.service';
import { Component, ElementRef, inject, input, output, signal, viewChild } from '@angular/core';

@Component({
  selector: 'app-site-header',
  templateUrl: './site-header.html',
  styleUrl: './site-header.css',
})
export class SiteHeader {
  protected readonly i18n = inject(LanguageService);
  readonly theme = input.required<'dark' | 'light'>();
  readonly themeToggle = output<void>();
  readonly menuOpen = signal(false);
  private readonly menuToggleButton = viewChild<ElementRef<HTMLButtonElement>>('menuToggleButton');

  toggleMenu(): void {
    this.menuOpen.update((isOpen) => !isOpen);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  closeMenuOnEscape(): void {
    if (!this.menuOpen()) {
      return;
    }

    this.closeMenu();
    this.menuToggleButton()?.nativeElement.focus();
  }
}
