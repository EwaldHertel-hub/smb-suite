import {
  IsEmail,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsUrl,
  IsArray,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

class CreateEmployeeInput {
  @IsString() @IsNotEmpty() firstName!: string;
  @IsString() @IsNotEmpty() lastName!: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() departmentId?: string;
}

export class CreateClientDto {
  @IsString() name!: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() phone?: string;
  @IsString() @IsNotEmpty() street!: string;
  @IsString() @IsNotEmpty() zipCode!: string;
  @IsString() @IsNotEmpty() city!: string;
  @IsString() @IsNotEmpty() country!: string;
  @IsOptional() @IsUrl({ require_tld: false }) website?: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEmployeeInput)
  employees!: CreateEmployeeInput[];
}
export class UpdateClientDto extends CreateClientDto {}
