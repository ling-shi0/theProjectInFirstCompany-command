/*
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-04-25 16:40:43
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-04-26 15:04:16
 */
const actions = {
  setUserName({ commit }, userName) {
    commit('SET_USER_NAME', userName)
  },
  setAvatarUrl({ commit }, avatarUrl) {
    commit('SET_Avatar_Url', avatarUrl)
  },
  SET_USER_INFO(state, userInfo) {
    state.userInfo.type = userInfo.type;
    // state.userId = userInfo.userId
    state.userInfo.userId = userInfo.relativeUserId;
    state.userInfo.userName = userInfo.userName;
    state.userInfo.menuCodes = userInfo.menuCodes;
    state.userInfo.operateCodes = userInfo.operateCodes;
    state.userInfo.logo = userInfo.logo;
    state.userInfo.title = userInfo.title;
  }
}

export default actions
