<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-03-04 15:39:02
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-04-02 10:01:21
-->
<template>
  <el-dialog
    title="历史报警记录"
    :visible.sync="dialogTableVisible"
    :area="[1310, 660]"
    @close="closeDialog"
  >
    <el-table :data="gridData" style="width: 100%; height: 100%">
      <el-table-column prop="alarmTime" label="报警时间"></el-table-column>
      <el-table-column prop="type" label="类型"></el-table-column>
      <el-table-column prop="alarmInfo" label="警情信息"></el-table-column>
      <el-table-column prop="address" label="报警地址"></el-table-column>
      <el-table-column prop="dept" label="管辖单位"></el-table-column>
      <el-table-column prop="feedback" label="反馈内容"></el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="downloadData">数据下载</el-button>
      <el-button @click="closeDialog">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  getHistoryAlertInfo,
  getDownloadHistoryList
} from '@/api/alarmCommand';
export default {
  name: 'HistoryAlarmRecord',
  data() {
    return {
      dialogTableVisible: false,
      gridData: []
    };
  },
  props: {
    historyAlarmRecordVisible: {
      type: Boolean,
      default: false
    },
    alarmMes: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    historyAlarmRecordVisible(val) {
      this.dialogTableVisible = val;
      if (val) {
        if (!this.alarmMes.alarmPersonPhone) {
          this.$message.warning('该人员无手机号');
          return;
        }
        this.initTableData();
      }
    }
  },
  methods: {
    downloadData() {
      getDownloadHistoryList({
        phoneNum: this.alarmMes.alarmPersonPhone,
        name: this.alarmMes.alarmPersonName,
        certNum: this.alarmMes.alarmPersonCertificateNumber
      });
    },
    async initTableData() {
      const { data } = await getHistoryAlertInfo(
        this.alarmMes.alarmPersonPhone
      );
      this.gridData = data || [];
    },
    closeDialog() {
      this.dialogTableVisible = false;
      this.$emit('closeHistoryDialog');
    }
  }
};
</script>

<style>
</style>
