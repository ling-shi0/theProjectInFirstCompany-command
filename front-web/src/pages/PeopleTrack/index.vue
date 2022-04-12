<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: caokeke
 * @Date: 2021-04-01 10:42:17
 * @LastEditors: caokeke
 * @LastEditTime: 2021-04-13 16:51:40
-->
<template>
  <!-- <page-container> -->
  <div class="orbit">
    <orbit-map></orbit-map>
    <orbit-list></orbit-list>

    <orbit-play></orbit-play>
    <!--<el-tabs v-model="activeName" @tab-click="handleClick">-->
    <!--<el-tab-pane label="人脸布控" name="1">-->
    <!--<sub-panel v-if="activeName == '1' || iface_isload" :activeName="1"></sub-panel>-->
    <!--</el-tab-pane>-->
    <!--<el-tab-pane label="车辆布控" name="2">-->
    <!--<sub-panel v-if="activeName == '2' || ivehicle_isload" :activeName="2"></sub-panel>-->
    <!--</el-tab-pane>-->
    <!--<el-tab-pane label="MAC布控" name="3">-->
    <!--<sub-panel v-if="activeName == '3' || iwifi_isload" :activeName="3"></sub-panel>-->
    <!--</el-tab-pane>-->
    <!--</el-tabs>-->
  </div>
  <!-- </page-container> -->
</template>

<script>
import OrbitMap from './map';
import OrbitList from './trackDataList';
import OrbitPlay from './play';
export default {
  name: 'orbit',
  data() {
    return {
      activeName: '1',
      iface_isload: true,
      ivehicle_isload: false,
      iwifi_isload: false
    };
  },
  components: {
    OrbitMap,
    OrbitList,
    OrbitPlay
  },
  created() {},
  mounted() {
    debugger;
  },
  computed: {},
  methods: {
    handleClick() {
      if (this.activeName == '2') {
        this.ivehicle_isload = true;
      } else if (this.activeName == '3') {
        this.iwifi_isload = true;
      }
    }
  }
};
</script>

<style lang="less">
.orbit {
  height: 100%;
  position: relative;
  .el-tabs--top .el-tabs__nav-wrap.is-scrollable {
    padding: 0 18px;
  }
  .el-checkbox-group {
    margin-top: -12px;
    margin-left: 12px;
  }
  .el-checkbox {
    /* color: #4d4d4d; */
    line-height: 24px;
    margin-top: 4px;
  }
  .el-checkbox__inner {
    /*z-index: 9999;*/
    background: rgba(18, 83, 137, 0.3);
    color: #10c6ff;
    border: solid 1px #10c6ff;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner {
    border-color: #10c6ff;
  }
  .el-checkbox__label {
    color: #c0e1ff;
    font-size: 12px;
    margin-bottom: -4px;
  }
}
</style>
