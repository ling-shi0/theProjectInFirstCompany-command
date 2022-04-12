<template>
  <div class="audio-panel" v-if="showAudioPanel" ref="audioPanel">
    <div class="operation-wrap">
      <SearchInput></SearchInput>

      <el-button
        class="P140"
        @click="selectAudioMemberByMap"
        :disabled="selectedPersonByMapDisabled"
        v-if="!selectMemberByMap"
      >
        地图选人
      </el-button>
      <el-button class="P140" v-else @click="exitSelectAudioMemberByMap">
        退出地图选人
      </el-button>
      <i
        class="h-icon-arrow_right go-back-btn"
        @click.stop="deleteAudioChat"
      ></i>
      <!-- <div class="answer-operate-action" v-if="isAnsweringStatus">
        <el-button type="primary" @click="handleAnswer">接听</el-button>
        <el-button @click="handleHangup">挂断</el-button>
      </div> -->
    </div>
    <div class="line"></div>
    <div class="audio-members">
      <SwipeMembers></SwipeMembers>
    </div>
    <div class="pane-footer">
      <el-button
        v-if="isHangupStatus || isRuning"
        :disabled="curChatResId && groupUsers[curChatResId].length < 2"
        type="primary"
        class="P180"
        @click="handleChatWidthVideoOrAudio()"
      >
        开始语音群聊
      </el-button>
      <el-button
        v-else-if="isCallingStatus"
        type="primary"
        class="P180"
        @click="handleHangup"
      >
        取消
      </el-button>
      <el-button
        v-else-if="isChatingStatus"
        type="primary"
        class="P180"
        @click="handleHangup"
      >
        结束语音群聊
      </el-button>
      <el-button
        v-if="isHangupStatus || isRuning"
        :disabled="curChatResId && groupUsers[curChatResId].length < 2"
        type="primary"
        class="P180"
        @click="handleChatWidthVideoOrAudio(true)"
      >
        视频群呼
      </el-button>
      <el-button
        v-if="isHangupStatus || isRuning"
        :disabled="curChatResId && groupUsers[curChatResId].length < 2"
        type="primary"
        class="P180"
        @click="handleJustWithOther"
      >
        即时讯息
      </el-button>
    </div>
    <div class="chat-runing" v-if="isRuning"><span>通话启动中...</span></div>
  </div>
