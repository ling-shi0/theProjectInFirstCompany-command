<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: caokeke
 * @Date: 2021-03-02 11:06:09
 * @LastEditors: caokeke
 * @LastEditTime: 2021-04-25 14:43:09
-->
<template>
  <div class="audio-play">
    <audio
      ref="audio"
      preload
      @pause="handlePause"
      @play="handleTimeProgress"
      @canplay="computedFullTime"
      :src="audioUrl"
    ></audio>
    <div class="control-btn" @click="playStatusChange">
      <!-- <div class="stop"></div> -->
      <div :class="playStatus ? 'play' : 'stop'"></div>
    </div>
    <div class="control-line">
      <div ref="fullLine" class="bottom-line">
        <div class="played-line" :style="scaleProgress"></div>
        <div ref="point" class="play-point" @mousedown="handleMouseDown">
          <div class="point"></div>
        </div>
        <div class="played-time">{{ playTime }}</div>
      </div>
      <div class="al-time">{{ fullTime }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      playStatus: false,
      value: 0,
      playTime: '00:00:00',
      fullTime: '',
      scale: null,
      timer: null
    };
  },
  props: {
    audioUrl: {
      type: String,
      default:
        'http://ws.stream.qqmusic.qq.com/C400003mAan70zUy5O.m4a?guid=2992292616&vkey=B5C8B6B1C12845CB7CF557912B9CFB85EE4D833A8519E12AF6C130BE897C98A06883C98BE78665E7E03106B2DC086FEDE71F61602D4D971D&uin=0&fromtag=3&r=2381958024914559'
    }
  },
  computed: {
    scaleProgress() {
      if (this.scale) {
        return 'width:' + this.scale * 100 + '%';
      } else {
        return 'width:0';
      }
    }
  },
  components: {},
  methods: {
    handleMouseDown(ev) {
      const that = this;
      const downX = ev.pageX;
      const downL = this.$refs.point.offsetLeft;
      document.onmousemove = ev => {
        let scale =
          (ev.pageX - downX + downL + 8) / that.$refs.fullLine.offsetWidth;
        if (scale < 0) {
          scale = 0;
        } else if (scale > 1) {
          scale = 1;
        }
        that.scale = scale;
        that.$refs.audio.currentTime = scale * that.$refs.audio.duration;
        that.playTime = that.formatTime(that.$refs.audio.currentTime);
      };
      document.onmouseup = () => {
        document.onmousemove = document.onmouseup = null;
      };
      ev.preventDefault();
    },
    computedFullTime() {
      this.fullTime = this.formatTime(this.$refs.audio.duration);
    },
    playStatusChange() {
      this.playStatus = !this.playStatus;
      if (this.playStatus) {
        this.$refs.audio.play();
      } else {
        this.$refs.audio.pause();
      }
    },
    handlePause() {
      this.playStatus = false;
      clearInterval(this.timer);
    },
    handleTimeProgress() {
      this.timer = setInterval(this.playing, 1000);
    },
    playing() {
      // 正在播放中
      this.scale = this.$refs.audio.currentTime / this.$refs.audio.duration;
      this.playTime = this.formatTime(this.$refs.audio.currentTime);
    },
    formatTime(val) {
      val = Math.round(val);
      const min = Math.floor(val / 60);
      const sec = val % 60;
      return this.setZero(min) + ':' + this.setZero(sec);
    },
    setZero(val) {
      if (val < 10) {
        return '0' + val;
      } else {
        return '' + val;
      }
    }
  }
};
</script>

<style lang="less">
.audio-play {
  height: 18px;
  width: 286px;
  margin-left: 8px;
  display: flex;
  .control-btn {
    height: 18px;
    width: 18px;
    .play {
      height: 18px;
      width: 18px;
      background: url('~@/assets/images/alarmCommand/stop.png');
    }
    .stop {
      height: 18px;
      width: 18px;
      background: url('~@/assets/images/alarmCommand/play.png');
    }
  }
  .control-line {
    width: 260px;
    margin-left: 6px;
    .al-time {
      float: right;
      opacity: 0.6;
      font-family: PingFangSC-Semibold;
      font-size: 12px;
      color: #78aaff;
      margin-top: 4px;
    }
    .bottom-line {
      display: flex;
      position: relative;
      margin-top: 8px;
      height: 4px;
      width: 260px;
      background: rgba(5, 124, 255, 0.13);
      border-radius: 2px;
      .played-line {
        background-image: linear-gradient(90deg, #43b7fc 0%, #2080f7 93%);
        border-radius: 2px;
        height: 4px;
        // width: 20%;
      }
      .played-time {
        position: absolute;
        opacity: 0.6;
        font-family: PingFangSC-Semibold;
        font-size: 12px;
        color: #78aaff;
        left: -18px;
        top: 10px;
      }
      .play-point {
        position: relative;
        height: 10px;
        width: 10px;
        background: #ffffff;
        border: 1px solid #2080f7;
        border-radius: 5px;
        margin-left: -5px;
        margin-top: -3px;
        .point {
          background: #7fbcff;
          height: 4px;
          width: 4px;
          margin: 2px;
          border-radius: 2px;
        }
      }
    }
  }
}
</style>
