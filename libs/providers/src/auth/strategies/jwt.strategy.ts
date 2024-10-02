import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from 'libs/shared/src/constants/constants';
import { JWTPayload } from '../../../../shared/src/interfaces/jwt-payload.interface';
import { UserService } from '../../user/user.service';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: JWTPayload) {
    const user = await this.userService.findById(payload.id);
    if (!user) throw new UnauthorizedException();
    return payload;
  }
}