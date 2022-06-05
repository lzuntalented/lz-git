import { ApiResponse, RepositoryBodyRequest } from 'src/common/type';

export class HooksCreateResponse extends ApiResponse {}

export class HooksCreateRequest extends RepositoryBodyRequest {
  url: string;
  pattern: string;
  security?: string;
  type: number;
}
