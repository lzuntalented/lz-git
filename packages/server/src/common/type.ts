import { Response, Request } from 'express';

export class ApiResponse {
  code: number;
  data?: any;
  msg?: string;
}

export class AppConfig {
  root: string;
}

export interface UserInfo {
  account: string;
  name?: string;
  avatar?: string;
  id: number;
}

export interface ISession {
  userInfo?: UserInfo;
}

export interface SessionRequest extends Request {
  session?: ISession;
}
