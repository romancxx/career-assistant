import { Module } from "@nestjs/common";

import { CvController } from "@/cv/cv.controller";
import { CvService } from "@/cv/cv.service";
import { ProfileService } from "@/cv/profile.service";
import { LlmModule } from "@/llm/llm.module";
import { QdrantModule } from "@/qdrant/qdrant.module";

@Module({
  imports: [LlmModule, QdrantModule],
  controllers: [CvController],
  providers: [CvService, ProfileService],
})
export class CvModule {}
