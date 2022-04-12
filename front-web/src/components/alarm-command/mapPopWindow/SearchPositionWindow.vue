<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-03-12 14:37:49
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-06-01 14:26:32
-->
<template>
  <div class="search-position-window">
    <div class="search-position-window-title" :title="getTitleName()">
      {{ getTitleName() }}
    </div>
    <div :title="getPositionName()">
      {{ getPositionName() }}
    </div>
    <el-button
      type="link"
      icon="h-icon-location"
      class="search-position-window-but"
      @click="setAlarmPosition"
      v-if="
        paneData.type === 'searchPosition' ||
        paneData.type === 'manualConfineCenter'
      "
    >
      设置为警情位置
    </el-button>
    <el-button
      type="link"
      icon="h-icon-liveview"
      class="search-position-window-but"
      style="margin-left: 64px"
      v-if="
        ['searchPoint', 'spdw', 'searchARPoint', 'argd', 'jhargd'].indexOf(
          paneData.type
        ) > -1
      "
      @click="showVideos"
    >
      播放视频
    </el-button>
    <i class="h-icon-close" @click="closeComponent"></i>
  </div>
</template>

<script>
export default {
  name: 'SearchPositionWindow',
  props: {
    paneData: {
      type: Object,
      default: () => {}
    }
  },
  mounted() {
    console.log(this.paneData);
  },
  methods: {
    closeComponent() {
      this.$emit(
        'closeComponent',
        this.paneData.type === 'searchPosition' ||
          this.paneData.type === 'alarmCenterPosition' ||
          this.paneData.type === 'manualConfineCenter'
      );
    },
    setAlarmPosition() {
      if (!sessionStorage.getItem('alarmDetailVisible')) {
        this.$message.warning('请先选中一条警情！');
        return;
      }
      this.bus.$emit('setAlarmPosition', {
        address: this.paneData.address || this.paneData.alarmComment,
        latitude: this.paneData.latitude,
        longitude: this.paneData.longitude,
        name: this.paneData.name || this.paneData.alarmSituationAddress,
        type: 3
      });
    },
    showVideos() {
      if (
        this.paneData.type === 'searchARPoint' ||
        this.paneData.type === 'argd' ||
        this.paneData.type === 'jhargd'
      ) {
        let indexCode = this.paneData.indexCode || this.paneData.address;
        this.bus.$emit('goToArPage', { indexCode });
      } else {
        this.bus.$emit('openVideoFromMapPoint', this.paneData);
      }
    },
    getLocation() {
      let longitude = this.paneData.longitude;
      let latitude = this.paneData.latitude;
      if (longitude && latitude) {
        return (
          '(' +
          ('' + longitude).slice(0, 7) +
          ',' +
          ('' + latitude).slice(0, 7) +
          ')'
        );
      } else {
        return '未知经纬度';
      }
    },
    getTitleName() {
      if (
        this.paneData.type === 'searchPosition' ||
        this.paneData.type === 'manualConfineCenter'
      ) {
        return (
          (this.paneData.name || this.paneData.alarmSituationAddress) +
          this.getLocation()
        );
      } else {
        return this.getLocation();
      }
    },
    getPositionName() {
      const nameMap = {
        alarmCenterPosition: 'alarmSituationAddress',
        searchPoint: 'nameStr',
        searchPosition: 'address',
        spdw: 'name'
      };
      return (
        (nameMap[this.paneData.type] &&
          this.paneData[nameMap[this.paneData.type]]) ||
        this.paneData.alarmComment
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.search-position-window {
  width: 266px;
  height: 108px;
  position: relative;
  background: #ffffff;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.29);
  border-radius: 4px;
  padding-top: 30px;
  &::after {
    content: '';
    width: 10px;
    height: 6px;
    border: 10px solid;
    border-color: white transparent transparent transparent;
    position: absolute;
    bottom: -18px;
    left: calc(50% - 10px);
  }
  > i {
    position: absolute;
    top: 6px;
    right: 6px;
    font-size: 1.5em;
    cursor: pointer;
  }
  > div {
    width: 100%;
    height: 40%;
    text-indent: 14px;
    font-size: 14px;
    color: #4d4d4d;
    @include utils-ellipsis();
    line-height: 40px;
    padding-right: 8px;
  }
  &-but {
    margin-left: 50px;
  }
  &-title {
    position: absolute;
    top: 6px;
    left: 6px;
    width: 90% !important;
    font-size: 14px;
    text-align: left;
    text-indent: 7px !important;
    line-height: 24px !important;
    font-weight: bold;
    @include utils-ellipsis();
    line-height: 40px;
  }
}
</style>
