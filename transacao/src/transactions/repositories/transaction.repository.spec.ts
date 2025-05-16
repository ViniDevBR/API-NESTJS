/* eslint-disable prettier/prettier */
import { TransactionRepository } from './transaction.repository';
import { PrismaService } from '../../database/prisma.service';
import { ETransaction } from '../entities/transaction.entity';
import { ICreateTransactionDTO } from '../dtos/createTransaction.dto';
import { MessageResponseDTO } from '../../shared/dtos/response.dto';

export const mockPrismaService = () => ({
  transactions: {
    findMany: jest.fn(),
    create: jest.fn(),
    deleteMany: jest.fn(),
  },
});

describe('TransactionRepository', () => {
  let repository: TransactionRepository;
  let prisma: jest.Mocked<PrismaService>;

  beforeAll(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    prisma = mockPrismaService() as any;
    repository = new TransactionRepository(prisma);
  });

  it('Deve retornar todas transações', async () => {
    const data = [
      { id: '1', amount: 100, timestamp: new Date() },
      { id: '2', amount: 200, timestamp: new Date() },
    ];
    
    (prisma.transactions.findMany as jest.Mock).mockResolvedValue(data);

    const result = await repository.findAll();

    expect(result).toHaveLength(2);
    expect(result[0]).toBeInstanceOf(ETransaction);
    expect(result[0].id).toBe('1');
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(prisma.transactions.findMany).toHaveBeenCalled();
  });

  it('deve buscar transações com timestamp dentro do intervalo', async () => {
      const data = [
        { id: '1', amount: 50, timestamp: new Date() },
      ];

      (prisma.transactions.findMany as jest.Mock).mockResolvedValue(data);

      const result = await repository.findRecent(60);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.transactions.findMany).toHaveBeenCalledWith({
        where: {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          timestamp: { gte: expect.any(Date) },
        },
      });

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(ETransaction);
  });

  it('deve criar uma nova transação e retornar mensagem', async () => {
      const data: ICreateTransactionDTO = {
        amount: 150,
        timestamp: new Date().toISOString(),
      };

      (prisma.transactions.create as jest.Mock).mockResolvedValue(undefined as any);

      const result = await repository.create(data);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.transactions.create).toHaveBeenCalledWith({ data });
      expect(result).toBeInstanceOf(MessageResponseDTO);
      expect(result.message).toBe('Transação aceita e registrada.');
  });

  it('deve deletar todas as transações e retornar mensagem', async () => {
      (prisma.transactions.deleteMany as jest.Mock).mockResolvedValue({} as any);

      const result = await repository.deleteAll();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.transactions.deleteMany).toHaveBeenCalled();
      expect(result).toBeInstanceOf(MessageResponseDTO);
      expect(result.message).toBe('Todas as transações foram excluidas');
    });
});
