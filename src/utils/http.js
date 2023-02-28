import axios from "axios";
import to from "await-to-js";
import { UniAdapter } from "uniapp-axios-adapter";
import store from "@/store";
import { getToken } from "./uniStorsge";
/**
 *
 */
const request = axios.create({
  baseURL: "http://localhost/user",
  // baseURL: "https://www.lele-tech.com:8080/",
  timeout: 10000,
  adapter: UniAdapter,
});

request.interceptors.request.use(async (config) => {
  //带上token
  if (store.getters.token) {
    config.headers["Authorization"] = getToken();
  }
  return config;
});

request.interceptors.response.use((response) => {
  // 统一处理响应,返回Promise以便链式调用
  if (response.status === 200) {
    const { data } = response;
    if (data && data.code === 200) {
      return Promise.resolve(data);
    } else {
      return Promise.reject(data);
    }
  } else {
    return Promise.reject(response);
  }
});

export default request;
