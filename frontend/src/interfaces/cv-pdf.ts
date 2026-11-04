export interface Cv {
  label?: string;
  showPhoto?: boolean;
  basics: Basics;
  summary: string;
  experience: ExperienceEntry[];
  projects?: Project[];
  skills: SkillGroup[];
  education: Education[];
}

export interface CvSummary {
  id: string;
  label: string;
}

export interface Basics {
  name: string;
  title: string;
  email: string;
  phone: string | null;
  location: string | null;
  links: Link[];
}

export interface Link {
  label: string;
  url: string;
}

export type ExperienceEntry = GroupedExperience | RoleEntry;

export interface GroupedExperience {
  kind: "grouped";
  selected?: boolean;
  title: string;
  start: string;
  end: string;
  subtitle?: string;
  engagements: Engagement[];
}

export interface Engagement {
  selected?: boolean;
  client: string;
  duration: string;
  tags?: string[];
  highlights: string[];
}

export interface RoleEntry {
  kind: "role";
  selected?: boolean;
  company: string;
  role: string;
  start: string;
  end: string;
  tags?: string[];
  highlights: string[];
}

export interface Project {
  name: string;
  tags?: string[];
  link?: string;
  highlights: string[];
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface Education {
  institution: string;
  program: string;
  start: string;
  end: string;
  notes: string | null;
}
