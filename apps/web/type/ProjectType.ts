export type ProjectStatus = "PLANNING" | "IN_PROGRESS" | "ON_HOLD" | "DONE" | "CANCELED";

export type ProjectType = "SOFTWARE" | "WEB" | "DESIGN" | "CONSULTING";

export interface Project {
  id: string;
  organizationId: string;
  name: string;
  description?: string | null;
  status: ProjectStatus;
  type: ProjectType;
  budget?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
}
