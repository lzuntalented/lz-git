import {
  All,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { execSync } from 'child_process';
import fs = require('fs');
import path = require('path');
import { BaseController } from 'src/common/base.controller';
import { REPO_ROOT_PATH, REPO_TMP_PATH } from 'src/common/constants';
import { ISession } from 'src/common/type';
import { UserGuard } from 'src/guard/auth.guard';
import { RepoService } from 'src/repo/repo.service';
import { HooksCreateRequest } from './hooks.dto';
import { HooksService } from './hooks.service';

@ApiTags('hooks')
@Controller('/api/hooks')
@UseGuards(UserGuard)
export class HooksController extends BaseController {
  constructor(
    private readonly hooksService: HooksService,
    private readonly repoService: RepoService,
  ) {
    super();
  }

  @Post('create')
  async create(@Body() body: HooksCreateRequest, @Session() session: ISession) {
    const { url, type, pattern, security, repoName } = body;
    const repoInfo = await this.repoService.getRepoDetail(
      repoName,
      session.userInfo.account,
    );
    await this.hooksService.create(repoInfo.id, url, type, pattern, security);
    // const repoRootPath = REPO_ROOT_PATH;
    // const user = 'lz';
    // const repoName = name;
    // const cmds = [
    //   `cd ${REPO_ROOT_PATH}`,
    //   `cd ${user}`,
    //   `cd ${repoName}.git`,
    //   `cd hooks`,
    //   `echo curl ${url} > post-receive`,
    // ];
    // const ret = execSync(cmds.join(' && '));
    // return ret.toString('utf-8');
  }

  @Get('list')
  async list(
    @Query('repoName') repoName: string,
    @Session() session: ISession,
  ) {
    const repoInfo = await this.repoService.getRepoDetail(
      repoName,
      session.userInfo.account,
    );
    const list = await this.hooksService.getList(repoInfo.id);
    return this.success(list);
  }

  @All('run')
  run(@Body() body: HooksCreateRequest): string {
    console.log(body, 'run==============================');
    return '';
  }
}
