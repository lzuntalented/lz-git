import fs = require('fs');
import { initDir, initFile } from 'src/utils';
import { AppConfig } from './type';

import path = require('path');
export const isDev = process.env.RUN_ENV === 'development';
export const isProd = process.env.RUN_ENV === 'production';

export const API_CODE = {
  SUCCESS: 200,
  ERROR: 400,
  NO_LOGIN: 405,
};

export const ROOT_PATH = path.resolve(__dirname, '../../../../');
/** 初始化创建仓库副本 */
export const REPO_TMP_PATH = path.resolve(ROOT_PATH, '.repo-tmp');

/** 应用配置目录 */
export const APP_INIT_PATH = path.resolve(ROOT_PATH, '.custom');
/** 应用配置文件 */
export const APP_INIT_CONFIG = path.resolve(APP_INIT_PATH, 'config.json');

/** 仓库根目录 */
export let REPO_ROOT_PATH = path.resolve(ROOT_PATH, '.repo');

/**
 * 初始化系统目录文件
 */
export function initTmpDir() {
  initDir(REPO_TMP_PATH);
  initDir(APP_INIT_PATH);
  initFile(
    APP_INIT_CONFIG,
    JSON.stringify({
      root: REPO_ROOT_PATH,
    }),
  );
  const configStr = fs.readFileSync(APP_INIT_CONFIG, { encoding: 'utf-8' });
  const cfg = (
    configStr ? JSON.parse(configStr.toString()) : { root: REPO_ROOT_PATH }
  ) as AppConfig;
  REPO_ROOT_PATH = cfg.root || REPO_ROOT_PATH;
  initDir(REPO_ROOT_PATH);
}

// =============== sql =================
interface DBConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}
const dbCfg: DBConfig = {
  host: '127.0.0.1',
  port: 3306,
  username: 'root',
  password: '',
  database: 'lzgit',
};

try {
  // 获取本地db配置
  const dbStr = fs.readFileSync(
    path.resolve(process.cwd(), '.db.config.json'),
    {
      encoding: 'utf-8',
    },
  );
  const localDbCfg = JSON.parse(dbStr.toString()) as DBConfig;
  Object.assign(dbCfg, localDbCfg);
} catch (error) {}

export const dbConfig = dbCfg;
