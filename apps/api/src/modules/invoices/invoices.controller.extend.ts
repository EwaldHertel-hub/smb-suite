import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/auth/jwt.guard';
import { RolesGuard } from '../../common/auth/roles.guard';
import { InvoicesPdfService } from './invoices.pdf';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('invoices')
export class InvoicesSendController {
  constructor(private readonly pdfSvc: InvoicesPdfService) {}

  @Post(':id/send')
  async send(@Param('id') id: string, @Body() body: { emailTo?: string }) {
    return this.pdfSvc.sendInvoice(id, body.emailTo);
  }
}
