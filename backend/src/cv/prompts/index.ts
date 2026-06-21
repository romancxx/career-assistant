import { JdAnalysis } from '../../generation/interfaces';
import { ExperienceInput, SkillInput } from '../../ingestion/dto';

export const CV_SKILL_CATEGORIES = [
  'Mobile',
  'Web',
  'Backend',
  'Databases',
  'DevOps',
] as const;

export const CV_TAILORING_SYSTEM = `
You tailor a CV to a specific job description, grounded ONLY in the candidate's real experience and skills. You return the DYNAMIC parts of the CV as JSON: a summary, a tailored experiences array, and grouped skills.

CRITICAL RULES — VIOLATIONS MAKE THE CV INVALID:
1. NEVER invent experiences, companies, roles, dates, technologies, metrics or achievements not present in the SOURCE data below.
2. NEVER add a skill that is not in the SOURCE skills list.
3. Copy companyName, companyDescription, jobType, role, startDate, endDate and context VERBATIM from the source — do not alter them in any way.
4. The ONLY field you rewrite per experience is "achievements": rephrase the real achievements using the job description's vocabulary, truthfully. Never fabricate.

WHAT YOU MAY DO:
- Rewrite the summary (50–90 words) so it aligns with the target role, in the candidate's voice, using only real facts.
- Select the 4–5 MOST RELEVANT experiences and order them most-relevant-first.
- Per experience, keep 3–5 of the strongest, most JD-relevant achievement bullets; rephrase them in JD vocabulary; drop the rest.
- Group the source skills into the fixed categories and order skills within each group by JD relevance. Omit skills clearly irrelevant to the role.

SKILL CATEGORIES (use exactly these names, in this order; skip a category if it ends up empty):
${CV_SKILL_CATEGORIES.join(' · ')}

OUTPUT CONSTRAINTS:
- summary: 50–90 words.
- experiences: at most 5 items, each with at most 5 achievement bullets.
- skills: at most 6 skills per category.

Return JSON of this exact shape:
{
  "summary": string,
  "experiences": [
    { "companyName": string, "companyDescription"?: string, "jobType": "full-time" | "contract",
      "role": string, "startDate": string, "endDate"?: string, "context"?: string,
      "achievements": string[] }
  ],
  "skills": [ { "category": string, "skills": string[] } ]
}`;

export const buildCvUserPrompt = (params: {
  jd: string;
  jdAnalysis: JdAnalysis;
  experiences: ExperienceInput[];
  skills: SkillInput[];
  title: string;
}): string => {
  const { jd, jdAnalysis, experiences, skills, title } = params;

  const experiencesBlock = experiences
    .map((e, i) => {
      const dates = `${e.startDate} – ${e.endDate ?? 'present'}`;
      return [
        `[${i + 1}] ${e.companyName} — ${e.role} (${e.jobType}, ${dates})`,
        e.companyDescription ? `  about: ${e.companyDescription}` : null,
        e.context ? `  context: ${e.context}` : null,
        `  stack: ${e.stack.join(', ')}`,
        `  achievements:`,
        ...e.achievements.map((a) => `    - ${a}`),
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n\n');

  const skillsBlock = skills.map((s) => `- ${s.name} (${s.level})`).join('\n');

  return `TARGET ROLE: ${jdAnalysis.roleTitle} (${jdAnalysis.roleType})
CANDIDATE HEADLINE: ${title}

JOB DESCRIPTION:
---
${jd}
---

JD ANALYSIS:
- requiredSkills: ${jdAnalysis.requiredSkills.join(', ')}
- niceToHaveSkills: ${jdAnalysis.niceToHaveSkills.join(', ')}
- responsibilities: ${jdAnalysis.responsibilities.join('; ')}

SOURCE EXPERIENCES (the ONLY experiences you may use; stack is context for tailoring, do not output it):
${experiencesBlock}

SOURCE SKILLS (the ONLY skills you may use):
${skillsBlock}

Tailor the CV to the target role. Return ONLY the JSON described in the system prompt.`;
};
