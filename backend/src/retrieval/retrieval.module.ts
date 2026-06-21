import { Module } from "@nestjs/common";

import { EmbeddingsModule } from "@/embeddings/embeddings.module";
import { QdrantModule } from "@/qdrant/qdrant.module";
import { RetrievalController } from "@/retrieval/retrieval.controller";
import { RetrievalService } from "@/retrieval/retrieval.service";

@Module({
  imports: [EmbeddingsModule, QdrantModule],
  controllers: [RetrievalController],
  providers: [RetrievalService],
  exports: [RetrievalService],
})
export class RetrievalModule {}
