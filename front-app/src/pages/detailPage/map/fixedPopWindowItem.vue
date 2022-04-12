<!--
 * @Description: 对于非资源上图的 固定的可map图标的Item
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-03-02 13:56:00
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-08-13 16:16:45
-->
<template>
  <div class="pop-window-item">
    <div class="pop-window-item-img">
      <img :src="imgSrc" style="width: 2rem; height: 2rem" />
    </div>
  </div>
</template>

<script>
export default {
  name: "PopWindowItem",
  props: {
    propsData: {
      type: Object,
      default: () => {},
    },
  },
  mounted() {
    this.imgSrc = this.propsData.pic;
  },
  data() {
    return {
      imgSrc: "",
    };
  },
};
</script>

<style lang="scss" scoped>
.pop-window-item {
  position: relative;
  &-img {
    width: 2rem;
    height: 2rem;
    cursor: pointer;
    position: relative;
    transform: translate(-50%, -50%);
  }
}
</style>
