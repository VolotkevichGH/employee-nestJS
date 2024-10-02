import { Token } from '../../../database/src/entities/token.entity';

export interface Tokens {
  access_token: string;
  refresh_token: Token;
}