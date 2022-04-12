<template>
  <div class="listContain">
    <div class="baseInfo">
      <div class="picHead">
        <img class="picDiv" :src="listData.bkgPicUrl" />
      </div>
      <div class="fontInfo">
        <div class="firstLine">
          <span>{{ listData.name }}</span>
          <div class="statusDiv">{{ listData.status }}</div>
        </div>

        <span class="cardId">{{ listData.zjhm }}</span>
      </div>
    </div>
    <div class="timeTypeSwitch">
      <div
        class="timeSelect"
        v-for="(item, index) in timeSwitch"
        :class="timeSwitchIndex == index ? 'addClass' : ''"
        @click="timeSwitchClick(index, item)"
        :key="index"
      >
        <span>{{ item.name }}</span>
        <div :class="timeSwitch.length - 1 == index ? '' : 'splitLine'"></div>
      </div>
    </div>
    <div class="orbitTab">
      <div class="tabDiv">
        <div
          class="listTab"
          v-for="(item, index) in listType"
          :class="listTypeIndex == index ? 'tabActive' : ''"
          @click="listTypeClick(index, item)"
          :key="index"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
    <div class="selectLine">
      <span>
        出现
        <span class="desDiv">{{ listData.showNum }}</span>
        次，经过
        <span class="desDiv">{{ listData.pointNum }}</span>
        个点位
      </span>
      <div class="timeIcon">
        <div
          v-show="!timeIcon"
          class="timePreIconUrl"
          @click="timeIconClick"
        ></div>
        <div
          v-show="timeIcon"
          class="timeNorIconUrl"
          @click="timeIconClick"
        ></div>
        <div v-show="!timeIcon" class="pop1">
          <div class="timeSortDiv">
            <div
              class="timeSort"
              v-for="(item, index) in timeSortSelect"
              :class="timeSortIndex == index ? 'timeSortActive' : ''"
              @click="timeSortClick(index, item)"
              :key="index"
            >
              <span>{{ item.name }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="filterIcon">
        <div
          v-show="!filterIcon"
          class="filterPreIconUrl"
          @click="filterIconClick"
        ></div>
        <div
          v-show="filterIcon"
          class="filterNorIconUrl"
          @click="filterIconClick"
        ></div>
        <div v-show="!filterIcon" class="pop2">
          <span class="title">类型</span>
          <el-checkbox-group
            v-model="checkedCities1"
            fill="#10C6FF"
            text-color="#10C6FF"
          >
            <el-checkbox v-for="city in cities" :label="city" :key="city">
              {{ city }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
    </div>
    <div class="cardList" v-show="cardShow">
      <div v-for="(item, index) in listData.byTime" :key="index">
        <div class="itemDate">
          <div class="itemDateFont">{{ item.date }}</div>
        </div>
        <div class="itemCard" v-for="(item, index) in item.result" :key="index">
          <div class="orderLine"></div>
          <div class="itemCardContain">
            <div class="itemCardLeft">
              <div class="itemCardTop">
                <div class="itemCardTime">{{ item.time }}</div>
                <div class="itemCardCar" v-show="item.carId">
                  {{ item.carId }}
                </div>
              </div>
              <div class="itemCardPoint">
                {{ item.pointName }}
              </div>
            </div>
            <div class="itemCardPic"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import OrbitMap from './map'
import { getTrailInfo } from '@/api/alarmCommand';

export default {
  name: 'orbit-list',
  data() {
    return {
      checkedCities1: ['人脸', '人体', '车辆', '探针'],
      cities: ['人脸', '人体', '车辆', '探针'],
      listTypeIndex: 0,
      timeSortIndex: 0,
      timeIcon: true,
      filterIcon: true,
      cardShow: true,
      listData: {
        name: '张三',
        bkgPicUrl:
          'http://10.19.165.11:6120/pic?AC01F06B07C04608BDDF*9878-e72dc0-75d6-dd9fc7/88888/682;157242385688506030327?pic*522302903*342982*3457*AC01F06B07C04608BDDF-2*1572424689',
        zjhm: '33012200001310132176',
        status: '全国在逃',
        showNum: '7',
        pointNum: '10',
        byTime: [
          {
            date: '2020/04/14',
            result: [
              {
                time: '12:33:21',
                pointName:
                  '江南大道明月路口江南大道江南大道明月路口江南大道江南',
                picUrl:
                  'http://10.19.165.11:6120/pic?AC01F06B07C04608BDDF*9878-e72dc0-75d6-dd9fc7/88888/682;157242385688506030327?pic*522302903*342982*3457*AC01F06B07C04608BDDF-2*1572424689',
                num: '1',
                carId: '浙A123',
                latitude: '31.248439',
                longitude: '121.206797'
              },
              {
                time: '12:33:21',
                pointName: '江南大道明月路口江南大道',
                picUrl:
                  'http://10.19.165.11:6120/pic?AC01F06B07C04608BDDF*9878-e72dc0-75d6-dd9fc7/88888/682;157242385688506030327?pic*522302903*342982*3457*AC01F06B07C04608BDDF-2*1572424689',
                num: '2',
                latitude: '31.202066',
                longitude: '121.20474'
              }
            ]
          },
          {
            date: '2020/04/12',
            result: [
              {
                time: '12:33:21',
                pointName: '物联网街123号物联网街123号物联网街123号',
                picUrl:
                  'http://10.19.165.11:6120/pic?AC01F06B07C04608BDDF*9878-e72dc0-75d6-dd9fc7/88888/682;157242385688506030327?pic*522302903*342982*3457*AC01F06B07C04608BDDF-2*1572424689',
                num: '3',
                latitude: '',
                longitude: ''
              },
              {
                time: '12:33:21',
                pointName: '物联网街123号物联网街123号物联网街123号',
                picUrl:
                  'http://10.19.165.11:6120/pic?AC01F06B07C04608BDDF*9878-e72dc0-75d6-dd9fc7/88888/682;157242385688506030327?pic*522302903*342982*3457*AC01F06B07C04608BDDF-2*1572424689',
                num: '4',
                latitude: '',
                longitude: ''
              }
            ]
          }
        ],
        byPio: [
          {
            point: '湘湖三期',
            times: '12',
            picUrl:
              'http://10.19.165.11:6120/pic?AC01F06B07C04608BDDF*9878-e72dc0-75d6-dd9fc7/88888/682;157242385688506030327?pic*522302903*342982*3457*AC01F06B07C04608BDDF-2*1572424689',
            recent: '2018-10-10 12:00:10',
            activeTime: '8:00-19:00'
          },
          {
            point: '江南大道阡陌路',
            times: '12',
            picUrl:
              'http://10.19.165.11:6120/pic?AC01F06B07C04608BDDF*9878-e72dc0-75d6-dd9fc7/88888/682;157242385688506030327?pic*522302903*342982*3457*AC01F06B07C04608BDDF-2*1572424689',
            recent: '2018-10-10 12:00:10',
            activeTime: '8:00-19:00'
          }
        ]
      },
      timeSwitch: [
        {
          name: '近24小时',
          value: '1'
        },
        {
          name: '近7天',
          value: '7'
        },
        {
          name: '近30天',
          value: '30'
        }
      ],
      timeSortSelect: [
        {
          name: '时间由近到远',
          value: 'nearToFar'
        },
        {
          name: '时间由远到近',
          value: 'farToNear'
        }
      ],
      listType: [
        {
          name: '按时间',
          value: 'byTime'
        },
        {
          name: '按点位',
          value: 'byPoint'
        }
      ],
      mapData: null,
      timeSwitchIndex: 0
    };
  },
  components: {
    //  OrbitMap,
  },
  created() {},
  mounted() {
    let uuid = this.$route.params.id;
    console.log(uuid);
    let param = {
      zjhm: '330121199201011234',
      timeType: '1',
      sortType: ''
    };
    let vm = this;
    getTrailInfo(param).then(result => {
      // vm.listData= result.data.listData;
      vm.mapData = vm.listData.byTime;
    });
  },
  computed: {},
  methods: {
    //时间排序图标切换
    timeIconClick() {
      this.timeIcon = !this.timeIcon;
    },
    //监控选择图标切换
    filterIconClick() {
      this.filterIcon = !this.filterIcon;
    },
    //时间范围选择（近7天、近24小时）
    timeSwitchClick(index, item) {
      this.timeSwitchIndex = index;
    },
    //按时间、按点位选择
    listTypeClick(index, item) {
      this.listTypeIndex = index;
      this.bus.$emit('tabChange', this.listType[this.listTypeIndex].name);
    },
    //时间排序顺序选择
    timeSortClick(index, item) {
      this.timeSortIndex = index;
    }
  },
  watch: {
    mapData(oldValue, newValue) {
      this.bus.$emit('mapDataChange', newValue);
    },
    listData(oldValue, newValue) {
      this.bus.$emit('listDataChange', newValue);
    }
  }
};
</script>
<style lang="less" scoped>
.addClass {
  color: #0aabfa;
}
.tabActive {
  color: #0aabfa !important;
  border-bottom: solid 2px #0aabfa !important;
}
.listContain {
  max-height: 600px;
  width: 362px;
  background: #001731;
  position: fixed;
  z-index: 999;

  margin: 16px;
  border-radius: 8px;
  .baseInfo {
    height: 74px;
    width: 362px;
    display: flex;
    background: rgba(0, 0, 0, 0.04);
    box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.1);
    .picHead {
      height: 54px;
      width: 54px;
      background-image: url('../../assets/images/orbit/head54.png');
      margin: 10px 16px;
      .picDiv {
        margin: 4px;
        height: 46px;
        width: 46px;
      }
    }
    .fontInfo {
      display: flex;
      flex-direction: column;
      margin-top: 10px;
      font-size: 14px;
      color: #fff;
      line-height: 24px;
      .firstLine {
        height: 24px;
        display: flex;
        .statusDiv {
          margin-left: 12px;
          height: 24px;
          width: 64px;
          background: rgba(18, 83, 137, 0.3);
          border: 1px solid rgba(16, 198, 255, 0.7);
          border-radius: 2px;
          font-size: 12px;
          line-height: 22px;
          text-align: center;
          color: rgba(16, 198, 255, 0.7);
        }
      }
      .cardId {
        margin-top: 8px;
      }
    }
  }
  .timeTypeSwitch {
    display: flex;
    font-size: 14px;
    color: #c0e1ff;
    margin-left: 16px;
    height: 36px;
    line-height: 36px;
    .timeSelect {
      cursor: pointer;
      display: flex;
      .splitLine {
        height: 12px;
        width: 1px;
        background-color: #305e9d;
        margin: 12px 10px;
      }
    }
  }
  .orbitTab {
    height: 32px;
    background: url('../../assets/images/orbit/orbitBg.png');
    .tabDiv {
      margin-left: 16px;
      display: flex;
      .listTab {
        width: 164px;
        text-align: center;
        line-height: 32px;
        border-bottom: solid 1px #2d89c0;
        color: #c0e1ff;
        cursor: pointer;
      }
    }
  }
  .selectLine {
    height: 44px;
    color: #fff;
    font-size: 14px;
    margin-left: 16px;
    display: flex;
    .desDiv {
      line-height: 44px;
      color: #0aabfa;
    }
    .timeIcon {
      margin-left: 114px;
      /*line-height: 44px ;
                cursor: pointer;*/
      .timeNorIconUrl {
        height: 24px;
        width: 24px;
        margin-top: 10px;
        cursor: pointer;
        background: url('../../assets/images/orbit/timeNOR.png');
      }
      .timePreIconUrl {
        height: 24px;
        width: 24px;
        margin-top: 10px;
        cursor: pointer;
        background: url('../../assets/images/orbit/timePRE.png');
      }
      .pop1 {
        height: 70px;
        width: 98px;
        background: #fff;
        position: fixed;
        top: 192px;
        background: url('../../assets/images/orbit/popSelect.png');
        .timeSortDiv {
          margin: 12px 6px;
          .timeSort {
            height: 20px;
            width: 86px;
            margin-top: 4px;
            color: #c0e1ff;
            font-size: 12px;
            line-height: 20px;
            text-align: center;
            cursor: pointer;
          }
          .timeSortActive {
            background: #30577b;
          }
        }
      }
    }
    .filterIcon {
      margin-left: 10px;
      line-height: 44px;
      cursor: pointer;
      .filterNorIconUrl {
        height: 24px;
        width: 24px;
        margin-top: 9px;
        cursor: pointer;
        background: url('../../assets/images/orbit/filterNOR.png');
      }
      .filterPreIconUrl {
        height: 24px;
        width: 24px;
        margin-top: 10px;
        cursor: pointer;
        background: url('../../assets/images/orbit/filterPRE.png');
      }
      .pop2 {
        height: 160px;
        width: 102px;
        color: #c0e1ff;
        position: fixed;
        top: 192px;
        font-size: 12px;
        background: url('../../assets/images/orbit/popMulSelect.png');
        .title {
          margin: 12px;
        }
      }
    }
  }
  .cardList {
    margin-top: -8px;
    color: #fff;
    font-size: 14px;
    max-height: 420px;
    overflow-y: scroll;
    .itemDate {
      height: 36px;
      width: 330px;
      margin-left: 16px;
      font-size: 14px;
      background: url('../../assets/images/orbit/orbitBg.png');
      .itemDateFont {
        margin: 8px;
        line-height: 36px;
      }
    }
    .itemCard {
      height: 106px;
      display: flex;
      .orderLine {
        height: 80px;
        width: 40px;
      }
      .itemCardContain {
        background: url('../../assets/images/orbit/cardNOR.png');
        width: 316px;
        height: 106px;
        display: flex;

        .itemCardLeft {
          width: 200px;
          margin: 20px 12px 20px 24px;
          .itemCardTop {
            height: 20px;

            display: flex;
            .itemCardTime {
              margin-top: 4px;
            }
            .itemCardCar {
              height: 18px;
              width: 76px;
              border: solid 1px #0bacfb;
              color: #0bacfb;
              font-size: 12px;
              line-height: 16px;
              border-radius: 2px;
              text-align: center;
              margin-top: 2px;
              margin-left: 12px;
            }
          }
          .itemCardPoint {
            margin-top: 6px;
            letter-spacing: 1px;
            color: rgba(255, 255, 255, 0.7);
          }
        }
        .itemCardPic {
          height: 58px;
          width: 58px;
          margin-top: 24px;
          background: url('../../assets/images/orbit/head58.png');
        }
      }
    }
  }
}
</style>
