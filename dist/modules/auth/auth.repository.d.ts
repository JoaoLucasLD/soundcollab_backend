import { User } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
export declare class AuthRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<User | null>;
    findById(userId: string): Promise<User | null>;
    createUser(params: {
        email: string;
        passwordHash: string;
    }): Promise<User>;
    registerFailedLogin(user: Pick<User, 'id' | 'failedLoginAttempts'>, maxAttempts: number, lockMinutes: number): Promise<void>;
    clearLoginLock(userId: string): Promise<User>;
}
