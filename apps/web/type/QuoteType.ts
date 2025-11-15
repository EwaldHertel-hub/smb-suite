export type QuoteStatus =
  | "DRAFT"
  | "SENT"
  | "ACCEPTED"
  | "REJECTED"
  | "EXPIRED";

export interface Quote {
  id: string;
  organizationId: string;
  clientId: string;
  number: number;
  status: QuoteStatus;
  currency: string;
  validUntil?: string | null;
  notes?: string | null;
  subtotal: number;
  vatTotal: number;
  total: number;
  pdfUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface QuoteItem {
  id: string;
  quoteId: string;
  title: string;
  qty: number;
  unit: string;
  unitPrice: number;
  vatRate: number;
}
