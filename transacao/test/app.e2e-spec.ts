import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { TransactionModule } from '../src/transactions/modules/transaction.modules';
import { PrismaService } from '../src/database/prisma.service';

describe('HealthController (e2e)', () => {
  let app: INestApplication<App>;

  afterAll(async () => {
    await app.close();
  });

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/health (GET) - deve retornar o status da API', () => {
    return request(app.getHttpServer()).get('/health').expect(200).expect({
      status: 'OK',
      database: 'CONNECTED',
    });
  });
});

describe('TransactionController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TransactionModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);

    // Limpa as transações antes de rodar os testes
    await prisma.transactions.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/transactions (GET) - deve retornar lista vazia inicialmente', async () => {
    const response = await request(app.getHttpServer())
      .get('/transactions')
      .expect(200);

    expect(response.body).toEqual([]);
  });

  it('/transactions (POST) - deve criar uma transação válida: amount 100', async () => {
    const transaction = {
      amount: 200,
      timestamp: new Date().toISOString(),
    };

    const response = await request(app.getHttpServer())
      .post('/transactions')
      .send(transaction)
      .expect(201);

    expect(response.body).toEqual({
      message: 'Transação aceita e registrada.',
    });
  });

  it('/transactions (POST) - deve criar uma transação válida: amount 200', async () => {
    const transaction = {
      amount: 100,
      timestamp: new Date().toISOString(),
    };

    const response = await request(app.getHttpServer())
      .post('/transactions')
      .send(transaction)
      .expect(201);

    expect(response.body).toEqual({
      message: 'Transação aceita e registrada.',
    });
  });

  it('/statistic (GET) - deve retornar estatísticas do último minuto', async () => {
    const response = await request(app.getHttpServer())
      .get('/statistic')
      .expect(200);

    expect(response.body).toHaveProperty('count');
    expect(response.body).toHaveProperty('sum');
    expect(response.body).toHaveProperty('avg');
    expect(response.body).toHaveProperty('min');
    expect(response.body).toHaveProperty('max');

    expect(response.body.count).toBe(2);
    expect(response.body.sum).toBe(300);
    expect(response.body.avg).toBe(150);
    expect(response.body.min).toBe(100);
    expect(response.body.max).toBe(200);
  });

  it('/transactions (DELETE) - deve apagar todas as transações', async () => {
    const responseDelete = await request(app.getHttpServer())
      .delete('/transactions')
      .expect(200);

    expect(responseDelete.body).toEqual({
      message: 'Todas as transações foram excluidas',
    });

    const res = await request(app.getHttpServer())
      .get('/transactions')
      .expect(200);

    expect(res.body).toEqual([]);
  });

  it('/transactions (POST) - deve rejeitar transação com valor negativo', async () => {
    const invalidTransaction = {
      amount: -10,
      timestamp: new Date().toISOString(),
    };

    await request(app.getHttpServer())
      .post('/transactions')
      .send(invalidTransaction)
      .expect(422);
  });

  it('/transactions (POST) - deve rejeitar transação com timestamp no futuro', async () => {
    const futureDate = new Date(Date.now() + 10 * 1000).toISOString(); // 10 segundos no futuro

    const invalidTransaction = {
      amount: 50,
      timestamp: futureDate,
    };

    await request(app.getHttpServer())
      .post('/transactions')
      .send(invalidTransaction)
      .expect(422);
  });
});
