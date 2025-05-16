/* eslint-disable prettier/prettier */
import { IsInt, IsDate, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class ITransactionsDTO {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsInt()
  amount: number;

  @IsDate()
  @Type(() => Date)
  timestamp: Date;
}
