/* eslint-disable prettier/prettier */
import { IsNumber } from 'class-validator';

export class IStatisticDTO {
  @IsNumber()
  count: number;

  @IsNumber()
  sum: number;

  @IsNumber()
  avg: number;

  @IsNumber()
  min: number;

  @IsNumber()
  max: number;
}