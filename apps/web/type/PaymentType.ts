export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  date: string;
  method: string;
  note?: string | null;
}
