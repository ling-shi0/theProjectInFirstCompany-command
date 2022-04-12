<template>
  <div class="dmap-map step-content">
    <map-deploy @mapLoaded="mapLoaded"></map-deploy>
  </div>
</template>

<script>
import MapDeploy from '@/components/map/map-deploy.vue';
export default {
  components: {
    MapDeploy
  },
  props: {
    beginDraw: {
      type: Boolean,
      default: false
    },
    drawWktPolygon: {
      type: [Object, Array],
      default: () => {}
    }
  },
  data() {
    /** @type {MapUtil} */
    this.mapUtil = null;
    this.map = null;
    return {
      areaDrawWkts: [], // 辖区管理部分wkts数组
      drawWktPolygonLayerName: 'drawWktPolygonLayer'
    };
  },
  methods: {
    /**
     *@public
     */
    mapLoaded(map, mapUtil, clusterLevel) {
      this.map = map;
      this.mapUtil = mapUtil;
    },
    drawArea() {
      const overlay = this.map.getLayersByName(this.drawWktPolygonLayerName)[0];
      if (overlay) {
        overlay.removeAllFeatures();
      }
      this.mapUtil.drawSpatialVector({
        type: 'polygon',
        drawCallBack: data => {
          this.areaDrawWkts.push(data);
          this.$emit('drawFinish', this.areaDrawWkts);
        },
        deleteButCallBack: data => {
          let deleteIndex = 0;
          this.areaDrawWkts.forEach((item, index) => {
            item.id === data._id && (deleteIndex = index);
          });
          this.areaDrawWkts.splice(deleteIndex, 1);
          this.$emit('deleteWkts', this.areaDrawWkts);
        }
      });
    }
  },
  watch: {
    beginDraw(data) {
      data && this.drawArea();
    },
    drawWktPolygon(data) {
      const overlay = this.map.getLayersByName(this.drawWktPolygonLayerName)[0];
      let drawLayer = this.map.getLayersByName('绘制图层')[0];
      let deleteButLayer = this.map.getLayersByName('close-layer')[0];
      if (overlay) {
        overlay.removeAllFeatures();
        drawLayer && drawLayer.removeAllFeatures();
        deleteButLayer && deleteButLayer.removeAllOverlays();
      }
      data &&
        data.wkts &&
        this.mapUtil.drawWktPolygon(
          this.drawWktPolygonLayerName,
          data.wkts,
          '',
          data.name
        );
    }
  },
  mounted() {
    this.bus.$on('clearAreaWktArr', () => {
      this.areaDrawWkts.length = 0;
    });
  }
};
</script>
<style lang="less">
.dmap-map {
  // position: absolute;
  // left: 0;
  // right: 0;
  // bottom: 0;
  // top: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  transition: opacity 0.3s ease;
  //   .absolute0;
  &.show {
    opacity: 1;
  }
}
.lidaicon-h-close-circle {
  width: 18px;
  height: 18px;
  font-size: 14px;
  display: block;
  background: #ffffff;
  border: 2px solid #0079ff;
  border-radius: 1px;
  font-style: normal;
  text-align: center;
  line-height: 14px;
  cursor: pointer;
}
// #newCanvas {
//   cursor: url(~@/assets/images/map/pen.png), auto;
// }
</style>
