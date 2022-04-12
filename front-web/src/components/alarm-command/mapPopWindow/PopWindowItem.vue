<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-03-02 13:56:00
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-06-01 15:11:16
-->
<template>
  <div class="pop-window-item">
    <!-- 聚合点位 -->
    <div
      class="pop-window-item-img"
      v-if="propsData.type === 'jhspdw' || propsData.type === 'jhargd'"
    >
      <img :src="imgSrc" style="width: 86px; height: 36px" />
      <span class="pop-window-item-together">
        {{ propsData.markerData && propsData.markerData.amount }}
      </span>
    </div>
    <!-- 非聚合点位 -->
    <el-popover
      placement="bottom"
      width="200"
      trigger="hover"
      :content="getPopoverName()"
      v-else
    >
      <div
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        @click="handleClickIcon"
        @dragstart="dragIcon"
        @dragend="dragIconOver"
        class="pop-window-item-img"
        slot="reference"
      >
        <img :src="imgSrc" />
      </div>
    </el-popover>
    <!-- 警员的名称 -->
    <div
      class="pop-window-item-dbName"
      v-if="
        ['db', 'jwt', 'djj', 'cz', 'searchPolice'].indexOf(propsData.type) > -1
      "
    >
      <span
        class="pop-window-item-dbName-advise"
        v-if="propsData.isAdvise && !propsData.isResourceType"
      >
        推荐
      </span>
      <span :title="policeName">
        {{ policeName }}
      </span>
    </div>
  </div>
</template>

<script>
import { iconMap } from '@/components/alarm-command/alarmListConstant';
export default {
  name: 'PopWindowItem',
  props: {
    propsData: {
      type: Object,
      default: () => {}
    }
  },
  mounted() {
    this.imgSrc = iconMap[this.propsData.type].normal;
    this.componentSrc = iconMap[this.propsData.type].components;
    this.initPoliceName();
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
      this.imgSrc = iconMap[this.propsData.type].hover;
    },
    handleMouseLeave() {
      !this.clickFlag && (this.imgSrc = iconMap[this.propsData.type].normal);
      this.clickFlag && (this.imgSrc = iconMap[this.propsData.type].active);
    },
    handleClickIcon() {
      if (!this.clickFlag) {
        this.clickFlag = true;
        this.imgSrc = iconMap[this.propsData.type].active;
      } else {
        this.clickFlag = false;
        this.imgSrc = iconMap[this.propsData.type].normal;
      }
      this.bus.$emit('addIconPopWindow', {
        componentSrc: this.componentSrc,
        ...this.propsData,
        ...this.propsData.markerData
      });
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
      const map = {
        searchPolice: 'policeRealName',
        searchPosition: 'name',
        searchPoint: 'nameStr',
        artificialPosition: 'name',
        alarmCenterPosition: 'alarmSituationAddress',
        mapStorePosition: 'name',
        scencePosition: 'name'
      };
      return (
        (map[this.propsData.type] &&
          this.propsData[map[this.propsData.type]]) ||
        (this.propsData.markerData && this.propsData.markerData.name)
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.pop-window-item {
  position: relative;
  &-img {
    max-width: 48px;
    cursor: pointer;
    position: relative;
    margin-left: -24px;
    transform: translateY(-50%);
    .pop-window-item-together {
      position: absolute;
      display: block;
      top: 2px;
      left: 42px;
      color: white;
      font-size: 20px;
    }
  }
  &-com {
    position: absolute;
    bottom: 80px;
    left: 0;
    z-index: 900;
    transform: translateX(-50%);
  }
  .pop-window-item-dbName {
    height: 20px;
    background: white;
    font-size: 14px;
    font-style: normal;
    color: rgb(77, 77, 77);
    display: flex;
    align-items: center;
    border-radius: 2px;
    transform: translateX(-50%);
    margin-top: -24px;
    > span {
      text-align: center;
      color: rgb(77, 77, 77);
    }
    &-advise {
      display: inline-block;
      width: 40px;
      height: 20px;
      background-image: linear-gradient(90deg, #e45e0d 0%, #ffbb4a 100%);
      border-radius: 1px;
      text-align: center;
      color: white !important;
      font-weight: bold;
    }
    &-divider {
      width: 1px !important;
      height: 10px;
      border-left: 1px solid #eee;
    }
    > span:last-child {
      height: 20px;
      font-weight: bold;
      color: rgb(77, 77, 77);
    }
  }
}
</style>
