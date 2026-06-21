import { Injectable } from "@nestjs/common";

import { CvDocument, CvTailoredParts } from "@/cv/interfaces";
import { JdAnalysis } from "@/generation/interfaces";

import { ProfileService } from "@/cv/profile.service";
import { CV_TAILORING_SYSTEM, buildCvUserPrompt } from "@/cv/prompts";
import {
  JD_ANALYSIS_SYSTEM,
  buildJdAnalysisUserPrompt,
} from "@/generation/prompts";
import { ExperienceDto } from "@/ingestion/dto/experience-dto";
import { SkillDto } from "@/ingestion/dto/skill-dto";
import { LlmService } from "@/llm/llm.service";
import { QdrantService } from "@/qdrant/qdrant.service";

@Injectable()
export class CvService {
  constructor(
    private llm: LlmService,
    private qdrant: QdrantService,
    private profile: ProfileService,
  ) {}

  async generateTailoredCv(jd: string): Promise<CvDocument> {
    const jdAnalysis = await this.llm.callJson<JdAnalysis>({
      system: JD_ANALYSIS_SYSTEM,
      user: buildJdAnalysisUserPrompt(jd),
      maxTokens: 1000,
      temperature: 0.2,
    });

    // CVs need full context — LLM selects; no vector search here.
    const [experiences, skills] = await Promise.all([
      this.getAll<ExperienceDto>("experiences"),
      this.getAll<SkillDto>("skills"),
    ]);

    const tailored = await this.llm.callJson<CvTailoredParts>({
      system: CV_TAILORING_SYSTEM,
      user: buildCvUserPrompt({
        jd,
        jdAnalysis,
        experiences,
        skills,
        title: this.profile.getProfile().title,
      }),
      maxTokens: 3000,
      temperature: 0.2,
    });

    const profile = this.profile.getProfile();
    const education = this.profile.getEducation();

    const { matched, missed } = this.matchKeywords(
      [...jdAnalysis.requiredSkills, ...jdAnalysis.niceToHaveSkills],
      tailored,
    );

    return {
      profile,
      summary: tailored.summary,
      experiences: tailored.experiences,
      skills: tailored.skills,
      education,
      meta: {
        generatedAt: new Date().toISOString(),
        targetJdTitle: jdAnalysis.roleTitle,
        targetCompany: jdAnalysis.companyContext || undefined,
        keywordsMatched: matched,
        keywordsMissed: missed,
      },
    };
  }

  private async getAll<T>(collection: "experiences" | "skills"): Promise<T[]> {
    const points = await this.qdrant.getAll(collection);
    return points.map((p) => p.payload as T);
  }

  // Both sides normalized (lowercase, alphanumerics only) so "React.js" matches "React".
  private matchKeywords(
    keywords: string[],
    cv: CvTailoredParts,
  ): { matched: string[]; missed: string[] } {
    const haystack = this.normalize(
      [
        cv.summary,
        ...cv.experiences.flatMap((e) => [
          e.role,
          e.companyDescription ?? "",
          ...e.achievements,
        ]),
        ...cv.skills.flatMap((g) => g.skills),
      ].join(" "),
    );

    const matched: string[] = [];
    const missed: string[] = [];
    const seen = new Set<string>();

    for (const kw of keywords) {
      const key = this.normalize(kw);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      (this.keywordInHaystack(kw, haystack) ? matched : missed).push(kw);
    }

    return { matched, missed };
  }

  // Strips parenthetical qualifiers ("Detox (testing)" → "Detox"), then matches
  // the phrase or any sub-token (length ≥ 3) against the CV text.
  private keywordInHaystack(keyword: string, haystack: string): boolean {
    const base = keyword.replace(/\([^)]*\)/g, " ");
    const candidates = [base, ...base.split(/[\s,/&+]+/)];
    return candidates.some((c) => {
      const n = this.normalize(c);
      return n.length >= 3 && haystack.includes(n);
    });
  }

  private normalize(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9]/g, "");
  }
}
