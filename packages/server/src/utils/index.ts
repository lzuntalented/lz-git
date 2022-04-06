import fs = require('fs');
import { API_CODE } from 'src/common/constants';

export function initDir(path: string) {
  let createFlag = false;
  try {
    const ret = fs.statSync(path);
    if (!ret.isDirectory()) {
      createFlag = true;
    }
  } catch (error) {
    createFlag = true;
  } finally {
    createFlag && fs.mkdirSync(path);
  }
  return true;
}

export function initFile(path: string, content = '') {
  let createFlag = false;
  try {
    const ret = fs.statSync(path);
    if (!ret.isFile()) {
      createFlag = true;
    }
  } catch (error) {
    createFlag = true;
  } finally {
    createFlag && fs.writeFileSync(path, content);
  }
  return true;
}

/**
 * 创建随机字符
 * @param {*} type 类型
 * @param {*} len 长度
 */
export function createRandom(len = 6) {
  const pool = '1234567890qwertyuiiopasdfghjklzxcvbnm';
  const poolSize = pool.length;
  let result = '';
  for (let i = 0; i < len; i += 1) {
    result += pool[Math.floor(Math.random() * poolSize)];
  }
  return result;
}

export function setResponse(code: number, data?: any) {
  if (code === API_CODE.SUCCESS) {
    return {
      code,
      data,
    };
  } else {
    return {
      code,
      msg: data,
    };
  }
}
