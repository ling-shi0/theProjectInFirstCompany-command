<template>
  <div :id="markerId" :ref="markerId" class="label-icon">
    <div
      class="pop-window-wrap"
      v-if="showPopup"
      :class="{ 'police-boc-pop-up': labelType.labelName === '岗亭' }"
    >
      <div class="info-edit">
        <el-input
          ref="inputVal"
          class="info-edit-input"
          v-model="labelName"
          :placeholder="labelInputPlaceholder"
        ></el-input>
        <div class="add-police" v-if="labelType.labelName === '岗亭'">
          <span class="title">添加警力</span>
          <div class="police-info">
            <span
              class="add-btn h-icon-add"
              @click.stop="addPoliceToBox"
            ></span>
            <span
              class="police-info-item"
              v-for="(policeItem, index) in policeData"
              :key="index"
            >
              <div class="info">
                <span class="name" v-ellipsis>
                  {{ policeItem.policeRealName }}
                </span>
                <span class="code" v-ellipsis>{{ policeItem.policeNo }}</span>
              </div>
              <div
                class="close-icon h-icon-close_sm"
                @click.stop="deletPoliceFromBox(index)"
              ></div>
            </span>
          </div>
        </div>
        <div class="operator-btn">
          <el-button type="primary" @click="saveLabelMarker">确定</el-button>
          <el-button @click="triggleDisplayPopup">取消</el-button>
        </div>
      </div>

      <div class="info-search" v-if="showSearchPop">
        <div class="search-wrap">
          <el-input
            placeholder="请输入警员姓名或编号"
            suffix-icon="h-icon-search"
            v-model="policeNameOrCode"
            :on-icon-click="handleSearch"
            @keyup.enter.native="handleSearch"
            clearable
          ></el-input>
          <div class="search-result" v-if="actived && searchResultData.length">
            <div
              class="result-item"
              v-for="(item, indexcode) in searchResultData"
              :key="indexcode"
              @click.stop="addPolicePerson(item)"
              :class="{ disabled: policeExistence(item.id) }"
            >
              {{ item.policeRealName }}
            </div>
          </div>
          <div
            class="search-result empty"
            v-else-if="actived && !searchResultData.length"
          >
            暂无数据
          </div>
        </div>
      </div>
      <div
        class="info-close h-icon-close"
        v-if="showSearchPop"
        @click.stop="closePoliceSearchPop"
      ></div>
    </div>
    <div class="icon" >
      <img class="icon-img" :id="labelType.labelName==='岗亭'?'icon-img':''" :class="{'icon-img-active':showPopup}" @click.stop="triggleDisplayPopup" :src="labelType.picUrl"></img>
     <span
        class="area-name"
        v-if="!showPopup && labelType.labelName === '重点区域'"
        v-ellipsis
      >
        {{ labelType.placeLabelName }}
      </span>
      <i
        class="h-icon-close_sm delet-btn"
        @click.stop="clearLabelIconMarker"
      ></i>
    </div>

    <!-- <div
      class="icon"
      :class="{
        'icon-active': showPopup,
        'police-box': labelType.labelName === '岗亭',
        ktv: labelType.labelName === 'KTV',
        'internet-bar': labelType.labelName === '网吧',
        'housing-estate': labelType.labelName === '小区',
        'key-areas': labelType.labelName === '重点区域'
      }"
      @click.stop="triggleDisplayPopup"
    >
      <span
        class="area-name"
        v-if="!showPopup && labelType.labelName === '重点区域'"
        v-ellipsis
      >
        {{ labelType.placeLabelName }}
      </span>
      <i
        class="h-icon-close_sm delet-btn"
        @click.stop="clearLabelIconMarker"
      ></i>
    </div> -->
  </div>
