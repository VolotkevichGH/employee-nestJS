import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterUserDto, ResponseUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../database/entities/user.entity';
import { Repository } from 'typeorm';
import * as crypto from 'node:crypto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(dto: RegisterUserDto): Promise<UserEntity> {
    const hasUser = await this.findByEmail(dto.email);
    if (hasUser) throw new BadRequestException('User with this email already exists!');
    const user = this.userRepository.create(dto);
    user.password = crypto.createHash('sha256').update(dto.password).digest('hex');
    return this.userRepository.save(user);
  }

  async findAll(): Promise<ResponseUserDto[]> {
    const users = await this.userRepository.find();
    const res = [];
    for (const user of users) {
      res.push(this.getResponseDtoByUser(user))
    }
    return res;
  }
  async findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  async findById(id: number) {
    const user =  this.userRepository.findOneBy({ id });
    if (!user) throw new BadRequestException('User with this id does not exist!');
    return user;
  }

  getResponseDtoByUser(user: UserEntity): ResponseUserDto {

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
    return dto;
  }
}
