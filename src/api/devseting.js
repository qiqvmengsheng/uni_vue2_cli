import request from '@/utils/http';
import qs from 'qs';

/**
 * 设备初始参数获取
 */
export function getInit({ deviceId }) {
  return request({
    url: '/command/get_init',
    method: 'post',
    data: qs.stringify({ deviceId }),
  });
}

/**
 * 设备设置参数获取
 */
export function getSeting({ deviceId }) {
  return request({
    url: '/command/get_seting',
    method: 'post',
    data: qs.stringify({ deviceId }),
  });
}

/**
 * get_status设备状态查询
 */
export function getStatus({ deviceId }) {
  return request({
    url: '/command/get_status',
    method: 'post',
    data: qs.stringify({ deviceId }),
  });
}

/**
 * 设备init期望设置
 */
export function initDesiredSet({
  deviceId,
  offset,
  rbi212po212,
  rnsenfast,
  rnsenslow,
  roipo210,
  roipo212,
  roipo214,
  roipo216,
  roipo218,
  sn,
  tailpo212po214,
  tailpo212po216,
  tailpo214po216,
  tailpo216po218,
  thsen,
}) {
  return request({
    url: '/command/init_desired_set',
    method: 'post',
    data: qs.stringify({
      deviceId,
      offset,
      rbi212po212,
      rnsenfast,
      rnsenslow,
      roipo210,
      roipo212,
      roipo214,
      roipo216,
      roipo218,
      sn,
      tailpo212po214,
      tailpo212po216,
      tailpo214po216,
      tailpo216po218,
      thsen,
    }),
  });
}

/**
 * 设备initparams属性设置
 */
export function initparamsPropertySet({
  deviceId,
  offset,
  rbi212po212,
  rnsenfast,
  rnsenslow,
  roipo210,
  roipo212,
  roipo214,
  roipo216,
  roipo218,
  sn,
  tailpo212po214,
  tailpo212po216,
  tailpo214po216,
  tailpo216po218,
  thsen,
}) {
  return request({
    url: '/command/initparams_property_set',
    method: 'post',
    data: qs.stringify({
      deviceId,
      offset,
      rbi212po212,
      rnsenfast,
      rnsenslow,
      roipo210,
      roipo212,
      roipo214,
      roipo216,
      roipo218,
      sn,
      tailpo212po214,
      tailpo212po216,
      tailpo214po216,
      tailpo216po218,
      thsen,
    }),
  });
}

/**
 * 设备setting期望设置
 */
export function settingDesiredSet({
  alarm,
  buzzer,
  deviceId,
  intervall,
  pumpmode,
  rnmode,
  unit,
}) {
  return request({
    url: '/command/get_status',
    method: 'post',
    data: qs.stringify({
      alarm,
      buzzer,
      deviceId,
      intervall,
      pumpmode,
      rnmode,
      unit,
    }),
  });
}

/**
 * /command/setting_property_set 设备setting属性设置
 */
export function settingPropertySet({
  alarm,
  buzzer,
  deviceId,
  intervall,
  pumpmode,
  rnmode,
  unit,
}) {
  return request({
    url: '/command/setting_property_set',
    method: 'post',
    data: qs.stringify({
      alarm,
      buzzer,
      deviceId,
      intervall,
      pumpmode,
      rnmode,
      unit,
    }),
  });
}

/**
 * 设备启停
 */
export function startstop({ deviceId, startStop }) {
  return request({
    url: '/command/start_stop',
    method: 'post',
    data: qs.stringify({ deviceId, startStop }),
  });
}
