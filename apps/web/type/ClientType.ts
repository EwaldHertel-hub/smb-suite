export interface Client {
  id: string;
  organizationId: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  billingAddr?: string | null;
  website?: string | null;
  createdAt: string;
}
