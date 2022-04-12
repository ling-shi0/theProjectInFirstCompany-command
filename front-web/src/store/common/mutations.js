/*
 * @Description:
 * @Version:
 * @Autor: wangXiaoMing
 * @Date: 2021-03-08 09:32:50
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-03-29 16:18:40
 */
import state from "./state";

export default {
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo;
  },
  // 设置地图map
  setMapObj(state, map) {
    state.mapObj = map
  },
  // 设置显示视频频界面
  setDisplayVideoPanel(state, payload) {
    state.showVideoPanel = payload
  },
  // 设置显示音频界面
  setDisplayAudioPanel(state, payload) {
    state.showAudioPanel = payload
  },
  // 设置登陆者信息
  setVertoLoginInfo(state, payload) {
    state.vertoLoginInfo = payload
  },

  // 更新用户信息
  updateChatUsers(state, payload) {
    state.chatUsers = {
      ...state.chatUsers,
      ...payload
    }
  },
  // 设置当前通话面板id
  setCurCallingPanelId(state, payload) {
    state.curCallingPanelId = payload
  },
  // 设置当前聊天状态
  setAudioStatus(state, payload) {
    state.audioStatus = payload
  },
  // 设置挂断原因
  setHangupCauseCode(state, payload) {
    state.hangupCauseCode = payload
  },
  // 设置当前通话id
  setCurCallResId(state, payload) {
    state.curCallResId = payload;
  },
  setCurChatResId(state, payload) {
    state.curChatResId = payload
  },
  // 设置当前在线人员
  setCurChatingMembers(state, payload) {
    state.curChatingMembers = payload || []
  },
  // 更新群组/个人成员信息
  updateChatGroupUsers(state, payload) {
    state.groupUsers = {
      ...state.groupUsers,
      ...payload
    }
  },
  // 设置标签图标
  setLabelIcon(state, payload) {
    state.legend = payload;
  },
  // 设置警情详情窗口状态和核心id信息共享
  setAlarmStatusMes(state, payload) {
    state.alarmMesStatus = payload
  },
  // 设置初始配置值
  setInitConfigData(state, payload) {
    state.initConfigData = payload
  }
};
