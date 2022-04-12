import http from '@/core/httpInstance';

/**
 * @desc 新增地点标签
 * @param areaCode 辖区编号
 * @param labelName  标签小类类别名称
 * @param labelTypeName 标签大类类型名称  岗亭 重点场所 重点区域
 * @param labelType
 * @param placeType 地点便签类型
 * @param shapeType 图形类型  1：点 2：多边形
 * @wkts
 */
export const addNewPlaceLabel=(payload)=>{
  return http.post({
    url:'/placeLabelConfig/addNewPlaceLabel',
    data:payload
  })
}

/**
 * @desc 删除地点标签
 * @param id 地点标签id
 */
export const delPlaceLabel = (id)=>{
  return http.get({
    url:'/placeLabelConfig/delPlaceLabel',
    params:id
  })
}

/**
 * @desc 查询标签图例
 * @param areaCode 辖区编号
 * @param labelName  标签小类类别名称
 * @param labelTypeName 标签大类类型名称  岗亭 重点场所 重点区域
 * @param labelType
 * @param placeType 地点便签类型
 * @param shapeType 图形类型  1：点 2：多边形
 * @wkts
 */
export const queryLabelClassify=(payload)=>{
  return http.post({
    url:'/labelClassify/queryLabelClassify',
    data:payload
  })
}

/**
 * @desc 查询地点标签
 * @param placeLabelName
 * @param placeIds
 * @param areaCode
 * @param placeType
 */
export const queryPlaceLabel=(payload)=>{
  return http.post({
    url:'/placeLabelConfig/queryPlaceLabel',
    data:payload
  })
}

/**
 * @desc 修改地点标签
 * @param id 警员编号
 * @param placeLabelName 标签名称
 */
export const modPlaceLabel=(payload)=>{
  return http.post({
    url:'/placeLabelConfig/modPlaceLabel',
    data:payload
  })
}

/**
 * @desc 查询地点标签中的警员
 * @param placeId 标签编号id
 */
export const getCurPolicesInPlace =(payload)=>{
  return http.get({
    url:'/placePoliceMgt/queryCurPolicesInPlace',
    params:payload
  })
}

/**
 * @desc 修改地点标签中警力
 * @param placeId 标签编号
 * @param newUserIds 修改后的警力所有人员id
 */
export const modPoliceInPlace =(payload)=>{
  return http.post({
    url:'/placePoliceMgt/modPoliceInPlace',
    data:payload
  })
}

