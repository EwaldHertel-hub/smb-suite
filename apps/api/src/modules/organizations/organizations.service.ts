import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}
  me(orgId: string) {
    return this.prisma.organization.findUnique({ where: { id: orgId } });
  }
  update(orgId: string, dto: any) {
    return this.prisma.organization.update({ where: { id: orgId }, data: dto });
  }
}
