/**
 * @desc 文本 语音 视频 调用
 */
import Verto from '@/utils/verto';
import $ from 'jquery';
import {
  mapState,
  mapMutations
} from 'vuex';
export default {
  data() {
    return {
      verto: null
    }
  },
  computed: {
    ...mapState(['vertoLoginInfo'])
  },
  methods: {
    ...mapMutations(['setCurChatingMembers', 'setDisplayVideoPanel', 'setDisplayAudioPanel', 'setCurChatResId', 'setCurCallResId']),
    // 处理语音/视频聊天
    async doChatWithVideoOrAudio(data, useVideo) {
      this.verto = Verto.getInstance();
      // 正在通话中，无法进行其他通化操作
      if (this.verto.currentCall) {
        this.$message.warning('正在通话中，请结束当前通话后操作。');
        return;
      }
      this.setCurChatingMembers([]);
      useVideo ? this.setDisplayVideoPanel(true) : this.setDisplayAudioPanel(true);
      const { hasPerms, hasAudioDevice, hasVideoDevice, isDeviceErr } = await this.hasDevice(
        useVideo
      );

      // 没有授权或者设备,则关闭通话面板
      if (!hasPerms || (!useVideo && !hasAudioDevice) || (useVideo && !hasVideoDevice)) {
        setTimeout(() => {
          useVideo ? this.setDisplayVideoPanel(false) : this.setDisplayAudioPanel(false)
        }, 200);
        !isDeviceErr && useVideo && !hasVideoDevice && this.$message.warning('视频设备未插入');
        return;
      }
      this.doChat(data, useVideo);
    },

    // 是否拥有打开摄像头和音频权限
    hasDevicePerms() {
      return new Promise((resolve, reject) => {
        $.FSRTC.checkPerms(
          permCheck => {
            // 禁用权限且未预警过
            if (!permCheck) {
              reject(permCheck)
            } else {
              resolve(permCheck)
            }
          },
          true,
          true
        )
      })
    },

    // 监测设备接入情况
    detectDevices() {
      return new Promise((resolve, reject) => {
        $.verto.refreshDevices(isSuc => {
          isSuc ? resolve(isSuc) : reject(isSuc)
        })
      })
    },
    // 是否拥有设备
    async hasDevice(useVideo) {
      // 授权情况
      let hasPerms = false;
      try {
        await this.hasDevicePerms();
        hasPerms = true;
      } catch (err) {
        console.error(err);
      }

      // 设备接入情况
      let hasAudioDevice = false;
      let hasVideoDevice = false;
      try {
        const res = await this.detectDevices();

        // 设备被占用，暂时只能尝试重启解决
        if (res === 'NotReadableError') {
          this.$message.warning('音频设备出现问题，请重启电脑后尝试');
          return {
            isDeviceErr: true
          }
        }
      } catch (err) {
        console.error(err);
      }
      hasAudioDevice = !!$.verto.audioInDevices.length;
      hasVideoDevice = !!$.verto.videoDevices.length;

      if (!hasPerms) {
        this.$message.warning('音频和摄像头设备未接入或权限已被禁用，请检查后重刷页面。');
      } else if (!useVideo && !hasAudioDevice) {
        this.$message.warning('音频设备未接入');
      } else if (!hasAudioDevice && !hasVideoDevice) {
        this.$message.warning('音频、摄像头设备未接入');
      }
      return {
        hasPerms,
        hasAudioDevice,
        hasVideoDevice
      }
    },
    // 视频语音聊天
    doChat(data, useVideo = false) {
      const {
        number,
        resId,
        callPhoneNum,
        phoneNumber
      } = data
      this.verto = Verto.getInstance()
      this.setCurChatResId(resId)
      this.setCurCallResId(resId)
      this.verto.makeCall({
        callNum: number,
        callerNum: this.vertoLoginInfo.number,
        useVideo,
        'X-XMSG-EXTEN': data['X-XMSG-EXTEN'] && `members=${data['X-XMSG-EXTEN'].join()}`
      })
    }
  }
}
