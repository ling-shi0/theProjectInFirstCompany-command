<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-02-24 14:42:02
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-03-25 14:41:24
-->
<template>
  <div
    class="hover-select"
    @mouseenter="hoverFlag = true"
    @mouseleave="hoverFlag = false"
  >
    <div class="hover-select-show">
      <el-checkbox
        :indeterminate="isIndeterminate"
        v-model="checkAll"
        @change="handleCheckAllChange"
      >
        {{ itemData.label }}
      </el-checkbox>
      <i class="h-icon-angle_down"></i>
    </div>
    <transition name="search-slide">
      <div
        class="hover-select-popver"
        v-show="hoverFlag"
        :style="`height: ${26 * itemData.children.length}px;top: -${
          26 * itemData.children.length
        }px`"
        @mouseenter="hoverFlag = true"
        @mouseleave="hoverFlag = false"
      >
        <el-checkbox-group
          v-model="checkedItems"
          @change="handleCheckedItemsChange"
          style="
            background: white;
            border-radius: 2px;
            padding: 2px;
            margin-bottom: 2px;
          "
        >
          <el-checkbox
            v-for="item in itemData.children"
            :label="item.label"
            :key="item.value"
            style="padding-left: 12px"
          >
            {{ item.label }}
          </el-checkbox>
        </el-checkbox-group>
        <div style="width: 100%; height: 2px"></div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'HoverSelect',
  props: {
    itemData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      checkedItems: [],
      checkAll: false,
      isIndeterminate: false,
      hoverFlag: false
    };
  },
  methods: {
    handleCheckAllChange(value) {
      let items = this.itemData.children.map(item => item.label);
      this.checkedItems = value ? items : [];
      this.isIndeterminate = false;
      items = null;
      this.$emit('checkChanged', {
        itemName: this.itemData.label,
        newCheckedItems: value ? this.itemData.children : []
      });
    },
    handleCheckedItemsChange() {
      if (this.checkedItems.length === this.itemData.children.length) {
        this.checkAll = true;
        this.isIndeterminate = false;
      } else if (this.checkedItems.length === 0) {
        this.checkAll = false;
        this.isIndeterminate = false;
      } else {
        this.checkAll = false;
        this.isIndeterminate = true;
      }
      let newCheckedItems = this.itemData.children.filter(item => {
        return this.checkedItems.indexOf(item.label) > -1;
      });
      this.$emit('checkChanged', {
        newCheckedItems,
        itemName: this.itemData.label
      });
      newCheckedItems = null;
    }
  }
};
</script>

<style lang="scss">
.hover-select {
  width: 110px;
  height: 36px;
  position: relative;
  cursor: pointer;
  &-show {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    > i {
      margin-left: 0.2rem;
    }
  }
  &-popver {
    width: 110px;
    position: absolute;
    left: 0;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px;
    z-index: 10000;
  }
  &:hover {
    .hover-select-show > i {
      transition: all 0.5s;
      transform: rotate(180deg);
    }
  }
}
</style>
