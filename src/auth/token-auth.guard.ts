import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class TokenAuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const auth = req.headers['authorization'];
    if (!auth || Array.isArray(auth)) {
      throw new UnauthorizedException('No authorization header');
    }

    const prefix = 'Bearer ';
    if (!auth.startsWith(prefix)) {
      throw new UnauthorizedException('Invalid authorization header');
    }

    const token = auth.slice(prefix.length).trim();
    let decoded: string;
    try {
      decoded = Buffer.from(token, 'base64url').toString();
    } catch (e) {
      throw new UnauthorizedException('Invalid token format');
    }

    const parts = decoded.split('.');
    const userId = parseInt(parts[0], 10);
    if (Number.isNaN(userId)) {
      throw new UnauthorizedException('Invalid token payload');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // attach user to request for handlers
    (req as any).user = user;
    return true;
  }
}
