import { expect, test, type Locator } from '@playwright/test';
import { openPortfolio } from './test-setup';

test.describe('[CP07] external project and contact destinations', () => {
  test.beforeEach(async ({ page }) => {
    await openPortfolio(page);
  });

  test('exposes the configured destinations without requesting external services', async ({
    page,
  }) => {
    const pintaEbook = page.getByRole('article', { name: 'PintaEbook' });
    const dges = page.getByRole('article', { name: 'DGES' });
    const heroSocials = page.locator('.hero-socials');
    const contactLinks = page.getByRole('navigation', { name: 'Perfiles de contacto' });
    const destinations: Array<{ link: Locator; href: string }> = [
      {
        link: pintaEbook.getByRole('link', { name: 'Ver demo' }),
        href: 'https://pinta-ebook-eta.vercel.app/',
      },
      {
        link: pintaEbook.getByRole('link', { name: 'Frontend' }),
        href: 'https://github.com/ISPC-ProCoders-2026/PintaEbook',
      },
      {
        link: pintaEbook.getByRole('link', { name: 'Backend' }),
        href: 'https://github.com/ISPC-ProCoders-2026/Pintaebook_backend',
      },
      { link: dges.getByRole('link', { name: 'Ver sitio' }), href: 'https://dges-cba.edu.ar/wp/' },
      {
        link: dges.getByRole('link', { name: 'Repositorio' }),
        href: 'https://github.com/ispc-pasantia-2025',
      },
      {
        link: heroSocials.getByRole('link', { name: 'GitHub' }),
        href: 'https://github.com/aubarcito48',
      },
      {
        link: heroSocials.getByRole('link', { name: 'LinkedIn' }),
        href: 'https://www.linkedin.com/in/aubar48/',
      },
      {
        link: contactLinks.getByRole('link', { name: 'GitHub' }),
        href: 'https://github.com/aubarcito48',
      },
      {
        link: contactLinks.getByRole('link', { name: 'LinkedIn' }),
        href: 'https://www.linkedin.com/in/aubar48/',
      },
    ];

    for (const { link, href } of destinations) {
      await expect(link).toHaveAttribute('href', href);
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
      await expect(link).toHaveAttribute('rel', /noreferrer/);
    }
  });
});
