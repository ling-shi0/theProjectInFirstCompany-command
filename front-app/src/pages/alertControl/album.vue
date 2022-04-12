<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-06-30 11:04:16
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-09-09 19:30:22
-->
<template>
  <div class="album">
    <div
      v-for="(item, index) in list"
      class="album-item"
      :key="item.alarmId"
      @click="changeActiveIndex(index)"
    >
      <div :class="index === activeIndex ? 'active' : ''">
        <van-image
          style="width: 100%; height: 100%"
          fit="fill"
          :src="item.facePicUrl"
        />
        <div class="check" v-if="index === activeIndex">
          <van-icon name="success" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Album",
  props: {
    list: Array,
  },
  data() {
    return {
      activeIndex: 0,
    };
  },
  watch: {
    list() {
      this.activeIndex = 0;
    },
  },
  methods: {
    changeActiveIndex(index) {
      this.activeIndex = index;
      this.$emit("changeActiveIndex", this.list[index]);
    },
  },
};
</script>

<style lang="scss" scoped>
.album {
  width: 100%;
  height: 100%;
  margin-top: 0.5rem;
  overflow-x: auto;
  &-item {
    width: 5.75rem;
    height: 5.75rem;
    display: inline-block;
    margin-right: 1rem;
    border-radius: 2px;
    overflow: hidden;
    > div {
      width: 100%;
      height: 100%;
      position: relative;
      &.active {
        border: 1px solid #0c79ff;
      }
      .check {
        position: absolute;
        top: 5%;
        right: 5%;
        width: 1.125rem;
        height: 1.125rem;
        font-size: 1rem;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        &::before {
          position: absolute;
          content: "";
          top: 5%;
          right: 5%;
          width: 1.125rem;
          height: 1.125rem;
          background: #0c79ff;
          border-radius: 2px;
        }
      }
    }
  }
}
</style>
