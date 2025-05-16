/* eslint-disable prettier/prettier */
import { MessageResponseDTO } from '../../shared/dtos/response.dto';
import { ICreateTransactionDTO } from '../dtos/createTransaction.dto';
import { ETransaction } from '../entities/transaction.entity';

export abstract class ITransactionRepository {
  abstract findAll(): Promise<ETransaction[]>;
  abstract findRecent(seconds: number): Promise<ETransaction[]>;
  abstract create(data: ICreateTransactionDTO): Promise<MessageResponseDTO>;
  abstract deleteAll(): Promise<MessageResponseDTO>;
}
