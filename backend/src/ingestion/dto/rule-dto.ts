import { IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";

import type { Language, Person } from "@/common/voice";
import { LANGUAGES, PERSONS } from "@/common/voice";

export class RuleDto {
  @IsString()
  @IsNotEmpty()
  text!: string;

  @IsOptional()
  @IsIn(LANGUAGES)
  language?: Language;

  @IsOptional()
  @IsIn(PERSONS)
  person?: Person;
}
