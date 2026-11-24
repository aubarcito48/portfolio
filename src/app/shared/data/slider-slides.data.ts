export interface SliderSlide {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  link: { label: string; url: string } | null;
  banner?: { preview: string };
}

export const sliderSlides: readonly SliderSlide[] = [
  {
    title: 'Presentación personal',
    description: '',
    image: '/assets/github/cielo-nocturno.gif',
    imageAlt: 'Nubes sobre un campo bajo el cielo nocturno',
    banner: {
      preview: '/assets/github/cielo-nocturno.png',
    },
    link: null,
  },
  {
    title: 'PintaEbook',
    description:
      'Una plataforma para escribir, organizar y dar forma a tus libros y ebooks. Desarrollada en equipo junto a ISPC / ProCoders.',
    image: '/assets/pintaebook.png',
    imageAlt: 'Página de inicio de PintaEbook con su presentación y navegación',
    link: {
      label: 'Ver demo de PintaEbook',
      url: 'https://pinta-ebook-eta.vercel.app/',
    },
  },
  {
    title: 'StitchWeather',
    description:
      'Consultá el clima y el pronóstico de tu ciudad, recibí recomendaciones con IA y escuchá los consejos de Isa, una asistente virtual animada.',
    image: '/assets/stitchweather.png',
    imageAlt: 'Interfaz de StitchWeather con búsqueda de ciudades, pronóstico y la asistente virtual Isa',
    link: { label: 'Explorar StitchWeather', url: 'https://app-clima-ecru.vercel.app/' },
  },
  {
    title: 'Desarrollo web en la DGES',
    description:
      'Durante mi pasantía junto al ISPC, participé en la actualización y reorganización del sitio institucional con WordPress, mejorando la navegación y el acceso a la información.',
    image: '/assets/dges.png',
    imageAlt: 'Página de inicio del sitio institucional de la Dirección General de Educación Superior',
    link: { label: 'Ver sitio de la DGES', url: 'https://dges-cba.edu.ar/wp/' },
  },
];
