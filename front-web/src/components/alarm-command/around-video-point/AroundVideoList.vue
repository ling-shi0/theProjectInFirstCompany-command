<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-03-09 15:36:52
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-04-08 16:02:25
-->
<template>
  <div class="around-video-list">
    <div class="around-video-list-pointList">
      <point-list
        :visible="pointListVisible"
        @closePointList="closePointList"
        :distance="videoListDistance"
        :popVideoShow="popVideoData"
      ></point-list>
    </div>
    <div class="around-video-list-videoList">
      <video-list
        :visible="videoListVisible"
        @closeVideoList="closeVideoList"
        @openPointList="openPointList"
      ></video-list>
    </div>
  </div>
</template>

<script>
import PointList from './PointList';
import VideoList from './VideoList';
export default {
  name: 'AroundVideoList',
  data() {
    return {
      pointListVisible: false,
      videoListVisible: false,
      videoListDistance: '',
      popVideoData: {}
    };
  },
  mounted() {
    this.bus.$on('openVideoList', data => {
      this.pointListVisible = true;
      this.videoListVisible = true;
      this.videoListDistance = data;
    });
    this.bus.$on('openVideoFromMapPoint', data => {
      this.pointListVisible = true;
      this.videoListVisible = true;
      this.$set(this, 'popVideoData', data.data || data);
    });
  },
  components: {
    PointList,
    VideoList
  },
  methods: {
    closePointList() {
      this.pointListVisible = false;
    },
    closeVideoList() {
      this.videoListVisible = false;
      this.pointListVisible = false;
    },
    openPointList() {
      this.pointListVisible = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.around-video-list {
  width: 596px;
  height: 77%;
  position: absolute;
  right: 6px;
  top: 17%;
  pointer-events: none;
  display: flex;
  z-index: 200;
  &-pointList {
    width: 250px;
    height: 100%;
    margin-right: 4px;
  }
  &-videoList {
    width: 342px;
    height: 100%;
  }
}
</style>