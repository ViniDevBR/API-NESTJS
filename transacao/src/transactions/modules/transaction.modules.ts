/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TransactionController } from '../controllers/transaction.controller';
import { TransactionUseCase } from '../use-cases/transaction.usecase';
import { TransactionRepository } from '../repositories/transaction.repository';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [TransactionController],
  providers: [
    PrismaService, 
    TransactionRepository,
    TransactionUseCase
  ],
})

export class TransactionModule {}
