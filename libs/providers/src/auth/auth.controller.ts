import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto, ResponseUserDto } from '../user/dto';
import { ResponseProfileDto, SignInDto } from './dto';
import { JwtAuthGuard } from '../../../shared/src/guards/jwt.auth.guard';
import { Response, Request } from 'express';
import { Cookie } from '../../../shared/src/decorators/cookies.decorator';
import { UserService } from '../user/user.service';
import { CurrentUser } from '../../../shared/src/decorators/current-user.decorator';
import { JWTPayload } from '../../../shared/src/interfaces/jwt-payload.interface';

const REFRESH_TOKEN = 'refresh_token';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<ResponseUserDto> {
    return this.authService.register(registerUserDto);
  }

  @Post('login')
  async login(@Body() dto: SignInDto, @Res() res: Response){
    const result = await this.authService.login(dto);
    this.setBearerTokenInHeader(res, result);
    this.setRefreshTokenToCookies(res, result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: JWTPayload | Partial<JWTPayload>) {
    return user;
  }

  @Get('refresh-token')
  async refreshToken(
    @Cookie(REFRESH_TOKEN) refreshToken: string,
    @Res() res: Response,
  ) {
    if (!refreshToken) throw new UnauthorizedException();
    const tokens = await this.authService.refreshTokens(refreshToken);
    if (!tokens) throw new UnauthorizedException();
    const user = await this.userService.findById(tokens.refresh_token.userId);
    const dto = this.authService.getProfileDtoByUser(user, tokens);
    this.setRefreshTokenToCookies(res, dto);
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  async logout(
    @Cookie(REFRESH_TOKEN) refreshToken: string,
    @Res() res: Response,
  ) {
    await this.authService.deleteRefreshToken(refreshToken);
    res.cookie(REFRESH_TOKEN, '', {
      httpOnly: true,
      secure: false,
      expires: new Date(),
    });
    res.cookie('Authorization', ``)
    res.status(HttpStatus.OK).send(true);
  }

  private setRefreshTokenToCookies(res: Response, dto: ResponseProfileDto) {
    if (!dto.tokens) throw new UnauthorizedException();
    res.cookie(REFRESH_TOKEN, dto.tokens.refresh_token.token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      expires: new Date(dto.tokens.refresh_token.exp),
      path: '/',
    });
    res.status(HttpStatus.CREATED).json(dto);
  }


  private setBearerTokenInHeader(res: Response, dto: ResponseProfileDto) {
    if (!dto.tokens) throw new UnauthorizedException();
    res.header('Authorization', `Bearer ${dto.tokens.access_token}`)
  }
}
