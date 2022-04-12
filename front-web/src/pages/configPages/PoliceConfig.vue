<template>
  <div class="police-config-wrapper">
    <section class="top-button">
      <div class="left-actions">
        <el-button icon="h-icon-download" size="mini" @click.stop="batchImport">
          批量导入
        </el-button>
        <!-- <el-button icon="h-icon-add" @click="addPerson" size="mini">
          添加
        </el-button> -->
        <!-- <el-button icon="h-icon-edit">编辑</el-button> -->
        <el-button
          icon="h-icon-delete"
          size="mini"
          :disabled="!selection.length"
          @click="batchDelPolice(selection)"
        >
          删除
        </el-button>
      </div>
      <div class="right-search">
        <el-input
          class="el-input--width"
          placeholder="请输入关键字"
          suffix-icon="h-icon-search"
          v-model="searchInput"
          :on-icon-click="handleIconClick"
          @keyup.enter.native="handleIconClick"
          :clear-icon-click="clearIconClick"
          clearable
        ></el-input>
        <el-checkbox
          style="margin-left: 1078px; margin-top: 6px"
          v-model="checked"
        >
          包含下级
        </el-checkbox>
      </div>
    </section>
    <section class="center-table">
      <div class="tree">
        <dept-trees
          @node-click="handleNodeClick"
          ref="deptTree"
          @first-level="handleFirstLevel"
        ></dept-trees>
      </div>
      <div class="police-table">
        <el-table
          class="police-table-content"
          ref="table"
          :data="tableData"
          force-scroll
          @selection-change="handleSelect"
        >
          <el-table-column type="selection"></el-table-column>
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
              <span>
                {{ getDeviceTypeName(row.associateDeviceType) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="deviceId"
            label="关联设备编号"
          ></el-table-column>

          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button
                @click="editPersonConfig(scope.row)"
                type="link"
                size="small"
              >
                编辑
              </el-button>
              <el-button
                type="link"
                size="small"
                @click="batchDelPolice(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
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
    </section>

    <EditPoliceDialog
      :visible.sync="visible"
      :title="title"
      :dataProvide="editPoliceData"
      @fetch="updateTable"
    ></EditPoliceDialog>
    <batch-import
      :visible.sync="importVisible"
      @fetch="updateTable"
    ></batch-import>
  </div>
</template>
<script>
import EditPoliceDialog from './EditPoliceDialog';
import DeptTrees from '@/components/config/deptTrees';
import { getTree, getPoliceInfo, batchDelUser } from '@/api/policeConfig';
import BatchImport from './batchImport.vue';
import { getDeviceTypeName } from '@/utils/common';
export default {
  name: 'PoliceConfig',
  components: {
    EditPoliceDialog,
    DeptTrees,
    BatchImport
  },
  data() {
    return {
      checked: false,
      page: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      tableData: [],
      searchInput: '',
      visible: false,
      importVisible: false,
      title: '添加警员',
      selection: [],
      editPoliceData: {},
      curNode: {},
      firstLevel: 0
    };
  },
  created() {
    Object.assign(this, { getDeviceTypeName });
  },
  watch: {
    firstLevel(val) {
      if (val === 1) {
        const node2 = this.$refs.deptTree.$refs.tree;
        const nodeData = node2.store.nodesMap;

        for (var key in nodeData) {
          if (nodeData[key].level === 1) {
            node2.expandNode(nodeData[key]);
            node2.setSelected(nodeData[key]);
            this.handleNodeClick(nodeData[key].data);
          }
        }
      }
    }
  },
  methods: {
    handleSizeChange(val, oldVal) {
      this.page.pageNo = 1;
      this.page.pageSize = val;
      this.handleNodeClick(this.curNode);
    },
    handleCurrentChange(val, oldVal) {
      this.page.pageNo = val;
      this.handleNodeClick(this.curNode);
    },
    handleFirstLevel(level) {
      this.firstLevel = level;
    },
    addPerson() {
      this.title = '添加警员';
      this.visible = true;
    },
    editPersonConfig(data) {
      this.title = '编辑警员';
      this.editPoliceData = data;
      this.visible = true;
    },
    // 选择项发生改变时函数
    handleSelect(selection) {
      this.selection = selection;
    },

    // 点击节点
    async handleNodeClick(data) {
      this.searchInput = '';
      this.curNode = data;
      const {
        data: { list, total }
      } = await getPoliceInfo({
        deptCode: data.deptIndexCode,
        containSub: this.checked,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        visual: 1
      });
      this.tableData = list || [];
      this.page.total = total;
    },
    batchImport() {
      this.importVisible = true;
    },
    // 单个删除-置为不可见
    async batchDelPolice(data) {
      this.$confirm('是否确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(async () => {
          let ids;
          if (Array.isArray(data)) {
            ids = data.map(item => {
              return item.id;
            });
          } else {
            ids = [data.id];
          }
          const res = await batchDelUser(ids);
          if (res.msg === 'SUCCESS') {
            this.$message({
              type: 'success',
              message: '删除成功'
            });
            this.handleNodeClick(this.curNode);
          }
        })
        .catch(() => {
          this.$message({
            type: 'success',
            message: '已取消删除'
          });
        });
    },
    updateTable(params) {
      const { data, type } = params;
      if (type === 'import') {
        if (data.deptIndexCode === this.curNode.deptIndexCode) {
          this.handleNodeClick(this.curNode);
        }
      } else {
        this.handleNodeClick(this.curNode);
      }
    },
    // 根据警员名称关键字检索
    async handleIconClick() {
      const {
        data: { list, total }
      } = await getPoliceInfo({
        // containSub:false,
        policeName: this.searchInput,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        visual: 1
      });
      this.tableData = list || [];
      this.page.total = total;
    },
    clearIconClick() {
      this.searchInput = '';
      this.handleNodeClick(this.curNode);
    }
  }
};
</script>
<style lang="scss" scoped>
.police-config-wrapper {
  height: 100%;

  display: flex;
  flex-direction: column;
  margin: 12px 0 0 12px;
  min-width: 1200px;
  .top-button {
    display: flex;
    justify-content: space-between;
    height: 44px;
    padding-right: 12px;
  }
  .center-table {
    flex: 1;
    height: 100%;
    display: flex;

    .tree {
      // flex:0;

      width: 247px;
      min-width: 247px;
      margin-bottom: 10px;
      // padding: 5px;
    }
    .police-table {
      padding: 8px;
      // margin:8px;
      background: #f5f5f5;
      min-width: 0;
      flex: 1;
      display: flex;
      flex-direction: column;
      .pagination {
        background: #fff;
        padding: 0 5px;
      }
      .police-table-content {
        padding: 5px 5px 0 5px;
      }
    }
  }
}
</style>
