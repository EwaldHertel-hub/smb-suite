export type UserRole = "OWNER" | "ADMIN" | "MEMBER";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId: string | null; 
  createdAt: string;
  updatedAt: string;
}