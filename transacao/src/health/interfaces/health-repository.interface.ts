/* eslint-disable prettier/prettier */
import { EHealthEntity } from '../entities/health.entity';

export abstract class IHealthRepository {
  abstract check(): Promise<EHealthEntity>
}