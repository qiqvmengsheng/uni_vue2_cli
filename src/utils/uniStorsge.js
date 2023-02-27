import { storage } from "@uni/apis";
const { setStorage, getStorage, removeStorage } = storage;

const TokenKey = "sarad-china_token_key";

export function getToken() {
  return getStorage({ key: TokenKey });
}

export async function setToken(token) {
  return setStorage({ key: TokenKey, data: { value: token } });
}

export function removeToken() {
  return removeStorage({ key: TokenKey });
}

export default storage;
