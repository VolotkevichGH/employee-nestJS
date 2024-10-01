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
import { AuthGuard } from '../../shared/guards/auth.guard';

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
  signIn(@Body() signInDto: SignInDto): Promise<ResponseProfileDto> {
    return this.authService.signIn(signInDto);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req): Promise<ResponseProfileDto> {
    return { ...req.user, access_token: req.headers.authorization };
  }
}
