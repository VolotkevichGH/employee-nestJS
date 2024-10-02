import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
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

    const userRoles = user.roles;
    console.log(`User role: ${userRoles}`);
    console.log(`Required roles: ${roles}`);

    let hasRole = false;
    for (const role of userRoles) {
      for (const roleR of roles) {
        if (role === roleR) {
          hasRole = true;
        }
      }
    }

    if (!hasRole) {
      console.log('You do not have enough role permissions to access this event!');
      return false;
    }
    return true;
  }
}
