import request from '@/utils/http';
import qs from 'qs';

/**
 * 查询设备历史数据
 * @param {Object} data
 */
export function datapoints({ deviceId, apikey, params }) {
  return request({
    url: `/devices/${deviceId}/datapoints`,
    method: 'get',
    params,
    headers: { 'api-key': apikey },
    requestBase: 'VUE_APP_URL_THREE',
  });
}

/**
 * 批量查询设备最新数据
 * @param {Object} data
 */
export function devsdatapoints({ devIds, auth }) {
  return request({
    url: '/devices/datapoints',
    method: 'get',
    params: { devIds },
    headers: { Authorization: auth },
    requestBase: 'VUE_APP_URL_THREE',
  });
}

/**
 * 批量查询数据流信息和最新数据点
 * @param {Object} data
 */
export function DataStreams({ deviceId, apikey, params }) {
  return request({
    url: `/devices/${deviceId}/datastreams`,
    method: 'get',
    params,
    headers: { 'api-key': apikey },
    requestBase: 'VUE_APP_URL_THREE',
  });
}

/**
 * 下发命令
 * @param {Object} data
 */
export function onenetcmds({ deviceid, apikey, sms }) {
  return request({
    url: '/cmds',
    method: 'POST',
    params: { device_id: deviceid, qos: 1 },
    data: sms,
    headers: { 'api-key': apikey },
    requestBase: 'VUE_APP_URL_THREE',
  });
}
