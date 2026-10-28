import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { LanguageService } from '../../../service/language.service';

@Component({
  selector: 'app-section-navigation',
  imports: [],
  templateUrl: './section-navigation.html',
  styleUrl: './section-navigation.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionNavigation {
  protected readonly i18n = inject(LanguageService);
  protected readonly sections = [
    { id: 'inicio', label: 'Inicio', violet: false },
    { id: 'sobre-mi', label: 'Sobre mí', violet: true },
    { id: 'experiencia', label: 'Experiencia', violet: false },
    { id: 'tecnologias', label: 'Tecnologías', violet: true },
    { id: 'proyectos', label: 'Proyectos', violet: false },
    { id: 'contacto', label: 'Contactanos', violet: true },
  ];
  protected readonly activeIndex = signal(0);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      const window = this.document.defaultView;
      if (!window) return;
      const targets = this.sections.map((section) => this.document.getElementById(section.id));
      let frame: number | undefined;
      const update = () => {
        frame = undefined;
        const readingLine =
          (this.document.querySelector('app-site-header')?.getBoundingClientRect().bottom ?? 84) +
          24;
        let current = 0;
        targets.forEach((target, index) => {
          if (target && target.getBoundingClientRect().top <= readingLine) current = index;
        });
        // Short final sections cannot always reach the reading line.
        if (
          window.scrollY > 0 &&
          window.scrollY + window.innerHeight >= this.document.documentElement.scrollHeight - 2
        ) {
          current = this.sections.length - 1;
        }
        this.activeIndex.set(current);
      };
      const schedule = () => {
        frame ??= window.requestAnimationFrame(update);
      };
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule);
      const observer =
        typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(schedule);
      observer?.observe(this.document.body);
      schedule();
      this.destroyRef.onDestroy(() => {
        window.removeEventListener('scroll', schedule);
        window.removeEventListener('resize', schedule);
        observer?.disconnect();
        if (frame !== undefined) window.cancelAnimationFrame(frame);
      });
    });
  }
}
