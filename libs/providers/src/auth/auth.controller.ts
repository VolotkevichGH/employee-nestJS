import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto, ResponseUserDto } from '../user/dto';
import { ResponseProfileDto, SignInDto } from './dto';
import { LocalAuthGuard } from '../../../shared/src/guards/local.auth.guard';
import { JwtAuthGuard } from '../../../shared/src/guards/jwt.auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<ResponseUserDto> {
    return this.authService.register(registerUserDto);
  }

  @Post('login')
  async login(email:string, password: string): Promise<ResponseUserDto> {

    return this.authService.login(email, password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    console.log(req.user);
    return req.user;
  }
}
