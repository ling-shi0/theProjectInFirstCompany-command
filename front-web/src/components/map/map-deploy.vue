<!--
 * @Description:
 * @Version: 2.0
 * @Autor: caokeke
 * @Date: 2021-02-21 13:55:18
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2022-03-31 11:02:07
-->
<template>
  <div :id="id" class="map-container"></div>
</template>
基础地图 默认为蓝白样式
<script>
import MapUtil from '@/components/map/map-util';
import { getHmapServerAddress } from '@/api/index';

let count = 0;
// import MapConfigPoint from '@/modules/map-point.vue';
export default {
  name: 'mapDeploy',
  data() {
    const id = `select-res-map-${count++}`;
    /** @type {MapUtil} */
    this.mapUtil = null;
    this.map = null;
    return {
      id,
      tileLayerConfig: {}
    };
  },
  watch: {
    mapSelList() {
      this.mapUtil.clearAllOverlay('deploy-selected-point');
      this.addPoint(this.mapSelList, 'deploy-selected-point', true);
    },
    mapNorList(val) {
      this.mapUtil.clearAllOverlay('deploy-normal-point');
      this.addPoint(this.mapNorList, 'deploy-normal-point', false);
    },
    mapClusterList(val) {
      this.mapUtil.clearAllOverlay('deploy-cluster-point');
      this.addPoint(this.mapClusterList, 'deploy-cluster-point', false);
    },
    wktList(val) {
      // this.mapUtil.clearAllOverlay('deploy-cluster-point')
      this.mapUtil.clearAll('selectedArea');
      this.mapUtil.addPolygonLayer('selectedArea', this.wktList);
    }
  },
  mounted() {
    this.getMapConfig();
  },
  methods: {
    // 获取地图配置参数
    async getMapConfig() {
      const { data } = await getHmapServerAddress();
      // const  data  = {
      //  initLonLat: "116.294263_37.456893",
      //   initLevel: "17",
      //   hmapHvtUrl: "http://10.33.43.58:1709/hmap-server/hvt/",
      //   clusterLevel: "18",
      //   hmapStyleUrl: "http://10.33.43.58:1709/hmap-server/hvtStyles/dezhou-white/MapStyle.json"};
      this.tileLayerConfig = {
        styleUrl: data.hmapStyleUrl.blue
          ? data.hmapStyleUrl.blue
          : data.hmapStyleUrl,
        gridSize: data.gridSize,
        hvtUrl: data.hmapHvtUrl,
        initLevel: data.initLevel,
        clusterLevel: data.clusterLevel,
        initLonLat: data.initLonLat
      };
      this.mapUtil = new MapUtil(this.id, this.tileLayerConfig, this.mapLoaded);
      this.mapUtil.initMap();
      this.map = this.mapUtil.getMap();
      this.map.setMinZoom(7);
    },
    mapLoaded() {
      this.$emit(
        'mapLoaded',
        this.map,
        this.mapUtil,
        this.tileLayerConfig.clusterLevel
      );
    }
  }
};
</script>
<style lang="less">
.map-container {
  height: 100%;
  width: 100%;
}
</style>
