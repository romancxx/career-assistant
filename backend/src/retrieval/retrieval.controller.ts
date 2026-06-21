import { Body, Controller, Post } from "@nestjs/common";

import { RetrieveDto } from "@/retrieval/dto/retrieve-dto";
import { RetrievalService } from "@/retrieval/retrieval.service";

@Controller("retrieval")
export class RetrievalController {
  constructor(private readonly retrieval: RetrievalService) {}

  @Post("preview")
  preview(@Body() body: RetrieveDto) {
    return this.retrieval.retrieveForJd(body.jd);
  }
}
