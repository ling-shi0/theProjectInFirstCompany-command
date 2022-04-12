/*
 * @Description:
 * @Version:
 * @Autor: wangXiaoMing
 * @Date: 2021-03-22 19:59:54
 */
import http from '@/core/httpInstance';

export const getSubDeptInfo = params => {
  return http.get({
    url: '/res/subDeptInfos', params: {
      id: params
    }
  });
};

export const modDeptReceiveAlertAuth = data => {
  return http.post({ url: '/deptConfig/modDeptReceiveAlertAuth', data });
};

export const isDrawJurisdiction = params => {
  return http.get({ url: '/jurisdictionConfig/isDrawJurisdiction', params });
};

export const findByAreaCode = data => {
  return http.post({ url: '/jurisdictionConfig/findByAreaCode', data });
};

export const addJurisdiction = data => {
  return http.post({ url: '/jurisdictionConfig/addJurisdiction', data });
};

export const delJurisdiction = params => {
  return http.get({ url: '/jurisdictionConfig/delJurisdiction', params });
};

export const updateJurisdiction = data => {
  return http.post({ url: '/jurisdictionConfig/updateJurisdiction', data });
};

export const recommendPlaceByDeptName = data => {
  return http.post({
    url: '/jurisdictionConfig/queryRecommendJurisdiction',
    data
  });
};

export const queryDeptJurisdiction = params => {
  return http.get({
    url: '/jurisdictionConfig/queryDeptJurisdiction',
    params
  });
};

export const getDefaultArea = data => {
  return http.post({ url: '/jurisdictionConfig/querySubordinate', data });
};

export const queryReceiveDepts = params => {
  return http.get({
    url: '/deptConfig/queryReceiveDepts',
    params
  });
}