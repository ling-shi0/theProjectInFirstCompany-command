<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-06-01 17:10:33
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-06-04 14:14:09
-->
<template>
  <DraggableDiv>
    <div class="audio-call-pane" v-if="paneVisible">
      <div class="audio-call-pane-isCalling" v-if="audioStatus === AUDIO_CHATING">
        <Carousel :carouselData="carouselData" :carouselItem="AudioItem"></Carousel>
        <div class="audio-call-pane-isCalling-time">{{'00:00'}}</div>
      </div>
      <div class="audio-call-pane-waiting" v-else>
        <div class="audio-call-pane-waiting-selfImg"><img :src="personIcon" style="width: 100%;height:100%"></div>
        {{ statusContent }}
      </div>
      <div class="audio-call-pane-buts">
        <div v-if="cancelCall && !isRuning" @click.stop="cancelAndHangOff">
          <img src="~@/assets/images/audio/hangOff.png">
          取消
        </div>
        <div v-if="audioStatus === AUDIO_CHATING" @click.stop="stopVoice">
          <img src="~@/assets/images/audio/openVoice.png" v-if="voiceStatus">
          <img src="~@/assets/images/audio/closeVoice.png" v-else>
          静音
        </div>
        <div v-if="audioStatus === AUDIO_CHATING"  @click.stop="cancelAndHangOff">
          <img src="~@/assets/images/audio/hangOff.png">
          挂断
        </div>
      </div>
    </div>
  </DraggableDiv>
</template>

<script>
import {
  AUDIO_CALLING,
  AUDIO_ANSWERING,
  AUDIO_CHATING,
  AUDIO_END
} from '@/constants';
import Carousel from './Carousel'
import AudioItem from './audioItem'
import personIcon from '@/assets/images/audio/personIcon.png'
import { mapState, mapMutations } from 'vuex';
import CallPanelMixin from '@/mixins/InfoCenter/callPanelMixin';
import communicateMixin from '@/mixins/InfoCenter/communicateMixin';
import DraggableDiv from "@/components/common/draggableDiv"

export default {
  name: 'AudioCallPane',
  data() {
    return {
      callStatus: false,
      AudioItem,
      paneVisible: false,
      AUDIO_ANSWERING,
      AUDIO_CALLING,
      AUDIO_CHATING,
      personIcon,
      voiceStatus: true,
      cancelCall: true,
      statusContent: '正在等待接受...',
      carouselData: []
    }
  },
  mixins: [CallPanelMixin, communicateMixin],
  computed: {
    ...mapState([
      'showAudioPanel',
      'audioStatus',
      'curChatingMembers'
    ]),
  },
  components: {
    Carousel,
    DraggableDiv
  },
  watch: {
    curChatingMembers(val) {
      val && val.forEach(item => {
        for(let i = 0;i < this.carouselData.length;i++) {
          if(item.number === this.carouselData[i].number) {
            this.$set(this.carouselData[i],'status',item.status)
            break;
          }
        }
      })
    },
    chatUsers(val) {
      this.carouselData.length = 0;
      for(let i in val) {
        if(!val[i].isGroup) {
          val[i].status = ''
          this.carouselData.push(val[i])
        }
      }
    },
    audioStatus(val) {
      if(val === 'isRuning') {
        this.paneVisible = true
      }
      if(val === AUDIO_CHATING) {
        this.cancelCall = false
      }
      if(val === AUDIO_END) {
        this.statusContent = this.hangupStatus;
        this.cancelCall = false;
        setTimeout(() => {
          this.paneVisible = false;
          this.statusContent = '正在等待接受...';
          this.cancelCall = true;
        },3000)
      }
    }
  },
  methods: {
    stopVoice() {
      this.voiceStatus = !this.voiceStatus
      this.handleMute();
    },
    cancelAndHangOff() {
      this.handleHangup();
      this.paneVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.audio-call-pane {
  width: 354px;
  height: 500px;
  background: rgb(11,16,24);
  border-radius: 8px;
  &-waiting {
    width: 100%;
    height: 393px;
    text-align: center;
    color: white;
    padding-top: 116px;
    &-selfImg {
      width: 96px;
      height: 96px;
      margin: 0 auto 115px;
    }
  }
  &-isCalling {
    width: 100%;
    height: 393px;
    position: relative;
    &-time {
      width: 100%;
      height: 26px;
      position: absolute;
      bottom: 0;
      left: 0;
      text-align: center;
      color: #fff;
    }
  }
  &-buts {
    display: flex;
    justify-content: space-around;
    align-items: center;
    color: white;
    > div {
      width: 48px;
      height: 80px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      > img {
        margin-bottom: 6px;
      }
    }
  }
}
</style>
