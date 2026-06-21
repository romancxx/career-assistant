import { IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";

import type { Language, Person } from "@/common/voice";
import { LANGUAGES, PERSONS } from "@/common/voice";

export class DeriveRulesDto {
  @IsString()
  @IsNotEmpty()
  jd!: string;

  @IsString()
  originalPitch!: string;

  @IsString()
  editedPitch!: string;

  @IsString()
  feedback!: string;

  @IsOptional()
  @IsIn(LANGUAGES)
  language?: Language;

  @IsOptional()
  @IsIn(PERSONS)
  person?: Person;
}
