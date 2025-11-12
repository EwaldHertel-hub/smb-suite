import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class QuotesService {
  constructor(private prisma: PrismaClient) {}
  async nextNumber(orgId: string) {
    const last = await this.prisma.quote.findFirst({
      where: { organizationId: orgId },
      orderBy: { number: "desc" },
    });
    return (last?.number ?? 0) + 1;
  }
  async create(dto: any) {
    const number = await this.nextNumber(dto.organizationId);
    const calc = dto.items.reduce(
      (acc, it) => {
        const line = it.qty * it.unitPrice;
        const vat = line * (it.vatRate / 100);
        acc.sub += line;
        acc.vat += vat;
        return acc;
      },
      { sub: 0, vat: 0 }
    );
    const total = calc.sub + calc.vat;
    return this.prisma.quote.create({
      data: { ...dto, number, subtotal: calc.sub, vatTotal: calc.vat, total },
    });
  }
  byNumber(number: number) {
    return this.prisma.quote.findUnique({ where: { number } });
  }
  async toInvoice(id: string) {
    /* ... */
  }
  async send(id: string) {
    /* PDF render + E-Mail Versand */
  }
}
