export class UserLoginRequest {
  account: string;
  password: string;
}

export class UserRegisterRequest {
  account: string;
  password: string;
  email: string;
  name: string;
}
