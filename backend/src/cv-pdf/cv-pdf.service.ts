import { BadRequestException, Injectable } from "@nestjs/common";

import { Cv } from "@/cv-pdf/interfaces";

import { loadCv, saveCv, validateCv } from "@/cv-pdf/generate/cv-loader";
import { renderCvPdf } from "@/cv-pdf/generate/render-pdf";

@Injectable()
export class CvPdfService {
  getData(): Cv {
    return loadCv();
  }

  // Client-supplied payload: structural failures are a 400, not a 500.
  parse(cv: unknown): Cv {
    try {
      return validateCv(cv);
    } catch (err) {
      throw new BadRequestException((err as Error).message);
    }
  }

  save(cv: Cv): Cv {
    return saveCv(cv);
  }

  render(cv: Cv): Promise<Buffer> {
    return renderCvPdf(cv);
  }
}
