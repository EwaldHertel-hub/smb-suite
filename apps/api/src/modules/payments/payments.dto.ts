import { IsDateString, IsNumber, IsOptional, IsString, Min } from 'class-validator';
export class AddPaymentDto {
  @IsString() invoiceId!: string;
  @IsNumber() @Min(0.01) amount!: number;
  @IsDateString() date!: string;
  @IsString() method!: string; // Bank, Bar, etc.
  @IsOptional() @IsString() note?: string;
}