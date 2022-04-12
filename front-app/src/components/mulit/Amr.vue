<template>
  <div class="voice" @click="play()">
    <img id="" :src="playgif" class="voice-left" />
    <!-- <div class="audio" /> -->
    <!-- <audio
      ref="audio"
      :src="this.audioSrc"
      controls
      hidden="true"
      @canplay="getDuration"
      @pause="onPause()"
      @play="onPlay()"
    >该浏览器暂不支持音频播放</audio> -->
    <span>{{ duration }}“</span>
  </div>
</template>
<script>
import BenzAMRRecorder from "benz-amr-recorder";

export default {
  props: {
    audioSrc: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      noplay: true,
      playing: false,
      playgif: "",
      src: "/static/video/test.mp3",
      audio: { playing: false },
      duration: "",
      amr: "",
    };
  },
  mounted() {
    this.amr = new BenzAMRRecorder();
    let self = this;
    this.playgif = require("@/src/assets/mulit/voice-left.svg");
    this.amr.initWithUrl(this.audioSrc).then(function () {
      self.duration = Math.ceil(self.amr.getDuration());
    });

    // 播放
    this.amr.onPlay(function () {
      self.playgif = require("@/src/assets/mulit/voice-right.gif");
      console.log(this.playgif);
      console.log("开始播放");
    });
    // 停止（包括播放结束）
    this.amr.onStop(function () {
      self.playgif = require("@/src/assets/mulit/voice-left.svg");
      console.log("停止播放");
    });
    // 播放结束
    this.amr.onEnded(function () {
      self.playgif = require("@/src/assets/mulit/voice-left.svg");
      console.log("播放结束");
    });
  },
  methods: {
    play() {
      if (this.amr.isPlaying()) {
        this.amr.stop();
      } else {
        this.amr.play();
      }
    },
    // getDuration () {
    //     this.duration = Math.ceil(amr.getDuration());
    // },
    // startPlayOrPause () {
    //     this.audio.playing ? this.pause() : this.play();
    // },
    // play () {
    //     this.$refs.audio.play();
    // },
    // pause () {
    //     this.$refs.audio.pause();
    // },
    // onPlay () {
    //     this.noplay = false;
    //     this.playing = true;
    //     this.playgif = require('@/src/assets/mulit/voice-right.gif');
    //     this.audio.playing = true;
    // },
    // onPause () {
    //     this.noplay = true;
    //     this.playing = false;
    //     this.playgif = require('@/src/assets/mulit/voice-left.svg');
    //     this.audio.playing = false;
    // }
  },
};
</script>
<style scoped lang="scss">
// .voice-box{
//     margin-top: 6px;
//     overflow-x: auto;
//     display: flex;
.voice {
  width: 100%;
  height: 100%;
  background: rgba(2, 122, 255, 0.08);
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  & span {
    position: absolute;
    bottom: 0.1675rem;
    right: 0.1675rem;
    width: 3rem;
    height: 1.1rem;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    border-radius: 2px;
    text-align: center;
    line-height: 1.1675rem;
    font-size: 0.8325rem;
  }
  // .voice-left-no {
  //   width: 22px;
  //   height: 12px;
  //   margin-right: 10px;
  //   background: url("~@/src/assets/mulit/voice-left.svg");
  // }
  // .voice-left-yes {
  //   width: 22px;
  //   height: 12px;
  //   margin-right: 10px;
  //   background: url("~@/src/assets/mulit/voice-right.svg");
  // }
  .voice-left {
    width: 22px;
    height: 12px;
    // margin-right: 10px;
    .closeAudio {
      position: absolute;
      right: -0.4rem;
      top: -0.4rem;
      width: 2rem;
      height: 2rem;
    }
  }
  .voice-right {
    width: 16px;
    height: 20px;
    margin-left: 3px;
  }
}

@keyframes sprite5 {
  0% {
    background-position: 0 0;
  }

  100% {
    background-position: -36px 0;
  }
}

// }
</style>
