import { Injectable, ForbiddenException } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './tasks.dto';
import { CreateTimeEntryDto } from './time-entry.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  private async ensureProject(userId: string, projectId: string) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      throw new ForbiddenException('Kein Projekt übergeben.');
    }else if (project.userId !== userId) {
      throw new ForbiddenException(`gesendet ${project.userId} erwartet ${userId}.`);
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
        timeEntries: { select: { hours: true } },
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

  async addTimeEntry(
  orgId: string,
  projectId: string,
  taskId: string,
  userId: string,
  dto: CreateTimeEntryDto,
) {
  await this.ensureProject(orgId, projectId);

  const task = await this.prisma.task.findUnique({ where: { id: taskId } });
  if (!task || task.assigneeId !== userId || task.projectId !== projectId) {
    throw new ForbiddenException('Kein Zugriff auf diese Task.');
  }
  const hoursDecimal = new Decimal(dto.hours);

  const entry = await this.prisma.$transaction(async (tx) => {
    const timeEntry = await tx.timeEntry.create({
      data: {
        projectId,
        taskId,
        userId,
        date: new Date(dto.date),
        hours: hoursDecimal,
        note: dto.note,
      },
    });
    // loggedHours auf Task erhöhen
    const prev = task.loggedHours ?? new Decimal(0);
    await tx.task.update({
      where: { id: taskId },
      data: {
        loggedHours: prev.plus(hoursDecimal),
      },
    });

    return timeEntry;
  });

  return entry;
}
}