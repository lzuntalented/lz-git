import { ApiResponse } from 'src/common/type';

export class RepoCreateResponse extends ApiResponse {}

export class RepoCreateRequest {
  user: string;
  name: string;
  readme: boolean;
  describe: string;
}
