import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './tasks.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  private async ensureProject(userId: string, projectId: string) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project || project.userId !== userId) {
      throw new ForbiddenException('Kein Zugriff auf dieses Projekt.');
    }
    return project;
  }

  async list(userId: string, projectId: string) {
    await this.ensureProject(userId, projectId);
    return this.prisma.task.findMany({
      where: { assigneeId: userId, projectId },
      orderBy: { createdAt: 'asc' },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async create(userId: string, projectId: string, dto: CreateTaskDto) {
    await this.ensureProject(userId, projectId);
    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status,
        priority: dto.priority,
        assigneeId: dto.assigneeId,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        estimateHours: dto.estimateHours,
        projectId,
      },
    });
  }

  async update(userId: string, projectId: string, taskId: string, dto: UpdateTaskDto) {
    await this.ensureProject(userId, projectId);
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task || task.assigneeId !== userId || task.projectId !== projectId) {
      throw new ForbiddenException('Kein Zugriff auf diese Task.');
    }

    return this.prisma.task.update({
      where: { id: taskId },
      data: {
        ...dto,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      },
    });
  }

  async remove(userId: string, projectId: string, taskId: string) {
    await this.ensureProject(userId, projectId);
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task || task.assigneeId !== userId || task.projectId !== projectId) {
      throw new ForbiddenException('Kein Zugriff auf diese Task.');
    }
    return this.prisma.task.delete({ where: { id: taskId } });
  }
}