import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { hashPassword } from '../src/auth/password.util';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  const existingUser = {
    id: 1,
    name: 'Existing',
    email: 'existing@test.local',
    passwordHash: hashPassword('secret123'),
    role: 'ADMIN',
  };

  const mockPrisma: any = {
    user: {
      findUnique: ({ where }: any) => {
        if (where?.email === existingUser.email) return existingUser;
        if (where?.id === existingUser.id) return {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          role: existingUser.role,
        };
        return null;
      },
      create: ({ data }: any) => ({ id: 2, name: data.name, email: data.email, role: 'USER' }),
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

  it('/auth/register (POST) - create new user', async () => {
    const payload = { name: 'New', email: 'new@test.local', password: 'pass123' };
    const res = await request(app.getHttpServer()).post('/auth/register').send(payload);
    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.email).toBe(payload.email.toLowerCase());
  });

  it('/auth/login (POST) - login existing user', async () => {
    const payload = { email: existingUser.email, password: 'secret123' };
    const res = await request(app.getHttpServer()).post('/auth/login').send(payload);
    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe(existingUser.email);
  });
});
