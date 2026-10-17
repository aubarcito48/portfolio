import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { portfolioContent, profile } from '../../data/profile.data';
import { focusChillConfig } from '../../data/focus-chill.data';

@Component({
  selector: 'app-site-footer',
  templateUrl: './site-footer.html',
  styleUrl: './site-footer.css',
})
export class SiteFooter {
  protected readonly content = portfolioContent.about;
  protected readonly links = profile.links;
  protected readonly focusChill = focusChillConfig;
  private readonly sanitizer = inject(DomSanitizer);
  protected readonly spotifyEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    this.createSpotifyEmbedUrl(focusChillConfig.spotifyUrl),
  );

  private createSpotifyEmbedUrl(spotifyUrl: string): string {
    const url = new URL(spotifyUrl);
    const segments = url.pathname.split('/').filter(Boolean);
    const trackIndex = segments.findIndex((segment) => segment === 'track');
    const trackId = segments[trackIndex + 1];

    if (url.protocol !== 'https:' || url.hostname !== 'open.spotify.com' || !trackId) {
      throw new Error('La URL de Spotify configurada debe apuntar a una canción.');
    }

    const embedUrl = new URL(`https://open.spotify.com/embed/track/${trackId}`);
    if (focusChillConfig.autoplay) {
      embedUrl.searchParams.set('autoplay', '1');
      embedUrl.searchParams.set('start', '0');
    }

    return embedUrl.toString();
  }
}
