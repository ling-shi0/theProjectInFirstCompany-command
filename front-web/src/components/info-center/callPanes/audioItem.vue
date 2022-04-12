<template>
  <div class="audio-item">
    <div class="audio-item-img"></div>
    {{name}}
    <div class="audio-item-isCalling" v-if="isCalling"></div>
  </div>
</template>

<script>
export default {
  name: 'AudioItem',
  props: {
    name: String,
    isCalling: Boolean
  },
}
</script>

<style lang="scss" scoped>
.audio-item {
  width: 110px;
  height: 140px;
  position: relative;
  padding-top: 23px;
  text-align: center;
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