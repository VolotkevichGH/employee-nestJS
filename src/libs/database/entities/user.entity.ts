import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class UserEntity {

  @PrimaryGeneratedColumn()
  id: number;
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


}