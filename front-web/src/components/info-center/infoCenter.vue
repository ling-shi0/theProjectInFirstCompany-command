<template>
  <div class="info-center-wrap">
    <AudioPanel></AudioPanel>
    <VideoPanel></VideoPanel>
    <AudioCallBtn></AudioCallBtn>
    <AudioCallPane></AudioCallPane>
  </div>
</template>
<script>
/* eslint-disable camelcase */
import AudioCallBtn from './audioCallBtn';
import AudioPanel from './audioPanel';
import CommunicationMixins from '@/mixins/InfoCenter/communicationMixins';
import { mapMutations, mapState } from 'vuex';
import $ from 'jquery';
import VideoPanel from './videoPanel';
import AudioCallPane from './callPanes/audioCallPane'
import {
  GROUP_TYPE,
  SEND_MSG_STATUS,
  All_MSG_TYPES,
  GROUP_MEMBER_UPDATE_TYPES,
  GROUP_NAME_UPDATE_TYPE,
  GROUP_MEMBER_ADD_TYPE,
  GROUP_MEMBER_DEL_TYPE,
  AUDIO_CALLING,
  AUDIO_ANSWERING,
  AUDIO_CHATING,
  AUDIO_END
} from '@/constants';
import { UUIDGenerator } from '@/utils/common';
import Verto from '@/utils/verto';
export default {
  name: 'InfoCenter',
  components: { AudioCallBtn, AudioPanel, VideoPanel, AudioCallPane },
  data() {
    return { verto: null };
  },
  mixins: [CommunicationMixins],
  mounted() {
    this.verto = Verto.getInstance();
  },
  computed: {
    ...mapState([
      'curCallingPanelId',
      'curCallResId',
      'chatUsers',
      'groupUsers',
      'chatList'
    ])
  },
  methods: {
    ...mapMutations([
      'setVertoLoginInfo',
      'updateChatUsers',
      'setCurCallingPanelId',
      'setAudioStatus',
      'setHangupCauseCode',
      'setCurCallResId',
      'setCurChatingMembers',
      'updateChatGroupUsers',
      'setDisplayVideoPanel',
      'setDisplayAudioPanel',
      'setCurChatResId'
    ]),
    // verto 登陆成功
    async handleVertoLoginSuc() {
      this.initChatLoginInfo();
      // await this.initHistoryAndUnreadMsg();
      // this.setInitChatList();
    },

    // 初始化聊天登录者信息
    initChatLoginInfo() {
      const {
        resId,
        name,
        id,
        number,
        deptPath,
        displayNumber
      } = this.vertoLoginData;
      // const { userId } = this.userInfo;
      // resolveClearChatList({ userId, id });
      this.setVertoLoginInfo(this.vertoLoginData);
      this.updateChatUsers({
        [resId]: { name, number, deptPath, displayNumber }
      });
    },
    // 处理消息
    handleMessage(verto, dialog, msg, { from, body }) {
      console.log('handleMessage',$.verto.enum.message.info)
      console.log(verto, dialog, msg, { from, body })
      if (msg === $.verto.enum.message.info && body) {
        this.resolveMessage(from, body);
      }
    },
    // 处理接受的消息
    resolveMessage(from, body) {
      const res = JSON.parse(body);
      const { type, eventType, memberList, sessionId } = res;
      switch (type) {
        // 消息通知
        case 'msg': {
          this.receiveMsgInfo(res);
          break;
        }
        // 事件通知
        case 'event': {
          // 群组通话成员状态变更
          if (eventType === 'group_call_status_ex') {
            // 更新当前通话成员状态
            if (this.curCallResId === sessionId || !this.curCallResId) {
              const combineList = memberList.map(i => ({ ...i, resId: i.id }));
              this.setCurChatingMembers(combineList || []);
            }
          }

          break;
        }
        // 回执通知
        // case 'send_ack': {
        //   this.resolveSendAck(from, res);
        //   break;
        // }
        default:
          break;
      }
    },
    receiveMsgInfo(res) {
      console.log("=================")
      console.log(res)
      console.log("=================")
      const {
        msgData: { msgType, isMuCall },
        sessionId
      } = res;
      if (isMuCall) return; // 去除会议消息

      const isMatchType = All_MSG_TYPES.includes(msgType);
      if (!isMatchType) return;

      const recordInx = this.chatList.findIndex(i => i.resId === sessionId);
      if (recordInx !== -1) {
        // 群变更消息处理
        this.resolveGroupUpdate(msgType, sessionId, res);
      }
    },
    // 群变更消息处理
    resolveGroupUpdate(msgType, resId, data) {
      if (!GROUP_MEMBER_UPDATE_TYPES.includes(msgType)) return;
      const {
        msgData: { newName, newMember, delMember }
      } = data;

      switch (msgType) {
        // 群名修改
        case GROUP_NAME_UPDATE_TYPE: {
          const info = this.chatUsers[resId] || {};
          this.updateChatUsers({ [resId]: { ...info, name: newName } });
          break;
        }
        // 群成员增加
        case GROUP_MEMBER_ADD_TYPE: {
          const members = this.groupUsers[resId] || [];
          const newMembers = newMember ? newMember.split(',') : [];
          this.updateChatGroupUsers({
            [resId]: [...new Set([...members, newMembers])]
          });
          break;
        }
        // 群成员减少
        case GROUP_MEMBER_DEL_TYPE: {
          const curMembers = this.groupUsers[resId] || [];
          const delMembers = delMember ? delMember.split(',') : [];
          const existMembers = curMembers.filter(i => !delMembers.includes(i));
          this.updateChatGroupUsers({ [resId]: existMembers });
          break;
        }
        default:
          break;
      }
    },
    // 处理音视频消息
    async handleDialogState(d) {
      
      console.log("=================")
      console.log(d)
      console.log("=================")
      switch (d.state) {
        // 音视频请求-有音频呼入
        case $.verto.enum.state.ringing: {
          const { wantVideo, caller_id_number } = d.params;
          const isCalling = this.verto.currentCall;
          const {
            hasPerms,
            hasAudioDevice,
            hasVideoDevice
          } = await this.hasDevice(wantVideo);

          // 未授权，未插入设备
          if (
            !hasPerms ||
            (!hasAudioDevice && !hasVideoDevice) ||
            (!wantVideo && !hasAudioDevice)
          ) {
            d.params.cause = 'USER_BUSY';
            d.hangup();
            d.params.cause = undefined;
            return;
          }
          // 当前无通话
          if (!isCalling) {
            this.setCurChatingMembers([]);
            wantVideo
              ? this.setDisplayVideoPanel(true)
              : this.setDisplayAudioPanel(true);
          }
          // 此处需要后台接口返回呼入用户的信息，未开发完成，目前版本平台仅作为语音发起方，不作为接收方
          const callerInfo = {
            resId: 'baf702639533443984ec3449b1bd3ade',
            name: '演示账号',
            number: '0000000801086'
          };
          // const callerInfo = await this.getUserInfoByNumber(caller_id_number);
          const callerResId = callerInfo.resId || UUIDGenerator;
          // 首个呼入
          if (!isCalling) {
            this.verto.setAnswerInstance(d); // 存储当前呼入通话对象
            this.setAudioStatus(AUDIO_ANSWERING);
            callerInfo.resId && this.setCurChatResId(callerResId);
            this.setCurCallResId(callerResId); // 设置当前通话窗口id
            const { callID } = d.params;
            this.setCurCallingPanelId(callID);
          }
          break;
        }
        // 正在发送音视频请求-正在打电话
        case $.verto.enum.state.requesting: {
          const { callID } = d.params;
          this.setCurCallingPanelId(callID);
          this.setAudioStatus(AUDIO_CALLING);
          break;
        }

        // 语音/视频 通话中
        case $.verto.enum.state.active: {
          const { tag } = d.params;
          $(`#${tag}`).show();
          this.setAudioStatus(AUDIO_CHATING);
          break;
        }

        // 挂断
        case $.verto.enum.state.hangup: {
          const { callID } = d.params;
          if (callID === this.curCallingPanelId) {
            // 设置当前挂断原因
            console.log("=========")
            console.log(d.cause)
            console.log("=========")
            // 这里有疑惑 为啥原代码要写成settimeout的形式后续执行 这样的话会出现原因为空的情况 这不对
            // setTimeout(() => {
            this.setHangupCauseCode(d.cause);
            // }, 0);
            this.setCurCallResId();
            this.setAudioStatus(AUDIO_END);
            this.verto.clearCurrentCall();
          }
          break;
        }

        default:
          break;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.info-center-wrap {
  position: absolute;
  top: 61px;
  right: 400px;
}
</style>
