import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { QuotesService } from "./quotes.service";
import { JwtAuthGuard } from "../../common/auth/jwt.guard";
import { RolesGuard } from "../../common/auth/roles.guard";
import { CreateQuoteDto } from "./quotes.dto";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("quotes")
export class QuotesController {
  constructor(private readonly svc: QuotesService) {}
  @Get() list(@Req() req: any) {
    return this.svc.list(req.user.organizationId);
  }
  @Post() create(@Req() req: any, @Body() dto: CreateQuoteDto) {
    return this.svc.create(req.user.organizationId, dto);
  }
  @Get(":id") get(@Req() req: any, @Param("id") id: string) {
    return this.svc.get(req.user.organizationId, id);
  }
}
