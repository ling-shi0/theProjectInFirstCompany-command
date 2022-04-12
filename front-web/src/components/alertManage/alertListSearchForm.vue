<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-02-22 10:36:19
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-04-26 14:30:08
-->
<template>
  <div class="alert-list-search-form">
    <el-form
      ref="form"
      label-position="top"
      :model="form"
      label-width="90px"
      class="alert-list-search-form-list"
    >
      <el-form-item label="查询内容" class="alert-list-search-form-list-item">
        <el-input v-model="form.keyword"></el-input>
      </el-form-item>
      <el-form-item label="警情级别" class="alert-list-search-form-list-item">
        <el-select v-model="form.alarmLevel" placeholder="请选择警情级别">
          <el-option label="全部" value=""></el-option>
          <el-option label="一级" value="1"></el-option>
          <el-option label="二级" value="2"></el-option>
          <el-option label="三级" value="3"></el-option>
          <el-option label="四级" value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="警情类型" class="alert-list-search-form-list-item">
        <el-select v-model="form.alertCategory" placeholder="请选择警情类型">
          <el-option
            v-for="(item, index) in alarmTypeOptions"
            :key="index"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="警情状态" class="alert-list-search-form-list-item">
        <el-select v-model="form.state" placeholder="请选择警情状态">
          <el-option label="全部" value=""></el-option>
          <el-option label="分派" value="分派"></el-option>
          <el-option label="签收" value="签收"></el-option>
          <el-option label="到达" value="到达"></el-option>
          <el-option label="反馈" value="反馈"></el-option>
          <el-option label="完结" value="完结"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="接警时间" class="alert-list-search-form-list-item">
        <el-date-picker
          v-model="form.time"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="处置人员" class="alert-list-search-form-list-item">
        <el-input v-model="form.disposePerson"></el-input>
      </el-form-item>
      <el-form-item label="受警单位" class="alert-list-search-form-list-item">
        <tree-select
          ref="treeSelect"
          v-model="form.takeAlarmDeptCodes"
          clearable
          multiple
          collapse-tags
          node-key="deptIndexCode"
          parent-key="parentIndexCode"
          simple-data
          :tree-data="treeData"
          :display-labels="createDepartmentsLabels"
          :lazy="treeLazy"
          :load="loadNode"
          :props="{
            label: 'name',
            children: 'deptExts'
          }"
          placeholder="全部"
          :showSearch="true"
          :handleSearchTree="handleSearchTree"
          :handleClearSearchResult="handleClearSearchResult"
        />
      </el-form-item>
      <el-form-item label="案件关注" class="alert-list-search-form-list-item">
        <el-radio-group
          v-model="form.focus"
          class="alert-list-search-form-list-item-radioGroup"
        >
          <el-radio label="">全部案件</el-radio>
          <el-radio label="1">已关注</el-radio>
          <el-radio label="0">未关注</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="案件时效" class="alert-list-search-form-list-item">
        <el-radio-group
          v-model="form.overTime"
          class="alert-list-search-form-list-item-radioGroup"
        >
          <el-radio label="">全部案件</el-radio>
          <el-radio label="1">已超时</el-radio>
          <el-radio label="0">未超时</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item class="alert-list-search-form-list-item">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import treeSelect from '@/components/alertManage/tree-select.vue';
import { getDeptTree, getKeyWordDeptInfo } from '@/api/alarmCommand';
import { alarmTypes } from '@/components/alarm-command/alarmListConstant';

export default {
  name: 'AlertListSearchForm',
  data() {
    return {
      form: {
        alarmLevel: '',
        alertCategory: '',
        disposePerson: '',
        focus: '',
        keyword: '',
        state: '',
        takeAlarmDeptCodes: [],
        time: [],
        overTime: ''
      },
      alarmTypeOptions: alarmTypes,
      treeData: [],
      createDepartmentsList: [],
      createDepartmentsLabels: [],
      createDepartments: [],
      existsChildList: [],
      treeLazy: true
    };
  },
  components: {
    treeSelect
  },
  methods: {
    async getCreateDepartments(deptIndexCode = 'd1') {
      const { data } = await getDeptTree(deptIndexCode);
      this.createDepartmentsList = data;
      const len = this.createDepartments.length || 0;
      const createDepartmentsTemp = this.createDepartments.concat();
      for (let i = 0; i < len; i++) {
        this.createDepartmentsList.forEach(item => {
          if (item.deptIndexCode === this.createDepartments[i]) {
            this.createDepartmentsLabels.push(item);
            createDepartmentsTemp.splice(i, 1);
          }
        });
      }
      this.createDepartments = createDepartmentsTemp.concat();
      if (this.createDepartments.length) {
        this.createDepartmentsList.forEach(item => {
          if (item.existsChild && item.parentIndexCode !== 'd1') {
            this.existsChildList.push(item);
          }
        });
        if (this.existsChildList.length) {
          this.getCreateDepartments(this.existsChildList[0].deptIndexCode);
          this.existsChildList.splice(0, 1);
        }
      } else {
        return this.createDepartmentsLabels;
      }
    },
    async loadNode(node, resolve) {
      const { data } = await getDeptTree(
        node.level === 0 ? 'd1' : node.data.deptIndexCode
      );
      resolve(data);
    },
    search() {
      this.$emit('searchList', this.form);
    },
    reset() {
      this.$set(this, 'form', {
        alarmLevel: '',
        alertCategory: '',
        disposePerson: '',
        focus: '',
        keyword: '',
        state: '',
        takeAlarmDeptCodes: [],
        time: [],
        overTime: '0'
      });
    },
    async handleSearchTree(searchWords) {
      const { data } = await getKeyWordDeptInfo({ keyword: searchWords });
      this.treeLazy = false;
      this.treeData = data;
    },
    async handleClearSearchResult() {
      this.treeLazy = true;
      const { data } = await getDeptTree('d1');
      this.treeData = data;
    }
  }
};
</script>

<style lang="scss" scoped>
.alert-list-search-form {
  width: 100%;
  height: 166px;
  padding-top: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid #eee;
  &-list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-around;
    &-item {
      width: 18%;
      margin-top: -4px;
      &-radioGroup {
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
      &:last-child {
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
    }
  }
}
</style>