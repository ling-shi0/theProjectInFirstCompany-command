<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-03-15 09:54:52
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-05-14 14:03:51
-->
<template>
  <div class="area-map-scope">
    <div class="area-map-scope-title">
      部门地理范围
      <el-button icon="h-icon-edit" v-if="editFlag" @click="editStart">
        编辑
      </el-button>
      <el-button icon="h-icon-save" v-else @click="saveEdit">保存</el-button>
    </div>
    <div class="area-map-scope-bottomPane">
      <div class="area-map-scope-bottomPane-list" v-if="!editFlag">
        {{ cityName }}
        <!-- <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          class="area-map-scope-bottomPane-list-checkAll"
        >
          {{ deptMes.parentName || '全选' }}
          {{ '德州市' }}
        </el-checkbox> -->
        <div class="area-map-scope-bottomPane-list-items">
          <el-tree
            ref="areaTree"
            :data.sync="treeDataAsync"
            :props="treeProps"
            simple-data
            node-key="fid"
            :default-checked-keys="defaultCheckedKeys"
            parent-key="city"
            :load="loadNode"
            lazy
            @node-click="chooseNewDepartment"
          ></el-tree>
          <!-- <el-checkbox-group v-model="checkedArr" vertical>
            <el-checkbox
              v-for="area in areaArr"
              :label="area.fid"
              :key="area.fid"
            >
              {{ area.name }}
            </el-checkbox>
          </el-checkbox-group> -->
        </div>
        <el-button type="info" @click="handleDraw" style="width: 80%">
          手动绘制
        </el-button>
      </div>
      <div class="area-map-scope-bottomPane-map">
        <div class="area-map-scope-bottomPane-map-tip" v-if="recommendTipsShow">
          请确认辖区接警范围
          <div class="area-map-scope-bottomPane-map-tip-buts">
            <el-button type="default" @click="confineArea">确认</el-button>
            <el-button type="default" @click="artificialConfine">
              自定义
            </el-button>
          </div>
        </div>
        <MapRes
          :beginDraw="drawFlag"
          @drawFinish="drawFinish"
          @deleteWkts="deleteWkts"
          :drawWktPolygon="drawWktPolygon"
        ></MapRes>
      </div>
    </div>
  </div>
</template>

