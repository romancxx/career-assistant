import { Body, Controller, Post } from '@nestjs/common';
import { RetrievalService } from './retrieval.service';
import type { RetrieveDto } from './dto/retrieve.dto';

@Controller('retrieval')
export class RetrievalController {
  constructor(private readonly retrieval: RetrievalService) {}

  @Post('preview')
  preview(@Body() body: RetrieveDto) {
    return this.retrieval.retrieveForJd(body.jd);
  }
}
