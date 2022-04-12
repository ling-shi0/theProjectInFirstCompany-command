/*
 * @Description:
 * @Version:
 * @Autor: wangXiaoMing
 * @Date: 2021-02-23 15:25:41
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-05-13 11:21:05
 */
import arClick from '@/assets/images/map/arClick.png';
import arHover from '@/assets/images/map/arHover.png'
import arNormal from '@/assets/images/map/arNormal.png'
import czHover from '@/assets/images/map/czHover.png'
import czNormal from '@/assets/images/map/czNormal.png'
import dbHover from '@/assets/images/map/dbHover.png'
import dbNormal from '@/assets/images/map/dbNormal.png'
import djjHover from '@/assets/images/map/djjHover.png'
import djjNormal from '@/assets/images/map/djjNormal.png'
import gtClick from '@/assets/images/map/gtClick.png'
import gtNormal from '@/assets/images/map/gtNormal.png'
import gtHover from '@/assets/images/map/gtHover.png'
import jwtHover from '@/assets/images/map/jwtHover.png'
import jwtNormal from '@/assets/images/map/jwtNormal.png'
import ktvHover from '@/assets/images/map/ktvHover.png'
import ktvNormal from '@/assets/images/map/ktvNormal.png'
import wbHover from '@/assets/images/map/wbHover.png'
import wbNormal from '@/assets/images/map/wbNormal.png'
import xqHover from '@/assets/images/map/xqHover.png'
import xqNormal from '@/assets/images/map/xqNormal.png'
import zdqy from '@/assets/images/map/zdqy.png'
import videoClick from '@/assets/images/map/videoClick.png'
import videoHover from '@/assets/images/map/videoHover.png'
import videoNormal from '@/assets/images/map/videoNormal.png'
import phonePosition from '@/assets/images/map/phonePosition.png'
import scencePosition from '@/assets/images/map/scencePosition.png'
import mapStorePosition from '@/assets/images/map/mapStorePosition.png'
import artificialPosition from '@/assets/images/map/artificialPosition.png'
import AlarmPositionPane from '@/components/alarm-command/mapPopWindow/AlarmPositionPane.vue'
import PolicePersonWindow from '@/components/alarm-command/mapPopWindow/PolicePersonWindow.vue'
import arPointNormal from '@/assets/images/alarmCommand/arPoint.png';
import arPointActive from '@/assets/images/alarmCommand/arPointActive.png';
import cameraNormal from '@/assets/images/alarmCommand/cameraNormal.png'
import cameraActive from '@/assets/images/alarmCommand/cameraActive.png';
import noteActive from '@/assets/images/alarmCommand/noteActive.png'
import noteNormal from '@/assets/images/alarmCommand/noteNormal.png'
import SearchPositionWindow from '@/components/alarm-command/mapPopWindow/SearchPositionWindow.vue'
import arTogether from '@/assets/images/map/arTogether.png'
import videoTogether from '@/assets/images/map/videoTogether.png'
import alarmPosition from '@/assets/images/map/alarmPosition.png'
import SentryPopPane from '@/components/alarm-command/mapPopWindow/SentryPopPane.vue'
import alarmCenterPosition from '@/components/alarm-command/mapPopWindow/AlarmCenterPosition.vue'

const alarmTypes = [
  {
    name: '全部警情类别',
    value: ''
  },
  {
    name: '刑事',
    value: '刑事'
  },
  {
    name: '治安',
    value: '治安'
  },
  {
    name: '交通',
    value: '交通'
  },
  {
    name: '火灾事故',
    value: '火灾事故'
  },
  {
    name: '群众求助',
    value: '群众求助'
  },
  {
    name: '举报投诉',
    value: '举报投诉'
  },
  {
    name: '事件',
    value: '事件'
  },
  {
    name: '纠纷',
    value: '纠纷'
  },
  {
    name: '应急联动事件',
    value: '应急联动事件'
  },
  {
    name: '固定点报警',
    value: '固定点报警'
  },
  {
    name: '其它警情',
    value: '其它警情'
  },
  {
    name: '无效',
    value: '无效'
  }
];

const dealSteps = [
  {
    name: '全部处理阶段',
    value: ''
  },
  {
    name: '接警',
    value: '接警'
  },
  {
    name: '分派',
    value: '分派'
  },
  {
    name: "签收",
    value: "签收"
  }, {
    name: '到达',
    value: '到达'
  }, {
    name: '反馈',
    value: '反馈'
  }, {
    name: '完结',
    value: '完结'
  }
];

const tabOptions = [
  {
    label: '全部警情',
    value: 0
  },
  {
    label: '处置中',
    value: 1
  },
  {
    label: '关注',
    value: 2
  }
]

const dealStepsObj = {
  '接警': -1,
  '分派': 0,
  "签收": 1,
  '到达': 2,
  '反馈': 3,
  '完结': 4
};

const distanceOptions = [
  {
    value: '50',
    label: '50m'
  },
  {
    value: '100',
    label: '100m'
  },
  {
    value: '300',
    label: '300m'
  },
  {
    value: '500',
    label: '500m'
  }
]

