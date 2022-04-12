<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-03-15 09:50:50
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-05-14 11:07:03
-->
<template>
  <div class="area-alarm-scope">
    <div class="area-alarm-scope-title">
      部门接警范围
      <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate">
        全选
      </el-checkbox>
      <el-button icon="h-icon-edit" v-if="editFlag" @click="editStart">
        编辑
      </el-button>
      <el-button icon="h-icon-save" v-else @click="saveEdit">保存</el-button>
    </div>
    <div class="area-alarm-scope-list">
      <el-checkbox-group v-model="checkList">
        <div
          class="area-alarm-scope-list-item"
          v-for="(item, index) in scopeList"
          :class="statusList[index] ? 'active' : ''"
          :key="item.deptIndexCode"
        >
          <el-checkbox
            :label="item.deptIndexCode"
            @change="changeStatus(index)"
            :disabled="checkBoxDisable"
          >
            {{ item.name }}
          </el-checkbox>
        </div>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script>
import { getDeptTree } from '@/api/alarmCommand';
import { modDeptReceiveAlertAuth, queryReceiveDepts } from '@/api/areaManage';
export default {
  name: 'AreaAlarmScope',
  props: {
    deptMes: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      checkAll: false,
      scopeList: [],
      checkList: [],
      isIndeterminate: false,
      statusList: [],
      editFlag: true,
      checkBoxDisable: true
    };
  },
  methods: {
    async initList() {
      const { data } = await getDeptTree(this.deptMes.parentId);
      this.statusList = new Array(data.length).fill(false);
      this.scopeList = data;
      this.checkAll = false;
      this.editFlag = true;
      this.checkBoxDisable = true;
      queryReceiveDepts({
        deptCode: this.deptMes.element.deptIndexCode
      }).then(receviveData => {
        let checkArr = [];
        data &&
          data.forEach((item, index) => {
            if (
              receviveData.data &&
              receviveData.data.indexOf(item.deptIndexCode) > -1
            ) {
              // if (item.deptIndexCode === this.deptMes.element.deptIndexCode) {
              this.statusList[index] = true;
              checkArr.push(item.deptIndexCode);
              this.$set(this, 'checkList', checkArr);
            }
          });
      });
    },
    changeStatus(index) {
      if (this.statusList[index]) {
        this.$set(this.statusList, index, false);
      } else {
        this.$set(this.statusList, index, true);
      }
    },
    changeAuth(val) {
      modDeptReceiveAlertAuth({
        deptCode: this.deptMes.element.deptIndexCode,
        userConfigDepts: val
      }).then(() => {
        this.$message.success('保存成功!');
        this.editFlag = true;
        this.checkBoxDisable = true;
      });
    },
    editStart() {
      this.editFlag = false;
      this.checkBoxDisable = false;
    },
    saveEdit() {
      this.changeAuth(this.checkList);
    }
  },
  watch: {
    deptMes(val) {
      this.initList();
    },
    checkAll(val) {
      if (val) {
        this.checkList = this.scopeList.map(item => item.deptIndexCode);
        this.statusList = new Array(this.scopeList.length).fill(true);
      } else {
        this.checkList = [];
        this.statusList = new Array(this.scopeList.length).fill(false);
      }
    },
    checkList(val) {
      if (val.length === 0) {
        this.isIndeterminate = false;
        this.checkAll = false;
      } else if (val.length === this.scopeList.length) {
        this.isIndeterminate = false;
        this.checkAll = true;
      } else {
        this.isIndeterminate = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.area-alarm-scope {
  width: 100%;
  height: 100%;
  &-title {
    display: flex;
    align-items: center;
    text-indent: 12px;
    width: 98%;
    height: 40px;
    margin: 16px auto 8px;
    background: rgba(216, 216, 216, 0.2);
    font-size: 16px;
    color: rgba(0, 0, 0, 0.7);
    position: relative;
    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -4px;
      width: 100%;
      border-bottom: 1px solid #f0f0f0;
    }
  }
  &-list {
    width: 98%;
    height: calc(100% - 70px);
    overflow-y: auto;
    margin: 0 auto;
    &-item {
      display: inline-block;
      width: 142px;
      height: 40px;
      margin-bottom: 10px;
      margin-right: 16px;
      text-align: left;
      padding-top: 10px;
      cursor: pointer;
      @include utils-ellipsis();
      ::v-deep .el-checkbox__label {
        width: 120px;
      }
      &:hover {
        background: #eaf4ff;
        ::v-deep .el-checkbox__label {
          color: #2080f7;
        }
      }
      &.active {
        background: #eaf4ff;
        ::v-deep .el-checkbox__label {
          color: #2080f7;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.area-alarm-scope {
  & .el-checkbox.is-disabled.is-checked .el-checkbox__label {
    color: #2080f7 !important;
  }
  & .el-checkbox.is-disabled.is-checked .h-svg-icon svg .el-checkbox__tick {
    fill: #2080f7 !important;
  }
}
</style>
