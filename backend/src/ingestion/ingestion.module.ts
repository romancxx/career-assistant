import { Module } from "@nestjs/common";

import { EmbeddingsModule } from "@/embeddings/embeddings.module";
import { IngestionController } from "@/ingestion/ingestion.controller";
import { IngestionService } from "@/ingestion/ingestion.service";
import { QdrantModule } from "@/qdrant/qdrant.module";

@Module({
  imports: [EmbeddingsModule, QdrantModule],
  controllers: [IngestionController],
  providers: [IngestionService],
})
export class IngestionModule {}
