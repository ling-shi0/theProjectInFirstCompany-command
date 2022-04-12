<template>
  <div class="playContain" v-show="playShow">
    <!-- <div class="playName">{{ type }}{{ name }}</div>
      <div class="splitLine"></div> -->
    <div v-show="statusShow" @click="statusClick" class="status icon"></div>
    <div v-show="!statusShow" @click="statusClick" class="play icon"></div>
    <!-- <div class="splitLine"></div> -->
    <div class="back icon" @click="speedClick"></div>
    <div class="speed">{{ showSpeed }}x</div>
    <div class="forward icon" @click="speedClick"></div>
  </div>
</template>
<script>
export default {
  name: 'orbit-play',
  data() {
    return {
      playWrapperShow: true,
      ordSelect: true,
      colorSelect: true,
      statusShow: true,
      picSelect: true,
      name: '',
      type: '',
      picUrl:
        'http://10.195.238.106:6501/pic?AC01F06B0660EE0D6168*cloud/123/18701;157739751183890224466?pic*2120781326*155226*5637*AC01F06B0660EE0D6168-2*1577412760',
      speed: 1,
      playShow: true
    };
  },
  components: {
    //  OrbitMap,
    //  OrbitList
  },
  created() {},
  mounted() {
    let url = location.href;
    this.type =
      this.getQueryString(url, 'type') === 'face' ||
      this.getQueryString(url, 'type') === 'personId'
        ? '姓名：'
        : this.getQueryString(url, 'type') === 'vehicle'
        ? '车牌号：'
        : this.getQueryString(url, 'type') === 'imsi'
        ? 'imsi：'
        : '布控目标：';
    // this.name = this.getQueryString(url, 'name');
    this.bus.$on('tabChange', param => {
      if (param == '按时间') {
        this.playWrapperShow = true;
      } else {
        this.playWrapperShow = false;
      }
    });
    this.bus.$on('playClose', param => {
      this.playShow = false;
    });
    this.bus.$on('complete', param => {
      this.statusShow = true;
    });
    this.bus.$on('getListData', param => {
      this.name = param.name;
      //  this.picUrl=param.bkgPicUrl;
    });
    this.bus.$on('mapDataChange', param => {
      // this.showResourceDetail(param);
    });
  },
  computed: {
    showSpeed() {
      let speedValue;
      if (this.speed == 0.5) {
        return '1/2';
      } else if (this.speed == 0.25) {
        return '1/4';
      } else if (this.speed == 0.125) {
        return '1/8';
      } else if (this.speed == 0.0625) {
        return '1/16';
      } else {
        speedValue = this.speed;
        return speedValue;
      }
    }
  },
  methods: {
    getQueryString(url, name) {
      let reg = new RegExp('(^|\\?|&)' + name + '=([^&]*)(\\s|&|$)', 'i');
      if (reg.test(url)) return unescape(RegExp.$2.replace(/\+/g, ' '));
      return '';
    },
    orderSelectClick() {
      this.ordSelect = !this.ordSelect;
    },
    colorSelectClick() {
      this.colorSelect = !this.colorSelect;
    },
    picSelectClick() {
      this.picSelect = !this.picSelect;
    },
    statusClick() {
      this.statusShow = !this.statusShow;
      this.bus.$emit('statusChange', this.statusShow);
    },
    speedClick(e) {
      if (e.currentTarget.className.indexOf('forward')) {
        if (this.speed > 0.0625) {
          this.speed = this.speed / 2;
        } else {
          this.$message('已经是最小速度');
        }
      } else {
        if (this.speed < 16) {
          this.speed = this.speed * 2;
        } else {
          this.$message('已经是最大速度');
        }
      }
      this.bus.$emit('speedChange', this.speed);
    }
  }
};
</script>
<style lang="less" scoped>
.playContain {
  position: absolute;
  display: flex;
  right: 700px;
  bottom: 20px;
  background: #ffffff;
  box-shadow: 0 8px 24px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  height: 60px;
  width: 160px;
  .splitLine {
    height: 12px;
    width: 1px;
    background-color: #305e9d;
    margin: 16px 2px;
  }
  .icon {
    margin: 18px 10px;
    height: 24px;
    width: 24px;
    cursor: pointer;
  }
  .status {
    background: url('../../assets/images/orbit/play1.png');
    background-size: cover;
  }
  .play {
    background: url('../../assets/images/orbit/pause1.png');
    background-size: cover;
  }
  .back {
    background: url('../../assets/images/orbit/back1.png');
    background-size: cover;
  }
  .speed {
    margin: 20px 6px;
    // color: rgba(255, 255, 255, 0.9);
  }
  .forward {
    background: url('../../assets/images/orbit/forward1.png');
    background-size: cover;
  }
  .select {
    background: url('../../assets/images/orbit/selected.png');
    background-size: cover;
  }
  .font {
    margin: 14px -8px;
  }
  .unSelect {
    background: url('../../assets/images/orbit/select.png');
    background-size: cover;
  }
  .playByTime {
    height: 56px;
    padding: 6px 12px;
    background: url('../../assets/images/orbit/orbitBg.png');
    background-size: cover;
    display: flex;
    .playHeadPic {
      height: 44px;
      width: 44px;
      background: url('../../assets/images/orbit/head44.png');
      background-size: cover;
      .playPic {
        margin: 4px;
        height: 36px;
        width: 36px;
      }
    }
    .playName {
      color: #fff;
      margin: 14px 14px;
    }

    .help {
      margin: 10px 0px 10px 10px;
      height: 24px;
      width: 24px;
      background: url('../../assets/images/orbit/help.png');
      background-size: cover;
    }
  }
  .playByPoi {
    height: 56px;
    width: 377px;
    margin-left: 76px;
    padding: 6px 16px;
    display: flex;
    background: url('../../assets/images/orbit/orbitBg.png');
    background-size: cover;
  }
}
</style>
