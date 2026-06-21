export interface JdAnalysis {
  roleTitle: string;
  roleType: string;
  requiredSkills: string[];
  niceToHaveSkills: string[];
  responsibilities: string[];
  companyContext: string;
  tone: "formal" | "casual" | "technical" | "startup";
  redFlags: string[]; // things to address carefully (e.g., "10+ years required")
}

export interface GeneratedPitch {
  text: string;
  wordCount: number;
  usedExperiences: string[]; // company names referenced
  usedSkills: string[]; // skill names mentioned
}

export interface CandidateRule {
  text: string; // the reusable rule, ready to save
  reason: string; // why it was derived (shown to the user, not persisted)
}

export interface RuleDerivationResult {
  rules: CandidateRule[];
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
