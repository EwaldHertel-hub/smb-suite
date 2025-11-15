// apps/api/src/modules/projects/projects.service.ts
import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto } from './projects.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  list(orgId: string) {
    return this.prisma.project.findMany({
      where: { organizationId: orgId },
      orderBy: { createdAt: 'desc' },
      include: {
        client: { select: { id: true, name: true } },
      },
    });
  }

  create(orgId: string, dto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        ...dto,
        organizationId: orgId,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
    });
  }

  async findOne(orgId: string, id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true } },
        client: { select: { id: true, name: true } },
        quotes: {
          select: { id: true, number: true, status: true, total: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
        },
        invoices: {
          select: { id: true, number: true, status: true, total: true, issueDate: true },
          orderBy: { issueDate: 'desc' },
        },
      },
    });
    if (!project || project.organizationId !== orgId) {
      throw new ForbiddenException();
    }
    return project;
  }

  async update(orgId: string, id: string, dto: UpdateProjectDto) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project || project.organizationId !== orgId) {
      throw new ForbiddenException();
    }
    return this.prisma.project.update({
      where: { id },
      data: {
        ...dto,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
    });
  }

  async remove(orgId: string, id: string) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project || project.organizationId !== orgId) {
      throw new ForbiddenException();
    }
    // soft delete wäre auch möglich; hier hard delete
    return this.prisma.project.delete({ where: { id } });
  }
}
