export interface TimeEntry {
  id: string;
  taskId: string;
  userId: string;
  date: string;
  hours: number;
  note?: string | null;
  createdAt: string;
}
