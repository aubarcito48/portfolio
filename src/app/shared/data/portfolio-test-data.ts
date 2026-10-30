import {
  Education,
  Experience,
  PaginatedResponse,
  ProfessionalLink,
  Profile,
  Project,
  TechnologyGroup,
} from '../../models/portfolio.models';

export const testProfile: Profile = {
  name: 'Nahuel Argandoña',
  specialty: 'Full-Stack Developer | Software Development | QA & Testing',
  introduction: 'Soy desarrollador de software de Córdoba, Argentina, y actualmente curso la Tecnicatura Superior en Desarrollo de Software en el Instituto Superior Politécnico de Córdoba (ISPC).',
  biography:
    "Me gusta crear aplicaciones web y encontrar soluciones a problemas técnicos. En mis proyectos combino frontend y backend, integro APIs e inteligencia artificial, desarrollo chatbots para WhatsApp con la API de Meta y conecto formularios con servicios de correo. También exploro soluciones IoT con ESP32 y cuento con experiencia en WordPress y soporte técnico informático.\n\nHoy busco seguir creciendo como desarrollador, mejorar la calidad de lo que construyo con pruebas automatizadas y aportar a proyectos reales.\n\nTeléfono: 3517587047\n\nCorreo: nahuel.cba.48@gmail.com",
  location: 'Córdoba, Argentina',
  photo: '/assets/nahuel.jpg',
};

export const testTechnologyGroups: TechnologyGroup[] = [
  {
    name: 'Frontend',
    technologies: [
      { name: 'JavaScript', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
      { name: 'TypeScript', url: 'https://www.typescriptlang.org/docs/' },
      { name: 'Angular', url: 'https://angular.dev/overview' },
      { name: 'React', url: 'https://react.dev/learn' },
      { name: 'HTML5', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML' },
      { name: 'CSS3', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS' },
      { name: 'Tailwind CSS', url: 'https://tailwindcss.com/docs' },
      { name: 'Bootstrap', url: 'https://getbootstrap.com/docs/' },
    ],
  },
  {
    name: 'Backend',
    technologies: [
      { name: 'Python', url: 'https://docs.python.org/3/' },
      { name: 'Django', url: 'https://docs.djangoproject.com/en/stable/' },
      { name: 'Node.js', url: 'https://nodejs.org/en/learn' },
      { name: 'Express', url: 'https://expressjs.com/' },
      { name: 'PHP', url: 'https://www.php.net/manual/en/' },
      { name: 'WordPress', url: 'https://developer.wordpress.org/' },
      { name: 'REST APIs', url: 'https://developer.mozilla.org/en-US/docs/Glossary/REST' },
    ],
  },
  {
    name: 'Bases de datos y herramientas',
    technologies: [
      { name: 'MySQL', url: 'https://dev.mysql.com/doc/' },
      { name: 'MongoDB', url: 'https://www.mongodb.com/docs/' },
      { name: 'Git', url: 'https://git-scm.com/doc' },
      { name: 'GitHub', url: 'https://docs.github.com/' },
    ],
  },
  {
    name: 'Calidad de software',
    technologies: [
      { name: 'Cypress', url: 'https://docs.cypress.io/' },
      { name: 'Playwright', url: 'https://playwright.dev/docs/intro' },
    ],
  },
];

export const testExperiences: Experience[] = [];

export const testEducation: Education[] = [
  {
    name: 'Tecnicatura Superior en Desarrollo de Software',
    institution: 'Instituto Superior Politécnico de Córdoba · En curso',
    type: 'study',
    status: 'in_progress',
    startDate: '2022-03-01',
    endDate: null,
    url: null,
  },
  {
    name: 'Junior Full Stack Developer',
    institution: 'Instituto Superior Politécnico de Córdoba (ISPC)',
    type: 'certification',
    status: 'completed',
    startDate: '2024-01-01',
    endDate: '2024-12-01',
    url: 'https://example.com/certificate.pdf',
  },
];

export const testProjects: Project[] = [
  {
    name: 'PintaEbook',
    slug: 'pintaebook',
    summary: 'Plataforma de libros y ebooks.',
    type: 'Proyecto en equipo',
    image: '/assets/pintaebook.png',
    imageAlt: 'Página de inicio de PintaEbook con su presentación y navegación',
    description:
      'Plataforma de libros y ebooks desarrollada como parte del equipo ISPC / ProCoders. El proyecto integra trabajo de frontend y backend, APIs, autenticación y funcionalidades asistidas por inteligencia artificial.',
    technologies: ['Angular', 'Python', 'Django', 'REST APIs', 'Git', 'GitHub'],
    links: [
      { label: 'Ver demo', url: 'https://pinta-ebook-eta.vercel.app/' },
      { label: 'Frontend', url: 'https://github.com/ISPC-ProCoders-2026/PintaEbook' },
      { label: 'Backend', url: 'https://github.com/ISPC-ProCoders-2026/Pintaebook_backend' },
    ],
  },
  {
    name: 'DGES',
    slug: 'dges',
    summary: 'Sitio institucional de la DGES.',
    type: 'Pasantía · Proyecto en equipo',
    image: '/assets/dges.png',
    imageAlt:
      'Página de inicio del sitio institucional de la Dirección General de Educación Superior',
    description:
      'Proyecto de actualización y reorganización del sitio institucional de la DGES, orientado a mejorar el acceso a la información, la experiencia de navegación y la adaptación a distintos dispositivos.',
    technologies: ['PHP', 'WordPress', 'HTML', 'CSS', 'REST APIs', 'AJAX'],
    links: [
      { label: 'Ver sitio', url: 'https://dges-cba.edu.ar/wp/' },
      { label: 'Repositorio', url: 'https://github.com/ispc-pasantia-2025' },
    ],
  },
];

export const testLinks: ProfessionalLink[] = [
  { label: 'GitHub', type: 'github', url: 'https://github.com/aubarcito48' },
  { label: 'LinkedIn', type: 'linkedin', url: 'https://www.linkedin.com/in/aubar48/' },
];

export function testPage<T>(results: T[]): PaginatedResponse<T> {
  return { count: results.length, next: null, previous: null, results };
}
