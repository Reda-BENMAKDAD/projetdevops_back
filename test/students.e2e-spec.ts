import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Students (e2e)', () => {
  let app: INestApplication;

  const mockStudents = [
    { id: 2, name: 'Student A', email: 'a@test' },
    { id: 3, name: 'Student B', email: 'b@test' },
  ];

  const mockPrisma: any = {
    user: {
      findUnique: ({ where }: any) => (where?.id === 1 ? { id: 1, name: 'Test', email: 't@t', role: 'USER' } : null),
    },
    student: {
      findMany: () => mockStudents,
      findUnique: ({ where }: any) => mockStudents.find((s) => s.id === where.id) || null,
      create: ({ data }: any) => ({ id: 10, ...data }),
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

  it('/students (GET) - list students', async () => {
    const token = Buffer.from(`1.${Date.now()}.x`).toString('base64url');
    const res = await request(app.getHttpServer()).get('/students').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('/students/:id (GET) - get one student', async () => {
    const token = Buffer.from(`1.${Date.now()}.x`).toString('base64url');
    const res = await request(app.getHttpServer()).get('/students/2').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', 2);
  });
});
