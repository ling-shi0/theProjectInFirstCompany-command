<template>
  <div class="out-panel">
    <div class="orbitInfoContent">
      {{ time }}
    </div>
    <div class="icon"></div>
  </div>
</template>
<script>
export default {
  name: 'MapPopupTrack',
  data() {
    return {
      // img: require('../../assets/images/mapAlarmCenter/img0002.png'),
      // data: [
      //   {
      //     label: '证件号码:',
      //     value: '330329303938372628'
      //   },
      //   {
      //     label: '预警地点:',
      //     value: 'h和平区网鱼网咖'
      //   }
      // ]
    };
  },
  props: {
    time: {
      type: String
    }
    // data: {
    //   type: Array
    // },
    // img: {
    //   type: String
    // },
    // title: {
    //   type: String
    // }
  },
  methods: {
    closeBtnClick() {
      // this.$parent.pxoveInfoTemplate('orbitInfo')
      // this.$parent.pxoveInfoTemplate('orbitSelectedPoint')
      this.bus.$emit('orbitInfoClose');
    }
  }
};
</script>
<style lang="less" scoped>
.out-panel {
  transform: translate(-50%, calc(-50% - 70px)) !important;
  position: relative;
}
.icon {
  position: absolute;
  background: url('~@/assets/images/orbit/orbitCircle.png');
  height: 52px;
  width: 46px;
  margin-left: 63px;
  background-size: cover;
}
.orbitInfoContent {
  //   height: 300px;

  height: 40px;
  width: 172px;
  text-align: center;
  line-height: 40px;
  background: #ffffff;
  box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  border-radius: 4px;
  .orbitTop {
    height: 12.8px;
    background: url('../../assets/images/mapAlarmCenter/popbg02001.png');
    background-size: 100% 100%;
  }
  .orbitCenter {
    // .orbitImg {
    //   //   background-image: ;
    // }
    padding: 0 6.4px;
    background: url('../../assets/images/mapAlarmCenter/popbg02002.png');
    background-size: 100% 100%;
    .orbitTitle {
      height: 19.2px;
      font-size: 14.4px;
      margin-left: 12.8px;
    }
  }
  .orbitClose {
    background: url('../../assets/images/mapAlarmCenter/close01.png');
    background-size: cover;
    position: fixed;
    right: 0px;
    top: 0px;
    height: 19.2px;
    width: 19.2px;
    cursor: pointer;
    &:hover {
      background-image: url('../../assets/images/mapAlarmCenter/close02.png');
      background-size: cover;
    }
  }
  .orbitBottom {
    .orbitData {
      display: flex;
      font-size: 12.8px;
      line-height: 19.2px;
      .circle {
        height: 12.8px;
        width: 12.8px;
        margin-top: 3.2px;
        margin-left: 12.8px;
        background: url('../../assets/images/mapAlarmCenter/popimg.png');
        background-size: cover;
      }
      .orbitKey {
        width: 64px;
        color: #acd1ff;
      }
      // .orbitValue {
      // }
    }
    padding-top: 6.4px;
    height: 70.4px;
    background: url('../../assets/images/mapAlarmCenter/popbg02003.png');
    background-size: 100% 100%;
  }
}
</style>
