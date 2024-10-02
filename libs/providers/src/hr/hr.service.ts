import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ResponseUserDto } from '../user/dto';
import { Role } from '../../../shared/src/enums/role.enum';
import { RoleService } from '../role/role.service';

@Injectable()
export class HrService {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
  ) {}

  async getEmployee(): Promise<ResponseUserDto[]> {
    const employee = await this.userService.findUsersByManyRoleTitles([
      Role.Employee,
      Role.HR,
      Role.Director,
      Role.Accountant,
    ]);

    const result: ResponseUserDto[] = [];
    for (const user of employee) {
      result.push(await this.userService.getResponseDtoByUser(user));
    }
    return result;
  }

  async searchApplicants(): Promise<ResponseUserDto[]> {
    const users = await this.userService.findUsersByRoleTitle(Role.User);
    const result: ResponseUserDto[] = [];
    for (const user of users) {
      result.push(await this.userService.getResponseDtoByUser(user));
    }
    return result;
  }

  async invite(userId: string) {
    const user = await this.userService.findById(userId);
    if (!user)
      throw new BadRequestException('User with this id does not exist!');
    const hasUser = await this.userService.validateRole(userId, Role.User);
    if (!hasUser)
      throw new BadRequestException('User with this id already employed!');
    const role = await this.roleService.findByTitle(Role.Employee);
    return await this.userService.changeRole(userId, role.id);
  }

  async uninvite(userId: string) {
    const user = await this.userService.findById(userId);
    if (!user)
      throw new BadRequestException('User with this id does not exist!');
    const hasEmployee = await this.userService.validateRole(
      userId,
      Role.Employee,
    );
    if (!hasEmployee)
      throw new BadRequestException('User with this id already unemployed!');
    const role = await this.roleService.findByTitle(Role.User);
    return await this.userService.changeRole(userId, role.id);
  }
}
