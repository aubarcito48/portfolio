import axe from 'axe-core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { App } from './app';
import { createLoadedApp } from './shared/data/portfolio-app-test-helpers';

describe('Accessibility audit', () => {
  it('has no axe WCAG A/AA structural violations in either color theme', async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    const fixture = await createLoadedApp();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const shell = compiled.querySelector<HTMLElement>('.site-shell');
    const violations: string[] = [];

    for (const theme of ['dark', 'light']) {
      shell?.setAttribute('data-theme', theme);
      const results = await axe.run(compiled, {
        iframes: false,
        rules: {
          'color-contrast': { enabled: false },
        },
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'],
        },
      });
      violations.push(...results.violations.map(({ id }) => `${theme}: ${id}`));
    }

    expect(violations).toEqual([]);
    fixture.destroy();
  });
});
