"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcryptjs");
const crypto_1 = require("crypto");
const auth_repository_1 = require("./auth.repository");
const INVALID_CREDENTIALS_MESSAGE = 'Invalid credentials or account temporarily locked';
let AuthService = class AuthService {
    constructor(authRepository, jwtService, configService) {
        this.authRepository = authRepository;
        this.jwtService = jwtService;
        this.configService = configService;
        this.passwordSaltRounds = 12;
        this.jwtSecret = this.configService.get('JWT_SECRET', 'dev-secret-change-me');
        this.jwtIssuer = this.configService.get('JWT_ISSUER', 'musiclounge');
        this.jwtAudience = this.configService.get('JWT_AUDIENCE', 'musiclounge-web');
        this.jwtExpiresInSeconds = Number(this.configService.get('JWT_EXPIRES_IN_SECONDS', '900'));
        this.maxFailedLoginAttempts = Number(this.configService.get('AUTH_MAX_FAILED_LOGIN_ATTEMPTS', '5'));
        this.lockMinutes = Number(this.configService.get('AUTH_LOCK_MINUTES', '15'));
    }
    async signup(input) {
        const email = this.normalizeEmail(input.email);
        const existingUser = await this.authRepository.findByEmail(email);
        if (existingUser) {
            throw new common_1.ConflictException('Email already registered');
        }
        const passwordHash = await bcrypt.hash(input.password, this.passwordSaltRounds);
        const user = await this.authRepository.createUser({ email, passwordHash });
        return this.buildAuthResponse(user);
    }
    async login(input) {
        const email = this.normalizeEmail(input.email);
        const user = await this.authRepository.findByEmail(email);
        if (!user) {
            throw new common_1.UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
        }
        if (this.isLocked(user)) {
            throw new common_1.UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
        }
        const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);
        if (!passwordMatches) {
            await this.authRepository.registerFailedLogin(user, this.maxFailedLoginAttempts, this.lockMinutes);
            throw new common_1.UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
        }
        await this.authRepository.clearLoginLock(user.id);
        return this.buildAuthResponse(user);
    }
    normalizeEmail(email) {
        return email.trim().toLowerCase();
    }
    isLocked(user) {
        if (!user.lockedUntil) {
            return false;
        }
        return user.lockedUntil.getTime() > Date.now();
    }
    async buildAuthResponse(user) {
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
    async signAccessToken(user) {
        const issuedAt = Math.floor(Date.now() / 1000);
        const payload = {
            sub: user.id,
            iss: this.jwtIssuer,
            aud: this.jwtAudience,
            iat: issuedAt,
            exp: issuedAt + this.jwtExpiresInSeconds,
            jti: (0, crypto_1.randomUUID)(),
            tokenVersion: user.tokenVersion,
        };
        return this.jwtService.signAsync(payload, {
            secret: this.jwtSecret,
            algorithm: 'HS256',
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_repository_1.AuthRepository,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map