import { RoleEntity } from '../../../../database/src/entities/role.entity';

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
  access_token: string;
  roles: RoleEntity[];
}