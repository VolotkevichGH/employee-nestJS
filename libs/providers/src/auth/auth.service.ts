import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegisterUserDto, ResponseUserDto } from '../user/dto';
import { JwtService } from '@nestjs/jwt';
import { ResponseProfileDto, SignInDto } from './dto';
import { UserEntity } from '../../../database/src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from '../../../database/src/entities/token.entity';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import * as dayjs from 'dayjs';
import { Tokens } from '../../../shared/src/interfaces/tokens.interface';
import { JWTPayload } from '../../../shared/src/interfaces/jwt-payload.interface';
import { Role } from 'libs/shared/src/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {}

  async register(dto: RegisterUserDto): Promise<ResponseUserDto> {
    const user = await this.userService.create(dto);
    return this.userService.getResponseDtoByUser(user);
  }

  async login(dto: SignInDto): Promise<ResponseProfileDto> {
    const user = await this.userService.findByEmail(dto.email);
    if (!user)
      throw new BadRequestException('User with this email is not registered!');
    const userInfo = this.validateUser(dto.email, dto.password);
    if (userInfo === null)
      throw new UnauthorizedException('Email or password is invalid!');
    const tokens = await this.generateTokens(user);
    return this.getProfileDtoByUser(user, tokens);
  }

  getProfileDtoByUser(user: UserEntity, tokens: Tokens): ResponseProfileDto {
    const { password, roles, ...res } = user;
    let finalRoles: Role[] = [];
    for (const role of roles) {
      finalRoles.push(role.title);
    }
    return { ...res, roles: finalRoles, tokens};
  }

  async validateUser(email: string, pass: string) {
    const user = await this.userService.findByEmail(email);
    if (user && user.password === pass) {
      return this.getJwtPayloadByUser(user);
    }
    return null;
  }

  async generateRefreshToken(userId: string): Promise<Token> {
    let expDate = dayjs().add(1, 'month').toDate();
    return this.tokenRepository.save({
      token: v4(),
      exp: expDate,
      userId: userId,
    });
  }

  async refreshTokens(refreshToken: string): Promise<Tokens> {
    const token = await this.tokenRepository.findOne({
      where: { token: refreshToken },
    });
    if (!token) throw new UnauthorizedException();

    const user = await this.userService.findById(token.userId);
    await this.tokenRepository.delete({ token: refreshToken });

    if (new Date(token.exp) < new Date()) {
      throw new UnauthorizedException();
    }
    return this.generateTokens(user);
  }

  async deleteRefreshToken(token: string) {
    return this.tokenRepository.delete({
      token: token,
    });
  }

  private async generateTokens(user: UserEntity): Promise<Tokens> {
    const payload = this.getJwtPayloadByUser(user);
    const access_token = this.jwtService.sign(payload);
    const refresh_token = await this.generateRefreshToken(user.id);
    return { access_token, refresh_token };
  }

  getJwtPayloadByUser(user: UserEntity): JWTPayload {
    const { password, roles, ...result } = user;
    let finalRoles: Role[] = [];
    for (const role of roles) {
      finalRoles.push(role.title);
    }
    return { ...result, roles: finalRoles };
  }
}
