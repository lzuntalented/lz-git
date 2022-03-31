import { message } from 'antd';
import axios from 'axios';
import { API_CODE, isDev } from '../common/constants';

const requestHandler = axios.create(isDev ? {
  baseURL: 'http://localhost:3000',
  withCredentials: true,
} : {});

requestHandler.interceptors.response.use(
  (res) => {
    console.log('response', res.request.responseURL, res.data);
    if (res.data.code === API_CODE.SUCCESS) {
      return res.data.data;
    }
    message.error(res?.data?.msg || '网络异常，请重试');
    throw new Error(res.data);
  },
  (error) =>
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // eslint-disable-next-line implicit-arrow-linebreak
    Promise.reject(error)
  ,
);

export default requestHandler;

export const REQUEST_URL = {
  REPO: {
    LIST: 'api/repo/list',
    CREATE: '/api/repo/create',
    LIST_BRANCH: '/api/repo/list/branch',
    LIST_FILES: '/api/repo/list/files',
    READ_FILE: '/api/repo/read/file',
  },
  HOOKS: {
    CREATE: '/api/hooks/create',
  },
  INSTALL: {
    INIT: '/api/install/init',
  },
  USER: {
    LOGIN: '/api/user/login',
    REGISTER: '/api/user/signup',
    INFO: '/api/user/info',
    LOGOUT: '/api/user/logout',
  },
};
