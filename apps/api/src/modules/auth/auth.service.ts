import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService
  ) {}

  async register(dto: any) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (exists) throw new BadRequestException("Email already in use");

    const org = dto.organizationName
      ? await this.prisma.organization.create({
          data: { name: dto.organizationName },
        })
      : null;

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        name: dto.name,
        role: "OWNER",
        organizationId: org?.id ?? null,
      },
    });
    return this.issueTokens(user);
  }

  async login(dto: any) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new UnauthorizedException("Invalid credentials");
    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException("Invalid credentials");
    return this.issueTokens(user);
  }

  private async issueTokens(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
    };
    const accessToken = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_SECRET!,
      expiresIn: "30m",
    });
    const refreshToken = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_SECRET!,
      expiresIn: "7d",
    });
    return { accessToken, refreshToken, user: payload };
  }

  /**
   * Logout: optionally remove a single refresh token from storage.
   * If you persist refresh tokens (e.g. a RefreshToken Prisma model), this
   * will attempt to delete it. Otherwise it just returns success and the
   * client should drop tokens locally.
   */
  async logout(refreshToken?: string) {
    if (!refreshToken) return { success: true };

    try {
      // defensive: only attempt DB deletion if a refreshToken model exists
      if ((this.prisma as any).refreshToken) {
        await (this.prisma as any).refreshToken.deleteMany({
          where: { token: refreshToken },
        });
      }
    } catch (e) {
      // ignore if model/field does not exist or deletion fails
    }

    return { success: true };
  }

  /**
   * Logout all sessions for a user (server-side revoke).
   * Requires a persisted refresh token model with a userId field to work.
   * If you don't persist refresh tokens, call this when you want to force
   * clients to drop tokens locally (still returns success).
   */
  async logoutAll(userId?: string, refreshToken?: string) {
    // try to derive userId from refreshToken if not provided
    if (!userId && refreshToken) {
      try {
        const decoded = await this.jwt.verifyAsync(refreshToken, {
          secret: process.env.JWT_SECRET!,
        });
        userId = (decoded as any).sub;
      } catch (e) {
        // ignore decode errors
      }
    }

    if (!userId) return { success: true };

    try {
      if ((this.prisma as any).refreshToken) {
        await (this.prisma as any).refreshToken.deleteMany({
          where: { userId },
        });
      }
    } catch (e) {
      // ignore if model/field does not exist or deletion fails
    }

    return { success: true };
  }
}
