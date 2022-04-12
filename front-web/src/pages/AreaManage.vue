<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-03-15 09:32:37
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-03-26 15:47:09
-->
<template>
  <div class="area-manage">
    <div class="area-manage-dept">
      <div class="area-manage-dept-title">部门列表</div>
      <!-- 列表式<div class="area-manage-dept-list">
        <div
          class="area-manage-dept-list-item"
          v-for="(item, index) in deptList"
          @click="changeDept(item, index)"
          :class="index === activeIndex ? 'active' : ''"
        >
          {{ item.name }}
        </div>
      </div> -->
      <dept-tree
        @departmentChange="departmentChange"
        @breadCrimbsData="handleBreadCrimbsData"
      ></dept-tree>
    </div>
    <div class="area-manage-rightPane">
      <div class="area-manage-rightPane-title">
        {{ breadCrimbsData.join('-') }}
      </div>
      <div class="area-manage-rightPane-alarm">
        <area-alarm-scope :deptMes="deptMes"></area-alarm-scope>
      </div>
      <div class="area-manage-rightPane-map">
        <area-map-scope :deptMes="deptMes"></area-map-scope>
      </div>
    </div>
  </div>
</template>

<script>
import AreaAlarmScope from '@/components/area-manage/AreaAlarmScope';
import AreaMapScope from '@/components/area-manage/AreaMapScope';
import DeptTree from '@/components/area-manage/DeptTree';
// import { getDeptTree } from '@/api/alarmCommand';
export default {
  name: 'AreaManage',
  components: {
    AreaAlarmScope,
    AreaMapScope,
    DeptTree
  },
  data() {
    return {
      // deptList: [],
      activeIndex: 0,
      deptMes: {},
      breadCrimbsData: []
    };
  },
  methods: {
    // async initList() {
    //   const { data } = await getDeptTree({ deptId: 'd1' });
    //   this.deptList = data;
    // },
    // changeDept(item, index) {
    //   this.activeIndex = index;
    // },
    departmentChange(data) {
      this.$set(this, 'deptMes', data);
    },
    handleBreadCrimbsData(data) {
      data = data.map(item => item.name);
      this.$set(this, 'breadCrimbsData', data);
    }
  }
};
</script>

<style lang="scss" scoped>
.area-manage {
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
  &-dept {
    width: 11%;
    height: 100%;
    background: white;
    text-align: center;
    box-shadow: 1px 0 0 0 #e3e4e6;
    &-title {
      width: 100%;
      height: 56px;
      font-size: 14px;
      color: #454546;
      line-height: 56px;
      font-weight: bold;
    }
    &-list {
      width: 100%;
      height: calc(100% - 56px);
      overflow-y: auto;
      &-item {
        width: 95%;
        height: 44px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.7);
        line-height: 44px;
        margin: 2px auto;
        cursor: pointer;
        &:hover {
          background: #eaf4ff;
          color: #2080f7;
        }
        &.active {
          background: #eaf4ff;
          color: #2080f7;
        }
      }
    }
  }
  &-rightPane {
    width: 89%;
    height: 100%;
    &-title {
      display: flex;
      align-items: center;
      width: 100%;
      height: 4%;
      padding-left: 30px;
      border-bottom: 1px solid #eee;
      margin-bottom: 0.5%;
      font-weight: bold;
    }
    &-alarm {
      margin: auto;
      width: 97.9%;
      height: 18%;
    }
    &-map {
      width: 97.9%;
      height: 75%;
      margin: 0 auto 1%;
    }
  }
}
</style>