const iconMap = {
  'manualConfineCenter': {
    normal: artificialPosition,
    hover: artificialPosition,
    active: artificialPosition,
    components: SearchPositionWindow
  },
  'alarmCenterPosition': {
    normal: alarmPosition,
    hover: alarmPosition,
    active: alarmPosition,
    components: alarmCenterPosition
  },
  'searchPosition': {
    normal: mapStorePosition,
    hover: mapStorePosition,
    active: mapStorePosition,
    components: SearchPositionWindow
  },
  'searchPolice': {
    normal: dbNormal,
    hover: dbHover,
    active: dbHover,
    components: PolicePersonWindow
  },
  'searchPoint': {
    normal: videoNormal,
    hover: videoHover,
    active: videoClick,
    components: SearchPositionWindow
  },
  'searchARPoint': {
    normal: arNormal,
    hover: arHover,
    active: arClick,
    components: SearchPositionWindow
  },
  'phonePosition': {
    normal: phonePosition,
    hover: phonePosition,
    active: phonePosition,
    components: AlarmPositionPane
  },
  'scencePosition': {
    normal: scencePosition,
    hover: scencePosition,
    active: scencePosition,
    components: AlarmPositionPane
  },
  'mapStorePosition': {
    normal: mapStorePosition,
    hover: mapStorePosition,
    active: mapStorePosition,
    components: AlarmPositionPane
  },
  'artificialPosition': {
    normal: artificialPosition,
    hover: artificialPosition,
    active: artificialPosition,
    components: AlarmPositionPane
  },
  'gt': {
    normal: gtNormal,
    hover: gtHover,
    active: gtClick,
    components: SentryPopPane
  },
  'db': {
    normal: dbNormal,
    hover: dbHover,
    active: dbHover,
    components: PolicePersonWindow
  },
  'jwt': {
    normal: jwtNormal,
    hover: jwtHover,
    active: jwtHover,
    components: PolicePersonWindow
  },
  'djj': {
    normal: djjNormal,
    hover: djjHover,
    active: djjHover,
    components: PolicePersonWindow
  },
  'cz': {
    normal: czNormal,
    hover: czHover,
    active: czHover,
    components: PolicePersonWindow
  },
  'spdw': {
    normal: videoNormal,
    hover: videoHover,
    active: videoClick,
    components: SearchPositionWindow
  },
  'argd': {
    normal: arNormal,
    hover: arHover,
    active: arClick,
    components: SearchPositionWindow
  },
  'xq': {
    normal: xqNormal,
    hover: xqHover,
    active: xqHover
  },
  'wb': {
    normal: wbNormal,
    hover: wbHover,
    active: wbHover
  },
  'ktv': {
    normal: ktvNormal,
    hover: ktvHover,
    active: ktvHover
  },
  'zdqy': {
    normal: zdqy,
    hover: zdqy,
    active: zdqy
  },
  'jhspdw': {
    normal: videoTogether,
    hover: videoTogether,
    active: videoTogether
  },
  'jhargd': {
    normal: arNormal,
    hover: arHover,
    active: arClick,
    components: SearchPositionWindow
  }
}

const tabIcons = {
  ALL: {
    name: 'ALL',
    showName: 'ALL',
    title: '全部点位列表',
    tabActiveStatus: true
  },
  device: {
    name: 'device',
    showName: '',
    hover: noteActive,
    normal: noteNormal,
    title: '执法记录仪列表',
    tabActiveStatus: false
  },
  CAMERA: {
    name: 'CAMERA',
    showName: '',
    hover: cameraActive,
    normal: cameraNormal,
    title: '普通视频点位列表',
    tabActiveStatus: false
  },
  AR: {
    name: 'AR',
    showName: '',
    hover: arPointActive,
    normal: arPointNormal,
    title: 'AR点位列表',
    tabActiveStatus: false
  }
}

const resourceTypeArr = [
  { label: '岗亭', value: 'gt' },
  {
    label: '警力',
    value: 'jl',
    children: [
      { label: '单兵', value: 'db' },
      { label: '警务通', value: 'jwt' },
      { label: '对讲机', value: 'djj' },
      { label: '车载', value: 'cz' }
    ]
  },
  {
    label: '监控点位',
    value: 'jkdw',
    children: [
      { label: '视频点位', value: 'spdw' },
      { label: 'AR高点', value: 'argd' }
    ]
  },
  {
    label: '重点场所',
    value: 'zdcs',
    children: [
      { label: '小区', value: 'xq' },
      { label: '网吧', value: 'wb' },
      { label: 'KTV', value: 'ktv' }
    ]
  },
  { label: '重点区域', value: 'zdqy' }
]

const mapOfDataAndLabel = {
  SENTRY: 'gt',     // 岗亭
  INDIVIDUAL: 'db', // 单兵
  PLACEPDA: 'jwt',   // 警务通
  INTERCOM: 'djj',   // 对讲机
  VEHICLEGPS: 'cz', // 车载
  KTV: 'ktv',        // KTV
  CYBERCAFE: 'wb',  // 网吧
  UPTOWN: 'xq',     // 小区
  CAMERA: 'spdw',     // 视频点位
  AR: 'argd',         // AR高点
  REGION: 'zdqy',     // 重点区域
  gt: "SENTRY",
  db: "INDIVIDUAL",
  jwt: "PLACEPDA",
  djj: "INTERCOM",
  cz: "VEHICLEGPS",
  ktv: "KTV",
  wb: "CYBERCAFE",
  xq: "UPTOWN",
  spdw: "CAMERA",
  argd: "AR",
  zdqy: "REGION"
}

export { alarmTypes, dealSteps, tabOptions, dealStepsObj, distanceOptions, iconMap, tabIcons, resourceTypeArr, mapOfDataAndLabel }