<!--
 * @Description:
 * @Version:
 * @Autor: wangXiaoMing
 * @Date: 2021-02-25 15:51:18
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-05-06 20:25:50
-->
<template>
  <div class="alarm-step">
    <div
      class="alarm-step-item"
      v-for="(item, index) in stepArr.slice(1)"
      :key="index"
    >
      <div class="alarm-step-item-info">
        <div
          class="alarm-step-item-info-top"
          :class="
            [
              judgeStep(index),
              overTimeClass && index === step + 1 ? 'overedTime' : '',
              anim && index === step + 1 ? 'overTime' : ''
            ].join(' ')
          "
        >
          {{ item.name }}
        </div>
        <div
          class="alarm-step-item-info-time"
          :style="index === step ? 'color: #78AAFF' : ''"
        >
          {{ timeValueArr[item.index] && timeValueArr[item.index].slice(-14) }}
        </div>
      </div>
      <div
        class="alarm-step-item-divider"
        v-if="index < stepArr.slice(1).length - 1"
        :class="judgeStep(index)"
      ></div>
    </div>
  </div>
</template>

<script>
import { dealStepsObj } from '@/components/alarm-command/alarmListConstant';
export default {
  name: 'AlarmStep',
  props: {
    stepName: {
      type: String,
      default: '接警'
    },
    itemData: {
      type: Object,
      default: () => {}
    },
    planTime: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      anim: false,
      timeValueArr: [],
      timeInter: null,
      overTimeClass: false
    };
  },
  computed: {
    step() {
      return dealStepsObj[this.stepName];
    }
  },
  watch: {
    itemData(val) {
      const { feedBackTime, arriveTime, signTime, assignTime } = val;
      this.timeValueArr = [assignTime, signTime, arriveTime, feedBackTime, ''];
    }
  },
  async created() {
    const { feedBackTime, arriveTime, signTime, assignTime } = this.itemData;
    this.timeValueArr = [assignTime, signTime, arriveTime, feedBackTime, ''];
    const stepArr = [];
    for (const i in dealStepsObj) {
      stepArr.push({
        name: i,
        index: dealStepsObj[i]
      });
    }
    Object.assign(this, { stepArr });
    if (this.planTime) {
      this.timeInter = setInterval(this.computeTime, 1000);
    }
  },
  methods: {
    judgeStep(index) {
      let stepClass = '';
      switch (true) {
        case this.step < index:
          stepClass = 'havntDone';
          break;
        case this.step === index:
          stepClass = 'isDoing';
          break;
        case this.step > index:
          stepClass = 'havDone';
          break;
      }
      return stepClass;
    },
    computeTime() {
      let currenTime = new Date().getTime();
      if (
        this.planTime - currenTime < 60000 &&
        this.planTime - currenTime > 0
      ) {
        this.anim = true;
      } else if (this.planTime - currenTime < 0) {
        this.anim = false;
        clearInterval(this.timeInter);
        this.overTimeClass = true;
      } else {
        this.anim = false;
      }
    }
    // judgeIsOverTime(item) {
    //   if (this.step !== item.index) {
    //     return '';
    //   }
    //   if (item.index === 0 && this.step === item.index) {
    //     if (this.overTimeLength < new Date() - this.timeValueArr[item.index]) {
    //       return 'overTime';
    //     } else {
    //       return '';
    //     }
    //   } else {
    //     if (
    //       this.overTimeLength <
    //       this.timeValueArr[item.index] - this.timeValueArr[item.index - 1]
    //     ) {
    //       return 'overTime';
    //     } else {
    //       return '';
    //     }
    //   }
    // }
  }
};
</script>

<style lang="scss" scoped>
.alarm-step {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
  margin-left: 8px;
  &-item {
    width: 74px;
    height: 100%;
    display: flex;
    &-info {
      width: 60px;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      &-top {
        width: 56px;
        height: 56px;
        border-radius: 28px;
        font-size: 16px;
        text-align: center;
        line-height: 56px;
      }
      &-time {
        font-size: 12px;
        color: rgba(120, 170, 255, 0.7);
        text-align: center;
      }
    }
    &-divider {
      margin-left: 5px;
      width: 8px;
      height: 1px;
      margin-top: 28px;
    }
  }
}
.havDone {
  &.alarm-step-item-info-top {
    border: 1px solid #78aaff;
    color: #78aaff;
  }
  &.alarm-step-item-divider {
    border-top: 1px solid #78aaff;
  }
}
.isDoing {
  &.alarm-step-item-info-top {
    border: 1px solid #78aaff;
    color: white;
    background: #78aaff;
  }
  &.alarm-step-item-divider {
    border-top: 1px solid #d8d8d8;
  }
}
.havntDone {
  &.alarm-step-item-info-top {
    background: #ffffff;
    border: 1px solid #d8d8d8;
    color: #d8d8d8;
  }
  &.alarm-step-item-divider {
    border-top: 1px solid #d8d8d8;
  }
}
.overedTime {
  &.alarm-step-item-info-top {
    background: #ffb86a;
    color: #fff;
  }
}

.overTime {
  animation: overTimeFlashing ease-in 1s 60;
}
@keyframes overTimeFlashing {
  0% {
    background: #ffb86a;
  }
  100% {
    background: #78aaff;
  }
}
</style>
