<template>
  <div class="dmap-map step-content">
    <map-deploy @mapLoaded="mapLoaded"></map-deploy>
  </div>
</template>

<script>
import MapDeploy from '@/components/map/map-deploy.vue';
import { debounce } from '@/components/common/util';
import PopWindowItem from '@/components/alarm-command/mapPopWindow/PopWindowItem';
import AlarmPersonPopItem from '@/components/alarm-command/mapPopWindow/AlarmPersonPopItem';
import { getDragPosition, resourceTypeQuery } from '@/api/alarmCommand';
import { mapMutations } from 'vuex';
// import MapMarkerPointLabel from '@/modules/map-marker-point-label';
// import { queryGeoResource, queryGeoCluster } from '@/io/map-res';
import { mapOfDataAndLabel } from '@/components/alarm-command/alarmListConstant';
export default {
  components: {
    MapDeploy
  },
  props: {
    resourceTypeData: {
      type: [Array, Object],
      default: () => {}
    },
    alarmListItemData: {
      type: Object,
      default: () => {}
    },
    alarmPositionData: {
      type: Object,
      default: () => {}
    },
    alarmPersonPopData: {
      type: Object,
      default: () => {}
    },
    dealPeopleDetailData: {
      type: Object,
      default: () => {}
    },
    advisePersonData: {
      type: Object,
      default: () => {}
    },
    beginDraw: {
      type: Boolean,
      default: false
    }
  },
  data() {
    /** @type {MapUtil} */
    this.mapUtil = null;
    this.map = null;
    return {
      clusterLevel: '',
      alarmPositionName: 'alarmPositionNameLayer',
      dealAndPolicePopName: '',
      geosolutionLayer: null,
      areaDrawWkts: [], // 辖区管理部分wkts数组
      resourceTypeArr: [], // 资源上图数据
      resourceTypeLayerName: 'resourceTypeLayer'
    };
  },
  mounted() {
    this.bus.$on('mapSearchMes', data => {
      this.addAlarmPositionPop(data);
    });
    this.bus.$on('dragPosition', data => {
      if (!data.drag) {
        let pixel = new hmap.basetype.Pixel(data.offsetX, data.offsetY);
        let { _x, _y } = this.geosolutionLayer.getCoordinateFromPixel(pixel);
        this.addNewDragPlace(_x, _y);
      }
    });
  },
  created() {
    this.resizeHandler = debounce(() => {
      this.getMapPointData(this.resourceTypeData);
    }, 300);
  },
  methods: {
    ...mapMutations(['setMapObj']),

    /**
     *@public
     */
    mapLoaded(map, mapUtil, clusterLevel) {
      this.map = map;
      this.mapUtil = mapUtil;
      this.setMapObj(this.mapUtil);
      console.log('mapload', mapUtil);
      this.clusterLevel = clusterLevel;
      this.geosolutionLayer = new hmap.geosolution.GeosolutionLayer({});
      this.map.addLayer(this.geosolutionLayer);
      this.$emit('initComponent');
      // this.registerMouseOver();
      // 地图聚合
      this.map.event.addListener(
        EventType.MAPEVENT_EXTENTCHANGED,
        this.resizeHandler
      );
    },
    // 根据页面level 重组数据
    // getMapPointData() {
    //   const zoom = this.mapUtil.getMapZoom();
    //   if (zoom < this.clusterLevel) {
    //     this.allMapNormalPoint = [];
    //     this.isNameShow = false;
    //   } else {
    //     const wkt = this.mapUtil.getWKT();
    //     this.mapClusterPoint = [];
    //     this.isNameShow = true;
    //   }
    // },
    // handleMapClear() {
    //   this.mapUtil.clearDrawVector();
    // },
    // startDraw: function (params) {
    //   this.mapUtil.drawSpatialVector(params);
    // },
    // registerMouseOver() {
    //   let flagFeature;
    //   const vm = this;
    //   this.map.event.register(EventType.MAPMOUSEEVENT_MOUSEMOVE, event => {
    //     const layers = vm.map.getAllLayers(0);
    //     const mapPixel = event.mapPixel;
    //     const results = vm.map.detectFeaturesAtPixel(mapPixel, null, 20);
    //     if (results[0] != null) {
    //       const geom = results[0];
    //       if (geom && geom instanceof hmap.feature.Vector) {
    //         const feature = geom;
    //         if (flagFeature) {
    //           if (flagFeature === feature) {
    //             return;
    //           } else {
    //             flagFeature = null;
    //           }
    //         } else {
    //           vm.addPointName(feature);
    //           flagFeature = feature;
    //         }
    //       }
    //     } else {
    //       if (flagFeature) {
    //         flagFeature = null;
    //       }
    //     }
    //   });
    // },
    // addPointName(feature) {
    //   const propsData = {
    //     name: feature._attributes.name,
    //     isBtn: feature._attributes.pointType == 'iot'
    //   };
    //   const param = {
    //     feature: feature,
    //     name: 'pointName'
    //   };
    //   this.mapUtil.addVueMarker(MapMarkerPointLabel, propsData, param);
    // },
    // addAllPointName() {
    //   this.mapNormalPoint.forEach(item => {
    //     const feature = this.mapUtil.createFeature(item);
    //     const propsData = {
    //       name: feature._attributes.name,
    //       isBtn: feature._attributes.pointType == 'iot'
    //     };
    //     const param = {
    //       feature: feature,
    //       name: 'allPointName',
    //       times: true
    //     };
    //     this.mapUtil.addVueMarker(MapMarkerPointLabel, propsData, param);
    //   });
    // },
    // selectDataChange(list) {
    //   let selectList = list.filter(item => item.checked);
    //   this.mapSelList = selectList;
    //   this.selectedMapPoint = selectList;
    // },
    // filterSelfAddFromSource: function (selfAddList) {
    //   // 自定义添加的点位 需要在原始列表中做过滤 然后再加入
    //   const { sourceList } = this;
    //   selfAddList = selfAddList.filter(item => {
    //     return sourceList.findIndex(({ id }) => item.id === id) === -1;
    //   });
    //   this.sourceList = sourceList.concat(selfAddList);
    // },
    // getSpatailQueryData: async function (obj) {
    //   let bbox = this.mapUtil.getBbox();
    //   let params = {
    //     bbox,
    //     cluster: false,
    //     geom: obj.wkt,
    //     height: 0,
    //     resourceType: '',
    //     treeCode: '',
    //     userId: '',
    //     width: 0
    //   };
    //   let spatailQueryData = await queryGeoResource(params);
    //   spatailQueryData.forEach(item => {
    //     item.checked = true;
    //   });
    //   this.filterSelfAddFromSource(spatailQueryData);
    // },
    // getClusterData: async function () {
    //   let bbox = this.mapUtil.getBbox();
    //   let geom = this.mapUtil.getWKT();
    //   let params = {
    //     bbox,
    //     cluster: true,
    //     geom,
    //     height: 0,
    //     resourceType: '',
    //     treeCode: '',
    //     userId: '',
    //     width: 0
    //   };
    //   let data = await queryGeoCluster(params);
    //   this.mapClusterPoint = data;
    // },
    // getListData: async function (wkt) {
    //   let bbox = this.mapUtil.getBbox();
    //   let params = {
    //     bbox,
    //     cluster: false,
    //     geom: wkt,
    //     height: 0,
    //     resourceType: '',
    //     treeCode: '',
    //     userId: '',
    //     width: 0
    //   };
    //   let data = await queryGeoResource(params);
    //   this.allMapNormalPoint = data;
    //   // this.allMapNormalPoint = [
    //   //     {
    //   //         id: '12343262362111',
    //   //         placeType: '102103',
    //   //         name: '江南小区',
    //   //         longitude: '120.2155780800',
    //   //         latitude: '30.2027442000',
    //   //     },
    //   //     {
    //   //         id: '1234113',
    //   //         placeType: '100302',
    //   //         name: '江陵路地铁站',
    //   //         longitude: '120.2166295100',
    //   //         latitude: '30.2088823400',
    //   //     },
    //   //     {
    //   //         id: '1234114',
    //   //         placeType: '100201',
    //   //         name: '江南大道江陵路口公交站',
    //   //         longitude: '120.2180725300',
    //   //         latitude: '30.2103797300',
    //   //     },
    //   // ]
    // },
    // addWktList(data) {
    //   const dataArr = data.filter(item => !item.children);
    //   dataArr.forEach(item => {
    //     item.checked = true;
    //   });
    //   this.areaList = dataArr;
    //   console.log(data);
    // },
    // showDialog(type) {
    //   this.type = type;
    //   this.dialogPoint = true;
    // },
    // handleMapQuery: function () {
    //   this.mainToolList[0].active = !this.mainToolList[0].active;
    //   if (this.mainToolList[0].active) {
    //     this.mainToolList[1].active = !this.mainToolList[0].active;
    //   }
    // },
    // handleMapLayers: function () {
    //   this.mainToolList[1].active = !this.mainToolList[1].active;
    //   if (this.mainToolList[1].active) {
    //     this.mainToolList[0].active = !this.mainToolList[1].active;
    //   }
    // }
    // 聚合部分 根据页面level 重组数据
    getMapPointData(val) {
      const zoom = this.mapUtil.getMapZoom();
      let bbox = this.mapUtil.getBbox();
      let geom = this.mapUtil.getWKT();
      let center = this.map.getCenter();
      const params = {
        wkt: geom,
        bbox,
        labelTypes: val,
        point: {
          longitude: center._x,
          latitude: center._y
        },
        width: 1280,
        height: 834
      };
      if (zoom <= this.clusterLevel) {
        this.getClusterData(params);
      } else {
        this.getListData(params);
      }
    },
    // 获取聚合数据
    getClusterData: async function (params) {
      params['isCluster'] = true;
      const { data } = await resourceTypeQuery(params);
      this.clearResourceTypeData(this.resourceTypeLayerName);
      this.addResourceTypePoint(data, true);
    },
    // 获取资源数据
    getListData: async function (params) {
      params['isCluster'] = false;
      const { data } = await resourceTypeQuery(params);
      this.clearResourceTypeData(this.resourceTypeLayerName);
      this.addResourceTypePoint(data, false);
    },
    addAlarmPersonPop(locationItem, name) {
      let feature = this.mapUtil.createFeature(locationItem);
      let param = {
        feature,
        name,
        times: true
      };
      this.mapUtil.addVueMarker(
        AlarmPersonPopItem,
        { propsData: Object.assign(locationItem, { visible: true }) },
        param
      );
      feature = null;
      param = null;
    },
    addResourceTypePoint(data, isCluster) {
      for (const i in data) {
        data[i].forEach(item => {
          let type = '';
          if (isCluster) {
            if (i === 'CAMERA') type = 'jhspdw';
            else if (i === 'AR') type = 'jhargd';
            else type = mapOfDataAndLabel[i];
          } else {
            type = mapOfDataAndLabel[i];
          }
          let propsData = {
            type,
            markerData: item
          };
          this.addPopWindow(item, propsData, this.resourceTypeLayerName);
          propsData = null;
        });
      }
    },
    addPopWindow(locationItem, propsData, name) {
      let feature = this.mapUtil.createFeature(locationItem);
      let param = {
        feature,
        name,
        times: true
      };
      this.mapUtil.addVueMarker(PopWindowItem, { propsData }, param);
      feature = null;
      param = null;
    },
    clearResourceTypeData(name) {
      this.mapUtil.removeInfoTemplate(name);
    },
    addAlarmPositionPop(data) {
      this.mapUtil.setMapCenter(data.itemMes || data);
      this.addPopWindow(
        data.itemMes || data,
        {
          showComponent: true,
          isAdvise: true,
          ...(data.itemMes || data),
          type: data.type
        },
        this.alarmPositionName
      );
    },
    addDealPeopleDetailPop(data) {
      this.mapUtil.setMapCenter(data.mes);
      let name = new Date().getTime();
      this.dealAndPolicePopName = name;
      this.addPopWindow(
        data.mes,
        {
          type: data.type,
          showComponent: true,
          isAdvise: false,
          ...data.mes
        },
        name
      );
      name = null;
    },
    addAdvisePeoplePop(data) {
      this.mapUtil.setMapCenter(data.mes);
      let name = new Date().getTime();
      this.addPopWindow(
        data.mes,
        {
          type: data.type,
          showComponent: true,
          isAdvise: true
        },
        name
      );
      name = null;
    },
    drawArea() {
      this.mapUtil.drawSpatialVector({
        type: 'polygon',
        drawCallBack: data => {
          this.areaDrawWkts.push(data);
          this.$emit('drawFinish');
        },
        deleteButCallBack: data => {
          let deleteIndex = 0;
          this.areaDrawWkts.forEach((item, index) => {
            item.id === data._id && (deleteIndex = index);
          });
          this.areaDrawWkts.splice(deleteIndex, 1);
        }
      });
    },
    addNewDragPlace(x, y) {
      this.alarmPositionName &&
        this.mapUtil.removeInfoTemplate(this.alarmPositionName);
      let name = new Date().getTime();
      this.alarmPositionName = name;
      getDragPosition({
        point: {
          latitude: y,
          longitude: x
        },
        pageNo: 1,
        pageSize: 1
      }).then(({ data }) => {
        this.addPopWindow(
          {
            latitude: data.list[0].latitude,
            longitude: data.list[0].longitude
          },
          {
            showComponent: true,
            isAdvise: true,
            ...data.list[0],
            type: 'artificialPosition'
          },
          name
        );
        name = null;
      });
    }
  },
  watch: {
    resourceTypeData(val) {
      this.getMapPointData(val);
    },
    alarmListItemData(item) {
      this.mapUtil.setMapCenter(item);
    },
    alarmPositionData(data) {
      this.alarmPositionName &&
        this.mapUtil.removeInfoTemplate(this.alarmPositionName);
      this.addAlarmPositionPop(data);
    },
    alarmPersonPopData: {
      handler(data, oldName) {
        this.mapUtil.setMapCenter(data);
        this.addAlarmPersonPop(data, 'alarmPersonPopWindow');
      },
      deep: true
    },
    dealPeopleDetailData(data) {
      this.mapUtil.removeInfoTemplate(this.dealAndPolicePopName);
      this.addDealPeopleDetailPop(data);
    },
    advisePersonData(data) {
      this.addAdvisePeoplePop(data);
    },
    beginDraw(data) {
      this.drawArea();
    }
  }
};
</script>
<style lang="less" scoped>
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
