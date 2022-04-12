<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-03-11 11:42:19
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-04-09 10:58:42
-->
<template>
  <simple-player-pro
    ref="spPlayer"
    :visible.sync="playbackDialogVisible"
    :device-info="deviceInfo"
    :common-config="playerCommonConfig"
    :player-mode="playerMode"
    :type="playerMode"
    @loadResult="handleLoadResult"
    title="视频播放"
    :addMode="false"
    style="width: 100% !important; height: 100% !important; z-index: 2000"
    :diyPosition="true"
    :playerIdPrefix="'player' + index"
  ></simple-player-pro>
</template>

<script>
import Player from '@/components/alarm-command/around-video-point/player.js';

export default {
  name: 'simplePlayer',
  data() {
    return {
      playerMode: 1,
      player: null,
      isDev: process.env.NODE_ENV === 'development',
      playbackDialogVisible: false,
      deviceInfo: [],
      playerCommonConfig: {},
      loadRes: true // 播放器插件加载结果
    };
  },
  props: {
    itemData: {
      type: [Object, String],
      default: () => {}
    },
    videoMes: {
      type: [Object, String],
      default: () => {}
    },
    index: {
      type: Number,
      default: 0
    }
  },
  watch: {
    itemData(val) {
      this.init();
    }
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    clearInterval(this.interval);
    this.interval = null;
  },
  methods: {
    handleLoadResult(val) {
      this.loadRes = val;
    },
    getMapValue(str) {
      return str.split(':')[1];
    },
    init() {
      const comment =
        this.itemData &&
        JSON.parse(this.itemData).comment.commentcmd.split(';');
      if (!this.player) this.player = new Player();
      const cmd = `btoolsprotocol://CenterUrl:${this.getMapValue(
        comment[1]
      )};Toollist:ID_bsimpleplayer;`;
      this.player
        .run(cmd)
        .listen(comments => {
          console.log(comments);
        })
        .error(err => {
          console.log(err);
        });
      this.playbackDialogVisible = true;
      this.$nextTick(() => {
        this.$set(this, 'deviceInfo', [
          {
            deviceName: JSON.parse(this.itemData).nameStr, // 设备名称
            indexCode: this.getMapValue(comment[12]), // 点位唯一标识符
            playMode: 'preview', // 播放模式，preview预览，playback回放
            streamType: 0, // 码流类型，0主码流，1子码流
            transmode: 1, // 取流方式，0代表UDP取流，1代表TCP取流
            isSmallEagleEyeAbility: 0, // 是否为小鹰眼设备。0非小鹰眼，1小鹰眼。
            cloudAbility: true, // 是否具有云台能力
            cascade: false // 是否级联
          }
        ]);
        this.$set(this, 'playerCommonConfig', {
          strAuthorization: this.getMapValue(comment[10]),
          strToken: this.getMapValue(comment[13]),
          strProtocol: this.getMapValue(comment[11]),
          strPlatIp: this.getMapValue(comment[7]),
          strPlatPort: this.getMapValue(comment[8]),
          strUserName: this.getMapValue(comment[9]),
          iMultiRouteId: this.getMapValue(comment[14])
        });
      });
    },
    pauseClose() {
      this.playbackDialogVisible = false;
    },
    pauseOpen() {
      this.playbackDialogVisible = true;
    }
  }
};
</script>

<style lang="scss">
.multi-sp-wrapper {
  width: 100% !important;
  height: 100% !important;
}
</style>
