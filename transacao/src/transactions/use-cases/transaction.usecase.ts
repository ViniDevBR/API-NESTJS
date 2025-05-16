/* eslint-disable prettier/prettier */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ICreateTransactionDTO } from '../dtos/createTransaction.dto';
import { IStatisticDTO } from '../dtos/statistic.dto';
import { TransactionRepository } from '../repositories/transaction.repository';
import { ETransaction } from '../entities/transaction.entity';
import { MessageResponseDTO } from '../../shared/dtos/response.dto';


@Injectable()
export class TransactionUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async getStatistics(): Promise<IStatisticDTO> {
    const SECONDS_PERIOD = 60;
    const recentTransactions = await this.transactionRepository.findRecent(SECONDS_PERIOD);

    if (recentTransactions.length === 0) {
      return { count: 0, sum: 0, avg: 0, min: 0, max: 0 } as IStatisticDTO;
    }

    const amounts = recentTransactions.map((tx) => tx.amount);
    const sum = amounts.reduce((acc, val) => acc + val, 0);
    const count = amounts.length;
    const avg = parseFloat((sum / count).toFixed(2));
    const min = Math.min(...amounts);
    const max = Math.max(...amounts);

    return { count, sum, avg, min, max } as IStatisticDTO;
  }

  async getAllTransactions(): Promise<ETransaction[]> {
    return this.transactionRepository.findAll();
  }

  async createTransaction(body: ICreateTransactionDTO): Promise<MessageResponseDTO> {
    if (body.amount < 0) {
      throw new HttpException(
        'Transação rejeitada por violar alguma regra.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const transactionDate = new Date(body.timestamp);
    const now = new Date();
    const toleranceMs = 1000;

    if (transactionDate.getTime() - now.getTime() > toleranceMs) {
      throw new HttpException(
        'A transação não pode estar no futuro.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return this.transactionRepository.create(body);
  }

  async deleteAllTransaction(): Promise<MessageResponseDTO> {
    return this.transactionRepository.deleteAll();
  }
}