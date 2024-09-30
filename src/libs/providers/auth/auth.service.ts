import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegisterUserDto, ResponseUserDto } from '../user/dto';
import * as crypto from 'node:crypto';
import { JwtService } from '@nestjs/jwt';
import { ResponseProfileDto, SignInDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterUserDto): Promise<ResponseUserDto> {
    const user = await this.userService.create(dto);
    return this.userService.getResponseDtoByUser(user);
  }

  async signIn(dto: SignInDto): Promise<ResponseProfileDto> {
    const user = await this.userService.findByEmail(dto.email);
    const verifyPassword = crypto
      .createHash('sha256')
      .update(dto.password)
      .digest('hex');
    if (verifyPassword !== user?.password) {
      throw new UnauthorizedException();
    }
    const payload = { user: user };
    const { password, ...result } = user;
    const accessToken = this.jwtService.sign(payload);
    return { ...result, access_token: accessToken };
  }
}
