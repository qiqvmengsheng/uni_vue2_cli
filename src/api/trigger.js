import request from '@/utils/http';
import qs from 'qs';

/**
 * 根据触发器id来删除触发器
 * @param {Object} data
 */
export function deletetrigger(data) {
  return request({
    url: '/trigger/delete',
    method: 'post',
    data: qs.stringify(data),
  });
}

/**
 * 添加触发器(若数据库里没有用户的电子邮箱，则返回errno 1)
 * @param {Object} data
 */
export function addtrigger(data) {
  return request({
    url: '/trigger/add',
    method: 'post',
    data: qs.stringify(data),
  });
}

/**
 * 查询该设备的所有触发器
 * @param {Object} data
 */
export function querytrigger(data) {
  return request({
    url: '/trigger/querytrigger',
    method: 'post',
    data: qs.stringify(data),
  });
}
