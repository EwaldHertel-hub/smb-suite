import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/auth/jwt.guard';
import { RolesGuard } from '../../common/auth/roles.guard';
import { QuotesPdfService } from './quotes.pdf';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('quotes')
export class QuotesSendController {
  constructor(private readonly pdfSvc: QuotesPdfService) {}

  @Post(':id/send')
  async send(@Param('id') id: string, @Body() body: { emailTo?: string }) {
    return this.pdfSvc.sendQuote(id, body.emailTo);
  }
}
