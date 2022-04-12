<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-02-22 10:22:01
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-03-29 18:51:38
-->
<template>
  <div class="alert-list-header">
    <department-select @departmentChange="departmentChange"></department-select>
  </div>
</template>

<script>
import DepartmentSelect from '@/components/alarm-command/alarm-list/DepartmentSelect';
export default {
  name: 'AlertListHeader',
  data() {
    return {};
  },
  components: {
    DepartmentSelect
  }
};
</script>

<style lang="scss" scoped>
.alert-list-header {
  width: 100%;
  height: 48px;
  border-bottom: 1px #f5f5f5 solid;
}
</style>