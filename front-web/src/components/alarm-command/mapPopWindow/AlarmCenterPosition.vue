<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-03-12 14:37:49
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-06-01 15:18:06
-->
<template>
  <div class="search-position-window">
    <div class="search-position-window-title" :title="getTitleName()">
      {{ getTitleName() }}
    </div>
    <div>
      {{ getPositionName() }}
    </div>
    <i class="h-icon-close" @click="closeComponent"></i>
  </div>
</template>

<script>
export default {
  name: 'AlarmCenterPosition',
  props: {
    paneData: {
      type: Object,
      default: () => {}
    }
  },
  mounted() {
    if (!sessionStorage.getItem('alarmDetailVisible')) {
      console.log(this.paneData);
      this.bus.$emit('openNewAlarmDetail', this.paneData);
    }
  },
  methods: {
    closeComponent() {
      this.$emit('closeComponent');
    },
    getLocation() {
      if (this.paneData.longitude && this.paneData.latitude) {
        return (
          '(' +
          ('' + this.paneData.longitude).slice(0, 7) +
          ',' +
          ('' + this.paneData.latitude).slice(0, 7) +
          ')'
        );
      } else {
        return '未知经纬度';
      }
    },
    getTitleName() {
      if (this.paneData.type === 'searchPosition') {
        return this.paneData.name + this.getLocation();
      } else {
        return this.getLocation();
      }
    },
    getPositionName() {
      return this.paneData.alarmSituationAddress;
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
