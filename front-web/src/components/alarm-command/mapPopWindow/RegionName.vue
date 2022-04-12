<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: caokeke
 * @Date: 2021-03-30 19:44:09
 * @LastEditors: caokeke
 * @LastEditTime: 2021-05-10 10:48:08
-->
<template>
  <div class="region-name">
    <div class="pic"></div>
    <div class="name">{{ name }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    name: {
      type: String,
      default: ''
    }
  },
  components: {}
};
</script>

<style lang="less">
.region-name {
  transform: translate(-50%, -50%) !important;
  .pic {
    height: 35px;
    width: 24px;
    background: url('~@/assets/images/map/zdqy.png');
    margin:auto
    // background-size: cover;
  }
  .name {
    font-weight: 700;
    color: red;
    font-size: 14px;
    text-align: center;
  }
}
</style>
