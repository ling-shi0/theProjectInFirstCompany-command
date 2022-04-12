<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-08-03 16:36:07
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-08-19 09:47:47
-->
<template>
  <div class="deal-step">
    <div class="title">处置流程</div>
    <div class="content">
      <div v-for="item in msgInfo" :key="item.dataId" class="content-item">
        <div class="content-item-left">
          <div>{{ item.stepName }}</div>
          <div>{{ item.dealTimeValue }}</div>
        </div>
        <div class="content-item-middle" :style="judgeBorderColor(item.index)">
          <div
            class="content-item-middle-circle"
            :style="judgeCircleColor(item.index)"
          ></div>
        </div>
        <div class="content-item-right">
          {{ item.dealPerson }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DealStep",
  props: {
    msgInfo: Array,
  },
  methods: {
    judgeBorderColor(index) {
      if (index + 1 === this.msgInfo.length) {
        return "border-right: 0.08rem solid #2080F7;";
      } else if (index === 0) {
        return "border-right: none !important;";
      } else {
        return "";
      }
    },
    judgeCircleColor(index) {
      if (index + 1 === this.msgInfo.length) {
        return "background: #2080F7;";
      } else {
        return "";
      }
    },
  },
};
</script>

<style scoped lang="scss">
.deal-step {
  width: 100%;
  .title {
    width: 100%;
    height: 2.3325rem;
    font-size: 1.3325rem;
    line-height: 1.3325rem;
    margin-bottom: 0.5rem;
    background: white;
    padding: 0.5rem 1.3325rem 0.5rem;
  }
  .content {
    padding-left: 1.33rem;
    &-item {
      width: 100%;
      height: 7.84rem;
      margin-bottom: 0.67rem;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      &-left {
        font-size: 1.17rem;
        margin-right: 0.83rem;
        width: 30vw;
        & div:last-child {
          font-size: 1rem;
          color: #999999;
          margin-top: 0.83rem;
        }
      }
      &-middle {
        height: 5.75rem;
        border-right: 0.08rem solid #d8d8d8;
        position: relative;
        top: 2.09rem;
        &-circle {
          width: 0.92rem;
          height: 0.92rem;
          position: absolute;
          top: -1.4rem;
          left: -0.46rem;
          border-radius: 0.46rem;
          background: #999999;
        }
      }
      &-right {
        width: 52vw;
        margin-left: 0.92rem;
        font-size: 1.17rem;
      }
    }
  }
}
</style>
