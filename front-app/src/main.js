/*
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-05-08 14:04:13
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-09-14 09:30:40
 */
/* eslint-disable no-new */
/* eslint-disable semi */
import Vue from 'vue'
import Vant from 'vant'
import App from '@/src/App.vue'
import Config from '@/src/config'
import store from '@/src/store/index'
import router from '@/src/router/index'
import Hatom from '@/src/corejs/hatom.js'
import '@/src/corejs/WebViewJavascriptBridge.js'
import Components from '@/src/components/index.js'
import directives from '@/src/directives'//自定义指令
import '@/src/utils/dateFormat.js'
// import '@/src/corejs/flexible.js'
import { Lazyload } from 'vant' // 导入懒加载模块Lazyload

import 'vant/lib/index.css'
import '@/src/assets/styles/mixin.scss'
import '@/src/assets/styles/animation.css'
import '@/src/assets/styles/reset.css'
import '@/src/assets/styles/sprite.css'

import Vconsole from 'vconsole'

const _this = Vue.prototype
Vue.use(Hatom)
  .use(Config)
  .use(Components)
  .use(Lazyload)
Vue.use(Vant)

Vue.config.productionTip = false
Vue.prototype.bus = new Vue();
// 注册指令
Vue.use(directives)

const app = {
  init: function () {
    this.bindEvent()
  },
  onReady: function () {
    new Vue({ router, store, render: h => h(App) }).$mount('#app');
  },
  bindEvent: function () {
    this.onReady();
  }
}
const script = document.createElement('script')
script.setAttribute('type', 'text/javascript')
script.setAttribute('src', 'hmap.js')
document.getElementsByTagName('head')[0].appendChild(script)
if (_this.$isMobile()) {
  /** 是否在开发环境下，开启调试模式 */
  process.env.NODE_ENV === 'development' && new Vconsole()
  // new Vconsole()
  initToken()
} else {
  new Vue({ router, store, render: h => h(App) }).$mount('#app')
}

/**
 * @description: 实现token以及人员信息初始化的方法 提前于Vue 
 * @param {*}
 * @return {*}
 * @author: wangXiaoMing
 */
function initToken() {
  Vue.prototype.GLOBAL = {};
  new Promise((resolve, reject) => {
    try {
      Vue.prototype.$hatom.rootInfo.getRootInfo((res) => {
        res = JSON.parse(res.message);
        resolve(res)
      });
    } catch (error) {
      reject(error)
    }
  }).then((res) => {
    Object.assign(Vue.prototype.GLOBAL, res, {
      isMobile: true
    });
    app.init()
  }).catch((err) => {
    console.log(err);
    app.init()
  })
}