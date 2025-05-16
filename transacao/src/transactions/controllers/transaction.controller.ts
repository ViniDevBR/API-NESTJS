/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransactionUseCase } from '../use-cases/transaction.usecase';
import { IStatisticDTO } from '../dtos/statistic.dto';
import { ITransactionsDTO } from '../dtos/transaction.dto';
import { ICreateTransactionDTO } from '../dtos/createTransaction.dto';

const DEFAULT_ROUTE_NAME = 'transactions';
const STATISTIC_ROUTE_NAME = 'statistic';

@ApiTags('Transactions')
@Controller()
export class TransactionController {
   constructor(private readonly useCase: TransactionUseCase) {}

  @Get(STATISTIC_ROUTE_NAME)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Estatisticas do ultimo minuto.' })
  @ApiResponse({
    status: 200,
    type: IStatisticDTO,
    description: 'Estatisticas',
    isArray: true,
  })
  async getStatistics() {
    return await this.useCase.getStatistics();
  }

  @Get(DEFAULT_ROUTE_NAME)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    description: 'Lista de transações registradas.',
    type: ITransactionsDTO,
    isArray: true,
  })
  async getAllTransactions() {
    return await this.useCase.getAllTransactions();
  }

  @Post(DEFAULT_ROUTE_NAME)
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: 201, description: 'Transação criada com sucesso.' })
  @ApiResponse({
    status: 422,
    description: 'Transação rejeitada por regra de negócio.',
  })
  @ApiResponse({ status: 400, description: 'JSON malformado.' })
  async createTransaction(@Body() body: ICreateTransactionDTO) {
    return await this.useCase.createTransaction(body);
  }

  @Delete(DEFAULT_ROUTE_NAME)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200 })
  async deleteAllTransaction() {
    return await this.useCase.deleteAllTransaction();
  }
}
