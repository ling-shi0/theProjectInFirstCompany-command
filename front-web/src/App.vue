<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-02-23 14:42:46
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-03-29 16:23:56
-->
<template>
  <h-page id="app" class="main-wrapper">
    <h-page-menu :menu="menu" />
    <keep-alive v-if="$route.meta.keepAlive">
      <router-view />
    </keep-alive>
    <router-view v-else />
  </h-page>
</template>

<script>
import navList from '@/router/nav.config';
import { getInitConfig } from '@/api/alarmCommand';
import { mapMutations } from 'vuex';
export default {
  name: 'App',
  async mounted() {
    const { data } = await getInitConfig();
    this.setInitConfigData(data);
  },
  computed: {
    menu() {
      navList.map(nav => {
        nav.title = this.$t ? this.$t(nav.title) : nav.title;
      });
      // 运行态不展示
      if (process.env.NODE_ENV !== 'development') {
        return [];
      } else {
        return navList;
      }
    }
  },
  methods: {
    ...mapMutations(['setInitConfigData'])
  }
};
</script>
<style lang="scss" scoped>
.main-wrapper {
  height: 100%;
}
</style>
