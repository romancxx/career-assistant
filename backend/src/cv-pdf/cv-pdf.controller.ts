import { Body, Controller, Get, Header, Post, Put, Res } from '@nestjs/common';
import type { Response } from 'express';
import { CvPdfService } from './cv-pdf.service';
import type { Cv } from './interfaces';

@Controller('cv-pdf')
export class CvPdfController {
  constructor(private readonly service: CvPdfService) {}

  @Get('data')
  getData(): Cv {
    return this.service.getData();
  }

  @Put('data')
  saveData(@Body() body: { cv: unknown }): Cv {
    return this.service.save(this.service.parse(body.cv));
  }

  @Post('render')
  @Header('Content-Type', 'application/pdf')
  async render(
    @Body() body: { cv: unknown },
    @Res() res: Response,
  ): Promise<void> {
    const cv = this.service.parse(body.cv);
    const pdf = await this.service.render(cv);
    const filename = cv.basics.name.replace(/\s+/g, '-').toLowerCase();
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${filename}.pdf"`,
    );
    res.send(pdf);
  }
}
