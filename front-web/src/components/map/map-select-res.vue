<template>
  <div class="dmap-map step-content">
    <map-deploy @mapLoaded="mapLoaded"></map-deploy>
    <div class="location">{{ location }}</div>
  </div>
</template>

<script>
import MapDeploy from '@/components/map/map-deploy.vue';
import { debounce } from '@/components/common/util';
import PopWindowItem from '@/components/alarm-command/mapPopWindow/PopWindowItem';
import MapPopWindowItem from '@/components/alarm-command/mapPopWindow/MapPopWindowItem';
import RegionName from '@/components/alarm-command/mapPopWindow/RegionName';
import AlarmPersonPopItem from '@/components/alarm-command/mapPopWindow/AlarmPersonPopItem';
import { getDragPosition, resourceTypeQuery } from '@/api/alarmCommand';
import { getCurUser } from '@/api/InfoCenter/infoCenter';
import { findByAreaCode } from '@/api/areaManage';
import { mapMutations } from 'vuex';
import { mapOfDataAndLabel } from '@/components/alarm-command/alarmListConstant';
import { getUsersByAcount, modGroup } from '@/api/InfoCenter/infoCenter';
import callPanelMixin from '@/mixins/InfoCenter/callPanelMixin';
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
    }
  },
  mixins: [callPanelMixin],
  data() {
    /** @type {MapUtil} */
    this.mapUtil = null;
    this.map = null;
    return {
      clusterLevel: '',
      geosolutionLayer: null,
      resourceTypeArr: [], // 资源上图数据
      location: '',
      positionLayer: 'positionLayer', // 搜索框地点层
      resourceTypeLayerName: 'resourceTypeLayer', // 资源上图，警员，点位，推荐警员层
      alarmPositionName: 'alarmPositionLayer', // 警情位置定位层
      advisePopLayerName: 'advisePopLayerName', // 推荐警员的层
      dealAndPolicePopName: 'dealAndPolicePopName', // 处置人员或搜索框警力人员层
      popWindowLayerName: 'popWindowLayerName', // 弹出框的层
      advisePersonArr: [], // 存一下推荐人员信息
      pointArr: [] // 存一下查询的点位信息
    };
  },
  mounted() {
    this.bus.$on('openTrackPage', data => {
      this.$router.push({
        path: '/alarm/track',
        query: { userCode: data.deviceNumber, name: data.policeRealName }
      });
    });
    this.bus.$on('mapSearchMes', data => {
      this.mapUtil.removeInfoTemplate(this.positionLayer);
      let longitude = (
        data.itemMes ||
        (data.resMapResps && data.resMapResps[0]) ||
        data
      ).longitude;
      let latitude = (
        data.itemMes ||
        (data.resMapResps && data.resMapResps[0]) ||
        data
      ).latitude;
      if (!longitude || !latitude || +longitude === 0 || +latitude === 0) {
        this.$message.warning('经纬度不存在!');
        return;
      }
      this.addAlarmPositionPop(data, data.type !== 'searchPolice');
    });
    // this.bus.$on('dragPosition', data => {
    //   if (!data.drag) {
    //     let pixel = new hmap.basetype.Pixel(data.offsetX, data.offsetY);
    //     let { _x, _y } = this.geosolutionLayer.getCoordinateFromPixel(pixel);
    //     this.addNewDragPlace(_x, _y);
    //   }
    // });
    this.bus.$on('audioChat', async account => {
      if (this.isHangupStatus) {
        this.showAudioPanel && this.bus.$emit('delAudioGroup');
        const { data } = await getUsersByAcount({ account });
        if (data && data.resId !== this.vertoLoginInfo.resId) {
          await this.handleCreateGroup({
            creator: this.vertoLoginInfo.resId,
            members: this.vertoLoginInfo.resId,
            name: this.vertoLoginInfo.name + '...'
          });
          const { resId, name, number, deptPath, displayNumber } = data;
          const memberExit = this.memberExits(resId);
          if (memberExit) return;
          await this.handleAddMember(data);
          this.setDisplayAudioPanel(true);
          this.$nextTick(() => {
            this.bus.$emit('singleAudioChat');
          });
        } else {
          !data &&
            this.$message({
              type: 'info',
              message: '当前用户无法通信'
            });
          data &&
            data.resId === this.vertoLoginInfo.resId &&
            this.$message({
              type: 'info',
              message: '此用户为当前登陆用户'
            });
          return false;
        }
      } else {
        this.$message({
          type: 'info',
          message: '请先结束当前语音通话'
        });
      }
    });
    this.bus.$on('customLocation', datas => {
      this.mapUtil.addCustomLocation(this.alarmPositionName, data => {
        let x = data.points[0]._coordinate._x;
        let y = data.points[0]._coordinate._y;
        this.addHandleMarker(x, y, datas);
        // this.addAlarmCenterMarker()
      });
    });
    this.bus.$on('setNewCenter', (data, dontSetSenter) => {
      // if(data.isNew && sessionStorage.getItem('alarmDetailVisible')) {
      //   return;
      // }
      if (!data.readType && sessionStorage.getItem('alarmDetailVisible')) {
        return;
      }
      this.mapUtil.removeInfoTemplate(this.alarmPositionName);
      if (
        !data.longitude ||
        !data.latitude ||
        +data.longitude === 0 ||
        +data.latitude === 0
      ) {
        this.$message.warning('经纬度不存在!');
        return;
      }
      !dontSetSenter && this.mapUtil.setMapCenter(data);
      this.addAlarmCenterMarker(data);
    });
    this.bus.$on('deleteAlarmPositionMarker', () => {
      this.alarmPositionName &&
        this.mapUtil.removeInfoTemplate(this.alarmPositionName);
    });
    this.bus.$on('deleteSearchPositionMarker', () => {
      this.positionLayer && this.mapUtil.removeInfoTemplate(this.positionLayer);
    });
    this.bus.$on('addIconPopWindow', data => {
      if (data.resMapResps && data.resMapResps[0]) {
        data = {
          ...data,
          ...data.resMapResps[0]
        };
      }
      let longitude = data.longitude;
      let latitude = data.latitude;
      if (!longitude || !latitude || +longitude === 0 || +latitude === 0) {
        this.$message.warning('经纬度不存在!');
        return;
      }
      this.addIconPopWindow(data);
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
      this.clusterLevel = clusterLevel;
      this.geosolutionLayer = new hmap.geosolution.GeosolutionLayer({});
      this.map.addLayer(this.geosolutionLayer);
      this.$emit('initComponent');
      // 添加管理的辖区
      this.addAreaByUser();
      // this.registerMouseOver();
      // 地图聚合
      this.map.event.addListener(
        EventType.MAPEVENT_EXTENTCHANGED,
        this.resizeHandler
      );
      this.map.event.register(EventType.MAPMOUSEEVENT_MOUSEMOVE, event => {
        this.location =
          event.lonlat._x.toString().slice(0, 10) +
          '_' +
          event.lonlat._y.toString().slice(0, 9);
        // showEvnetMsg('mousemove')
        // const a = event;
        // debugger;
      });
    },
    async addAreaByUser() {
      const {
        data: { deptIndexCode, deptName }
      } = await getCurUser();
      const { data } = await findByAreaCode([deptIndexCode]);
      // const { data } = await findByAreaCode(['371422']);
      if (data.length > 0) {
        let arrList = data[0].wkts.map(obj => {
          return {
            wkt: obj,
            name: data.areaCode
          };
        });
        this.mapUtil.addAreaLayer('areaLayer', arrList);
      }
      // else {
      //   const { data } = await queryDeptJurisdiction({
      //     deptIndexCode
      //   });
      //   // this.mapUtil.addAreaLayer('areaLayer', [data], this.addAreaName);
      //   this.mapUtil.addAreaLayer('areaLayer', [data]);
      // }
    },
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
      this.resourceTypeArr['INDIVIDUAL'] = data && data['INDIVIDUAL'];
      this.resourceTypeArr['PLACEPDA'] = data && data['PLACEPDA'];
      this.resourceTypeArr['INTERCOM'] = data && data['INTERCOM'];
      this.resourceTypeArr['VEHICLEGPS'] = data && data['VEHICLEGPS'];
      this.resourceTypeArr['CAMERA'] = [];
      this.resourceTypeArr['AR'] = [];
      this.clearResourceTypeData(this.resourceTypeLayerName);
      this.addResourceTypePoint(data, true);
    },
    // 获取资源数据
    getListData: async function (params) {
      params['isCluster'] = false;
      const { data } = await resourceTypeQuery(params);
      this.resourceTypeArr['INDIVIDUAL'] = data && data['INDIVIDUAL'];
      this.resourceTypeArr['PLACEPDA'] = data && data['PLACEPDA'];
      this.resourceTypeArr['INTERCOM'] = data && data['INTERCOM'];
      this.resourceTypeArr['VEHICLEGPS'] = data && data['VEHICLEGPS'];
      this.resourceTypeArr['CAMERA'] = data && data['CAMERA'];
      this.resourceTypeArr['AR'] = data && data['AR'];
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
          if (i === 'REGION') {
            let arr = JSON.parse(item.wkt);
            let arrList = arr.map(obj => {
              return {
                wkt: obj,
                name: item.name
              };
            });
            this.mapUtil.addRegionPolygonLayer(
              'regionLayer',
              arrList,
              this.addRegionName
            );
          } else {
            if (!this.judgeIsSame(data, item, i)) {
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
                markerData: item,
                isAdvise: true,
                isResourceType: true
              };
              this.addPopWindow(item, propsData, this.resourceTypeLayerName);
              propsData = null;
            }
          }
        });
      }
    },
    //辖区名称
    addAreaName(feature) {
      let param = {
        feature,
        name: 'areaLayerName',
        times: true
      };
      let propsData = {
        name: feature._attributes.name
      };
      this.mapUtil.addVueMarker(RegionName, propsData, param);
    },
    //重点区域名称
    addRegionName(feature) {
      let param = {
        feature,
        name: this.resourceTypeLayerName,
        times: true
      };
      let propsData = {
        name: feature._attributes.name
      };
      this.mapUtil.addVueMarker(RegionName, propsData, param);
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
      this.mapUtil.clearAll('regionLayer');
      this.mapUtil.removeInfoTemplate(name);
    },
    addAlarmPositionPop(data, showComponent, isAlarmPosition, dontSetSenter) {
      !dontSetSenter &&
        this.mapUtil.setMapCenter(
          data.itemMes || (data.resMapResps && data.resMapResps[0]) || data
        );
      this.addPopWindow(
        data.itemMes || (data.resMapResps && data.resMapResps[0]) || data,
        {
          isAdvise: false,
          ...(data.itemMes || data),
          type: data.type,
          showComponent: showComponent
        },
        (isAlarmPosition && this.alarmPositionName) || this.positionLayer
      );
      if (data.type === 'searchPolice') {
        this.advisePersonArr = [data.itemMes || data];
        !isAlarmPosition && (this.pointArr.length = 0);
        this.findAndDestoryINDIVIDUAL([data.itemMes || data]);
      }
      if (data.type === 'searchPoint') {
        !isAlarmPosition && (this.advisePersonArr.length = 0);
        this.pointArr = [data.itemMes || data];
        this.findAndDestoryPoint([data.itemMes || data]);
      }
    },
    addDealPeopleDetailPop(data) {
      let longitude =
        data.mes.resMapResps &&
        data.mes.resMapResps[0] &&
        data.mes.resMapResps[0].longitude;
      let latitude =
        data.mes.resMapResps &&
        data.mes.resMapResps[0] &&
        data.mes.resMapResps[0].latitude;
      if (!longitude || !latitude || +longitude === 0 || +latitude === 0) {
        this.$message.warning('经纬度不存在!');
        return;
      }
      this.mapUtil.setMapCenter(
        data.mes.resMapResps && data.mes.resMapResps[0]
      );
      let name = new Date().getTime();
      this.dealAndPolicePopName = name;
      this.addPopWindow(
        data.mes.resMapResps && data.mes.resMapResps[0],
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
      let longitude = (data.mes && data.mes[0]).longitude;
      let latitude = (data.mes && data.mes[0]).latitude;
      if (!longitude || !latitude || +longitude === 0 || +latitude === 0) {
        this.$message.warning('经纬度不存在!');
        return;
      }
      this.mapUtil.setMapCenter(data.mes && data.mes[0]);
      const overlay = this.map.getLayersByName(this.advisePopLayerName)[0];
      if (overlay) {
        overlay.removeAllOverlays();
      }
      if (data.mes) {
        data.mes.forEach(item => {
          this.addPopWindow(
            item,
            {
              type: data.type,
              isAdvise: true,
              markerData: item
            },
            this.advisePopLayerName
          );
        });
        this.findAndDestoryINDIVIDUAL(data.mes);
      }
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
    },
    findAndDestoryINDIVIDUAL(data) {
      let flag = false; // 默认假设推荐的警员不包含在资源上图的警员数组中
      ['INDIVIDUAL', 'PLACEPDA', 'INTERCOM', 'VEHICLEGPS'].forEach(name => {
        data &&
          this.resourceTypeArr &&
          this.resourceTypeArr[name] &&
          this.resourceTypeArr[name].forEach(item => {
            for (let i = 0; i < data.length; i++) {
              if (item.userId === data[i].userIndexCode) {
                flag = true;
                break;
              }
            }
          });
      });
      if (flag) {
        // 包含了的话就去找他们然后毁了他们feature
        const overlayLayer = this.map.getLayersByName(
          this.resourceTypeLayerName
        )[0];
        const arr =
          overlayLayer &&
          overlayLayer.getOverlaysByDomId('resourceTypeLayerundefined');
        if (arr.length) {
          arr.forEach(item => {
            for (let i = 0; i < data.length; i++) {
              if (
                item._userData.feature._attributes.userId &&
                item._userData.feature._attributes.userId ===
                  data[i].userIndexCode
              ) {
                overlayLayer.removeOverlay(item);
              }
            }
          });
        }
      }
    },
    findAndDestoryPoint(data) {
      let flag = false; // 默认假设推荐的警员不包含在资源上图的警员数组中
      if (data && this.resourceTypeArr) {
        this.resourceTypeArr['AR'] &&
          this.resourceTypeArr['AR'].forEach(item => {
            for (let i = 0; i < data.length; i++) {
              if (item.address === data[i].indexCode) {
                flag = true;
                break;
              }
            }
          });
        if (!flag) {
          this.resourceTypeArr['CAMERA'] &&
            this.resourceTypeArr['CAMERA'].forEach(item => {
              for (let i = 0; i < data.length; i++) {
                if (item.address === data[i].indexCode) {
                  flag = true;
                  break;
                }
              }
            });
        }
      }
      if (flag) {
        // 包含了的话就去找他们然后毁了他们feature
        const overlayLayer = this.map.getLayersByName(
          this.resourceTypeLayerName
        )[0];
        const arr =
          overlayLayer &&
          overlayLayer.getOverlaysByDomId('resourceTypeLayerundefined');
        if (arr.length) {
          arr.forEach(item => {
            for (let i = 0; i < data.length; i++) {
              if (
                item._userData.feature._attributes.address &&
                item._userData.feature._attributes.address === data[i].indexCode
              ) {
                overlayLayer.removeOverlay(item);
              }
            }
          });
        }
      }
    },
    addAlarmCenterMarker(data) {
      this.mapUtil.removeInfoTemplate(this.alarmPositionName);
      this.addPopWindow(
        data,
        {
          isAdvise: false,
          ...data,
          type: 'alarmCenterPosition',
          showComponent: true
        },
        this.alarmPositionName
      );
    },
    addHandleMarker(x, y, data) {
      this.mapUtil.removeInfoTemplate(this.alarmPositionName);
      let longitude = x;
      let latitude = y;
      if (!longitude || !latitude || +longitude === 0 || +latitude === 0) {
        this.$message.warning('经纬度不存在!');
        return;
      }
      data.longitude = x;
      data.latitude = y;
      data.type = 'artificialPosition';
      this.addAlarmPositionPop(data, true, true, true);

      this.bus.$emit('setAlarmPosition', {
        address: data.alarmSituationAddress,
        latitude: data.latitude,
        longitude: data.longitude,
        name: data.alarmComment,
        type: 3,
        dontSetSenter: true
      });
    },
    judgeIsSame(data, item, i) {
      let flag = false;
      if (
        ['INDIVIDUAL', 'PLACEPDA', 'INTERCOM', 'VEHICLEGPS'].indexOf(i) > -1 &&
        this.advisePersonArr
      ) {
        flag =
          this.advisePersonArr.filter(data => {
            if (data && data.userIndexCode && item.userId) {
              return data.userIndexCode === item.userId;
            } else {
              return false;
            }
          }).length > 0;
        if (flag) {
          return flag;
        }
      }
      if (item.polymerize) {
        // 聚合情况不存在重复渲染的问题
        flag = false;
      } else {
        if ((i === 'CAMERA' || i === 'AR') && this.pointArr) {
          flag =
            this.pointArr.filter(data => {
              if (data && data.indexCode && item.address) {
                return data.indexCode === item.address;
              } else {
                return false;
              }
            }).length > 0;
        } else {
          flag = false;
        }
      }
      return flag;
    },
    addIconPopWindow(propsData) {
      this.mapUtil.setMapCenter(propsData);
      const overlay = this.map.getLayersByName(this.popWindowLayerName)[0];
      if (overlay) {
        overlay.removeAllOverlays();
      }
      let feature = this.mapUtil.createFeature(propsData);
      let param = {
        feature,
        name: this.popWindowLayerName,
        times: true
      };
      this.mapUtil.addVueMarker(
        MapPopWindowItem,
        {
          type: propsData.type,
          isAdvise: true,
          propsData
        },
        param
      );
      feature = null;
      param = null;
    }
  },
  watch: {
    resourceTypeData(val) {
      this.getMapPointData(val);
    },
    alarmListItemData(item) {
      let longitude = item && item.longitude;
      let latitude = item && item.latitude;
      if (!longitude || !latitude || +longitude === 0 || +latitude === 0) {
        this.$message.warning('经纬度不存在!');
        return;
      }
      this.mapUtil.setMapCenter(item);
    },
    alarmPositionData(data) {
      this.mapUtil.removeInfoTemplate(this.alarmPositionName);
      let longitude = (
        data.itemMes ||
        (data.resMapResps && data.resMapResps[0]) ||
        data
      ).longitude;
      let latitude = (
        data.itemMes ||
        (data.resMapResps && data.resMapResps[0]) ||
        data
      ).latitude;
      if (!longitude || !latitude || +longitude === 0 || +latitude === 0) {
        this.$message.warning('经纬度不存在!');
        return;
      }
      console.log(data.dontSetSenter);
      this.addAlarmPositionPop(data, true, true, data.dontSetSenter);
    },
    alarmPersonPopData: {
      handler(data, oldName) {
        // this.mapUtil.setMapCenter(data);
        // this.addAlarmPersonPop(data, 'alarmPersonPopWindow');
      },
      deep: true
    },
    dealPeopleDetailData(data) {
      this.mapUtil.removeInfoTemplate(this.dealAndPolicePopName);
      this.addDealPeopleDetailPop(data);
    },
    advisePersonData(data) {
      this.addAdvisePeoplePop(data);
    }
  }
};
</script>
<style lang="less">
.dmap-map {
  // position: absolute;
  // left: 430px;
  // right: 0;
  // bottom: 0;
  // top: 0;
  width: calc(100% - 430px);
  height: 100%;
  background: transparent;
  transition: opacity 0.3s ease;
  float: right;
  //   .absolute0;
  &.show {
    opacity: 1;
  }
}
.location {
  position: absolute;
  bottom: 20px;
  left: 500px;
  height: 20px;
  width: 100px;
  // color: #ffffff;
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
