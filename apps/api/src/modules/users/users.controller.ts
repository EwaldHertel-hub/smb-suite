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
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/auth/jwt.guard';
import { RolesGuard } from '../../common/auth/roles.guard';
import { Roles } from '../../common/auth/roles.decorator';
import { CreateUserDto, UpdateUserDto } from './users.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly svc: UsersService) {}

  @Get()
  @Roles('OWNER', 'ADMIN')
  list(@Req() req: any) {
    return this.svc.list(req.user.organizationId);
  }

  @Post()
  @Roles('OWNER', 'ADMIN')
  create(@Req() req: any, @Body() dto: CreateUserDto) {
    return this.svc.create(req.user.organizationId, dto);
  }

  @Patch(':id')
  @Roles('OWNER', 'ADMIN')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.svc.update(req.user.organizationId, id, dto, req.user.sub);
  }

  @Delete(':id')
  @Roles('OWNER', 'ADMIN')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.svc.remove(req.user.organizationId, id, req.user.sub);
  }
}
