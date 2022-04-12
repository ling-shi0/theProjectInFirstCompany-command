<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-05-17 10:56:59
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-05-31 20:09:21
-->
<template>
  <div v-if="componentVisible" class="pop-window-item-com">
    <component
      :is="componentSrc"
      :paneData="componentsData"
      :isAdvise="propsData.isAdvise"
      @closeComponent="closeComponent"
    ></component>
  </div>
</template>

<script>
export default {
  name: 'MapPopWindowItem',
  props: {
    propsData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      componentVisible: true,
      componentsData: {},
      componentSrc: null
    };
  },
  mounted() {
    this.componentSrc = this.propsData.componentSrc;
    this.$set(this, 'componentsData', {
      type: this.propsData.type,
      ...this.propsData
    });
  },
  methods: {
    closeComponent() {
      this.componentVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.pop-window-item {
  position: relative;
  &-com {
    position: absolute;
    bottom: 40px;
    left: 0;
    z-index: 900;
    transform: translateX(-50%) !important;
  }
}
</style>