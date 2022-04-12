<template>
  <div class="layout2">
    <div class="layout-header">
      <i-nav :title="title" @goback="handleGoback"></i-nav>
    </div>
    <div class="layout-content">
      <transition :name="$direction">
        <keep-alive :include="whiteList" :exclude="blackList">
          <router-view></router-view>
        </keep-alive>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Layout2',
  data () {
    return {
      whiteList: [],
      blackList: []
    }
  },
  computed: {
    title () {
      return this.$route.meta.title
    }
  },
  created () {
    this.listenBackbutton()
  },
  methods: {
    handleGoback () {
      this.$router.go(-1)
    },
    /** 监听原生回退事件 安卓的虚拟回退事件 */
    listenBackbutton () {
      this.$hatom.setBridge('onBackPressed', (res) => {
        this.$router.go(-1)
      })
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler (newRoute, oldRoute) {
        if (newRoute.meta.cache) {
          this.whiteList = Array.from(
            new Set([newRoute.name, ...this.whiteList])
          )
          this.blackList = this.blackList.filter(
            (name) => name !== newRoute.name
          )
        } else {
          this.whiteList = this.whiteList.filter(
            (name) => name !== newRoute.name
          )
          this.blackList = Array.from(
            new Set([newRoute.name, ...this.blackList])
          )
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.layout2 {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;

  .layout-header {
    position: relative;
    height: 44px;
    width: 100%;
  }

  .layout-content {
    position: relative;
    height: calc(100% - 44px);
    width: 100%;
    overflow: hidden;
    background-color: #efefef;
  }
}
</style>
