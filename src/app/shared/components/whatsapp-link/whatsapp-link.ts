import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { LanguageService } from '../../../service/language.service';

@Component({
  selector: 'app-whatsapp-link',
  imports: [],
  templateUrl: './whatsapp-link.html',
  styleUrl: './whatsapp-link.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WhatsappLink {
  protected readonly i18n = inject(LanguageService);
  protected readonly href = computed(
    () =>
      'https://wa.me/5493517587047?text=' +
      encodeURIComponent(this.i18n.text('Hola Nahuel, vi tu portfolio y me gustaría contactarte.')),
  );
}
