import * as fs from 'fs';
import * as path from 'path';
import { Cv, ExperienceEntry } from '../interfaces';

export const DATA_DIR = path.join(process.cwd(), 'data');
export const DEFAULT_CV_PATH = path.join(DATA_DIR, 'cv.json');

export function loadCv(filePath: string = DEFAULT_CV_PATH): Cv {
  if (!fs.existsSync(filePath)) {
    throw new Error(`CV data file not found: ${filePath}`);
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (err) {
    throw new Error(`Invalid JSON in ${filePath}: ${(err as Error).message}`);
  }
  return validateCv(parsed);
}

export function saveCv(cv: Cv, filePath: string = DEFAULT_CV_PATH): Cv {
  const validated = validateCv(cv);
  fs.writeFileSync(
    filePath,
    JSON.stringify(validated, null, 2) + '\n',
    'utf-8',
  );
  return validated;
}

export function validateCv(data: unknown): Cv {
  const cv = data as Cv;
  const fail = (msg: string): never => {
    throw new Error(`Invalid CV data: ${msg}`);
  };

  if (!cv || typeof cv !== 'object') fail('expected an object');
  if (!cv.basics?.name) fail('basics.name is required');
  if (typeof cv.summary !== 'string' || !cv.summary.trim()) {
    fail('summary is required');
  }
  if (!Array.isArray(cv.experience) || cv.experience.length === 0) {
    fail('experience must be a non-empty array');
  }
  cv.experience.forEach(assertExperience);
  if (!Array.isArray(cv.skills)) fail('skills must be an array');
  if (!Array.isArray(cv.education)) fail('education must be an array');

  return cv;
}

function assertExperience(entry: ExperienceEntry, i: number): void {
  const at = `experience[${i}]`;
  if (entry.kind === 'grouped') {
    if (!Array.isArray(entry.engagements) || entry.engagements.length === 0) {
      throw new Error(`Invalid CV data: ${at}.engagements must be non-empty`);
    }
  } else if (entry.kind === 'role') {
    if (!entry.company) {
      throw new Error(`Invalid CV data: ${at}.company is required`);
    }
  } else {
    throw new Error(`Invalid CV data: ${at}.kind must be "grouped" or "role"`);
  }
}
