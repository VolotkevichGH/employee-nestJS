import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from '../../../shared/src/decorators/roles.decorator';
import { Role } from '../../../shared/src/enums/role.enum';
import { AuthGuard } from '../../../shared/src/guards/auth.guard';
import { RolesGuard } from '../../../shared/src/guards/roles.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:id')
  async getById(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    return this.userService.getResponseDtoByUser(user);
  }
  @UseGuards(RolesGuard)
  @Roles(Role.Accountant, Role.HR)
  @Get()
  async getAll() {
    return this.userService.findAll();
  }
}
