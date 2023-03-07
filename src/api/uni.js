/**
 * 获取网络状态
 */
export function getNetworkType() {
  return new Promise((resolve, reject) => {
    uni.getNetworkType({
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
