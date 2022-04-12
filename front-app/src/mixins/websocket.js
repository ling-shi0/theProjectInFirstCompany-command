/*
 * @Description:
 * @Version:
 * @Autor: wangXiaoMing
 * @Date: 2021-06-28 15:54:05
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-06-29 11:17:47
 */
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
const { protocol, host } = window.location;
const sockjsUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://10.15.80.192:9427/avc-app/webSocket'
    : `${protocol}//${host}/avc-app/webSocket`

export default {
  data() {
    return {
      stompClient: null,
      timer: null,
      socket: null,
      newAlarmCount: 0
    }
  },
  mounted() {
    this.initWebSocket()
  },
  methods: {
    // 初始化参数
    initWebSocket() {
      this.connection();
    },

    // 建立连接
    connection() {
      // 建立连接对象
      // 连接服务端提供的通信接口，连接以后才可以订阅广播信息和个人信息
      this.socket = new SockJS(sockjsUrl);

      // 获取STOMP子协议的客户端对象
      this.stompClient = Stomp.over(this.socket);
      // 定义客户端的认证信息，按需求配置
      let headers = {};

      // 向服务器发起websocket连接
      this.stompClient.connect(headers, () => {
        // 订阅服务端提供的某个topic
        this.stompClient.subscribe(`/user/${this.$store.state.userInfo.userIndexCode}/queue/msg`, (response) => {
          this.newAlarmCount++
        });
      }, (err) => {
        // 连接发生错误时的处理函数
        console.info('失败');
      });
    },

    // 断开连接
    disconnect() {
      if (this.stompClient != null) {
        this.stompClient.disconnect();
        console.info("Disconnected");
      }
    }
  },
  beforeDestory() {
    // 页面离开时断开连接，清除定时器
    this.disconnect();
    clearInterval(this.timer);
  }
}