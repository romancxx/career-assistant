export type Language = 'en' | 'fr';
export type Person = 'first' | 'third';

export const LANGUAGES: Language[] = ['en', 'fr'];
export const PERSONS: Person[] = ['first', 'third'];

export const DEFAULT_LANGUAGE: Language = 'en';
export const DEFAULT_PERSON: Person = 'third';

export interface VoiceConfig {
  languageLabel: string;
  personLabel: string;
  // Injected verbatim into the generation system prompt.
  voice: string;
}

export const VOICE_CONFIG: Record<Language, Record<Person, VoiceConfig>> = {
  en: {
    third: {
      languageLabel: 'English',
      personLabel: '3rd person',
      voice:
        'Write in the THIRD PERSON. Refer to the candidate as "Roman" or "he" — NEVER use "I", "me", or "my".',
    },
    first: {
      languageLabel: 'English',
      personLabel: '1st person',
      voice:
        'Write in the FIRST PERSON ("I"). Never refer to yourself in the third person ("Roman", "he").',
    },
  },
  fr: {
    first: {
      languageLabel: 'French',
      personLabel: '1st person',
      voice:
        'Écris à la PREMIÈRE PERSONNE ("je"). N\'utilise jamais la troisième personne ("Roman", "il") pour parler du candidat. Vouvoie le lecteur.',
    },
    third: {
      languageLabel: 'French',
      personLabel: '3rd person',
      voice:
        'Écris à la TROISIÈME PERSONNE. Réfère-toi au candidat par "Roman" ou "il". N\'utilise jamais "je", "me" ou "mon" pour parler du candidat.',
    },
  },
};

export function normalizeLanguage(l?: string | null): Language {
  return LANGUAGES.includes(l as Language) ? (l as Language) : DEFAULT_LANGUAGE;
}

export function normalizePerson(p?: string | null): Person {
  return PERSONS.includes(p as Person) ? (p as Person) : DEFAULT_PERSON;
}
