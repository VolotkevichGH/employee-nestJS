import { RoleEntity } from '../../../../database/src/entities/role.entity';
import { Role } from '../../../../shared/src/enums/role.enum';

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
  roles: Role[];

}
