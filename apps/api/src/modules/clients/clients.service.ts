import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { CreateClientDto, UpdateClientDto } from "./clients.dto";

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateClientDto) {
    if (!dto.employees?.length) {
      throw new BadRequestException(
        "Ein Client muss mindestens einen Mitarbeiter haben."
      );
    }
    return this.prisma.client.create({
      data: {
        name: dto.name,
        street: dto.street,
        zipCode: dto.zipCode,
        city: dto.city,
        country: dto.country,
        website: dto.website,
        employees: {
          create: dto.employees.map((e) => ({
            firstName: e.firstName,
            lastName: e.lastName,
            email: e.email,
            phone: e.phone,
            departmentId: e.departmentId ?? null,
          })),
        },
      },
      include: { employees: { include: { department: true } } },
    });
  }

  findAll() {
    return this.prisma.client.findMany({
      include: { _count: { select: { employees: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  findOne(id: string) {
    return this.prisma.client.findUnique({
      where: { id },
      include: { employees: { include: { department: true } } },
    });
  }

  async update(id: string, dto: UpdateClientDto) {
    const existing = await this.prisma.client.findUnique({
      where: { id },
      include: { employees: true },
    });
    if (!existing) throw new NotFoundException();
    if (dto.employees && dto.employees.length === 0) {
      throw new BadRequestException(
        "Ein Client muss mindestens einen Mitarbeiter haben."
      );
    }
    return this.prisma.client.update({
      where: { id },
      data: {
        name: dto.name,
        street: dto.street,
        zipCode: dto.zipCode,
        city: dto.city,
        country: dto.country,
        website: dto.website,
      },
      include: { employees: true },
    });
  }

  async remove(id: string) {
    return this.prisma.client.delete({ where: { id } });
  }

  async removeEmployee(clientId: string, employeeId: string) {
    const count = await this.prisma.employee.count({ where: { clientId } });
    if (count <= 1)
      throw new BadRequestException(
        "Der letzte Mitarbeiter kann nicht gelöscht werden."
      );
    return this.prisma.employee.delete({ where: { id: employeeId } });
  }
}
