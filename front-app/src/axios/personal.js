/*
 * @Description:
 * @Version:
 * @Autor: wangXiaoMing
 * @Date: 2021-08-02 11:40:38
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-08-02 14:01:56
 */
import http from '../config/http';
export default {
  getPersonalInfo(data) {
    return http({
      method: 'get',
      url: '/avc-app/service/rs/v1/api/alert/userInfo',
      params: data
    });
  }
};
