import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './login.dto';
import { RegisterDto } from './register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body) {
    console.log('Registration attempt:', body);
    return this.authService.register(body);
  }

  @Post('login')
  login(@Body() body: LoginDto) {
    console.log('Login attempt:', body);
    return this.authService.login(body);
  }
}
