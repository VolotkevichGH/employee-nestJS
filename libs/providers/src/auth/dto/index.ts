import { Tokens } from '../../../../shared/src/interfaces/tokens.interface';
import { RoleEntity } from '../../../../database/src/entities/role.entity';
import { Role } from '../../../../shared/src/enums/role.enum';

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
  roles: Role[];
  tokens: Tokens;
}