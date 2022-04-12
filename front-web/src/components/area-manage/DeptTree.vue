<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-03-22 15:12:26
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-03-26 15:59:35
-->
<template>
  <div class="dept-tree">
    <el-tree
      ref="lazyTree"
      :data.sync="treeDataAsync"
      :props="treeProps"
      simple-data
      node-key="deptIndexCode"
      parent-key="parentIndexCode"
      :load="loadNode"
      lazy
      @node-click="chooseNewDepartment"
    ></el-tree>
  </div>
</template>

<script>
import { getDeptTree } from '@/api/alarmCommand';
export default {
  name: 'DeptTree',
  data() {
    return {
      treeProps: {
        label: 'name',
        children: 'deptExts'
      },
      treeDataAsync: [],
      // ownTree: [],
      chooseValue: {},
      breadCrimbs: []
    };
  },
  watch: {
    breadCrimbs(val) {
      this.$emit('breadCrimbsData', val);
    }
  },
  methods: {
    async loadNode(node, resolve) {
      let deptId = '';
      if (node.parent) {
        deptId = node.data.deptIndexCode;
      } else {
        deptId = 'd1';
      }
      const { data } = await getDeptTree(deptId);
      data.forEach(item => {
        item.isLeaf = !item.existsChild;
        if (item.parentIndexCode !== 'd1') {
          item.pid = item.parentIndexCode;
        }
      });
      resolve(data);
    },
    chooseNewDepartment(element) {
      this.$set(this, 'chooseValue', element);
      const parentId = element.parentIndexCode;
      const parentName =
        this.$refs.lazyTree.getNode(element.pid) &&
        this.$refs.lazyTree.getNode(element.pid).data.name;
      this.$emit('departmentChange', { element, parentId, parentName });
      const breadCrimbsArr = [];
      do {
        breadCrimbsArr.unshift(element);
        element =
          this.$refs.lazyTree.getNode(element.pid) &&
          this.$refs.lazyTree.getNode(element.pid).data;
      } while (element);
      this.$set(this, 'breadCrimbs', breadCrimbsArr);
    }
  }
};
</script>

<style lang="scss" scoped>
.dept-tree {
  width: 100%;
  height: calc(100% - 56px);
  text-align: left;
}
</style>
