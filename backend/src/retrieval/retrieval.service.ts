import { Injectable } from '@nestjs/common';
import { EmbeddingsService } from '../embeddings/embeddings.service';
import { QdrantService } from '../qdrant/qdrant.service';
import { DEFAULT_PLATFORM, Platform } from '../common/platform';
import { RetrievalContext } from './interfaces';

@Injectable()
export class RetrievalService {
  constructor(
    private embeddings: EmbeddingsService,
    private qdrant: QdrantService,
  ) {}

  // Restrict pitches/rules to a single platform's voice. Points written before
  // platforms existed have no `platform` field, so they count as the default
  // (toptal) — existing data keeps working without a re-seed.
  private platformFilter(platform: Platform): Record<string, any> {
    if (platform === DEFAULT_PLATFORM) {
      return {
        should: [
          { key: 'platform', match: { value: platform } },
          { is_empty: { key: 'platform' } },
        ],
      };
    }
    return { must: [{ key: 'platform', match: { value: platform } }] };
  }

  async retrieveForJd(
    jdText: string,
    platform: Platform = DEFAULT_PLATFORM,
  ): Promise<RetrievalContext> {
    // 1. Embed the JD once
    const jdVector = await this.embeddings.embed(jdText);

    // 2. Parallel search across collections.
    //    Experiences and skills are shared facts (platform-agnostic); only
    //    pitches and rules are scoped to the platform's voice.
    const platformFilter = this.platformFilter(platform);
    const [expResults, skillResults, pitchResults, allRules] =
      await Promise.all([
        this.qdrant.search('experiences', jdVector, 3),
        this.qdrant.search('skills', jdVector, 8),
        this.qdrant.search('pitches', jdVector, 3, platformFilter),
        this.qdrant.getAll('rules', platformFilter),
      ]);

    // 3. Shape results
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
