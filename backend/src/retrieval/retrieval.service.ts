import { Injectable } from '@nestjs/common';
import { EmbeddingsService } from '../embeddings/embeddings.service';
import { QdrantService } from '../qdrant/qdrant.service';
import {
  DEFAULT_LANGUAGE,
  DEFAULT_PERSON,
  Language,
  Person,
} from '../common/voice';
import { RetrievalContext } from './interfaces';

@Injectable()
export class RetrievalService {
  constructor(
    private embeddings: EmbeddingsService,
    private qdrant: QdrantService,
  ) {}

  // Points without voice fields (legacy data) fall through to the en+third default.
  private voiceFilter(language: Language, person: Person): Record<string, any> {
    const isDefault =
      language === DEFAULT_LANGUAGE && person === DEFAULT_PERSON;
    if (isDefault) {
      return {
        should: [
          {
            must: [
              { key: 'language', match: { value: language } },
              { key: 'person', match: { value: person } },
            ],
          },
          {
            must: [
              { is_empty: { key: 'language' } },
              { is_empty: { key: 'person' } },
            ],
          },
        ],
      };
    }
    return {
      must: [
        { key: 'language', match: { value: language } },
        { key: 'person', match: { value: person } },
      ],
    };
  }

  async retrieveForJd(
    jdText: string,
    language: Language = DEFAULT_LANGUAGE,
    person: Person = DEFAULT_PERSON,
  ): Promise<RetrievalContext> {
    const jdVector = await this.embeddings.embed(jdText);

    const voiceFilter = this.voiceFilter(language, person);
    const [expResults, skillResults, pitchResults, allRules] =
      await Promise.all([
        this.qdrant.search('experiences', jdVector, 3),
        this.qdrant.search('skills', jdVector, 8),
        this.qdrant.search('pitches', jdVector, 3, voiceFilter),
        this.qdrant.getAll('rules', voiceFilter),
      ]);

    return {
      experiences: expResults.map((r) => ({
        id: r.id as string,
        score: r.score,
        companyName: r.payload?.companyName as string,
        companyDescription:
          (r.payload?.companyDescription as string) ?? undefined,
        role: r.payload?.role as string,
        startDate: r.payload?.startDate as string,
        endDate: (r.payload?.endDate as string) ?? undefined,
        stack: r.payload?.stack as string[],
        achievements: r.payload?.achievements as string[],
        context: (r.payload?.context as string) ?? undefined,
      })),
      skills: skillResults.map((r) => ({
        id: r.id as string,
        score: r.score,
        name: r.payload?.name as string,
        level: r.payload?.level as string,
        yearsOfExperience:
          (r.payload?.yearsOfExperience as number) ?? undefined,
      })),
      pitches: pitchResults.map((r) => ({
        id: r.id as string,
        score: r.score,
        text: r.payload?.text as string,
        roleType: (r.payload?.roleType as string) ?? undefined,
        tags: (r.payload?.tags as string[]) ?? [],
      })),
      rules: allRules.map((p) => ({
        id: p.id as string,
        text: p.payload?.text as string,
      })),
    };
  }
}
