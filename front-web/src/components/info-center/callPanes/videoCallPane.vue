<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-06-01 17:10:56
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-06-01 20:03:50
-->
<template>
  <div class="video-call-pane"></div>
</template>

<script>
export default {
  name: 'videoCallPane',
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.video-call-pane {
  width: 628px;
  height: 568px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2000;
  border-radius: 4px;
  background: #0b1018;
}
</style>