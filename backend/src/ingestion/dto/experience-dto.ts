import {
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";

export type JobType = "full-time" | "contract";
const JOB_TYPES: JobType[] = ["full-time", "contract"];

export class ExperienceDto {
  @IsString()
  @IsNotEmpty()
  companyName!: string;

  @IsOptional()
  @IsString()
  companyDescription?: string;

  @IsIn(JOB_TYPES)
  jobType!: JobType;

  @IsString()
  @IsNotEmpty()
  role!: string;

  @IsString()
  @IsNotEmpty()
  startDate!: string; // "2023-01"

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsArray()
  @IsString({ each: true })
  stack!: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  achievements!: string[];

  @IsOptional()
  @IsString()
  context?: string;
}
