import * as fs from "fs";
import * as path from "path";

import { Cv, CvSummary, ExperienceEntry, Project } from "@/cv-pdf/interfaces";

export const DATA_DIR = path.join(process.cwd(), "data");
export const DEFAULT_CV_PATH = path.join(DATA_DIR, "cv.json");

const CV_FILE_RE = /^cv-(\d+)\.json$/;

export function cvPath(id: string): string {
  if (!/^\d+$/.test(id)) {
    throw new Error(`Invalid CV id: ${id}`);
  }
  return path.join(DATA_DIR, `cv-${id}.json`);
}

export function cvExists(id: string): boolean {
  return fs.existsSync(cvPath(id));
}

function cvLabel(cv: Cv): string {
  return cv.label?.trim() || cv.basics.title || cv.basics.name;
}

export function listCvs(): CvSummary[] {
  return fs
    .readdirSync(DATA_DIR)
    .map((name) => CV_FILE_RE.exec(name))
    .filter((m): m is RegExpExecArray => m !== null)
    .map((m) => ({ id: m[1], label: cvLabel(loadCv(cvPath(m[1]))) }))
    .sort((a, b) => Number(a.id) - Number(b.id));
}

export function nextCvId(): string {
  const ids = fs
    .readdirSync(DATA_DIR)
    .map((name) => CV_FILE_RE.exec(name))
    .filter((m): m is RegExpExecArray => m !== null)
    .map((m) => Number(m[1]));

  return String((ids.length ? Math.max(...ids) : 0) + 1);
}

export function deleteCv(id: string): void {
  const filePath = cvPath(id);
  if (!fs.existsSync(filePath)) {
    throw new Error(`CV data file not found: ${filePath}`);
  }

  const remaining = fs
    .readdirSync(DATA_DIR)
    .filter((name) => CV_FILE_RE.test(name));

  if (remaining.length <= 1) {
    throw new Error("Cannot delete the last remaining CV");
  }
  fs.rmSync(filePath);
}

export function loadCv(filePath: string = DEFAULT_CV_PATH): Cv {
  if (!fs.existsSync(filePath)) {
    throw new Error(`CV data file not found: ${filePath}`);
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (err) {
    throw new Error(`Invalid JSON in ${filePath}: ${(err as Error).message}`);
  }
  return validateCv(parsed);
}

export function saveCv(cv: Cv, filePath: string = DEFAULT_CV_PATH): Cv {
  const validated = validateCv(cv);

  fs.writeFileSync(
    filePath,
    JSON.stringify(validated, null, 2) + "\n",
    "utf-8",
  );

  return validated;
}

export function validateCv(data: unknown): Cv {
  const cv = data as Cv;
  const fail = (msg: string): never => {
    throw new Error(`Invalid CV data: ${msg}`);
  };

  if (!cv || typeof cv !== "object") fail("expected an object");

  if (cv.label !== undefined && typeof cv.label !== "string") {
    fail("label must be a string");
  }

  if (cv.showPhoto !== undefined && typeof cv.showPhoto !== "boolean") {
    fail("showPhoto must be a boolean");
  }

  if (!cv.basics?.name) fail("basics.name is required");

  if (typeof cv.summary !== "string" || !cv.summary.trim()) {
    fail("summary is required");
  }

  if (!Array.isArray(cv.experience) || cv.experience.length === 0) {
    fail("experience must be a non-empty array");
  }

  cv.experience.forEach(assertExperience);

  if (cv.projects !== undefined) {
    if (!Array.isArray(cv.projects)) fail("projects must be an array");
    cv.projects.forEach(assertProject);
  }

  if (!Array.isArray(cv.skills)) fail("skills must be an array");

  if (!Array.isArray(cv.education)) fail("education must be an array");

  return cv;
}

function assertProject(project: Project, i: number): void {
  const at = `projects[${i}]`;
  if (!project?.name) {
    throw new Error(`Invalid CV data: ${at}.name is required`);
  }
  if (!Array.isArray(project.highlights)) {
    throw new Error(`Invalid CV data: ${at}.highlights must be an array`);
  }
}

function assertExperience(entry: ExperienceEntry, i: number): void {
  const at = `experience[${i}]`;
  if (entry.kind === "grouped") {
    if (!Array.isArray(entry.engagements) || entry.engagements.length === 0) {
      throw new Error(`Invalid CV data: ${at}.engagements must be non-empty`);
    }
  } else if (entry.kind === "role") {
    if (!entry.company) {
      throw new Error(`Invalid CV data: ${at}.company is required`);
    }
  } else {
    throw new Error(`Invalid CV data: ${at}.kind must be "grouped" or "role"`);
  }
}
