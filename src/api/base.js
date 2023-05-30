import request from '@/utils/http';
import qs from 'qs';

/**
 *  此方法用来关联用户和设备
 * @param {Object} data
 */
export function associate(data) {
  return request({
    url: '/base/associate',
    method: 'post',
    data: qs.stringify(data),
  });
}

/**
 * 此方法用于用户取消与指定设备的关联
 * @param {Object} data
 */
export function disassociate(data) {
  return request({
    url: '/base/disassociate',
    method: 'post',
    data: qs.stringify(data),
  });
}

/**
 * 此方法是用来查询用户的角色及其权限
 * @param {Object} data
 */
export function findrole(data) {
  return request({
    url: '/base/findrole',
    method: 'post',
    data: qs.stringify(data),
  });
}

/**
 * 此方法是用来设置终端管理员给终端设备使用者的权限
 * @param {Object} data
 */
export function addpermission(data) {
  return request({
    url: '/base/addpermission',
    method: 'post',
    data: qs.stringify(data),
  });
}

/**
 * 用户更改设备昵称
 * @param {Object} data
 */
export function modifyabbreviation(data) {
  return request({
    url: '/base/modifyabbreviation',
    method: 'post',
    data: qs.stringify(data),
  });
}
/**
 * 获取用户信息
 * @param {Object} data
 */
export function getuserinfo(data) {
  return request({
    url: '/register/finduderinfo',
    method: 'post',
    data: qs.stringify(data),
  });
}
/**
 * 绑定或换绑手机
 * @param {Object} data
 */
export function bondPhone(data) {
  return request({
    url: '/base/bond_phone',
    method: 'post',
    data: qs.stringify(data),
  });
}
/**
 * 验证输入的手机号及验证码是否正确，并且返回1小时有效期的凭证码
 * @param {Object} data
 */
export function vertifyCode(data) {
  return request({
    url: '/base/vertify_code',
    method: 'post',
    data: qs.stringify(data),
  });
}
/**
 * 获取该发送给该用户的系统消息
 * @param {object} data
 */
export function getNotice(data) {
  return request({
    url: '/notify/get_user_notify',
    method: 'post',
    data: qs.stringify(data),
  });
}