<script>
import MapRes from './map-select-res.vue';
import penIcon from '@/assets/images/map/pen.png';
import {
  getSubDeptInfo,
  findByAreaCode,
  recommendPlaceByDeptName,
  addJurisdiction,
  getDefaultArea
} from '@/api/areaManage';
export default {
  name: 'AreaMapScope',
  props: {
    deptMes: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    MapRes
  },
  data() {
    return {
      areaArr: [],
      isIndeterminate: false,
      checkedArr: [],
      checkAll: false,
      drawFlag: false,
      editFlag: true,
      treeDataAsync: [],
      treeProps: {
        label: 'name',
        children: 'deptExts'
      },
      defaultCheckedKeys: [],
      drawWktPolygon: [],
      recommendTipsShow: false,
      drawAreaWktArr: [],
      activeAreaCode: {},
      cityName: '',
      firstFindFlag: false
    };
  },
  mounted() {
    // getDefaultArea().then(({ data }) => {
    //   this.areaArr = data;
    // });
  },
  watch: {
    checkAll(val) {
      if (val) {
        this.checkedArr = this.areaArr.map(item => item.fid);
      } else {
        this.checkedArr = [];
      }
    },
    checkedArr(val) {
      // if (val.length === 0) {
      //   this.isIndeterminate = false;
      //   this.checkAll = false;
      // } else if (val.length === this.areaArr.length) {
      //   this.isIndeterminate = false;
      //   this.checkAll = true;
      // } else {
      //   this.isIndeterminate = true;
      // }
      this.drawArea(val);
    },
    deptMes(val) {
      this.checkedArr = [];
      this.$set(this, 'activeAreaCode', val);
      this.recommendTipsShow = false;
      this.editFlag && (this.firstFindFlag = false);
      this.getDeptList(val.element.name, val.element.deptIndexCode);
    }
  },
  methods: {
    async loadNode(node, resolve) {
      let deptId = '';
      if (!node.data.isLeaf && node.data.isLeaf === false) {
        deptId = node.data.county;
      }
      const { data } = await getDefaultArea({ county: deptId });
      this.cityName = data && data[0] && data[0].city;
      data.forEach(item => {
        item.isLeaf = this.firstFindFlag;
      });
      this.firstFindFlag = true;
      resolve(data);
    },
    handleDraw() {
      this.drawFlag = true;
      // const map = document.getElementsByClassName('map-container')[0]
      //   .firstElementChild;
      // map.style.cursor = `url(${penIcon}),auto`;
      this.$set(this, 'drawAreaWktArr', []);
    },
    getDeptList(name, deptIndexCode) {
      // this.$set(this, 'defaultCheckedKeys', [
      //   this.deptMes.element.deptIndexCode
      // ]);
      findByAreaCode([deptIndexCode]).then(mes => {
        if (mes.data[0] && mes.data[0].wkts.length) {
          this.$set(this, 'drawWktPolygon', {
            wkts: mes.data[0].wkts,
            name: mes.data[0].jurisdictionName
          });
          this.$set(this, 'drawAreaWktArr', []);
          this.editFlag = true;
        } else {
          recommendPlaceByDeptName({
            keyWord: name,
            superType: 'DISTRICT',
            subType: 'COUNTY_PG'
          }).then(({ data }) => {
            if (data && data.wkt) {
              this.$set(this, 'drawWktPolygon', {
                wkts: [data.wkt],
                name: data.county
              });
              this.$set(this, 'drawAreaWktArr', [data.wkt]);
              this.editFlag && (this.recommendTipsShow = true);
              this.editFlag = true;
            } else {
              this.$set(this, 'drawWktPolygon', {
                wkts: [],
                name: ''
              });
              this.$set(this, 'drawAreaWktArr', []);
              this.editFlag = false;
            }
          });
        }
      });
    },
    editStart() {
      if (!(this.activeAreaCode && this.activeAreaCode.element)) {
        this.$message.warning('请先勾选区域!');
        return;
      }
      this.firstFindFlag = false;
      this.editFlag = false;
      this.recommendTipsShow = false;
      this.$set(this, 'drawAreaWktArr', []);
    },
    saveEdit() {
      if (!this.drawAreaWktArr.length) {
        this.$message.warning('区域未进行编辑！');
        return;
      }
      addJurisdiction({
        areaCode: this.activeAreaCode.element.deptIndexCode,
        jurisdictionName: this.activeAreaCode.element.name,
        parentAreaCode: this.activeAreaCode.parentId,
        wkts: this.drawAreaWktArr.map(
          item => item.wkt || (item.wkts && item.wkts[0]) || item
        )
      }).then(() => {
        this.$message.success('保存成功');
        this.$set(this, 'drawAreaWktArr', []);
        this.bus.$emit('clearAreaWktArr');
        this.editFlag = true;
      });
    },
    drawArea(arr) {
      let drawArr = [];
      arr.forEach(item => {
        drawArr.push(item.wkt);
      });
      // let itemName = arr && arr[0] && arr[0].name
      this.$set(this, 'drawWktPolygon', {
        wkts: drawArr,
        name: this.activeAreaCode.element.name
      });
      this.$set(this, 'drawAreaWktArr', drawArr);
    },
    drawFinish(arr) {
      this.$set(this, 'drawAreaWktArr', arr);
      this.drawFlag = false;
    },
    deleteWkts(arr) {
      this.$set(this, 'drawAreaWktArr', arr);
    },
    chooseNewDepartment(element) {
      this.checkedArr.length = 0;
      this.checkedArr.push(element);
    },
    confineArea() {
      this.recommendTipsShow = false;
      this.saveEdit();
    },
    artificialConfine() {
      this.recommendTipsShow = false;
      this.editFlag = false;
      this.$set(this, 'drawAreaWktArr', []);
    }
  }
};
</script>

<style lang="scss" scoped>
.area-map-scope {
  width: 100%;
  height: 100%;
  &-title {
    text-indent: 12px;
    width: 98%;
    height: 40px;
    margin: 16px auto 8px;
    background: rgba(216, 216, 216, 0.2);
    font-size: 16px;
    line-height: 40px;
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
  &-bottomPane {
    width: 98%;
    height: calc(100% - 70px);
    margin: 0 auto;
    display: flex;
    &-list {
      width: 15.6%;
      height: 100%;
      margin-right: 1%;
      text-align: center;
      &-checkAll {
        display: block;
        margin: 16px 0 8px;
      }
      &-items {
        height: calc(100% - 90px);
        width: 100%;
        text-align: left;
        // text-indent: 8px;
        overflow-y: auto;
      }
    }
    &-map {
      flex: 1;
      height: 100%;
      position: relative;
      &-tip {
        width: 100%;
        height: 40px;
        line-height: 40px;
        position: absolute;
        z-index: 10000;
        color: white;
        text-align: center;
        background: rgb(32, 128, 247);
        &-buts {
          position: absolute;
          right: 10px;
          top: 0;
        }
      }
    }
  }
}
</style>