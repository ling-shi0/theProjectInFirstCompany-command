<!--
 * @Description:
 * @Version: 2.0
 * @Autor: caokeke
 * @Date: 2021-02-22 18:45:58
 * @LastEditors: caokeke
 * @LastEditTime: 2021-04-29 19:48:16
-->
<template>
  <div class="alarm-list-panel">
    <!-- <div class="region-sel">
      <department-select
        @departmentChange="departmentChange"
      ></department-select>
    </div> -->
    <div class="type-sel">
      <div
        class="type-item"
        :class="currentType === index ? 'active' : ''"
        v-for="(item, index) in type"
        :key="index"
        @click="currentTypeChange(index)"
      >
        {{ item.label }}
      </div>
    </div>
    <div class="search">
      <el-input
        v-model="keyWord"
        placeholder="请输入关键字进行查询"
        suffix-icon="h-icon-search"
        clearable
        :on-icon-click="handleOnClick"
        class="search-input"
      ></el-input>
      <div
        @click="searchSwapFlag = !searchSwapFlag"
        class="search-swap"
        title="收起更多条件"
      >
        <i
          :class="
            searchSwapFlag ? 'h-icon-angles_up_sm' : 'h-icon-angles_down_sm'
          "
        ></i>
      </div>
    </div>
    <transition name="search-slide">
      <div class="filter-panel" v-if="searchSwapFlag">
        <div class="time-sel">
          <el-date-picker
            v-model="searchDate"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </div>
        <div class="alarm-type">
          <div class="option-sel">
            <el-select
              v-model="alarmType"
              placeholder="警情类别"
              @change="selectClickFetch"
            >
              <el-option
                v-for="(item, index) in alarmTypeOptions"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="option-sel">
            <el-select
              v-model="delStatus"
              placeholder="处理阶段"
              @change="selectClickFetch"
            >
              <el-option
                v-for="item in delStatusOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
      </div>
    </transition>
    <div class="list-pane">
      <el-scrollbar
        wrap-class="list-pane-scrollbar-wrap"
        v-if="alertList && alertList.length > 0"
        @on-scrolling-y="scrollFetch"
      >
        <alert-list-item
          v-for="(item, index) in alertList"
          :key="index"
          :itemData="item"
          style="margin-bottom: 6px"
          @addFocus="addFocus"
          @click.native="showDetail(item, index)"
        ></alert-list-item>
      </el-scrollbar>
      <h-empty v-else />
    </div>
  </div>
