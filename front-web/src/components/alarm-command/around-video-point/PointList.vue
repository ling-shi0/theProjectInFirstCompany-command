<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-03-09 16:11:21
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-05-13 14:42:14
-->
<template>
  <div class="point-list" v-if="ponitListVisible">
    <div class="point-list-tabs">
      <div
        class="point-list-tabs-tab"
        v-for="(item, key) in tabIcons"
        :class="item.tabActiveStatus ? 'active' : ''"
        :key="key"
      >
        <tab-item
          v-if="item.normal"
          :tabItemData="item"
          :tabActiveFlag="item.tabActiveStatus"
          @clickTabitem="changeTab(item, key)"
        ></tab-item>
        <i v-else @click="changeTab(item, key)">{{ item.showName }}</i>
      </div>
    </div>
    <div class="point-list-pane">
      <div class="point-list-pane-title">
        {{ listTitle + '(' + (arrLength || 0) + ')' }}
        <i class="h-icon-close" @click="closePointList"></i>
      </div>
      <div class="point-list-pane-items">
        <div
          class="point-list-pane-items-item"
          v-for="(item, index) in pointListArr"
          :key="index"
          v-if="item.resourceType === activeKey || activeKey === 'ALL'"
        >
          <div class="point-list-pane-items-item-title">
            <div
              class="point-list-pane-items-item-title-distance"
              v-if="showDistance"
            >
              {{ item.distance || 0 }}m
            </div>
            <i
              class="point-list-pane-items-item-title-note"
              v-if="item.resourceType === 'device'"
            >
              <img src="@/assets/images/alarmCommand/noteWhite.png" />
            </i>
            <i
              class="point-list-pane-items-item-title-AR"
              v-if="item.resourceType === 'AR'"
            >
              AR
            </i>
            <div
              class="point-list-pane-items-item-title-name"
              :title="item.nameStr || item.name"
            >
              {{ item.nameStr || item.name }}
            </div>
          </div>
          <div
            v-if="item.resourceType === 'AR'"
            class="point-list-pane-items-item-Arbut"
          >
            <el-button
              type="default"
              @click="openArPage(item)"
              style="width: 100%; height: 100%"
            >
              切换AR视角
            </el-button>
          </div>
          <div v-else>
            <screen-switch-radio
              :screenListArr="screenListArr"
              :index="index"
              @changeActiveNo="changeActiveNo"
            ></screen-switch-radio>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { tabIcons } from '@/components/alarm-command/alarmListConstant';
import { queryAroundDevice } from '@/api/aroundVideo.js';
import ScreenSwitchRadio from './ScreenSwitchRadio';
import { mapState } from 'vuex';

Vue.component('tab-item', {
  template: `
    <i 
      @mouseenter="tabMouseEnter" 
      @mouseleave="tabMouseLeave" 
      @click="handleTabClick" 
      style="width: 100%;height: 100%;line-height: 50px;text-align: center"
    >
      <img :src="imgSrc" />
    </i>`,
  watch: {
    tabActiveFlag(val) {
      if (!val) {
        this.imgSrc = this.tabItemData.normal;
        this.clickFlag = false;
      } else {
        this.imgSrc = this.tabItemData.hover;
        this.clickFlag = true;
      }
    }
  },
  methods: {
    tabMouseEnter() {
      this.imgSrc = this.tabItemData.hover;
    },
    tabMouseLeave() {
      !this.clickFlag && (this.imgSrc = this.tabItemData.normal);
    },
    handleTabClick() {
      this.$emit('clickTabitem');
    }
  },
  props: ['tabItemData', 'tabActiveFlag'],
  data() {
    return {
      imgSrc: '',
      clickFlag: false
    };
  },
  mounted() {
    this.imgSrc = this.tabItemData.normal;
  }
});

