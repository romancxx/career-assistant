import { IsNotEmpty, IsString } from "class-validator";

export class TailorCvDto {
  @IsString()
  @IsNotEmpty()
  jd!: string;
}
