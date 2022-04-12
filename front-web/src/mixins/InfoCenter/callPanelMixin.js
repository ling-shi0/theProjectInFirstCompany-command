import {
  AUDIO_END,
  AUDIO_CALLING,
  AUDIO_ANSWERING,
  AUDIO_CHATING,
  HANGUP_CAUSE
} from '../../constants';
import Verto from '@/utils/verto.js';
import {
  mapState,
  mapMutations
} from 'vuex';
import {
  createGroup,
  deleteGroup,
  modGroup
} from '@/api/InfoCenter/infoCenter';
export default {
  data() {
    return {
      verto: null,
      isMute: false // 是否静音
    }
  },
  computed: {
    ...mapState(['curCallResId', 'audioStatus', 'hangupCauseCode', 'chatUsers', 'curChatResId', 'vertoLoginInfo', 'showAudioPanel', 'groupUsers']),
    // 启动状态：非通话状态也非挂断状态
    isRuning() {
      return (
        ![AUDIO_CALLING, AUDIO_ANSWERING, AUDIO_CHATING,AUDIO_END].includes(this.audioStatus) &&
        !this.hangupCauseCode
      )
    },
    // 群语音/视频
    isGroup() {
      return this.chatUsers[this.curCallResId] && this.chatUsers[this.curCallResId].isGroup
    },
    // 拨打中
    isCallingStatus() {
      return this.audioStatus === AUDIO_CALLING
    },

    // 等待接听
    isAnsweringStatus() {
      return this.audioStatus === AUDIO_ANSWERING
    },
    // 等待状态
    isWaitStatus() {
      return [AUDIO_CALLING, AUDIO_ANSWERING].includes(this.audioStatus)
    },
    // 通话中
    isChatingStatus() {
      return this.audioStatus === AUDIO_CHATING
    },
    // 通话发送/接听时显示的名称
    chatName() {
      const {
        curChatResId,
        chatUsers
      } = this;
      const {
        isGroup,
        name
      } = chatUsers[curChatResId] || {};
      // 群组显示名称
      if (isGroup) {
        // 未完成
      } else {
        return name
      }
    },
    // 挂断状态
    isHangupStatus() {
      return this.audioStatus === AUDIO_END
    },
    // 挂断状态
    hangupStatus() {
      return HANGUP_CAUSE[this.hangupCauseCode]
    },
    // 多人模式
    muiltMode() {
      const isChating = this.audioStatus === AUDIO_CHATING;
      return this.chatUsers[this.curChatResId] && this.chatUsers[this.curChatResId].isGroup && isChating
    }
  },
  methods: {
    ...mapMutations(['setCurChatResId', 'setDisplayAudioPanel', 'updateChatUsers', 'updateChatGroupUsers']),
    // 挂断电话
    handleHangup() {
      const {
        audioStatus
      } = this;
      let cause;

      this.verto = Verto.getInstance()
      if (audioStatus === AUDIO_CHATING) {
        // 拨打中挂断 状态为通话已取消
        cause = 'ORIGINATOR_CANCEL'
      } else if (audioStatus === AUDIO_ANSWERING) {
        // 等待接听时挂断 状态为通话已拒绝
        cause = 'USER_BUSY'
      }
      this.verto.currentCall.params.cause = cause
      this.verto.hangupCall({
        cause
      })
    },
    // 静音
    handleMute() {
      this.verto = Verto.getInstance()
      this.isMute = !this.isMute;
      this.verto.mute('toggle')
    },
    // 接听
    handleAnswer(useVideo) {
      this.verto = Verto.getInstance()
      this.verto.answer({
        useVideo
      })
    },
    // 创建群组
    async handleCreateGroup(groupParams) {

      const {
        data
      } = await createGroup(groupParams);
      this.updateChatUsers({
        [data.groupId]: {
          creator: this.vertoLoginInfo.resId,

          isGroup: true,
          name: data.name,
          number: data.number
        }
      });
      this.updateChatUsers({
        [groupParams.creator]: {
          name: this.vertoLoginInfo.name,
          number: this.vertoLoginInfo.number,
          deptPath: this.vertoLoginInfo.deptPath,
          displayNumber: this.vertoLoginInfo.displayNumber
        }
      });
      this.updateChatGroupUsers({
        [data.groupId]: groupParams.members.split(',')
      });
      this.setCurChatResId(data.groupId);
      // this.setDisplayAudioPanel(!this.showAudioPanel);
    },
    // 删除群组
    async handleDeleteGroup(groupParams) {

      await deleteGroup(groupParams)
    },
    // 判断人员是否存在
    memberExits(member) {
      const groupMembers = this.groupUsers[this.curChatResId] || [];
      const loginData = this.vertoLoginInfo.resId;
      // console.log('memberExits', member, groupMembers.includes(member));
      return loginData === member || groupMembers.includes(member);
    },
    // 添加人员
    async handleAddMember(member) {
      let memberArr = []
      if (Array.isArray(member)) {
        memberArr = member
      } else {
        memberArr.push(member)
      }
      const members = memberArr.map(item => {
        return item.resId
      });
      const groupMembers = this.groupUsers[this.curChatResId] || [];
      const {
        isGroup,
        name
      } = this.chatUsers[this.curChatResId];
      const allMembers = [...new Set([...members, ...groupMembers])];
      const addMembers = members.filter(item => {
        const index = groupMembers.findIndex(i => i === item);
        return index===-1;
      })
      const oldName = name.split('...')[0];
      const groupName =
        oldName.split(',').length >= 2 ?
        name :
        oldName.split(',')[0] + ',' + memberArr[0].name + '...';
      if (isGroup) {
        // 更新群组成员的信息(新增、删除) 后台数据更新 (待完善。。。。。)
        addMembers.length && await modGroup({
          addMembers: addMembers.join(','),
          groupId: this.curChatResId,
          name: groupName,
          delMembers: '',
          resId: this.vertoLoginInfo.resId
        });
        memberArr.forEach(item => {
          this.updateChatUsers({
            [item.resId]: {
              name: item.name,
              number: item.number,
              deptPath: item.deptPath,
              displayNumber: item.displayNumber
            }
          });
        })

        this.updateChatGroupUsers({
          [this.curChatResId]: allMembers
        });
      }
    },
  }
}
