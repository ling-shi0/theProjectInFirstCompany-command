/*
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-04-25 16:40:43
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2022-03-31 10:56:32
 */
import dealAlarmActive from '@/src/assets/icons/dealAlarmActive.png'
import dealAlarmNormal from '@/src/assets/icons/dealAlarmNormal.png'
import alarmNormal from '@/src/assets/icons/alarmNormal.png'
import alarmActive from '@/src/assets/icons/alarmActive.png'
import myselfActive from '@/src/assets/icons/myselfActive.png'
import myselfNormal from '@/src/assets/icons/myselfNormal.png'

export default {
  // SHEIGHT: screen.height,
  // SWIDTH: screen.width,
  STATUS_BAR_HEIGHT: 0,
  BOTTOM_SAFE_AREA_HEIGHT: 10,
  // SERVER: 'https://.com/'
  SERVER: 'https://10.19.141.119',
  tabbarList: [{
    name: '警情处置',
    activeIcon: dealAlarmActive,
    normalIcon: dealAlarmNormal,
    router: 'disposeList' // 这里写的是router的name
  }, {
    name: '布控告警',
    activeIcon: alarmActive,
    normalIcon: alarmNormal,
    router: 'alertControl'
  }, {
    name: '我的',
    activeIcon: myselfActive,
    normalIcon: myselfNormal,
    router: 'personal'
  }]
}
