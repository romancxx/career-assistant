import { Language, Person } from '../../common/voice';

export type JobType = 'full-time' | 'contract';

export interface PitchInput {
  text: string;
  tags: string[];
  roleType?: string;
  language?: Language;
  person?: Person;
}

export interface ExperienceInput {
  companyName: string;
  companyDescription?: string;
  jobType: JobType;
  role: string;
  startDate: string; // "2023-01"
  endDate?: string;
  stack: string[];
  achievements: string[];
  context?: string;
}

export interface SkillInput {
  name: string;
  level: 'expert' | 'strong' | 'competent';
  yearsOfExperience?: number;
}

export interface RuleInput {
  text: string;
  language?: Language;
  person?: Person;
}
