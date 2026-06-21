import { Language, Person } from '../../common/voice';

export interface GenerateDto {
  jd: string;
  directive?: string;
  language?: Language;
  person?: Person;
}

export interface DeriveRulesDto {
  jd: string;
  originalPitch: string;
  editedPitch: string;
  feedback: string;
  language?: Language;
  person?: Person;
}
