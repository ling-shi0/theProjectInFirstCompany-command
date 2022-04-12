import { UUIDGenerator } from './common';
import $ from 'jquery';
export default class Verto {
  constructor(opts) {
    const {
      login,
      passwd,
      socketUrl,
      tag,
      localTag,
      videoParams,
      ringFile,
      onMessage,
      onDialogState,
      onWSLogin,
      onWSClose
    } = opts;
    this.instance = null;
    this.vertoHandle = null; // verto操作对象
    this.currentCall = null; // 当前音频对象
    this.login = login; // 用户名
    this.passwd = passwd; // 密码
    this.tag = tag; // 对方视频标签id
    this.localTag = localTag; // 本机视频id
    this.videoParams = videoParams; //
    this.socketUrl = socketUrl;
    this.ringFile = ringFile; // 铃声文件
    this.vertoCallbacksQueue = [{
      onMessage,
      onDialogState,
      onWSClose,
      onWSLogin
    }];
    this.vertoCallbacks = {
      onWSLogin: this.handleWSLogin.bind(this),
      onWSClose: this.handleWSClose.bind(this),
      onMessage: this.handleMessage.bind(this),
      onDialogState: this.handleDialogState.bind(this)
    };
    this.main();
  }

  // 登陆成功
  handleWSLogin() {
    this.handleNormalCallback('onWSLogin', ...arguments);
  }

  // 关闭通信
  handleWSClose() {
    this.handleNormalCallback('onWSClose', ...arguments);
  }

  // 消息处理
  handleMessage() {
    this.handleNormalCallback('onMessage', ...arguments);
  }

  // 处理通话
  handleDialogState() {
    this.handleNormalCallback('onDialogState', ...arguments);
  }

  // 处理回调
  handleNormalCallback(funcName, ...rest) {
    this.vertoCallbacksQueue.forEach(i => {
      i[funcName] && i[funcName](...rest);
    });
  }

  /* eslint-disable no-undef */
  // 初始化配置和监听操作
  bootstrap=()=> {
    const sessid = UUIDGenerator();
    const {
      login,
      passwd,
      socketUrl,
      ringFile,
      tag,
      localTagl,
      videoParams
    } = this;
    /* eslint-disable new-cap */
    this.vertoHandle = new $.verto({
        login,
        passwd,
        socketUrl,
        ringFile,
        tag,
        localTagl,
        videoParams,
        sessid,
        deviceParams: {
          useCamers: 'any',
          useMic: 'any',
          useSpeak: 'any'
        },
        iceServers: true,
        audioParams: {
          googAutoGainControl: false,
          googNoiseSuppression: false,
          googHighpassFilter: false
        }
      },
      this.vertoCallbacks);
  }

  // 主函数
  async main() {
    try {
      await $.verto.init({}, this.bootstrap);
    } catch (err) {
      console.log('err=', err);
    }
  }

  /**
   * @desc 打电话
   * @param {String|Number} callNum 接收人id
   * @param {Sting|Number} callerNum 拨打者id
   * @param {Sting|Number} callerName 拨打者名称
   */
  makeCall({
    callNum,
    callerName,
    callerNum,
    useVideo,
    ...rest
  }) {
    if (!callNum || !this.vertoHandle) {
      return;
    }
    this.currentCall = this.vertoHandle.newCall({
      destination_number: callNum,
      caller_id_number: callerNum,
      caller_id_name: callerName,
      useVideo,
      ...rest
    });
  }

  // 挂断电话
  hangupCall(params) {
    if (this.currentCall) {
      this.currentCall.hangup(params);
    }
  }

  // 清空当前通话
  clearCurrentCall() {
    this.currentCall = null;
  }

  // 禁用麦克风
  mute(status = 'toggle') {
    if (this.currentCall) {
      this.currentCall.setMute(status);
    }
  }

  // 禁用摄像头
  muteVideo(status = 'toggle') {
    if (this.currentCall) {
      this.currentCall.setVideoMute(status);
    }
  }

  // 发送消息
  sendChat(payload) {
    if (!this.vertoHandle) {
      return;
    }
    this.vertoHandle.message(payload);
  }

  // 实例化
  static getInstance(opts) {
    if (!this.instance && opts) {
      this.instance = new Verto(opts);
    } else if (opts) {
      const {
        onWSLogin,
        onWSClose,
        onMessage,
        OnDialogState
      } = opts;
      this.instance.vertoCallbacksQueue.push({
        onWSLogin,
        onWSClose,
        onMessage,
        OnDialogState
      });
    }
    return this.instance;
  }

  // 设置答复对象实例
  setAnswerInstance(obj) {
    this.currentCall = obj;
  }

  // 答复
  answer(params) {
    this.currentCall.answer(params);
  }

  // 禁用本地扬声器
  setLocalMute() {
    this.currentCall.audioStream.muted = !this.currentCall.audioStream.muted;
  }

}
