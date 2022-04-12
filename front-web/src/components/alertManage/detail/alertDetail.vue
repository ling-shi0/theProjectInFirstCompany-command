<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-03-31 09:41:12
 * @LastEditors: caokeke
 * @LastEditTime: 2021-05-08 15:03:09
-->
<template>
  <div class="alert-detail">
    <div class="alert-detail-title">
      <div class="alert-detail-title-top">
        {{ '警情' + alertMes.alarmNo }}
        <i class="h-icon-star" v-if="alertMes.focus === '0'"></i>
        <i class="h-icon-star_f" style="color: #2080f7" v-else></i>
      </div>
      <div class="alert-detail-title-bottom">
        <i>
          <img :src="judgeImgSrc()" />
          <span>{{ alertMes.alarmSituationCategory }}</span>
        </i>
      </div>
    </div>
    <div class="alert-detail-info">
      <div class="alert-detail-info-title">基础信息</div>
      <div class="alert-detail-info-listItem">
        <div class="alert-detail-info-listItem-title">报警电话:</div>
        {{ alertMes.alarmPersonPhone }}
        <div
          v-for="(item, index) in alertMes.alarmPhoneTag &&
          alertMes.alarmPhoneTag.split(',')"
          :key="index"
          class="alert-detail-info-listItem-tag"
        >
          {{ item }}
        </div>
      </div>
      <div class="alert-detail-info-listItem" style="align-items: center">
        <div class="alert-detail-info-listItem-title">报警人员:</div>
        {{ alertMes.alarmPersonName }}
        <el-button
          icon="h-icon-details"
          type="default"
          @click="goToDocument"
          style="margin-left: 130px"
        >
          全息档案
        </el-button>
      </div>
      <div class="alert-detail-info-listItem">
        <div class="alert-detail-info-listItem-title">报警时间:</div>
        {{ alertMes.alarmTime }}
      </div>
      <div class="alert-detail-info-listItem">
        <div class="alert-detail-info-listItem-title">警情地点:</div>
        {{ alertMes.alarmSituationAddress }}
      </div>
      <div class="alert-detail-info-listItem" style="height: 3em">
        <div class="alert-detail-info-listItem-title">警情描述:</div>
        {{ alertMes.alarmComment }}
      </div>
      <div class="alert-detail-info-listItem">
        <div style="display: flex" class="alert-detail-info-listItem-title">
          报警录音:
          <audio-play :audioUrl="alertMes.recordingsNo"></audio-play>
        </div>
      </div>
      <div class="alert-detail-info-listItem">
        <div class="alert-detail-info-listItem-title">受警单位:</div>
        {{ alertMes.jurisdictionalDept }}
      </div>
    </div>
    <div class="alert-detail-map">
      <map-location @mapLoaded="mapLoaded"></map-location>
    </div>
  </div>
</template>

<script>
import low from '@/assets/images/alertManage/alertLow.png';
import poi from '@/assets/images/map/alarmPosition.png';
import middle from '@/assets/images/alertManage/alertMiddle.png';
import high from '@/assets/images/alertManage/alertHigh.png';
import AudioPlay from '@/components/alarm-command/alarm-detail/AudioPlay';
import MapLocation from '@/components/map/map-deploy.vue';
import { getInitConfig } from '@/api/alarmCommand';
export default {
  name: 'AlertDetail',
  props: {
    alertMes: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {};
  },
  components: {
    AudioPlay,
    MapLocation
  },
  methods: {
    mapLoaded(map, mapUtil, clusterLevel) {
      this.map = map;
      this.mapUtil = mapUtil;
      this.alertMes.img = poi;
      debugger;
      this.mapUtil.addPointsToLayer('location', [this.alertMes]);
      this.mapUtil.setMapCenter(this.alertMes);
    },
    judgeImgSrc() {
      let src = '';
      switch (this.alertMes.alarmLevel) {
        case '1': {
          src = low;
          break;
        }
        case '2': {
          src = middle;
          break;
        }
        case '3': {
          src = high;
          break;
        }
        default: {
          src = low;
        }
      }
      return src;
    },
    async goToDocument() {
      const { data } = await getInitConfig();
      const url = data.qxdaAddr + this.alertMes.alarmPersonCertificateNumber;
      if (top === window) {
        window.open(url);
        return false;
      }
      const param = {
        componentId: '',
        componentMenuId: '',
        param: '',
        url,
        name: '全息档案',
        callback: {
          func: '',
          param: {}
        },
        reload: true
      };
      top.window.goToApp(param);
    }
  }
};
</script>

<style lang="scss" scoped>
.alert-detail {
  width: 100%;
  height: 100%;
  &-title {
    width: 90%;
    height: 14%;
    margin: 0 auto;
    border-bottom: 1px dashed rgba(151, 151, 151, 0.35);
    &-top {
      width: 100%;
      height: 60%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 20px;
      color: #4d4d4d;
      font-weight: bold;
    }
    &-bottom {
      width: 100%;
      height: 40%;
      > i {
        position: relative;
        > span {
          font-size: 16px;
          color: #ffffff;
          font-style: normal;
          position: absolute;
          top: -16px;
          left: 20px;
        }
      }
    }
  }
  &-info {
    width: 90%;
    height: 43%;
    margin: 0 auto;
    &-title {
      width: 100%;
      height: 60px;
      font-size: 14px;
      color: #4d4d4d;
      font-weight: bold;
      position: relative;
      line-height: 60px;
      text-indent: 8px;
      &::before {
        content: '';
        position: absolute;
        top: 28px;
        left: 0;
        width: 4px;
        height: 4px;
        border-radius: 2px;
        border: 1px solid #2080f7;
        box-shadow: 0 0 4px 0 rgba(32, 128, 247, 0.3);
      }
    }
    &-listItem {
      width: 100%;
      display: flex;
      margin-bottom: 17px;
      &-title {
        font-size: 14px;
        color: rgba(77, 77, 77, 0.7);
        margin-right: 8px;
      }
      &-tag {
        width: 88px;
        height: 24px;
        margin-left: 12px;
        background: rgba(32, 128, 247, 0.1);
        border: 1px solid #2080f7;
        border-radius: 2px;
        font-size: 12px;
        color: #2080f7;
        text-align: center;
        line-height: 22px;
        cursor: pointer;
      }
    }
  }
  .alert-detail-map {
    height: 40%;
    width: 90%;
    margin-left: 5%;
    // background: red;
  }
}
</style>
