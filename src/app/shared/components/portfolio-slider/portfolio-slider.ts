import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { sliderSlides } from '../../data/slider-slides.data';

@Component({
  selector: 'app-portfolio-slider',
  imports: [NgOptimizedImage],
  templateUrl: './portfolio-slider.html',
  styleUrl: './portfolio-slider.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioSlider {
  protected readonly slides = sliderSlides;
  protected readonly activeIndex = signal(0);
  protected readonly interactionPaused = signal(false);
  protected readonly prefersReducedMotion = signal(false);
  private readonly motionPreference: MediaQueryList | null =
    typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null;
  private readonly destroyRef = inject(DestroyRef);
  private touchStartX: number | null = null;

  constructor() {
    this.prefersReducedMotion.set(this.motionPreference?.matches ?? false);
    const onMotionPreferenceChange = (event: MediaQueryListEvent): void => {
      this.prefersReducedMotion.set(event.matches);
    };
    this.motionPreference?.addEventListener('change', onMotionPreferenceChange);

    const autoplayTimer = window.setInterval(() => {
      if (!this.interactionPaused() && !this.prefersReducedMotion()) {
        this.showNext();
      }
    }, 6000);

    this.destroyRef.onDestroy(() => {
      window.clearInterval(autoplayTimer);
      this.motionPreference?.removeEventListener('change', onMotionPreferenceChange);
    });
  }

  protected showPrevious(): void {
    this.activeIndex.update((index) => (index === 0 ? this.slides.length - 1 : index - 1));
  }

  protected showNext(): void {
    this.activeIndex.update((index) => (index + 1) % this.slides.length);
  }

  protected selectSlide(index: number): void {
    this.activeIndex.set(index);
  }

  protected handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.showPrevious();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.showNext();
    }
  }

  protected pauseForInteraction(): void {
    this.interactionPaused.set(true);
  }

  protected resumeAfterInteraction(): void {
    this.interactionPaused.set(false);
  }

  protected handleFocusOut(event: FocusEvent): void {
    if (event.currentTarget instanceof HTMLElement) {
      const nextTarget = event.relatedTarget;
      if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) {
        return;
      }

      this.resumeAfterInteraction();
    }
  }

  protected startSwipe(event: PointerEvent): void {
    if (event.pointerType !== 'touch') {
      return;
    }

    this.touchStartX = event.clientX;
    if (event.currentTarget instanceof HTMLElement) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  }

  protected finishSwipe(event: PointerEvent): void {
    if (this.touchStartX === null) {
      return;
    }

    const distance = event.clientX - this.touchStartX;
    this.touchStartX = null;

    if (Math.abs(distance) < 45) {
      return;
    }

    if (distance < 0) {
      this.showNext();
    } else {
      this.showPrevious();
    }
  }

  protected cancelSwipe(): void {
    this.touchStartX = null;
  }
}
