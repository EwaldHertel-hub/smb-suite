import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ClientsService } from "./clients.service";
import { JwtAuthGuard } from "../../common/auth/jwt.guard";
import { RolesGuard } from "../../common/auth/roles.guard";
import {
  CreateClientDto,
  UpdateClientDto,
  ClientEmployeeDto,
} from "./clients.dto";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("clients")
export class ClientsController {
  constructor(private readonly svc: ClientsService) {}

  @Get()
  list(@Req() req: any) {
    return this.svc.list(req.user.organizationId);
  }

  @Post()
  create(@Req() req: any, @Body() dto: CreateClientDto) {
    return this.svc.create(req.user.organizationId, dto);
  }

  @Get(":id")
  get(@Req() req: any, @Param("id") id: string) {
    return this.svc.get(req.user.organizationId, id);
  }

  @Patch(":id")
  update(
    @Req() req: any,
    @Param("id") id: string,
    @Body() dto: UpdateClientDto
  ) {
    return this.svc.update(req.user.organizationId, id, dto);
  }

  @Delete(":id")
  remove(@Req() req: any, @Param("id") id: string) {
    return this.svc.remove(req.user.organizationId, id);
  }


  @Get(":id/employees")
  listEmployees(@Req() req: any, @Param("id") id: string) {
    return this.svc.listEmployees(req.user.organizationId, id);
  }

  @Post(":id/employees")
  addEmployee(
    @Req() req: any,
    @Param("id") id: string,
    @Body() dto: ClientEmployeeDto
  ) {
    return this.svc.addEmployee(req.user.organizationId, id, dto);
  }

  @Patch(":id/employees/:empId")
  updateEmployee(
    @Req() req: any,
    @Param("id") id: string,
    @Param("empId") empId: string,
    @Body() dto: ClientEmployeeDto
  ) {
    return this.svc.updateEmployee(req.user.organizationId, id, empId, dto);
  }

  @Delete(":id/employees/:empId")
  deleteEmployee(
    @Req() req: any,
    @Param("id") id: string,
    @Param("empId") empId: string
  ) {
    return this.svc.deleteEmployee(req.user.organizationId, id, empId);
  }
}
