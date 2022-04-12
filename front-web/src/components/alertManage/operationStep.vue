<!--
 * @Description:
 * @Version:
 * @Autor: wangXiaoMing
 * @Date: 2021-02-22 20:06:10
 * @LastEditors: caokeke
 * @LastEditTime: 2021-03-29 15:27:21
-->
<template>
  <div class="operation-step">
    <div
      v-for="(item, index) in stepArr"
      :key="index"
      class="operation-step-item"
    >
      <div
        class="operation-step-item-leftLine"
        v-if="index > 0"
        :class="getStatus(index)"
      ></div>
      <div
        class="operation-step-item-main"
        :class="
          [
            getStatus(index),
            overTimeClass && index === step + 1 ? 'overedTime' : '',
            anim && index === step + 1 ? 'overTime' : ''
          ].join(' ')
        "
      >
        {{ item.name }}
      </div>
      <!-- <div
        class="operation-step-item-main"
        :class="
          [getStatus(index), overTime && index === step ? 'overTime' : ''].join(
            ' '
          )
        "
      >
        {{ item.name }}
      </div> -->
      <div
        class="operation-step-item-rightLine"
        v-if="index < stepArr.length - 1"
        :class="getStatus(index)"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'operationStep',
  props: {
    step: {
      type: [Number, String],
      default: 3
    },
    overTime: {
      type: Boolean,
      default: false
    },
    planTime: {
      type: Number
    }
  },
  data() {
    return {
      anim: false,
      stepArr: [
        {
          name: '分派'
        },
        {
          name: '签收'
        },
        {
          name: '到达'
        },
        {
          name: '反馈'
        },
        {
          name: '完结'
        }
      ],
      timeInter: null,
      overTimeClass: false
    };
  },
  mounted() {
    if (this.planTime) {
      this.timeInter = setInterval(this.computeTime, 1000);
    }
  },
  methods: {
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
    },
    getStatus(index) {
      let status = 'have-done';
      switch (true) {
        case index < this.step:
          status = 'have-done';
          break;
        case index === this.step:
          status = 'is-doing';
          break;
        case index > this.step:
          status = 'havent-done';
          break;
      }
      return status;
    }
  }
};
</script>

<style lang="scss" scoped>
.operation-step {
  font-weight: normal;
  &-item {
    display: inline-block;
    width: 49px;
    height: 18px;
    position: relative;
    &-main {
      width: 40px;
      height: 20px;
      background: #ffffff;
      border: 1px solid #d8d8d8;
      border-radius: 9px;
      border-radius: 9px;
      text-align: center;
      line-height: 18px;
      font-size: 12px;
      color: #d8d8d8;
    }
    &-leftLine {
      width: 4.5px;
      height: 2px;
      border-top: 1px solid #d8d8d8;
      position: absolute;
      top: 10px;
      left: -4.5px;
    }
    &-rightLine {
      width: 4.5px;
      height: 2px;
      border-top: 1px solid #d8d8d8;
      position: absolute;
      top: 10px;
      right: 4.5px;
    }
  }
}
.have-done {
  &.operation-step-item-leftLine,
  &.operation-step-item-rightLine {
    border-top: 1px solid #78aaff;
  }
  &.operation-step-item-main {
    background: white;
    color: #78aaff;
    border: 1px solid #78aaff;
  }
}
.is-doing {
  &.operation-step-item-leftLine,
  &.operation-step-item-rightLine {
    border-top: 1px solid #78aaff;
  }
  &.operation-step-item-main {
    background: #78aaff;
    color: white;
    border: 1px solid #78aaff;
  }
}
.havent-done {
  &.operation-step-item-leftLine,
  &.operation-step-item-rightLine {
    border-top: 1px solid #d8d8d8;
  }
  &.operation-step-item-main {
    background: white;
    color: #d8d8d8;
  }
}
.overedTime {
  &.operation-step-item-main {
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
