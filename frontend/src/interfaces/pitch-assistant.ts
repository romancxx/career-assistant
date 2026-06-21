export type JobType = "full-time" | "contract";

export type Language = "en" | "fr";
export type Person = "first" | "third";

export const DEFAULT_LANGUAGE: Language = "en";
export const DEFAULT_PERSON: Person = "third";

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: "English",
  fr: "French",
};

export const PERSON_LABELS: Record<Person, string> = {
  first: "1st person",
  third: "3rd person",
};

export interface Experience {
  id?: string;
  companyName: string;
  companyDescription?: string;
  jobType: JobType;
  role: string;
  startDate: string;
  endDate?: string;
  stack: string[];
  achievements: string[];
  context?: string;
}

export interface Skill {
  id?: string;
  name: string;
  level: "expert" | "strong" | "competent";
  yearsOfExperience?: number;
}

export interface Pitch {
  id?: string;
  text: string;
  tags: string[];
  roleType?: string;
  language?: Language;
  person?: Person;
}

export interface Rule {
  id?: string;
  text: string;
  language?: Language;
  person?: Person;
}

export interface ProfileData {
  pitches: {id: string; payload: Pitch}[];
  experiences: {id: string; payload: Experience}[];
  skills: {id: string; payload: Skill}[];
  rules: {id: string; payload: Rule}[];
}

export interface JdAnalysis {
  roleTitle: string;
  roleType: string;
  requiredSkills: string[];
  niceToHaveSkills: string[];
  responsibilities: string[];
  companyContext: string;
  tone: string;
  redFlags: string[];
}

export interface GeneratedPitch {
  text: string;
  wordCount: number;
  usedExperiences: string[];
  usedSkills: string[];
}

export interface CandidateRule {
  text: string;
  reason: string;
}

export interface RuleDerivationResult {
  rules: CandidateRule[];
}

export interface DeriveRulesRequest {
  jd: string;
  originalPitch: string;
  editedPitch: string;
  feedback: string;
  language?: Language;
  person?: Person;
}

export interface GenerationResult {
  jdAnalysis: JdAnalysis;
  pitch: GeneratedPitch;
  metadata: {
    retrievedExperiences: {id: string; company: string; role: string}[];
    retrievedSkills: {name: string; level: string}[];
    retrievedPitches: number;
    rules: number;
  };
}

export interface ProfileInfo {
  fullName: string;
  title: string;
  email: string;
  location: string;
  linkedin: string;
}

export interface CvExperience {
  companyName: string;
  companyDescription?: string;
  jobType: JobType;
  role: string;
  startDate: string;
  endDate?: string;
  context?: string;
  achievements: string[];
}

export interface CvSkillGroup {
  category: string;
  skills: string[];
}

export interface CvEducation {
  school: string;
  degree: string;
  startYear: string;
  endYear: string;
  notes?: string;
}

export interface CvDocument {
  profile: ProfileInfo;
  summary: string;
  experiences: CvExperience[];
  skills: CvSkillGroup[];
  education: CvEducation[];
  meta: {
    generatedAt: string;
    targetJdTitle?: string;
    targetCompany?: string;
    keywordsMatched: string[];
    keywordsMissed: string[];
  };
}

export interface CvProfileResponse {
  profile: ProfileInfo;
  education: CvEducation[];
}
