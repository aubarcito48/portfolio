export const profile = {
  name: 'Nahuel Argandoña',
  firstName: 'Nahuel',
  lastName: 'Argandoña',
  location: 'Córdoba, Argentina',
  specialty: 'Full-Stack Developer | Software Development | QA & Testing',
  photo: '/assets/nahuel.jpg',
  links: {
    github: 'https://github.com/aubarcito48',
    linkedin: 'https://www.linkedin.com/in/aubar48/',
  },
} as const;

export const portfolioContent = {
  home: {
    greeting: 'Hola, soy',
    summary:
      'Desarrollador de software interesado en crear aplicaciones web, resolver problemas técnicos e integrar APIs.',
    locationLabel: 'Ubicación',
    projectsLink: 'Ver proyectos',
    contactLink: 'Contactarme',
    socialLabel: 'También podés encontrarme en',
    portraitCaption: 'Desarrollo de software · Córdoba, AR',
  },
  about: {
    eyebrow: 'Un poco sobre mi recorrido',
    title: 'Sobre mí',
    paragraphs: [
      'Soy desarrollador de software de Córdoba, Argentina, y actualmente curso la Tecnicatura Superior en Desarrollo de Software en el Instituto Superior Politécnico de Córdoba (ISPC).',
      'Me interesa construir aplicaciones web, resolver problemas técnicos, integrar APIs y profundizar en la calidad del software y las pruebas automatizadas. Mi recorrido incluye tecnologías frontend y backend, desarrollo con WordPress y soporte técnico informático.',
      'Hoy estoy enfocado en seguir creciendo como desarrollador y contribuir a proyectos reales.',
    ],
    educationTitle: 'Formación',
    education: [
      {
        name: 'Tecnicatura Superior en Desarrollo de Software',
        institution: 'Instituto Superior Politécnico de Córdoba · En curso',
        detail: 'Título intermedio: Junior Full Stack Developer',
      },
    ],
    technologyEyebrow: 'Herramientas de trabajo',
    technologyTitle: 'Tecnologías',
    technologyGroups: [
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
    ],
    projectEyebrow: 'Proyecto destacado',
    projectsTitle: 'Proyectos destacados',
    projects: [
      {
        name: 'PintaEbook',
        type: 'Proyecto en equipo',
        image: '/assets/pintaebook.png',
        imageAlt: 'Página de inicio de PintaEbook con su presentación y navegación',
        description:
          'Plataforma de libros y ebooks desarrollada como parte del equipo ISPC / ProCoders. El proyecto integra trabajo de frontend y backend, APIs, autenticación y funcionalidades asistidas por inteligencia artificial.',
        technologies: ['Angular', 'Python', 'Django', 'REST APIs', 'Git', 'GitHub'],
        links: [
          { label: 'Ver demo', url: 'https://pinta-ebook-eta.vercel.app/' },
          {
            label: 'Frontend',
            url: 'https://github.com/ISPC-ProCoders-2026/PintaEbook',
          },
          {
            label: 'Backend',
            url: 'https://github.com/ISPC-ProCoders-2026/Pintaebook_backend',
          },
        ],
      },
      {
        name: 'DGES',
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
    ],
    contactEyebrow: 'Contacto',
    contactTitle: '¿Conectamos?',
    contactDescription: 'Podés conocer más sobre mi trabajo y escribirme a través de mis perfiles.',
  },
} as const;
