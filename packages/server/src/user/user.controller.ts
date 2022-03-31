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
  Session,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { execSync, exec, spawn } from 'child_process';
import { Response, Request } from 'express';
import fs = require('fs');
import path = require('path');
import {
  API_CODE,
  APP_INIT_CONFIG,
  REPO_ROOT_PATH,
  REPO_TMP_PATH,
  ROOT_PATH,
} from 'src/common/constants';
import { Git } from 'src/common/git.module';
import { AppConfig, ISession, SessionRequest } from 'src/common/type';
import { initDir } from 'src/utils';
import { UserLoginRequest, UserRegisterRequest } from './user.dto';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('/api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(@Body() body: UserLoginRequest, @Session() session: ISession) {
    const { account, password } = body;
    const info = await this.userService.login(account, password);
    if (info) {
      session.userInfo = {
        account: info.account,
        name: info.name,
        avatar: info.avatar,
        id: info.id,
      };
      return info;
    }
    return {
      code: API_CODE.ERROR,
      msg: '登录失败',
    };
  }

  @Post('signup')
  async signup(@Body() body: UserRegisterRequest) {
    const { account, password, email } = body;
    const info = await this.userService.register(account, password, email);
    if (!info) {
      return {
        code: API_CODE.ERROR,
        msg: '参数异常',
      };
    }
  }

  @Get('info')
  async info(@Session() session: ISession) {
    if (session?.userInfo) {
      const { userInfo } = session;
      return {
        account: userInfo.account,
        name: userInfo.name,
        avatar: userInfo.avatar,
      };
    }
    return {
      code: API_CODE.NO_LOGIN,
      msg: '未登录',
    };
  }

  @Get('logout')
  async logout(@Session() session: ISession) {
    if (session?.userInfo) {
      session.userInfo = null;
    }
  }
}
