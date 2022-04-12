<template>
    <div class="layout2">
        <div class="layout-content">
            <transition :name="$direction">
                <keep-alive :include="whiteList" :exclude="blackList" >
                    <router-view></router-view>
                </keep-alive>
            </transition>
        </div>
        <div class="layout-footer"><i-tabbar :menu="menu"></i-tabbar></div>
    </div>
</template>

<script>

export default {
  name: 'layout2',
  data () {
    return {
      direction: 'left',
      menu: [
        { icon: 'icon-tabbar-home', path: '/home', index: 'home', name: '工作台' },
        { icon: 'icon-tabbar-search', path: '/api', index: 'api', name: '接口' },
        { icon: 'icon-tabbar-car', path: '/ui', index: 'ui', name: '组件' },
        { icon: 'icon-tabbar-setting', path: '/personal', index: 'personal', name: '个人中心' }
      ],
      whiteList: [],
      blackList: []
    }
  },
  created () {
    this.listenBackbutton()
  },
  methods: {
    /** 监听原生回退事件 安卓的虚拟回退事件 */
    listenBackbutton () {
      this.$hatom.setBridge('onBackPressed', (res) => {
        // 此处添加判断事件，是否推到了最后一层
        this.$router.go(-1)
      })
    },
    handleGoback () {
      this.menu.map((menu) => menu.path).includes(this.$route.path) ? this.$router.push({ path: '/index' }) : this.$router.go(-1)
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler (newRoute, oldRoute) {
        if (newRoute.meta.cache) {
          this.whiteList = Array.from(new Set([newRoute.name, ...this.whiteList]))
          this.blackList = this.blackList.filter((name) => name !== newRoute.name)
        } else {
          this.whiteList = this.whiteList.filter((name) => name !== newRoute.name)
          this.blackList = Array.from(new Set([newRoute.name, ...this.blackList]))
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

  .layout-content {
    position: relative;
    height: calc(100% - 56px);
    width: 100%;
    overflow: hidden;
    background: #efefef;
  }

  .layout-footer {
    position: relative;
    height: 56px;
    width: 100%;
  }
}

</style>
