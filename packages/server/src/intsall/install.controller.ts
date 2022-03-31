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
import {
  APP_INIT_CONFIG,
  REPO_ROOT_PATH,
  REPO_TMP_PATH,
  ROOT_PATH,
} from 'src/common/constants';
import { Git } from 'src/common/git.module';
import { AppConfig } from 'src/common/type';
import { initDir } from 'src/utils';
import { InstallInitRequest } from './install.dto';

@ApiTags('install')
@Controller('/api/install')
export class InstallController {
  @Post('init')
  async init(@Body() body: InstallInitRequest) {
    const { rootPath } = body;
    const cfg: AppConfig = { root: rootPath };
    initDir(rootPath);
    fs.writeFileSync(APP_INIT_CONFIG, JSON.stringify(cfg));
  }
}
