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
    name: '??????????????????',
    value: ''
  },
  {
    name: '??????',
    value: '??????'
  },
  {
    name: '??????',
    value: '??????'
  },
  {
    name: '??????',
    value: '??????'
  },
  {
    name: '????????????',
    value: '????????????'
  },
  {
    name: '????????????',
    value: '????????????'
  },
  {
    name: '????????????',
    value: '????????????'
  },
  {
    name: '??????',
    value: '??????'
  },
  {
    name: '??????',
    value: '??????'
  },
  {
    name: '??????????????????',
    value: '??????????????????'
  },
  {
    name: '???????????????',
    value: '???????????????'
  },
  {
    name: '????????????',
    value: '????????????'
  },
  {
    name: '??????',
    value: '??????'
  }
];

const dealSteps = [
  {
    name: '??????????????????',
    value: ''
  },
  {
    name: '??????',
    value: '??????'
  },
  {
    name: '??????',
    value: '??????'
  },
  {
    name: "??????",
    value: "??????"
  }, {
    name: '??????',
    value: '??????'
  }, {
    name: '??????',
    value: '??????'
  }, {
    name: '??????',
    value: '??????'
  }
];

const tabOptions = [
  {
    label: '????????????',
    value: 0
  },
  {
    label: '?????????',
    value: 1
  },
  {
    label: '??????',
    value: 2
  }
]

const dealStepsObj = {
  '??????': -1,
  '??????': 0,
  "??????": 1,
  '??????': 2,
  '??????': 3,
  '??????': 4
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
    title: '??????????????????',
    tabActiveStatus: true
  },
  device: {
    name: 'device',
    showName: '',
    hover: noteActive,
    normal: noteNormal,
    title: '?????????????????????',
    tabActiveStatus: false
  },
  CAMERA: {
    name: 'CAMERA',
    showName: '',
    hover: cameraActive,
    normal: cameraNormal,
    title: '????????????????????????',
    tabActiveStatus: false
  },
  AR: {
    name: 'AR',
    showName: '',
    hover: arPointActive,
    normal: arPointNormal,
    title: 'AR????????????',
    tabActiveStatus: false
  }
}

const resourceTypeArr = [
  { label: '??????', value: 'gt' },
  {
    label: '??????',
    value: 'jl',
    children: [
      { label: '??????', value: 'db' },
      { label: '?????????', value: 'jwt' },
      { label: '?????????', value: 'djj' },
      { label: '??????', value: 'cz' }
    ]
  },
  {
    label: '????????????',
    value: 'jkdw',
    children: [
      { label: '????????????', value: 'spdw' },
      { label: 'AR??????', value: 'argd' }
    ]
  },
  {
    label: '????????????',
    value: 'zdcs',
    children: [
      { label: '??????', value: 'xq' },
      { label: '??????', value: 'wb' },
      { label: 'KTV', value: 'ktv' }
    ]
  },
  { label: '????????????', value: 'zdqy' }
]

const mapOfDataAndLabel = {
  SENTRY: 'gt',     // ??????
  INDIVIDUAL: 'db', // ??????
  PLACEPDA: 'jwt',   // ?????????
  INTERCOM: 'djj',   // ?????????
  VEHICLEGPS: 'cz', // ??????
  KTV: 'ktv',        // KTV
  CYBERCAFE: 'wb',  // ??????
  UPTOWN: 'xq',     // ??????
  CAMERA: 'spdw',     // ????????????
  AR: 'argd',         // AR??????
  REGION: 'zdqy',     // ????????????
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