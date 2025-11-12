import { IsOptional, IsString } from "class-validator";
export class UpdateOrgDto {
  @IsString() name!: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() vatId?: string;
}
