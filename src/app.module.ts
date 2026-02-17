import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { StudentsModule } from './students/students.module';
import { EventsModule } from './events/events.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, AuthModule, StudentsModule, EventsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