export default {
  name: 'PointList',
  data() {
    return {
      tabIcons,
      listTitle: ' 全部点位列表',
      lastActiveTab: 'ALL',
      total: 0,
      pointListArr: [],
      ponitListVisible: false,
      page: {
        pageNo: 1,
        pageSize: 500000
      },
      scrollTimer: null,
      showDistance: false,
      screenListArr: [0, 1, 2, 3], // 数组的index代表屏幕的序号，数组每一位的值代表数据数组的第几个,如果值是-1就代表没有这个
      activeKey: 'ALL',
      arrLength: 0
    };
  },
  components: {
    ScreenSwitchRadio
  },
  props: {
    visible: {
      type: Boolean,
      default: () => {}
    },
    distance: {
      type: [Number, String],
      default: 0
    },
    popVideoShow: {
      type: [Object, Array],
      default: () => {}
    }
  },
  watch: {
    visible(val) {
      this.ponitListVisible = val;
      if (this.showDistance) {
        val && this.fetchPointList();
        val && this.changeTab(this.tabIcons['ALL'], 'ALL');
      }
    },
    screenListArr(val) {
      let newVideoList = [];
      val.forEach(item => {
        if (item !== -1) {
          newVideoList.push(this.pointListArr[item]);
        } else {
          newVideoList.push({});
        }
      });
      this.bus.$emit('pointListToVideoList', newVideoList);
      newVideoList = null;
    },
    distance() {
      this.changeTab(this.tabIcons['ALL'], 'ALL');
      this.visible && this.fetchPointList();
    },
    alarmMesStatus() {
      this.changeTab(this.tabIcons['ALL'], 'ALL');
      this.visible && this.fetchPointList();
    },
    popVideoShow(data) {
      this.changeTab(this.tabIcons['ALL'], 'ALL');
      if (data instanceof Array) {
        this.pointListArr = data;
      } else {
        this.pointListArr = [data.markerData || data];
      }
      this.showDistance = false;
      this.$set(this, 'screenListArr', [0, -1, -1, -1]);
    },
    pointListArr(val) {
      this.arrLength =
        val &&
        val.filter(
          item =>
            this.activeKey === 'ALL' || item.resourceType === this.activeKey
        ).length;
    }
  },
  computed: {
    ...mapState(['alarmMesStatus'])
  },
  methods: {
    openArPage(item) {
      debugger;
      const { href } = this.$router.resolve({
        path: '/alarm/ar',
        query: {
          indexCode: item.indexCode
        }
      });
      window.open(href, '_blank');
    },
    changeTab(item, key) {
      if (key === this.lastActiveTab) {
        return;
      }
      this.listTitle = item.title;
      let tempTabIcons = this.tabIcons;
      tempTabIcons[this.lastActiveTab].tabActiveStatus = false;
      tempTabIcons[key].tabActiveStatus = true;
      this.$set(this, 'tabIcons', tempTabIcons);
      this.lastActiveTab = key;
      tempTabIcons = null;
      this.activeKey = key;
      this.$set(this, 'screenListArr', this.makeInitScreenArr());
      this.arrLength =
        this.pointListArr &&
        this.pointListArr.filter(
          item =>
            this.activeKey === 'ALL' || item.resourceType === this.activeKey
        ).length;
    },
    fetchPointList(addFlag) {
      this.showDistance = true;
      this.activeKey = 'ALL';
      queryAroundDevice({
        alarmNo: this.alarmMesStatus.alarmNo,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        radius: this.distance
      }).then(({ data }) => {
        !addFlag && this.$set(this, 'pointListArr', data);
        // addFlag &&
        //   this.$set(this, 'pointListArr', this.pointListArr.concat(data));
        // this.scrollTimer = false;
        this.$set(this, 'screenListArr', this.makeInitScreenArr());
      });
    },
    closePointList() {
      this.ponitListVisible = false;
      this.$emit('closePointList');
    },
    changeActiveNo({ index, val, lastIndex }) {
      // const tempArr = this.screenListArr;
      // tempArr[lastIndex - 1] = -1;
      // tempArr[val - 1] = index;
      // this.$set(this, 'screenListArr', tempArr);
      // this.screenListArr = tempArr;
      this.$set(this.screenListArr, lastIndex - 1, -1);
      this.$set(this.screenListArr, val - 1, index);
    },
    makeInitScreenArr() {
      const makeArr = [];
      if (this.pointListArr) {
        for (let i = 0; i < this.pointListArr.length; i++) {
          if (makeArr.length > 4) break;
          if (
            this.pointListArr[i].resourceType !== 'AR' &&
            (this.activeKey === 'ALL' ||
              this.pointListArr[i].resourceType === this.activeKey)
          ) {
            makeArr.push(i);
          }
        }
      }
      return makeArr;
    }
    // handleScroll(e) {
    //   if (this.scrollTimer) {
    //     return;
    //   }
    //   if (
    //     e.srcElement.scrollTop + e.srcElement.offsetHeight >
    //     e.srcElement.scrollHeight - 100
    //   ) {
    //     this.scrollTimer = true;
    //     this.page.pageNo++;
    //     this.fetchPointList(true);
    //   }
    // }
  },
  mounted() {
    this.ponitListVisible = this.visible;
    this.bus.$on('goToArPage', data => {
      this.openArPage(data);
    });
  }
};
</script>

