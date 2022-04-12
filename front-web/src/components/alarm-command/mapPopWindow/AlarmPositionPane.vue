<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-03-06 14:40:26
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-06-01 14:06:13
-->
<template>
  <div class="alarm-position-pane">
    <div class="alarm-position-pane-title">
      {{ getPaneTitle() }}
      {{ getLocation() }}
      <i class="h-icon-close" @click="$emit('closeComponent')"></i>
    </div>
    <div
      class="alarm-position-pane-position"
      :title="paneData.name || paneData.alarmSituationAddress"
    >
      {{ paneData.name || paneData.alarmSituationAddress }}
    </div>
    <div class="alarm-position-pane-advise" :title="paneData.address">
      {{ paneData.address }}
    </div>
    <!-- <div class="alarm-position-pane-normal" v-else>
      <el-button icon="h-icon-delete" type="link" @click="deleteAlarmPosition">
        删除
      </el-button>
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'AlarmPositionPane',
  props: {
    paneData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {};
  },
  methods: {
    getPaneTitle() {
      const typeMap = {
        phonePosition: '手机定位',
        scencePosition: '现场处置定位',
        mapStorePosition: '地址库解析定位',
        artificialPosition: '手动定位'
      };
      return typeMap[this.paneData.type];
    },
    deleteAlarmPosition() {
      this.bus.$emit('deleteAlarmPosition', {
        alertId: this.paneData.alertId,
        type: 3
      });
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
    }
  }
};
</script>

<style lang="scss" scoped>
.alarm-position-pane {
  width: 266px;
  height: 100px;
  background: #ffffff;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.29);
  border-radius: 4px;
  position: relative;
  &::after {
    content: '';
    width: 8px;
    height: 8px;
    border-style: solid;
    border-width: 8px;
    border-color: white transparent transparent transparent;
    position: absolute;
    top: 100px;
    left: calc(50% - 8px);
  }
  &-title {
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
    font-size: 14px;
    color: #4d4d4d;
    font-weight: bold;
    > i {
      font-size: 1.5rem;
      cursor: pointer;
    }
  }
  &-position {
    width: 100%;
    height: 26px;
    padding-left: 8px;
    font-size: 14px;
    @include utils-ellipsis();
    padding-right: 8px;
  }
  &-advise {
    width: 100%;
    height: 26px;
    padding-left: 8px;
    font-size: 14px;
    @include utils-ellipsis();
    padding-right: 8px;
  }
  &-normal {
    display: flex;
    width: 100%;
    height: 35px;
    align-items: center;
    justify-content: center;
  }
}
</style>
