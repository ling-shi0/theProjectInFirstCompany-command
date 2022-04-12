<template>
  <div class="dmap-map step-content">
    <map-blue mapStyle="blue" @mapLoaded="mapLoaded"></map-blue>
  </div>
</template>
预警中心地图
<script>
import Vue from 'vue';
import MapBlue from '@/components/map/map-deploy.vue';
import { debounce } from '@/components/common/util';
// import MapMarkerPointLabel from '@/modules/map-marker-point-label';
import MapPopupTrack from './map-popup-track';
import MapMarkerPointTrack from './map-marker-point-track';
export default {
  data() {
    /**@type {MapUtil} */
    this.mapUtil = null;
    this.map = null;
    return {
      mapClusterPoint: [],
      allMapNormalPoint: [],
      polygonData: {},
      //报警点测试
      alarmList: [],
      alarmDetail: this.data
    };
  },
  // props: {
  //     data: {
  //         type: Object,
  //     },
  // },
  mounted() {
    this.bus.$on('orbitClick', data => {
      // this.data = this.handleOrbitData(data);
      data.forEach((item, index) => {
        item.num = index + 1;
      });
      this.data = data;
      this.addTrace();
    });

    // eventBus.$on('videoPlayEvent', param => {
    //     this.videoPlay(param)
    // })

    // eventBus.$on('videoRePlayEvent', param => {
    //     this.videoRePlay(param)
    // })

    // eventBus.$on('showResourceClusEvent', param => {
    //     if (param.indexCodes != '') {
    //         this.showResourceClus(param);
    //     }
    // });

    // eventBus.$on('showResource', param => {
    //     let level = this.map.getZoom();
    //     if (level >= this.clusterLevel) {
    //         return;
    //     }
    //     this.map.setCenter(
    //         new hmap.basetype.Coordinate(
    //             param.latitude,
    //             param.longitude,
    //             0
    //         ),
    //         this.clusterLevel
    //     );
    //     this.renderResource();
    // });

    // eventBus.$on('showResourceEvent', param => {
    //     this.showResourceDetail(param);
    // });

    // eventBus.$on('mapDataChange', param => {
    //     debugger
    //     // this.showResourceDetail(param);
    // })
    this.bus.$on('statusChange', param => {
      if (!param) {
        if (this.carStatus == 'complete') {
          this.trace.restart();
        } else {
          this.trace.start();
        }
      } else {
        this.trace.pause();
      }
      // this.showResourceDetail(param);
    });
    this.bus.$on('speedChange', param => {
      this.trace.speed(param);
      // this.showResourceDetail(param);
    });
    this.bus.$on('orbitInfoClose', data => {
      this.removeInfoTemplate('orbitInfo');
      this.removeInfoTemplate('orbitSelectedPoint');
    });
    const vm = this;
    // this.bus.$on('statusChange', param => {
    //     if (!param) {
    //         if (vm.carStatus == 'complete') {
    //             vm.trace.restart();
    //         } else {
    //             vm.trace.start();
    //         }
    //     } else {
    //         vm.trace.pause();
    //     }
    //     // this.showResourceDetail(param);
    // });
    this.bus.$on('orbitOrderClick', data => {
      const selectData = vm.data.filter(item => item.num === data)[0];
      const feature = this.createFeature(selectData);
      vm.addOrbitInfo(feature);
    });
    this.bus.$on('orbitPanelItemClick', data => {
      const selectData = vm.data.filter(item => item.num === data.num)[0];
      const feature = this.createFeature(selectData);
      vm.addOrbitInfo(feature);
      if (selectData.longitude && selectData.latitude) {
        this.setMapCenter(selectData);
      } else {
        this.$message('该预警无位置信息');
      }
    });
    this.bus.$on('alarmItemClick', data => {
      const feature = this.createFeature(data);
      vm.addAlarmInfo(feature);
      if (data.longitude && data.latitude) {
        this.setMapCenter(data);
      } else {
        this.$message('该预警无位置信息');
      }
    });
    this.bus.$on('alarmItemAdd', data => {});
    this.bus.$on('orbitClose', param => {
      vm.trace.pause();
      const layer = vm.map.getLayersByName('orbitLine')[0];
      const orbitInfoLayer = vm.map.getLayersByName('orbitInfo')[0];
      const orbitPointLayer = vm.map.getLayersByName('orbitPoint')[0];
      const orbitSelectedPointLayer = vm.map.getLayersByName(
        'orbitSelectedPoint'
      )[0];
      //清除弹框
      if (orbitInfoLayer) {
        orbitInfoLayer.removeAllOverlays();
      }
      //清除轨迹点位
      if (orbitPointLayer) {
        orbitPointLayer.removeAllOverlays();
      }
      //清除选中的点位
      if (orbitSelectedPointLayer) {
        orbitSelectedPointLayer.removeAllOverlays();
      }
      layer.removeAllFeatures();
      vm.trace.destroy();
      layer.destroy();
      const allLayers = vm.map.getAllLayers(1);
      // allLayers = allLayers.filter(ele => ele.name != '矢量切片图层' && ele.name != 'orbitLine')
      allLayers.forEach(item => {
        item.setVisibility(true);
        if (item.name === 'selectedPoint') {
          item.enableHashCode = true;
        }
      });
      vm.map.zoomTo(18);
    });
  },
  components: {
    MapBlue
  },
  created() {
    let that = this;
    this.resizeHandler = debounce(() => {
      that.handleMapDataForZoomChanged();
    }, 300);
  },
  methods: {
    handleMapDataForZoomChanged() {
      // const zoom = this.mapUtil.getMapZoom()
      // if (zoom < this.clusterLevel) {
      //     this.mapUtil.clearAll('normalPoint')
      //     this.mapUtil.clearAllOverlay('pointName')
      //     this.getClusterData()
      // } else {
      //     this.mapUtil.clearAll('clusterLayer')
      //     const wkt = this.mapUtil.getWKT()
      //     this.getListData(wkt)
      // }
    },
    mapLoaded(map, mapUtil, clusterLevel) {
      this.bus.$emit('mapLoaded');
      this.map = map;
      this.mapUtil = mapUtil;
      this.clusterLevel = clusterLevel;
      this.registerMouseOver();
      this.map.event.addListener(
        EventType.MAPEVENT_EXTENTCHANGED,
        this.resizeHandler
      );
    },
    registerMouseOver() {
      let flagFeature;
      const vm = this;
      this.map.event.register(EventType.MAPMOUSEEVENT_MOUSEMOVE, event => {
        const layers = vm.map.getAllLayers(0);
        const mapPixel = event.mapPixel;
        const results = vm.map.detectFeaturesAtPixel(mapPixel, null, 20);
        if (results[0] != null) {
          const geom = results[0];
          if (geom && geom instanceof hmap.feature.Vector) {
            const feature = geom;
            if (flagFeature) {
              if (flagFeature === feature) {
                return;
              } else {
                flagFeature = null;
              }
            } else {
              vm.addPointName(feature);
              flagFeature = feature;
            }
          }
        } else {
          if (flagFeature) {
            flagFeature = null;
          }
        }
      });
    },
    addPointName(feature) {
      const propsData = {
        name: feature._attributes.placeName,
        isBtn: feature._attributes.pointType == 'iot'
      };
      const param = {
        feature: feature,
        name: 'pointName'
      };
      //   this.mapUtil.addVueMarker(MapMarkerPointLabel, propsData, param);
    },
    getAllPoint(flag) {
      if (flag) {
        this.handleMapDataForZoomChanged();
      } else {
        this.mapUtil.clearAll('clusterLayer');
        this.mapUtil.clearAll('normalPoint');
        this.mapUtil.clearAllOverlay('pointName');
      }
    },
    removeInfoTemplate(name) {
      const overlay = this.map.getLayersByName(name)[0];
      if (overlay) {
        overlay.removeAllOverlays();
      }
    },
    setCurTime() {
      this.curTime = moment().format('YYYY-MM-DD HH:mm:ss');
    },
    getCenter() {
      return new Promise((resolve, reject) => {
        let center = {
          lat: 30.288093353436018,
          lng: 120.05944526687728
        };
        let url = this.vtInfoUrl;
        let request = new XMLHttpRequest();
        request.open('GET', url);
        request.send(null);
        request.onload = () => {
          if (request.status === 200) {
            let vtinfo = JSON.parse(request.responseText);
            if (vtinfo != null && vtinfo.centerLon && vtinfo.centerLat) {
              center.lng = vtinfo.centerLon;
              center.lat = vtinfo.centerLat;
            }
            resolve(center);
          }
        };
      });
    },
    // callback(data) {
    //   if (this.data.length == data[1] + 1) {
    //     this.carStatus = 'complete';
    //     this.bus.$emit('complete');
    //   } else {
    //     this.status = '';
    //   }
    // },
    //设置中心点
    setMapCenter(item) {
      const coord = new hmap.basetype.Coordinate(
        Number(item.longitude),
        Number(item.latitude),
        0
      );
      this.map.setCenter(coord);
    },
    fontNumber(date) {
      const length = date.length;
      if (length > 10) {
        var str = '';
        str = date.substring(0, 9) + '...';
        return str;
      } else {
        return date;
      }
    },
    //处理轨迹数据
    handleOrbitData(data) {
      const orbitData = [];
      const vm = this;
      data.forEach(item => {
        item.result.forEach(obj => {
          obj.date = item.date;
          obj.order = obj.num;
          obj.placeCode = obj.placeCode;
          // const types = vm.placeType.concat(vm.iotType);
          // const type = types.filter(
          //     i => i.code == obj.multAlarmInfo.placeType
          // )[0];
          // if (type) {
          //     obj.orbitNormalImg = type.traceNormalUrl;
          //     obj.orbitAlarmImg = type.traceAlarmUrl;
          // }
          if (obj.latitude != 'null' && obj.longitude != 'null') {
            orbitData.push(obj);
          }
        });
      });
      return orbitData.reverse();
    },
    addSelectedOrbitPoint(feature) {
      const propsData = {
        numbers: [{ num: '' }],
        alarmType: feature._attributes.alarmType
          ? feature._attributes.alarmType
          : '',
        isAlarm: true
      };
      const param = {
        feature: feature,
        name: 'orbitSelectedPoint'
      };
      this.addVueMarker(MapMarkerPointTrack, propsData, param);
    },
    addOrbitInfo(feature) {
      // const showValue = this.fontNumber(feature._attributes.pointName);
      const propsData = {
        time: feature._attributes.reportTime
        // data: [
        //   {
        //     label: '预警时间',
        //     value: feature._attributes.date + ' ' + feature._attributes.time,
        //     showValue: feature._attributes.date + ' ' + feature._attributes.time
        //   },
        //   {
        //     label: '预警地点',
        //     value: feature._attributes.pointName,
        //     showValue: showValue
        //   }
        // ],
        // img: feature._attributes.picUrl ? feature._attributes.picUrl : '',
        // title: ''
        // title: feature._attributes.multAlarmInfo.labelName
        // tag: feature._attributes.personInfo[0].target.libTags
      };
      const param = {
        feature: feature,
        name: 'orbitInfo'
      };
      this.addVueMarker(MapPopupTrack, propsData, param);
      this.bus.$emit('orbitInfoShow', feature._attributes.num);
    },
    callback(data) {
      if (this.data.length == data[1] + 1) {
        this.carStatus = 'complete';
        this.bus.$emit('complete');
      } else {
        this.status = '';
      }
      const feature = this.createFeature(data[0]);
      // this.addSelectedOrbitPoint(feature);
      this.addOrbitInfo(feature);
    },
    addTrace() {
      const orbitInfoLayer = this.map.getLayersByName('orbitInfo')[0];
      const orbitPointLayer = this.map.getLayersByName('orbitPoint')[0];
      const orbitSelectedPointLayer = this.map.getLayersByName(
        'orbitSelectedPoint'
      )[0];
      //清除弹框
      if (orbitInfoLayer) {
        orbitInfoLayer.removeAllOverlays();
      }
      //清除轨迹点位
      if (orbitPointLayer) {
        orbitPointLayer.removeAllOverlays();
      }
      //清除选中的点位
      if (orbitSelectedPointLayer) {
        orbitSelectedPointLayer.removeAllOverlays();
      }
      const vm = this;
      if (this.trace != undefined) {
        this.trace.destory();
      }
      let layer = this.map.getLayersByName('orbitLine')[0];
      if (!layer) {
        layer = new hmap.layer.VectorLayer('orbitLine');
        this.map.addLayer(layer);
      } else {
        layer.removeAllFeatures();
      }
      // let callback=function(data){
      //     if(this.data.length=data[1]+1){
      //         this.carStatus="complete"
      //     }
      // }
      this.addDateAndStyle();
      this.trace = new hmap.Biz.BayonetTrace(this.map, layer, this.callback);
      this.trace.speed(1);
      // this.trace._style["CompleteLine"].strokeWidth = 1;
      // this.trace.setStartStyle(this.startStyle) //设置移动物体初始样式
      // this.trace.setendStyle(this.endStyle) //设置移动物体结束回放后的样式
      // this.trace.setmoveStyle(this.moveStyle) //先设置样式在设置路径
      //不重复的坐标点位为地图构建缓冲区做准备
      const noRepeatPointList = this.handleRepeatPoint(this.data);
      // console.log(JSON.stringify(noRepeatPointList))
      this.trace.setPath(this.data, noRepeatPointList); //设置路径
      if (noRepeatPointList.length < 2) {
        this.bus.$emit('playClose');
      }
      // noRepeatPointList.forEach(item => {
      //   const feature = vm.createFeature(item);
      //   vm.addOrbitPoint(feature);
      // });
      this.trace.stopTime(1); //设置停留时间 单位 秒
      this.trace.setPathShow(true); //设置是否显示调用路径
    },
    addVueMarker(component, propsData, mapParam) {
      const orbitTemplate = Vue.extend(component);
      const infoContent = new orbitTemplate({
        propsData: propsData
      });
      const ele = infoContent.$mount().$el;
      mapParam = Object.assign(
        {
          feature: null, //唯一值
          ele: ele, //如果不需要设置显示隐藏，使用默认值即可
          name: null,
          times: false, //是否多次
          offsetX: 0,
          offsetY: 0
        },
        mapParam
      );
      this.addInfoTemplate(mapParam);
    },
    addInfoTemplate(param) {
      param = Object.assign(
        {
          feature: null, //唯一值
          ele: null, //如果不需要设置显示隐藏，使用默认值即可
          name: null,
          times: false, //是否多次
          offsetX: 0,
          offsetY: 0
        },
        param
      );
      let overlay = this.map.getLayersByName(param.name)[0];
      if (!overlay) {
        overlay = new hmap.layer.OverlayLayer(param.name);
        this.map.addLayer(overlay);
      }
      if (!param.feature._attributes.longitude) {
        return;
      }
      const coord1 = new hmap.basetype.Coordinate(
        Number(param.feature._attributes.longitude),
        Number(param.feature._attributes.latitude),
        0
      );
      const simplePopup = new hmap.overlay.SimplePopup({
        domId: param.name + param.feature._attributes.placeCode,
        location: coord1,
        element: param.ele,
        offset: new hmap.basetype.Offset(param.offsetX, param.offsetY, 0)
      });
      //是否只存在一个弹框
      if (!param.times) {
        overlay.removeAllOverlays();
      }
      overlay.addOverlay(simplePopup);
    },
    addOrbitPoint(feature) {
      const numbers = feature._attributes.list.map(item => {
        return {
          num: item.num
        };
      });
      const propsData = {
        numbers: numbers,
        alarmType: feature._attributes.alarmType
          ? feature._attributes.alarmType
          : '',
        isAlarm: false
      };
      const param = {
        feature: feature,
        name: 'orbitPoint',
        times: true
      };
      this.addVueMarker(MapMarkerPointTrack, propsData, param);
    },
    //构建点
    createPoint(item) {
      const coord = new hmap.basetype.Coordinate(
        Number(item.longitude),
        Number(item.latitude),
        0
      );
      const point = new hmap.geom.Point(coord);
      return point;
    },
    //构建feature
    createFeature(item) {
      const point = this.createPoint(item);
      const feature = new hmap.feature.Vector(point, item);
      return feature;
    },
    handleRepeatPoint(data) {
      const temp = []; //一个新的临时数组
      data.forEach(item => {
        const repeatItem = temp.filter(obj => item.name === obj.name);
        if (!repeatItem[0]) {
          var newObj = { ...item };
          temp.push(newObj);
        }
      });
      data.forEach(item => {
        temp.forEach(obj => {
          if (!obj.list) {
            obj.list = [];
          }
          if (item.name === obj.name) {
            obj.list.push(item);
          }
        });
      });
      return temp;
    },
    addDateAndStyle() {
      //启动样式
      this.startStyle = {
        opacity: 1, //设置marker的透明度，可以为[0,1]区间内的任意值，0表示完全透明，1表示完全不透明
        imgSrc: '/static/trace/images/startpoint.png', //设置marker的图片路径
        size: new hmap.basetype.Size(28, 33), //设置marker的大小,单位为像素
        anchor: [0.5, 0.5], //设置图标在marker处的偏移量，为大于0的任意值，具体偏移多少可与下方的参考点作比较
        offset: new hmap.basetype.Offset(0, -16, 0)
      };
      //结束后样式
      this.endStyle = {
        opacity: 1, //设置marker的透明度，可以为[0,1]区间内的任意值，0表示完全透明，1表示完全不透明
        imgSrc: '/static/trace/images/end.png', //设置marker的图片路径
        size: new hmap.basetype.Size(28, 33), //设置marker的大小,单位为像素
        anchor: [0.5, 0.5], //设置图标在marker处的偏移量，为大于0的任意值，具体偏移多少可与下方的参考点作比较
        offset: new hmap.basetype.Offset(0, -16, 0)
      };
      //移动中轨迹样式
      this.moveStyle = {
        opacity: 1, //设置marker的透明度，可以为[0,1]区间内的任意值，0表示完全透明，1表示完全不透明
        imgSrc: '/static/trace/images/rightcar.png', //设置marker的图片路径
        size: new hmap.basetype.Size(30, 60), //设置marker的大小,单位为像素
        anchor: [0.5, 0.5], //设置图标在marker处的偏移量，为大于0的任意值，具体偏移多少可与下方的参考点作比较
        offset: new hmap.basetype.Offset(0, 0, 0)
      };
    },
    initMapAngle() {
      const { mapRotate } = this;
      // level, angle
      // map.zoomTo(14)
      //   this.map.rotate('pitch', 45)
      this.map.rotate('pitch', mapRotate);
    },
    initEvent() {
      //   const { map } = this
      // 01: 监听地图旋转结束，需要做marker图标的旋转角度重新设定, marker层级和远小近大的设定
      // eslint-disable-next-line no-undef
      const vm = this;
      this.map.event.addListener(EventType.MAPEVENT_ROTATEEND, event => {
        const angle = vm.map.getRotateAngle('pitch');
        this.mapRotate = angle;
        // this.initOverlayPerspective()
      });
      // 02 地图拖动结束触发，marker层级和远小近大的设定
      // eslint-disable-next-line no-undef
      this.map.event.addListener(EventType.MAPEVENT_MOVEEND, event => {
        // this.initOverlayPerspective()
      });
      // 03 地图旋转结束触发，marker层级和远小近大的设定
      // eslint-disable-next-line no-undef
      this.map.event.addListener(EventType.MAPEVENT_ZOOMEND, event => {
        // this.initOverlayPerspective()
      });
    }
  }
};
</script>
<style lang="less">
.dmap-map {
  // position: absolute;
  width: 100%;
  height: 100%;
  background: transparent;
  // opacity: 0;
  transition: opacity 0.3s ease;

  &.show {
    opacity: 1;
  }
  .map-container {
    height: 100%;
    width: 100%;
  }
}
</style>
