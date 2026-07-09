import { IsIn } from 'class-validator';

export class UpdateReservationStatusDto {
  @IsIn(['CONFIRMED', 'CANCELLED', 'COMPLETED'])
  status: string;
}
