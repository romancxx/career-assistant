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
import {
  Language,
  Person,
  normalizeLanguage,
  normalizePerson,
} from '../common/voice';

@Injectable()
export class GenerationService {
  constructor(
    private llm: LlmService,
    private retrieval: RetrievalService,
  ) {}

  async generate(
    jd: string,
    directive?: string,
    languageInput?: Language,
    personInput?: Person,
  ): Promise<GenerationResult> {
    const language = normalizeLanguage(languageInput);
    const person = normalizePerson(personInput);

    const jdAnalysis = await this.llm.callJson<JdAnalysis>({
      system: JD_ANALYSIS_SYSTEM,
      user: buildJdAnalysisUserPrompt(jd),
      maxTokens: 1000,
      temperature: 0.2,
    });

    const context = await this.retrieval.retrieveForJd(jd, language, person);

    const pitchResponse = await this.llm.callJson<{
      pitch: GeneratedPitch;
    }>({
      system: buildPitchGenerationSystem(language, person),
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
      temperature: 0.7,
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

  async deriveRules(params: {
    jd: string;
    originalPitch: string;
    editedPitch: string;
    feedback: string;
    language?: Language;
    person?: Person;
  }): Promise<RuleDerivationResult> {
    const result = await this.llm.callJson<RuleDerivationResult>({
      system: RULE_DERIVATION_SYSTEM,
      user: buildRuleDerivationUserPrompt({
        ...params,
        language: normalizeLanguage(params.language),
        person: normalizePerson(params.person),
      }),
      maxTokens: 800,
      temperature: 0.3,
    });

    return { rules: result.rules ?? [] };
  }
}
