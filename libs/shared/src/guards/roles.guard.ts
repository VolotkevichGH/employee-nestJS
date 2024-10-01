import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { RoleService } from '../../../providers/src/role/role.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector,
              private readonly roleService: RoleService) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.getAllAndOverride<Role>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRole) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    return user.roles.for((role) => role.title.includes(requiredRole));
  }
}