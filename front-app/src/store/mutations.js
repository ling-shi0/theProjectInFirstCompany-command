/*
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-04-25 16:40:43
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-07-07 18:51:38
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const _this = Vue.prototype

const mutations = {
  SET_USER_NAME(state, userName) {
    state.userName = userName
    _this.$hatom.storage.setItem('userName', userName)
  },
  SET_Avatar_Url(state, avatarUrl) {
    state.avatarUrl = avatarUrl
    _this.$hatom.storage.setItem('avatarUrl', avatarUrl)
  },
  SET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo;
  },
  SET_NEWALERT(state, newAlert) {
    state.newAlertNum = newAlert
  }
}

export default mutations
