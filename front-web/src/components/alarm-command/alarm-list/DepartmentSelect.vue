<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-02-23 18:44:30
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-04-06 15:15:57
-->
<template>
  <div class="department-select">
    <div class="department-select-showPane" @click="openFlag = !openFlag">
      <div class="department-select-showPane-input">
        {{ chooseValue.deptName }}
      </div>
      <i :class="openFlag ? 'h-icon-angle_up' : 'h-icon-angle_down'"></i>
    </div>
    <transition name="search-slide">
      <div class="department-select-popverPane" v-if="openFlag">
        <!-- <el-tree
          ref="lazyTree"
          :data="treeDataAsync"
          :props="treeProps"
          simple-data
          node-key="id"
          parent-key="pid"
          :load="loadNode"
          lazy
          @node-dbclick="chooseNewDepartment"
        ></el-tree> -->
        <el-scrollbar wrap-class="department-list-pane-items-scrollbar-wrap">
          <div
            v-for="(item, index) in treeDataAsync"
            :key="index"
            class="department-select-popverPane-item"
            @click="chooseNewDepartment(item)"
          >
            {{ item.deptName }}
          </div>
        </el-scrollbar>
      </div>
    </transition>
  </div>
</template>

<script>
import { getPolice } from '@/api/alarmCommand';
export default {
  name: 'DepartmentSelect',
  data() {
    return {
      openFlag: false,
      chooseValue: {},
      treeProps: {
        label: 'name',
        children: 'zones'
      },
      treeDataAsync: []
    };
  },
  methods: {
    async loadNode(node, resolve) {
      let deptIndexCode = '';
      if (node.parent) {
        deptIndexCode = node.data.id;
      } else {
        deptIndexCode = 'd1';
      }
      const { data } = await getPolice({
        deptIndexCode
      });
      data.forEach(item => {
        item.id = item.deptIndexCode;
        if (item.parentIndexCode !== 'd1') {
          item.pid = item.parentIndexCode;
        }
      });
      resolve(data);
    },
    initRegionSelectOptions() {
      // getPolice({
      //   deptIndexCode: 'd1'
      // }).then(({ data }) => {
      //   this.treeDataAsync = data;
      //   this.$set(this, 'chooseValue', data[0]);
      // });
      getPolice().then(({ data }) => {
        this.treeDataAsync = data;
        this.$set(this, 'chooseValue', data[0]);
      });
    },
    chooseNewDepartment(element) {
      this.$set(this, 'chooseValue', element);
      this.$emit('departmentChange', element);
      this.openFlag = false;
    }
  },
  mounted() {
    this.initRegionSelectOptions();
  }
};
</script>

<style lang="scss">
.department-select {
  width: 8rem;
  height: 40px;
  position: relative;
  cursor: pointer;
  &-showPane {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    &-input {
      width: 75%;
      height: 100%;
      font-size: 16px;
      line-height: 40px;
    }
    > i {
      font-size: 20px;
    }
  }
  &-popverPane {
    position: absolute;
    top: 35px;
    z-index: 2000;
    width: 300px;
    height: 300px;
    background: white;
    border: 1px solid #dadada;
    overflow: auto;
    padding: 6px;
    &-item {
      width: 100%;
      height: 26px;
      line-height: 26px;
      text-indent: 6px;
      cursor: pointer;
      &:hover {
        background: rgba(200, 200, 200, 0.5);
      }
    }
  }
}
</style>
<style lang="scss">
.department-list-pane-items-scrollbar-wrap {
  position: relative;
  padding: 0 0 25px 0;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>