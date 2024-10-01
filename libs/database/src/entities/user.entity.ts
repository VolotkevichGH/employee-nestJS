import { Column, Entity, IsNull, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RoleEntity } from './role.entity';

@Entity('users')
export class UserEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column()
  surname: string;
  @Column()
  age: number;
  @Column()
  email: string;
  @Column()
  password: string;
  @Column()
  address: string;
  @Column()
  phone: string;
  @Column()
  state: string;
  @Column()
  gender: string;
  @ManyToMany((type) => RoleEntity, {
    cascade: true,
  })
  @JoinTable({
    name: "users_roles",
    joinColumn: { name: "user_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "role_id" }
  })
  roles: RoleEntity[];


}