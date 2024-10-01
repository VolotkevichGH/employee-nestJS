import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegisterUserDto, ResponseUserDto } from '../user/dto';
import * as crypto from 'node:crypto';
import { JwtService } from '@nestjs/jwt';
import { ResponseProfileDto, SignInDto } from './dto';
import { UserEntity } from '../../../database/src/entities/user.entity';

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
    const accessToken = this.jwtService.sign(payload);

    return this.getProfileDtoByUser(user, accessToken);
  }


  getProfileDtoByUser(user: UserEntity, token: string): ResponseProfileDto {
    const dto = new ResponseProfileDto();
    dto.id = user.id;
    dto.name = user.name;
    dto.surname = user.surname;
    dto.age = user.age;
    dto.email = user.email;
    dto.phone = user.phone;
    dto.state = user.state;
    dto.gender = user.gender;
    dto.address = user.address;
    dto.roles = user.roles;
    dto.access_token = token;
    return dto;
  }

}
