import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './login.dto';
import { hashPassword, verifyPassword } from './password.util';
import { RegisterDto } from './register.dto';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(input: RegisterDto): Promise<AuthResponse> {
    const name = input.name?.trim();
    const email = input.email?.trim().toLowerCase();
    const password = input.password ?? '';

    if (!name || !email || password.length < 6) {
      throw new BadRequestException(
        'name, email et mdp (mini 6 caractères) est requis',
      );
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      throw new ConflictException('Compte déja existant avec cette adresse mail');
    }

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashPassword(password),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return {
      token: this.issueToken(user.id),
      user,
    };
  }

  async login(input: LoginDto): Promise<AuthResponse> {
    const email = input.email?.trim().toLowerCase();
    const password = input.password ?? '';

    if (!email || !password) {
      throw new BadRequestException('email et mdp obligatoire');
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        passwordHash: true,
        role: true,
      },
    });

    if (!user || !verifyPassword(password, user.passwordHash)) {
      throw new UnauthorizedException('pas les autorisations');
    }

    return {
      token: this.issueToken(user.id),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: (user as any).role,
      },
    };
  }

  private issueToken(userId: number): string {
    const nonce = randomBytes(24).toString('base64url');
    return Buffer.from(`${userId}.${Date.now()}.${nonce}`).toString('base64url');
  }
}

