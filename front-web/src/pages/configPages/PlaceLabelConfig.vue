<template>
  <div class="place-label-config">
    <!-- <div
      class="mouseImg"
      id="mouseImg"
      :class="{
        'police-box': legendIcon === '岗亭',
        ktv: legendIcon === 'KTV',
        'internet-bar': legendIcon === '网吧',
        'housing-estate': legendIcon === '小区',
        'key-areas': legendIcon === '重点区域'
      }"
    ></div> -->
    <img class="mouseImg" id="mouseImg" :src="legendPicUrl" />
    <LabelSearch @positionPoint="positionPoint"></LabelSearch>
    <MapRes @initComponent="fetch"></MapRes>
    <LabelLegend
      :labelMarkerData="labelMarkerData"
      @fetch="fetch"
    ></LabelLegend>
  </div>
</template>
<script>
import MapRes from '@/components/config/map-select-res.vue';
import LabelLegend from '@/components/config/labelLegend';
import LabelSearch from '@/components/config/labelSearch';
import { mapState } from 'vuex';
import { queryPlaceLabel } from '@/api/placeLabelConfig';
import { LEGEND_PIC } from '@/constants';
export default {
  name: 'PlaceLabelConfig',
  components: { MapRes, LabelLegend, LabelSearch },
  data() {
    return {
      labelMarkerData: [],
      legendMousePic: ''
    };
  },
  computed: {
    ...mapState(['legend', 'mapObj']),
    legendPicUrl() {
      if (this.legend && !this.legend.canDelete) {
        const picUrlArr = LEGEND_PIC.filter(item => {
          return item.labelName === this.legend.labelName;
        });

        return picUrlArr[0].picUrl;
      } else if (this.legend && this.legend.canDelete) {
        return this.legend.picUrl;
      } else {
        return null;
      }
    }
  },
  watch: {
    legend(val) {
      if (val) {
        if (val.labelName !== '重点区域') {
          document.addEventListener('mousemove', this.handleMousemoveImg);
        }
      } else {
        this.resetMousemoveImg();
        document.removeEventListener('mousemove', this.handleMousemoveImg);
      }
    }
  },
  mounted() {
    this.bus.$on('placeLabelUpdate', () => {
      const layer = this.mapObj.getLayer('default_marker_layer');
      layer.removeAllOverlays();

      const layers = this.mapObj.getMap().getAllLayers(1);
      for (let i = 0; i < layers.length; i++) {
        if (layers[i].name && layers[i].name === '绘制图层') {
          layers[i].removeAllFeatures();
        }
      }
      console.log('layers', layers);
      this.fetch();
    });
  },
  methods: {
    handleMousemoveImg() {
      var oDiv = document.getElementById('mouseImg');
      var scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      oDiv.style.display = 'block';
      // oDiv.style.left = event.clientX - 67 + 'px';
      oDiv.style.left = event.clientX + 'px';
      oDiv.style.top = event.clientY + scrollTop - 36 + 'px';
    },
    // 初始化鼠标跟随图标
    resetMousemoveImg() {
      var oDiv = document.getElementById('mouseImg');
      oDiv.style.display = 'none';
    },
    async fetch() {
      const { data } = await queryPlaceLabel({ placeLabelName: '' });
      this.labelMarkerData = data;
    },
    positionPoint(label) {
      this.labelMarkerData.forEach(item => {
        const { placeId } = item || {};
        const showup = placeId === label.placeId; // 此弹窗显示，其他均隐藏
        this.bus.$emit(`placeMarkerId${placeId}`, showup);
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.place-label-config {
  height: 100%;
  width: 100%;
  position: relative;
  .mouseImg {
    position: absolute;
    display: none;
    width: 36px;
    height: 36px;
    z-index: 999;
    object-fit: contain;
    &.police-box {
      background: url('../../assets/images/config/police-box.png') no-repeat
        center;
    }
    &.ktv {
      background: url('../../assets/images/config/ktv.png') no-repeat center;
    }
    &.internet-bar {
      background: url('../../assets/images/config/internet-bar.png') no-repeat
        center;
    }
    &.housing-estate {
      background: url('../../assets/images/config/housing-estate.png') no-repeat
        center;
    }
    &.key-areas {
      height: 46px;
      background: url('../../assets/images/config/areas.png') no-repeat top;
    }
  }
}
</style>
