import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { CreateClientDto, UpdateClientDto } from "./clients.dto";

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  list(orgId: string) {
    return this.prisma.client.findMany({
      where: { organizationId: orgId },
      orderBy: { createdAt: "desc" },
      include: { employees: true },
    });
  }

  async create(orgId: string, dto: CreateClientDto) {
    if (!dto.employees || dto.employees.length === 0) {
      throw new BadRequestException("Mindestens ein Mitarbeiter erforderlich");
    }

    // genau einen primary markieren, wenn keiner gesetzt
    const employees = dto.employees.map((e, idx) => ({
      ...e,
      isPrimary: e.isPrimary ?? idx === 0,
    }));

    return this.prisma.client.create({
      data: {
        organizationId: orgId,
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        street: dto.street,
        postalCode: dto.postalCode,
        city: dto.city,
        country: dto.country,
        website: dto.website,
        employees: {
          create: employees,
        },
      },
      include: { employees: true },
    });
  }

  get(orgId: string, id: string) {
    return this.prisma.client.findFirst({
      where: { id, organizationId: orgId },
      include: { employees: true },
    });
  }

  update(orgId: string, id: string, dto: UpdateClientDto) {
    return this.prisma.client.update({
      where: { id },
      data: dto,
      include: { employees: true },
    });
  }

  remove(orgId: string, id: string) {
    return this.prisma.client.delete({ where: { id } });
  }

  // 🔹 Mitarbeiter-Methoden

  listEmployees(orgId: string, clientId: string) {
    return this.prisma.clientEmployee.findMany({
      where: { clientId, client: { organizationId: orgId } },
      orderBy: { createdAt: "asc" },
    });
  }

  addEmployee(orgId: string, clientId: string, data: any) {
    return this.prisma.clientEmployee.create({
      data: {
        ...data,
        clientId,
      },
    });
  }

  updateEmployee(
    orgId: string,
    clientId: string,
    employeeId: string,
    data: any
  ) {
    return this.prisma.clientEmployee.update({
      where: { id: employeeId },
      data,
    });
  }

  deleteEmployee(orgId: string, clientId: string, employeeId: string) {
    return this.prisma.clientEmployee.delete({
      where: { id: employeeId },
    });
  }
}
