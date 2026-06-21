import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";

export type SkillLevel = "expert" | "strong" | "competent";
const SKILL_LEVELS: SkillLevel[] = ["expert", "strong", "competent"];

export class SkillDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsIn(SKILL_LEVELS)
  level!: SkillLevel;

  @IsOptional()
  @IsInt()
  @Min(0)
  yearsOfExperience?: number;
}
