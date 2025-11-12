import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { PdfService } from '../../pdf/pdf.service';
import { quoteHtmlTemplate } from '../../pdf/templates';

@Injectable()
export class QuotesPdfService {
  constructor(private prisma: PrismaService, private pdf: PdfService) {}

  async sendQuote(id: string, emailTo?: string) {
    const quote = await this.prisma.quote.findUnique({ where: { id: id } });
    if (!quote) throw new NotFoundException('Quote not found');
    const client = await this.prisma.client.findUnique({ where: { id: quote.clientId } });
    const items = await this.prisma.quoteItem.findMany({ where: { quoteId: id } });

    const html = quoteHtmlTemplate({
      number: String(quote.number),
      items: items.map((i) => ({ title: i.title, qty: Number(i.qty), unit: i.unit, unitPrice: Number(i.unitPrice) })),
      totals: { net: Number(quote.subtotal), vat: Number(quote.vatTotal), gross: Number(quote.total) }
    });

    await this.pdf.enqueueQuote({
      id,
      html,
      email: emailTo ? { to: emailTo, subject: `Angebot ${quote.number}`, text: 'Im Anhang finden Sie Ihr Angebot.' } : (client?.email ? { to: client.email, subject: `Angebot ${quote.number}` } : undefined)
    });

    return { queued: true };
  }
}
