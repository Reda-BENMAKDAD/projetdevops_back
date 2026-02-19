import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Events (e2e)', () => {
  let app: INestApplication;

  const mockEvents = [
    { id: 1, title: 'Event A', date: new Date().toISOString(), status: 'SCHEDULED' },
    { id: 2, title: 'Event B', date: new Date().toISOString(), status: 'SCHEDULED' },
  ];

  const mockPrisma: any = {
    user: {
      findUnique: ({ where }: any) => (where?.id === 1 ? { id: 1, name: 'Test', email: 't@t', role: 'USER' } : null),
    },
    event: {
      findMany: () => mockEvents,
      findUnique: ({ where }: any) => mockEvents.find((e) => e.id === where.id) || null,
      update: ({ where, data }: any) => ({ ...mockEvents.find((e) => e.id === where.id), ...data }),
      create: ({ data }: any) => ({ id: 99, ...data }),
    },
    student: {
      findUnique: ({ where }: any) => (where?.id === 2 ? { id: 2, name: 'Stu' } : null),
    },
    eventSubscription: {
      findUnique: ({ where }: any) => null,
      create: ({ data }: any) => ({ id: 5, ...data }),
      delete: ({ where }: any) => ({ id: where.id }),
    },
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/events (GET) - list events', async () => {
    const token = Buffer.from(`1.${Date.now()}.x`).toString('base64url');
    const res = await request(app.getHttpServer()).get('/events').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('/events/:eventId/subscribe/:studentId (POST) - subscribe student', async () => {
    const token = Buffer.from(`1.${Date.now()}.x`).toString('base64url');
    const res = await request(app.getHttpServer())
      .post('/events/1/subscribe/2')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.body).toHaveProperty('studentId');
    expect(res.body).toHaveProperty('eventId');
  });
});
