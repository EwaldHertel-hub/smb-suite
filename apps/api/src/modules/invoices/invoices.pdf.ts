import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { PdfService } from '../../pdf/pdf.service';
import { invoiceHtmlTemplate } from '../../pdf/templates';

@Injectable()
export class InvoicesPdfService {
  constructor(private prisma: PrismaService, private pdf: PdfService) {}

  async sendInvoice(id: string, emailTo?: string) {
    const invoice = await this.prisma.invoice.findUnique({ where: { id } });
    if (!invoice) throw new NotFoundException('Invoice not found');
    const client = await this.prisma.client.findUnique({ where: { id: invoice.clientId } });

    const html = invoiceHtmlTemplate({
      number: String(invoice.number),
      items: [],
      totals: { net: Number(invoice.subtotal), vat: Number(invoice.vatTotal), gross: Number(invoice.total) }
    });

    await this.pdf.enqueueInvoice({
      id,
      html,
      email: emailTo ? { to: emailTo, subject: `Rechnung ${invoice.number}`, text: 'Im Anhang finden Sie Ihre Rechnung.' } : (client?.email ? { to: client.email, subject: `Rechnung ${invoice.number}` } : undefined)
    });

    return { queued: true };
  }
}
