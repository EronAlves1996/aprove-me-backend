import { IsDateString, IsNumber, IsUUID } from 'class-validator';

export class PayableDTO {
  @IsUUID()
  id: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  value: number;

  @IsDateString()
  emissionDate: string;

  @IsUUID()
  assignor: string;
}
