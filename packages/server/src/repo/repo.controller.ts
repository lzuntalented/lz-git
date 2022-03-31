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
import fs = require('fs');
import path = require('path');
import { API_CODE, REPO_ROOT_PATH, REPO_TMP_PATH } from 'src/common/constants';
import { Git } from 'src/common/git.module';
import { ISession } from 'src/common/type';
import { UserGuard } from 'src/guard/auth.guard';
import { UserService } from 'src/user/user.service';
import { RepoCreateRequest } from './repo.dto';
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
    // const user = 'lz';
    // const list = fs.readdirSync(path.resolve(REPO_ROOT_PATH, user));
    // return list.map((it) => {
    //   if (/(\.git)$/.test(it)) {
    //     return `${user}/${it.replace(/(\.git)$/, '')}`;
    //   }
    // });
  }

  @Get('list/branch')
  async listBranch(
    @Query('user') user: string,
    @Query('repoName') repoName: string,
  ) {
    const git = new Git(REPO_ROOT_PATH);
    git.init(user, repoName);
    const list = (await git.run(['show-ref'])) as string;
    console.log(list, 'list--------');
    return list
      .split('\n')
      .filter((it) => it)
      .map((it) => {
        const str = it.split(' ').slice(-1).join('');
        return str.replace('refs/heads/', '');
      });
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
    // const cmds = [
    //   `cd ${REPO_ROOT_PATH}`,
    //   `cd ${user}`,
    //   `cd ${repoName}.git`,
    //   pathHash ? `git ls-tree ${pathHash}` : `git ls-tree ${branch} ${pathHash}`,
    // ];
    // console.log(cmds)
    let readmeContent = '';
    const ret = (
      await gitCmd.run(
        ['ls-tree', pathHash ? '' : branch, pathHash].filter((it) => it),
      )
    )
      .split('\n')
      .filter((it) => it);

    console.log(ret, 'ret');
    const result = [];
    for (let i = 0; i < ret.length; ++i) {
      const it = ret[i];
      const [id, type, other] = it.split(' ');
      const [hash, name] = other.split('\t');

      const commitMsg = (
        await gitCmd.getLastCommitMessage(
          branch,
          treeUnique ? `${treeUnique}/${name}` : name,
        )
      )
        // execSync([
        //   `cd ${REPO_ROOT_PATH}/${user}/${repoName}.git`,
        //   `git log -1 ${branch} --format="%s" -- ${treeUnique ? `${treeUnique}/${name}` : name}`
        // ].join(' && '))
        // .toString('utf-8')
        .split('\n')
        .filter((it) => it)
        .join();

      const commitTime = (
        await gitCmd.getLastCommitTime(
          branch,
          treeUnique ? `${treeUnique}/${name}` : name,
        )
      )
        // execSync([
        //   `cd ${REPO_ROOT_PATH}/${user}/${repoName}.git`,
        //   `git log -1 ${branch} --format="%ar" -- ${treeUnique ? `${treeUnique}/${name}` : name}`
        // ].join(' && '))
        // .toString('utf-8')
        .split('\n')
        .filter((it) => it)
        .join();

      if (name.toLowerCase() === 'readme.md') {
        readmeContent = await gitCmd.getFileContent(
          branch,
          treeUnique ? `${treeUnique}/${name}` : name,
        );
        // execSync([
        //   `cd ${REPO_ROOT_PATH}/${user}/${repoName}.git`,
        //   `git show ${branch}:${treeUnique ? `${treeUnique}/${name}` : name}`
        // ].join(' && '))
        // .toString('utf-8')
      }

      result.push({
        isTree: type === 'tree',
        hash,
        name,
        commitMsg,
        commitTime,
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
      const getUniqueCmds = [
        `cd ${REPO_ROOT_PATH}`,
        `cd ${user}`,
        `cd ${repoName}.git`,
        `git ls-tree ${branch} ${pathHash}`,
      ];
      // const ret = execSync(getUniqueCmds.join(' && '));
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
      //  console.log(getUniqueCmds, ret
      //    .toString('utf-8'), pathHash)

      // readmeContent = execSync(
      //   [
      //     `cd ${REPO_ROOT_PATH}/${user}/${repoName}.git`,
      //     `git show ${branch}:${treeUnique}`,
      //   ].join(' && '),
      // ).toString('utf-8');
      readmeContent = await gitCmd.run(['show', `${branch}:${treeUnique}`]);
    }

    return readmeContent;
  }
}
