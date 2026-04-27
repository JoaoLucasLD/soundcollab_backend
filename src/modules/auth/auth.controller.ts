import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  signup(@Body() body: SignupDto): Promise<AuthResponseDto> {
    return this.authService.signup(body);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() body: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(body);
  }
}
