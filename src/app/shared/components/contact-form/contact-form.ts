import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LanguageService } from '../../../service/language.service';

@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactForm {
  protected readonly i18n = inject(LanguageService);
  private readonly http = inject(HttpClient);
  protected readonly sending = signal(false);
  protected readonly status = signal<'idle' | 'success' | 'error'>('idle');
  protected readonly error = signal('');
  private lastPayload = '';
  private requestId = '';
  protected readonly fields = [
    {
      key: 'nombre',
      label: 'Nombre y apellido',
      type: 'text',
      autocomplete: 'name',
      max: 100,
      placeholder: 'Tu nombre completo',
    },
    {
      key: 'telefono',
      label: 'Teléfono',
      type: 'tel',
      autocomplete: 'tel',
      max: 32,
      placeholder: 'Tu número con código de área',
    },
    {
      key: 'email',
      label: 'Gmail',
      type: 'email',
      autocomplete: 'email',
      max: 254,
      placeholder: 'tuusuario@gmail.com',
    },
    {
      key: 'asunto',
      label: 'Asunto',
      type: 'text',
      autocomplete: 'off',
      max: 160,
      placeholder: '¿De qué te gustaría hablar?',
    },
  ] as const;
  protected readonly form = new FormGroup({
    nombre: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern(/\S/),
        Validators.minLength(2),
        Validators.maxLength(100),
      ],
    }),
    telefono: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(32),
        Validators.pattern(/^\+?[0-9 ()\-.]+$/),
        (control) => {
          const digits = String(control.value).replace(/\D/g, '').length;
          return digits >= 7 && digits <= 15 ? null : { phone: true };
        },
      ],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email, Validators.maxLength(254)],
    }),
    asunto: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern(/\S/),
        Validators.minLength(3),
        Validators.maxLength(160),
      ],
    }),
    mensaje: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern(/\S/),
        Validators.minLength(10),
        Validators.maxLength(3000),
      ],
    }),
    website: new FormControl('', { nonNullable: true }),
  });

  protected invalid(key: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[key];
    return control.invalid && control.touched;
  }

  protected validationMessage(key: keyof typeof this.form.controls): string {
    if (key === 'email') return 'Ingresá un correo electrónico válido.';
    if (key === 'telefono') return 'Ingresá un teléfono válido, con código de área.';
    if (key === 'mensaje') return 'Escribí un mensaje de entre 10 y 3000 caracteres.';
    if (key === 'asunto') return 'Escribí un asunto de entre 3 y 160 caracteres.';
    return 'Ingresá tu nombre y apellido (entre 2 y 100 caracteres).';
  }

  protected submit(): void {
    if (this.sending()) return;
    this.status.set('idle');
    const value = this.form.getRawValue();
    this.form.setValue(
      Object.fromEntries(
        Object.entries(value).map(([key, text]) => [key, text.trim()]),
      ) as typeof value,
    );
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const data = this.form.getRawValue();
    const serialized = JSON.stringify(data);
    if (serialized !== this.lastPayload || !this.requestId) {
      this.lastPayload = serialized;
      this.requestId = crypto.randomUUID();
    }
    this.sending.set(true);
    this.http
      .post<{ codigo: string; campos?: string[] }>(
        `${environment.apiBaseUrl}/contacto/`,
        { ...data, solicitud: this.requestId },
        { timeout: 60000 },
      )
      .pipe(finalize(() => this.sending.set(false)))
      .subscribe({
        next: (result) => {
          if (result?.codigo !== 'MENSAJE_ENVIADO') {
            this.showError();
            return;
          }
          this.form.reset();
          this.lastPayload = this.requestId = '';
          this.status.set('success');
        },
        error: (failure: HttpErrorResponse) => {
          if (failure.status === 400 && Array.isArray(failure.error?.campos)) {
            for (const key of failure.error.campos) this.form.get(key)?.setErrors({ server: true });
          }
          this.showError(failure.status);
        },
      });
  }

  private showError(status?: number): void {
    this.error.set(
      status === 429
        ? 'Se alcanzó el límite de envíos. Probá más tarde o escribime directamente por correo.'
        : status === 400
          ? 'Revisá los campos marcados e intentá de nuevo.'
          : 'No pude confirmar el envío. Tus datos siguen en el formulario: podés reintentar o escribirme por correo.',
    );
    this.status.set('error');
  }
}
