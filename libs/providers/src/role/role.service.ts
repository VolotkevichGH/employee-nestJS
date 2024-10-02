import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from '../../../database/src/entities/role.entity';
import { Role } from '../../../shared/src/enums/role.enum';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async findAll(): Promise<RoleEntity[]> {
    return await this.roleRepository.find();
  }

  async findByTitle(title: Role): Promise<RoleEntity> {
    return await this.roleRepository.findOneBy({ title: title });
  }

  async findById(id:string): Promise<RoleEntity> {
    return await this.roleRepository.findOne({
      where: { id: id },
    })
  }
}
