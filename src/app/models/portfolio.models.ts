export interface Profile {
  name: string;
  specialty: string;
  introduction: string;
  biography: string;
  location: string;
  photo: string;
}

export interface Technology {
  name: string;
  url: string;
}

export interface TechnologyGroup {
  name: string;
  technologies: Technology[];
}

export interface Experience {
  title: string;
  organization: string;
  description: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
}

export interface Education {
  name: string;
  institution: string;
  type: 'study' | 'certification';
  status: 'in_progress' | 'completed';
  startDate: string;
  endDate: string | null;
  url: string | null;
}

export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  name: string;
  slug: string;
  summary: string;
  type: string;
  image: string;
  imageAlt: string;
  description: string;
  technologies: string[];
  links: ProjectLink[];
}

export interface ProfessionalLink {
  label: string;
  type: string;
  url: string;
}

export type ResourceState<T> =
  | { status: 'loading' }
  | { status: 'empty' }
  | { status: 'error' }
  | { status: 'success'; data: T };

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
