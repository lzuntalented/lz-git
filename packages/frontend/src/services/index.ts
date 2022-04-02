import { message } from 'antd';
import axios from 'axios';
import { API_CODE, API_DOMAIN, isDev } from '../common/constants';

const axiosOptions = isDev ? {
  baseURL: API_DOMAIN,
  withCredentials: true,
} : {};

const requestWithTipHandler = axios.create(axiosOptions);
const requestNoTipHandler = axios.create(axiosOptions);

const requestResolve = (withTip: boolean) => (res: any) => {
  // console.log('response', res.request.responseURL, res.data);
  if (res.data.code === API_CODE.SUCCESS) {
    return res.data.data;
  }
  if (withTip) {
    message.error(res?.data?.msg || '网络异常，请重试');
  }
  throw new Error(res.data);
};

requestWithTipHandler.interceptors.response.use(
  requestResolve(true),
  (error) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    Promise.reject(error)
  ,
);

requestNoTipHandler.interceptors.response.use(
  requestResolve(false),
  (error) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    Promise.reject(error)
  ,
);

export default requestWithTipHandler;
export const axiosNoMessage = requestNoTipHandler;

export const REQUEST_URL = {
  REPO: {
    LIST: 'api/repo/list',
    CREATE: '/api/repo/create',
    LIST_BRANCH: '/api/repo/list/branch',
    LIST_FILES: '/api/repo/list/files',
    READ_FILE: '/api/repo/read/file',
    SEARCH: '/api/repo/search',
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
