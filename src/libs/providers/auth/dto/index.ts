
export class SignInDto {
  email: string;
  password: string;
}

export class ResponseProfileDto {
  id: number;
  name: string;
  surname: string;
  age: number;
  email: string;
  address: string;
  phone: string;
  state: string;
  gender: string;

  access_token: string;
}