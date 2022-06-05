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
import { StarLikeRequest } from './star.dto';
import { StarService } from './star.service';

@ApiTags('star')
@Controller('/api/star')
export class StarController extends BaseController {
  constructor(
    private readonly starService: StarService,
    private readonly repoService: RepoService,
  ) {
    super();
  }

  @Post('like')
  @UseGuards(UserGuard)
  async create(@Body() body: StarLikeRequest, @Session() session: ISession) {
    const userId = session.userInfo.id as number;
    const { repoName, user } = body;
    const repoInfo = await this.repoService.getRepoDetail(repoName, user);
    if (repoInfo) {
      return !!(await this.starService.like(userId, repoInfo));
    }
    return this.fail();
  }

  @Post('unlike')
  @UseGuards(UserGuard)
  async unlike(@Body() body: StarLikeRequest, @Session() session: ISession) {
    const userId = session.userInfo.id as number;
    const { repoName, user } = body;
    const repoInfo = await this.repoService.getRepoDetail(repoName, user);
    if (repoInfo) {
      await this.starService.unlike(userId, repoInfo);
    }
  }

  @Get('status')
  async status(
    @Query('user') user: string,
    @Query('repoName') repoName: string,
    @Session() session: ISession,
  ) {
    const userId = session?.userInfo?.id as number;
    const repoInfo = await this.repoService.getRepoDetail(repoName, user);
    if (repoInfo) {
      let status = false;
      if (userId) {
        status = !!(await this.starService.getInfo(userId, repoInfo));
      }
      const count = await this.starService.getCount(repoInfo);
      return {
        status,
        count,
      };
    }
  }

  @Get('list')
  @UseGuards(UserGuard)
  async list(@Query('user') user: string, @Session() session: ISession) {
    const userId = session?.userInfo?.id as number;
    const [list, total] = await this.starService.getListWithUserId(userId);
    return {
      list: list.map((it) => {
        return {
          user: it.repo.user.account,
          name: it.repo.name,
          describe: it.repo.describe,
          starNum: it.starNum,
        };
      }),
      total,
    };
  }
}
