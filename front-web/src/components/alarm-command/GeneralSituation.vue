<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: caokeke
 * @Date: 2021-02-22 18:54:59
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-05-12 19:45:14
-->
<template>
  <div class="general-situation-panel">
    <div
      class="general-situation-panel-item"
      v-for="(item, index) in situationArr"
      :key="index"
    >
      <i><img :src="item.picUrl" /></i>
      {{ item.name }}
      <span class="general-situation-panel-item-counts">
        {{ item.countOrTime }}
      </span>
      <!-- <div>
        <i><img :src="judgePic(item.type)" /></i>
        <span
          class="general-situation-panel-item-add"
          :class="item.type === 'up' ? 'up' : 'down'"
        >
          {{ item.add }}
        </span>
      </div> -->
      <div
        class="general-situation-panel-item-divider"
        v-if="index !== 'assignAverage'"
      ></div>
    </div>
  </div>
</template>

<script>
import averageArrive from '@/assets/images/alarmCommand/averageArrive.png';
import averageAssign from '@/assets/images/alarmCommand/averageAssign.png';
import todayAlarmCount from '@/assets/images/alarmCommand/todayAlarmCount.png';
import upgrade from '@/assets/images/alarmCommand/upgrade.png';
import down from '@/assets/images/alarmCommand/down.png';
import {
  getFeedBackTime,
  getArriveTime,
  getAlertNum,
  getPolice
} from '@/api/alarmCommand';
export default {
  name: 'GeneralSituation',
  data() {
    return {
      situationArr: {
        alarmCounts: {
          name: '当日警情数',
          countOrTime: '',
          add: '',
          type: 'down',
          picUrl: todayAlarmCount
        },
        arriveAverage: {
          name: '到达平均时长',
          countOrTime: '',
          add: '',
          type: 'down',
          picUrl: averageArrive
        },
        assignAverage: {
          name: '反馈平均时长',
          countOrTime: '',
          add: '',
          type: 'down',
          picUrl: averageAssign
        }
      },
      upgrade,
      down,
      deptIndexCode: ''
    };
  },
  props: {
    departIndexCode: {
      type: [String, Number],
      default: ''
    }
  },
  watch: {
    departIndexCode(val) {
      this.deptIndexCode = val;
      this.initSituation();
    }
  },
  async mounted() {
    const { data } = await getPolice();
    this.deptIndexCode = data[0].deptIndexCode;
    this.initSituation();
    this.bus.$on('addNewAlarm', () => {
      this.initSituation();
    });
  },
  methods: {
    async initSituation() {
      const feedBackTime = await getFeedBackTime({
        deptIndexCode: this.deptIndexCode
      });
      const arriveTime = await getArriveTime({
        deptIndexCode: this.deptIndexCode
      });
      const alertTime = await getAlertNum({
        deptIndexCode: this.deptIndexCode
      });
      Object.assign(this.situationArr.alarmCounts, {
        countOrTime: alertTime.data.num,
        add: alertTime.data.percent,
        type: alertTime.data.type
      });
      Object.assign(this.situationArr.arriveAverage, {
        countOrTime: arriveTime.data.time,
        add: arriveTime.data.percent,
        type: arriveTime.data.type
      });
      Object.assign(this.situationArr.assignAverage, {
        countOrTime: feedBackTime.data.time,
        add: feedBackTime.data.percent,
        type: feedBackTime.data.type
      });
      this.$set(this, 'situationArr', this.situationArr);
    },
    judgePic(type) {
      if (type === 'up') {
        return upgrade;
      } else {
        return down;
      }
    }
  }
};
</script>
<style lang="less">
.general-situation-panel {
  position: absolute;
  top: 0;
  left: 430px;
  width: calc(100% - 430px);
  height: 48px;
  z-index: 999;
  background-image: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    #ffffff 11%,
    #ffffff 87%,
    rgba(255, 255, 255, 0) 100%
  );
  display: flex;
  justify-content: center;
  align-items: center;
  &-item {
    width: 20%;
    height: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-right: 1rem;
    > i:first-child {
      width: 32px;
      height: 32px;
      display: inline-block;
      border-radius: 16px;
      box-shadow: inset 0 0 3px 0 #2080f7;
    }
    &-counts {
      font-family: DINAlternate-Bold;
      font-size: 24px;
      color: #2b86f7;
    }
    &-add {
      font-family: DINAlternate-Bold;
      font-size: 14px;
      opacity: 0.7;
      &.up {
        color: #ff534b;
      }
      &.down {
        color: #0dca72;
      }
    }
    &-divider {
      height: 28px;
      width: 2px;
      border-right: 1px dashed #eee;
    }
  }
}
</style>
