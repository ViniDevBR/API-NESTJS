/* eslint-disable prettier/prettier */
import { HealthRepository } from './health.repository';
import { PrismaService } from '../../database/prisma.service';
import { EHealthEntity } from '../entities/health.entity';

describe('HealthRepository', () => {
  let repository: HealthRepository;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    prisma = {
      $queryRaw: jest.fn(),
    } as any;

    repository = new HealthRepository(prisma);
  });

  it('Deve retornar OK e CONNECTED', async () => {
    prisma.$queryRaw.mockResolvedValue([1]);

    const result = await repository.check();

    expect(result).toEqual(new EHealthEntity('OK', 'CONNECTED'));
  });

  it('Deve retornar ERROR e DISCONNECTED', async () => {
    prisma.$queryRaw.mockRejectedValue(new Error('DB error'));

    const result = await repository.check();

    expect(result).toEqual(new EHealthEntity('ERROR', 'DISCONNECTED'));
  });
});
