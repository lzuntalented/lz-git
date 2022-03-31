import { ApiResponse } from 'src/common/type';

export class HooksCreateResponse extends ApiResponse {}

export class HooksCreateRequest {
  user: string;
  name: string;
  url: string;
  method: number;
  eventType: number;
  active: boolean;
}
