import axios, { REQUEST_URL } from '.';

const { USER } = REQUEST_URL;

export async function login(params: {
  account: string,
  password: string
}) {
  const ret = await axios.post(USER.LOGIN, params);
  return ret;
}

export async function register(params: {
    account: string,
    email: string
    password: string
}) {
  const ret = await axios.post(USER.REGISTER, params);
  return ret;
}

export async function info(): Promise<any> {
  const ret = await axios.get(USER.INFO);
  return ret;
}

export async function logout(): Promise<any> {
  const ret = await axios.get(USER.LOGOUT);
  return ret;
}
