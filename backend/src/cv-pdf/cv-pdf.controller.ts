import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  Param,
  Post,
  Put,
  Res,
} from "@nestjs/common";

import type { Response } from "express";
import type { Cv, CvSummary } from "@/cv-pdf/interfaces";

import { CvPdfService } from "@/cv-pdf/cv-pdf.service";
import { CvPayloadDto } from "@/cv-pdf/dto/cv-payload-dto";

@Controller("cv-pdf")
export class CvPdfController {
  constructor(private readonly service: CvPdfService) {}

  @Get()
  list(): CvSummary[] {
    return this.service.list();
  }

  @Post()
  create(@Body() body: CvPayloadDto): CvSummary {
    return this.service.create(this.service.parse(body.cv));
  }

  @Get(":id")
  getData(@Param("id") id: string): Cv {
    return this.service.getData(id);
  }

  @Put(":id")
  saveData(@Param("id") id: string, @Body() body: CvPayloadDto): Cv {
    return this.service.save(id, this.service.parse(body.cv));
  }

  @Delete(":id")
  @HttpCode(204)
  remove(@Param("id") id: string): void {
    this.service.remove(id);
  }

  @Post("render")
  @Header("Content-Type", "application/pdf")
  async render(
    @Body() body: CvPayloadDto,
    @Res() res: Response,
  ): Promise<void> {
    const cv = this.service.parse(body.cv);
    const pdf = await this.service.render(cv);
    const filename = cv.basics.name.replace(/\s+/g, "-").toLowerCase();
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}.pdf"`,
    );
    res.send(pdf);
  }
}
