import { Module } from "@nestjs/common";

import { GenerationController } from "@/generation/generation.controller";
import { GenerationService } from "@/generation/generation.service";
import { LlmModule } from "@/llm/llm.module";
import { RetrievalModule } from "@/retrieval/retrieval.module";

@Module({
  imports: [LlmModule, RetrievalModule],
  controllers: [GenerationController],
  providers: [GenerationService],
})
export class GenerationModule {}
