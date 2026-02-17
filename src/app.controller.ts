import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { TokenAuthGuard } from './auth/token-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(TokenAuthGuard)
  getHello(): string {
    return this.appService.getHello();
  }
}
