<!--
  视频插件使用vue-video-player
  npm i vue-video-player -D
  npm i -S video.js
  npm install --save mux.js
  在main.js中引入
  import VideoPlayer from 'vue-video-player'
  require('video.js/dist/video-js.css')
  require('vue-video-player/src/custom-theme.css')
  Vue.use(VideoPlayer)
  @see https://blog.csdn.net/weixin_38684316/java/article/details/88070737
-->
<template>
  <div class="player">
    <!-- <img
      src="static/map/map_mj_ml.svg"
      class="delete"
      @click="closeVideo"
    > -->
    <video-player
      ref="videoPlayer"
      class="video-player vjs-custom-skin"
      :playsinline="true"
      style="object-fit: fill"
      :options="playerOptions"
      :x5-video-player-fullscreen="true"
      @pause="onPlayerPause($event)"
      @play="onPlayerPlay($event)"
      @fullscreenchange="onFullscreenChange($event)"
      @click="fullScreen"
    />
  </div>
</template>
<script>
import { videoPlayer } from "vue-video-player";

export default {
  components: {
    videoPlayer,
  },
  props: {
    closeVideo: {
      type: Function,
      default: null,
    },
    videoInfo: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      // pictureImg: test,
      playerOptions: {
        //        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: false, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: this.videoInfo.videoType,
            src: this.videoInfo.filePath,
          },
        ],
        poster: this.videoInfo.firstFramePath,
        width: document.documentElement.clientWidth,
        notSupportedMessage: "此视频暂无法播放，请稍后再试", // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          // timeDivider: true,
          // durationDisplay: true,
          // remainingTimeDisplay: false,
          fullscreenToggle: true, // 全屏按钮
        },
      },
    };
  },
  watch: {
    videoInfo: {
      handler() {
        if (this.videoInfo !== null || this.videoInfo !== undefined) {
          this.playerOptions.sources[0].type = this.videoInfo.type;
          this.playerOptions.sources[0].src = this.videoInfo.url;
          this.playerOptions.poster = this.videoInfo.firstFrame;
          console.log(this.videoInfo.showPreVideo);
          if (!this.videoInfo.showPreVideo) {
            this.showPause();
          }
        }
      },
      deep: true,
    },
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player;
    },
  },
  methods: {
    fullScreen() {
      const player = this.$refs.videoPlayer.player;
      player.requestFullscreen(); // 调用全屏api方法
      player.isFullscreen(true);
      player.play();
    },
    onPlayerPlay(player) {
      player.play();
    },
    onPlayerPause(player) {
      console.log("ddddddddddddddd");
    },
    showPause() {
      this.$refs.videoPlayer.player.pause();
    },
    childcloseVideo() {
      this.closeVideo();
    },
  },
};
</script>
<style scoped lang="scss">
.delete {
  width: 20px;
  height: 20px;
  border-radius: 60%;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 30;
}
</style>
