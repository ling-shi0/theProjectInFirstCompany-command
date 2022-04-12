/*
 * @Description:
 * @Version:
 * @Autor: wangXiaoMing
 * @Date: 2021-03-08 09:32:50
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-03-31 14:47:47
 */
import { AUDIO_END } from '@/constants';
export default {
  chatList:[],
  userInfo: null,
  mapObj: null,// 地图信息
  showAudioPanel: false, // 语音群聊界面显示
  showVideoPanel: false,// 视频界面
  vertoLoginInfo: {}, // verto登陆信息(number,password,socketUrl)
  chatUsers: {}, // 当前正在聊天的用户信息 接受信息方
  curChatResId: '',
  curCallResId: '',// 当前通话用户id
  groupUsers: {}, // 群组(个人）信息
  audioStatus: AUDIO_END, // 音频状态
  hangupCauseCode: '', // 挂断的原因code
  curCallingPanelId: '', // 当前通话面板id
  curChatingMembers: [], // 当前通话在线成员
  legend:null,
  alarmMesStatus: {},
  initConfigData: {}
};
