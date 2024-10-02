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
      res.push(this.getResponseDtoByUser(user));
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
}
