import { Injectable } from '@nestjs/common';
import { LlmService } from '../llm/llm.service';
import { RetrievalService } from '../retrieval/retrieval.service';
import {
  JD_ANALYSIS_SYSTEM,
  RULE_DERIVATION_SYSTEM,
  buildJdAnalysisUserPrompt,
  buildPitchGenerationSystem,
  buildPitchGenerationUserPrompt,
  buildRuleDerivationUserPrompt,
} from './prompts';
import {
  GeneratedPitch,
  GenerationResult,
  JdAnalysis,
  RuleDerivationResult,
} from './interfaces';
import { Platform, normalizePlatform } from '../common/platform';

@Injectable()
export class GenerationService {
  constructor(
    private llm: LlmService,
    private retrieval: RetrievalService,
  ) {}

  async generate(
    jd: string,
    directive?: string,
    platformInput?: Platform,
  ): Promise<GenerationResult> {
    const platform = normalizePlatform(platformInput);

    // Step 1: Analyze the JD
    const jdAnalysis = await this.llm.callJson<JdAnalysis>({
      system: JD_ANALYSIS_SYSTEM,
      user: buildJdAnalysisUserPrompt(jd),
      maxTokens: 1000,
      temperature: 0.2, // low temp for analysis (we want consistency)
    });

    // Step 2: Retrieve relevant context (pitches/rules scoped to the platform)
    const context = await this.retrieval.retrieveForJd(jd, platform);

    // Step 3: Generate the pitch
    const pitchResponse = await this.llm.callJson<{
      pitch: GeneratedPitch;
    }>({
      system: buildPitchGenerationSystem(platform),
      user: buildPitchGenerationUserPrompt({
        jd,
        jdAnalysis,
        experiences: context.experiences,
        skills: context.skills,
        pastPitches: context.pitches,
        rules: context.rules,
        directive,
      }),
      maxTokens: 2000,
      temperature: 0.7, // higher temp for creative writing
    });

    return {
      jdAnalysis,
      pitch: pitchResponse.pitch,
      metadata: {
        retrievedExperiences: context.experiences.map((e) => ({
          id: e.id,
          company: e.companyName,
          role: e.role,
        })),
        retrievedSkills: context.skills.map((s) => ({
          name: s.name,
          level: s.level,
        })),
        retrievedPitches: context.pitches.length,
        rules: context.rules.length,
      },
    };
  }

  /**
   * Feedback loop: given an AI pitch, the user's edited version, and their
   * note, propose reusable writing rules. Does NOT persist anything — the
   * candidates are returned for the user to approve before saving.
   */
  async deriveRules(params: {
    jd: string;
    originalPitch: string;
    editedPitch: string;
    feedback: string;
    platform?: Platform;
  }): Promise<RuleDerivationResult> {
    const result = await this.llm.callJson<RuleDerivationResult>({
      system: RULE_DERIVATION_SYSTEM,
      user: buildRuleDerivationUserPrompt({
        ...params,
        platform: normalizePlatform(params.platform),
      }),
      maxTokens: 800,
      temperature: 0.3, // low temp: we want consistent, conservative rules
    });

    return { rules: result.rules ?? [] };
  }
}
