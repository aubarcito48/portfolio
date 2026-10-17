import { Component } from '@angular/core';
import { portfolioContent, profile } from '../../shared/data/profile.data';

@Component({
  selector: 'app-home-section',
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeSection {
  protected readonly profile = profile;
  protected readonly content = portfolioContent.home;
}
