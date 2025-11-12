import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ClientsService } from "./clients.service";
import { CreateClientDto } from "./clients.dto";

@Controller("clients")
export class ClientsController {
  constructor(private readonly service: ClientsService) {}

  @Post() create(@Body() dto: CreateClientDto) {
    return this.service.create(dto);
  }
  @Get() findAll() {
    return this.service.findAll();
  }
  @Get(":id") findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }
  @Patch(":id") update(@Param("id") id: string, @Body() dto: UpdateClientDto) {
    return this.service.update(id, dto);
  }
  @Delete(":id") remove(@Param("id") id: string) {
    return this.service.remove(id);
  }

  @Delete(":clientId/employees/:employeeId")
  removeEmployee(
    @Param("clientId") clientId: string,
    @Param("employeeId") employeeId: string
  ) {
    return this.service.removeEmployee(clientId, employeeId);
  }
}
