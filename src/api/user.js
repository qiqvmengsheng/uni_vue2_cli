import request from "@/utils/http";
import qs from "qs";

/**
 * 登录方法
 */
export function login(data) {
  return request({
    url: "/wxlogin/app_login",
    method: "post",
    data: qs.stringify(data),
  });
}

/**
 * 微信登录
 */
export function wxlogin() {
  return new Promise(async (resolve, reject) => {
    uni.login({
      provider: "weixin",
      success: (res) => {
        resolve(res);
      },
    });
  });
}

/**
 * 微信获取用户信息
 */
export function wxgetUserInfo() {
  return new Promise(async (resolve, reject) => {
    // 获取用户信息
    uni.getUserInfo({
      provider: "weixin",
      success: function (infoRes) {
        resolve(infoRes);
        //   console.log('用户昵称为：' + infoRes.userInfo.nickName);
      },
    });
  });
}
