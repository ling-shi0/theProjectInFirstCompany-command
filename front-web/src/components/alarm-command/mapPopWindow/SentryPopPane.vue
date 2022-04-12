<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: caokeke
 * @Date: 2021-04-21 09:32:32
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-06-01 14:11:39
-->
<template>
  <div class="sentry-pop-pane">
    <div class="sentry-pop-pane-title">
      警力展示
      <i class="h-icon-close" @click="closePopWindow"></i>
    </div>
    <div class="sentry-pop-pane-table">
      <div
        class="sentry-pop-pane-table-item"
        v-for="(item, index) in gridData"
        :key="index"
      >
        <img :src="policeIcon" />
        <div class="sentry-pop-pane-table-item-name" :title="item.policeName">
          {{ item.policeName }}
        </div>
        <div class="sentry-pop-pane-table-item-num" :title="item.policeNo">
          {{ item.policeNo }}
        </div>
      </div>
      <div class="sentry-pop-pane-table-empty" v-if="gridData.length === 0">
        暂无数据
      </div>
    </div>
  </div>
</template>

<script>
import { getCurPolicesInPlace } from '@/api/placeLabelConfig';
import policeIcon from '@/assets/images/map/policeIcon.png';
export default {
  name: 'SentryPopPane',
  data() {
    return {
      gridData: [],
      policeIcon
    };
  },
  props: {
    paneData: {
      type: Object,
      default: () => {}
    }
  },
  mounted() {
    this.fetchGridData();
  },
  methods: {
    closePopWindow() {
      this.$emit('closeComponent');
    },
    fetchGridData() {
      // userId是岗亭编号的意思
      let placeId = this.paneData && this.paneData.userId;
      getCurPolicesInPlace({ placeId }).then(({ data }) => {
        this.gridData = data;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.sentry-pop-pane {
  width: 187px;
  height: 138px;
  background: white;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.29);
  padding: 8px;
  position: relative;
  border-radius: 4px;
  z-index: 99999;
  &::after {
    content: '';
    width: 8px;
    height: 6px;
    position: absolute;
    bottom: -12px;
    left: calc(50% - 6px);
    border-style: solid;
    border-width: 6px;
    border-color: white transparent transparent transparent;
  }
  &-title {
    width: 90%;
    height: 30px;
    line-height: 30px;
    margin: 0 auto;
    margin-bottom: 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px dashed rgba(151, 151, 151, 0.35);
    > i {
      font-size: 24px;
      cursor: pointer;
    }
  }
  &-table {
    width: 90%;
    height: calc(100% - 36px);
    overflow: auto;
    margin: 0 auto;
    &-item {
      width: 100%;
      height: 32%;
      display: flex;
      justify-content: center;
      align-items: center;
      &-name {
        width: 56px;
        margin-left: 16px;
        margin-right: 14px;
        @include utils-ellipsis();
      }
      &-num {
        width: 58px;
        @include utils-ellipsis();
      }
    }
    &-empty {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
