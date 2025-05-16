/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { HealthRepository } from '../repository/health.repository';

@Injectable()
export class HealthUseCase {
  constructor(private readonly healthRepository: HealthRepository) {}

  async check() {
    return await this.healthRepository.check()
  }
}
