import { IsObject } from "class-validator";

// Shallow check only — the full CV shape is validated downstream by
// `validateCv`, which raises a BadRequest on structural errors.
export class CvPayloadDto {
  @IsObject()
  cv!: Record<string, unknown>;
}
