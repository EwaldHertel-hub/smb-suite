import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../../common/auth/jwt.guard';
import { RolesGuard } from '../../common/auth/roles.guard';
import { Roles } from '../../common/auth/roles.decorator';
import { CreateTaskDto, UpdateTaskDto } from './tasks.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('projects/:projectId/tasks')
export class TasksController {
  constructor(private readonly svc: TasksService) {}

  @Get()
  list(@Req() req: any, @Param('projectId') projectId: string) {
    return this.svc.list(req.user.organizationId, projectId);
  }

  @Post()
  // normale Mitarbeiter dürfen Tasks anlegen, daher keine Rollenbeschränkung
  create(
    @Req() req: any,
    @Param('projectId') projectId: string,
    @Body() dto: CreateTaskDto,
  ) {
    return this.svc.create(req.user.organizationId, projectId, dto);
  }

  @Patch(':taskId')
  update(
    @Req() req: any,
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.svc.update(req.user.organizationId, projectId, taskId, dto);
  }

  @Delete(':taskId')
  @Roles('OWNER', 'ADMIN')
  remove(
    @Req() req: any,
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
  ) {
    return this.svc.remove(req.user.organizationId, projectId, taskId);
  }
}