</template>
<script>
/*eslint-disable no-undef */
import MapUtil from '@/components/map/map-util';
import SwipeMembers from './swipeMembers';
import { mapState, mapMutations } from 'vuex';
import CallPanelMixin from '@/mixins/InfoCenter/callPanelMixin';
import communicateMixin from '@/mixins/InfoCenter/communicateMixin';
import {
  getPersonAll,
  queryPolice,
  getUsersByAcount
} from '@/api/InfoCenter/infoCenter';
import SearchInput from './searchInput';
export default {
  name: 'AudioPanel',
  props: {
    dataProvide: {
      type: Array,
      default: () => {}
    }
  },
  components: {
    SwipeMembers,
    SearchInput
  },
  computed: {
    ...mapState([
      'showAudioPanel',
      'mapObj',
      'chatUsers',
      'curChatResId',
      'audioStatus',
      'vertoLoginInfo',
      'groupUsers'
    ]),
    selectedPersonByMapDisabled() {
      return this.selectMemberByMap && (this.isRuning || this.isWaitStatus);
    }
  },
  mixins: [CallPanelMixin, communicateMixin],
  data() {
    return {
      selectMemberByMap: false
    };
  },

  mounted() {
    // 处置人员弹框中的语音通话
    this.bus.$on('singleAudioChat', data => {
      this.handleChatWidthVideoOrAudio();
    });
    // 删除当前语音群聊
    this.bus.$on('delAudioGroup', data => {
      this.deleteAudioChat();
    });
  },
  methods: {
    ...mapMutations([
      'setCurChatResId',
      'updateChatUsers',
      'updateChatGroupUsers',
      'setDisplayAudioPanel',
      'setAudioStatus',
      'setHangupCauseCode'
    ]),
    // 地图选人
    selectAudioMemberByMap() {
      this.selectMemberByMap = true;
      const that = this;
      this.mapObj.drawSpatialVector({
        type: 'circle',
        strokeWidth: 1,
        drawCallBack: async function (event) {
          console.log(event);
          const polygonWkt = event.wkt;
          const xyArr = polygonWkt.split('(')[2].split(')')[0].split(',');
          let x = 0;
          let y = 0;
          const bbox = [];
          xyArr.forEach((item, index) => {
            if (index === 0 || index === 1) {
              bbox.push(item.split(' ')[0]);
              bbox.push(item.split(' ')[1]);
            }
            x = x + Number(item.split(' ')[0]);
            y = y + Number(item.split(' ')[1]);
          });

          const longitude = parseFloat(x / xyArr.length);
          const latitude = parseFloat(y / xyArr.length);
          const { data } = await queryPolice({
            point: { longitude, latitude },
            bbox: bbox.join(','),
            labelTypes: ['APP']
          });

          if (data && Object.keys(data['APP']).length) {
            const names = (data['APP'] || []).map(item => {
              return item.userId;
            });
            const addMembers = [];
            const addMembersResIds = [];
            for (let i = 0; i < names.length; i++) {
              const { data } = await getUsersByAcount({ account: names[i] });
              if (data) {
                addMembers.push(data);
                addMembersResIds.push(data.resId);
              }
            }

            const members = [
              ...new Set([that.vertoLoginInfo.resId, ...addMembersResIds])
            ];
            if (!that.curChatResId) {
              await that.handleCreateGroup({
                creator: that.vertoLoginInfo.resId,
                members: members.join(','),
                name: that.vertoLoginInfo.name + '...'
              });
            } else {
              addMembers.length && (await that.handleAddMember(addMembers));
            }
            that.setDisplayAudioPanel(true);
          } else {
            that.$message({
              type: 'info',
              message: '框选范围内无可调配的警员，请重新选择'
            });
          }
          setTimeout(() => {
            that.mapObj.clearDrawVector();
            that.selectMemberByMap = false;
          }, 800);
        },
        delFeatureBtn: false,
        fillColor: new hmap.style.Color(255, 51, 51, 0.06),
        strokeColor: new hmap.style.Color(255, 51, 51, 1)
      });
    },
    // 退出地图选人
    exitSelectAudioMemberByMap() {
      this.mapObj.stopDrawSpatialVector();
      this.selectMemberByMap = false;
    },
    // 视频/语音聊天
    handleChatWidthVideoOrAudio(useVideo) {
      this.setAudioStatus('isRuning');
      this.setHangupCauseCode('');
      const { number } = this.chatUsers[this.curChatResId];
      this.doChatWithVideoOrAudio(
        { number, resId: this.curChatResId },
        useVideo
      );
    },
    deleteAudioChat() {
      if (this.showAudioPanel && this.isHangupStatus) {
        // 删除群组
        this.handleDeleteGroup({
          groupId: this.curChatResId,
          resId: this.vertoLoginInfo.resId
        });
      }
      this.setDisplayAudioPanel(!this.showAudioPanel);
    },
    // 开启即时通信功能
    handleJustWithOther() {

    }
  }
};
</script>
<style lang="scss" scoped>
.audio-panel {
  position: absolute;
  top: -5px;
  right: 48px;
  z-index: 1000;
  width: 464px;

  background-image: linear-gradient(
    180deg,
    #edf8ff 0%,
    #ffffff 16%,
    #ffffff 81%,
    #ffffff 100%
  );
  border: 1px solid #62a0ff;
  border-radius: 8px;
  padding: 16px;

  .operation-wrap {
    height: 56px;
    display: flex;
    align-items: center;
    .go-back-btn {
      margin-left: 12px;
      display: inline-block;
      font-size: 18px;
      color: #2080f7;
      cursor: pointer;
    }
  }
  .line {
    height: 1px;

    background: rgba(151, 151, 151, 0.35);
  }
  .audio-members {
    padding-top: 9px;
  }
  .chat-runing {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1500;
    background-color: rgba(0, 0, 0, 0.6);
    text-align: center;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: #fff;
    font-size: 18px;
  }
}
.P180 {
  width: 180px;
}
.P140 {
  width: 140px;
}
.answer-operate-action {
  display: inline-block;
}
.pane-footer {
  width: 100%;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
