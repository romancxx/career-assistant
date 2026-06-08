export interface RetrievedExperience {
  id: string;
  score: number;
  companyName: string;
  companyDescription?: string;
  role: string;
  startDate: string;
  endDate?: string;
  stack: string[];
  achievements: string[];
  context?: string;
}

export interface RetrievedSkill {
  id: string;
  score: number;
  name: string;
  level: string;
  yearsOfExperience?: number;
}

export interface RetrievedPitch {
  id: string;
  score: number;
  text: string;
  roleType?: string;
  tags: string[];
}

export interface RetrievedRule {
  id: string;
  text: string;
}

export interface RetrievalContext {
  experiences: RetrievedExperience[];
  skills: RetrievedSkill[];
  pitches: RetrievedPitch[];
  rules: RetrievedRule[];
}
