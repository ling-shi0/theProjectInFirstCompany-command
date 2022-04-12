<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-03-02 13:56:00
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-06-01 15:11:16
-->
<template>
  <!-- <div class="pop-window-item">
    <el-popover
      placement="top"
      width="150"
      trigger="hover"
      :content="getPopoverName()"
    > -->
  <div
    :style="iconSize"
    @mouseover="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @dragstart="dragIcon"
    @dragend="dragIconOver"
    @click="handleClickIcon"
    class="pop-window-item-img"
    slot="reference"
  >
    <!-- <img :src="imgSrc" /> -->
  </div>
  <!-- </el-popover>
  </div> -->
</template>

<script>
import pointLable from './pointLable';
export default {
  name: 'PopWindowItem',
  props: {
    propsData: {
      type: Object,
      default: () => {}
    },
    map: {
      type: Object,
      default: () => {}
    },
    mapUtil: {
      type: Object,
      default: () => {}
    },
    size: {
      type: Number,
      default: 32
    }
  },
  computed: {
    iconSize() {
      return (
        'background-size:cover;height:' +
        this.size +
        'px;width:' +
        this.size +
        'px;background-image:url(' +
        this.imgSrc +
        ');'
      );
    }
  },
  mounted() {
    this.imgSrc = this.propsData.normalImg;
    // this.imgSrc =iconMap[this.propsData.type].normal;
    // this.componentSrc = iconMap[this.propsData.type].components;
    // this.initPoliceName();
  },
  data() {
    return {
      imgSrc: '',
      clickFlag: false,
      componentSrc: '',
      policeName: ''
    };
  },
  methods: {
    handleMouseEnter() {
      this.imgSrc = this.propsData.hoverImg
        ? this.propsData.hoverImg
        : this.propsData.normalImg;
      if (this.propsData.name) {
        const feature = this.mapUtil.createFeature(this.propsData);
        const propsData = {
          name: this.propsData.name
        };
        const param = {
          feature,
          name: 'popLable',
          times: false
        };
        this.mapUtil.addVueMarker(pointLable, propsData, param);
      }
    },
    handleMouseLeave() {
      // this.mapUtil.clearAllOverlay('popLable');
      !this.clickFlag && (this.imgSrc = this.propsData.normalImg);
      this.clickFlag && (this.imgSrc = this.propsData.clickImg);
    },
    handleClickIcon() {
      this.mapUtil.clearAllOverlay('popLable');
      const feature = this.mapUtil.createFeature(this.propsData);
      const propsData = {
        paneData: this.propsData,
        mapUtil: this.mapUtil
      };
      const param = {
        feature,
        name: 'popWindow',
        times: false
      };
      if (this.propsData.popComponents) {
        this.mapUtil.addVueMarker(
          this.propsData.popComponents,
          propsData,
          param
        );
      }

      // this.$parent.mapUtil.addVueMarker()
      //   if (!this.clickFlag) {
      //     this.clickFlag = true;
      //     this.imgSrc = iconMap[this.propsData.type].active;
      //   } else {
      //     this.clickFlag = false;
      //     this.imgSrc = iconMap[this.propsData.type].normal;
      //   }
      //   this.bus.$emit('addIconPopWindow', {
      //     componentSrc: this.componentSrc,
      //     ...this.propsData,
      //     ...this.propsData.markerData
      //   });
    },
    dragIcon() {
      this.bus.$emit('dragPosition', {
        drag: true
      });
    },
    dragIconOver(e) {
      this.bus.$emit('dragPosition', {
        drag: false,
        offsetX: e.screenX,
        offsetY: e.screenY
      });
    },
    initPoliceName() {
      this.policeName =
        this.propsData.policeRealName ||
        (this.propsData.markerData && this.propsData.markerData.name) ||
        (this.propsData.markerData && this.propsData.markerData.userName);
    },
    getPopoverName() {
      return this.propsData.name;
      //   const map = {
      //     searchPolice: 'policeRealName',
      //     searchPosition: 'name',
      //     searchPoint: 'nameStr',
      //     artificialPosition: 'name',
      //     alarmCenterPosition: 'alarmAddress',
      //     mapStorePosition: 'name',
      //     scencePosition: 'name'
      //   };
      //   return (
      //     (map[this.propsData.type] &&
      //       this.propsData[map[this.propsData.type]]) ||
      //     (this.propsData.markerData && this.propsData.markerData.name)
      //   );
    }
  }
};
</script>

<style lang="scss">
.pop-window-item {
  position: relative;
  &-img {
    transform: translate(-50%, -50%) !important;
    cursor: pointer;
    position: relative;
    transform: translateY(-50%);
  }
  .el-popover {
    text-align: center;
  }
}
</style>
