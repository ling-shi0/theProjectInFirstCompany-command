<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: caokeke
 * @Date: 2021-04-07 17:14:30
 * @LastEditors: caokeke
 * @LastEditTime: 2021-04-12 14:00:03
-->
<template>
  <div style="height: 100%; width: 100%">
    <div id="ardiv"></div>
  </div>
</template>

<script>
import { getArConfig } from '@/api/aroundVideo';
export default {
  data() {
    return {
      control: null
    };
  },
  components: {},
  mounted() {
    this.changeArScene();
  },
  methods: {
    async openAr() {
      let { data } = await getArConfig();
      let indexCode = this.$route.query.indexCode;
      this.control = new ARWebControl(
        'ardiv',
        2,
        data.ip,
        data.port,
        data.userName,
        data.sg,
        indexCode,
        '8888'
      );
      this.control.setupControl();
      // setTimeout(() => {
      //   control.changeArScene('84ae1ea22cff48fd912e0db39710c2ee');
      // }, 1000);
    },
    changeArScene() {
      if (this.control) {
        control.changeArScene(this.$route.query.indexCode);
      } else {
        this.openAr();
      }
    }
  },
  watch: {
    // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
    $route: 'changeArScene'
  }
};
</script>

<style lang="less">
#ardiv {
  height: 100%;
  width: 100%;
}
</style>
