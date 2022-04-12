<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-03-30 13:47:06
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-04-06 09:58:02
-->
<template>
  <div class="alert-manage-detail">
    <div class="alert-manage-detail-left">
      <alert-detail :alertMes="alertMes"></alert-detail>
    </div>
    <div class="alert-manage-detail-middle">
      <div class="alert-manage-detail-middle-top">
        <feed-back :alertMes="alertMes"></feed-back>
      </div>
      <div class="alert-manage-detail-middle-bottom">
        <alarm-person :alertMes="alertMes"></alarm-person>
      </div>
    </div>
    <div class="alert-manage-detail-right">
      <step-routine :alertMes="alertMes"></step-routine>
    </div>
  </div>
</template>

<script>
import { getAlertDetail } from '@/api/alertHistory.js';
import AlertDetail from '@/components/alertManage/detail/alertDetail';
import FeedBack from '@/components/alertManage/detail/feedBack';
import AlarmPerson from '@/components/alertManage/detail/alarmPerson';
import StepRoutine from '@/components/alertManage/detail/stepRoutine';
export default {
  name: 'AlertManageDetail',
  mounted() {
    this.init();
  },
  data() {
    return {
      alertMes: {}
    };
  },
  components: {
    AlertDetail,
    FeedBack,
    AlarmPerson,
    StepRoutine
  },
  methods: {
    init() {
      getAlertDetail({ id: this.$route.params.id }).then(({ data }) => {
        this.$set(this, 'alertMes', data);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.alert-manage-detail {
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
  background: #f5f5f5;
  &-left {
    width: 22%;
    height: 96%;
    box-shadow: 0 1px 2px 0 rgba(20, 106, 212, 0.05);
    border-radius: 4px;
    margin: 16px;
    background: white;
  }
  &-middle {
    width: 52%;
    height: 96%;
    margin: 16px 0 16px;
    &-top {
      width: 100%;
      height: 52%;
      margin-bottom: 1%;
      box-shadow: 0 1px 2px 0 rgba(20, 106, 212, 0.05);
      border-radius: 4px;
      background: white;
    }
    &-bottom {
      width: 100%;
      height: 47%;
      box-shadow: 0 1px 2px 0 rgba(20, 106, 212, 0.05);
      border-radius: 4px;
      background: white;
    }
  }
  &-right {
    width: 22%;
    height: 96%;
    box-shadow: 0 1px 2px 0 rgba(20, 106, 212, 0.05);
    border-radius: 4px;
    margin: 16px;
    background: white;
  }
}
</style>
