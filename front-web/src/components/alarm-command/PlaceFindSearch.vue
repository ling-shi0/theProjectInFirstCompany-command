<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-02-25 11:33:48
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-05-12 19:38:54
-->
<template>
  <div class="place-find-search">
    <div class="place-find-search-dropDown">
      <el-dropdown
        placement="bottom"
        class="place-find-search-dropDown-but"
        trigger="click"
        @command="handleDropDownChange"
      >
        <el-button type="iconButton">
          {{ dropDownValue }}
          <i class="h-icon-angle_down_sm el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="地点">地点</el-dropdown-item>
          <el-dropdown-item command="警力">警力</el-dropdown-item>
          <el-dropdown-item command="点位">点位</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="place-find-search-divider"></div>
    <div class="place-find-search-autoComplete">
      <el-select
        v-model="searchResult"
        filterable
        remote
        placeholder="请输入搜索关键字"
        :remote-method="querySearch"
        @on-scrolling-y="newNameListFetch"
        clear
      >
        <el-option
          v-for="(item, index) in namelist"
          :key="index"
          :label="getLabelName(item)"
          :value="getLabelName(item)"
          @click.native="getCheckName(item)"
        ></el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
import {
  getPlaceSearch,
  getAddDealPoliceMes,
  getPointMes,
  getPolice,
  positionPolice
} from '@/api/alarmCommand';
export default {
  name: 'PlaceFindSearch',
  data() {
    return {
      searchResult: '',
      dropDownValue: '地点',
      page: {
        pageNo: 1,
        pageSize: 20
      },
      namelist: [],
      functionMap: {
        地点: getPlaceSearch,
        警力: getAddDealPoliceMes,
        点位: getPointMes
      },
      waitTimer: false,
      nameListTempStr: '',
      deptIndexCode: ''
    };
  },
  async mounted() {
    const { data } = await getPolice();
    this.deptIndexCode = data[0].deptIndexCode;
  },
  methods: {
    querySearch(str) {
      this.nameListTempStr = str;
      if (!this.nameListTempStr) {
        return;
      }
      this.page.pageNo = 1;
      this.functionMap[this.dropDownValue]({
        keyWord: str,
        ...this.page,
        deptCode: this.deptIndexCode,
        visual: '1',
        containSub: this.dropDownValue === '警力'
      })
        .then(({ data }) => {
          this.namelist = data.list;
          this.waitTimer = false;
        })
        .catch(err => {
          this.$message.error(err);
          this.waitTimer = false;
        });
    },
    handleDropDownChange(command) {
      this.dropDownValue = command;
      this.namelist = [];
    },
    newNameListFetch({ scrollTop, percentY }) {
      if (percentY > 0.9 && !this.waitTimer) {
        this.page.pageNo += 1;
        this.waitTimer = true;
        this.functionMap[this.dropDownValue]({
          keyWord: this.nameListTempStr,
          ...this.page,
          visual: '1',
          deptCode: this.deptIndexCode,
          containSub: this.dropDownValue === '警力'
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
    getCheckName(item) {
      let typeMap = {
        地点: 'searchPosition',
        警力: 'searchPolice',
        点位: { AR: 'searchARPoint', CAMERA: 'searchPoint' }
      };
      if (this.dropDownValue === '警力') {
        positionPolice(item.userIndexCode).then(({ data }) => {
          this.bus.$emit('mapSearchMes', {
            ...item,
            ...data,
            type: typeMap[this.dropDownValue]
          });
          typeMap = null;
        });
      } else {
        this.bus.$emit('mapSearchMes', {
          ...item,
          type:
            this.dropDownValue === '点位'
              ? typeMap[this.dropDownValue][item.resourceType]
              : typeMap[this.dropDownValue]
        });
        typeMap = null;
      }
    },
    getLabelName(item) {
      let name = '';
      switch (this.dropDownValue) {
        case '地点': {
          name = item.name;
          break;
        }
        case '警力': {
          name = item.policeRealName;
          break;
        }
        case '点位': {
          name = item.nameStr;
          break;
        }
      }
      return name;
    }
  }
};
</script>

<style lang="scss" scoped>
.place-find-search {
  width: 321px;
  height: 36px;
  background: white;
  border-radius: 2px;
  display: flex;
  align-items: center;
  pointer-events: auto;
  &-dropDown {
    width: 96px;
    height: 36px;
    &-but {
      width: 100%;
      height: 100%;
      > button {
        height: 100%;
      }
    }
  }
  &-divider {
    width: 1px;
    border-left: 1px solid rgba(0, 0, 0, 0.12);
    height: 24px;
  }
  &-autoComplete {
    width: 225px;
    height: 36px;
    & div {
      height: 36px;
    }
  }
}
</style>
<style lang="scss">
.place-find-search-autoComplete {
  & input {
    height: 36px;
    background: white !important;
    border: none !important;
  }
}
</style>