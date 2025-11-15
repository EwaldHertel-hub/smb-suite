import { IsDateString, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateTimeEntryDto {
  @IsDateString()
  date!: string; // ISO-String: new Date().toISOString()

  @IsNumber()
  @Min(0.1)
  hours!: number;

  @IsOptional()
  @IsString()
  note?: string;
}