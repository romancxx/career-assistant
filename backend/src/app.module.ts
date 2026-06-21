import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { validateEnv } from "@/config/env.validation";
import { CvModule } from "@/cv/cv.module";
import { CvPdfModule } from "@/cv-pdf/cv-pdf.module";
import { GenerationModule } from "@/generation/generation.module";
import { HealthModule } from "@/health/health.module";
import { IngestionModule } from "@/ingestion/ingestion.module";
import { LlmModule } from "@/llm/llm.module";
import { RetrievalModule } from "@/retrieval/retrieval.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    HealthModule,
    IngestionModule,
    RetrievalModule,
    LlmModule,
    GenerationModule,
    CvModule,
    CvPdfModule,
  ],
})
export class AppModule {}
