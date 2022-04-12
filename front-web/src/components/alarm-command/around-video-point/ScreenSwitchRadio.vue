<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-03-11 18:45:20
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-04-06 15:15:02
-->
<template>
  <div class="screen-switch-radio">
    <div class="screen-switch-radio-item">屏幕</div>
    <div
      v-for="(item, index) in screenArr"
      @click="switchActiveChoose(item)"
      class="screen-switch-radio-item"
      :class="activeItemNo === item ? 'activeScreenItem' : ''"
      :key="index"
    >
      {{ item }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScreenSwitchRadio',
  props: {
    index: {
      type: Number,
      default: 0
    },
    screenListArr: {
      type: Array,
      default: () => {}
    }
  },
  data() {
    return {
      screenArr: [1, 2, 3, 4],
      activeItemNo: -1
    };
  },
  mounted() {
    this.activeItemNo =
      this.screenListArr.indexOf(this.index) === -1
        ? -1
        : this.screenListArr.indexOf(this.index) + 1;
  },
  watch: {
    screenListArr(val) {
      this.activeItemNo =
        val.indexOf(this.index) === -1 ? -1 : val.indexOf(this.index) + 1;
    }
  },
  methods: {
    switchActiveChoose(item) {
      this.$emit('changeActiveNo', {
        index: this.index,
        val: item,
        lastIndex: this.activeItemNo
      });
      this.activeItemNo = item;
    }
  }
};
</script>

<style lang="scss">
.screen-switch-radio {
  width: 100%;
  height: 20px;
  display: flex;
  justify-content: space-around;
  &-item {
    width: 32px;
    height: 20px;
    background: #ffffff;
    border-radius: 1px;
    font-size: 12px;
    color: #4d4d4d;
    text-align: center;
    cursor: pointer;
    &:first-child {
      background: rgba(0, 0, 0, 0);
      &:hover {
        background: rgba(0, 0, 0, 0);
        color: #4d4d4d;
      }
    }
    &:hover {
      background: #2080f7;
      color: white;
    }
  }
}
.activeScreenItem {
  background: #2080f7;
  color: white;
}
</style>