import { Platform } from '../../common/platform';

export interface GenerateDto {
  jd: string;
  // Optional one-off instruction for this generation, e.g. "mainly use my
  // Acme experience". Honored like a rule, but only for this pitch.
  directive?: string;
  // Which platform this pitch targets (language + voice). Defaults to toptal.
  platform?: Platform;
}

export interface DeriveRulesDto {
  jd: string;
  originalPitch: string;
  editedPitch: string;
  feedback: string;
  platform?: Platform;
}
