import { IsIn, IsOptional, IsString } from 'class-validator';

export class FilterSpacesDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(['SALA', 'ESCRITORIO', 'AUDITORIO'])
  type?: string;

  @IsOptional()
  @IsString()
  amenities?: string;
}
