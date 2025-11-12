import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { JwtAuthGuard } from '../../common/auth/jwt.guard';
import { RolesGuard } from '../../common/auth/roles.guard';
import { CreateClientDto, UpdateClientDto } from './clients.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('clients')
export class ClientsController {
  constructor(private readonly svc: ClientsService) {}
  @Get() list(@Req() req: any) { return this.svc.list(req.user.organizationId); }
  @Post() create(@Req() req: any, @Body() dto: CreateClientDto) { return this.svc.create(req.user.organizationId, dto); }
  @Get(':id') get(@Req() req: any, @Param('id') id: string) { return this.svc.get(req.user.organizationId, id); }
  @Patch(':id') update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateClientDto) { return this.svc.update(req.user.organizationId, id, dto); }
  @Delete(':id') remove(@Req() req: any, @Param('id') id: string) { return this.svc.remove(req.user.organizationId, id); }
}
