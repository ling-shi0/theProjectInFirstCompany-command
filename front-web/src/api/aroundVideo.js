/*
 * @Description:
 * @Version:
 * @Autor: wangXiaoMing
 * @Date: 2021-03-11 16:04:22
 * @LastEditors: caokeke
 * @LastEditTime: 2021-04-12 09:37:11
 */
import http from '@/core/httpInstance';

export const queryAroundDevice = data => {
  return http.post({ url: '/alert/queryDevice', data });
};

export const queryVideoUrl = data => {
  return http.post({ url: '/alert/queryVideoUrl', data });
};

export const queryPoliceDevice = params => {
  return http.get({ url: '/policeDevice/userDevice', params });
};
export const getArConfig = params => {
  return http.get({ url: '/config/getArConfig', params });
};
