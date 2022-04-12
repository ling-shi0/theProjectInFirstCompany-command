/*
 * @Description:
 * @Version:
 * @Autor: wangXiaoMing
 * @Date: 2021-02-23 16:03:32
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-05-18 15:48:33
 */
import http from '@/core/httpInstance';

export const getPolice = params => {
  return http.get({
    url: '/config/getLoginUserDept',
    params: {}
  });
};

export const getAlarmList = params => {
  return http.post({ url: '/alert/queryAlertInfoForm', data: params });
};

export const updateAlertFocus = params => {
  return http.get({ url: '/alert/updateAlertFocus', params });
};

export const getFeedBackTime = params => {
  return http.get({ url: '/statistics/feedBackTime', params });
};

export const getArriveTime = params => {
  return http.get({ url: '/statistics/arriveTime', params });
};

export const getAlertNum = params => {
  return http.get({ url: '/statistics/todatAlertNum', params });
};

export const getInitConfig = () => {
  return http.get({ url: '/config/getInitConfig', params: {} });
};

export const getHistoryAlertInfo = phoneNum => {
  return http.get({ url: '/alert/historyAlertInfo', params: { phoneNum } });
};

export const getDownloadHistoryList = ({ phoneNum, name, certNum }) => {
  return http.download({
    url: '/alert/download',
    params: {
      phoneNum,
      type: 'excel',
      fileName: `${name || '未知姓名'}${certNum || '未知身份证号'}${phoneNum || '未知电话号'
        }历史警情`
    }
  });
};

export const getAdvisePersonInfo = alarmNo => {
  return http.get({ url: '/alert/recommendPerson', params: { alarmNo } });
};

export const getPlaceSearch = data => {
  return http.post({ url: '/res/map/queryPlace', data });
};

export const getDeptTree = params => {
  return http.get({
    url: '/res/subDeptInfos',
    params: {
      id: params
    }
  });
};

export const getKeyWordDeptInfo = data => {
  return http.post({ url: '/res/deptInfoByKeyword', data });
};

export const getPoliceMes = data => {
  return http.post({ url: '/res/map/queryPolice', data });
};

export const getPointMes = data => {
  return http.post({
    url: '/res/device/page',
    data: {
      category: 2,
      ...data
    }
  });
};

export const manageControl = params => {
  return http.get({ url: '/deploy/deployTask', params });
};

export const positionPolice = item => {
  return http.get({
    url: '/res/map/police/lastPosition',
    params: {
      userIndexCode: item
    }
  });
};

export const ModDealPerson = params => {
  return http.get({ url: '/alert/modAlertDisposalPolice', params });
};

export const getAlarmPositiones = params => {
  return http.get({ url: '/alert/position/queryPage', params });
};

export const getOneAlarmPosition = params => {
  return http.get({ url: '/alert/position/queryOne', params });
};

export const deleteAlarmPosition = params => {
  return http.delete({ url: '/alert/position/delPosition', params });
};

export const setAlarmPosition = data => {
  return http.post({ url: '/alert/position/addPosition', data });
};

export const getDragPosition = data => {
  return http.post({ url: '/res/map/queryPlace', data });
};

export const resourceTypeQuery = data => {
  return http.post({ url: '/res/map/query', data });
};
export const getTrailInfo = data => {
  return http.post({ url: '/trajectory/queryUserTrajectory', data });
};

export const findPoliceInfo = params => {
  return http.get({
    url: '/policeUserConfig/findUserByUserId',
    params: { userId: params }
  });
};

export const getAddDealPoliceMes = data => {
  return http.post({ url: '/policeUserConfig/pageQuery', data });
};
//已读未读状态更新
export const updateReadType = params => {
  return http.get({ url: '/alert/updateReadType', params });
};

export const getHistoryAlarm = params => {
  return http.get({
    url: '/alert/findPhoneAlert',
    params
  });
};
