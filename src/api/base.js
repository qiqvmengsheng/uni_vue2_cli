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
  })
 }