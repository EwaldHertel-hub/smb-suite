import { IsString, IsOptional, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';


class QuoteItemDto {
@IsString() title!: string;
@IsNumber() qty!: number;
@IsString() unit!: string;
@IsNumber() unitPrice!: number;
@IsNumber() vatRate!: number;
}


export class CreateQuoteDto {
@IsString() organizationId!: string;
@IsString() clientId!: string;
@IsOptional() @IsString() notes?: string;
@IsArray() @ValidateNested({ each: true }) @Type(() => QuoteItemDto) items!: QuoteItemDto[];
}