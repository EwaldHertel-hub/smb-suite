import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, RegisterDto } from "./auth.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly svc: AuthService) {}
  @Post("register") register(@Body() dto: RegisterDto) {
    return this.svc.register(dto);
  }
  @Post("login") login(@Body() dto: LoginDto) {
    return this.svc.login(dto);
  }
}
