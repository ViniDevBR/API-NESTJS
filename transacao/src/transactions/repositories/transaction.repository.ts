/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ITransactionRepository } from '../interfaces/transaction-repository.interface';
import { ETransaction } from '../entities/transaction.entity';
import { PrismaService } from '../../database/prisma.service';
import { ICreateTransactionDTO } from '../dtos/createTransaction.dto';
import { MessageResponseDTO } from '../../shared/dtos/response.dto';

@Injectable()
export class TransactionRepository implements ITransactionRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<ETransaction[]> {
    const transactions = await this.prisma.transactions.findMany();
    return transactions.map(
      (item) => new ETransaction(item.id, item.amount, item.timestamp),
    );
  }

  async findRecent(seconds: number): Promise<ETransaction[]> {
    const MILLISECONDS_IN_SECOND = 1000;
    const since = new Date(Date.now() - seconds * MILLISECONDS_IN_SECOND);

    const transactions = await this.prisma.transactions.findMany({
      where: { timestamp: { gte: since } },
    });

    return transactions.map(
      (item) => new ETransaction(item.id, item.amount, item.timestamp),
    );
  }

  async create(data: ICreateTransactionDTO): Promise<MessageResponseDTO> {
    await this.prisma.transactions.create({ data });
    return new MessageResponseDTO('Transação aceita e registrada.');
  }

  async deleteAll(): Promise<MessageResponseDTO> {
    await this.prisma.transactions.deleteMany();
    return new MessageResponseDTO('Todas as transações foram excluidas');
  }
}