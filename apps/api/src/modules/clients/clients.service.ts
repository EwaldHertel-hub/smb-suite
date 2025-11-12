import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}
  list(orgId: string) { return this.prisma.client.findMany({ where: { organizationId: orgId }, orderBy: { createdAt: 'desc' } }); }
  create(orgId: string, dto: any) { return this.prisma.client.create({ data: { ...dto, organizationId: orgId } }); }
  get(orgId: string, id: string) { return this.prisma.client.findFirst({ where: { id, organizationId: orgId } }); }
  update(orgId: string, id: string, dto: any) { return this.prisma.client.update({ where: { id }, data: dto }); }
  remove(orgId: string, id: string) { return this.prisma.client.delete({ where: { id } }); }
}