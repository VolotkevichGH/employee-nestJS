import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JWTPayload } from '../interfaces/jwt-payload.interface';

export const CurrentUser = createParamDecorator(
  (
    key: keyof JWTPayload,
    ctx: ExecutionContext,
  ): JWTPayload | Partial<JWTPayload> => {
    const request = ctx.switchToHttp().getRequest();
    return key ? request.user[key] : request.user;
  },
);
