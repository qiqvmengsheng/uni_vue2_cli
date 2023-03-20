import request from '@/utils/http';
import qs from 'qs';

/**
 * 获取数据
 * @param {Object} data
 */
export function measuredGetdata(data) {
  return request({
    url: '/measured_data/getdata',
    method: 'post',
    data: qs.stringify(data),
  });
}

/**
 * 按量获取数据
 * @param {Object} data
 */
export function getlastDatas(data) {
  return request({
    url: '/measured_data/getlastDatas',
    method: 'post',
    data: qs.stringify(data),
  });
}

/**
 * 设置定时存储数据的周期
 * @param {Object} data
 */
export function setCycle(data) {
  return request({
    url: '/measured_data/set_cycle',
    method: 'post',
    data: qs.stringify(data),
  });
}
