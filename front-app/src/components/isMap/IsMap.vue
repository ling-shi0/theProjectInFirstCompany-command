<template>
  <is-base-map
    :tileLayerConfig="tileLayerConfig"
    @mapLoaded="mapLoaded"
  ></is-base-map>
</template>

<script>
import Vue from 'vue';
import IsBaseMap from './IsBaseMap.vue';
import PointDom from './common/pointDom.vue';
export default {
  name: 'IsMap',
  data() {
    return {
      map: null,
      mapUtil: null
    };
  },
  props: {
    tileLayerConfig: {
      type: Object,
      required: true
    },
    pointType: {
      type: Array,
      required: false
    },
    pointList: {
      type: Array,
      required: false
    }
  },
  computed: {
    newPointList() {
      if (this.pointList && this.pointType) {
        return this.pointList.map(item => {
          const type = this.pointType.filter(
            obj => obj.resType === item.resType
          )[0];
          return { ...type, ...item };
        });
      } else {
        return this.pointList;
      }
    }
  },
  components: {
    IsBaseMap
  },
  watch: {
    // mapSelList() {
    //   this.mapUtil.clearAllOverlay('deploy-selected-point');
    //   this.addPoint(this.mapSelList, 'deploy-selected-point', true);
    // },
    newPointList(val) {
      if (this.mapUtil) {
        this.mapUtil.clearAllOverlay('point-layer');
        this.addPoint(this.newPointList, 'point-layer');
      }
    }
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
  methods: {
    mapLoaded(map, mapUtil) {
      this.map = mapUtil.getMap();
      this.mapUtil = mapUtil;
      this.$emit('mapLoaded', this.map, mapUtil);
      console.log(mapUtil);
      this.addPoint(this.newPointList, 'point-layer');
      debugger;
      if (this.tileLayerConfig.maxLevel) {
        this.map.setMaxZoom(Number(this.tileLayerConfig.maxLevel));
      }
      if (this.tileLayerConfig.minLevel) {
        this.map.setMinZoom(Number(this.tileLayerConfig.minLevel));
      }
    },
    click() {},
    addPoint(list, name) {
      if (!list) {
        return;
      }
      const overlay = this.mapUtil.getOverlays('popLable');
      const overlay1 = this.mapUtil.getOverlays('popWindow');
      if (overlay && overlay.length > 0) {
        const arr = list.filter(item => item.id === overlay[0]._domId);
        if (arr.length < 1) {
          this.mapUtil.clearAllOverlay('popLable');
        }
      }
      if (overlay1 && overlay1.length > 0) {
        const arr = list.filter(item => item.id === overlay1[0]._domId);
        if (arr.length < 1) {
          this.mapUtil.clearAllOverlay('popWindow');
        }
      }
      list.forEach(item => {
        const feature = this.mapUtil.createFeature(item);
        const propsData = {
          propsData: item,
          map: this.map,
          mapUtil: this.mapUtil,
          size: item.size || 32
        };
        const param = {
          feature,
          name: name,
          times: true
        };
        if (item.displayType === 'image') {
          this.mapUtil.addVueMarker(PointDom, propsData, param);
        } else if (item.displayType === 'html') {
          this.mapUtil.addVueMarker(item.pointComponents, propsData, param);
        }
      });
    }
  }
};
</script>

<style lang="scss"></style>