</template>
<script>
import {
  addNewPlaceLabel,
  delPlaceLabel,
  modPlaceLabel,
  modPoliceInPlace,
  getCurPolicesInPlace
} from '@/api/placeLabelConfig';
import { getPoliceInfo } from '@/api/policeConfig';
import { queryPlaceLabel } from '@/api/placeLabelConfig';
export default {
  name: 'LabelIcon',
  props: {
    labelType: {
      type: Object,
      default: () => {}
    },
    mapUtil: {
      type: [Object, Array],
      default: null
    },
    markerId: {
      type: String,
      default: ''
    },
    polygonFeature: {
      type: [Object, Array],
      default: null
    },
    // 区域坐标wkt
    wkts: {
      type: Array,
      default: () => []
    },
    // 图形类型
    shapeType: {
      type: Number,
      default: 1
    },
    // 经纬度数组
    lonlatArr: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      showPopup: true,
      labelName: '',
      showSearchPop: false,
      policeData: [],
      policeNameOrCode: '',
      actived: false,
      searchResultData: []
    };
  },
  mounted() {
    this.$nextTick(() => {
      // 绑定mousewheel事件，阻止此事件的冒泡行为，防止弹框中的滚动条无法使用
      this.addMousewheel();
    });

    this.bus.$on(`placeMarkerId${this.markerId}`, showup => {
      if (this.showPopup && !showup) {
        this.triggleDisplayPopup();
      } else if (this.showPopup && showup) {
        this.mapUtil.setMapCenter({
          longitude: this.lonlatArr[0],
          latitude: this.lonlatArr[1]
        });
      } else if (!this.showPopup && showup) {
        this.triggleDisplayPopup();
      }
    });
  },
  watch: {
    labelType: {
      handler(val) {
        if (val.placeId) {
          this.labelName = val.placeLabelName;
          this.showPopup = false;
        }
      },
      immediate: true
    }
  },
  computed: {
    labelInputPlaceholder() {
      return '请输入' + this.labelType.labelName + '名称';
    }
  },
  methods: {
    // 判断当前警力是否已存在
    policeExistence(id) {
      const index = this.policeData.findIndex(item => item.userId === id);
      return index !== -1;
    },
    addMousewheel() {
      const ele = document.getElementById(this.markerId);
      ele.addEventListener('mousewheel', this.stopMouseWheelPropagation);
      ele.addEventListener('mousemove', this.stopMouseMovePropagation);
    },
    removeMousewheel() {
      const ele = document.getElementById(this.markerId);
      ele.removeEventListener('mousewheel', this.stopMouseWheelPropagation);
      ele.removeEventListener('mousemove', this.stopMouseMovePropagation);
    },
    stopMouseMovePropagation(event) {
      event.stopPropagation();
    },
    stopMouseWheelPropagation(event) {
      event.stopPropagation();
    },
    async triggleDisplayPopup() {
      const { labelName, placeId } = this.labelType;
      if (placeId) {
        this.mapUtil.setMapCenter({
          longitude: this.lonlatArr[0],
          latitude: this.lonlatArr[1]
        });
      }
      this.showPopup = !this.showPopup;

      if (this.showPopup && placeId && labelName === '岗亭') {
        const { data } = await getCurPolicesInPlace({ placeId });
        // 查询地点标签中警员 ueserId是警员id
        this.policeData = (data || []).map(item => {
          return {
            ...item,
            policeRealName: item.policeName
          };
        });
      }
      //弹框点击取消时，重新加载数据（曹可可
      if(!this.showPopup){
        this.bus.$emit('placeLabelUpdate');
              // const { data } = await queryPlaceLabel({ placeLabelName: '' });
      }
    },
    // 保存标记点位
    async saveLabelMarker() {
      const {
        labelName,
        labelType,
        labelTypeName,
        placeType,
        placeId
      } = this.labelType;
      const { shapeType, wkts } = this;
      const { data } = placeId
        ? await modPlaceLabel({ id: placeId, placeLabelName: this.labelName })
        : await addNewPlaceLabel({
            labelName,
            labelType,
            labelTypeName,
            placeLabelName: this.labelName,
            placeType,
            shapeType,
            wkts
          });

      if (labelName === '岗亭') {
        const params = {};

        params.placeId = placeId || data;

        const newUserIds = this.policeData.map(item => {
          return item.userId;
        });
        params.newUserIds = newUserIds;
        await modPoliceInPlace(params);
      }
      this.bus.$emit('placeLabelUpdate');
      this.triggleDisplayPopup();
    },
    async clearLabelIconMarker() {
      // 清除marker之前解绑之前绑定的事件
      this.$confirm('此操作将删除资源，是否继续', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(async () => {
          if (this.labelType.placeId) {
            const res = await delPlaceLabel({ id: this.labelType.placeId });
            if (res.msg === 'SUCCESS') {
              this.removeMousewheel();
              this.$message({
                type: 'success',
                message: '删除成功'
              });
            }
          }
          this.bus.$emit('placeLabelUpdate');
        })
        .catch(() => {
          this.$message({
            type: 'success',
            message: '已取消删除'
          });
        });
    },
    // 添加警力
    addPoliceToBox() {
      this.showSearchPop = true;
    },
    closePoliceSearchPop() {
      this.showSearchPop = false;
    },
    deletPoliceFromBox(index) {
      this.policeData.splice(index, 1);
    },
    async handleSearch() {
      const {
        data: { list }
      } = await getPoliceInfo({
        containSub:true,
        policeName: this.policeNameOrCode,
        pageNo: 1,
        pageSize: 1000
      });
      // 查询警员列表 id是警员id ,此处id与接口getCurPolicesInPlace中userId是一个意思
      this.searchResultData = list;
      this.actived = true;
    },
    addPolicePerson(item) {
      const index = this.policeExistence(item.id);
      if (!index) {
        this.policeData.push({ ...item, userId: item.id });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
// $policeBox: url('../../assets/images/config/police-box.png') no-repeat center;
// $policeBoxHover: url('../../assets/images/config/police-box-hover.png')
//   no-repeat center;
// $policeBoxActive: url('../../assets/images/config/police-box-active.png')
//   no-repeat center;

// $ktv: url('../../assets/images/config/ktv.png') no-repeat center;
// $ktvActive: url('../../assets/images/config/ktv-active.png') no-repeat center;

// $internetBar: url('../../assets/images/config/internet-bar.png') no-repeat
//   center;
// $internetBarActive: url('../../assets/images/config/internet-bar-active.png')
//   no-repeat center;
// $housingEstate: url('../../assets/images/config/housing-estate.png') no-repeat
//   center;
// $housingEstateActive: url('../../assets/images/config/housing-estate-active.png')
//   no-repeat center;
// $keyAreas: url('../../assets/images/config/areas.png') no-repeat center;
// $keyAreasActive: url('../../assets/images/config/areas-active.png') no-repeat
//   center;
@mixin labelIconBkg($type) {
  background: $type;
}
@mixin activePoliceLabelSize {
  width: 42px;
  height: 42px;
}
@mixin activeOtherLabelSize {
  width: 40px;
  height: 53px;
}
@mixin scrollClass {
  &::-webkit-scrollbar {
    width: 4px;
    height: 20px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 100px;
    background: rgba(0, 0, 0, 0.12);
  }
  &::-webkit-scrollbar-track {
    width: 12px;
  }
}
.label-icon {
  position: relative;
  z-index: 9999;
  height: auto;
  .pop-window-wrap {
    position: absolute;
    bottom: 60px;
    left: -86px;
    display: flex;

    // width: 208px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.29);
    &.police-boc-pop-up {
      bottom: 50px;
    }
    &::after {
      position: absolute;
      bottom: -17px;
      left: 95px;
      content: '';
      width: 0;
      height: 0;
      border: 10px solid transparent;
      border-top-color: #fff;
    }
    .info-edit {
      min-width: 208px;

      padding: 13px;
      .info-edit-input {
        margin-bottom: 12px;
      }
    }
    .info-search {
      width: 260px;
      padding: 0 10px 0 13px;
      margin: 13px 0;
      border-left: 1px dotted #979797;
    }
    .info-close {
      width: 24px;
      height: 24px;
      margin: 4px 4px 0 0;
      font-size: 24px;
    }
    .add-police {
      // margin-top: 12px;
      .add-police {
        color: #4d4d4d;
        font-size: 14px;
      }
    }
    .police-info {
      display: flex;
      // flex-wrap: wrap;
      padding-top: 5px;

      span:not(:last-child) {
        margin-right: 5px;
      }
      .add-btn {
        display: inline-block;
        width: 56px;
        height: 56px;
        line-height: 54px;
        background: #f3f3f3;
        border: 1px solid #dfdfdf;
        border-radius: 1px;
        font-size: 24px;
        text-align: center;
        cursor: pointer;
        margin-bottom: 5px;
      }
      .police-info-item {
        display: inline-block;
        width: 56px;
        height: 56px;
        background: #f8fbff;
        border: 1px solid #7ab8ff;
        border-radius: 1px;
        position: relative;
        padding: 3px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-bottom: 5px;
        .info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: #5b5b5b;

          span {
            margin: 0;
            display: inline-block;
            max-width: 46px;
            text-align: center;
          }
          .name {
            font-size: 14px;
          }
          .code {
            font-size: 12px;
          }
        }
        .close-icon {
          position: absolute;
          top: -5px;
          right: -5px;
          width: 15px;
          height: 15px;
          line-height: 15px;
          text-align: center;
          background: #999;
          color: #fff;
          font-size: 14px;
          border-radius: 50%;
          cursor: pointer;
        }
      }
    }
    .operator-btn {
      display: flex;
      ::v-deep .el-button {
        flex: 1;
        min-width: 86px;
      }
    }
  }
  .search-wrap {
    position: relative;
  }
  .search-result {
    position: absolute;
    top: 36px;
    left: 0px;
    width: 100%;
    border: 1px solid #ccc;
    background: #fff;
    z-index: 55;
    max-height: 125px;
    // padding-bottom: 4px;
    border-radius: 2px;
    overflow: auto;
    @include scrollClass;
    &.empty {
      height: 80px;
      line-height: 78px;
      text-align: center;
    }
    .result-item {
      height: 32px;
      line-height: 32px;
      padding: 0 12px;
      background: #fff;
      cursor: pointer;
      &:hover {
        background: rgba(32, 128, 247, 0.16);
      }
      &.disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }
  }
  .icon {
    position: relative;
    width: 36px;
    height: 36px;
    cursor: pointer;
    .icon-img {
      object-fit: contain;
      &.icon-img-active {
        transform: scale(1.3, 1.3);
      }
      &:not(#icon-img):not(.icon-img-active):hover {
        transform: scale(1.3, 1.3);
      }
    }
    #icon-img:not(.icon-img-active):hover {
      content: url('../../assets/images/config/police-box-hover.png');
    }
    #icon-img.icon-img-active {
      content: url('../../assets/images/config/police-box-hover.png');
    }
    // &.police-box {
    //   @include labelIconBkg($policeBox);
    //   &:hover {
    //     @include labelIconBkg($policeBoxHover);
    //   }
    //   &.icon-active {
    //     @include activePoliceLabelSize;
    //     @include labelIconBkg($policeBoxActive);
    //   }
    // }
    // &.ktv {
    //   height: 40px;
    //   @include labelIconBkg($ktv);
    //   &:hover {
    //     @include activeOtherLabelSize;
    //     @include labelIconBkg($ktvActive);
    //   }
    //   &.icon-active {
    //     @include activeOtherLabelSize;
    //     @include labelIconBkg($ktvActive);
    //   }
    // }
    // &.internet-bar {
    //   height: 40px;
    //   @include labelIconBkg($internetBar);
    //   &:hover {
    //     @include activeOtherLabelSize;
    //     @include labelIconBkg($internetBarActive);
    //   }
    //   &.icon-active {
    //     @include activeOtherLabelSize;
    //     @include labelIconBkg($internetBarActive);
    //   }
    // }
    // &.housing-estate {
    //   height: 40px;
    //   @include labelIconBkg($housingEstate);
    //   &:hover {
    //     @include activeOtherLabelSize;
    //     @include labelIconBkg($housingEstateActive);
    //   }
    //   &.icon-active {
    //     @include activeOtherLabelSize;
    //     @include labelIconBkg($housingEstateActive);
    //   }
    // }
    // &.key-areas {
    //   height: 40px;
    //   @include labelIconBkg($keyAreas);
    //   &:hover {
    //     height: 47px;
    //     @include labelIconBkg($keyAreasActive);
    //   }
    //   &.icon-active {
    //     height: 47px;
    //     @include labelIconBkg($keyAreasActive);
    //   }
    // }
    .area-name {
      position: absolute;
      bottom: -18px;
      left: -35px;
      display: inline-block;
      width: 100px;
      text-align: center;
      color: red;
      font-weight: bold;
    }
    .delet-btn {
      position: absolute;
      top: -6px;
      right: -6px;
      display: inline-block;
      background: #999999;
      color: #fff;
      width: 15px;
      height: 15px;
      line-height: 15px;
      text-align: center;
      border-radius: 50%;
    }
  }
}
</style>