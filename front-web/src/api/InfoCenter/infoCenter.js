import http from '@/core/httpInstance';

// 获取人员结构
export const getPersonAll = (payload = {}) => {
  return http.post({
    url: '/v1/person/findAll',
    data: payload
  })
}

// 根据账号查用户
export const getUsersByAcount = (payload) => {
  return http.post({
    url: '/xmessage/user/queryUsersByAccount',
    data: payload
  })
}

/**
 * @desc 创建群组
 * @param creator 创建人id
 * @param members 群组成员id,逗号隔开
 * @param name 群组名称
 */
export const createGroup = (payload) => {
  return http.post({
    url: '/xmessage/group/createGroup',
    data: payload
  })
}

/**
 * @desc 删除群组
 * @param groupId 群组id
 * @param resId 用户资源id
 */
export const deleteGroup = (payload) => {
  return http.post({
    url: '/xmessage/group/deleteGroup',
    data: payload
  })
}

/**
 * @desc 根据部门查询用户
 * @param containSub  是否包含下一级  1：是
 * @param deptCode 部门编号
 * @param keyWord 名称、号码模糊匹配
 * @param pageNo 页数
 * @param pageSize 页码
 */
export const getUsersByDeptCode =(payload)=>{
  return http.post({
    url:'/xmessage/user/queryUsersByDeptCode',
    data:payload
  })
}

/**
 * @desc 根据关键字查询用户
 * @param containSub  是否包含下一级  1：是
 * @param deptCode 部门编号
 * @param keyWord 名称、号码模糊匹配
 * @param pageNo 页数
 * @param pageSize 页码
 */
export const searchUsers =(payload)=>{
  return http.post({
    url:'/xmessage/user/searchUsers',
    data:payload
  })
}

/**
 * @desc 修改群组
 * @param addMembers 邀请成员  资源id逗号分隔
 * @param delMembers 踢出成员  资源id逗号分隔
 * @param groupId 群组id
 * @param name 群组名称
 * @resId 创建人资源id
 */
export const modGroup =(payload)=>{
  return http.post({
    url:'/xmessage/group/modGroup',
    data:payload
  })
}

/**
 * @desc 当前登录用户
 */
export const getCurUser=()=>{
  return http.get({
    url:'/user/curUser'
  })
}

/**
 * @desc 分页查询警力接口
 * @param bbox 左上角和右上角的经纬度
 * @param labelTypes 数组，此处查询App
 * @param point {longitude,latitude} 中心点经纬度
 */
export const queryPolice =(payload)=>{
  return http.post({
    url:'/res/map/query',
    data:payload
  })
}