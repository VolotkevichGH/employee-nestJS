import { Controller, Get, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleEntity } from '../../../database/src/entities/role.entity';
import { JwtAuthGuard } from '../../../shared/src/guards/jwt.auth.guard';
import { RolesGuard } from '../../../shared/src/guards/roles.guard';
import { Roles } from '../../../shared/src/decorators/roles.decorator';
import { Role } from '../../../shared/src/enums/role.enum';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.Director])
  async getAllRoles(): Promise<RoleEntity[]> {
    return this.roleService.findAll();
  }
}
