/**
 * @params options.port 端口号，默认是18000，当是https请求时，默认是18001
 */

// import http from "utils/http";
// import { Button,Modal } from 'antd';
// const { confirm } = Modal;
import Vue from 'vue';
const vm = new Vue();
export default class Player {
  static IS_HTTPS = window.location.protocol.indexOf('https') > -1;
  centerUrl = '';
  socket = null;
  constructor(options) {
    this.options = Object.assign(
      {
        port: Player.IS_HTTPS ? '18001' : '18000',
        closeAfterListen: false
      },
      options
    );
  }
  isExist = false;
  connect() {
    return new Promise((resolve, reject) => {
      const CHECK_CMD = {
        comment: { commenttype: 'checkapp', context: 'btoolsprotocol:' }
      };
      const checkIsExist = (msg) => {
        const data = JSON.parse(msg.data);
        if (data.comment.resultCode === '1') {
          // 连接成功
          this.isExist = true;
          resolve();
        } else {
          // 失败
          vm.$confirm(
            '检测到插件助手未安装,可能影响视频播放，是否下载安装插件助手？',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'question',
              size: 'middle'
            }
          )
            .then(() => {
              window.open(`${this.centerUrl}/download`);
            })
            .catch(() => {});
          this.isExist = true;
          reject(new _Error(0, 'btools connect failed'));
        }
      };
      if (this.socket && this.socket.readyState === 1) {
        this.socket.onmessage = checkIsExist;
        this.socket.send(JSON.stringify(CHECK_CMD));
        return;
      }
      this.isExist = false;
      this.socket = new WebSocket(
        `${Player.IS_HTTPS ? 'wss' : 'ws'}://127.0.0.1:${
          this.options.port
        }/WebS_Js`
      );
      this.socket.onmessage = checkIsExist;
      this.socket.onopen = () => {
        this.socket.send(JSON.stringify(CHECK_CMD));
      };
      this.socket.onerror = () => {
        this.isExist = false;
        reject(new _Error(-1, 'btools does not exist, please download it'));
      };

      this.socket.onclose = () => {
        const status = this.socket.readyState;
        if (status === 3) {
          vm.$confirm(
            '检测到插件助手未安装,可能影响相关App启动，是否下载安装插件助手？',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'question',
              size: 'middle'
            }
          )
            .then(() => {
              window.open(`${this.centerUrl}/download`);
            })
            .catch(() => {});
        }
        this.isExist = false;
        this.socket = null;
      };
    });
  }
  listenCallback = null;
  listener = false;
  listenCount = 0;
  run(cmd) {
    const url = cmd;
    this.centerUrl = url ? url.split(';')[0].split('CenterUrl:')[1] : '/portal';
    const playUrl = url ? url.split(';')[1] : '';
    const _run = () => {
      const data = {
        comment: {
          commenttype: 'startapp',
          context: 'btoolsprotocol:',
          commentcmd: url
        }
      };
      if (!this.listener) console.warn('you have no listener');
      if (this.listenCount > 1)
        console.warn(
          'the listener is more then 1, the listener after 1 will override 1'
        );
      this.socket.onmessage = (msg) => {
        this.listenCallback && this.listenCallback(JSON.parse(msg.data));
      };
      this.socket.send(JSON.stringify(data));
      // const playUrl = url ? url.split(';')[1] : '';
      // window.open("videoplayer://" + playUrl); // ？是否因此出现了老弹窗，删掉是否会影响现弹窗
    };
    if (!this.isExist)
      this.connect()
        .then(_run)
        .catch((e) => this._triggerError(e));
    else _run();
    // window.open(`${cmd}`);
    return this;
  }
  player(resourceId, UserID) {
    alert('调接口');
    /*    http
          .post({
            url: '/client/player/url',
            data: {
              resourceId,
              UserID
            }
          })
          .then(res => {
            this.run(res.data.url);
          })
          .catch(e => {
            return e;
          });*/
  }
  listen(callback, options) {
    const _options = Object.assign({ closeAfterListen: false }, options);
    this.listener = true;
    this.listenCount++;
    typeof callback === 'function' &&
      (this.listenCallback = (data) => {
        callback(data.comment);
        if (
          (_options && _options.closeAfterListen) ||
          this.options.closeAfterListen
        ) {
          this.socket.close();
        }
      });
    return this;
  }
  errorCallback = null;
  _triggerError(e) {
    this.errorCallback && this.errorCallback(e);
  }
  error(callback) {
    typeof callback === 'function' &&
      (this.errorCallback = (e) => {
        callback(e);
      });
  }
}

export const PLAYER = {
  PLAY_REAL: 'playReal',
  PLAY_BACK: 'playBack',
  ZH_CN: 'zh_CN',
  EN_US: 'en_US'
};

class _Error extends Error {
  code = null;
  constructor(code, msg) {
    super(msg);
    this.code = code;
  }
}
