import request from '@/utils/http';
import qs from 'qs';

/**
 * 按时间获取数据
 * @param {Object} data
 */
export function measuredGetdata({
  endtime,
  starttime,
  deviceid,
  datastreamid,
}) {
  return request({
    url: '/measured_data/getdata',
    method: 'post',
    data: qs.stringify({
      end_time: endtime,
      start_time: starttime,
      deviceid,
      datastreamid,
    }),
  });
}

/**
 * 按量获取最新数据
 * @param {Object} data
 */
export function getlastDatas({ deviceid, datastreamid, numbers, isloading }) {
  return request({
    url: '/measured_data/getlastDatas',
    method: 'post',
    data: qs.stringify({ deviceid, datastreamid, numbers }),
    isloading,
  });
}

/**
 * 设置定时存储数据的周期
 * @param {Object} data
 */
export function setCycle({ time }) {
  return request({
    url: '/measured_data/set_cycle',
    method: 'post',
    data: qs.stringify({ time }),
  });
}
