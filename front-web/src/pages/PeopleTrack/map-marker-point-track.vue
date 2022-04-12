<template>
  <div class="orbitPoint">
    <div class="orbitIcon" @click="numberClick(numbers[0], 0)">
      <div :class="isAlarm ? 'orbitCenter1' : 'orbitCenter'"></div>
      <div class="orbitPointImg" :class="img" />
      <!-- <img
                class="orbitPointImg"
                src="../../assets/image/mapAlarmCenter/camera.png"
            /> -->
      <div class="orbitBottom"></div>
    </div>
    <div v-show="!isAlarm" style="display: flex">
      <div
        v-show="numbers.length < 4"
        v-for="(item, index) in numbers"
        :key="index"
      >
        <div
          :class="item.num == selectedNum ? 'select' : ''"
          class="orbitNum"
          @click="numberClick(item, index)"
        >
          {{ item.num }}
        </div>
      </div>
      <div>
        <div v-show="numbers.length >= 4" style="display: flex">
          <div
            class="orbitNum"
            :class="numbers[0].num == selectedNum ? 'select' : ''"
            @click="numberClick(numbers[0], 0)"
          >
            {{ numbers[0].num }}
          </div>
          <div
            :class="moreShow ? 'orbitMoreClick' : 'orbitNum'"
            @click="moreClick"
          >
            ...
          </div>
          <div
            class="orbitNum"
            :class="
              numbers[numbers.length - 1].num == selectedNum ? 'select' : ''
            "
            @click="
              numberClick(numbers[numbers.length - 1], numbers.length - 1)
            "
          >
            {{ numbers[numbers.length - 1].num }}
          </div>
        </div>
        <div class="orderPanel" v-show="moreShow">
          <div
            v-for="(item, index) in numbers.slice(1, numbers.length - 1)"
            :key="index"
          >
            <div
              class="orbitNum"
              :class="item.num == selectedNum ? 'select' : ''"
              @click="numberClick(item, index)"
            >
              {{ item.num }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'MapMarkerPointTrack',
  data() {
    return {
      moreShow: false,
      selectedNum: ''
    };
  },
  props: {
    numbers: {
      type: Array,
      default: () => [],
      required: true
    },
    alarmType: {
      type: String
    },
    isAlarm: {
      type: Boolean
    }
  },
  computed: {
    img() {
      if (this.alarmType === 'face' || this.alarmType === 'personId') {
        return 'imgUrl1';
      } else if (this.alarmType === 'vehicle') {
        return 'imgUrl2';
      } else if (this.alarmType === 'mac') {
        return 'imgUrl3';
      } else if (this.alarmType === 'imsi') {
        return 'imgUrl4';
      } else {
        return 'imgUrl5';
      }
    }
  },
  beforeDestroy() {
    this.bus.$off('orbitInfoShow');
    this.bus.$off('orbitInfoClose');
  },
  mounted() {
    this.img;
    // var o = document.getElementsByClassName("orbitCenter1");

    // o.addEventListener("webkitAnimationEnd", function() {
    //    // this.className = "";
    //     alert("动画结束");
    // })
    this.bus.$on('orbitInfoShow', data => {
      this.selectedNum = data;
    });
    this.bus.$on('orbitInfoClose', data => {
      this.selectedNum = '';
    });
  },
  methods: {
    numberClick(item, index) {
      this.bus.$emit('orbitOrderClick', item.num);
    },
    moreClick() {
      this.moreShow = !this.moreShow;
    }
  }
};
</script>
<style lang="scss" scoped>
@mixin scrollbar-style() {
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
    background: transparent;
    border-radius: 1px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 100px;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
    background: rgba(32, 128, 247, 0.2);
  }
  &::-webkit-scrollbar-button {
    display: none;
  }
  &::-webkit-scrollbar-corner {
    background: transparent;
  }
  &::-webkit-scrollbar-track-piece {
    background: transparent;
  }
}
@keyframes myae {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}
@keyframes myaeAlarm {
  0% {
    -webkit-transform: rotate(0deg) scale(1.2);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}
@keyframes myaeHover {
  0% {
    -webkit-transform: rotate(0deg) scale(1.2);
  }
  100% {
    -webkit-transform: rotate(360deg) scale(1.2);
  }
}
.select {
  background: url('../../assets/images/mapAlarmCenter/orbitOrderSelect.png') !important;
  background-size: cover !important;
}
.orbitPoint {
  color: #acd1ff;
  display: flex;
  transform: translate(-24px, -64px) !important;
  position: absolute;
  .orderPanel {
    height: 83.2px;
    overflow: auto;
    margin-top: -24px;
    margin-right: 25.6px;
    padding-left: 36.8px;
    @include scrollbar-style;
    .orbitNum {
      background: url('../../assets/images/mapAlarmCenter/orbitOrder.png');
      background-size: cover;
      height: 25.6px;
      width: 25.6px;
      margin: 11.2px 5.6px;
      text-align: center;
      line-height: 25.6px;
      font-size: 14px;
      cursor: pointer;
    }
    .orbitMoreClick {
      background: url('../../assets/images/mapAlarmCenter/orbitOrderSelect.png');
      background-size: cover;
      height: 25.6px;
      width: 25.6px;
      margin: 11.2px 5.6px;
      text-align: center;
      line-height: 25.6px;
      cursor: pointer;
    }
  }
  .orbitNum {
    background: url('../../assets/images/mapAlarmCenter/orbitOrder.png');
    background-size: cover;
    height: 25.6px;
    width: 25.6px;
    margin: 24px 5.6px;
    text-align: center;
    line-height: 25.6px;
    cursor: pointer;
    font-size: 14px;
  }
  .orbitMoreClick {
    background: url('../../assets/images/mapAlarmCenter/orbitOrderSelect.png');
    background-size: cover;
    height: 25.6px;
    width: 25.6px;
    margin: 24px 5.6px;
    text-align: center;
    line-height: 25.6px;
    cursor: pointer;
  }
  .orbitIcon {
    .orbitCenter {
      background: url('../../assets/images/mapAlarmCenter/bg02.png');
      background-size: cover;
      height: 46.4px;
      width: 46.4px;
      padding: 7.2px;
      margin-left: 1px;
      -webkit-animation: myae 3s infinite linear;
      &:hover {
        -webkit-animation: myaeHover 3s infinite linear;
      }
    }
    .orbitCenter1 {
      background: url('../../assets/images/mapAlarmCenter/bg03.png');
      background-size: cover;
      height: 46.4px;
      width: 46.4px;
      padding: 7.2px;
      // margin-left: 1px;
      -webkit-animation: myaeAlarm 3s 1 linear, myae 3s infinite 3s linear;
      &:hover {
        -webkit-animation: myaeHover 3s infinite linear;
      }
    }
    .orbitPointImg {
      position: fixed;
      height: 32px;
      width: 32px;
      object-fit: cover;
      top: 6.4px;
      left: 8px;
    }
    // .imgUrl1 {
    //   background: url('../../assets/images/layerMarker/face.png');
    //   background-size: cover;
    // }
    // .imgUrl2 {
    //   background: url('../../assets/images/layerMarker/cross.png');
    //   background-size: cover;
    // }
    // .imgUrl3 {
    //   background: url('../../assets/images/layerMarker/imsi.png');
    //   background-size: cover;
    // }
    // .imgUrl4 {
    //   background: url('../../assets/images/layerMarker/mac.png');
    //   background-size: cover;
    // }
    // .imgUrl5 {
    //   background: url('../../assets/images/layerMarker/camera.png');
    //   background-size: cover;
    // }
    .orbitBottom {
      background: url('../../assets/images/mapAlarmCenter/bg01.png');
      background-size: cover;
      height: 28.8px;
    }
  }
}
</style>
