import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import {
  type ExperienceInput,
  type PitchInput,
  type SkillInput,
  type RuleInput,
} from './dto';

@Controller('ingest')
export class IngestionController {
  constructor(private readonly ingestion: IngestionService) {}

  @Post('pitch')
  ingestPitch(@Body() body: PitchInput) {
    return this.ingestion.ingestPitch(body);
  }

  @Post('experience')
  ingestExperience(@Body() body: ExperienceInput) {
    return this.ingestion.ingestExperience(body);
  }

  @Post('skill')
  ingestSkill(@Body() body: SkillInput) {
    return this.ingestion.ingestSkill(body);
  }

  @Post('rule')
  ingestRule(@Body() body: RuleInput) {
    return this.ingestion.ingestRule(body);
  }

  @Get('all')
  listAll() {
    return this.ingestion.listAll();
  }

  @Post('backup')
  backup() {
    return this.ingestion.backupToJson();
  }

  @Put('experience/:id')
  updateExperience(@Param('id') id: string, @Body() body: ExperienceInput) {
    return this.ingestion.ingestExperience(body, id);
  }

  @Put('skill/:id')
  updateSkill(@Param('id') id: string, @Body() body: SkillInput) {
    return this.ingestion.ingestSkill(body, id);
  }

  @Put('pitch/:id')
  updatePitch(@Param('id') id: string, @Body() body: PitchInput) {
    return this.ingestion.ingestPitch(body, id);
  }

  @Put('rule/:id')
  updateRule(@Param('id') id: string, @Body() body: RuleInput) {
    return this.ingestion.ingestRule(body, id);
  }

  @Delete('experience/:id')
  deleteExperience(@Param('id') id: string) {
    return this.ingestion.delete('experiences', id);
  }

  @Delete('skill/:id')
  deleteSkill(@Param('id') id: string) {
    return this.ingestion.delete('skills', id);
  }

  @Delete('pitch/:id')
  deletePitch(@Param('id') id: string) {
    return this.ingestion.delete('pitches', id);
  }

  @Delete('rule/:id')
  deleteRule(@Param('id') id: string) {
    return this.ingestion.delete('rules', id);
  }
}
