/*
 * @Description:
 * @Version: 2.0
 * @Autor: caokeke
 * @Date: 2021-02-21 10:55:50
 * @LastEditors: caokeke
 * @LastEditTime: 2021-04-07 17:18:32
 */

export default [
  {
    path: '/',
    redirect: '/alarm-command'
  },
  {
    name: 'error',
    path: '/error/:type',
    component: 'Error'
  },
  {
    name: 'map',
    path: '/alarm-command',
    component: 'AlarmCommand'
  },
  {
    name: 'peopleTrack',
    path: '/alarm/track',
    component: 'PeopleTrack/index'
  },
  {
    name:'/alarm/componentsTest',
    path:'/alarm/componentsTest',
    component:'mapTest/index'
  },
  {
    name: 'ARplayer',
    path: '/alarm/ar',
    component: 'ARplayer/index'
  },
  {
    name: 'PoliceConfig',
    path: '/config/police',
    component: 'configPages/PoliceConfig'
  },
  {
    name: 'PlaceLabelConfig',
    path: '/config/place',
    component: 'configPages/PlaceLabelConfig'
  },
  {
    name: 'alertManage',
    path: '/alertManage',
    component: 'alertManage/alertManage'
  },
  {
    name: 'areaManage',
    path: '/config/areaManage',
    component: 'AreaManage'
  },
  {
    name: 'alertManageDetail',
    path: '/alertManage/detail/:id',
    component: 'alertManage/alertManageDetail'
  }
];
