import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../../shared/src/guards/jwt.auth.guard';
import { Roles } from '../../../shared/src/decorators/roles.decorator';
import { Role } from '../../../shared/src/enums/role.enum';
import { RolesGuard } from '../../../shared/src/guards/roles.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getById(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    return this.userService.getResponseDtoByUser(user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.Accountant])
  @Get()
  async getAll() {
    return this.userService.findAll();
  }
}
