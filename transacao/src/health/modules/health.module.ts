/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { HealthController } from '../controllers/health.controller';
import { HealthUseCase } from '../use-cases/health.usecase';
import { PrismaService } from '../../database/prisma.service';
import { HealthRepository } from '../repository/health.repository';

@Module({
  controllers: [HealthController],
  providers: [HealthUseCase, HealthRepository, PrismaService],
})

export class HealthModule {}