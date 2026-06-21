import { Body, Controller, Post } from '@nestjs/common';
import { GenerationService } from './generation.service';
import type { DeriveRulesDto, GenerateDto } from './dto/generate.dto';

@Controller('generate')
export class GenerationController {
  constructor(private readonly generation: GenerationService) {}

  @Post()
  generate(@Body() body: GenerateDto) {
    return this.generation.generate(
      body.jd,
      body.directive,
      body.language,
      body.person,
    );
  }

  @Post('derive-rules')
  deriveRules(@Body() body: DeriveRulesDto) {
    return this.generation.deriveRules(body);
  }
}
