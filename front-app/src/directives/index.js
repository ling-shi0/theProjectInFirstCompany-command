/*
 * @Description:
 * @Version:
 * @Autor: wangXiaoMing
 * @Date: 2021-05-20 19:39:11
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-05-20 19:50:05
 */
import move from './move.js'

const directives = {
  move
}

export default {
  install(Vue) {
    Object.keys(directives).forEach((key) => {
      Vue.directive(key, directives[key])
    })
  }
}
