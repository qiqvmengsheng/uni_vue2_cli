import axios from 'axios';
import UniAdapter from 'axios-adapter-uniapp';
import to from 'await-to-js';
import { toast, loading } from '@uni/apis';
import { getToken } from './uniStorsge';

let baseURL;
let loadingNum = 0;

// 环境的切换
if (process.env.NODE_ENV === 'development') {
  // baseURL = process.env.VUE_APP_URL_TWO;
  baseURL = process.env.VUE_APP_BASE_URL;
} else if (process.env.NODE_ENV === 'production') {
  baseURL = process.env.VUE_APP_BASE_URL;
} else {
  baseURL = process.env.VUE_APP_URL_THREE;
}

/**
 * 创建axios实例
 */
const request = axios.create({
  // baseURL: 'http://192.168.3.44:8080',
  // baseURL: 'http://localhost/user',
  baseURL,
  timeout: 30000,
  adapter: UniAdapter,
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

/**
 * 取消重复请求
 */
function removePending(config) {
  const pendingKey = getPendingKey(config);
  if (pendingMap.has(pendingKey)) {
    const cancelToken = pendingMap.get(pendingKey);
    cancelToken(pendingKey);
    pendingMap.delete(pendingKey);
  }
}

/**
 * 处理异常
 */
async function httpErrorStatusHandle(error) {
  // 处理被取消的请求
  if (axios.isCancel(error))
    return console.error(`请求的重复请求：${error.message}`);
  let message = '';
  if (error && error.response) {
    switch (error.response.status) {
      case 302:
        message = '接口重定向了！';
        break;
      case 400:
        message = '参数不正确！';
        break;
      case 401:
        message = '您未登录，或者登录已经超时，请先登录！';
        break;
      case 403:
        message = '您没有权限操作！';
        break;
      case 404:
        message = '请求地址404';
        // message = `请求地址出错: ${error.response.config.url}`;
        break; // 在正确域名下
      case 408:
        message = '请求超时！';
        break;
      case 409:
        message = '系统已存在相同数据！';
        break;
      case 500:
        message = '服务器内部错误！';
        break;
      case 501:
        message = '服务未实现！';
        break;
      case 502:
        message = '网关错误！';
        break;
      case 503:
        message = '服务不可用！';
        break;
      case 504:
        message = '服务暂时无法访问，请稍后再试！';
        break;
      case 505:
        message = 'HTTP版本不受支持！';
        break;
      default:
        message = '异常问题，请联系管理员！';
        break;
    }
  }
  //  else {
  //   message = error.response.data.message;
  // }
  const [err, res] = await to(uni.getNetworkType());
  console.log('错误', err, '成功', res);
  if (error.message.includes('timeout')) message = '网络请求超时！';
  if (error.message.includes('Network'))
    message = res.networkType === 'none' ? '服务端异常！' : '您断网了！';

  return toast.showToast({ content: message, type: 'fail', mask: true });
}

request.interceptors.request.use(async (config) => {
  // 取消重复请求
  removePending(config);
  addPending(config);
  // console.log('开始加载', config.isloading, config.isloading === undefined);
  if (config.isloading === undefined) loadingNum += 1;
  if (loadingNum >= 1) loading.showLoading({ mask: true });
  // 修改baseURL
  if (config.requestBase === 'VUE_APP_URL_THREE') {
    config.baseURL = process.env.VUE_APP_URL_THREE;
    return config;
  }
  // 带上token
  const token = getToken();
  if (typeof token === 'string' && token.length >= 1) {
    Object.assign(config.headers, { token });
    // config.headers['Authorization'] = token;
  }
  return config;
});

request.interceptors.response.use(
  async (response) => {
    if (response.config.isloading === undefined) loadingNum -= 1;
    if (loadingNum === 0) loading.hideLoading();
    // 判断是否断网了
    if (response.data === undefined) {
      console.log('成功的返回拦截', response);
      const [err, r] = await to(uni.getNetworkType());
      console.log(err, r);
      // uni.onNetworkStatusChange((res) => {
      //   console.log(res.isConnected);
      //   console.log(res.networkType);
      // });
      if (r.networkType === 'none') {
        toast.showToast({ content: '网络异常', type: 'fail', mask: true });
      } else {
        toast.showToast({ content: '服务器错误', type: 'fail', mask: true });
      }
      return Promise.reject(response);
    }
    const { data } = response;
    if (data.code && data.code !== 200) {
      console.log(data);
    }
    return response;
  },
  (error) => {
    if (error.config.isloading === undefined) loadingNum -= 1;
    if (loadingNum === 0) loading.hideLoading();
    console.log('失败的返回拦截');
    console.log('http162', error);
    httpErrorStatusHandle(error);
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
