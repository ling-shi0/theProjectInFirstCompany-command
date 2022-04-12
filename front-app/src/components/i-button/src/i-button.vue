<template>
  <div class="i-button"><slot></slot></div>
</template>

<script>
export default {
  name: 'IButton',
  data () {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.i-button {
  position: relative;
  width: 96px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  background-color: #67c23a;
  border-radius: 4px;
}
</style>
