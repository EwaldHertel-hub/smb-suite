import { Body, Controller, Get, Patch, Req, UseGuards } from "@nestjs/common";
import { OrganizationsService } from "./organizations.service";
import { JwtAuthGuard } from "../../common/auth/jwt.guard";
import { Roles, Role } from "../../common/auth/roles.decorator";
import { RolesGuard } from "../../common/auth/roles.guard";
import { UpdateOrgDto } from "./organizations.dto";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("organizations")
export class OrganizationsController {
  constructor(private readonly svc: OrganizationsService) {}
  @Get("me") me(@Req() req: any) {
    return this.svc.me(req.user.organizationId);
  }
  @Roles("OWNER", "ADMIN")
  @Patch("me")
  update(@Req() req: any, @Body() dto: UpdateOrgDto) {
    return this.svc.update(req.user.organizationId, dto);
  }
}
