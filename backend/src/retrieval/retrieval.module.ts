import { Module } from '@nestjs/common';
import { RetrievalController } from './retrieval.controller';
import { RetrievalService } from './retrieval.service';
import { EmbeddingsModule } from '../embeddings/embeddings.module';
import { QdrantModule } from '../qdrant/qdrant.module';

@Module({
  imports: [EmbeddingsModule, QdrantModule],
  controllers: [RetrievalController],
  providers: [RetrievalService],
  exports: [RetrievalService],
})
export class RetrievalModule {}
