<template>
  <div class="label-legend">
    <div class="title">图例</div>
    <div
      class="legend-item"
      v-for="(legendItem, index) in legendData"
      :key="index"
    >
      <div class="legend-item--title">{{ legendItem.title }}</div>
      <div class="label">
        <span
          class="label-item"
          v-for="(labelItem, labelIndex) in legendItem.legend"
          :key="labelIndex"
          @click.stop="addLabelToMap(labelItem)"
        >
          <!-- <span
            class="icon"
            :class="{
              'police-box': labelItem.labelName === '岗亭',
              ktv: labelItem.labelName === 'KTV',
              'internet-bar': labelItem.labelName === '网吧',
              'housing-estate': labelItem.labelName === '小区',
              'key-areas': labelItem.labelName === '重点区域'
            }"
          ></span> -->
          <img class="icon" :src="labelItem.picUrl" />
          <span class="text">{{ labelItem.labelName }}</span>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable no-undef */
import { mapState, mapMutations } from 'vuex';
import Vue from 'vue';
import LabelIcon from './labelIcon';
import { queryLabelClassify, queryPlaceLabel } from '@/api/placeLabelConfig';
import { LEGEND_PIC } from '@/constants';
export default {
  name: 'LabelLegend',
  props: {
    labelMarkerData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      legendData: [
        // {
        //   title: '岗亭',
        //   legend: [
        //     {
        //       type: 'police-box',
        //       icon: 'police-box',
        //       name: '岗亭'
        //     }
        //   ]
        // },
        // {
        //   title: '重点场所',
        //   legend: [
        //     {
        //       type: 'ktv',
        //       icon: 'ktv',
        //       name: 'KTV'
        //     },
        //     {
        //       type: 'internet-bar',
        //       icon: 'internet-bar',
        //       name: '网吧'
        //     },
        //     {
        //       type: 'housing-estate',
        //       icon: 'housing-estate',
        //       name: '小区'
        //     }
        //   ]
        // },
        // {
        //   title: '重点区域',
        //   legend: [
        //     {
        //       type: 'key-areas',
        //       icon: 'key-areas',
        //       name: '重点区域'
        //     }
        //   ]
        // }
      ],
      map: null,
      labelType: null,
      legendLabelType: [
        { type: 1, name: '岗亭' },
        { type: 2, name: '重点场所' },
        { type: 3, name: '重点区域' }
      ],
      placeId: ''
    };
  },
  computed: {
    ...mapState(['mapObj'])
  },
  async mounted() {
    for (let i = 0; i < this.legendLabelType.length; i++) {
      const { data } = await queryLabelClassify({
        labelType: this.legendLabelType[i].type
      });

      (data || []).forEach(legendItem => {
        if (legendItem && !legendItem.canDelete) {
          const curLegend = LEGEND_PIC.filter(item => {
            return legendItem.labelName === item.labelName;
          });
          legendItem.picUrl = curLegend[0].picUrl;
        }
      });
      this.legendData.push({
        title: data[0].labelTypeName,
        legend: data
      });
    }
    // await queryPlaceLabel();
  },
  watch: {
    labelMarkerData: {
      handler(val) {
        val.forEach(item => {
          this.initLabelToMap(item, item.placeId);
        });
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    ...mapMutations(['setLabelIcon']),
    addLabelToMap(param) {
      this.labelType = param;
      if (!param.canDelete) {
        LEGEND_PIC.forEach(item => {
          if (item.labelName === param.labelName) {
            this.labelType.picUrl = item.picUrl;
          }
        });
      }

      this.setLabelIcon(param);
      this.map = this.mapObj.getMap();

      const that = this;
      if (param.labelName !== '重点区域') {
        this.mapObj.stopDrawSpatialVector();
        this.map.event.register(
          EventType.MAPMOUSEEVENT_CLICK,
          that.mapClickCallback
        );
      } else {
        this.unRegisterMapClick();
        this.mapObj.drawSpatialVector(
          {
            type: 'polygon',
            strokeWidth: 1,
            delFeatureBtn: false,
            drawCallBack: function (event) {
              const markerId = (Math.random() + '').split('.')[1];
              const polygonWkt = event.wkt;
              const xyArr = polygonWkt.split('(')[2].split(')')[0].split(',');
              let x = 0;
              let y = 0;
              xyArr.forEach(item => {
                x = x + Number(item.split(' ')[0]);
                y = y + Number(item.split(' ')[1]);
              });
              const wkts = [polygonWkt];
              that.addMarker(
                that.labelType,
                String(markerId),
                wkts,
                (x / xyArr.length).toFixed(14),
                (y / xyArr.length).toFixed(14),
                2,
                -17,
                -35,
                event.feature
              );
            },
            fillColor: new hmap.style.Color(255, 51, 51, 0.06),
            strokeColor: new hmap.style.Color(255, 51, 51, 1)
          },
          true
        );
      }
    },
    mapClickCallback(event) {
      const that = this;
      const markerId = (Math.random() + '').split('.')[1];
      const wktsResult = this.geometryToWkt(event.lonlat._x, event.lonlat._y);
      const wkts = [wktsResult];

      this.addMarker(
        this.labelType,
        String(markerId),
        wkts,
        event.lonlat._x,
        event.lonlat._y,
        1,
        -17,
        -35
      );
      this.unRegisterMapClick();
    },
    unRegisterMapClick() {
      this.setLabelIcon(null);
      this.map.event.unRegister(
        EventType.MAPMOUSEEVENT_CLICK,
        this.mapClickCallback
      );
    },
    geometryToWkt(lon, lat) {
      const wkt = new hmap.format.WKT();
      const coord = new hmap.basetype.Coordinate(lon, lat, 0);
      const point = new hmap.geom.Point(coord);
      const style = hmap.style.Style.getDefault();
      const feature = new hmap.feature.Vector(point, {}, style);
      const wktsResult = wkt.writeFeature(feature, 2);
      return wktsResult;
    },
    /**
     * @desc 添加marker
     * @param labelType 标签信息
     * @param markerId markerid
     * @param wkts 区域
     * @param x 经度
     * @param y 纬度
     */
    addMarker(
      labelType,
      markerId,
      wkts,
      x,
      y,
      shapeType,
      offsetX,
      offsetY,
      feature
    ) {
      const that = this;
      const MyComponent = Vue.extend(LabelIcon);
      const component = new MyComponent({
        propsData: {
          labelType: labelType,
          mapUtil: that.mapObj,
          markerId: markerId,
          wkts: wkts,
          shapeType: shapeType, // 点
          polygonFeature: feature,
          lonlatArr: [x, y]
        }
      }).$mount();

      this.mapObj.addMarkerToMap({
        id: markerId,
        isTransform: false,
        html: component.$el, // 必传，marker显示的div
        x: x, // 必传，代表经纬度
        y: y,
        offsetX: offsetX, // 默认值为（0,0）,单位是像素，代表偏移量，默认定位在html的（0,0）的位置
        offsetY: offsetY
      });
    },
    initLabelToMap(label) {
      const reg = /\((.+?)\)/g;
      const { wkts, placeId } = label;
      const wktsData = wkts[0].match(reg);
      LEGEND_PIC.forEach(item => {
        if (item.labelName === label.labelName) {
          label.picUrl = item.picUrl;
        }
      });
      if (label.shapeType === 1) {
        const wktArr = wktsData[0].split('(')[1].split(')')[0].split(' ');
        this.addMarker(
          label,
          String(placeId),
          wkts,
          Number(wktArr[0]),
          Number(wktArr[1]),
          1,
          -17,
          -35
        );
      } else {
        this.drawSpatial(wktsData[0], wkts, label);
      }
    },
    drawSpatial(wktsData, wkts, label) {
      const wktArr = wktsData.split('((')[1].split(')')[0].split(',');
      const pts = [];
      let x = 0;
      let y = 0;
      wktArr.forEach(item => {
        const coords = item.split(' ');

        x = x + parseFloat(coords[0]);
        y = y + parseFloat(coords[1]);
        const coord = new hmap.basetype.Coordinate(
          parseFloat(coords[0]),
          parseFloat(coords[1])
        );
        const pt = new hmap.geom.Point(coord);
        pts.push(pt);
      });
      const lineRing = new hmap.geom.LinearRing(pts);
      const polygonGeom = new hmap.geom.Polygon([lineRing]);
      const lineSymbol = new hmap.style.LineSymbol({
        color: new hmap.style.Color(255, 51, 51, 1),
        width: 1
      });
      const fillSymbol = new hmap.style.ColorFill(
        new hmap.style.Color(255, 51, 51, 0.06)
      );
      const polygonStyle = new hmap.style.Style({
        fillSymbols: [fillSymbol],
        lineSymbols: [lineSymbol]
      });
      const polygonFeature = new hmap.feature.Vector(
        polygonGeom,
        {},
        polygonStyle
      );
      this.map = this.mapObj.getMap();
      let layer = this.map.getLayersByName('绘制图层')[0];
      if (!layer) {
        layer = new hmap.layer.VectorLayer('绘制图层', {});
        this.map.addLayer(layer, null, 'newCanvas');
      }
      layer.addFeatures([polygonFeature]);

      this.addMarker(
        label,
        String(label.placeId),
        wkts,
        (x / wktArr.length).toFixed(14),
        (y / wktArr.length).toFixed(14),
        2,
        -17,
        -35,
        polygonFeature
      );
    }
  }
};
</script>
<style lang="scss" scoped>
.label-legend {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 308px;
  height: 330px;
  background: #fff;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  padding: 12px 16px;
  // z-index: 99999;
  .title {
    height: 32px;
    line-height: 32px;
    color: #4d4d4d;
  }
  .legend-item {
    .legend-item--title {
      height: 12px;
      border-left: 4px solid #2080f7;
      padding-left: 3px;
      line-height: 12px;
      margin: 8px 0;
      color: #4d4d4d;
    }
    .label {
      margin: 20px 0;
    }
    .label-item {
      margin-left: 15px;
      cursor: pointer;
      .icon {
        display: inline-block;
        width: 35px;
        height: 35px;
        // vertical-align: bottom;
        object-fit: contain;
        // &.police-box {
        //   background: url('../../assets/images/config/police-box.png') no-repeat
        //     center;
        // }
        // &.ktv {
        //   background: url('../../assets/images/config/ktv.png') no-repeat center;
        // }
        // &.internet-bar {
        //   background: url('../../assets/images/config/internet-bar.png')
        //     no-repeat center;
        // }
        // &.housing-estate {
        //   background: url('../../assets/images/config/housing-estate.png')
        //     no-repeat center;
        // }
        // &.key-areas {
        //   height: 46px;
        //   background: url('../../assets/images/config/key-areas.png') no-repeat
        //     top;
        // }
      }
      .text {
        display: inline-block;
        height: 30px;
        line-height: 30px;
        vertical-align: bottom;
        font-size: 14px;
        color: #4f4f4f;
        margin-left: 10px;
      }
    }
  }
}
</style>
