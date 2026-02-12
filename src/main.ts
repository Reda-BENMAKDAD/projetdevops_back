import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

function parseCorsOrigins(): string[] {
  const raw = process.env.FRONTEND_ORIGIN;
  if (!raw) {
    return ['http://localhost:5173'];
  }

  return raw
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: parseCorsOrigins(),
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
