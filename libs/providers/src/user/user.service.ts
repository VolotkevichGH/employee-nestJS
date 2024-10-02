import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterUserDto, ResponseUserDto } from './dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../database/src/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import * as crypto from 'node:crypto';
import { RoleService } from '../role/role.service';
import { Role } from '../../../shared/src/enums/role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly roleService: RoleService,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async create(dto: RegisterUserDto): Promise<UserEntity> {
    const hasUser = await this.findByEmail(dto.email);
    if (hasUser)
      throw new BadRequestException('User with this email already exists!');
    const user = this.userRepository.create(dto);
    user.password = crypto
      .createHash('sha256')
      .update(dto.password)
      .digest('hex');
    user.roles = [await this.roleService.findByTitle(Role.User)];
    return this.userRepository.save(user);
  }

  async findAll(): Promise<ResponseUserDto[]> {
    const users = await this.userRepository.find();
    const res = [];
    for (const user of users) {
      res.push(await this.getResponseDtoByUser(user));
    }
    return res;
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async findById(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user)
      throw new BadRequestException('User with this id does not exist!');
    return user;
  }

  async getResponseDtoByUser(user: UserEntity): Promise<ResponseUserDto> {
    const roles = await this.findRolesByUserId(user.id);
    const dto = new ResponseUserDto();
    dto.id = user.id;
    dto.name = user.name;
    dto.surname = user.surname;
    dto.age = user.age;
    dto.email = user.email;
    dto.phone = user.phone;
    dto.state = user.state;
    dto.gender = user.gender;
    dto.address = user.address;
    dto.roles = roles;
    return dto;
  }

  async findRolesByUserId(userId: string) {
    const query = `SELECT role_id
                   FROM users_roles
                   where CAST(user_id as text) ILIKE '${userId}'`;
    const res = await this.dataSource.query(query);
    const roles: Role[] = [];
    for (const role of res) {
      const roleEntity = await this.roleService.findById(role.role_id);
      roles.push(roleEntity.title);
    }
    return roles;
  }

  async findUsersByRoleTitle(roleName: Role): Promise<UserEntity[]> {
    const role = await this.roleService.findByTitle(roleName);
    const query = `SELECT user_id
                   FROM users_roles
                   where CAST(role_id as text) ILIKE '${role.id}'`;
    const res = await this.dataSource.query(query);
    const users: UserEntity[] = [];
    for (const resUser of res) {
      const user = await this.findById(resUser.user_id);
      users.push(user);
    }
    return users;
  }

  async findUsersByManyRoleTitles(roles: Role[]): Promise<UserEntity[]> {
    const baseRes = [];
    if (!roles) throw new BadRequestException('Roles does not exist!');
    for (const roleName of roles) {
      const role = await this.roleService.findByTitle(roleName);
      const query = `SELECT user_id
                   FROM users_roles
                   where CAST(role_id as text) ILIKE '${role.id}'`;
      const res = await this.dataSource.query(query);
      baseRes.push(res);
    }

    const users: UserEntity[] = [];
    for (let i = 0; i < baseRes.length; i++) {
      for (const resUser of baseRes[i]) {
        const user = await this.findById(resUser.user_id);
        users.push(user);
      }
    }
    return users;
  }

  async save(user: UserEntity): Promise<UserEntity> {
    return this.userRepository.save(user);
  }

  async changeRole(userId: string, roleId: string): Promise<UserEntity> {
    const query = `UPDATE users_roles
                   SET role_id = '${roleId}'
                   where user_id = '${userId}'`;
    await this.dataSource.query(query);
    return await this.findById(userId);
  }

  async validateRole(userId: string, roleName: Role): Promise<boolean> {
    const role = await this.roleService.findByTitle(roleName);
    const query = `SELECT role_id
                   FROM users_roles
                   WHERE CAST(user_id as text) ILIKE '${userId}'`;
    const res = await this.dataSource.query(query);
    for (const resRole of res) {
      if (resRole.role_id === role.id) {
        return true;
      }
    }
    return false;
  }
}
