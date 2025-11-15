export type InvoiceStatus =
  | "DRAFT"
  | "SENT"
  | "PARTIALLY_PAID"
  | "PAID"
  | "OVERDUE"
  | "CANCELED";

export interface Invoice {
  id: string;
  organizationId: string;
  clientId: string;
  quoteId?: string | null;
  number: number;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  currency: string;
  subtotal: number;
  vatTotal: number;
  total: number;
  paidAmount: number;
  pdfUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  title: string;
  qty: number;
  unit: string;
  unitPrice: number;
  vatRate: number;
}
