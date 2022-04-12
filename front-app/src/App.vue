<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-04-25 16:40:43
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-09-08 18:55:02
-->
<template>
  <div id="app" v-move="{ left2Right }">
    <div class="status-bar"></div>
    <div class="main-router">
      <transition :name="$direction">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </transition>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { userInfo } from "./axios/mockApi.js";
import store from "@/src/store/index";
import { Dialog, Toast } from "vant";
import http from "@/src/axios/dispose";
import initMpsReceive from "@/src/mixins/initMpsReceive.js";

export default {
  name: "App",
  data() {
    return {
      direction: "left",
      whiteList: [],
      blackList: [],
      routerKey: "",
      activeTab: 0,
      showTabbar: true,
      tabbarItems: this.$constant.tabbarList,
      testStr: "",
    };
  },
  mixins: [initMpsReceive],
  watch: {
    $route(val) {
      this.showTabbar = !val.meta.isChildPage;
    },
  },
  async created() {
    await this.initUserInfo();
    this.listenBackbutton();
  },
  async mounted() {
    const h = this.$isMobile()
      ? await this.getSyncDeviceScreen()
      : this.$constant.STATUS_BAR_HEIGHT;
    /** 页面加载完成的回调， 通知原生APP，该页面模块加载完毕 */
    this.$hatom.native("PageLifecyclePlugin.onCall", (res) => "", {
      message: "firstPageFinished",
    });
    //定时上报警员GPS位置
    this.uploadGPSPosition();
  },
  methods: {
    async getSyncDeviceScreen() {
      const res = await this.$hatom.getSyncScreenInfo();
      const screenInfo = JSON.parse(res.message);
      console.log(screenInfo);
      this.$hatom.statusBar.setStatusBarMode(
        {
          iconMode: "dark",
        },
        (res) => {
          console.log(res);
        }
      );
      return screenInfo.statusBarHeight / screenInfo.screenDensity;
    },
    /**
     * @description: 手机默认回退事件的监听函数
     * @param {*}
     * @return {*}
     * @author: wangXiaoMing
     */
    listenBackbutton() {
      this.$hatom.setBridge("onBackPressed", (res) => {
        this.routerGolast();
      });
    },
    /**
     * @description: 个人信息初始化函数 包括token更新
     * @param {*}
     * @return {*}
     * @author: wangXiaoMing
     */
    async initUserInfo() {
      if (!this.$isMobile()) {
        Vue.prototype.GLOBAL = {};
        Object.assign(Vue.prototype.GLOBAL, {
          isMobile: false,
          token: userInfo.token,
          Toast: Toast,
        });
        store.commit("SET_USER_INFO", userInfo);
      } else {
        await this.$hatom.rootInfo.getRootInfo((res) => {
          console.log(res);
          res = JSON.parse(res.message);
          Object.assign(Vue.prototype.GLOBAL, res, {
            isMobile: this.$isMobile(),
          });
          store.commit("SET_USER_INFO", res);
        });
      }
    },
    /**
     * @description: 手势退出回调
     * @param {*} args
     * @return {*}
     * @author: wangXiaoMing
     */
    left2Right(args) {
      // 从左往右100px的地方时可以执行手势
      if (args[1] > 100) {
        return;
      }
      this.routerGolast();
    },
    /**
     * @description: 位置定时上传函数 没30秒一传 去除了经纬度为0的噪点数据 顺便加入了token更新的部分
     * @param {*}
     * @return {*}
     * @author: wangXiaoMing
     */
    uploadGPSPosition() {
      this.uploadPosition();
      this.uploadTimer = setInterval(this.uploadPosition, 30 * 1000);
    },
    uploadPosition() {
      this.$hatom.locationInfo.getLocation((res) => {
        const longitude = JSON.parse(res.message).longitude;
        const latitude = JSON.parse(res.message).latitude;
        if (!+longitude || !+latitude) {
          return;
        }
        this.bus.$emit("uploadPosition", {
          longitude,
          latitude,
        });
        http
          .uploadPosition({
            userIndexCode: this.$store.state.userInfo.userIndexCode,
            deptIdxCode: this.$store.state.userInfo.deptIndexCode,
            realName: this.$store.state.userInfo.realName,
            reportTime: new Date().Format("yyyy-MM-dd HH:mm:ss"),
            longitude,
            latitude,
          })
          .then((res) => {});
      });
    },
    changeTab(val) {
      this.$router.push({ name: this.$constant.tabbarList[val].router });
    },
    returnRoute() {
      this.routerGolast();
    },
    /**
     * @description: 回退判断函数 在主页的时候回退出应用 在child页面下回退上一页
     * @param {*}
     * @return {*}
     * @author: wangXiaoMing
     */
    routerGolast() {
      if (!this.$router.history.current.meta.isChildPage) {
        Dialog.confirm({
          message: "是否退出应用？",
        })
          .then(() => {
            this.$hatom.page.exit();
          })
          .catch(() => {
            // on cancel
          });
      } else {
        this.$router.go(-1);
      }
    },
  },
  beforeRouteLeave(to, from, next) {
    this.direction = to.meta.deep >= from.meta.deep ? "left" : "right";
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.direction = to.meta.deep >= from.meta.deep ? "left" : "right";
    });
  },
};
</script>
<style lang="scss">
body {
  overflow: hidden !important;
}
html {
  font-size: 16px;
}
//安卓默认360
html,
body {
  width: 100%;
  font-size: 62.5%;
}
//iphone5
@media only screen and (min-width: 320px) {
  html,
  body {
    font-size: 55.556% !important;
  }
}
//一般安卓手机
@media only screen and (min-width: 360px) {
  html,
  body {
    font-size: 75% !important;
  }
}
// //iphone6/7/8
// @media only screen and (min-width: 375px) {
//   html,
//   body {
//     font-size: 65.10417% !important;
//   }
// }
// //iphone6/7/8 plus
// @media only screen and (min-width: 411px) {
//   html,
//   body {
//     font-size: 71.875% !important;
//   }
// }
// 中间区间段的手机 我也不知道会有啥 先写一下吧
@media only screen and (min-width: 450px) {
  html,
  body {
    font-size: 80% !important;
  }
}
//华为M6
@media only screen and (min-width: 510px) {
  html,
  body {
    font-size: 90% !important;
  }
}
//ipad
@media only screen and (min-width: 768px) {
  html,
  body {
    font-size: 133.3333% !important;
  }
}
//ipad pro
@media only screen and (min-width: 1024px) {
  html,
  body {
    font-size: 177.77778% !important;
  }
}
</style>
<style lang="scss" scoped>
html,
body,
#app {
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  font-family: Helvetica, "Arial", "Microsoft YaHei", "黑体", "宋体", sans-serif;
  top: 0;
}
.status-bar {
  width: 100%;
  background: #fff;
  height: 2rem;
}
.main-router {
  width: 100%;
  height: calc(100% - 2rem);
}
</style>
