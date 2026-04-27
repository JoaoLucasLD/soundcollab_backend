import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { AuthRepository } from './auth.repository';
import { AuthenticatedUser } from './interfaces/authenticated-user.interface';
import { JwtPayload } from './interfaces/jwt-payload.interface';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly authRepository;
    private readonly configService;
    constructor(authRepository: AuthRepository, configService: ConfigService);
    validate(payload: JwtPayload): Promise<AuthenticatedUser>;
}
export {};
