<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-02-23 14:55:44
 * @LastEditors: caokeke
 * @LastEditTime: 2021-04-28 14:20:22
-->
<template>
  <div class="alert-list">
    <!-- <alert-list-header></alert-list-header> -->
    <alert-list-search-form @searchList="searchList"></alert-list-search-form>
    <div class="alert-list-pane">
      <el-scrollbar wrap-class="alert-list-pane-items-scrollbar-wrap">
        <div class="alert-list-pane-items">
          <alert-list-item
            v-for="(item, index) in listArr"
            :itemData="item"
            :key="index"
            @click.native="goToDetail(item, index)"
            @addFocus="addFocus"
            style="
              display: inline-block;
              margin-right: 30px;
              margin-bottom: 10px;
              vertical-align: top;
            "
          ></alert-list-item>
        </div>
      </el-scrollbar>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.pageNo"
        :page-sizes="[20, 30, 50]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
        style="padding: 0 6px 0; border-top: 1px solid #eee"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
// import AlertListHeader from '@/components/alertManage/alertListHeader';
import AlertListSearchForm from '@/components/alertManage/alertListSearchForm';
import AlertListItem from '@/components/alertManage/alertListItem';
import {
  getAlarmList,
  updateAlertFocus,
  updateReadType
} from '@/api/alarmCommand';
import moment from 'moment';

export default {
  name: 'AlertManage',
  data() {
    return {
      page: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      listArr: [],
      formData: {
        alarmLevel: '',
        alertCategory: '',
        disposePerson: '',
        focus: '',
        keyword: '',
        state: '',
        takeAlarmDeptCode: '',
        time: [],
        overTime: 0
      }
    };
  },
  components: {
    // AlertListHeader,
    AlertListSearchForm,
    AlertListItem
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.page.pageNo = 1;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.page.pageNo = val;
      this.fetchData();
    },
    searchList(formData) {
      this.$set(this, 'formData', formData);
      this.fetchData();
    },
    fetchData() {
      getAlarmList({
        ...this.formData,
        startTime:
          moment(this.formData.time && this.formData.time[0]).format(
            'YYYY-MM-DD 00:00:00'
          ) || '',
        endTime:
          moment(this.formData.time && this.formData.time[1]).format(
            'YYYY-MM-DD 23:59:59'
          ) || '',
        historyAlert: true,
        ...this.page
      }).then(({ data }) => {
        this.page.total = data.total;
        this.listArr = data.list;
      });
    },
    goToDetail(item, index) {
      this.$set(this.listArr[index], 'readType', 1);
      updateReadType({ readType: 1, alarmNo: this.listArr[index].alarmNo });
      const ip = top.location.hostname;
      const protocol = top.location.protocol;
      const port = top.location.port;
      const url =
        protocol +
        '//' +
        ip +
        ':' +
        port +
        '/dzavc/#/alertManage/detail/' +
        item.id;
      if (top === window) {
        window.open(url);
        return false;
      }
      const param = {
        componentId: '',
        componentMenuId: '',
        param: '',
        url: url,
        name: '警情详情',
        callback: {
          func: '',
          param: {}
        },
        reload: true
      };
      top.window.goToApp(param);
    },
    addFocus(params) {
      updateAlertFocus(params).then(data => {
        this.$message.success(`${params.focus ? '关注' : '取消关注'}成功！`);
        this.fetchData();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.alert-list {
  width: 100%;
  height: 100%;
  overflow: hidden;
  &-pane {
    width: 100%;
    height: calc(100% - 170px);
    &-items {
      width: 90%;
      height: calc(99% - 20px);
      margin: 0 auto;
    }
  }
}
</style>
<style lang="scss">
.alert-list-pane-items-scrollbar-wrap {
  position: relative;
  padding: 25px 0 25px 16px;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}
.alert-list .el-scrollbar {
  height: 93%;
}
</style>
