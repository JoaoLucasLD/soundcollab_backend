import { AuthService } from './auth.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(body: SignupDto): Promise<AuthResponseDto>;
    login(body: LoginDto): Promise<AuthResponseDto>;
}
