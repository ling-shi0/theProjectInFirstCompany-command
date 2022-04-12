/*
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-04-25 16:40:44
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-08-12 19:37:36
 */
import http from '../config/http'

const str = 'avc-app/service/rs/v1/api/alert/'

export default {
  getListData(data) {
    return http({
      method: 'post',
      url: str + 'queryAlertInfo',
      data: data
    })
  },
  signById(data) {
    return http({
      method: 'get',
      url: str + 'signAlert',
      params: data
    })
  },
  getHmapServerAddress() {
    return http({
      method: 'get',
      url: str + 'getHmapConfig'
    })
  },
  getGaodeMapServer() {
    return http({
      method: 'get',
      url: str + 'getGaoDeConfig'
    })
  },
  getInitConfig() {
    return http({
      method: 'get',
      url: str + 'queryMapType'
    })
  },
  saveFeedback(data) {
    return http({
      method: 'post',
      url: str + 'feedbackAlert',
      data: data
    })
  },
  getPolicePhone(userId) {
    return http({
      method: 'get',
      url: str + 'queryPoliceDeptPhone?userId=' + userId
    })
  },
  arriveAtAlarmPosition(data) {
    return http({
      method: 'post',
      url: str + 'arriveAlert',
      data: data
    })
  },
  getVideoPreview(data) {
    return http({
      method: 'post',
      url: str + 'videoPreview',
      data: data
    })
  },
  uploadPosition(data) {
    return http({
      method: 'post',
      url: '/avc-app/service/rs/v1/api/gps/realTimePos',
      data
    })
  },
  closeAlert(params) {
    return http({
      method: 'get',
      url: str + 'closeAlert',
      params
    })
  }
}
