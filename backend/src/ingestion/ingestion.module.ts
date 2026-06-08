import { Module } from '@nestjs/common';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { EmbeddingsModule } from '../embeddings/embeddings.module';
import { QdrantModule } from '../qdrant/qdrant.module';

@Module({
  imports: [EmbeddingsModule, QdrantModule],
  controllers: [IngestionController],
  providers: [IngestionService],
})
export class IngestionModule {}
