import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}
  async list(orgId: string) { return this.prisma.invoice.findMany({ where: { organizationId: orgId }, orderBy: { issueDate: 'desc' } }); }
  async fromQuote(orgId: string, quoteId: string) {
    const quote = await this.prisma.quote.findFirst({ where: { id: quoteId, organizationId: orgId } });
    if (!quote) throw new NotFoundException('Quote not found');
    const last = await this.prisma.invoice.findFirst({ where: { organizationId: orgId }, orderBy: { number: 'desc' } });
    const number = (last?.number ?? 0) + 1;
    return this.prisma.invoice.create({
      data: {
        organizationId: orgId,
        clientId: quote.clientId,
        quoteId: quote.id,
        number,
        status: 'SENT',
        issueDate: new Date(),
        dueDate: new Date(Date.now() + 14*24*3600*1000),
        currency: quote.currency,
        subtotal: quote.subtotal,
        vatTotal: quote.vatTotal,
        total: quote.total,
      },
    });
  }
}