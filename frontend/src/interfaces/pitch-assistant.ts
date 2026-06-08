export type JobType = "full-time" | "contract";

// A pitch's platform decides its language + voice (see backend common/platform).
export type Platform = "toptal" | "malt";

export const PLATFORM_LABELS: Record<Platform, string> = {
  toptal: "Toptal (EN, 3rd person)",
  malt: "Malt (FR, 1st person)"
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
  platform?: Platform;
}

export interface Rule {
  id?: string;
  text: string;
  platform?: Platform;
}

export interface ProfileData {
  pitches: { id: string; payload: Pitch }[];
  experiences: { id: string; payload: Experience }[];
  skills: { id: string; payload: Skill }[];
  rules: { id: string; payload: Rule }[];
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
  platform?: Platform;
}

export interface GenerationResult {
  jdAnalysis: JdAnalysis;
  pitch: GeneratedPitch;
  metadata: {
    retrievedExperiences: { id: string; company: string; role: string }[];
    retrievedSkills: { name: string; level: string }[];
    retrievedPitches: number;
    rules: number;
  };
}
