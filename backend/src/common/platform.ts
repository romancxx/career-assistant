// ============================================================
// PLATFORM
// ============================================================
// A "platform" scopes the *voice* of a pitch: language + person.
// Experiences and skills are shared facts (platform-agnostic); only
// pitches and rules are platform-scoped, so a French/first-person Malt
// pitch never borrows the voice of an English/third-person Toptal pitch.

export type Platform = 'toptal' | 'malt';

export const PLATFORMS: Platform[] = ['toptal', 'malt'];

// Existing data (and any request that omits a platform) is treated as Toptal,
// which preserves the original behaviour exactly.
export const DEFAULT_PLATFORM: Platform = 'toptal';

export interface PlatformConfig {
  label: string;
  language: string;
  // Person/voice instructions injected into the generation system prompt.
  voice: string;
}

export const PLATFORM_CONFIG: Record<Platform, PlatformConfig> = {
  toptal: {
    label: 'Toptal',
    language: 'English',
    voice:
      'Write in the THIRD PERSON. Refer to the candidate as "Roman" or "he" — NEVER use "I", "me", or "my".',
  },
  malt: {
    label: 'Malt',
    language: 'French',
    voice:
      'Écris à la PREMIÈRE PERSONNE ("je"). N\'utilise jamais la troisième personne ("Roman", "il") pour parler du candidat. Vouvoie le lecteur.',
  },
};

export function normalizePlatform(p?: string | null): Platform {
  return PLATFORMS.includes(p as Platform) ? (p as Platform) : DEFAULT_PLATFORM;
}
