import axios from 'axios';
import { UniAdapter } from 'uniapp-axios-adapter';
import { getToken } from './uniStorsge';
/**
 *
 */
const request = axios.create({
  baseURL: 'http://localhost/user',
  // baseURL: 'https://lele-tech.com/user',
  timeout: 10000,
  adapter: UniAdapter,
});

const pendingMap = new Map();

/**
 * 生成每个请求唯一的键
 * @param {*} config
 * @returns string
 */
function getPendingKey(config) {
  const { url, method, params, data } = config;
  let obj;
  if (typeof data === 'string') obj = JSON.parse(data); // response里面返回的config.data是个字符串对象
  return [url, method, JSON.stringify(params), JSON.stringify(obj)].join('&');
}

/**
 * 储存每个请求唯一值, 也就是cancel()方法, 用于取消请求
 * @param {*} config
 */
function addPending(config) {
  const pendingKey = getPendingKey(config);
  config.cancelToken =
    config.cancelToken ||
    new axios.CancelToken((cancel) => {
      if (!pendingMap.has(pendingKey)) {
        pendingMap.set(pendingKey, cancel);
      }
    });
}

function removePending(config) {
  const pendingKey = getPendingKey(config);
  if (pendingMap.has(pendingKey)) {
    const cancelToken = pendingMap.get(pendingKey);
    cancelToken(pendingKey);
    pendingMap.delete(pendingKey);
  }
}

request.interceptors.request.use(async (config) => {
  // 带上token
  const token = getToken();
  if (token.length >= 1) {
    Object.assign(config.headers, { token });
    // config.headers['Authorization'] = token;
  }
  return config;
});

request.interceptors.response.use(
  (response) => {
    // loadingInstance.close();
    const res = response.data;
    if (res.code && res.code !== 200) {
      console.log(res);
    }
    return response;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);
// (response) => {
//   // 统一处理响应,返回Promise以便链式调用
//   if (response.status === 200) {
//     const { data } = response;
//     if (data && data.code === 200) {
//       return Promise.resolve(data);
//     }
//     return Promise.reject(data);
//   }
//   return Promise.reject(response);
// }
export default request;
