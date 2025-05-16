/* eslint-disable prettier/prettier */
import { HealthUseCase } from './health.usecase';
import { HealthRepository } from '../repository/health.repository';
import { EHealthEntity } from '../entities/health.entity';

describe('HealthUseCase', () => {
  let useCase: HealthUseCase;
  let repository: jest.Mocked<HealthRepository>;

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    repository = {
      check: jest.fn(),
    } as any;

    useCase = new HealthUseCase(repository);
  });

  it('Deve retornar health check do repository', async () => {
    const expected = new EHealthEntity('OK', 'CONNECTED');
    repository.check.mockResolvedValue(expected);

    const result = await useCase.check();

    expect(result).toBe(expected);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repository.check).toHaveBeenCalledTimes(1);
  });
});
