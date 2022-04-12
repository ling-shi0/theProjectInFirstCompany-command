/*
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-08-12 14:45:11
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-08-12 20:05:36
 */
import IsBaseMap from './IsBaseMap';
import IsMap from './IsMap';
// const install = function(Vue) {
//   Vue.component(IsBaseMap.name, IsBaseMap);
//   Vue.component(IsMap.name, IsMap);
// };

IsBaseMap.install = (Vue) => {
  Vue.component(IsBaseMap.name, IsBaseMap)
}

IsMap.install = (Vue) => {
  Vue.component(IsMap.name, IsMap)
}

export default [IsBaseMap, IsMap];
