import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { TokenAuthGuard } from './auth/token-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(TokenAuthGuard)
  getHello(@Req() req): string {
    return this.appService.getHello();
  }
}
