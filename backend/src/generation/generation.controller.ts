import { Body, Controller, Post } from "@nestjs/common";

import { DeriveRulesDto } from "@/generation/dto/derive-rules-dto";
import { GenerateDto } from "@/generation/dto/generate-dto";
import { GenerationService } from "@/generation/generation.service";

@Controller("generate")
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

  @Post("derive-rules")
  deriveRules(@Body() body: DeriveRulesDto) {
    return this.generation.deriveRules(body);
  }
}
