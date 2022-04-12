<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-03-01 18:52:45
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-05-17 09:52:19
-->
<template>
  <div class="around-video-point">
    <div class="around-video-point-title">附近视频点位</div>
    <div class="around-video-point-selectPane">
      距离事发地点
      <el-select v-model="distanceVal" style="width: 90px; margin: 0 6px">
        <el-option
          v-for="item in distanceOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      以内点位
      <el-button type="info" style="margin-left: 8px" @click="playVideos">
        视频播放
      </el-button>
    </div>
  </div>
</template>

<script>
import { distanceOptions } from '@/components/alarm-command/alarmListConstant';
import { mapState } from 'vuex';
export default {
  name: 'AroundVideoPoint',
  data() {
    return {
      distanceVal: '50',
      distanceOptions
    };
  },
  computed: {
    ...mapState(['alarmMesStatus'])
  },
  methods: {
    playVideos() {
      if (sessionStorage.getItem('alarmDetailVisible') !== 'true') {
        this.$message.warning('请先选中一条警情！');
        return;
      }
      this.bus.$emit('openVideoList', this.distanceVal);
    }
  }
};
</script>

<style lang="scss" scoped>
.around-video-point {
  width: 380px;
  height: 82px;
  background: #ffffff;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  position: absolute;
  z-index: 999;
  right: 6px;
  top: 55px;
  &-title {
    width: 100%;
    font-size: 14px;
    color: #4d4d4d;
    font-weight: bold;
    text-indent: 12px;
    margin-top: 16px;
  }
  &-selectPane {
    display: flex;
    align-items: center;
    padding-left: 12px;
  }
}
</style>
