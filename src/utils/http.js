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

request.interceptors.request.use(async (config) => {
  // 带上token
  const token = getToken();
  if (token.length >= 1) {
    Object.assign(config.headers, { Authorization: token });
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
