<template>
  <div class="video-panel" v-show="showVideoPanel">
    <!-- 本地视频和远程视频 -->
    <div class="J-chat-video-wrap"></div>
    <video id="localWebcam" class="video" autoplay="autoplay"></video>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState(['showVideoPanel'])
  }
};
</script>