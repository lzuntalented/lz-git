export const API_CODE = {
  SUCCESS: 200,
  ERROR: 400,
};

export const isDev = process.env.NODE_ENV === 'development';
export const isProd = process.env.NODE_ENV === 'production';

export const API_DOMAIN = isDev ? 'http://localhost:3000' : '';

export const LOGO = 'http://git.lzz.show/sxm-log.svg';
