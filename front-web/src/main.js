/*
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-02-23 14:42:47
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2022-03-31 11:02:12
 */
import Vue from 'vue';
import hui from 'hui';
import '@/core/huiPro';
import initApp from '@/core/initApp';
import components from '@/components';
import { SimplePlayerPro } from 'simple-player-pro';
import 'simple-player-pro/dist/-simple-player.css';
import '@/style/index.scss'


Vue.use(SimplePlayerPro)


Vue.use(hui);
Vue.prototype.bus = new Vue(); // 组件中用到了vue的bus通信
initApp(Vue);

components.map(({ install }) => {
  install(Vue);
});
