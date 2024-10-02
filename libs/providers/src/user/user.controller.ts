import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { LocalAuthGuard } from '../../../shared/src/guards/local.auth.guard';
import { JwtAuthGuard } from '../../../shared/src/guards/jwt.auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getById(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    return this.userService.getResponseDtoByUser(user);
  }

  @UseGuards(LocalAuthGuard)
  @Get()
  async getAll() {
    return this.userService.findAll();
  }
}
