import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto, ResponseUserDto } from '../user/dto';
import { UserService } from '../user/user.service';
import { ResponseProfileDto, SignInDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() registerUserDto: RegisterUserDto): Promise<ResponseUserDto> {
    return this.authService.register(registerUserDto);
  }

  @Post('login')
  signIn(@Body() signInDto: SignInDto): Promise<ResponseProfileDto> {
    return this.authService.signIn(signInDto);
  }

}
