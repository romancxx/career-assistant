import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { Cv, CvSummary } from "@/cv-pdf/interfaces";

import {
  cvExists,
  cvPath,
  deleteCv,
  listCvs,
  loadCv,
  nextCvId,
  saveCv,
  validateCv,
} from "@/cv-pdf/generate/cv-loader";
import { renderCvPdf } from "@/cv-pdf/generate/render-pdf";

@Injectable()
export class CvPdfService {
  list(): CvSummary[] {
    return listCvs();
  }

  getData(id: string): Cv {
    return loadCv(this.resolve(id));
  }

  // Client-supplied payload: structural failures are a 400, not a 500.
  parse(cv: unknown): Cv {
    try {
      return validateCv(cv);
    } catch (err) {
      throw new BadRequestException((err as Error).message);
    }
  }

  save(id: string, cv: Cv): Cv {
    return saveCv(cv, this.resolve(id));
  }

  create(cv: Cv): CvSummary {
    const id = nextCvId();
    const saved = saveCv(cv, cvPath(id));
    return { id, label: saved.label?.trim() || saved.basics.title };
  }

  remove(id: string): void {
    this.resolve(id);
    try {
      deleteCv(id);
    } catch (err) {
      throw new BadRequestException((err as Error).message);
    }
  }

  render(cv: Cv): Promise<Buffer> {
    return renderCvPdf(cv);
  }

  // Map a client-supplied id to its file path: bad format -> 400, missing -> 404.
  private resolve(id: string): string {
    let filePath: string;
    try {
      filePath = cvPath(id);
    } catch (err) {
      throw new BadRequestException((err as Error).message);
    }
    if (!cvExists(id)) {
      throw new NotFoundException(`CV not found: ${id}`);
    }
    return filePath;
  }
}
