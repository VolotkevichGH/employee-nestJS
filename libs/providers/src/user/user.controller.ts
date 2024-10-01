import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from '../../../shared/src/decorators/roles.decorator';
import { Role } from '../../../shared/src/enums/role.enum';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:id')
  async getById(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    return this.userService.getResponseDtoByUser(user);
  }

  @Roles(Role.HR)
  @Get()
  async getAll() {
    return this.userService.findAll();
  }
}
