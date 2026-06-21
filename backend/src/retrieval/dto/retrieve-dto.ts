import { IsNotEmpty, IsString } from "class-validator";

export class RetrieveDto {
  @IsString()
  @IsNotEmpty()
  jd!: string;
}
