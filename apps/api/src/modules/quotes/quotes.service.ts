import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";

@Injectable()
export class QuotesService {
  constructor(private prisma: PrismaService) {}
  async list(orgId: string) {
    return this.prisma.quote.findMany({
      where: { organizationId: orgId },
      orderBy: { createdAt: "desc" },
    });
  }
  async nextNumber(orgId: string) {
    const last = await this.prisma.quote.findFirst({
      where: { organizationId: orgId },
      orderBy: { number: "desc" },
    });
    return (last?.number ?? 0) + 1;
  }
  async create(orgId: string, dto: any) {
    const number = await this.nextNumber(orgId);
    const sums = dto.items.reduce(
      (a: any, it: any) => {
        const line = it.qty * it.unitPrice;
        const vat = line * (it.vatRate / 100);
        a.sub += line;
        a.vat += vat;
        return a;
      },
      { sub: 0, vat: 0 }
    );
    return this.prisma.quote.create({
      data: {
        ...dto,
        number,
        organizationId: orgId,
        subtotal: sums.sub,
        vatTotal: sums.vat,
        total: sums.sub + sums.vat,
      },
    });
  }
  async get(orgId: string, id: string) {
    const q = await this.prisma.quote.findFirst({
      where: { id, organizationId: orgId },
    });
    if (!q) throw new NotFoundException();
    return q;
  }
}
