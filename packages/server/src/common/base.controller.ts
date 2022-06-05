import { API_CODE } from './constants';

export class BaseController {
  success(data: any) {
    return {
      code: API_CODE.SUCCESS,
      data,
    };
  }
  fail(msg = '参数错误') {
    return {
      code: API_CODE.ERROR,
      msg,
    };
  }
}
