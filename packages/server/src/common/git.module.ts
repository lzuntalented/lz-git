import { spawn } from 'child_process';
import fs = require('fs');
import path = require('path');
import { REPO_TMP_PATH } from './constants';

export const GIT_FORMAT_MESSAGE = '%s';
export const GIT_FORMAT_TIME = '%ar';

export class Git {
  readonly rootPath: string = '';
  private repoPath = '';
  private user = '';
  private repoName = '';

  constructor(rootPath = '') {
    this.rootPath = rootPath;
  }

  init(user = '', repoName = '') {
    const name = /(\.git)$/.test(repoName) ? repoName : `${repoName}.git`;
    this.repoPath = `${this.rootPath}/${user}/${name}`;
    this.user = user;
    this.repoName = name;
  }

  /** 物理删除仓库 */
  async remove() {
    try {
      // 删除仓库
      fs.rmdirSync(this.repoPath);
    } catch (error) {
      console.log('remove git dir', error);
    }
    try {
      // 删除临时目录
      fs.rmdirSync(path.resolve(REPO_TMP_PATH, this.user, this.repoName));
    } catch (error) {
      console.log('remove git tmp dir', error);
    }
  }

  getRepoPath() {
    return this.repoPath;
  }

  getLastCommitTime(branch = '', srcPath = '') {
    return this.getLastCommit(branch, srcPath, GIT_FORMAT_TIME);
  }

  getLastCommitMessage(branch = '', srcPath = '') {
    return this.getLastCommit(branch, srcPath);
  }

  getFileContent(branch = '', srcPath = '') {
    return this.run(['show', `${branch}:${srcPath}`]);
  }

  async getLastCommit(branch = '', srcPath = '', format = GIT_FORMAT_MESSAGE) {
    return (
      await this.run(['log', '-1', branch, `--format=${format}`, '--', srcPath])
    )
      .split('\n')
      .filter((it) => it)
      .join();
  }

  async getLastCommitInfo(branch = '', srcPath = '') {
    const list = (await this.run(['log', '-1', branch, '--', srcPath]))
      .split('\n')
      .filter((it) => it);
    const hash = list[0].replace(/^(commit )/, '').trim();
    const time = list[2].replace(/^(Date: )/, '').trim();
    const message = list[3].trim();
    return {
      hash,
      time: +new Date(time),
      message,
    };
  }

  /**
   * 创建仓库
   * @param user
   * @param repoName
   * @returns
   */
  create(user = '', repoName = '') {
    const handler = spawn(
      'git',
      ['init', '--bare', `${user}/${repoName}.git`],
      {
        cwd: this.rootPath,
      },
    );

    return new Promise((res, rej) => {
      handler.on('close', (code) => {
        if (code !== 0) {
          console.log(`grep process exited with code ${code}`);
          rej();
        } else {
          this.init(user, repoName);
          res(`${user}/${repoName}.git`);
        }
      });
    });
  }

  /**
   * 执行git命令
   * @param args 数组 命令字符串
   * @param input
   * @param eachOut
   * @returns 命令执行全部输出
   */
  run(
    args: string[],
    input?: any,
    eachOut?: (data: any) => void,
  ): Promise<string> {
    console.log('run', args);
    return new Promise((res, rej) => {
      const result = [];
      const handler = spawn(
        'git',
        args.filter((it) => it),
        {
          cwd: this.repoPath,
        },
      );
      handler.stdout.on('data', (data) => {
        result.push(data);
        if (eachOut) eachOut(data);
      });
      handler.on('close', (code) => {
        if (code !== 0) {
          console.log(`grep process exited with code ${code}`);
          rej();
        } else {
          res(Buffer.concat(result).toString());
        }
      });
      handler.on('error', function (data) {
        console.log('error', data);
        rej();
      });
      if (input) {
        handler.stdin.write(input);
        handler.stdin.end();
      }
    });
  }
}
