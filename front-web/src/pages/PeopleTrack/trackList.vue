<template>
  <div class="alarm-center__panel-vertical" style="width: 368.8px">
    <div class="alarm-center-panel-track__container" v-loading="loading">
      <!-- <div class="alarm-center-panel-track__top">
                <div
                    v-show="status"
                    class="alarm-center-panel-track__back-btn"
                    @click="handleTrackClose"
                >
                    <span class="icon"></span>
                    <span class="text">返回</span>
                </div>
            </div> -->
      <div class="alarm-center-panel-track__title">
        <span class="alarm-center-panel-track__title-icon"></span>
        <span class="alarm-center-panel-track__title-text">对象轨迹</span>
      </div>
      <div class="alarm-center-panel-track__tab-group">
        <span
          class="alarm-center-panel-track__tab"
          :class="{ active: timeType === '1' }"
          @click="timeType = '1'"
        >
          近24小时
        </span>
        <span
          class="alarm-center-panel-track__tab"
          :class="{ active: timeType === '7' }"
          @click="timeType = '7'"
        >
          近7天
        </span>
        <span
          class="alarm-center-panel-track__tab"
          :class="{ active: timeType === '30' }"
          @click="timeType = '30'"
        >
          近1个月
        </span>
        <span
          class="alarm-center-panel-track__tab"
          :class="{ active: timeType === '' }"
          @click="timeType = ''"
        >
          全部
        </span>
      </div>
      <div class="alarm-center-panel-track__tool">
        <span class="alarm-center-panel-track__statistics">
          共
          <span class="highlight">{{ trackCount }}</span>
          条轨迹记录
        </span>
        <!-- <div
                    class="fr alarm-center-panel-track__tool-btn filter"
                    @mouseenter="showFilter = true"
                    @mouseleave="showFilter = false"
                >
                    <transition name="filter-collapse">
                        <div
                            v-show="showFilter"
                            class="alarm-center-panel-list__filter-list"
                        >
                            <div
                                class="alarm-center-panel-list__filter-list-item"
                                :class="{ active: item.value === filterValue }"
                                v-for="(item, index) in filterList"
                                :key="index"
                                @click="handleFilter(item.value)"
                            >
                                {{ item.label }}
                            </div>
                        </div>
                    </transition>
                </div>
                <div
                    class="fr alarm-center-panel-track__tool-btn turn"
                    @click="handleReverse"
                ></div> -->
      </div>
      <div class="alarm-center-panel-track__timeSelect">
        <el-date-picker
          v-model="value4"
          type="datetimerange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        />
      </div>
      <div class="alarm-center-panel-track__content">
        <div
          class="alarm-center-panel-track__active-block-wrapper"
          :class="{ animate: activeBlockAnimate }"
          :style="{
            transform: `translateY(${activeBlockScrollTopFinal}px)`
          }"
        >
          <transition
            name="zoomIn"
            v-on:after-enter="activeBlockAnimate = true"
          >
            <div
              v-show="activeTrack"
              class="alarm-center-panel-track__active-block"
            ></div>
          </transition>
        </div>

        <div
          class="alarm-center-panel-track__list"
          ref="scrollEleParent"
          @wheel.prevent="scrollFunc"
        >
          <div
            class="alarm-center-panel-track__list-inner"
            ref="scrollEle"
            :style="{ transform: `translateY(${scrollTop}px)` }"
          >
            <div
              class="alarm-center-panel-track__item-group"
              v-for="outerItem in trackDataForShow"
              :key="outerItem.date"
            >
              <div class="alarm-center-panel-track__item-date">
                <span class="icon"></span>
                <span class="text">{{ outerItem.date }}</span>
              </div>
              <div
                class="alarm-center-panel-track__item"
                :class="{
                  first: innerIndex === 0,
                  active: activeTrack
                    ? activeTrack._indexInFull === innerItem._indexInFull
                    : false
                }"
                v-for="(innerItem, innerIndex) in outerItem.result"
                ref="listItem"
                :key="innerIndex"
                @click="handleTrackSelect(innerItem)"
              >
                <div class="alarm-center-panel-track__item-order">
                  {{ innerItem._order }}
                </div>
                <div class="alarm-center-panel-track__item-content">
                  <div class="alarm-center-panel-track__item-content-left">
                    <div class="alarm-center-panel-track__item-info time">
                      <span class="text">{{ innerItem.time }}</span>
                    </div>
                    <div
                      class="alarm-center-panel-track__item-info"
                      v-show="innerItem.showCustomLabel"
                    >
                      <span class="label">{{ innerItem.customLabel }}：</span>
                      <span class="text" :title="innerItem.customLabelValue">
                        {{ innerItem.customLabelValue }}
                      </span>
                    </div>
                    <div class="alarm-center-panel-track__item-info">
                      <span class="label">预警地点：</span>
                      <span class="text" :title="innerItem.pointName">
                        {{ innerItem.pointName }}
                      </span>
                    </div>
                  </div>
                  <div class="alarm-center-panel-track__item-content-right">
                    <img v-if="innerItem.picUrl" :src="innerItem.picUrl" />
                    <template v-else>
                      <div class="icon"></div>
                      <div class="icon-bg"></div>
                      <span class="text">{{ innerItem.cardPicTitle }}</span>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import { throttle, getDeepObjectValue } from '@/utils';
