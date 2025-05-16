/* eslint-disable prettier/prettier */
import { PrismaService } from "../../database/prisma.service";
import { IHealthRepository } from "../interfaces/health-repository.interface";
import { EHealthEntity } from "../entities/health.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class HealthRepository implements IHealthRepository {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async check(): Promise<EHealthEntity> {
    try {
      await this.prisma.$queryRaw`SELECT 1`; // Testa conexão
      return new EHealthEntity('OK', 'CONNECTED');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return new EHealthEntity('ERROR', 'DISCONNECTED');
    }
  }
}
