<template>
  <div :id="id" class="map-container"></div>
</template>
基础地图 默认为蓝白样式
<script>
import MapUtil from './common/mapUtil';
// import { getHmapServerAddress } from '@/api/index';

let count = 0;
// import MapConfigPoint from '@/modules/map-point.vue';
export default {
  name: 'IsBaseMap',
  data() {
    const id = `select-res-map-${count++}`;
    /** @type {MapUtil} */
    this.mapUtil = null;
    this.map = null;
    return {
      id
    };
  },
  props: {
    tileLayerConfig: {
      type: Object || null,
      required: true
    }
  },
  watch: {
    tileLayerConfig(newVal, oldval) {
      this.getMapConfig();
    }
    // mapSelList() {
    //   this.mapUtil.clearAllOverlay('deploy-selected-point');
    //   this.addPoint(this.mapSelList, 'deploy-selected-point', true);
    // },
    // mapNorList(val) {
    //   this.mapUtil.clearAllOverlay('deploy-normal-point');
    //   this.addPoint(this.mapNorList, 'deploy-normal-point', false);
    // },
    // mapClusterList(val) {
    //   this.mapUtil.clearAllOverlay('deploy-cluster-point');
    //   this.addPoint(this.mapClusterList, 'deploy-cluster-point', false);
    // },
    // wktList(val) {
    //   // this.mapUtil.clearAllOverlay('deploy-cluster-point')
    //   this.mapUtil.clearAll('selectedArea');
    //   this.mapUtil.addPolygonLayer('selectedArea', this.wktList);
    // }
  },
  mounted() {
    this.getMapConfig();
  },
  methods: {
    // 获取地图配置参数
    getMapConfig() {
      if (this.tileLayerConfig && this.tileLayerConfig.vtUrl) {
        this.mapUtil = new MapUtil(
          this.id,
          this.tileLayerConfig,
          this.mapLoaded
        );
        if (this.tileLayerConfig.type === 'gaode') {
          this.mapUtil.initGaodeMap();
        } else {
          this.mapUtil.initHvtMap();
        }
        this.map = this.mapUtil.getMap();
      }

      // this.map.setMinZoom(7);
    },
    mapLoaded() {
      this.$emit('mapLoaded', this.map, this.mapUtil);
    }
  }
};
</script>
<style lang="scss" scoped>
.map-container {
  height: 100%;
  width: 100%;
}
</style>
