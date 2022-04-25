import {
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
import { IsString, isString } from 'class-validator';
import fs = require('fs');
import path = require('path');
import { API_CODE, REPO_ROOT_PATH, REPO_TMP_PATH } from 'src/common/constants';
import { Git } from 'src/common/git.module';
import { ISession } from 'src/common/type';
import { UserGuard } from 'src/guard/auth.guard';
import { UserService } from 'src/user/user.service';
import { RepoCreateRequest, RepoRemoveRequest } from './repo.dto';
import { RepoService } from './repo.service';

@Controller('/api/repo')
export class RepoController {
  constructor(
    private readonly repoService: RepoService,
    private readonly userService: UserService,
  ) {}

  @Post('create')
  @ApiTags('repo')
  @UseGuards(UserGuard)
  async create(@Body() body: RepoCreateRequest, @Session() session: ISession) {
    const { name, readme, describe } = body;
    const user = session.userInfo.account;
    const repoName = name;
    const repoInfo = await this.repoService.create(
      session.userInfo.id,
      repoName,
      describe || '',
    );
    if (!repoInfo) {
      return {
        code: API_CODE.ERROR,
        msg: '参数异常',
      };
    }
    const git = new Git(REPO_ROOT_PATH);
    await git.create(user, name);

    if (readme) {
      const readMeCmds = [
        `cd ${REPO_TMP_PATH}`,
        `git clone ${REPO_ROOT_PATH}/${user}/${repoName} ${user}-${repoName}`,
        `cd ${user}-${repoName}`,
        `echo readme >> readme.md`,
        `git add .`,
        `git commit -m 'init'`,
        `git push origin master`,
      ];
      execSync(readMeCmds.join(' && '));
    }
    return '';
  }

  @Get('list')
  async list(@Query('user') user: string, @Session() session: ISession) {
    const info = await this.repoService.getUserRepoList(user);
    return (info ? info.repositories : []).map((it) => {
      return {
        name: it.name,
        describe: it.describe,
      };
    });
  }

  @Get('list/branch')
  async listBranch(
    @Query('user') user: string,
    @Query('repoName') repoName: string,
  ) {
    // 检查项目是否存在
    const info = await this.repoService.getUserRepoDetail(
      repoName.replace(/(\.git)$/, ''),
    );
    if (!info) {
      return {
        code: API_CODE.ERROR,
        msg: '参数异常',
      };
    }
    const git = new Git(REPO_ROOT_PATH);
    git.init(user, repoName);
    const list = (await git.run(['show-ref'])) as string;
    return {
      list: list
        .split('\n')
        .filter((it) => it)
        .map((it) => {
          const str = it.split(' ').slice(-1).join('');
          return str.replace('refs/heads/', '');
        }),
      master: info.master,
    };
  }

  /**
   * git log -3  --format="%an %s %ar" -- A.txt
   * @param user
   * @param repoName
   * @param branch
   * @param treeUnique
   * @returns
   */
  @Get('list/files')
  async listFiles(
    @Query('user') user: string,
    @Query('repoName') repoName: string,
    @Query('branch') branch: string,
    @Query('path') treeUnique: string,
  ) {
    const gitCmd = new Git(REPO_ROOT_PATH);
    gitCmd.init(user, repoName);
    let pathHash = treeUnique;
    if (pathHash) {
      const ret = await gitCmd.run(['ls-tree', branch, pathHash]);
      pathHash = ret
        .split('\n')
        .filter((it) => it)
        .map((it, i) => {
          const [id, type, other] = it.split(' ');
          const [hash, name] = other.split('\t');
          return {
            isTree: type === 'tree',
            hash,
            name,
          };
        })
        .filter((it) => it.isTree)
        .map((it) => it.hash)
        .join();
      if (!pathHash) return [];
    }
    let readmeContent = '';
    const ret = (
      await gitCmd.run(
        ['ls-tree', pathHash ? '' : branch, pathHash].filter((it) => it),
      )
    )
      .split('\n')
      .filter((it) => it);

    const result = [];
    for (let i = 0; i < ret.length; ++i) {
      const it = ret[i];
      const [id, type, other] = it.split(' ');
      const [hash, name] = other.split('\t');

      // const commitMsg = (
      //   await gitCmd.getLastCommitMessage(
      //     branch,
      //     treeUnique ? `${treeUnique}/${name}` : name,
      //   )
      // )
      //   .split('\n')
      //   .filter((it) => it)
      //   .join();

      // const commitTime = (
      //   await gitCmd.getLastCommitTime(
      //     branch,
      //     treeUnique ? `${treeUnique}/${name}` : name,
      //   )
      // )
      //   .split('\n')
      //   .filter((it) => it)
      //   .join();
      const {
        hash: commitHash,
        time: commitTime,
        message: commitMsg,
      } = await gitCmd.getLastCommitInfo(
        branch,
        treeUnique ? `${treeUnique}/${name}` : name,
      );

      if (name.toLowerCase() === 'readme.md') {
        readmeContent = await gitCmd.getFileContent(
          branch,
          treeUnique ? `${treeUnique}/${name}` : name,
        );
      }

      result.push({
        isTree: type === 'tree',
        hash,
        name,
        commitMsg,
        commitTime,
        commitHash,
      });
    }

    const resp = {
      readmeContent: readmeContent,
      list: result,
      info: await gitCmd.getLastCommitMessage(branch, treeUnique || ''),
    };
    // console.log(readmeContent)
    return resp;
  }

  /**
   * git log -3  --format="%an %s %ar" -- A.txt
   * @param user
   * @param repoName
   * @param branch
   * @param treeUnique
   * @returns
   */
  @Get('read/file')
  async getFileContent(
    @Query('user') user: string,
    @Query('repoName') repoName: string,
    @Query('branch') branch: string,
    @Query('path') treeUnique: string,
  ) {
    let pathHash = treeUnique;
    let readmeContent = '';
    const gitCmd = new Git(REPO_ROOT_PATH);
    gitCmd.init(user, repoName);
    if (pathHash) {
      const ret = await gitCmd.run(['ls-tree', branch, pathHash]);
      pathHash = ret
        .split('\n')
        .filter((it) => it)
        .map((it, i) => {
          const [id, type, other] = it.split(' ');
          const [hash, name] = other.split('\t');
          return {
            isTree: type === 'tree',
            hash,
            name,
          };
        })
        .filter((it) => it.isTree)
        .map((it) => it.hash)
        .join();
      readmeContent = await gitCmd.run(['show', `${branch}:${treeUnique}`]);
    }

    return readmeContent;
  }

  @Get('search')
  async search(@Query('keyword') keyword: string) {
    const word = (keyword || '').trim();
    if (word.length > 0) {
      const list = await this.repoService.search(keyword);
      return list.map((it) => `${it.user.account}/${it.name}`);
    } else {
      return [];
    }
  }

  @Post('remove')
  @UseGuards(UserGuard)
  async remove(@Body() body: RepoRemoveRequest, @Session() session: ISession) {
    const { name } = body;
    const repoName = name.trim();
    const user = session.userInfo.account;
    // 检查项目是否存在
    const info = await this.repoService.getUserRepoDetail(repoName);
    if (!info || info.user.account !== user) {
      return;
    }
    await this.repoService.remove(info.id);
    const gitCmd = new Git(REPO_ROOT_PATH);
    gitCmd.init(user, repoName);
    try {
      gitCmd.remove();
    } catch (error) {
      console.log('errrr', error);
    }
  }

  /**
   * git log -3  --format="%an %s %ar" -- A.txt
   * @param user
   * @param repoName
   * @param branch
   * @param treeUnique
   * @returns
   */
  @Get('commit')
  async getCommitInfo(
    @Query('user') user: string,
    @Query('repoName') repoName: string,
    @Query('hash') hash: string,
  ) {
    const gitCmd = new Git(REPO_ROOT_PATH);
    gitCmd.init(user, repoName);
    const ret = await gitCmd.run(['show', hash]);
    const fileMap = [];
    const fileContent = {
      diffLine: 0,
      findDiff: false,
      collect: false,
      str: [],
      startLine: 0,
      endLine: 0,
      lineStr: '',
    };
    const commitInfo = {
      author: '',
      date: 0,
      message: '',
      hash,
    };
    ret.split('\n').forEach((it, i) => {
      if (i === 1) {
        commitInfo.author = it
          .replace(/^(Author:)/, '')
          .trim()
          .split(' ')
          .slice(0, -1)
          .join('');
      }
      if (i === 2) {
        commitInfo.date = +new Date(it.replace(/^(Date:)/, '').trim());
      }
      if (i === 4) {
        commitInfo.message = it.trim();
      }
      if (/^(diff --git )/.test(it)) {
        if (fileMap.length > 0) {
          const obj = fileMap[fileMap.length - 1];
          obj.str = fileContent.str;
          obj.startLine = fileContent.startLine;
          obj.endLine = fileContent.endLine;
          obj.lineStr = fileContent.lineStr;
        }
        fileContent.findDiff = true;
        fileContent.diffLine = i;
        fileContent.str = [];
        fileContent.collect = false;
        fileMap.push({
          file: it
            .split(' ')
            .slice(-1)
            .join('')
            .replace(/^(b\/)/, ''),
          str: '',
        });
      }
      if (fileContent.findDiff && i === fileContent.diffLine + 4) {
        const lineList = it.replace(/^(@@ (.*) @@)(.*)/, '$2');

        const [startStr, endStr] = lineList.split(' ');

        const [start] = startStr.split(',');
        const startLine = +start.replace(/[^0-9]/g, '');

        const [end] = endStr.split(',');
        const endLine = +end.replace(/[^0-9]/g, '');

        fileContent.startLine = startLine;
        fileContent.endLine = endLine;
        fileContent.lineStr = it;
      }
      if (fileContent.findDiff && i > fileContent.diffLine + 5) {
        fileContent.collect = true;
        fileContent.findDiff = false;
      }
      if (fileContent.collect) {
        fileContent.str.push(it);
      }
    });
    if (fileMap.length > 0) {
      const obj = fileMap[fileMap.length - 1];
      obj.str = fileContent.str;
      obj.startLine = fileContent.startLine;
      obj.endLine = fileContent.endLine;
      obj.lineStr = fileContent.lineStr;
    }
    return {
      commitInfo,
      fileMap,
    };
  }
}
