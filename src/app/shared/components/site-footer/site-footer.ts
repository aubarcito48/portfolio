import { Component } from '@angular/core';
import { portfolioContent, profile } from '../../data/profile.data';

@Component({
  selector: 'app-site-footer',
  templateUrl: './site-footer.html',
  styleUrl: './site-footer.css',
})
export class SiteFooter {
  protected readonly content = portfolioContent.about;
  protected readonly links = profile.links;
}
