import {
  Body,
  Controller,
  Get,
  Header,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { execSync, exec, spawn } from 'child_process';
import { Response, Request } from 'express';
import fs = require('fs');
import path = require('path');
import { REPO_ROOT_PATH, REPO_TMP_PATH } from 'src/common/constants';
import { Git } from 'src/common/git.module';
import { RepoService } from 'src/repo/repo.service';
import { UserService } from 'src/user/user.service';

@ApiTags('http')
@Controller('/:user/:repoName')
export class HttpController {
  constructor(
    private readonly repoService: RepoService,
    private readonly userService: UserService,
  ) {}

  @Get('/info/refs')
  // @Header('Content-Type', 'application/x-git-upload-pack-advertisement')
  // @Header('Cache-Control', 'none')
  async infoRefs(
    @Param('user') user: string,
    @Param('repoName') repoName: string,
    @Query('service') service: string,
    @Res() res: Response,
  ) {
    res.setHeader('Content-Type', `application/x-${service}-advertisement`);
    res.header('Cache-Control', 'none');
    // res.status(HttpStatus.OK)
    // res.write(result)
    // res.end()
    const git = new Git(REPO_ROOT_PATH);
    git.init(user, repoName);
    const runResult = await git.run([
      service.replace(/^(git-)/, ''),
      '--stateless-rpc',
      '--advertise-refs',
      git.getRepoPath(),
    ]);

    const firstLen = `# service=${service}\n`;
    const result = `00${Number(firstLen.length + 4).toString(
      16,
    )}${firstLen}0000${runResult}`;
    // console.log(result)
    res.write(result);
    res.end();
  }

  @Post(['/git-upload-pack', '/git-receive-pack'])
  async uploadAndRecevie(
    @Param('user') user: string,
    @Param('repoName') repoName: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    // 检查项目是否存在
    const info = await this.repoService.getUserRepoDetail(
      repoName.replace(/(\.git)$/, ''),
    );
    if (!info) {
      res.end();
      return;
    }

    const service = req.path.split('/').slice(-1).join('').replace('git-', '');
    if (service === 'receive-pack') {
      // 上传代码需验证项目归属
      const authenticate = (req.header('authorization') || '')
        .split(' ')
        .slice(-1)
        .join('');
      const [user, psd] = Buffer.from(authenticate, 'base64')
        .toString()
        .split(':');
      const userInfo = await this.userService.login(user, psd);
      if (!userInfo) {
        res.setHeader('WWW-Authenticate', `Basic realm="."`);
        res.sendStatus(401);
        res.end();
        return;
      }
    }
    console.log(service);
    res.header('Content-Type', `application/x-git-${service}-result`);
    res.header('Cache-Control', 'none');
    res.status(HttpStatus.OK);
    const git = new Git(REPO_ROOT_PATH);
    git.init(user, repoName);
    const handler = await git.run(
      [service, `--stateless-rpc`, `${REPO_ROOT_PATH}/${user}/${repoName}`],
      req.body,
      (data) => {
        res.write(data);
      },
    );
    res.end();
  }
}
