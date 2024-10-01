import { RoleEntity } from '../../../database/entities/role.entity';

export class SignInDto {
  email: string;
  password: string;
}

export class ResponseProfileDto {
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
  access_token: string;
}