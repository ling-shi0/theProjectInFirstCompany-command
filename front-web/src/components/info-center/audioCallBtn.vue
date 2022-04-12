<template>
  <div
    class="audio-call-btn-wrap"
    @click="setMoreCallInfo"
    :class="{ disabled: !vertoLoginInfo.resId }"
  >
    <div class="text">语音群呼</div>
    <div class="audio-icon" v-if="isCallingStatus || isChatingStatus">
      <i class="h-icon-talk_on"></i>
    </div>
  </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex';
import callPanelMixin from '@/mixins/InfoCenter/callPanelMixin';
export default {
  name: 'AudioCallBtn',
  computed: {
    ...mapState(['showAudioPanel', 'vertoLoginInfo'])
  },
  mixins: [callPanelMixin],
  methods: {
    ...mapMutations([
      'setDisplayAudioPanel',
      'setCurChatResId',
      'updateChatUsers',
      'updateChatGroupUsers'
    ]),
    setMoreCallInfo() {
      if (this.vertoLoginInfo.resId) {
        if (this.showAudioPanel && this.isHangupStatus) {
          // 删除群组
          this.handleDeleteGroup({
            groupId: this.curChatResId,
            resId: this.vertoLoginInfo.resId
          });
        } else if (!this.showAudioPanel && this.isHangupStatus) {
          // 创建群组
          this.handleCreateGroup({
            creator: this.vertoLoginInfo.resId,
            members: this.vertoLoginInfo.resId,
            name: this.vertoLoginInfo.name + '...'
          });
        }
        this.setDisplayAudioPanel(!this.showAudioPanel);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.audio-call-btn-wrap {
  position: absolute;
  top: 0;
  right: 0;
  width: 72px;
  height: 72px;
  background-image: linear-gradient(
    180deg,
    #1f9fec 0%,
    #0173d7 66%,
    #83b2ee 100%
  );
  border-radius: 40px;
  border-radius: 40px;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.04), 0 2px 4px 0 rgba(0, 0, 0, 0.12);
  z-index: 1001;
  cursor: pointer;
  &.disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
  .text {
    height: 24px;
    line-height: 24px;
  }
  .audio-icon {
    font-size: 16px;
  }
  &:hover {
    background-image: linear-gradient(
      180deg,
      #3bb6ff 0%,
      #0d8efd 66%,
      #a4cdff 100%
    );
  }
}
</style>