<!--
 * @progressDescription:
 * @Version:
 * @Autor: wangXiaoMing
 * @Date: 2021-06-29 15:08:54
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-08-25 15:17:56
-->
<template>
  <div class="progress" :style="borderStyle">
    <div class="progress-active" :style="activeStyle"></div>
    <div class="progress-block" :style="blockStyle"></div>
    <div class="progress-font">{{ progressDescription }}</div>
  </div>
</template>

<script>
export default {
  name: "Progress",
  props: {
    activeNum: Number,
    activeColor: String,
    progressDescription: String,
  },
  mounted() {
    this.init();
  },
  data() {
    return {
      activeStyle: "",
      blockStyle: "",
      borderStyle: "",
    };
  },
  methods: {
    init() {
      const acNum = Math.ceil(this.activeNum * 100);
      this.activeStyle = `width: ${acNum}%;background: ${this.activeColor};`;
      this.blockStyle = `width: ${1 - acNum}%;`;
      this.borderStyle = `border: 1px solid ${this.activeColor};`;
    },
  },
};
</script>

<style lang="scss" scoped>
.progress {
  width: 5rem;
  height: 2rem;
  background: #f8f8f8;
  display: flex;
  position: relative;
  border-radius: 2px;
  &-active {
    width: 100%;
    height: 100%;
  }
  &-block {
    width: 0%;
    height: 100%;
  }
  &-font {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    color: #000000;
    font-size: 1.17rem;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
