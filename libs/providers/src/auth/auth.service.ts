import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegisterUserDto, ResponseUserDto } from '../user/dto';
import * as crypto from 'node:crypto';
import { JwtService } from '@nestjs/jwt';
import { ResponseProfileDto, SignInDto } from './dto';
import { UserEntity } from '../../../database/src/entities/user.entity';
import e from 'express';

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

  async login(email: string, password: string): Promise<ResponseUserDto> {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new BadRequestException('User with this email is not registered!');
    const userInfo = this.validateUser(email, password);
    const payload = { userInfo };
    const access_token = this.jwtService.sign(payload);
    return this.getProfileDtoByUser(user, access_token);
  }


  getProfileDtoByUser(user: UserEntity, token: string): ResponseProfileDto {
    const roles = user.roles;
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
    dto.roles = roles;
    dto.access_token = token;
    return dto;
  }

  async validateUser(email: string, pass: string) {
    const user = await this.userService.findByEmail(email);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

}
