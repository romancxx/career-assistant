import { Body, Controller, Get, Post } from "@nestjs/common";

import { CvService } from "@/cv/cv.service";
import { TailorCvDto } from "@/cv/dto/tailor-cv-dto";
import { ProfileService } from "@/cv/profile.service";

@Controller("cv")
export class CvController {
  constructor(
    private readonly cv: CvService,
    private readonly profile: ProfileService,
  ) {}

  @Post("tailor")
  tailor(@Body() body: TailorCvDto) {
    return this.cv.generateTailoredCv(body.jd);
  }

  @Get("profile")
  getProfile() {
    return {
      profile: this.profile.getProfile(),
      education: this.profile.getEducation(),
    };
  }
}
