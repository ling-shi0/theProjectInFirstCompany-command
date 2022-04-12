/*
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-06-10 16:10:03
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-09-06 15:52:39
 */
import Vue from 'vue'
import Router from 'vue-router'

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(Router)

export const RoutesArr = [
  {
    path: '',
    redirect: '/disposeList'
  },
  // 警情处置的列表
  {
    name: 'disposeList',
    path: '/disposeList',
    meta: {
      routerName: '警情处置',
      isChildPage: false,
      deep: 0
    },
    component: () =>
      import(
        /* webpackChunkName: "disposeList" */ '@/src/pages/dispose/disposeList.vue'
      )
  },
  // 警情处置页面
  {
    name: 'toDispose',
    path: '/toDispose',
    meta: {
      routerName: '处置',
      isChildPage: true,
      deep: 1
    },
    component: () =>
      import(
        /* webpackChunkName: "toDispose" */ '@/src/pages/dispose/toDispose.vue'
      )
  },
  // 含有地图的详情，用于报警、线索上报
  {
    name: 'detailPage',
    path: '/detailPage',
    meta: {
      routerName: '警情详情',
      isChildPage: true,
      deep: 1
    },
    component: () => import(/* webpackChunkName: "detailPage" */ '@/src/pages/detailPage/detailPage.vue')
  },
  // 布控告警页面
  {
    name: 'alertControl',
    path: '/alertControl',
    meta: {
      routerName: '布控告警',
      isChildPage: false,
      deep: 0
    },
    component: () => import(/* webpackChunkName: "alertControl" */ '@/src/pages/alertControl/index.vue')
  },
  // 布控告警详情页面
  {
    name: 'alertControlDetail',
    path: '/alertControlDetail',
    meta: {
      routerName: '告警详情',
      isChildPage: true,
      deep: 1
    },
    component: () => import(/* webpackChunkName: "alertControl" */ '@/src/pages/alertControl/alertDetail.vue')
  },
  // 个人信息 我的 页面
  {
    name: 'personal',
    path: '/personal',
    meta: {
      routerName: '我的',
      isChildPage: false,
      deep: 0
    },
    component: () => import(/* webpackChunkName: "alertControl" */ '@/src/pages/personal/index.vue')
  }
]

const router = new Router({
  mode: 'hash',
  routes: RoutesArr
})

router.beforeEach((to, from, next) => {
  to.meta.cache = to.query.cache || true
  Vue.prototype.$direction = to.meta.deep >= from.meta.deep ? 'left' : 'right'
  next()
})

router.afterEach((to, from) => {
  /** 监听返回按钮，返回到最后一层，直接退出应用 */
  if (to.meta.deep < 1 && from.meta.deep > 1) {
    Vue.prototype.$hatom.page.exit()
  }
})

export default router
