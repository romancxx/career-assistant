import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";

import { ExperienceDto } from "@/ingestion/dto/experience-dto";
import { PitchDto } from "@/ingestion/dto/pitch-dto";
import { RuleDto } from "@/ingestion/dto/rule-dto";
import { SkillDto } from "@/ingestion/dto/skill-dto";
import { IngestionService } from "@/ingestion/ingestion.service";

@Controller("ingest")
export class IngestionController {
  constructor(private readonly ingestion: IngestionService) {}

  @Post("pitch")
  ingestPitch(@Body() body: PitchDto) {
    return this.ingestion.ingestPitch(body);
  }

  @Post("experience")
  ingestExperience(@Body() body: ExperienceDto) {
    return this.ingestion.ingestExperience(body);
  }

  @Post("skill")
  ingestSkill(@Body() body: SkillDto) {
    return this.ingestion.ingestSkill(body);
  }

  @Post("rule")
  ingestRule(@Body() body: RuleDto) {
    return this.ingestion.ingestRule(body);
  }

  @Get("all")
  listAll() {
    return this.ingestion.listAll();
  }

  @Post("backup")
  backup() {
    return this.ingestion.backupToJson();
  }

  @Put("experience/:id")
  updateExperience(@Param("id") id: string, @Body() body: ExperienceDto) {
    return this.ingestion.ingestExperience(body, id);
  }

  @Put("skill/:id")
  updateSkill(@Param("id") id: string, @Body() body: SkillDto) {
    return this.ingestion.ingestSkill(body, id);
  }

  @Put("pitch/:id")
  updatePitch(@Param("id") id: string, @Body() body: PitchDto) {
    return this.ingestion.ingestPitch(body, id);
  }

  @Put("rule/:id")
  updateRule(@Param("id") id: string, @Body() body: RuleDto) {
    return this.ingestion.ingestRule(body, id);
  }

  @Delete("experience/:id")
  deleteExperience(@Param("id") id: string) {
    return this.ingestion.delete("experiences", id);
  }

  @Delete("skill/:id")
  deleteSkill(@Param("id") id: string) {
    return this.ingestion.delete("skills", id);
  }

  @Delete("pitch/:id")
  deletePitch(@Param("id") id: string) {
    return this.ingestion.delete("pitches", id);
  }

  @Delete("rule/:id")
  deleteRule(@Param("id") id: string) {
    return this.ingestion.delete("rules", id);
  }
}
