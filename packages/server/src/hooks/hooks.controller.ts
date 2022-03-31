import { All, Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { execSync } from 'child_process';
import fs = require('fs');
import path = require('path');
import { REPO_ROOT_PATH, REPO_TMP_PATH } from 'src/common/constants';
import { HooksCreateRequest } from './hooks.dto';

@ApiTags('hooks')
@Controller('/api/hooks')
export class HooksController {
  @Post('create')
  create(@Body() body: HooksCreateRequest): string {
    const { user, name, url, eventType, method, active } = body;
    const repoRootPath = REPO_ROOT_PATH;
    // const user = 'lz';
    const repoName = name;
    const cmds = [
      `cd ${REPO_ROOT_PATH}`,
      `cd ${user}`,
      `cd ${repoName}.git`,
      `cd hooks`,
      `echo curl ${url} > post-receive`,
    ];
    const ret = execSync(cmds.join(' && '));
    return ret.toString('utf-8');
  }

  @Get('list')
  list(): string[] {
    const user = 'lz';
    const list = fs.readdirSync(path.resolve(REPO_ROOT_PATH, user));
    return list.map((it) => {
      if (/(\.git)$/.test(it)) {
        return `${user}/${it.replace(/(\.git)$/, '')}`;
      }
    });
  }

  @All('run')
  run(@Body() body: HooksCreateRequest): string {
    console.log(body, 'run==============================');
    return '';
  }
}
