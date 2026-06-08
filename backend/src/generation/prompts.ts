import { JdAnalysis } from './interfaces';
import { Platform, PLATFORM_CONFIG } from '../common/platform';
import {
  RetrievedExperience,
  RetrievedPitch,
  RetrievedSkill,
  RetrievedRule,
} from '../retrieval/interfaces';

// ============================================================
// STEP 1 — JD ANALYSIS
// ============================================================

export const JD_ANALYSIS_SYSTEM = `
You are an expert at analyzing job descriptions. Your job is to extract structured information that will be used to craft a personalized job pitch.

Extract the following from the job description:
- roleTitle: the exact title from the JD
- roleType: a normalized category (e.g., "Senior Full-Stack Engineer", "Mobile Engineer", "Engineering Manager")
- requiredSkills: technical skills explicitly required
- niceToHaveSkills: technical skills mentioned as nice-to-have or preferred
- responsibilities: 3-5 key responsibilities of the role
- companyContext: brief description of the company/team (size, stage, mission if mentioned)
- tone: the writing tone the JD itself uses (formal | casual | technical | startup)
- redFlags: things the candidate should address carefully (e.g., strict experience requirements, demanding expectations, unclear scope)

Be concise. Extract only what's actually in the JD — don't invent.`;

export const buildJdAnalysisUserPrompt = (jd: string): string => {
  return `Analyze this job description and return the structured JSON:\n\n---\n${jd}\n---`;
};

// ============================================================
// STEP 2 — PITCH GENERATION
// ============================================================

const PITCH_GENERATION_SYSTEM_BASE = `
You are writing a job application pitch IN THE USER'S VOICE, grounded ONLY in their real experience.

CRITICAL RULES — VIOLATIONS WILL CAUSE THE PITCH TO BE REJECTED:

1. NEVER invent experiences, companies, projects, or achievements the user hasn't listed.
2. NEVER mention skills the user doesn't have in their skills list.
3. If the JD asks for something the user lacks, address it honestly (e.g., transferable experience) — never fake it.
4. Use the user's exact phrasing patterns from their past pitches and style rules.
5. Reference specific past experiences when relevant — these are real and verifiable, if not exact experience matching, referencing a strong experience works too.
6. Match the JD's tone level (formal vs casual) but stay within the user's voice rules.

WRITE A SINGLE PITCH:
- Story-driven — 150-300 words, leads with a specific relevant story

For the pitch, also return:
- wordCount: actual word count
- usedExperiences: array of company names you referenced
- usedSkills: array of skill names you mentioned`;

// The platform decides the pitch's language and person (voice). These
// instructions are NON-NEGOTIABLE and override any conflicting past pitch or
// rule — e.g. an English third-person Toptal example must not bleed into a
// French first-person Malt pitch.
export const buildPitchGenerationSystem = (platform: Platform): string => {
  const cfg = PLATFORM_CONFIG[platform];
  return `${PITCH_GENERATION_SYSTEM_BASE}

OUTPUT LANGUAGE & VOICE — NON-NEGOTIABLE (overrides any conflicting example or rule):
- Write the ENTIRE pitch in ${cfg.language}.
- ${cfg.voice}
The past pitches and rules below are scoped to this same platform, so follow their voice — but if anything conflicts with the language/person above, the rules above win.`;
};

// ============================================================
// STEP 3 — RULE DERIVATION (feedback loop)
// ============================================================

export const RULE_DERIVATION_SYSTEM = `
You analyze how a user edited an AI-generated job pitch, in order to extract REUSABLE writing rules that will improve future pitches.

You are given:
- The original AI-generated pitch
- The user's edited version
- A free-text note from the user explaining what they changed and why

Your job: identify the GENERAL, REUSABLE preferences revealed by the edits — not one-off facts.

GOOD rules (generalizable, apply to future pitches):
- "Avoid the phrase 'thrives in fast-paced environments' — it reads as a cliché."
- "Open with a concrete project or metric, not a generic summary sentence."
- "Prefer 'I' phrasing over third-person ('Roman is...')."

BAD rules (too specific, one-off, or just restating this pitch's content — do NOT output these):
- "Mention the logistics platform." (specific to one JD)
- "Change 6 years to 7 years." (a fact, not a writing preference)

RULES:
1. Only output rules that would plausibly apply to OTHER future pitches.
2. Prefer the user's stated reasoning (the note) over guessing from the diff.
3. If the edits reveal no generalizable preference, return an empty array — do not invent rules.
4. Keep each rule a single, actionable sentence.
5. Output 0-4 rules. Quality over quantity.`;

