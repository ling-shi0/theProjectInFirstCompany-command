import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import actions from './actions.js'
import getters from './getters.js'
import mutations from './mutations.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  state,
  mutations,
  getters,
  actions,
  modules: {}
})

export default store
