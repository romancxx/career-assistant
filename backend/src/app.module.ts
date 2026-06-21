import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { IngestionModule } from './ingestion/ingestion.module';
import { RetrievalModule } from './retrieval/retrieval.module';
import { LlmModule } from './llm/llm.module';
import { GenerationModule } from './generation/generation.module';
import { CvModule } from './cv/cv.module';
import { CvPdfModule } from './cv-pdf/cv-pdf.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
