import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from "@prisma/adapter-mariadb";


const adapter = new PrismaMariaDb({
  database: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD
});


@Injectable()
export class PrismaService extends PrismaClient 
  implements OnModuleInit, OnModuleDestroy 
{
  constructor() {
    super({
      adapter
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
