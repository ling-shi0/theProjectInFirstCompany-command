<template>
  <el-tree
    ref="tree"
    lazy
    :load="loadNode"
    :props="defaultProps"
    node-key="deptIndexCode"
    parent-key="parentIndexCode"
    @node-click="handleNodeClick"
  ></el-tree>
</template>
<script>
import { getTree } from '@/api/policeConfig';

export default {
  name: 'DeptTrees',
  data() {
    return {
      defaultProps: { children: 'policeTrees', label: 'name' }
    };
  },
  methods: {
    async loadNode(node, resolve) {
      const params = { level: node.level + 1 };
      if (node.level > 0 && node.data) {
        params.deptId = node.data.deptIndexCode;
      }
      const { data } = await getTree(params);

        this.$emit('first-level',node.level+1)

      if (data && data.length) {
        const nodeData = [];

        data.forEach(item => {
          if (String(item.treeLevel) === String(node.level + 1)) {
            nodeData.push({
              ...item,
              isLeaf: !item.existsChild,
              policeTrees: []
            });
          }
        });

        return resolve(nodeData);
      } else {
        return resolve([]);
      }
    },
    handleNodeClick(data) {
      this.$emit('node-click', data);
    }
  }
};
</script>