import { IsDateString, IsOptional, IsString } from 'class-validator';
export class CreateInvoiceFromQuoteDto { @IsString() quoteId!: string; }
export class UpdateInvoiceDatesDto {
  @IsDateString() issueDate!: string;
  @IsDateString() dueDate!: string;
  @IsOptional() @IsString() notes?: string;
}