// import { EVENT_MAP, ALARM_TYPE_LIST } from '@/constant';
// import mixin from '@/mixins/AlarmInfo';
import { getTrailInfo } from '@/api/alarmCommand';
const TRACK_MAP = {
  face: {
    customLabel: null,
    showImage: true,
    cardPicPath: ['faceSourceInfo', 'facePicUrl']
  },
  body: {
    customLabel: null,
    showImage: true,
    cardPicPath: ['bodySourceInfo', 'bodyPicUrl']
  },
  vehicle: {
    customLabel: {
      label: '车牌号',
      path: ['source', 'vehicleSourceInfo', 'plateNumber']
    },
    showImage: true,
    cardPicPath: ['vehicleSourceInfo', 'vehiclePicUrl']
  },
  bodyFeature: {
    customLabel: null,
    showImage: true,
    cardPicPath: ['bodySourceInfo', 'bodyPicUrl']
  },
  certificate: {
    customLabel: {
      label: '证件号',
      path: ['source', 'personidSourceInfo', 'certificateNumber']
    },
    showImage: false
  },
  phone: {
    customLabel: {
      label: '手机号',
      path: ['source', 'phoneSourceInfo', 'phoneNumber']
    },
    showImage: false
  },
  mac: {
    customLabel: {
      label: '手机mac',
      path: ['source', 'wifiSourceInfo', 'mac']
    },
    showImage: false
  },
  imei: {
    customLabel: {
      label: 'imei',
      path: ['source', 'imeiSourceInfo', 'imei']
    },
    showImage: false
  },
  imsi: {
    customLabel: {
      label: 'imsi',
      path: ['source', 'imsiSourceInfo', 'imsi']
    },
    showImage: false
  }
};
export default {
  name: 'AlarmCenterPanelTrack',
  //   mixins: [mixin],
  data() {
    return {
      loading: false,
      currentIndex: 0,
      scrollTop: 0,
      trackData: [],
      activeTrack: null,
      activeBlockAnimate: false,
      timeType: '',
      sortType: 'desc',
      status: true,
      showFilter: false,
      //   filterList: ALARM_TYPE_LIST,
      filterValue: '',
      value4: ''
    };
  },
  computed: {
    trackCount: function () {
      return this.trackData.reduce((pre, cur) => {
        return pre + cur.result.length;
      }, 0);
    },
    // trackDataFilter: function () {
    //   const { trackData, filterValue } = this;
    //   const list = [...trackData];
    //   return list
    //     .map(trackDataDay => {
    //       const { date, result } = trackDataDay;
    //       return {
    //         date,
    //         result: result.filter(
    //           item =>
    //             filterValue === '' ||
    //             item.multAlarmInfo.alarmType === filterValue
    //         )
    //       };
    //     })
    //     .filter(item => item.result.length > 0);
    // },
    trackDataForShow: function () {
      //   const trackDataForShow = [...this.trackDataFilter];
      //   let order = 0;
      //   for (let i = 0, lenOuter = trackDataForShow.length; i < lenOuter; i++) {
      //     for (
      //       let j = 0, lenInner = trackDataForShow[i].result.length;
      //       j < lenInner;
      //       j++
      //     ) {
      //       // const { multAlarmInfo } = trackDataForShow[i].result[j];
      //       // const personInfo = multAlarmInfo.personInfo[0];
      //       // const config = TRACK_MAP[multAlarmInfo.alarmType];
      //       trackDataForShow[i].result[j] = {
      //         ...trackDataForShow[i].result[j],
      //         _order:
      //           order === this.trackCount - 1
      //             ? '起'
      //             : order === 0
      //             ? '终'
      //             : String(this.trackCount - order),
      //         _indexInFull: order++
      //       };
      //     }
      //   }
      //   return trackDataForShow;
    },

    activeBlockScrollTopFinal: function () {
      if (this.activeTrack) {
        const ele = this.$refs.listItem[this.activeTrack._indexInFull];
        console.log(this.activeTrack);
        console.log(ele);
        return this.scrollTop + ele.offsetTop;
      } else {
        return this.scrollTop;
      }
    }
    // trackHumanId: function () {
    //   return this.$store.state.trackHumanId;
    // },
    // currentAlarmId: function () {
    //   return this.$store.state.currentAlarmId;
    // }
  },
  components: {},
  watch: {
    trackHumanId: function (trackHumanId) {
      if (trackHumanId) {
        this.fetchTrackData();
      } else {
        this.trackData = [];
      }
    },
    value4: function () {
      this.fetchTrackData();
    },
    timeType: function (value) {
      if (value) {
        this.value4 = '';
      }
      this.fetchTrackData();
    },
    sortType: function () {
      this.fetchTrackData();
    },
    filterValue: function () {
      this.activeTrack = null;
    }
  },
  created: function () {
    // this.scrollFunc = throttle(this.handleScroll, 100);
  },
  mounted() {
    // this.bus.$on('hideBackButton', () => {
    //     this.status = false;
    // });
    // this.bus.$on('showBackButton', () => {
    //     this.status = true;
    // });
    let url = decodeURI(location.href);
    this.type = this.getQueryString(url, 'type');
    this.typeValue = this.getQueryString(url, 'typeValue');
    this.uuid = this.getQueryString(url, 'id');
    // this.uuid = '661e9dd9f25c4d179733c110fe6be12a';
    this.bus.$on('mapLoaded', () => {
      this.fetchTrackData();
    });
  },
  methods: {
    getQueryString(url, name) {
      let reg = new RegExp('(^|\\?|&)' + name + '=([^&]*)(\\s|&|$)', 'i');
      if (reg.test(url)) return unescape(RegExp.$2.replace(/\+/g, ' '));
      return '';
    },
    handleFilter: function (filterValue) {
      this.filterValue = filterValue;
      this.showFilter = false;
    },
    handleReverse: function () {
      this.sortType = this.sortType === 'desc' ? 'asc' : 'desc';
    },
    fetchTrackData: async function () {
      this.scrollTop = 0;
      this.activeTrack = null;
      this.trackData = [];
      this.loading = true;
      const { trackHumanId, timeType, sortType } = this;
      let startTime;
      let endTime;
      if (this.value4) {
        startTime = this.value4[0].getTime();
        endTime = this.value4[1].getTime();
      }
      const param = {
        type: this.type,
        // type: 'face',
        typeValue: this.typeValue,
        timeType,
        sortType,
        startTime,
        endTime
      };
      getTrailInfo(param).then(data => {
        this.loading = false;
        let { listData: trackData } = data;
        this.bus.$emit('getListData', data.listData);
        trackData = trackData ? trackData.byTime : [];
        this.trackData = trackData;
        this.bus.$emit('orbitClick', this.trackData);
        let matchedTrack = null;
        // if (this.currentAlarmId) {
        let order = 0;
        for (let i = 0, lenOuter = trackData.length; i < lenOuter; i++) {
          for (
            let j = 0, lenInner = trackData[i].result.length;
            j < lenInner;
            j++
          ) {
            const { uuid } = trackData[i].result[j];
            // const eventId = multAlarmInfo.eventId;
            if (uuid === this.uuid) {
              matchedTrack = {
                ...trackData[i].result[j],
                _indexInFull: order
              };
              break;
            }
            order++;
          }
          if (matchedTrack) {
            break;
          }
        }
        if (!matchedTrack) {
        }
        this.$nextTick(() => {
          if (matchedTrack) {
            this.activeTrack = matchedTrack;
          } else {
            this.activeTrack = null;
          }
        });
      });
    },
    handleScroll: function (e) {
      // transform 模拟滚动
      if (e.deltaY > 0) {
        const transformMax =
          -1 *
          (this.$refs.scrollEle.offsetHeight -
            this.$refs.scrollEleParent.offsetHeight);
        if (transformMax >= 0) {
          return;
        }
        const scrollTopWill = this.scrollTop - 120;
        this.scrollTop =
          scrollTopWill <= transformMax ? transformMax : scrollTopWill;
      } else {
        const scrollTopWill = this.scrollTop + 120;
        this.scrollTop = scrollTopWill >= 0 ? 0 : scrollTopWill;
      }
    },
    handleTrackSelect: function (selectedTrack) {
      this.activeTrack = selectedTrack;
      // this.$store.commit('SET_CURRENT_ALARM_ID', '');
      // this.$emit('report', selectedTrack.multAlarmInfo);
      this.bus.$emit('orbitPanelItemClick', selectedTrack);
    },
    handleTrackClose() {
      this.$store.commit('SET_TRACK_HUMAN_ID', '');
      this.$emit('showTrack', false);
      this.bus.$emit('orbitClose', '轨迹坐标等数据');
    }
  }
};
</script>
<style lang="scss">
.alarm-center-panel-track__timeSelect {
  margin: 0 8px;
  .el-input__inner {
    border: #021731 1px solid;
    background: #021731;
    color: #acd1ff;
  }
  .el-range-input {
    background: #021731;
    color: #acd1ff;
  }
  .el-picker-panel__footer {
    background: #021731 !important;
  }
}
.el-date-table {
  background: #021731 !important;
  color: #acd1ff;
}
.el-popper {
  background: #021731 !important;
  color: #acd1ff;
}
.el-input__icon {
  color: #acd1ff !important;
}
.alarm-center-panel-list__filter-list {
  position: absolute;
  top: 24px;
  left: 0;
  width: 80px;
  z-index: 1005;
  color: #acd1ff;
  background: rgba(0, 11, 22, 0.9);
  transform-origin: 50% 0;
}
.alarm-center-panel-list__filter-list-item {
  height: 24px;
  width: 100%;
  line-height: 24px;
  padding-left: 4px;
  font-size: 11.2px;
  color: #acd1ff;
  &:hover {
    background: rgba(32, 128, 247, 0.08);
  }
  &.active {
    background: rgba(32, 128, 247, 0.16);
    color: #fff;
  }
}
.alarm-center__panel-vertical {
  position: absolute;
  top: 38.4px;
  left: 38.4px;
  height: calc(100% - 76.8px);
  width: 320px;
  color: #acd1ff;
  background: #021731;
  background-image: linear-gradient(
    180deg,
    rgba(0, 244, 255, 0) 0%,
    rgba(0, 67, 128, 0.6) 20%,
    rgba(1, 9, 18, 0.3) 65%,
    rgba(0, 244, 255, 0) 100%
  );
  z-index: 999;
  will-change: transform, opacity;
}
// animation
$--cubic-out: cubic-bezier(0.215, 0.61, 0.355, 1);
@mixin text-ellipsis() {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
@mixin linear-font-home {
  background-image: -webkit-linear-gradient(bottom, #00f4ff, #fff 75%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
@mixin linear-font-home-hover {
  background-image: -webkit-linear-gradient(bottom, #ffd800, #fff 75%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
@mixin scrollbar-style() {
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
    background: transparent;
    border-radius: 1px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 100px;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
    background: rgba(32, 128, 247, 0.2);
  }
  &::-webkit-scrollbar-button {
    display: none;
  }
  &::-webkit-scrollbar-corner {
    background: transparent;
  }
  &::-webkit-scrollbar-track-piece {
    background: transparent;
  }
}
.alarm-center-panel-track__container {
  position: relative;
  height: 100%;
  width: 100%;
}

.alarm-center-panel-track__top {
  padding-top: 6.4px;
  margin-bottom: 16px;
}

.alarm-center-panel-track__back-btn {
  display: inline-block;
  height: 41.6px;
  width: 88px;
  padding-top: 6.4px;
  padding-left: 12.8px;
  text-shadow: 0 0 8px #246ce2;
  background: url('../../assets/images/center/btn006.png') center center
    no-repeat;
  background-size: cover;
  // box-shadow: inset 0 0 6px 0 rgba(0, 244, 255, 0.65);
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.3s ease;
  &:hover {
    opacity: 1;
  }
  .icon {
    display: inline-block;
    height: 28.8px;
    width: 28.8px;
    background: url('../../assets/images/center/back.png') center center
      no-repeat;
    background-size: cover;
    vertical-align: middle;
  }
  .text {
    display: inline-block;
    height: 28.8px;
    line-height: 28.8px;
    vertical-align: middle;
  }
}

.alarm-center-panel-track__title {
  margin-bottom: 12.8px;
}

.alarm-center-panel-track__title-icon {
  display: inline-block;
  height: 27.2px;
  width: 27.2px;
  margin: 0 9.6px 0 12.8px;
  vertical-align: middle;
  background: url('../../assets/images/center/imgtrack.png') center center
    no-repeat;
  background-size: cover;
}

.alarm-center-panel-track__title-text {
  display: inline-block;
  height: 27.2px;
  line-height: 27.2px;
  font-size: 19.2px;
  color: #fff;
  vertical-align: middle;
}

.alarm-center-panel-track__tab-group {
  padding-left: 6.4px;
  margin-bottom: 12.8px;
}

.alarm-center-panel-track__tab {
  display: inline-block;
  height: 24px;
  line-height: 22.4px;
  width: 72px;
  text-align: center;
  transition: color 0.3s ease;
  color: rgba(172, 209, 255, 0.7);
  background-color: rgba(9, 71, 180, 0.2);
  border: 1px solid transparent;
  vertical-align: middle;
  cursor: pointer;
  & + .alarm-center-panel-track__tab {
    margin-left: 1px;
  }
  &:hover {
    line-height: 24px;
    color: #fff;
    border: none;
    background: url('../../assets/images/center/timebg.png') center center
      no-repeat;
    background-size: cover;
  }
  &.active {
    line-height: 24px;
    color: #fff;
    border: none;
    background: url('../../assets/images/center/timebg.png') center center
      no-repeat;
    background-size: cover;
  }
}

.alarm-center-panel-track__tool {
  padding: 0 12.8px;
  margin-bottom: 12.8px;
  display: flex;
}

.alarm-center-panel-track__content {
  position: relative;
  height: calc(100% - 143.824px);
  overflow: hidden;
}

.alarm-center-panel-track__list {
  position: relative;
  height: 100%;
  overflow: hidden;
  // @include scrollbar-style;
}

.alarm-center-panel-track__list-inner {
  padding: 0 6.4px;
  transition: transform 0.6s $--cubic-out;
}

.alarm-center-panel-track__statistics {
  display: inline-block;
  height: 28.8px;
  line-height: 28.8px;
  padding-right: 124px;
  .highlight {
    display: inline-block;
    margin: 0 6.4px;
    color: #fa0520;
    font-weight: bold;
  }
}

.alarm-center-panel-track__tool-btn {
  height: 28.8px;
  width: 28.8px;
  cursor: pointer;
  margin-left: 6.4px;
  opacity: 0.7;
  transition: opacity 0.3s ease;
  background-size: cover;
  &:hover {
    opacity: 1;
  }
  &.turn {
    background-image: url('../../assets/images/center/refresh.png');
  }
  &.filter {
    position: relative;
    background-image: url('../../assets/images/center/screen.png');
  }
}

.alarm-center-panel-track__active-block-wrapper {
  position: absolute;
  top: 3.2px;
  left: 4.8px;
  width: 358.4px;
  height: 107.2px;
  z-index: 0;
  &.animate {
    transition: transform 0.6s $--cubic-out;
  }
}

.alarm-center-panel-track__active-block {
  height: 100%;
  width: 100%;
  background: url('../../assets/images/center/listbg02.png') center center
    no-repeat;
  background-size: cover;
  will-change: transform, opacity;
}

.alarm-center-panel-track__item-date {
  position: relative;
  height: 52.8px;
  padding: 12.8px 0;
  border-top: 1px solid rgba(0, 72, 119, 0.2);
  border-bottom: 1px solid rgba(0, 72, 119, 0.2);
  // box-shadow: 0 -1px 0 rgba(0, 237, 255, 0.34), 0 1px 0 rgba(0, 237, 255, 0.34);
  &:after {
    position: absolute;
    content: '';
    height: 100%;
    width: 1px;
    top: 0;
    left: 25.6px;
    background-color: rgba(0, 72, 119, 0.2);
  }
  .icon {
    display: inline-block;
    height: 27.2px;
    width: 27.2px;
    margin: 0 9.6px 0 12.8px;
    vertical-align: middle;
    background: url('../../assets/images/center/imgtime.png') center center
      no-repeat;
    background-size: cover;
  }
  .text {
    display: inline-block;
    height: 19.2px;
    line-height: 19.2px;
    vertical-align: middle;
  }
}

.alarm-center-panel-track__item {
  position: relative;
  height: 102.4px;
  width: 100%;
  padding: 12.8px 6.4px 12.8px 44.8px;
  border-bottom: 1px solid rgba(0, 72, 119, 0.2);
  // box-shadow: 0 1px 0 rgba(0, 237, 255, 0.34);
  cursor: pointer;
  &:after {
    position: absolute;
    content: '';
    height: 100%;
    width: 1px;
    top: 0;
    left: 25.6px;
    background-color: rgba(0, 72, 119, 0.2);
  }
  &.first {
    &:before {
      position: absolute;
      content: '';
      height: 86.4px;
      top: 0;
      left: 0;
      right: 0;
      background: url('../../assets/images/center/listbg01.png') center center
        no-repeat;
      background-size: cover;
    }
  }
  &.active {
    .alarm-center-panel-track__item-order {
      background-image: url('../../assets/images/center/warningbg02.png');
    }
  }
}

.alarm-center-panel-track__item-order {
  position: absolute;
  left: 3.2px;
  top: 12.8px;
  height: 20.8px;
  width: 73.6px;
  padding-left: 12.8px;
  z-index: 999;
  color: #fff;
  background: url('../../assets/images/center/warningbg01.png') center center
    no-repeat;
  background-size: cover;
}

.alarm-center-panel-track__item-content {
  position: relative;
  display: flex;
  z-index: 999;
}

.alarm-center-panel-track__item-content-left {
  flex: 1;
  width: 0;
}

.alarm-center-panel-track__item-content-right {
  position: relative;
  height: 76.8px;
  width: 76.8px;
  padding: 3.2px;
  background: url('../../assets/images/center/imgbg.png') center center
    no-repeat;
  background-size: cover;
  img {
    height: 100%;
    width: 100%;
  }
  .icon {
    position: absolute;
    top: 32px;
    left: 50%;
    height: 33.6px;
    width: 33.6px;
    transform: translate(-50%, -50%);
    background: url('../../assets/images/center/icon01.png') center center
      no-repeat;
    background-size: cover;
    z-index: 998;
  }
  .icon-bg {
    position: absolute;
    top: 0;
    left: 50%;
    height: 62.4px;
    width: 62.4px;
    transform: translateX(-50%);
    background: url('../../assets/images/center/iconbg.png') center center
      no-repeat;
    background-size: cover;
    z-index: 997;
  }
  .text {
    position: absolute;
    bottom: 6.4px;
    left: 0;
    width: 100%;
    text-align: center;
    font-size: 9.6px;
    font-weight: bold;
    z-index: 999;
    @include linear-font-home;
  }
}

.alarm-center-panel-track__item-info {
  height: 19.2px;
  line-height: 19.2px;
  margin-bottom: 6.4px;
  &.time {
    margin-bottom: 12.8px;
    margin-left: 16px;
  }
  &:last-child {
    margin-bottom: 0;
  }
  .label {
    display: inline-block;
  }
  .text {
    display: inline-block;
    @include text-ellipsis;
    max-width: calc(100% - 80px);
    vertical-align: bottom;
    color: #fff;
  }
}
</style>
