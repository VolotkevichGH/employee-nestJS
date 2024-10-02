import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators/roles.decorator';
import { UserService } from '../../../providers/src/user/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector,
              private readonly userService: UserService,) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log(user);
    if (!user) {
      console.log('User not found in request');
      return false;
    }

    let hasRole = false;

    for (const role of roles) {
      if (await this.userService.validateRole(user.id, role)){
        hasRole = true;
        break;
      }
    }

    if (!hasRole) {
      console.log('You do not have enough role permissions to access this event!');
      return false;
    }
    return true;
  }
}
