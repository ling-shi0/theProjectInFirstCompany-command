<!--
 * @Description:
 * @Version:
 * @Autor: wangXiaoMing
 * @Date: 2021-03-11 09:35:38
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-06-01 15:15:22
-->
<template>
  <div
    class="police-person-window"
    :style="isAdvise ? 'height:239px' : 'height:200px'"
  >
    <div class="police-person-window-info">
      <div class="police-person-window-info-title">
        <span :title="policeInfo && policeInfo.policeRealName">
          {{ policeInfo && policeInfo.policeRealName }}
        </span>
        <span>{{ '警员' }}</span>
        <!-- <span :class="policeInfo && policeInfo.status ? 'free' : 'alarm'">
          空闲
        </span> -->
      </div>
      <div class="police-person-window-info-dept">
        {{ policeInfo && policeInfo.deptName }}
      </div>
      <div class="police-person-window-info-tel">
        <span>电话:</span>
        {{ (policeInfo && policeInfo.phoneNum) || '未知电话' }}
      </div>
    </div>
    <div class="police-person-window-PDT">
      {{ PDTValue }}
    </div>
    <div class="police-person-window-buts" v-if="isAdvise">
      <el-button type="info" @click="doChatWithAudio">语音通话</el-button>
      <el-button type="info" @click="goTrackPage">移动轨迹</el-button>
      <el-button type="info" @click="videoShow">视频回显</el-button>
    </div>
    <div class="police-person-window-operation">
      <el-button
        icon="h-icon-delete"
        v-if="!isAdvise"
        @click="deleteDealPerson"
      >
        删除处置人员
      </el-button>
      <el-button icon="h-icon-add" v-else @click="addIntoDeal">
        添加为处置人员
      </el-button>
    </div>
    <i class="h-icon-close closeIcon" @click="closeComponent"></i>
  </div>
</template>

<script>
import { findPoliceInfo } from '@/api/alarmCommand';
import { queryPoliceDevice } from '@/api/aroundVideo';
export default {
  name: 'PolicePersonWindow',
  data() {
    return {
      alarmVisible: false,
      policeInfo: {},
      deviceTypeObj: {
        1: '对讲机PDT',
        2: '单兵',
        3: '执法记录仪',
        4: '车载',
        5: '电台'
      }
    };
  },
  props: {
    paneData: {
      type: Object,
      default: () => {}
    },
    isAdvise: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    PDTValue() {
      return (
        (this.policeInfo &&
          this.policeInfo.associateDeviceType &&
          (this.policeInfo &&
            this.policeInfo.associateDeviceType &&
            (this.deviceTypeObj[this.policeInfo.associateDeviceType] ||
              '其它')) +
            `(编号：${this.policeInfo && this.policeInfo.deviceNumber})`) ||
        '未知设备'
      );
    }
  },
  mounted() {
    this.bus.$on('changePolicePopSta', data => {
      this.isAdvise = !this.isAdvise;
    });
    this.bus.$on('changeDetail', ({ detailShow }) => {
      this.alarmVisible = detailShow;
    });
    this.getPoliceDetail();
  },
  methods: {
    goTrackPage() {
      this.bus.$emit('openTrackPage', this.policeInfo);

      // this.$router.push({
      //   path: '/alarm/track',
      //   query: {
      //     userCode: policeInfo.deviceNumber
      //   }
      // });
    },
    closeComponent() {
      this.$emit('closeComponent');
    },
    deleteDealPerson() {
      if (!sessionStorage.getItem('alarmDetailVisible')) {
        this.$message.warning('请先选中一条警情！');
        return;
      }
      this.bus.$emit('deleteDealPeople', this.policeInfo.userIndexCode);
    },
    addIntoDeal() {
      if (!sessionStorage.getItem('alarmDetailVisible')) {
        this.$message.warning('请先选中一条警情！');
        return;
      }
      this.bus.$emit('saveAndAddNewDealPeople', this.policeInfo.userIndexCode);
    },
    // 即时通信
    async doChatWithAudio() {
      this.bus.$emit('audioChat', this.policeInfo.userIndexCode);
    },
    getPoliceDetail() {
      findPoliceInfo(
        // this.paneData.userIndexCode ||
        //   this.paneData.userId ||
        //   this.paneData.userName
        this.paneData.userId
      ).then(({ data }) => {
        this.$set(this, 'policeInfo', data);
      });
    },
    videoShow() {
      queryPoliceDevice({ userIndexCode: this.policeInfo.userIndexCode }).then(
        ({ data }) => {
          let resObj = null;
          data &&
            data.resMapResps &&
            data.resMapResps.forEach(item => {
              if (item.labelType === 'INDIVIDUAL') {
                resObj = item;
                resObj.nameStr =
                  this.policeInfo && this.policeInfo.policeRealName;
              }
            });
          if (!resObj) {
            this.$message.error('该警员并无设备信息！');
            return;
          }
          this.bus.$emit('openVideoFromMapPoint', resObj);
        }
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.police-person-window {
  width: 336px;
  height: 282px;
  background: white;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.29);
  padding: 14px;
  position: relative;
  border-radius: 4px;
  &::after {
    content: '';
    width: 8px;
    height: 6px;
    position: absolute;
    bottom: -12px;
    left: calc(50% - 6px);
    border-style: solid;
    border-width: 6px;
    border-color: white transparent transparent transparent;
  }
  &-info {
    width: 100%;
    height: 102px;
    &-title {
      width: 100%;
      height: 38.5px;
      display: flex;
      align-items: center;
      border-bottom: 1px dashed rgba(151, 151, 151, 0.32);
      padding-bottom: 12.5px;
      > span:first-child {
        width: 68px;
        font-size: 18px;
        color: #4d4d4d;
        font-weight: bold;
        margin-left: 10px;
        margin-right: 8px;
        display: inline-block;
        height: 25px;
        @include utils-ellipsis();
      }
      > span:nth-child(2) {
        color: #4d4d4d;
        margin-right: 8px;
      }
      > span:last-child {
        display: inline-block;
        font-size: 12px;
        width: 44px;
        height: 24px;
        text-align: center;
        line-height: 20px;
        border-radius: 2px;
      }
    }
    &-dept {
      width: 100%;
      height: 20px;
      font-size: 14px;
      line-height: 20px;
      margin: 11.5px 0 6px 10px;
    }
    &-tel {
      width: 100%;
      height: 20px;
      font-size: 14px;
      margin-bottom: 6px;
      margin-left: 10px;
      > span {
        color: rgba(77, 77, 77, 0.7);
      }
    }
  }
  &-PDT {
    width: 100%;
    height: 37px;
    background: #eeeeee;
    border-radius: 1px;
    margin-bottom: 6px;
    text-align: center;
    line-height: 37px;
  }
  &-buts {
    width: 100%;
    height: 26px;
    margin-bottom: 15px;
    display: flex;
    justify-content: space-around;
  }
  &-operation {
    width: 100%;
    display: flex;
    justify-content: center;
  }
}
.closeIcon {
  position: absolute;
  top: 12px;
  right: 8px;
  font-size: 1.5rem;
  cursor: pointer;
}
.free {
  background: rgba(32, 128, 247, 0.1);
  border: 1px solid #2080f7;
  color: #2080f7 !important;
}
.alarm {
  background: rgba(245, 120, 35, 0.1);
  border: 1px solid #f57823;
  color: #f57823 !important;
}
</style>
