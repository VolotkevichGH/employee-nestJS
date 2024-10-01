import { Controller, Get } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleEntity } from '../../database/entities/role.entity';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  async getAllRoles(): Promise<RoleEntity[]> {
    return this.roleService.findAll();
  }
}
