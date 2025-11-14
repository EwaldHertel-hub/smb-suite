import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, UpdateUserDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  list(orgId: string) {
    return this.prisma.user.findMany({
      where: { organizationId: orgId },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        department: true,
        position: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  async create(orgId: string, dto: CreateUserDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new BadRequestException('E-Mail wird bereits verwendet.');

    const passwordHash = await bcrypt.hash(dto.password, 10);

    return this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        passwordHash,
        role: dto.role ?? 'MEMBER',
        department: dto.department,
        position: dto.position,
        organizationId: orgId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        department: true,
        position: true,
        isActive: true,
      },
    });
  }

  async update(orgId: string, userId: string, dto: UpdateUserDto, actingUserId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.organizationId !== orgId) {
      throw new ForbiddenException('Kein Zugriff auf diesen Benutzer.');
    }

    // Optional: Owner nicht selbst auf MEMBER setzen, etc.

    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        department: true,
        position: true,
        isActive: true,
      },
    });
  }

  async remove(orgId: string, userId: string, actingUserId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.organizationId !== orgId) {
      throw new ForbiddenException('Kein Zugriff auf diesen Benutzer.');
    }

    // Soft-Delete: isActive = false
    return this.prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
      },
    });
  }
}
