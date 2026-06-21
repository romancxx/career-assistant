import { JobType } from '../../ingestion/dto';

export interface CvDocument {
  profile: ProfileInfo;
  summary: string;
  experiences: CvExperience[];
  skills: CvSkillGroup[];
  education: CvEducation[];
  meta: CvMeta;
}

export interface ProfileInfo {
  fullName: string;
  title: string;
  email: string;
  location: string;
  linkedin: string;
}

export interface CvExperience {
  companyName: string; // NEVER modify
  companyDescription?: string; // NEVER modify
  jobType: JobType; // NEVER modify
  role: string; // NEVER modify
  startDate: string; // NEVER modify
  endDate?: string; // NEVER modify
  context?: string; // NEVER modify
  achievements: string[]; // tailored: 3–5 rephrased/reranked bullets
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

export interface CvMeta {
  generatedAt: string;
  targetJdTitle?: string;
  targetCompany?: string;
  keywordsMatched: string[];
  keywordsMissed: string[];
}

/** Dynamic parts returned by the LLM; statics (profile, education) are merged in afterwards. */
export interface CvTailoredParts {
  summary: string;
  experiences: CvExperience[];
  skills: CvSkillGroup[];
}
