
export interface Experience {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface Project {
  name: string;
  description: string;
  link?: string;
}

export interface Certification {
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface VolunteerExperience {
  role: string;
  organization: string;
  cause: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Publication {
  title: string;
  publisher: string;
  publicationDate: string;
  description: string;
  url?: string;
}

export interface Award {
  title: string;
  issuer: string;
  issueDate: string;
  description: string;
}

export interface Patent {
  title: string;
  number: string;
  issueDate: string;
  url?: string;
  description: string;
}

export interface CVData {
  name: string;
  headline: string;
  about: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  projects: Project[];
  certifications: Certification[];
  volunteer: VolunteerExperience[];
  languages: string[];
  awards: Award[];
  publications: Publication[];
  patents: Patent[];
  organizations: string[];
  testScores: string[];
}

export enum AppState {
  IDLE = 'IDLE',
  PARSING = 'PARSING',
  REVIEW = 'REVIEW',
  SYNC = 'SYNC'
}
