<template>
  <div class="swipe-members">
    <div class="member-item" v-for="member in swipeMembers" :key="member.resId">
      <div
        class="member-name-code column-flex"
        :class="{ 'current-user': member.resId === vertoLoginInfo.resId }"
      >
        <span class="name" v-ellipsis>
          {{ member.name|| '--' }}
        </span>
        <span class="code" v-ellipsis>{{member.displayNumber||'--'}}</span>
      </div>

      <div
        class="member-phone-department column-flex"
        :class="{ 'no-left-border': member === vertoLoginInfo.resId }"
      >
        <span class="phone" v-ellipsis>
          {{ member.number || '' }}
        </span>
        <span class="department" v-ellipsis>{{member.deptPath}}</span>
      </div>
      <div class="member-operation">
        <el-button
          :icon="muteIcon"
          size="mini"
          v-if="member.resId === vertoLoginInfo.resId"
          @click="handleMute"
        ></el-button>
        <el-button
          icon="h-icon-delete"
          size="mini"
          v-if="member.resId !== vertoLoginInfo.resId && isHangupStatus"
          @click="handleDeleteMemeber(member.resId)"
        ></el-button>
      </div>
      <div
        class="await-calling-status"
        v-if="member.resId !== vertoLoginInfo.resId && !member.isChatting"
      >
        呼叫中...
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex';
import callPanelMixin from '@/mixins/InfoCenter/callPanelMixin';
import {modGroup} from '@/api/InfoCenter/infoCenter';
export default {
  name: 'SwipeMembers',
  mixins: [callPanelMixin],
  data() {
    return {
      // swipeMembers:[]
    };
  },
  computed: {
    ...mapState([
      'vertoLoginInfo',
      'groupUsers',
      'curChatResId',
      'chatUsers',
      'audioStatus',
      'curChatingMembers'
    ]),
    // 创建者放在第一位
    sortMembers() {

      const { resId } = this.vertoLoginInfo;
      let groupMembers = this.groupUsers[this.curChatResId] || [];
      const { creator } = this.chatUsers[this.curChatResId] || {};
      groupMembers = [creator || resId, ...groupMembers].filter(Boolean);
      const members= [...new Set(groupMembers)].map(i=>{

        return {
          ...this.chatUsers[i],
          resId:i,
          status:this.audioStatus,
          isChatting:!this.isCallingStatus
        }
      })
      return members;
    },
    muteIcon() {
      return this.isMute ? 'h-icon-talk_off' : 'h-icon-talk_on';
    },
    swipeMembers() {
      if ((this.isCallingStatus || this.isChatingStatus)&&this.chatUsers[this.curChatResId]&& this.chatUsers[this.curChatResId].isGroup) {

        // 过滤通话状态非挂断状态的数据
        const listener = this.curChatingMembers.filter(
          i => i.status !== 'hangup'
        );
        const members = listener.map(i => {
          const { status, resId } = i;
          const { name,deptPath,displayNumber } = this.chatUsers[resId] || {};
          let statusStr = '呼叫中';
          let isChatting = false;

          // 已接听状态
          if (status === 'answered') {
            statusStr = '通话中';
            isChatting = true;
          }

          return {
            ...this.chatUsers[resId],
            resId,
            name,
            statusStr,
            isChatting
          };
        });
        return members;
      }else{
        return this.sortMembers;
      }
    }
  },
  watch: {
    audioStatus() {}
  },
  methods: {
    ...mapMutations(['updateChatGroupUsers']),
    // 删除群组成员

    async handleDeleteMemeber(data) {
      const { curChatResId, groupUsers } = this;
      const newGroup = groupUsers[curChatResId].filter(i => i !== data);
      const names=newGroup.map(item=>{
        return this.chatUsers[item].name
      })
      const groupName=names.length>1?names[0]+','+names[1]+'...':names[0]+'...';
      // const groupName
      // 接口删除相关成员
      await modGroup({
          addMembers: '',
          groupId: curChatResId,
          name: groupName,
          delMembers: data,
          resId: this.vertoLoginInfo.resId
        });

      this.updateChatGroupUsers({ [curChatResId]: newGroup });
    }
  }
};
</script>
<style lang="scss" scoped>
@mixin shortSpanWidth {
  width: 50px;
}
@mixin longSpanWidth {
  width: 70px;
}
.swipe-members {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .member-item {
    position: relative;
    width: 210px;
    height: 48px;
    margin-bottom: 12px;
    background: #f8fbff;
    border-radius: 2px;
    border: 1px solid #39a6fa;
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    &:hover {
      background: #e9f3ff;
    }
    .member-name-code {
      width: 63px;
      height: 46px;
      font-size: 14px;
      padding-left: 11px;
      color: #4d4d4d;
      &.current-user {
        background: linear-gradient(270deg, #43b7fc 0%, #2080f7 100%);
        color: #fff;
      }
    }
    &:nth-child(3n) {
      margin-right: 0;
    }
    .member-phone-department {
      margin-top: 5px;
      width: 85px;
      height: 36px;
      padding-left: 11px;
      border-left: 1px dotted #7ab8ff;
      &.no-left-border {
        border-color: transparent;
      }
    }
    .member-operation {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 60px;
    }
    .column-flex {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-content: center;
    }
    .name,
    .code {
      @include shortSpanWidth;
    }
    .phone,
    .department {
      @include longSpanWidth;
    }
    .await-calling-status {
      position: absolute;
      top: 11px;
      left: 63px;
      right: 0;
      height: 24px;
      line-height: 24px;
      background: rgba(77, 75, 75, 0.6);
      color: #fff;
      text-align: center;
    }
  }
}
</style>