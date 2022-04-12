<template>
  <div class="label-search-wrap" v-clickoutside="closeSearchReault">
    <el-input
      placeholder="请输入资源名称进行查询"
      suffix-icon="h-icon-search"
      v-model="keyword"
      :on-icon-click="handleSearch"
      @keyup.enter.native="handleSearch"
      clearable
    ></el-input>
    <div class="search-result" v-if="actived && labelData.length">
      <div class="label-result-total">
        共&nbsp;
        <span class="num">{{ labelData.length }}</span>
        &nbsp;结果
      </div>
      <div
        class="result-item"
        v-for="(labelItem, index) in labelData"
        :key="index"
        @click.stop="positionPoint(labelItem)"
      >
        <span class="left-info">
          <i class="local-pos-icon"></i>
          <span class="position-des">{{ labelItem.placeLabelName }}</span>
        </span>
        <span class="right-legend">
          {{ labelItem.labelName }}
        </span>
      </div>
    </div>
    <div class="search-result empty" v-else-if="actived && !labelData.length">
      暂无数据
    </div>
  </div>
</template>
<script>
import Clickoutside from '@/utils/clickoutside.js';
import {queryPlaceLabel} from '@/api/placeLabelConfig';
export default {
  name: 'LabelSearch',
  directives: {
    Clickoutside
  },
  data() {
    return {
      keyword: '',
      labelData: [

      ],
      actived: false
    };
  },
  methods: {
    // getLegendTypeName(type) {
    //   let name = '';
    //   switch (type) {
    //     case 'police-box':
    //       name = '岗亭';
    //       break;
    //     case 'housing-estate':
    //       name = '小区';
    //       break;
    //     case 'ktv':
    //       name = 'KTV';
    //       break;
    //     case 'internet-bar':
    //       name = '网吧';
    //       break;
    //     case 'key-areas':
    //       name = '重点区域';
    //       break;
    //   }
    //   return name;
    // },
    async handleSearch() {
      const {data}=await queryPlaceLabel({
        placeLabelName:this.keyword
      })
      this.labelData=data||[]
      this.actived = true;
    },
    closeSearchReault() {
      this.actived = false;
      this.labelData = [];
    },
    // 定位点位标签
    positionPoint(label){
      this.$emit('positionPoint',label);
    }
  }
};
</script>
<style lang="scss" scoped>
@mixin scrollClass {
  &::-webkit-scrollbar {
    width: 4px;
    height: 20px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 100px;
    background: rgba(0, 0, 0, 0.12);
  }
  &::-webkit-scrollbar-track {
    width: 12px;
  }
}
.label-search-wrap {
  width: 300px;
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 666;
  .search-result {
    position: absolute;
    top: 36px;
    left: 0px;
    width: 100%;
    border: 1px solid #ccc;
    background: #fff;
    z-index: 55;
    max-height: 300px;
    // padding-bottom: 4px;
    border-radius: 2px;
    overflow: auto;
    @include scrollClass;
    &.empty {
      height: 80px;
      line-height: 78px;
      text-align: center;
    }
  }
  .result-item {
    height: 55px;
    line-height: 55px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 12px;
    border-bottom: 1px dotted rgba(151, 151, 151, 0.35);
    background: #fff;
    cursor: pointer;
    &:hover {
      background: rgba(32, 128, 247, 0.16);
    }
    .left-info {
      .local-pos-icon {
        display: inline-block;
        width: 24px;
        height: 24px;
        background: url('../../assets/images/config/common_local.png') no-repeat
          center;
        vertical-align: middle;
      }
      .position-des {
        vertical-align: middle;
      }
    }
    .right-legend {
      display: inline-block;
      height: 24px;
      line-height: 24px;
      padding: 0 12px;
      background: #f4f4f4;
      border-radius: 12px;
    }
  }
  .label-result-total {
    height: 35px;
    line-height: 35px;
    margin: 0 12px;
    border-bottom: 1px solid #dfdfdf;
    font-size: 14px;
    color: #4d4d4d;
    .num {
      font-size: 14px;
      color: #eea827;
    }
  }
}
</style>