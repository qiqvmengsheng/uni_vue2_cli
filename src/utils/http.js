import axios from 'axios';
import uniadapter from 'axios-adapter-uniapp';
import { getToken } from './uniStorsge';
/**
 *
 */
const request = axios.create({
  baseURL: 'http://localhost/user',
  // baseURL: 'https://lele-tech.com/user',
  timeout: 10000,
  adapter: uniadapter,
});

const pendingMap = new Map();

// 直接使用JSON.parse去转译，并把转译结果判断一下是不是object类型，如果是的话就返回true,否则就返回false,这样就排除了转化后非object的类型，比如"123456789"
function isJSON(str) {
  try {
    if (typeof JSON.parse(str) === 'object') {
      return true;
    }
  } catch (e) {
    return false;
  }
  return false;
}

/**
 * 生成每个请求唯一的键
 * @param {*} config
 * @returns string
 */
function getPendingKey(config) {
  const { url, method, params } = config;
  let { data } = config;
  if (isJSON(data)) data = JSON.parse(data); // response里面返回的config.data是个字符串对象
  return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&');
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
  // 取消重复请求
  removePending(config);
  addPending(config);
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
