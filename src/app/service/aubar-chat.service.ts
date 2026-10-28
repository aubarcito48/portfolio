import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Language } from './language.service';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

@Injectable({ providedIn: 'root' })
export class AubarChatService {
  private readonly http = inject(HttpClient);

  send(message: string, history: ChatMessage[], language: Language) {
    return this.http
      .post<unknown>(
        `${environment.apiBaseUrl}/chat/`,
        {
          mensaje: message,
          historial: history,
          idioma: language,
        },
        { timeout: 40000 },
      )
      .pipe(
        map((value) => {
          if (
            !value ||
            typeof value !== 'object' ||
            !('respuesta' in value) ||
            typeof value.respuesta !== 'string' ||
            !value.respuesta.trim() ||
            value.respuesta.length > 4000
          ) {
            throw new Error('Invalid chat response');
          }
          return value.respuesta;
        }),
      );
  }
}
