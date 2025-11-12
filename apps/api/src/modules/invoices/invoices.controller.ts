import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { InvoicesService } from "./invoices.service";
import { JwtAuthGuard } from "../../common/auth/jwt.guard";
import { RolesGuard } from "../../common/auth/roles.guard";
import { CreateInvoiceFromQuoteDto } from "./invoices.dto";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("invoices")
export class InvoicesController {
  constructor(private readonly svc: InvoicesService) {}
  @Get() list(@Req() req: any) {
    return this.svc.list(req.user.organizationId);
  }
  @Post("from-quote") create(
    @Req() req: any,
    @Body() dto: CreateInvoiceFromQuoteDto
  ) {
    return this.svc.fromQuote(req.user.organizationId, dto.quoteId);
  }
}
