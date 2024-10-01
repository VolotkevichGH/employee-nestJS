import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../../shared/enums/role.enum';

@Entity('roles')
export class RoleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: Role;
}