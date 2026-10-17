import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-site-header',
  templateUrl: './site-header.html',
  styleUrl: './site-header.css',
})
export class SiteHeader {
  readonly theme = input.required<'dark' | 'light'>();
  readonly themeToggle = output<void>();
}
