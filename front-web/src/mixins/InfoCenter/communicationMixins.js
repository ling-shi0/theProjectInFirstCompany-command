/**
 * 融合通信mixins
 */
import Verto from '@/utils/verto';
import { UUIDGenerator } from '@/utils/common';
import { getUsersByAcount, getCurUser } from '@/api/InfoCenter/infoCenter';
let isVertoInit = false;
let isVertoInitSuc = false;
let storeVertoLoginInfo = {};
export default {
  data() {
    return {
      verto: null,
      vertoLoginData: null
    };
  },
  async mounted() {
    if (!isVertoInit) {
      isVertoInit = true;
      await this.getVertoLoginInfo();
      this.initChatInfoWS();
    } else {
      this.getInstance();
    }
  },
  methods: {
    // 获取verto登录信息
    async getVertoLoginInfo() {
      // 获取vertor登录账号
      const {
        data: { userIndexCode }
      } = await getCurUser();
      // 本地测试将acount写死，获取登陆用户
      const {
        data: { registCode, number, name, resId, displayNumber, deptPath }
      } = await getUsersByAcount({
        // account: userIndexCode
        account: 'admin'
      });

      // 存储信息
      this.vertoLoginData = {
        number,
        displayNumber,
        password: registCode,
        name,
        ip: '10.33.43.58', // 本地测试使用
        // ip: location.hostname,
        resId,
        deptPath
      };
      storeVertoLoginInfo = this.vertoLoginData;
    },
    // 初始化聊天的websocket
    initChatInfoWS() {
      const { number, ip, password } = this.vertoLoginData;
      const wsProtocol = location.protocol === 'http:' ? 'ws' : 'wss';
      // const socketUrl =
      //   process.env.NODE_ENV === 'development'
      //     ? 'wss://10.33.43.58:443/xmessage-ads/ws'
      //     : `${wsProtocol}://${location.host}/xmessage-ads/ws`;
      // 本地测试使用
      const socketUrl = `wss://10.33.43.58:443/xmessage-ads/ws`;
      const that = this;
      this.verto = Verto.getInstance({
        login: `${number}@${ip}`,
        passwd: password,
        ringFile: `${process.env.VUE_APP_CONTEXT}/static/audio/bell_ring.wav`,
        tag: function () {
          const tag = `${UUIDGenerator()}_webcam`;
          that.createVideoDom(tag);
          return tag;
        },
        localTag: 'localWebcam',
        socketUrl,
        videoParams: {
          minWidth: 640,
          minHeight: 680,
          maxWidth: 640,
          maxHeight: 680
        },
        onMessage: this.handleMessage,
        onWSLogin: this.handleVertoLoginSuc,
        onDialogState: this.handleDialogState
      });
      isVertoInitSuc = true;
    },
    getInstance() {
      if (isVertoInitSuc) {
        this.verto = Verto.getInstance({
          onMessage: this.handleMessage,
          onDialogState: this.handleDialogState,
          onWSLogin: this.handleVertoLoginSuc,
          onWSClose: this.handleVertoWSClose
        });
        this.vertoLoginData = storeVertoLoginInfo;
      } else {
        setTimeout(() => {
          this.getInstance();
        }, 100);
      }
    },
    createVideoDom(tag) {
      const $wrap = tag.includes('webcam')
        ? document.querySelector('.J-chat-video-wrap')
        : document.querySelector('.meeting-frame-main');
      const videoEl = document.createElement('video');
      videoEl.setAttribute('id', tag);
      videoEl.setAttribute('class', 'video');
      videoEl.setAttribute('autoplay', 'autoplay');
      videoEl.style.display = 'none';
      $wrap.appendChild(videoEl);
    }
  }
};
