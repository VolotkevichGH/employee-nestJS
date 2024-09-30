import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Get('/:id')
  async getById(@Param('id') id: number) {
    const user = await this.userService.findById(id);
    return this.userService.getResponseDtoByUser(user);
  }

  @Get()
  async getAll(){
    return this.userService.findAll();
  }

}
