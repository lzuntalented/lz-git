import { ChildProcessWithoutNullStreams, execSync, spawn } from 'child_process';

export const GIT_FORMAT_MESSAGE = '%s';
export const GIT_FORMAT_TIME = '%ar';

export class Git {
  readonly rootPath: string = '';
  private repoPath = '';

  constructor(rootPath = '') {
    this.rootPath = rootPath;
  }

  init(user = '', repoName = '') {
    const name = /(\.git)$/.test(repoName) ? repoName : `${repoName}.git`;
    this.repoPath = `${this.rootPath}/${user}/${name}`;
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
      if (input) {
        handler.stdin.write(input);
        handler.stdin.end();
      }
    });
  }
}
