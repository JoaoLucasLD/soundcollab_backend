import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(userId: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  createUser(params: { email: string; passwordHash: string }): Promise<User> {
    return this.prisma.user.create({
      data: {
        email: params.email,
        passwordHash: params.passwordHash,
      },
    });
  }

  async registerFailedLogin(
    user: Pick<User, 'id' | 'failedLoginAttempts'>,
    maxAttempts: number,
    lockMinutes: number,
  ): Promise<void> {
    const failedLoginAttempts = user.failedLoginAttempts + 1;
    const shouldLock = failedLoginAttempts >= maxAttempts;

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: shouldLock ? 0 : failedLoginAttempts,
        lockedUntil: shouldLock
          ? new Date(Date.now() + lockMinutes * 60 * 1000)
          : null,
      },
    });
  }

  clearLoginLock(userId: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });
  }
}
