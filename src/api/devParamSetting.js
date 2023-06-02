import qs from 'qs';
import request from '@/utils/http';

/**
 * 管理员添加或修改设备标线信息2.0
 */
export function devSettingAddmark({
  deviceid,
  id,
  po212,
  po214,
  po216,
  po218,
  time,
}) {
  console.log(qs.stringify({ deviceid, id, po212, po214, po216, po218, time }));
  return request({
    url: '/device_set/addmark',
    method: 'post',
    data: qs.stringify({ deviceid, id, po212, po214, po216, po218, time }),
  });
}

/**
 * 删除设备的某个能谱标注
 */
export function devDettingDeletemark({ id }) {
  return request({
    url: '/device_set/delete_devicemark',
    method: 'post',
    data: qs.stringify({ id }),
  });
}

/**
 * 查询设备的所有标注
 */
export function devSettingGetmark({ deviceid }, isloading = false) {
  return request({
    url: '/device_set/query_devicemark',
    method: 'post',
    data: qs.stringify({ deviceid }),
    isloading,
  });
}

/**
 * 查询一台设备的参数设置
 */
export function devSettingGetOffset({ deviceid }) {
  return request({
    url: '/device_set/query_deviceset',
    method: 'post',
    data: qs.stringify({ deviceid }),
  });
}

/**
 * 添加或修改设备的参数设置（以设备号为主键来判断添加或修改）
 */
export function devSettingSetOffset({
  deviceid,
  radonefficiency,
  radonfastefficiency,
  ratiopo212Bi212,
  tail212214,
  tail212216,
  tail214216,
  tail216218,
  thoronefficiency,
}) {
  return request({
    url: '/device_set/set_deviceset',
    method: 'post',
    data: qs.stringify({
      deviceid,
      radonefficiency,
      radonfastefficiency,
      ratiopo212Bi212,
      tail212214,
      tail212216,
      tail214216,
      tail216218,
      thoronefficiency,
    }),
  });
}
