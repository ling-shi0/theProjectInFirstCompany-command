<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-06-03 10:32:15
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-06-04 14:22:11
-->
<template>
  <div class="audio-item" v-loading="loading">
    <div class="audio-item-img"><img src="~@/assets/images/audio/personIcon.png" style="width: 100%;height: 100%" /></div>
    {{name}}
    <div class="audio-item-isCalling" v-if="isCalling"></div>
  </div>
</template>

<script>
export default {
  name: 'AudioItem',
  props: {
    name: String,
    isCalling: Boolean,
    status: String
  },
  data() {
    return {
      loading: false
    }
  },
  watch: {
    status(val) {
      if(val === 'ring' || val === "hangup") {
        this.loading = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.audio-item {
  width: 110px;
  height: 140px;
  position: relative;
  padding-top: 23px;
  text-align: center;
  color: white;
  background: rgba(119,119,119,0.29);
  margin-right: 4px;
  margin-bottom: 4px;
  &-img {
    width: 76.8px;
    height: 76.8px;
    margin: 0 auto 8.2px;
  }
  &-isCalling{
    position: absolute;
    right: 0;
    bottom: 0;
  }
}
</style>