/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsNotEmpty, IsISO8601 } from 'class-validator';

export class ICreateTransactionDTO {
  @ApiProperty({ example: 100, description: 'Valor da transação em numero' })
  @IsNumber(
    { 
      allowInfinity: false,
    }, 
    { 
      message: 'O valor da transação (amount) deve ser um número inteiro' 
    }
  )
  @IsNotEmpty({ message: 'O campo (amount) é obrigatório' })
  amount: number;

  @ApiProperty({ 
    example: '2025-05-15T14:30:00Z', 
    description: 'Data/hora da transação no formato ISO 8601' 
  })
  @IsISO8601({}, { message: 'A data deve estar no formato ISO 8601.' })
  @IsNotEmpty({ message: 'O campo (timestamp) é obrigatório' })
  timestamp: string;
}