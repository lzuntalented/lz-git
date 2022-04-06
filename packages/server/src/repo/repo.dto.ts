import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import { ApiResponse } from 'src/common/type';

export class RepoCreateResponse extends ApiResponse {}

export class RepoCreateRequest {
  @IsString()
  @Length(1)
  user: string;

  @IsString()
  @Length(2)
  name: string;

  @IsBoolean()
  readme: boolean;

  @IsOptional()
  @IsString()
  describe?: string;
}

export class RepoRemoveRequest {
  @IsString()
  @Length(2)
  name: string;
}
