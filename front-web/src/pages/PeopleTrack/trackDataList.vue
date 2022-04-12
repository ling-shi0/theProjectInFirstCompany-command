<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: caokeke
 * @Date: 2021-04-13 16:15:47
 * @LastEditors: caokeke
 * @LastEditTime: 2021-04-16 11:40:03
-->
<template>
  <div class="track-panel">
    <div class="return-panel" @click="goBack">
      <div class="icon"></div>
      <div style="cursor: pointer">返回</div>
    </div>
    <div class="police-data">
      <div class="police-label">警员名称</div>
      <div class="data-detail">
        <div style="padding: 8px 24px 16px 16px">{{ name }}</div>
        <div style="padding-top: 8px">{{ userCode }}</div>
      </div>
    </div>
    <div class="track-time">
      <div class="time-label">轨迹时间</div>
      <div style="margin: 10px 16px">
        <el-date-picker
          v-model="value4"
          type="datetimerange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          @change="fetchTrackData"
        />
      </div>
    </div>
    <div class="move-label">移动轨迹</div>
    <div class="track-list">
      <div
        v-for="(item, index) in dataList"
        :key="index"
        class="start-item"
        :class="activeIndex === index ? 'active' : ''"
        @click="handleTrackSelect(item, index)"
      >
        <div
          :class="
            index === 0
              ? 'line'
              : index === dataList.length - 1
              ? 'end-line'
              : 'normal-line'
          "
        ></div>
        <div
          v-if="index === 0 || index === dataList.length - 1"
          :class="index === 0 ? 'track-start' : 'track-end'"
        ></div>
        <div v-else class="move-num">{{ index + 1 }}</div>
        <div class="track-name">{{ item.name }}</div>
        <div class="track-date">{{ item.reportTime }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getTrailInfo } from '@/api/alarmCommand';
import moment from 'moment';
export default {
  data() {
    return {
      name: '',
      userCode: '',
      activeIndex: null,
      dataList: [],
      value4: [
        new Date(new Date(new Date().toLocaleDateString()).getTime()),
        new Date()
      ]
    };
  },
  mounted() {
    this.userCode = this.$route.query.userCode;
    this.name = this.$route.query.name;
    //  "endTime": "2021-04-14T02:50:32.175Z",
    //   "startTime": "2021-04-14T02:50:32.175Z",
    //   "userIndexCode": "string"
    this.bus.$on('mapLoaded', () => {
      this.fetchTrackData();
    });
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    async fetchTrackData() {
      const userIndexCode = this.$route.query.userCode;
      const startTime = moment(this.value4[0]).format('YYYY-MM-DD HH:mm:ss');
      const endTime = moment(this.value4[1]).format('YYYY-MM-DD HH:mm:ss');
      debugger;
      let { data } = await getTrailInfo({ userIndexCode, startTime, endTime });
      this.dataList = data;
      this.bus.$emit('orbitClick', data);
    },
    handleTrackSelect: function (selectedTrack, index) {
      this.activeIndex = index;
      // this.activeTrack = selectedTrack;
      // this.$store.commit('SET_CURRENT_ALARM_ID', '');
      // this.$emit('report', selectedTrack.multAlarmInfo);
      this.bus.$emit('orbitPanelItemClick', selectedTrack);
    }
  },
  components: {}
};
</script>

<style lang="less">
.active {
  // border: #e1eefe 1px solid;
  background: -webkit-gradient(
    linear,
    0 100%,
    0 100%,
    from(rgb(136, 185, 246, 0.7)),
    to(#e1eefe)
  );
}
.track-panel {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 430px;
  background: #fff;
  font-family: PingFangSC-Semibold;
  .police-data {
    height: 84px;
  }
  .police-label {
    padding: 16px 0 0 16px;
    opacity: 0.7;
    font-size: 14px;
    color: #4d4d4d;
  }
  .data-detail {
    font-size: 18px;
    color: #4d4d4d;
    display: flex;
  }
  .return-panel {
    display: flex;
    font-family: MicrosoftYaHeiUI;
    font-size: 14px;
    line-height: 48px;

    color: rgba(0, 0, 0, 0.9);
    height: 48px;
    box-shadow: rgb(163, 171, 181, 0.3) 0px -2px 15px 0px;
    .icon {
      cursor: pointer;
      margin: 4px;
      height: 40px;
      width: 40px;
      background: url('~@/assets/images/orbit/1back.png');
    }
  }
  .track-time {
    height: 80px;
    background-image: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.04) 0%,
      rgba(0, 0, 0, 0) 100%
    );
    .time-label {
      padding: 12px 0 4px 16px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #333333;
    }
  }
  .move-label {
    height: 36px;
    width: 414px;
    background: #f4f4f4;
    margin: 8px 8px 0 8px;
    font-family: MicrosoftYaHeiUI;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.7);
    line-height: 36px;
    padding-left: 8px;
  }
  .start-item {
    cursor: pointer;
    height: 64px;
    width: 400px;
    margin: 0 8px 0 20px;
    position: relative;
  }
  .move-num {
    height: 18px;
    width: 20px;
    background: #ed3838;
    color: #fff;
    top: 10px;
    left: 10px;
    position: absolute;
    border-radius: 2px;
    border-radius: 2px;
    line-height: 20px;
    text-align: center;
  }
  .normal-line {
    border-left: 1px dashed rgba(0, 0, 0, 0.2);
    height: 64px;
    position: absolute;
    left: 20px;
    bottom: 0;
  }
  .end-line {
    border-left: 1px dashed rgba(0, 0, 0, 0.2);
    height: 6px;
    position: absolute;
    left: 20px;
    top: 0;
  }
  .line {
    border-left: 1px dashed rgba(0, 0, 0, 0.2);
    height: 18px;
    position: absolute;
    left: 20px;
    bottom: 0;
  }
  .track-start {
    height: 40px;
    width: 28px;
    position: absolute;
    left: 6px;
    top: 6px;
    background: url('~@/assets/images/orbit/trackStart.png');
  }
  .track-end {
    height: 40px;
    width: 28px;
    position: absolute;
    left: 6px;
    top: 6px;
    background: url('~@/assets/images/orbit/trackEnd.png');
  }
  .track-date {
    position: absolute;
    left: 56px;
    top: 34px;
    font-family: MicrosoftYaHeiUI;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.4);
  }
  .track-name {
    position: absolute;
    left: 56px;
    top: 10px;
    font-family: MicrosoftYaHeiUI;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.7);
  }
}
</style>
