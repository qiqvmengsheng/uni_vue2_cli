import request from '@/utils/http';

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
 * 批量查询数据流信息
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
