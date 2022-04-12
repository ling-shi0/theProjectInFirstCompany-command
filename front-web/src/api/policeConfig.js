import http from '@/core/httpInstance';

/**
 * @desc 警员查询
 * @param deptCode 部门编号
 * @param pageNo 页码
 * @param pageSize 页大小
 * @param policeName 警员真实姓名
 * @param visual 是否仅在avc组件展示 1：是  0:否
 */
export const getPoliceInfo =(payload)=>{
  return http.post({
    url:'/policeUserConfig/pageQuery',
    data:payload
  })
}

/**
 * @desc 获取部门组织树
 * @param level 默认2
 * @param deptId 默认-1
 */
export const getTree =(payload)=>{
  return http.get({
    url:'/res/deptTrees',
    params:payload
  })
}

/**
 * @desc 批量添加警员信息为可见
 * @param ids
 */
export const batchAddUser=(payload)=>{
  return http.post({
    url:'/policeUserConfig/batchAddUser',
    data:payload
  })
}
/**
 * @desc 批量添加警员信息为不可见
 * @param ids
 */
export const batchDelUser=(payload)=>{
  return http.post({
    url:'/policeUserConfig/batchDelUser',
    data:payload
  })
}

/**
 * @desc 删除单个警员信息
 * @param ids 警员id数组
 */
export const delPolice=(payload)=>{
  return http.post({
    url:'/policeUserConfig/delPoliceUserInfo',
    data:payload
  })
}

/**
 * @desc 修改警员信息
 * @param deviceId 设备编号
 * @param deviceType 设备类型
 * @param id  警员用户主键
 */
export const modPoliceUserInfo =(payload)=>{
  return http.post({
    url:'/policeUserConfig/modPoliceUserInfo',
    data:payload
  })
}