<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-05-08 14:04:13
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-09-06 13:38:46
-->
<template>
  <div class="dmap-map step-content">
    <IsMap :tileLayerConfig="tileLayerConfig" @mapLoaded="mapLoaded"></IsMap>
    <div class="tool">
      <van-icon name="plus" class="icon" @click="zoomIn" />
      <van-icon name="minus" class="icon" @click="zoomOut" />
    </div>
  </div>
</template>

<script>
// import MapDeploy from "./map-deploy.vue";
import http from "@/src/axios/dispose";
import FixedPopWindowItem from "./fixedPopWindowItem.vue";
import alarmPosition from "@/src/assets/images/alarmPosition.png";
import policePic from "@/src/assets/images/dbNormal.png";
export default {
  // components: {
  //   MapDeploy,
  // },
  props: {
    locationData: Object,
  },
  data() {
    /** @type {MapUtil} */
    this.mapUtil = null;
    this.map = null;
    return {
      positionLayer: "positionLayer",
      policeLayer: "policeLayer",
      gaodeMapSwitch: false,
      tileLayerConfig: {},
      clusterLevel: 0,
    };
  },
  created() {
    this.getMapConfig();
  },
  // watch: {
  //   locationData(val) {
  //     setTimeout(() => {
  //       console.log(this);
  //       this.clearResourceTypeData(this.positionLayer);
  //       this.addFixedPopWindow(val, { pic: alarmPosition }, this.positionLayer);
  //     }, 200);
  //   },
  // },
  methods: {
    /**
     *  @public
     */
    mapLoaded(map, mapUtil, clusterLevel) {
      this.map = map;
      this.mapUtil = mapUtil;
      this.clusterLevel = clusterLevel;
      this.clearResourceTypeData(this.positionLayer);
      if (this.locationData.longitude && this.locationData.latitude) {
        this.mapUtil.setMapCenter(this.locationData);
        this.addFixedPopWindow(
          this.locationData,
          { pic: alarmPosition },
          this.positionLayer
        );
      }
      this.initUploadPosition();
      // this.map.event.addListener(
      //   EventType.MAPEVENT_EXTENTCHANGED,
      //   this.resizeHandler
      // );
    },
    async getMapConfig() {
      const res = await http.getInitConfig();
      // res.data.gaodeMapSwitch = true;
      this.gaodeMapSwitch = res.data.type;
      if (res.data.type !== "hmap") {
        const { data } = await http.getGaodeMapServer();
        this.tileLayerConfig = data;
        this.tileLayerConfig.type = "gaode";
        this.tileLayerConfig.styleUrl = data.hmapStyleUrl;
        this.tileLayerConfig.vtUrl = data.gaodeMapUrl;
        this.clusterLevel = data.clusterLevel;
      } else {
        const { data } = await http.getHmapServerAddress();
        this.tileLayerConfig = data;
        this.tileLayerConfig.type = "";
        this.tileLayerConfig.styleUrl = data.hmapStyleUrl;
        this.tileLayerConfig.vtUrl = data.hmapHvtUrl;
        this.clusterLevel = data.clusterLevel;
      }
    },
    /**
     * @description: 把地图某一层的图标全删了的函数
     * @param {*} name
     * @return {*}
     * @author: wangXiaoMing
     */
    clearResourceTypeData(name) {
      this.mapUtil.clearAll("regionLayer");
      this.mapUtil.removeInfoTemplate(name);
    },
    /**
     * @description: 对于图片默认的资源 例如地点图标等的打点函数 这里走的是 FixedPopWindowItem组件
     * @param {*} popItemData 资源数据，其实和下一个字段一样
     * @param {*} params
     * @param {*} name 图层名称
     * @return {*}
     * @author: wangXiaoMing
     */
    addFixedPopWindow(popItemData, params, name) {
      let feature = this.mapUtil.createFeature(popItemData);
      let param = {
        feature,
        name,
        times: true,
      };
      this.mapUtil.addVueMarker(
        FixedPopWindowItem,
        { propsData: { ...params } },
        param
      );
      feature = null;
      param = null;
    },
    initUploadPosition() {
      this.bus.$on("uploadPosition", (val) => {
        this.clearResourceTypeData(this.policeLayer);
        this.addFixedPopWindow(val, { pic: policePic }, this.policeLayer);
      });
    },
    zoomIn() {
      if (this.map.getZoom() <= 20) {
        this.map.zoomIn();
      }
    },
    zoomOut() {
      if (this.map.getZoom() > 9) {
        this.map.zoomOut();
      }
    },
  },
};
</script>
<style lang="scss">
.dmap-map {
  // position: absolute;
  left: 430px;
  right: 0;
  bottom: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  transition: opacity 0.3s ease;
  //   .absolute0;
  &.show {
    opacity: 1;
  }
  .tool {
    position: absolute;
    right: 0.67rem;
    top: 0.67rem;
    .icon {
      width: 2rem;
      height: 2rem;
      background: white;
      z-index: 1000;
      font-size: 1.25rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 6px;
      &:active {
        background: rgba(199, 199, 199, 0.5);
      }
    }
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
.map-buts {
  position: absolute;
  z-index: 10;
}
</style>
