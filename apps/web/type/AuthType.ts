import { UserRole } from '@/type/UserType';

export interface AuthUser {
  sub: string;
  email: string;
  role: UserRole;
  organizationId: string | null;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}
