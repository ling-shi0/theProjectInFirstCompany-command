<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-06-10 16:10:03
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-09-13 16:43:13
-->
<template>
  <div class="detail-page">
    <map-select-res
      style="height: 10.67rem; width: 100%"
      :locationData="locationData"
      v-if="couldShowMap"
    ></map-select-res>
    <div style="height: 10.67rem; width: 100%" v-else></div>
    <div class="tools">
      <div class="back" @click="goBack">
        <van-icon name="arrow-left" />
      </div>
      <van-button
        plain
        type="primary"
        :icon="routeicon"
        @click.stop="goToMap"
        size="small"
        class="route"
        >导航</van-button
      >
      <div class="position">
        <img :src="mapIcon" />&nbsp;{{ sliceAddress(taskInfo.alarmAddress) }}
      </div>
    </div>
    <div class="info">
      <detailInfo
        :taskInfo="taskInfo"
        @refreshStatus="refreshStatus"
      ></detailInfo>
    </div>
  </div>
</template>
<script>
import detailInfo from "./component/detailInfo";
import http from "@/src/axios/distributeList";
import MapSelectRes from "./map/map-select-res.vue";
import routeicon from "@/src/assets/icons/routeicon.png";
import mapIcon from "@/src/assets/icons/mapicon.png";
import { Notify } from "vant";

export default {
  name: "detailPage",
  data() {
    return {
      locationData: {},
      routeicon,
      mapIcon,
      taskInfo: {},
      couldShowMap: true,
    };
  },
  methods: {
    goBack() {
      this.$destroy();
      this.$router.go(-1);
    },
    getDetailData() {
      let self = this;
      http
        .getAlarmDetail({
          alarmNo: this.$route.query.alarmNo,
        })
        .then((res) => {
          self.taskInfo = res.data;
          this.$set(this, "locationData", {
            longitude: res.data.longitude,
            latitude: res.data.latitude,
          });
        });
    },
    goToMap() {
      let { latitude, longitude } = this.taskInfo;
      let params = {
        coordType: "WGS84",
      };
      if (latitude && longitude) {
        params.latitude = latitude;
        params.longitude = longitude;
      }
      this.$hatom.goMapApp(() => {}, params);
    },
    refreshStatus() {
      this.getDetailData();
    },
    judgePhoneType() {
      this.$hatom.native(
        "AppInfo.getAppInfo",
        (res) => {
          console.log(res);
          res = JSON.parse(res.message);
          if (+res.OSVersion < 9) {
            this.couldShowMap = false;
            Notify({
              type: "warning",
              message: "您的手机安卓版本过低，地图暂无法显示！",
              duration: 3000,
            });
          } else {
            this.couldShowMap = true;
          }
        },
        {}
      );
    },
    sliceAddress(address) {
      if (address && address.length > 25) {
        return address.slice(0, 25) + "...";
      } else {
        return address;
      }
    },
  },
  components: {
    detailInfo,
    MapSelectRes,
  },
  activated: function () {
    this.judgePhoneType();
    this.taskInfo = {};
    this.getDetailData();
  },
};
</script>
<style>
.detail-page .van-button--primary {
  border: none !important;
}
.detail-page .route.van-button--small {
  padding: 0 0px;
}
</style>
<style scoped lang="scss">
.detail-page {
  width: 100%;
  height: 100%;
  position: relative;
  .tools {
    width: 100%;
    height: 10.67rem;
    position: absolute;
    top: 0;
    left: 0;
    .position {
      position: absolute;
      bottom: 0.75rem;
      left: 0.67rem;
      width: 66%;
      color: #999999;
      display: flex;
      align-items: center;
      z-index: 1000;
      font-size: 0.8rem;
      & img {
        width: 1.11rem;
      }
    }
    .route {
      position: absolute;
      right: 0.67rem;
      bottom: 0.67rem;
      z-index: 1000;
      width: 4.92rem;
      height: 2rem;
      color: #333333;
      font-size: 1rem;
    }
    .back {
      width: 2rem;
      height: 2rem;
      position: absolute;
      top: 0.67rem;
      left: 0.67rem;
      background: white;
      z-index: 1000;
      font-size: 1.25rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 6px;
      &:active {
        background: rgba(199, 199, 199, 0.5);
      }
    }
  }
  .info {
    width: 100%;
    height: calc(100% - 10.67rem);
  }
}
</style>
