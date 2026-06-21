import { Module } from '@nestjs/common';
import { LlmModule } from '../llm/llm.module';
import { QdrantModule } from '../qdrant/qdrant.module';
import { CvController } from './cv.controller';
import { CvService } from './cv.service';
import { ProfileService } from './profile.service';

@Module({
  imports: [LlmModule, QdrantModule],
  controllers: [CvController],
  providers: [CvService, ProfileService],
})
export class CvModule {}
