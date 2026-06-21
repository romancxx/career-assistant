import * as fs from "fs";
import * as path from "path";

import { Injectable } from "@nestjs/common";

import { CvEducation, ProfileInfo } from "@/cv/interfaces";

// Lazy + cached: missing files throw on first request, not at boot.
@Injectable()
export class ProfileService {
  private readonly dataDir = path.join(process.cwd(), "data");
  private profileCache?: ProfileInfo;
  private educationCache?: CvEducation[];

  getProfile(): ProfileInfo {
    if (!this.profileCache) {
      this.profileCache = this.load<ProfileInfo>("profile.json");
    }
    return this.profileCache;
  }

  getEducation(): CvEducation[] {
    if (!this.educationCache) {
      this.educationCache = this.load<CvEducation[]>("education.json");
    }
    return this.educationCache;
  }

  private load<T>(filename: string): T {
    const filePath = path.join(this.dataDir, filename);
    if (!fs.existsSync(filePath)) {
      throw new Error(
        `Missing CV data file: ${filePath}. Create it (see README Setup) before tailoring a CV.`,
      );
    }
    try {
      return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
    } catch (err) {
      throw new Error(`Failed to parse ${filename}: ${(err as Error).message}`);
    }
  }
}
