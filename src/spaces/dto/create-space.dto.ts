import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsString, IsUrl, Min } from 'class-validator';

export class CreateSpaceDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  location: string;

  @IsInt()
  @Min(1)
  capacity: number;

  @IsIn(['SALA', 'ESCRITORIO', 'AUDITORIO'])
  type: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  pricePerHour?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenityNames?: string[];
}
