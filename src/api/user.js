import request from '@/utils/http';
import qs from 'qs';

/**
 * 登录获取token
 */
export function login(data) {
  return request({
    url: '/wxlogin/app_login',
    method: 'post',
    data: qs.stringify(data),
  });
}

/**
 * 微信自动登录获取code
 */
export function wxlogin() {
  return new Promise((resolve, reject) => {
    uni.login({
      provider: 'weixin',
      success: (res) => {
        resolve(res);
      },
      fail(err) {
        reject(err);
      },
    });
  });
}

/**
 * 微信获取用户信息
 */
export function wxgetUserInfo() {
  return new Promise((resolve, reject) => {
    // 获取用户信息
    uni.getUserInfo({
      provider: 'weixin',
      success(infoRes) {
        resolve(infoRes);
        //   console.log('用户昵称为：' + infoRes.userInfo.nickName);
      },
      fail(err) {
        reject(err);
      },
    });
  });
}

/**
 * 微信获取用户信息
 */
export function wxgetUserProfile() {
  return new Promise((resolve, reject) => {
    // 获取用户信息
    uni.getUserProfile({
      desc: '注册绑定手机',
      success(infoRes) {
        resolve(infoRes);
        //   console.log('用户昵称为：' + infoRes.userInfo.nickName);
      },
      fail(err) {
        reject(err);
      },
    });
  });
}

/**
 * 获取用户数据
 * @returns
 */
export function getPnumber({ code }) {
  return request({
    url: '/wxlogin/get_pnumber',
    method: 'post',
    data: qs.stringify({ code }),
  });
}

/**
 * 获取用户数据
 * @returns
 */
export function getdata() {
  return request({
    url: '/base/getdata',
    method: 'post',
    // headers: { token: getToken() },
  });
}

/**
 * 注销用户
 */
export function deleteuser() {
  return request({
    url: '/base/deleteuser',
    method: 'post',
  });
}

/**
 * /register/register1 注册接口
 */
export function register(data) {
  return request({
    url: '/register/register1',
    method: 'post',
    data: qs.stringify(data),
  });
}

/**
 * /register/complete_information 微信扫码注册的新用户补全信息接口
 * @param {*} param0
 * @returns
 */
export function completeInformation({ phonenumber, username, password, code }) {
  return request({
    url: '/register/complete_information',
    method: 'post',
    data: qs.stringify({ phonenumber, username, password, code }),
  });
}

/**
 * 获取手机验证码/register/Sendsms
 */
export function sendsms(data) {
  return request({
    url: '/register/Sendsms',
    method: 'post',
    data: qs.stringify(data),
  });
}

/**
 * /register/finduderinfo 查找用户信息
 */
export function finduderinfo() {
  return request({
    url: '/register/finduderinfo',
    method: 'post',
  });
}

/**
 * /register/updateuserinfo 更新或添加用户信息
 */
export function updateuserinfo(data) {
  return request({
    url: '/register/updateuserinfo',
    method: 'post',
    data: qs.stringify(data),
  });
}

/**
 * /register/queryrepeat 查询用户名是否重复
 */
export function queryrepeat(data) {
  return request({
    url: '/register/queryrepeat',
    method: 'post',
    data: qs.stringify(data),
  });
}
