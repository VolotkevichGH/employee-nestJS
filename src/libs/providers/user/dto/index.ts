import { RoleEntity } from '../../../database/entities/role.entity';

export class RegisterUserDto {

  name: string;
  surname: string;
  age: number;
  email: string;
  password: string;
  address: string;
  phone: string;
  state: string;
  gender: string;
}

export class ResponseUserDto {

  id: string;
  name: string;
  surname: string;
  age: number;
  email: string;
  address: string;
  phone: string;
  state: string;
  gender: string;
  roles: RoleEntity[];

}
