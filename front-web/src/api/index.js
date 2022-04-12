/*
 * @Description:
 * @Version: 2.0
 * @Autor: caokeke
 * @Date: 2021-02-21 10:55:50
 * @LastEditors: caokeke
 * @LastEditTime: 2021-03-02 10:25:21
 */
import http from '@/core/httpInstance';

function getUserInfo() {
  return http.get({
    url: '/getUserInfo',
    // successNotify: true,
    errorTitle: 'hello.title'
  });
}
function getTest() {
  return http.get({
    url: '/test/successTest',
    // successNotify: true,
    errorTitle: 'hello.title'
  });
}
// 获取初始化配置接口
function getInitConfig() {
  return http.get({
    url: '/config/getInitConfig',
    // successNotify: true,
    errorTitle: 'hello.title'
  });
}
// 地图初始化配置接口
function getHmapServerAddress() {
  return http.get({ url: '/config/getHmapServerAddress' });
}
export { getUserInfo, getTest, getInitConfig, getHmapServerAddress };