</template>
<script>
import { getCurUser } from '@/api/InfoCenter/infoCenter';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import AlertListItem from '@/components/alertManage/alertListItem';
import DepartmentSelect from '@/components/alarm-command/alarm-list/DepartmentSelect';
import {
  getAlarmList,
  updateAlertFocus,
  getPolice,
  updateReadType
} from '@/api/alarmCommand';
import moment from 'moment';
import {
  alarmTypes,
  dealSteps,
  tabOptions
} from '@/components/alarm-command/alarmListConstant';
const { protocol, host } = window.location;
const webSocketPrefix = `${protocol === 'https:' ? 'wss' : 'ws'}://${host}/${
  process.env.VUE_APP_CONTEXT
}`;
let wsLock = false;
export default {
  data() {
    return {
      currentType: 0,
      alarmType: '',
      delStatus: '',
      delStatusOptions: dealSteps,
      alarmTypeOptions: alarmTypes,
      keyWord: '',
      searchDate: [
        moment(new Date()).format('YYYY-MM-DD 00:00:00'),
        moment(new Date()).format('YYYY-MM-DD 23:59:59')
      ],
      type: tabOptions,
      alertList: [],
      page: {
        pageNo: 1,
        pageSize: 20
      },
      fetchTortulFlag: false,
      switchChangeData: {},
      searchSwapFlag: false,
      takeAlarmDeptCode: '',
      lastActiveItemIndex: -1,
      socket: null,
      websocketPath:
        process.env.NODE_ENV === 'development'
          ? 'ws://localhost:8080/api/dzavc/websocket'
          : `${webSocketPrefix}/websocket`,
      sockjsUrl:
        process.env.NODE_ENV === 'development'
          ? '/api/dzavc/webSocket'
          : `${protocol}//${host}/${process.env.VUE_APP_CONTEXT}/webSocket`
    };
  },
  components: {
    AlertListItem,
    DepartmentSelect
  },
  watch: {
    searchDate(val) {
      this.page.pageNo = 1;
      this.fetchListData(this.switchChangeData);
      this.bus.$emit('changeDetail', {
        detailShow: false
      });
    }
  },
  methods: {
    currentTypeChange(index) {
      if (this.currentType === index) {
        return;
      }
      switch (true) {
        case index === 0:
          this.switchChangeData = {};
          this.page.pageNo = 1;
          this.fetchListData({});
          break;
        case index === 1:
          this.switchChangeData = { state: '分派,签收,到达,反馈' };
          this.page.pageNo = 1;
          this.fetchListData({ state: '分派,签收,到达,反馈' });
          break;
        case index === 2:
          this.switchChangeData = { focus: '1' };
          this.page.pageNo = 1;
          this.fetchListData({ focus: '1' });
          break;
      }
      this.bus.$emit('changeDetail', {
        detailShow: false
      });
      if (this.lastActiveItemIndex > -1) {
        this.alertList[this.lastActiveItemIndex] &&
          (this.alertList[this.lastActiveItemIndex].activeStatus = false);
        this.lastActiveItemIndex = -1;
      }
      this.currentType = index;
    },
    fetchListData({ focus, state }, isRefresh) {
      // const params = {
      //   alertCategory: '',
      //   endTime: '',
      //   focus: '',
      //   keyword: '',
      //   pageNo: 1,
      //   pageSize: 10,
      //   startTime: '',
      //   state: '',
      //   takeAlarmDeptCode: ''
      // };
      const params = {
        alertCategory: this.alarmType,
        endTime: moment(this.searchDate[1]).format('YYYY-MM-DD HH:mm:ss'),
        focus: focus || '',
        keyword: this.keyWord,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        startTime: moment(this.searchDate[0]).format('YYYY-MM-DD HH:mm:ss'),
        state: this.delStatus || state,
        takeAlarmDeptCode: this.takeAlarmDeptCode,
        historyAlert: false
      };
      getAlarmList(params).then(({ data }) => {
        data &&
          data.list.forEach(item => {
            item.activeStatus = false;
          });
        if (this.page.pageNo === 1) {
          this.alertList.length = 0;
          this.alertList = data && data.list;
        } else {
          this.alertList = this.alertList.concat(data && data.list);
        }
        this.fetchTortulFlag = false;
        isRefresh &&
          this.bus.$emit('changeDetail', {
            detailShow: true,
            alarmMes: this.alertList[this.lastActiveItemIndex]
          });
        isRefresh &&
          this.lastActiveItemIndex > -1 &&
          (this.alertList[this.lastActiveItemIndex].activeStatus = true);
      });
    },
    scrollFetch({ percentY }) {
      if (this.fetchTortulFlag) {
        return;
      }
      if (percentY > 0.7) {
        this.fetchTortulFlag = true;
        this.page.pageNo++;
        this.fetchListData(this.switchChangeData);
      }
    },
    selectClickFetch() {
      this.page.pageNo = 1;
      this.fetchListData(this.switchChangeData);
      this.bus.$emit('changeDetail', {
        detailShow: false
      });
    },
    addFocus(params) {
      updateAlertFocus(params).then(data => {
        this.$message.success(`${params.focus ? '关注' : '取消关注'}成功！`);
        this.fetchListData(this.switchChangeData);
        params['isMonitorRefresh'] = true;
        this.bus.$emit('refreshAlarmData', params);
      });
    },
    departmentChange(element) {
      this.takeAlarmDeptCode = element.deptIndexCode;
      this.page.pageNo = 1;
      this.$emit('departmentChange', this.takeAlarmDeptCode);
      this.fetchListData(this.switchChangeData);
    },
    showDetail(item, index) {
      const showJudge = !(index === this.lastActiveItemIndex);
      if (showJudge) {
        this.lastActiveItemIndex > -1 &&
          (this.alertList[this.lastActiveItemIndex].activeStatus = false);
        this.alertList[index].activeStatus = true;
        this.lastActiveItemIndex = index;
      } else {
        this.alertList[this.lastActiveItemIndex].activeStatus = false;
        this.lastActiveItemIndex = -1;
      }
      this.$set(this, 'alertList', this.alertList);
      this.$set(this.alertList[index], 'readType', 1);
      updateReadType({ readType: 1, alarmNo: this.alertList[index].alarmNo });
      // this.$set(this.alertList[index], 'isNew', false);
      this.bus.$emit('changeDetail', {
        detailShow: showJudge,
        alarmMes: item
      });
    },
    handleOnClick() {
      this.page.pageNo = 1;
      this.fetchListData(this.switchChangeData);
    },
    startFetchingAlarmData: async function () {
      if (process.env.VUE_APP_MOCK === 'true') {
        // let { data } = await this.$http.get('/alarmCenter/getAlarmFake')
        // this.alarmList = data
        // setTimeout(() => {
        //   // 人体属性
        //   this.alarmList.unshift(
        //     // 人体预警
        //     {
        //       deployName: '布控任务',
        //       alarmType: 'body',
        //       alarmId: '2',
        //       alarmLevel: 'm',
        //       longitude: '120',
        //       latitude: '30',
        //       placeCode: '2',
        //       placeType: 'body',
        //       placeName: '江陵路人体抓拍机',
        //       personInfo: [
        //         {
        //           alarmTime: '2020/04/02 10:33:30',
        //           eventInfo: null,
        //           source: {
        //             faceSourceInfo: {},
        //             vehicleSourceInfo: {},
        //             personidSourceInfo: {},
        //             wifiSourceInfo: {},
        //             vehicleSourceInfo: {},
        //             phoneSourceInfo: {},
        //             bodySourceInfo: {
        //               bodyPicUrl: 'https://cdn.pixabay.com/photo/2015/01/13/14/53/couple-598315_960_720.jpg',
        //               bkgPicUrl: 'https://cdn.pixabay.com/photo/2014/09/07/21/52/urban-438393_960_720.jpg',
        //               age: 31,
        //               gender: 'male',
        //               glass: 'no',
        //               smile: 'no',
        //               ethnic: 'no'
        //             },
        //             phoneCodeSourceInfo: {}
        //           },
        //           target: {
        //             libId: '1',
        //             libName: '涉黄人员',
        //             similarity: 0.8904,
        //             humanId: '1',
        //             facePicUrl: 'https://cdn.pixabay.com/photo/2015/11/20/17/29/person-1053543_960_720.jpg',
        //             humanName: '李四四',
        //             vehiclePlate: [{ plateColor: 'red', plateNumber: '浙AH3333' }]
        //           }
        //         }
        //       ]
        //     }
        //   )
        // }, 3000)
      } else {
        // this.createWebSocketInstance();
        // this.buildSocket();
        this.connection();
      }
    },
    async connection() {
      const {
        data: { deptIndexCode }
      } = await getCurUser();
      // const deptIndexCode = '330401';
      var _this = this;
      // 建立连接对象
      let socket = new SockJS(this.sockjsUrl);
      // 获取STOMP子协议的客户端对象
      this.stompClient = Stomp.over(socket);
      // 定义客户端的认证信息,按需求配置
      let headers = {
        Authorization: ''
      };
      // 向服务器发起websocket连接
      this.stompClient.connect(
        headers,
        function (res) {
          // let temp = {
          //   alarmAreaCode: null,
          //   alarmComment: '称九千多元丢失，需要帮助寻找',
          //   alarmLevel: '1',
          //   alarmMode: '电话报警',
          //   alarmNo: '3300001808200900018',
          //   alarmPersonCertificateNumber: null,
          //   alarmPersonFaceUrl: null,
          //   alarmPersonName: '张三',
          //   alarmPersonPhone: '13801545102',
          //   alarmPersonSex: null,
          //   alarmPersonTag: '多次报警',
          //   alarmPhoneTag: '历史报警15次,重复报警1次',
          //   alarmSituationAddress: '锦城街道吴越山庄33幢303室',
          //   alarmSituationCategory: '求助',
          //   alarmSituationType: null,
          //   alarmState: '签收',
          //   alarmTime: '2021-03-18 16:45:08',
          //   alarmType: '110报警',
          //   alertVaildState: null,
          //   arriveTime: null,
          //   assignTime: null,
          //   callInTime: null,
          //   callOutTime: null,
          //   caseNo: null,
          //   dealResult: null,
          //   disposeDept: '330401',
          //   disposePerson: null,
          //   disposePersonUserId: null,
          //   disposeType: '派单处置',
          //   endTime: null,
          //   feedBackTime: null,
          //   feedback: null,
          //   feedbackPicUrl: null,
          //   feedbackVideoUrl: null,
          //   feedbackVoiceUrl: null,
          //   finalFeedback: null,
          //   focus: '0',
          //   forceNum: null,
          //   id: 'ca4d871510134204b7165a4b184bb95d',
          //   jurisdictionalDept: null,
          //   jurisdictionalDeptCode: null,
          //   latitude: '37.29523614',
          //   longitude: '116.87360607',
          //   positionType: 3,
          //   recordingsNo: null,
          //   signTime: null,
          //   signUserId: null,
          //   takeAlarmDept: '嘉兴分局',
          //   takeAlarmDeptCode: '3304',
          //   updateTime: '2021-04-01 17:07:05'
          // };
          // _this.alertList.forEach((item, index) => {
          //   if (item.id === temp.id) {
          //     temp.isNew = true;
          //     temp.activeStatus = false;
          //     _this.$set(_this.alertList, index, temp);
          //   }
          // });
          //连接成功 订阅系统信息主题消息
          _this.stompClient.subscribe(
            `/topic/${deptIndexCode}`,
            function (msg) {
              // _this.arrys.unshift(JSON.parse(msg.body));
              console.log(JSON.parse(msg.body));
              const newObj = JSON.parse(msg.body);
              //非关注列表
              if (_this.currentType !== 2) {
                // if (
                //   newObj.updateAlert === 1 &&
                //   _this.alertList.filter(item => item.id === newObj.id).length >
                //     0
                // ) {
                if (
                  +newObj.updateAlert &&
                  _this.alertList.filter(item => item.id === newObj.id).length >
                    0
                ) {
                  //更新的警情数据
                  _this.alertList.forEach((item, index) => {
                    if (item.id === newObj.id) {
                      // newObj.isNew = false;
                      if (index === _this.lastActiveItemIndex) {
                        newObj.activeStatus = true;
                      } else {
                        newObj.activeStatus = false;
                      }

                      _this.$set(_this.alertList, index, newObj);
                      _this.bus.$emit('refreshAlarmData', newObj);
                    }
                  });
                  // } else if (newObj.updateAlert !== 1 || newObj.focus === '1') {
                } else if (!+newObj.updateAlert || newObj.focus === '1') {
                  //新的警情数据
                  // newObj.isNew = true;
                  newObj.activeStatus = false;
                  _this.alertList.unshift(newObj);
                  _this.bus.$emit('addNewAlarm');
                  if (_this.lastActiveItemIndex > -1) {
                    _this.lastActiveItemIndex++;
                  }
                  _this.$nextTick(() => {
                    if (
                      sessionStorage.getItem('alarmDetailVisible') !== 'true'
                    ) {
                      _this.showDetail(newObj, 0);
                    }
                  });
                }
              } else {
                //关注列表
                // if (
                //   _this.alertList.filter(item => item.id === newObj.id).length >
                //   0
                // ) {
                //   _this.alertList.forEach((item, index) => {
                //     if (item.id === newObj.id) {
                //       newObj.isNew = false;
                //       newObj.activeStatus = false;
                //       _this.$set(_this.alertList, index, newObj);
                //       _this.bus.$emit('refreshAlarmData', newObj);
                //     }
                //   });
                // } else {
                // }
              }
              // if (
              //   _this.alertList.filter(item => item.id === newObj.id).length > 0
              // ) {
              //   console.log(1);
              // } else {
              //   if (_this.currentType !== 2) {
              //     if(newObj.updateAlert !== 1) {
              //       newObj.isNew = true;
              //       newObj.activeStatus = false;
              //       _this.alertList.unshift(newObj);
              //       _this.bus.$emit('addNewAlarm');
              //       if (_this.lastActiveItemIndex > -1)
              //         _this.lastActiveItemIndex++;
              //       }
              //       _this.$nextTick(() => {
              //         if(!sessionStorage.getItem('alarmDetailVisible')) {
              //           _this.showDetail(newObj, 0)
              //         }
              //       })
              //     }
              //   return;
              // }
              // _this.alertList.forEach((item, index) => {
              //   if (item.id === newObj.id) {
              //     newObj.isNew = false;
              //     newObj.activeStatus = false;
              //     _this.$set(_this.alertList, index, newObj);
              //     _this.bus.$emit('refreshAlarmData', newObj);
              //   }
              // });
            }
          );
        },
        function (error) {
          // 连接发生错误时的处理函数
          console.log('失败');
          console.log(error);
        }
      );
    },
    async buildSocket() {
      const {
        data: { deptIndexCode }
      } = await getCurUser();
      const url = this.sockjsUrl; // 连接地址
      const subUrl = `/topic/${deptIndexCode}`; // 订阅消息地址  客户端的认证信息
      const socket = new SockJS(url); // 建立连接对象（还未发起连接）
      const client = Stomp.over(socket); //  获取 STOMP 子协议的客户端对象
      // 向服务器发起websocket连接并发送CONNECT帧
      client.connect({}, () => {
        client.subscribe(
          subUrl,
          response => {
            // 连接成功的回调函数
            if (response) {
              console.log(JSON.parse(response.body));
              const newObj = JSON.parse(response.body);
              if (
                this.alertList.filter(item => item.id === newObj.id).length > 0
              ) {
                console.log(1);
              } else {
                newObj.isNew = true;
                newObj.activeStatus = false;
                this.alertList.unshift(newObj);
                return;
              }
              this.alertList.forEach(item => {
                if (item.id === newObj.id) {
                  item = newObj;
                }
              });
            }
          },
          error => {
            // 连接失败的回调函数
            //连接失败时再次调用函数
            number += 1;
            if (number <= 10) {
              reconnect(subUrl);
            }
            console.log('error', error);
          }
        );
      });
    },
    createWebSocketInstance: function () {
      this.socket = new WebSocket(this.websocketPath);
      // 监听socket连接
      this.socket.onopen = this.wsOpen;
      // 关闭socket连接
      this.socket.onclose = this.wsClose;
      // 监听socket错误信息
      this.socket.onerror = this.wsError;
      // 监听socket消息
      this.socket.onmessage = this.wsMessage;
    },
    wsOpen: function () {
      console.log('websocket已连接');
    },
    wsClose: function () {
      this.wsReconnect();
      console.log('websocket关闭了');
    },
    wsError: function () {
      this.wsReconnect();
      console.log('websocket连接错误');
    },
    wsReconnect: function () {
      if (wsLock) {
        return;
      }
      wsLock = true;
      setTimeout(() => {
        this.createWebSocketInstance();
        wsLock = false;
      }, 2000);
    },
    wsMessage: function (msg) {
      // 这里要改 根据回来的msg字段
      // let obj = JSON.parse(msg.data)
      // this.alarmList.push(obj)
      if (msg.data !== '连接成功') {
        console.log(JSON.parse(msg.data));
        const newObj = JSON.parse(msg.data);
        if (this.alertList.filter(item => item.id === newObj.id).length > 0) {
          console.log(1);
        } else {
          this.alertList.unshift(newObj);
          return;
        }
        this.alertList.forEach(item => {
          if (item.id === newObj.id) {
            item = newObj;
          }
        });

        // this.bus.$emit('alarmItemAdd', JSON.parse(msg.data));
        // if (this.alarmList.length > 200) {
        //   this.alarmList.pop();
        // }
      }
    }
  },
  async mounted() {
    const { data } = await getPolice();
    this.takeAlarmDeptCode = data[0].deptIndexCode;
    this.fetchListData(this.switchChangeData);
    this.bus.$on('refreshAlarmList', () => {
      this.fetchListData(this.switchChangeData, true);
    });
    this.bus.$on('closeDetail', () => {
      this.alertList[this.lastActiveItemIndex].activeStatus = false;
      this.lastActiveItemIndex = -1;
    });
    this.bus.$on('openNewAlarmDetail', data => {
      let _index = 0;
      for (let i = 0; i < this.alertList.length; i++) {
        if (this.alertList[i].alarmNo === data.alarmNo) {
          _index = i;
          break;
        }
      }
      this.showDetail(data, _index);
    });
    try {
      this.startFetchingAlarmData();
    } catch (err) {
      console.log(err);
      this.loading = false;
      this.startFetchingAlarmData();
    }
  }
};
</script>
<style lang="scss">
.alarm-list-panel {
  .active {
    color: #2080f7;
    border-bottom: 2px #2080f7 solid;
  }
  position: absolute;
  top: 0;
  left: 0;
  width: 430px;
  height: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  z-index: 999;
  .region-sel {
    margin-left: 1rem;
    width: 8rem;
  }
  .region-sel .el-input__inner {
    height: 48px;
    border: 0px;
  }
  .type-sel {
    height: 48px;
    border-bottom: 1px solid #e6e6e6;
    display: flex;
    text-align: center;
    line-height: 48px;
    .type-item {
      width: 143px;
      cursor: pointer;
    }
  }
  .search {
    height: 56px;
    padding: 12px 16px;
    display: flex;
    .el-input--surface .el-input__inner {
      border: 1px solid #b3b3b3;
      background-color: #fff;
    }
    &-input {
      width: 90%;
    }
    &-swap {
      width: 32px;
      height: 32px;
      border: 1px solid #979797;
      border-radius: 2px;
      margin-left: 2%;
      cursor: pointer;
      > i {
        font-size: 30px;
        text-align: center;
      }
    }
  }
  .filter-panel {
    height: 96px;
    // padding: 12px 16px;
    background-image: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.04) 0%,
      rgba(0, 0, 0, 0) 100%
    );
    .time-sel {
      padding: 12px 16px;
    }
    .alarm-type {
      display: flex;
      padding: 0 8px;
      .option-sel {
        margin: 0 8px;
      }
    }
  }
  .list-pane {
    width: 100%;
    flex: 1;
    overflow-y: hidden;
  }
}
.search-slide-enter-active,
.search-slide-leave-active {
  transition: all 0.3s ease;
}
.search-slide-enter,
.search-slide-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
<style lang="scss">
.list-pane-scrollbar-wrap {
  position: relative;
  padding: 25px 0 25px 16px;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
