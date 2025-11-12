import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}
  async add(orgId: string, dto: any) {
    const inv = await this.prisma.invoice.findFirst({ where: { id: dto.invoiceId, organizationId: orgId } });
    if (!inv) throw new Error('Invoice not found');
    const payment = await this.prisma.payment.create({ data: { ...dto, amount: dto.amount, invoiceId: inv.id } });
    const sum = await this.prisma.payment.aggregate({ _sum: { amount: true }, where: { invoiceId: inv.id } });
    const paid = Number(sum._sum.amount ?? 0);
    let status: any = inv.status;
    if (paid >= Number(inv.total)) status = 'PAID';
    else if (paid > 0) status = 'PARTIALLY_PAID';
    await this.prisma.invoice.update({ where: { id: inv.id }, data: { paidAmount: paid, status } });
    return payment;
  }
}