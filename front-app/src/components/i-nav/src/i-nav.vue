<template>
    <div class="navigator">
        <div class="left" @click="goBack">
            <i class="icon-arrow-left"></i>
        </div>
        <div class="center">{{ title }}</div>
        <div class="right" @click="reset">
            <slot name="right">{{ btn_name }}</slot>
        </div>
    </div>
</template>

<script>
export default {
  name: 'INav',
  data () {
    return {}
  },
  props: ['title', 'btn_name'],
  methods: {
    goBack () {
      this.$emit('goback')
    },
    reset () {
      this.$emit('reset')
    }
  }
}
</script>

<style lang="scss">
.navigator {
  position: relative;
  width: 100%;
  height: 44px;
  line-height: 44px;
  background: #8381d9;
  padding: 0 8px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  .left {
    position: relative;
    height: 100%;
    width: 22px;
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
  }

  .center {
    position: relative;
    height: 100%;
    width: 100%;
    color: #333;
    font-size: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .right {
    position: relative;
    height: 100%;
    color: #2080f7;
    font-size: 16px;
  }
}
</style>
