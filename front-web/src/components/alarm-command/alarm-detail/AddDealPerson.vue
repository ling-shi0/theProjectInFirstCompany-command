<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-03-05 09:41:26
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-05-31 19:31:53
-->
<template>
  <el-dialog
    title="添加人员"
    :visible.sync="dialogAddPersonVisible"
    :area="[525, 255]"
    class="inner-pane"
  >
    <el-autocomplete
      class="inline-input"
      v-model="selectName"
      :fetch-suggestions="querySearch"
      :clear-icon-click="clearSearch"
      placeholder="请输入搜索警力名称"
      @visible="checkDealPerson"
      kind="surface"
      ref="state1"
    >
      <i slot="suffix" class="el-input__icon h-icon-search"></i>
    </el-autocomplete>
    <!-- <div class="inner-pane">
      <el-select
        v-model="selectName"
        filterable
        remote
        placeholder="请输入搜索警力名称"
        :remote-method="querySearch"
        @on-scrolling-y="newNameListFetch"
        clear
        @focus="focus"
        style="width: 70%"
      >
        <el-option
          v-for="(item, index) in namelist"
          :key="index"
          :label="item.policeRealName"
          :value="item.policeRealName"
          @click.native="checkDealPerson(item)"
        ></el-option>
      </el-select>
    </div> -->
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="addDealPerson(checkObj.userIndexCode)">
        确定
      </el-button>
      <el-button @click="closeDialog">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getAddDealPoliceMes } from '@/api/alarmCommand';
export default {
  name: 'AddDealPerson',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    alarmMes: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      // dialogAddPersonVisible: false,
      selectName: '',
      namelist: [],
      page: {
        pageNo: 1,
        pageSize: 20
      },
      waitTimer: false,
      nameListTempStr: '',
      checkObj: {},
      first: false
    };
  },
  mounted() {
    // this.querySearch(this.nameListTempStr);
  },
  computed: {
    dialogAddPersonVisible: {
      get: function () {
        return this.visible;
      },
      set: function (visible) {
        this.$emit('update:visible', visible);
      }
    }
  },
  // watch: {
  //   visible(val) {
  //     !val && (this.selectName = '');
  //     this.dialogAddPersonVisible = val;
  //   }
  // },
  methods: {
    checkDealPerson(item) {
      debugger;
      const arr = this.namelist.filter(
        obj => obj.policeRealName === this.selectName
      );
      this.$set(this, 'checkObj', arr[0]);
    },
    addDealPerson(policeUserIds) {
      this.bus.$emit('saveAndAddNewDealPeople', policeUserIds);
      this.selectName = '';
    },
    closeDialog() {
      this.selectName = '';
      this.dialogAddPersonVisible = false;
      // this.$emit('changeVisible', false);
    },
    querySearch(str, cb) {
      this.nameListTempStr = str;
      this.page.pageNo = 1;
      getAddDealPoliceMes({
        keyWord: str,
        // deptCode: this.alarmMes.takeAlarmDeptCode,
        ...this.page,
        visual: '1',
        containSub: true
      })
        .then(({ data }) => {
          this.namelist = data.list;
          this.namelist.forEach(element => {
            element.value = element.policeRealName;
          });
          cb(this.namelist);
          this.waitTimer = false;
        })
        .catch(err => {
          this.$message.error(err);
          this.waitTimer = false;
        });
    },
    newNameListFetch({ scrollTop, percentY }) {
      if (percentY > 0.9 && !this.waitTimer) {
        this.page.pageNo += 1;
        this.waitTimer = true;
        getAddDealPoliceMes({
          keyWord: this.nameListTempStr,
          deptCode: this.alarmMes.takeAlarmDeptCode,
          ...this.page,
          visual: '1'
        })
          .then(res => {
            this.namelist = this.namelist.concat(res.data.list);
            this.waitTimer = false;
          })
          .catch(err => {
            this.$message.error(err);
            this.waitTimer = false;
          });
      }
    },
    focus() {
      this.querySearch(this.nameListTempStr);
    },
    handleSelect(item) {
      console.log(item);
    },
    clearSearch() {
      console.log(1);
    }
  }
};
</script>

<style lang="scss">
.inner-pane {
  // width: 500px;
  // height: 130px;
  // display: flex;
  // align-items: center;
  // justify-content: center;
  .el-input {
    width: 60%;
    margin-left: 20%;
  }
  .el-input--surface .el-input__inner {
    border: 1px solid #e3e3e3;
    /* width: 75%; */
    background-color: #fff;
  }
}
</style>