export const buildRuleDerivationUserPrompt = (params: {
  jd: string;
  originalPitch: string;
  editedPitch: string;
  feedback: string;
  platform: Platform;
}): string => {
  const { jd, originalPitch, editedPitch, feedback, platform } = params;
  const cfg = PLATFORM_CONFIG[platform];
  return `## TARGET PLATFORM
These pitches are for ${cfg.label} (${cfg.language}, ${cfg.voice}). Only derive rules that fit this platform's language and voice — do NOT derive a rule that merely restates the platform's language or person.

## JOB DESCRIPTION (for context)
${jd}

## ORIGINAL AI-GENERATED PITCH
${originalPitch}

## USER'S EDITED PITCH
${editedPitch}

## USER'S FEEDBACK NOTE
${feedback || '(no note provided — infer from the diff)'}

---

Return ONLY the JSON object with this structure:
{
  "rules": [
    { "text": "the reusable rule, one sentence", "reason": "why this was derived from the edit" }
  ]
}`;
};

export const buildPitchGenerationUserPrompt = (params: {
  jd: string;
  jdAnalysis: JdAnalysis;
  experiences: RetrievedExperience[];
  skills: RetrievedSkill[];
  pastPitches: RetrievedPitch[];
  rules: RetrievedRule[];
  directive?: string;
}): string => {
  const { jd, jdAnalysis, experiences, skills, pastPitches, rules, directive } =
    params;

  const experiencesBlock = experiences
    .map(
      (e, i) => `
[Experience ${i + 1}] ${e.role} @ ${e.companyName} (${e.startDate} → ${e.endDate ?? 'present'})
Stack: ${e.stack.join(', ')}
${e.companyDescription ? `Company: ${e.companyDescription}` : ''}
Achievements:
${e.achievements.map((a) => `  - ${a}`).join('\n')}
${e.context ? `Context: ${e.context}` : ''}
`,
    )
    .join('\n');

  const skillsBlock = skills
    .map(
      (s) =>
        `- ${s.name} (${s.level}${s.yearsOfExperience ? `, ${s.yearsOfExperience}y` : ''})`,
    )
    .join('\n');

  const pastPitchesBlock = pastPitches
    .map(
      (p, i) =>
        `[Past Pitch ${i + 1}] (for: ${p.roleType ?? 'unknown role'})\n${p.text}`,
    )
    .join('\n\n');

  const rulesBlock = rules.map((s) => `- ${s.text}`).join('\n');

  const directiveBlock = directive?.trim()
    ? `\n## USER'S DIRECTIVE FOR THIS PITCH (highest priority — follow it as long as it doesn't require inventing anything)
${directive.trim()}\n`
    : '';

  return `## JOB DESCRIPTION
${jd}
${directiveBlock}

## JD ANALYSIS
- Role: ${jdAnalysis.roleTitle}
- Required: ${jdAnalysis.requiredSkills.join(', ')}
- Nice-to-have: ${jdAnalysis.niceToHaveSkills.join(', ')}
- Tone to match: ${jdAnalysis.tone}
- Things to address carefully: ${jdAnalysis.redFlags.join('; ') || 'none'}

## USER'S RELEVANT EXPERIENCES (use these for grounding — never invent others)
${experiencesBlock}

## USER'S RELEVANT SKILLS (only these can be mentioned as their skills)
${skillsBlock}

## USER'S PAST PITCHES (study these for voice, tone, structure)
${pastPitchesBlock || '(no past pitches yet)'}

## USER'S RULES (follow strictly)
${rulesBlock || '(no rules)'}

---

Generate the pitch now. Return ONLY the JSON object with this structure:
{
  "pitch": {
    "text": "...",
    "wordCount": 0,
    "usedExperiences": ["..."],
    "usedSkills": ["..."]
  }
}`;
};
