/*
 * @Description:
 * @Version:
 * @Autor: wangXiaoMing
 * @Date: 2021-03-31 09:49:34
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-03-31 10:12:24
 */
import http from '@/core/httpInstance';

export const getAlertDetail = params => {
  return http.get({ url: '/alert/getAlertInfoById', params });
};

// export const modDeptReceiveAlertAuth = data => {
//   return http.post({ url: '/deptConfig/modDeptReceiveAlertAuth', data });
// };
