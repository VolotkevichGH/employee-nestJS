import { RoleEntity } from '../../../database/src/entities/role.entity';
import { Role } from '../enums/role.enum';

export interface JWTPayload {
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