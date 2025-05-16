/* eslint-disable prettier/prettier */
import { TransactionUseCase } from './transaction.usecase';
import { TransactionRepository } from '../repositories/transaction.repository';
import { MessageResponseDTO } from '../../shared/dtos/response.dto';
import { ETransaction } from '../entities/transaction.entity';
import { IStatisticDTO } from '../dtos/statistic.dto';

describe('TransactionUseCase', () => {
  let useCase: TransactionUseCase;
  let repository: jest.Mocked<TransactionRepository>;

  beforeAll(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    repository = {
      create: jest.fn(),
      deleteAll: jest.fn(),
      findAll: jest.fn(),
      findRecent: jest.fn(),
    } as any;

    useCase = new TransactionUseCase(repository);
  });

  it('Deve retornar estatísticas zeradas quando não há transações recentes', async () => {
    repository.findRecent.mockResolvedValue([]);

    const result = await useCase.getStatistics();

    expect(result).toEqual<IStatisticDTO>({
      count: 0,
      sum: 0,
      avg: 0,
      min: 0,
      max: 0,
    });
  });

  it('Deve retornar mensagem de criação com sucesso', async () => {
    const expected = new MessageResponseDTO('Transação aceita e registrada.')

    const body = {
      amount: 200,
      timestamp: new Date().toISOString(),
    }
    repository.create.mockResolvedValue(expected);

    const result = await useCase.createTransaction(body);

    expect(result).toBe(expected);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repository.create).toHaveBeenCalledTimes(1);
  });

  it('Deve deletar todas as transações', async () => {
    const expected = new MessageResponseDTO('Todas as transações foram excluidas');
    repository.deleteAll.mockResolvedValue(expected)

    const result = await useCase.deleteAllTransaction()
    expect(result).toBe(expected)
  })

  it('Deve retonar array vazio após exclusão', async () => {
    const expected: never[] = []
    repository.findAll.mockResolvedValue(expected)

    const result = await useCase.getAllTransactions()
    expect(result).toBe(expected)
  })

  it('Deve retornar mensagem de criação com sucesso: amount 200', async () => {
    const expected = new MessageResponseDTO('Transação aceita e registrada.')

    const body = {
      amount: 200,
      timestamp: new Date().toISOString(),
    }
    repository.create.mockResolvedValue(expected);

    const result = await useCase.createTransaction(body);

    expect(result).toBe(expected);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repository.create).toHaveBeenCalledTimes(2);
  });

  it('Deve retornar mensagem de criação com sucesso: amount 100', async () => {
    const expected = new MessageResponseDTO('Transação aceita e registrada.')

    const body = {
      amount: 100,
      timestamp: new Date().toISOString(),
    }
    repository.create.mockResolvedValue(expected);

    const result = await useCase.createTransaction(body);

    expect(result).toBe(expected);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repository.create).toHaveBeenCalledTimes(3);
  });
  
  it('Deve retornar as estatisticas', async () => {
    const transactions: ETransaction[] = [
      new ETransaction(1, 200, new Date()),
      new ETransaction(2, 100, new Date()),
    ];

    repository.findRecent.mockResolvedValue(transactions);

    const result = await useCase.getStatistics();

    expect(result).toEqual<IStatisticDTO>({
      count: 2,
      sum: 300,
      avg: 150,
      min: 100,
      max: 200,
    });
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repository.findRecent).toHaveBeenCalledTimes(2);
  });
});
