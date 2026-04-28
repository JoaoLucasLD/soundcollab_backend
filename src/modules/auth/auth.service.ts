import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { AuthRepository } from './auth.repository';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

const INVALID_CREDENTIALS_MESSAGE =
  'Invalid credentials or account temporarily locked';

@Injectable()
export class AuthService {
  private readonly jwtSecret: string;
  private readonly jwtIssuer: string;
  private readonly jwtAudience: string;
  private readonly jwtExpiresInSeconds: number;
  private readonly maxFailedLoginAttempts: number;
  private readonly lockMinutes: number;
  private readonly passwordSaltRounds = 12;

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtSecret = this.configService.get<string>(
      'JWT_SECRET',
      'dev-secret-change-me',
    );
    this.jwtIssuer = this.configService.get<string>('JWT_ISSUER', 'soundcollab');
    this.jwtAudience = this.configService.get<string>(
      'JWT_AUDIENCE',
      'soundcollab-web',
    );
    this.jwtExpiresInSeconds = Number(
      this.configService.get<string>('JWT_EXPIRES_IN_SECONDS', '900'),
    );
    this.maxFailedLoginAttempts = Number(
      this.configService.get<string>('AUTH_MAX_FAILED_LOGIN_ATTEMPTS', '5'),
    );
    this.lockMinutes = Number(
      this.configService.get<string>('AUTH_LOCK_MINUTES', '15'),
    );
  }

  async signup(input: SignupDto): Promise<AuthResponseDto> {
    const email = this.normalizeEmail(input.email);
    const existingUser = await this.authRepository.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(
      input.password,
      this.passwordSaltRounds,
    );
    const user = await this.authRepository.createUser({ email, passwordHash });

    return this.buildAuthResponse(user);
  }

  async login(input: LoginDto): Promise<AuthResponseDto> {
    const email = this.normalizeEmail(input.email);
    const user = await this.authRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    if (this.isLocked(user)) {
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    const passwordMatches = await bcrypt.compare(
      input.password,
      user.passwordHash,
    );
    if (!passwordMatches) {
      await this.authRepository.registerFailedLogin(
        user,
        this.maxFailedLoginAttempts,
        this.lockMinutes,
      );
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    await this.authRepository.clearLoginLock(user.id);
    return this.buildAuthResponse(user);
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private isLocked(user: User): boolean {
    if (!user.lockedUntil) {
      return false;
    }

    return user.lockedUntil.getTime() > Date.now();
  }

  private async buildAuthResponse(user: User): Promise<AuthResponseDto> {
    const accessToken = await this.signAccessToken(user);

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: this.jwtExpiresInSeconds,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  private async signAccessToken(user: User): Promise<string> {
    const issuedAt = Math.floor(Date.now() / 1000);
    const payload: JwtPayload = {
      sub: user.id,
      iss: this.jwtIssuer,
      aud: this.jwtAudience,
      iat: issuedAt,
      exp: issuedAt + this.jwtExpiresInSeconds,
      jti: randomUUID(),
      tokenVersion: user.tokenVersion,
    };

    return this.jwtService.signAsync(payload, {
      secret: this.jwtSecret,
      algorithm: 'HS256',
    });
  }
}
