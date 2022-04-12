<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: caokeke
 * @Date: 2021-02-23 10:06:28
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-03-29 19:45:49
-->
<template>
  <div class="res-type-panel">
    <div class="type-item" v-for="(item, index) in resTypeList" :key="index">
      <div class="type-item-divider" v-if="index !== 0"></div>
      <el-checkbox v-if="!item.children" @change="changeWholeSelect(item)">
        {{ item.label }}
      </el-checkbox>
      <hover-select
        :itemData="item"
        @checkChanged="checkChanged"
        v-else
      ></hover-select>
    </div>
  </div>
</template>
<script>
import HoverSelect from './HoverSelect';
import { resourceTypeArr } from '@/components/alarm-command/alarmListConstant';
export default {
  data() {
    return {
      resTypeList: resourceTypeArr,
      wholeSelectObj: {},
      wholeSelects: []
    };
  },
  components: {
    HoverSelect
  },
  methods: {
    checkChanged(items) {
      Object.assign(this.wholeSelectObj, {
        [items.itemName]: items.newCheckedItems
      });
      this.wholeSelects.length = 0;
      for (const i in this.wholeSelectObj) {
        this.wholeSelectObj[i].forEach(item => {
          this.wholeSelects.push(item.value);
        });
      }
      this.$emit('resourceTypeDataChange', this.wholeSelects);
    },
    changeWholeSelect(item) {
      const itemIndex = this.wholeSelects.indexOf(item.value);
      if (itemIndex === -1) {
        this.wholeSelects.push(item.value);
        this.wholeSelectObj[item.label] = [item];
      } else {
        this.wholeSelects.splice(itemIndex, 1);
        if (this.wholeSelectObj[item.label]) {
          delete this.wholeSelectObj[item.label];
        }
      }
      this.$emit('resourceTypeDataChange', this.wholeSelects);
    }
  }
};
</script>
<style lang="less">
.res-type-panel {
  position: absolute;
  right: 24px;
  bottom: 12px;
  height: 36px;
  line-height: 40px;
  display: flex;
  padding-left: 20px;
  padding-right: 20px;
  background: white;
  z-index: 999;
  .type-item {
    display: flex;
    align-items: center;
    justify-content: center;
    &-divider {
      width: 1px;
      height: 24px;
      border-left: 1px dashed #979797;
      opacity: 0.5;
    }
    &:first-child,
    &:last-child .type-item-divider {
      margin-right: 16px;
    }
  }
}
</style>
