<template>
  <el-dialog
    title="批量导入"
    :visible="visible"
    :area="[1180, 520]"
    @close="closeDialog"
    class="import-police-dialog"
  >
    <div class="content">
      <DeptTrees
        class="tree"
        @node-click="handleNodeClick"
        @first-level="handleFirstLevel"
        ref="importTree"
      ></DeptTrees>
      <div class="police-table">
        <el-checkbox style="margin-left: 816px" v-model="checked">
          包含下级
        </el-checkbox>
        <el-table
          class="police-table-content"
          ref="table"
          :data="tableData"
          force-scroll
          @selection-change="handleSelect"
        >
          <el-table-column
            type="selection"
            :selectable="selectable"
          ></el-table-column>
          <el-table-column
            label="序号"
            type="index"
            width="80"
          ></el-table-column>

          <el-table-column prop="policeNo" label="警员编号"></el-table-column>
          <el-table-column
            prop="policeRealName"
            label="警员姓名"
          ></el-table-column>
          <el-table-column prop="phoneNum" label="电话号码"></el-table-column>
          <!-- <el-table-column prop="shortNum" label="短号"></el-table-column> -->
          <el-table-column prop="deptName" label="所属单位"></el-table-column>
          <el-table-column prop="associateDeviceType" label="关联设备类型">
            <template slot-scope="{ row }">
              <span>{{ getDeviceTypeName(row.associateDeviceType) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="deviceId"
            label="关联设备编号"
          ></el-table-column>
        </el-table>
        <el-pagination
          class="pagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page.pageNo"
          :page-sizes="[20, 40, 60, 80]"
          :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.total"
        ></el-pagination>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit" :disabled="!selection.length">
        确 定
      </el-button>
      <el-button @click="closeDialog">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import DeptTrees from '@/components/config/deptTrees';
import { getPoliceInfo, batchAddUser } from '@/api/policeConfig';
import { getDeviceTypeName } from '@/utils/common';
export default {
  name: 'BatchImport',
  components: { DeptTrees },

  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      checked: false,
      tableData: [],
      selection: [],
      page: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      curNodeData: {},
      firstLevel: 0
    };
  },

  watch: {
    firstLevel(val) {
      if ((val === 1) & this.visible) {
        const that = this;

        const node2 = this.$refs.importTree.$refs.tree;
        const nodeData = node2.store.nodesMap;

        for (var key in nodeData) {
          if (nodeData[key].level === 1) {
            node2.expandNode(nodeData[key]);
            node2.setSelected(nodeData[key]);
            that.handleNodeClick(nodeData[key].data);
          }
        }
      }
    },
    visible(val) {
      if (val) {
        this.handleNodeClick(this.curNodeData);
      }
    },
    checked() {
      this.handleNodeClick(this.curNodeData);
    }
  },
  created() {
    Object.assign(this, {
      getDeviceTypeName
    });
  },
  methods: {
    handleSizeChange(val, oldVal) {
      this.page.pageNo = 1;
      this.page.pageSize = val;
      this.handleNodeClick(this.curNodeData);
    },
    handleCurrentChange(val, oldVal) {
      this.page.pageNo = val;
      this.handleNodeClick(this.curNodeData);
    },
    closeDialog() {
      this.$emit('update:visible', false);
    },
    handleFirstLevel(level) {
      this.firstLevel = level;
    },
    handleSelect(selection) {
      this.selection = selection;
    },
    async handleNodeClick(data) {
      this.curNodeData = data;
      const {
        data: { list, total }
      } = await getPoliceInfo({
        containSub: this.checked,
        deptCode: data.deptIndexCode,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        visual: null
      });
      this.tableData = list || [];
      this.page.total = total;
    },
    async submit() {
      const ids = this.selection.map(item => {
        return Number(item.id);
      });
      const res = await batchAddUser(ids);
      if (res.msg === 'SUCCESS') {
        this.$message({
          type: 'success',
          message: '添加成功'
        });
        this.closeDialog();
        this.$emit('fetch', { data: this.curNodeData, type: 'import' });
      }
    },
    selectable(row, index) {
      return row.visual !== 1;
    }
  }
};
</script>
<style lang="scss" scoped>
.content {
  display: flex;
  height: 405px;
  .tree {
    width: 247px;
    min-width: 247px;
    height: 405px;
  }
  .police-table {
    flex: 1;
    min-width: 0;
    height: 405px;
    display: flex;
    flex-direction: column;
    padding-left: 10px;
  }
  .police-table-content {
    flex: 1;
  }
}
</style>
