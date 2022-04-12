/*
 * @Description:
 * @Version:
 * @Autor: wangXiaoMing
 * @Date: 2021-08-09 15:50:40
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-09-06 15:53:05
 */
import { Dialog } from "vant";
import store from "@/src/store/index";
export default {
  data() {
    return {
      mesData: {},
      alertCount: 0,
    }
  },
  created() {
    if (location.hash.indexOf('personal') === -1 && location.hash.indexOf('alertControl') === -1) {
      this.initStartMessage();
    }
  },
  methods: {
    /**
     * @description: mps的推送监听函数
     * @param {*}
     * @return {*}
     * @author: wangXiaoMing
     */
    initStartMessage() {
      let timestmap = +new Date();
      // 传参为 随机数 + '.' + 前端注册方法名
      let data = {
        message: `${timestmap}.getMessage`,
      };
      this.mesData = data;
      this.$hatom.setBridge("getMessage", (res) => {
        // 在此处处理消息通知
        console.log("----getMessage方法回调-----");
        console.log(res);
        const parseData = JSON.parse(res);
        if (
          parseData.Message &&
          parseData.Message.ext &&
          parseData.Message.ext.componentId &&
          parseData.Message.ext.componentId === "avc"
        ) {
          this.alertCount++;
          store.commit("SET_NEWALERT", this.alertCount);
          Dialog.alert({
            message: `有${this.alertCount}条新警情`,
            theme: "round-button",
          }).then(() => {
            this.alertCount = 0;
            if (this.$route.name !== "disposeList") {
              store.commit("SET_NEWALERT", this.alertCount);
            }
          });
        }
      });
      // 将参数传给原生端，然后原生接受到消息就会调用getMessage方法，前端通过getMessage处理消息就可以
      this.$hatom.message.startMessage((res) => {
        console.log("------开启了发消息的原生方法------");
        console.log(res.message);
      }, data);
    },
  },
  async destory() {
    // 在页面销毁时 关闭消息通知
    this.$hatom.message.stopMessage(
      (res) => {
        console.log(res.message);
      },
      // 传参data与 startMessage一致，必须保证startMessage与stopMessage传参data一直，原生才能正常关闭消息通知
      this.mesData
    );
  },
}