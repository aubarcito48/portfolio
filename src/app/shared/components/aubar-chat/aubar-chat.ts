import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  afterRenderEffect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AubarChatService, ChatMessage } from '../../../service/aubar-chat.service';
import { LanguageService } from '../../../service/language.service';
import { WhatsappLink } from '../whatsapp-link/whatsapp-link';

@Component({
  selector: 'app-aubar-chat',
  imports: [FormsModule, WhatsappLink],
  templateUrl: './aubar-chat.html',
  styleUrl: './aubar-chat.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.is-open]': 'open()' },
})
export class AubarChat {
  protected readonly i18n = inject(LanguageService);
  protected readonly open = signal(false);
  protected readonly messages = signal<(ChatMessage & { id: number })[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal('');
  protected readonly suggestions = [
    '¿Qué proyectos hizo Nahuel con Angular?',
    '¿Qué experiencia laboral tiene Nahuel?',
    '¿Dónde puedo contactarlo?',
  ];
  protected draft = '';
  private readonly api = inject(AubarChatService);
  private readonly launcher = viewChild<ElementRef<HTMLButtonElement>>('launcher');
  private readonly input = viewChild<ElementRef<HTMLTextAreaElement>>('messageInput');
  private readonly log = viewChild<ElementRef<HTMLElement>>('messageLog');
  private subscription?: Subscription;
  private nextId = 0;
  private failedMessage = '';

  constructor() {
    inject(DestroyRef).onDestroy(() => this.subscription?.unsubscribe());
    afterNextRender(() => {
      if (!window.matchMedia('(min-width: 1280px)').matches) return;
      try {
        if (window.localStorage.getItem('portfolio-aubar-welcomed') === '1') return;
        window.localStorage.setItem('portfolio-aubar-welcomed', '1');
      } catch {
        // When storage is blocked, the welcome is limited to this page load.
      }
      this.open.set(true);
    });
    afterRenderEffect(() => {
      if (this.open()) this.input()?.nativeElement.focus();
    });
    afterRenderEffect(() => {
      this.messages();
      this.loading();
      const log = this.log()?.nativeElement;
      if (log) log.scrollTop = log.scrollHeight;
    });
  }

  protected close(): void {
    this.open.set(false);
    this.launcher()?.nativeElement.focus();
  }

  protected reset(): void {
    if (this.loading()) return;
    this.messages.set([]);
    this.error.set('');
    this.failedMessage = '';
    this.draft = '';
    this.input()?.nativeElement.focus();
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      this.send();
    }
  }

  protected retry(): void {
    this.send(this.failedMessage, true);
  }

  protected send(value = this.draft, retry = false): void {
    const text = value.trim();
    if (!text || text.length > 1200 || this.loading()) return;
    const previous = retry ? this.messages().slice(0, -1) : this.messages();
    const history: ChatMessage[] = previous
      .slice(-8)
      .map(({ role, content }) => ({ role, content: content.slice(0, 2000) }));
    while (history.reduce((sum, item) => sum + item.content.length, 0) > 6000) history.shift();
    if (!retry)
      this.messages.update((items) => [
        ...items.slice(-39),
        { id: this.nextId++, role: 'user', content: text },
      ]);
    this.draft = '';
    this.error.set('');
    this.loading.set(true);
    this.failedMessage = text;
    this.subscription = this.api.send(text, history, this.i18n.language()).subscribe({
      next: (content) => {
        this.messages.update((items) => [
          ...items,
          { id: this.nextId++, role: 'assistant', content },
        ]);
        this.loading.set(false);
        this.failedMessage = '';
      },
      error: (error: unknown) => {
        this.loading.set(false);
        this.error.set(
          error instanceof HttpErrorResponse && error.status === 429
            ? 'Aubar está ocupado. Esperá un minuto y volvé a intentar.'
            : 'No pude responder en este momento. Podés reintentar o usar los enlaces de contacto.',
        );
      },
    });
  }
}
