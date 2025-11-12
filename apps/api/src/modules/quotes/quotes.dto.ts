import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

class QuoteItemDto {
  @IsString() title!: string;
  @IsNumber() qty!: number;
  @IsString() unit!: string;
  @IsNumber() unitPrice!: number;
  @IsNumber() vatRate!: number; // 19, 7
}

export class CreateQuoteDto {
  @IsString() clientId!: string;
  @IsOptional() @IsDateString() validUntil?: string;
  @IsOptional() @IsString() notes?: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuoteItemDto)
  items!: QuoteItemDto[];
}
