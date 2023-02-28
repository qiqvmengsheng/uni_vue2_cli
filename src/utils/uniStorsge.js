import { storage } from "@uni/apis";
const { setStorage, getStorageSync, removeStorage } = storage;

const TokenKey = "sarad-china_token_key";
const nameKey = "sarad-china_name_key";

export function getToken() {
  return getStorageSync({ key: TokenKey });
}

export async function setToken(token) {
  return setStorage({ key: TokenKey, data: { value: token } });
}

export function removeToken() {
  return removeStorage({ key: TokenKey });
}

export function getName() {
  return getStorageSync({ key: nameKey });
}

export async function setName(data) {
  return setStorage({ key: nameKey, data: { value: data } });
}

export function removeName() {
  return removeStorage({ key: nameKey });
}

export default storage;
