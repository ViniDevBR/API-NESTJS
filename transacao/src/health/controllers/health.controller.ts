/* eslint-disable prettier/prettier */
import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { HealthUseCase } from '../use-cases/health.usecase';
import { Throttle } from '@nestjs/throttler';
import { ONE_MINUTE_ML } from '../../constants';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EHealthEntity } from '../entities/health.entity';

const CONTROLLER_NAME = 'health'

@ApiTags('Health')
@Controller(CONTROLLER_NAME)
export class HealthController {
  constructor(private readonly useCases: HealthUseCase) {}

  @Throttle({ default: { limit: 3, ttl: ONE_MINUTE_ML } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Checa se a conexao com o banco esta tudo certo' })
    @ApiResponse({
      status: 200,
      type: EHealthEntity,
      description: 'Health Check',
      isArray: true,
    })
  @Get()
  async check() {
    return await this.useCases.check();
  }
}
