import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { HrService } from './hr.service';
import { JwtAuthGuard } from '../../../shared/src/guards/jwt.auth.guard';
import { RolesGuard } from '../../../shared/src/guards/roles.guard';
import { Roles } from '../../../shared/src/decorators/roles.decorator';
import { Role } from '../../../shared/src/enums/role.enum';
import { ResponseUserDto } from '../user/dto';
import { UserService } from '../user/user.service';

@Controller('hr')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles([Role.HR, Role.Director])
export class HrController {
  constructor(
    private readonly hrService: HrService,
    private readonly userService: UserService,
  ) {}

  @Get('search')
  async getAll(): Promise<ResponseUserDto[]> {
    return this.hrService.searchApplicants();
  }

  @Post('invite/:id')
  async invite(@Param('id') id: string): Promise<ResponseUserDto> {
    const user = await this.hrService.invite(id);
    return this.userService.getResponseDtoByUser(user);
  }

  @Post('uninvite/:id')
  async uninvite(@Param('id') id: string): Promise<ResponseUserDto> {
    const user = await this.hrService.uninvite(id);
    return this.userService.getResponseDtoByUser(user);
  }


  @Get('employee')
  async getEmployee(): Promise<ResponseUserDto[]> {
    return this.hrService.getEmployee();
  }
}
