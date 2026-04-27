import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
export declare class AuthService {
    private readonly authRepository;
    private readonly jwtService;
    private readonly configService;
    private readonly jwtSecret;
    private readonly jwtIssuer;
    private readonly jwtAudience;
    private readonly jwtExpiresInSeconds;
    private readonly maxFailedLoginAttempts;
    private readonly lockMinutes;
    private readonly passwordSaltRounds;
    constructor(authRepository: AuthRepository, jwtService: JwtService, configService: ConfigService);
    signup(input: SignupDto): Promise<AuthResponseDto>;
    login(input: LoginDto): Promise<AuthResponseDto>;
    private normalizeEmail;
    private isLocked;
    private buildAuthResponse;
    private signAccessToken;
}