<style lang="scss" scoped>
.point-list {
  width: 100%;
  height: 100%;
  display: flex;
  &-tabs {
    width: 44px;
    height: 185px;
    &-tab {
      width: 100%;
      height: 44px;
      pointer-events: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-family: PingFangSC-Semibold;
      font-style: normal;
      color: rgba(32, 128, 247, 0.3);
      border-radius: 2px 0 0 0;
      cursor: pointer;
      margin-bottom: 2px;
      background: rgba(248, 250, 255, 0.8);
      position: relative;
      &:hover {
        background: #ffffff;
        color: #2080f7;
      }
      &.active {
        background: #ffffff;
        color: #2080f7;
        box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
        border-radius: 0 2px 2px 2px;
        &::after {
          content: '';
          position: absolute;
          width: 10px;
          height: 44px;
          background: white;
          top: 0;
          left: 40px;
        }
      }
      > i {
        width: 100%;
        height: 100%;
        line-height: 50px;
        text-align: center;
        font-style: normal;
      }
    }
  }
  &-pane {
    width: 206px;
    height: 100%;
    background: white;
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
    border-radius: 0 2px 2px 2px;
    pointer-events: auto;
    &-title {
      width: 100%;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 6px;
      font-weight: bold;
      > i {
        font-size: 1.5rem;
        cursor: pointer;
      }
    }
    &-items {
      height: calc(100% - 44px);
      width: 100%;
      overflow-y: auto;
      &-item {
        width: 92%;
        height: 68px;
        margin: 1px auto 8px;
        padding-top: 6px;
        background-image: linear-gradient(
          180deg,
          #e0efff 71%,
          rgba(219, 236, 255, 0.57) 100%
        );
        box-shadow: 0 -1px 0 0 #87c1ff;
        border-radius: 2px;
        &-title {
          width: 100%;
          height: 24px;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          &-distance {
            width: 52px;
            height: 24px;
            background-image: linear-gradient(90deg, #7182c5 100%, #7182c5 0%);
            border-radius: 2px;
            color: white;
            margin-left: 6px;
            margin-right: 4px;
            text-align: center;
          }
          &-note {
            width: 24px;
            height: 24px;
            background: #75c37f;
            border-radius: 2px;
            text-align: center;
            line-height: 24px;
          }
          &-AR {
            width: 28px;
            height: 24px;
            background: #ff7900;
            border-radius: 2px;
            color: white;
            text-align: center;
            line-height: 24px;
          }
          &-name {
            flex: 1;
            text-indent: 6px;
            @include utils-ellipsis();
          }
        }
        &-Arbut {
          width: 179px;
          height: 24px;
          margin: -6px auto 0;
        }
      }
    }
  }
}
</style>
