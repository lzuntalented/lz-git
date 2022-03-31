import axios, { REQUEST_URL } from '.';

const { HOOKS, INSTALL } = REQUEST_URL;

export async function getList() {
  const ret = await axios.get(HOOKS.CREATE);
  return ret;
}
export async function init(params: {
    rootPath: string
}) {
  const ret = await axios.post(INSTALL.INIT, params);
  return ret;
}
