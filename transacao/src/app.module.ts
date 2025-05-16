import { Module } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';
import { HealthModule } from './health/modules/health.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CustomThrottlerGuard } from './services/throttler/throttler.service';
import { ONE_MINUTE_ML } from './constants';
import { LoggerModule } from 'nestjs-pino';
import { ENV } from './env';
import { pino } from 'pino';
import { randomUUID } from 'node:crypto';
import { TransactionModule } from './transactions/modules/transaction.modules';

@Module({
  imports: [
    HealthModule,
    TransactionModule,
    LoggerModule.forRoot({
      pinoHttp: {
        stream: pino.multistream([
          { level: 'info', stream: pino.destination(ENV.LOG_INFO_PATH) },
          { level: 'error', stream: pino.destination(ENV.LOG_ERROR_PATH) },
          { level: 'debug', stream: pino.destination(ENV.LOG_DEBUG_PATH) },
        ]),
        level: ENV.NODE_ENV === 'production' ? 'info' : 'debug',
        autoLogging: true,
        genReqId: (req) => {
          const id = randomUUID();
          req.id = id;
          return id;
        },
        customProps: (req) => ({
          requestId: req.id,
        }),
        customLogLevel: (req, res, err) => {
          if (res.statusCode >= 500 || err) return 'error';
          if (res.statusCode >= 400) return 'error';
          return 'info';
        },
      },
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: ONE_MINUTE_ML,
          limit: 10, // LIMITE DE 10 CHAMADAS POR IP POR MINUTO
        },
      ],
    }),
  ],
  providers: [
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class AppModule {}
