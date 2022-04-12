import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const _this = Vue.prototype

const getters = {
  getUserName: state => {
    let userName = state.userName
    _this.$hatom.storage.getItem('userName', res => {
      userName = _this.$isMobile() ? res.message : res
    })
    return userName
  },
  getAvatarUrl: state => {
    let avatarUrl = state.avatarUrl
    _this.$hatom.storage.getItem('avatarUrl', res => {
      avatarUrl = _this.$isMobile() ? res.message : res
    })
    return avatarUrl
  }
}

export default getters
