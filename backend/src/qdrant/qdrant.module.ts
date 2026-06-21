import { Module } from "@nestjs/common";

import { QdrantService } from "@/qdrant/qdrant.service";

@Module({
  providers: [QdrantService],
  exports: [QdrantService],
})
export class QdrantModule {}
