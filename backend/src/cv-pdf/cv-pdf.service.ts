import { Injectable } from '@nestjs/common';
import { Cv } from './interfaces';
import { loadCv, saveCv, validateCv } from './generate/cv-loader';
import { renderCvPdf } from './generate/render-pdf';

@Injectable()
export class CvPdfService {
  getData(): Cv {
    return loadCv();
  }

  parse(cv: unknown): Cv {
    return validateCv(cv);
  }

  save(cv: Cv): Cv {
    return saveCv(cv);
  }

  render(cv: Cv): Promise<Buffer> {
    return renderCvPdf(cv);
  }
}
