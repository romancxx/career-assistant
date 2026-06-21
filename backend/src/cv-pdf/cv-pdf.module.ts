import { Module } from "@nestjs/common";

import { CvPdfController } from "@/cv-pdf/cv-pdf.controller";
import { CvPdfService } from "@/cv-pdf/cv-pdf.service";

@Module({
  controllers: [CvPdfController],
  providers: [CvPdfService],
})
export class CvPdfModule {}
