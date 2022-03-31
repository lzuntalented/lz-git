import axios, { REQUEST_URL } from '.';

const { HOOKS } = REQUEST_URL;

export async function getList() {
  const ret = await axios.get(HOOKS.CREATE);
  return ret;
}

export async function create(params: {
    user: string
    name: string
    url: string
    method: number
    eventType: number
}) {
  const ret = await axios.post(HOOKS.CREATE, params);
  return ret;
}
