import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ENV } from './env';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { Logger as PinoLogger } from 'nestjs-pino';
import * as fs from 'node:fs';

dotenv.config();

async function bootstrap() {
  if (!fs.existsSync('./logs')) {
    fs.mkdirSync('./logs');
  }

  const app = await NestFactory.create(AppModule, {
    cors: true,
    bufferLogs: true,
  });

  app.useLogger(app.get(PinoLogger));

  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      errorHttpStatusCode: 400,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exceptionFactory: (errors) => {
        return new BadRequestException('JSON mal formatado');
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('API de Transações')
    .setDescription('Documentação da API de transações')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(ENV.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
