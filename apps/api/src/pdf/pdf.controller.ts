import { Body, Controller, Param, Post } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { quoteHtmlTemplate, invoiceHtmlTemplate } from './templates';

@Controller('pdf')
export class PdfController {
  constructor(private readonly svc: PdfService) {}

  @Post('quote/:id')
  async renderQuote(@Param('id') id: string, @Body() body: { html?: string; emailTo?: string }) {
    const html = body.html ?? quoteHtmlTemplate({ number: id, items: [], totals: { net: 0, vat: 0, gross: 0 } });
    const email = body.emailTo ? { to: body.emailTo, subject: `Angebot ${id}`, text: 'Im Anhang finden Sie Ihr Angebot als PDF.' } : undefined;
    const job = await this.svc.enqueueQuote({ id, html, email });
    return { queued: true, jobId: job.id };
  }

  @Post('invoice/:id')
  async renderInvoice(@Param('id') id: string, @Body() body: { html?: string; emailTo?: string }) {
    const html = body.html ?? invoiceHtmlTemplate({ number: id, items: [], totals: { net: 0, vat: 0, gross: 0 } });
    const email = body.emailTo ? { to: body.emailTo, subject: `Rechnung ${id}`, text: 'Im Anhang finden Sie Ihre Rechnung als PDF.' } : undefined;
    const job = await this.svc.enqueueInvoice({ id, html, email });
    return { queued: true, jobId: job.id };
  }
}
