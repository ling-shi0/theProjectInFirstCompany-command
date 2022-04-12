<template>
  <div class="voice" @click="startPlayOrPause()">
    <img id="" :src="playgif" class="voice-left" />
    <audio
      ref="audio"
      controls
      hidden="true"
      @canplay="getDuration"
      @pause="onPause()"
      @play="onPlay()"
    >
      <source :src="this.audioSrc" type="audio/mpeg" />
    </audio>
    <span>{{ duration }}“</span>
  </div>
  <!-- <audio controls="controls" ref='audio' :src="musicUrl"></audio> -->
  <!-- <audio>
        <source src="/static/video/test.mp3" autoplay loop type="audio/mpeg">
      </audio> -->
  <!-- <audio src="/static/video/test.mp3" autoplay loop></audio> -->
  <!-- <audio class="audio" src="/static/video/test.mp3" controls autoplay="autoplay" hidden="true"></audio> -->
  <!-- <audio ref="audio" @pause="onPauce" @play="onPlay" src="/static/video/test.mp3" controls hidden="true"> -->
</template>
<script>
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
      src: "",
      audio: { playing: false },
      duration: "",
    };
  },
  mounted() {
    this.playgif = require("@/src/assets/mulit/voice-left.svg");
  },
  methods: {
    getDuration() {
      if (this.$refs.audio) {
        this.duration = Math.ceil(this.$refs.audio.duration);
      }
    },
    startPlayOrPause() {
      this.audio.playing ? this.pause() : this.play();
    },
    play() {
      if (this.$refs.audio) {
        this.$refs.audio.play();
      }
    },
    pause() {
      if (this.$refs.audio) {
        this.$refs.audio.pause();
      }
    },
    onPlay() {
      this.noplay = false;
      this.playing = true;
      this.playgif = require("@/src/assets/mulit/voice-right.gif");
      this.audio.playing = true;
    },
    onPause() {
      this.noplay = true;
      this.playing = false;
      this.playgif = require("@/src/assets/mulit/voice-left.svg");
      this.audio.playing = false;
    },
  },
};
</script>
<style scoped lang="scss">
// .voice-box{
//     margin-top: 6px;
//     overflow-x: auto;
//     display: flex;
.voice {
  background: rgba(2, 122, 255, 0.08);
  border-radius: 16px;
  padding: 6px 8px;
  font-size: 14px;
  color: #027aff;
  align-items: center;
  margin-right: 10px;
  display: inline;
  .voice-left-no {
    width: 22px;
    height: 12px;
    margin-right: 10px;
    background: url("~@/src/assets/mulit/voice-left.svg");
  }
  .voice-left-yes {
    width: 22px;
    height: 12px;
    margin-right: 10px;
    background: url("~@/src/assets/mulit/voice-right.svg");
  }
  .voice-left {
    width: 22px;
    height: 12px;
    margin-right: 10px;
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

.main {
  width: 12px;
  height: 20px;
  // background: url("/static/video/weixin.png");
  background-size: 36px;
  animation: sprite5 1s steps(3) infinite;
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
