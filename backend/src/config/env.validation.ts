import { plainToInstance } from "class-transformer";
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  validateSync,
} from "class-validator";

class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  ANTHROPIC_API_KEY!: string;

  @IsUrl({ require_tld: false })
  QDRANT_URL!: string;

  @IsUrl({ require_tld: false })
  OLLAMA_URL!: string;

  @IsOptional()
  @IsString()
  PORT?: string;

  @IsOptional()
  @IsString()
  CORS_ORIGIN?: string;
}

export function validateEnv(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validated, { skipMissingProperties: false });
  if (errors.length > 0) {
    const details = errors
      .map((e) => Object.values(e.constraints ?? {}).join(", "))
      .join("\n  - ");
    throw new Error(`Invalid environment configuration:\n  - ${details}`);
  }

  return validated;
}
