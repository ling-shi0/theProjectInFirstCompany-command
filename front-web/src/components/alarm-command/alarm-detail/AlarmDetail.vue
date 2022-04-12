<!--
 * @Description:
 * @Version:
 * @Autor: wangXiaoMing
 * @Date: 2021-02-25 11:18:32
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-05-18 16:20:27
-->
<template>
  <div class="alarm-detail">
    <transition name="detail-slide">
      <div class="alarm-detail-pane" v-if="showDetail">
        <div class="alarm-detail-pane-title">
          <i class="h-icon-star" v-if="alarmMes.focus === '0'"></i>
          <i class="h-icon-star_f" v-else></i>
          {{ alarmMes.alarmNo }}
          <i class="h-icon-close" @click="closeDetail"></i>
        </div>
        <div>
          <div class="alarm-detail-pane-step">
            <alarm-step
              :itemData="alarmMes"
              :stepName="alarmMes.alarmState"
              :planTime="computedOverTime(alarmMes)"
            ></alarm-step>
          </div>
          <div class="alarm-detail-pane-info">
            <div class="alarm-detail-pane-info-top">
              <div
                class="alarm-detail-pane-info-top-title"
                :title="alarmMes.alarmSituationAddress"
              >
                {{ alarmMes.alarmSituationAddress }}
              </div>
              <div
                class="alarm-detail-pane-info-top-detail"
                :title="alarmMes.alarmComment"
              >
                {{ alarmMes.alarmComment }}
              </div>
            </div>
            <div class="alarm-detail-pane-info-center">
              <div class="alarm-detail-pane-info-center-title">基础信息</div>
              <div class="alarm-detail-pane-info-center-listItems">
                <div class="alarm-detail-pane-info-center-listItems-listItem">
                  <div
                    class="alarm-detail-pane-info-center-listItems-listItem-title"
                  >
                    报警电话:
                  </div>
                  {{ alarmMes.alarmPersonPhone }}
                  <div
                    v-for="(item, index) in alarmPhoneTagArr &&
                    alarmPhoneTagArr.split(',')"
                    :key="index"
                    class="alarm-detail-pane-info-center-listItems-listItem-tag"
                    :style="index === 0 ? 'cursor: pointer' : ''"
                    @click="openHistoryAlarmRecord(item, index)"
                  >
                    {{ sliceItemName(item, index) }}
                  </div>
                </div>
                <div class="alarm-detail-pane-info-center-listItems-listItem">
                  <div
                    style="display: flex"
                    class="alarm-detail-pane-info-center-listItems-listItem-title"
                  >
                    报警录音:
                    <audio-play :audioUrl="alarmMes.recordingsNo"></audio-play>
                  </div>
                </div>
                <div class="alarm-detail-pane-info-center-listItems-listItem">
                  <div
                    class="alarm-detail-pane-info-center-listItems-listItem-title"
                  >
                    警情类别:
                  </div>
                  {{ alarmMes.alarmSituationCategory }}
                </div>
                <div class="alarm-detail-pane-info-center-listItems-listItem">
                  <div
                    class="alarm-detail-pane-info-center-listItems-listItem-title"
                  >
                    受警单位:
                  </div>
                  {{ alarmMes.jurisdictionalDept }}
                </div>
                <div
                  class="alarm-detail-pane-info-center-listItems-listItem"
                  v-if="finishState"
                  style="height: 2em"
                >
                  <div
                    class="alarm-detail-pane-info-center-listItems-listItem-title"
                  >
                    现场反馈:
                  </div>
                  {{ alarmMes.feedback }}
                </div>
                <div
                  class="alarm-detail-pane-info-center-listItems-listItem"
                  v-if="finishState"
                  style="height: 2em"
                >
                  <div
                    class="alarm-detail-pane-info-center-listItems-listItem-title"
                  >
                    最终反馈:
                  </div>
                  {{ alarmMes.finalFeedback }}
                </div>
                <div
                  class="alarm-detail-pane-info-center-listItems-listItem"
                  v-if="finishState"
                >
                  <div
                    class="alarm-detail-pane-info-center-listItems-listItem-title"
                  >
                    图像反馈:
                  </div>
                  <div
                    v-for="(item, picIndex) in alarmMes.feedbackPicUrl &&
                    alarmMes.feedbackPicUrl.split(',').slice(0, 2)"
                    :key="picIndex"
                    style="margin-right: 8px"
                    @click="showPicDetail(picIndex)"
                  >
                    <h-img-view
                      :src="item"
                      mode="contain"
                      style="width: 70px; height: 48px"
                    />
                  </div>
                  <el-button
                    type="link"
                    style="margin: 8px 4px 0"
                    v-if="
                      alarmMes.feedbackPicUrl &&
                      alarmMes.feedbackPicUrl.split(',').length > 3
                    "
                    @click="showPicDetail(0)"
                  >
                    更多 》
                  </el-button>
                </div>
              </div>
            </div>
            <div class="alarm-detail-pane-info-bottom">
              <div class="alarm-detail-pane-info-bottom-title">
                <div
                  style="
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  "
                >
                  警情位置
                  <el-tooltip
                    content="请选择正确的定位作为警情位置"
                    placement="top"
                  >
                    <i
                      class="h-icon-info alarm-detail-pane-info-bottom-title-tip"
                    ></i>
                  </el-tooltip>
                </div>
                <el-button
                  icon="h-icon-location"
                  @click="customLocation"
                  style="color: #2196f3"
                >
                  手动定位
                </el-button>
              </div>
              <div class="alarm-detail-pane-info-bottom-radioList">
                <div
                  class="alarm-detail-pane-info-bottom-radioList-radio"
                  style="height: 24%"
                >
                  <el-radio v-model="chooseRadio" label="-1">
                    {{ '默认定位' }}
                  </el-radio>
                  <span :title="alarmMes.alarmSituationAddress">
                    {{ alarmMes.alarmSituationAddress }}
                  </span>
                </div>
                <div
                  v-for="(item, index) in radioNameList"
                  :key="index"
                  class="alarm-detail-pane-info-bottom-radioList-radio"
                  :style="
                    artificialPositionFlag ? 'height: 24%' : 'height: 30%'
                  "
                  v-if="index !== 0"
                >
                  <el-radio v-model="chooseRadio" :label="index + ''">
                    {{ item }}
                  </el-radio>
                  <span :title="locationName[index]">
                    {{ locationName[index] }}
                  </span>
                </div>
                <div
                  class="alarm-detail-pane-info-bottom-radioList-radio"
                  style="height: 24%"
                  v-if="artificialPositionFlag"
                >
                  <el-radio v-model="chooseRadio" label="3">
                    {{ '手动定位' }}
                  </el-radio>
                  <span :title="locationName[3]">{{ locationName[3] }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="alarm-detail-pane-dealPeople">
            <div class="alarm-detail-pane-dealPeople-title">
              <span class="alarm-detail-pane-dealPeople-title-item">
                处置人员
              </span>
              <el-button
                class="alarm-detail-pane-dealPeople-title-item"
                icon="h-icon-add"
                @click="addDealPerson"
              >
                添加人员
              </el-button>
              <el-button
                class="alarm-detail-pane-dealPeople-title-item"
                icon="h-icon-user"
                @click="advisePerson"
              >
                推荐人员
              </el-button>
              <el-button
                class="alarm-detail-pane-dealPeople-title-item"
                icon="h-icon-telephone"
                @click="doChatWithAudio"
                :disabled="!this.vertoLoginInfo.resId"
              >
                语音群呼
              </el-button>
            </div>
            <div class="alarm-detail-pane-dealPeople-listItems">
              <div
                class="alarm-detail-pane-dealPeople-listItems-item"
                v-for="item in disposePersonArr"
                :key="item.disposePersonUserId"
                @click="showDealPeopleDetail(item)"
              >
                <div class="alarm-detail-pane-dealPeople-listItems-item-left">
                  <div :title="item.disposePerson">
                    {{ item.disposePerson || '未知姓名' }}
                  </div>
                  <div :title="item.disposeDeptCode">
                    {{ item.disposeDeptCode || '未知编号' }}
                  </div>
                </div>
                <div class="alarm-detail-pane-dealPeople-listItems-item-right">
                  <div :title="item.disposePersonPhone">
                    {{ item.disposePersonPhone || '未知电话号' }}
                  </div>
                  <div :title="item.disposeDept">
                    {{ item.disposeDept || '未知部门' }}
                  </div>
                </div>
                <i
                  class="h-icon-close_sm alarm-detail-pane-dealPeople-listItems-item-closeItem"
                  @click.stop="deleteDisposePerson(item.disposePersonUserId)"
                ></i>
              </div>
            </div>
          </div>
          <div class="alarm-detail-pane-alarmPeople">
            <div class="alarm-detail-pane-alarmPeople-title">
              报警对象
              <el-button icon="h-icon-details" @click="goToDocument">
                全息档案
              </el-button>
            </div>
            <div
              class="alarm-detail-pane-alarmPeople-info"
              @click="addAlarmPersonPop"
            >
              <div class="alarm-detail-pane-alarmPeople-info-img">
                <h-img-view
                  :src="alarmMes.alarmPersonFaceUrl"
                  mode="contain"
                  style="width: 48px; height: 48px"
                />
              </div>
              <div class="alarm-detail-pane-alarmPeople-info-mes">
                {{ alarmMes.alarmPersonName }}
                {{ alarmMes.alarmPersonCertificateNumber }}
                <div class="alarm-detail-pane-alarmPeople-info-mes-tags">
                  <div
                    class="alarm-detail-pane-alarmPeople-info-mes-tags-tag"
                    v-for="(item, index) in alarmMes.alarmPersonTag &&
                    alarmMes.alarmPersonTag.split(',').slice(0, 3)"
                    :key="index"
                  >
                    {{ item }}
                  </div>
                  <div
                    class="alarm-detail-pane-alarmPeople-info-mes-tags-tag"
                    v-if="
                      alarmMes.alarmPersonTag &&
                      alarmMes.alarmPersonTag.split(',').length > 3
                    "
                    :title="
                      alarmMes.alarmPersonTag &&
                      alarmMes.alarmPersonTag.split(',').slice(3).join(',')
                    "
                  >
                    ...
                  </div>
                </div>
              </div>
            </div>
            <div class="alarm-detail-pane-alarmPeople-phone">
              <i class="h-icon-telephone"></i>
              联系方式&nbsp;
              <div class="alarm-detail-pane-alarmPeople-phone-num">
                {{ alarmMes.alarmPersonPhone }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <place-find-search></place-find-search>
    <history-alarm-record
      :historyAlarmRecordVisible="historyAlarmRecordVisible"
      @closeHistoryDialog="closeHistoryDialog"
      :alarmMes="alarmMes"
    ></history-alarm-record>
    <add-deal-person
      :visible.sync="addDealPersonVisible"
      :alarmMes="alarmMes"
    ></add-deal-person>
    <h-img-preview
      ref="single"
      :data="urls"
      :current-index="currentIndex"
      :visible.sync="previewShow"
    />
  </div>
</template>

<script>
import PlaceFindSearch from '@/components/alarm-command/PlaceFindSearch';
import AlarmStep from './AlarmStep';
import AudioPlay from './AudioPlay';
import HistoryAlarmRecord from './HistoryAlarmRecord';
import AddDealPerson from './AddDealPerson.vue';
import { getUsersByAcount, modGroup } from '@/api/InfoCenter/infoCenter';
import {
  getAdvisePersonInfo,
  getInitConfig,
  ModDealPerson,
  getAlarmPositiones,
  getOneAlarmPosition,
  deleteAlarmPosition,
  setAlarmPosition,
  getHistoryAlarm
} from '@/api/alarmCommand';
import callPanelMixin from '@/mixins/InfoCenter/callPanelMixin';
import { mapMutations, mapState } from 'vuex';
export default {
  name: 'AlarmDetail',
  components: {
    PlaceFindSearch,
    AlarmStep,
    AudioPlay,
    HistoryAlarmRecord,
    AddDealPerson
  },
  computed: {
    ...mapState(['groupUsers', 'chatUsers', 'initConfigData'])
  },
  mounted() {
    this.bus.$on('changeDetail', ({ detailShow, alarmMes }) => {
      this.showDetail = detailShow;
      !detailShow && this.bus.$emit('deleteAlarmPositionMarker');
      if (detailShow) {
        this.$set(this, 'alarmMes', alarmMes);
        this.initAlarmPhoneTagArr(alarmMes);
        this.$set(this.locationName, '-1', this.alarmMes.alarmSituationAddress);
        this.finishState = alarmMes.alarmState === '完结';
        this.setDisposeArrVal(alarmMes);
        this.setAlarmPosition();
        this.setAlarmStatusMes({
          alarmNo: alarmMes.alarmNo,
          visible: detailShow
        });
      }
      sessionStorage.setItem('alarmDetailVisible', detailShow);
    });
    this.bus.$on('deleteDealPeople', data => {
      this.deleteDisposePerson(data);
    });
    this.bus.$on('saveAndAddNewDealPeople', data => {
      this.saveNewDealPerson(data);
    });
    this.bus.$on('deleteAlarmPosition', data => {
      this.deleteAlarmPosition(data);
    });
    this.bus.$on('setAlarmPosition', data => {
      this.setNewAlarmPosition(data);
    });
    this.bus.$on('refreshAlarmData', data => {
      if (data.isMonitorRefresh && data.alarmNo === this.alarmMes.alarmNo) {
        this.$set(this.alarmMes, 'focus', data.focus + '');
      } else {
        if (data.id === this.alarmMes.id) {
          this.$set(this, 'alarmMes', data);
          this.$set(
            this.locationName,
            '-1',
            this.alarmMes.alarmSituationAddress
          );
          this.setDisposeArrVal(this.alarmMes);
        }
      }
    });
  },
  mixins: [callPanelMixin],
  watch: {
    chooseRadio(val) {
      let radioNameMap = {
        '-1': 'alarmCenterPosition',
        0: 'phonePosition',
        1: 'mapStorePosition',
        2: 'scencePosition',
        3: 'artificialPosition'
      };
      if (val === '-1') {
        this.bus.$emit('setNewCenter', this.alarmMes, this.dontSetSenter);
      } else {
        getOneAlarmPosition({
          alertId: this.alarmMes.id,
          type: val
        }).then(({ data }) => {
          this.$emit('alarmPositionChange', {
            type: radioNameMap[val],
            itemMes: data,
            dontSetSenter: this.dontSetSenter
          });
          this.dontSetSenter = false;
          radioNameMap = null;
        });
      }
    }
  },
  data() {
    return {
      showDetail: false,
      alarmMes: {},
      radioNameList: ['手机定位', '地址库解析定位', '现场处置定位'],
      locationName: [],
      chooseRadio: '-1',
      historyAlarmRecordVisible: false,
      addDealPersonVisible: false,
      artificialPositionFlag: false,
      finishState: false,
      disposePersonArr: [],
      urls: [],
      previewShow: false,
      currentIndex: 0,
      dontSetSenter: false,
      alarmPhoneTagArr: ''
    };
  },
  methods: {
    ...mapMutations(['setAlarmStatusMes']),
    //手动定位
    customLocation() {
      this.bus.$emit('customLocation', this.alarmMes);
    },
    openHistoryAlarmRecord(item, index) {
      if (index === 0) {
        this.historyAlarmRecordVisible = true;
      }
    },
    closeHistoryDialog() {
      this.historyAlarmRecordVisible = false;
    },
    addDealPerson() {
      this.addDealPersonVisible = true;
    },
    async advisePerson() {
      const { data } = await getAdvisePersonInfo({
        alarmNo: this.alarmMes.alarmNo
      });
      this.$emit('addAdvisePersonPop', data);
      if (data.length == 0) {
        this.$message.warning('无推荐人员');
      }
    },
    addAlarmPersonPop() {
      this.$emit('addAlarmPersonPop', Object.create(this.alarmMes));
    },
    showDealPeopleDetail(item) {
      this.$emit('showDealPeopleDetail', item);
    },
    async goToDocument() {
      const { data } = await getInitConfig();
      const url = data.qxdaAddr + this.alarmMes.alarmPersonCertificateNumber;
      if (top === window) {
        window.open(url);
        return false;
      }
      const param = {
        componentId: '',
        componentMenuId: '',
        param: '',
        url,
        name: '全息档案',
        callback: {
          func: '',
          param: {}
        },
        reload: true
      };
      top.window.goToApp(param);
    },
    // 语音群聊
    async doChatWithAudio() {
      // this.disposePersonArr = [
      //   {
      //     disposePersonUserId: 'xmessage3',
      //     disposePerson: 'xmessage测试3',
      //     disposeDept: '部门/xmessageTest'
      //   },
      //   {
      //     disposePersonUserId: 'xmessage2',
      //     disposePerson: 'xmessage测试2',
      //     disposeDept: '部门/xmessageTest'
      //   }
      // ];
      if (this.isHangupStatus) {
        await this.handleCreateGroup({
          creator: this.vertoLoginInfo.resId,
          members: this.vertoLoginInfo.resId,
          name: this.vertoLoginInfo.name + '...'
        });

        for (let i = 0; i < this.disposePersonArr.length; i++) {
          const { data } = await getUsersByAcount({
            account: this.disposePersonArr[i].disposePersonUserId
          });
          if (data) {
            const { resId, name, number, deptPath, displayNumber } = data;
            const memberExit = this.memberExits(resId);
            if (memberExit) return;
            await this.handleAddMember(data);
          }
        }
        this.setDisplayAudioPanel(true);
      } else {
        this.$message({
          type: 'info',
          message: '请先结束当前语音通话'
        });
      }
    },
    deleteDisposePerson(policeUserIds) {
      this.$confirm(`确认删除该处置人员?`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        onConfirm: () => {
          ModDealPerson({
            policeUserIds:
              this.disposePersonArr.length === 1 ? '' : policeUserIds,
            alertId: this.alarmMes.id,
            type: 'del'
          }).then(data => {
            this.bus.$emit('refreshAlarmList');
            this.$message.success('删除成功!');
            this.bus.$emit('changePolicePopSta');
          });
        },
        onCancel: () => {}
      });
    },
    setDisposeArrVal(alarmMes) {
      let arr = [];
      alarmMes.disposePersonUserId &&
        alarmMes.disposePersonUserId.split('@').forEach((item, index) => {
          arr.push({
            disposePersonUserId: item,
            disposePerson:
              this.alarmMes.disposePerson &&
              this.alarmMes.disposePerson.split('@')[index],
            disposeDept:
              this.alarmMes.disposeDept &&
              this.alarmMes.disposeDept.split('@')[index],
            disposeDeptCode:
              this.alarmMes.disposeDeptCode &&
              this.alarmMes.disposeDeptCode.split('@')[index],
            disposePersonPhone:
              this.alarmMes.disposePersonPhone &&
              this.alarmMes.disposePersonPhone.split('@')[index]
          });
        });
      this.$set(this, 'disposePersonArr', arr);
      arr = null;
    },
    saveNewDealPerson(policeUserIds) {
      if (
        this.disposePersonArr.filter(
          item => item.disposePersonUserId === policeUserIds
        ).length > 0
      ) {
        this.$message.warning('已存在该处置人员！');
        return;
      }
      ModDealPerson({
        policeUserIds: policeUserIds,
        alertId: this.alarmMes.id,
        type: 'add'
      }).then(data => {
        this.$message.success('保存成功!');
        // this.bus.$emit('refreshAlarmList');
        this.addDealPersonVisible = false;
        this.bus.$emit('changePolicePopSta');
      });
    },
    setAlarmPosition(dontSetSenter) {
      this.artificialPositionFlag = false;
      this.chooseRadio = '-1';
      this.$set(this, 'locationName', []);
      getAlarmPositiones({ alertId: this.alarmMes.id }).then(({ data }) => {
        let firstItem = null;
        data &&
          data.list.forEach(item => {
            this.$set(this.locationName, item.type, item.address);
            if (item.type === 1) {
              firstItem = item;
            }
            if (item.type === 3) {
              if (dontSetSenter) {
                this.dontSetSenter = true;
                this.$nextTick(() => {
                  this.artificialPositionFlag = true;
                  this.chooseRadio = '3';
                });
              } else {
                this.artificialPositionFlag = true;
                this.chooseRadio = '3';
              }
            }
          });
        if (firstItem && firstItem.address && !this.artificialPositionFlag) {
          this.$emit('alarmPositionChange', {
            type: 'mapStorePosition',
            itemMes: firstItem
          });
        } else if (this.artificialPositionFlag) {
          return;
        } else {
          this.bus.$emit('setNewCenter', this.alarmMes);
          this.chooseRadio = '-1';
        }
        firstItem = null;
      });
    },
    deleteAlarmPosition(data) {
      deleteAlarmPosition({ ...data }).then(data => {
        this.$message.success('删除成功!');
        this.setAlarmPosition();
      });
    },
    setNewAlarmPosition(mes) {
      setAlarmPosition({ ...mes, alertId: this.alarmMes.id }).then(data => {
        this.$message.success('添加成功!');
        this.bus.$emit('deleteSearchPositionMarker');
        this.setAlarmPosition(mes.dontSetSenter);
      });
    },
    computedOverTime(item) {
      let planTime;
      const status = [
        {
          label: '接警',
          value: 'alarmTime'
        },
        {
          label: '分派',
          value: 'assignTime'
        },
        {
          label: '签收',
          value: 'signTime'
        },
        {
          label: '到达',
          value: 'arriveTime'
        },
        {
          label: '反馈',
          value: 'feedBackTime'
        },
        {
          label: '完结',
          value: 'endTime'
        }
      ];
      const currentStatusTime = status
        .slice()
        .filter(obj => obj.label === item.alarmState)[0].value;
      if (item[currentStatusTime]) {
        planTime =
          new Date(item[currentStatusTime].replace(/-/g, '/')).getTime() +
          1000 * this.initConfigData.overTime * 60;
      }
      return planTime;
    },
    showPicDetail(index) {
      this.urls =
        this.alertMes.feedbackPicUrl && this.alertMes.feedbackPicUrl.split(',');
      this.currentIndex = index;
      this.previewShow = true;
    },
    closeDetail() {
      this.showDetail = false;
      sessionStorage.setItem('alarmDetailVisible', false);
      this.bus.$emit('closeDetail');
      this.bus.$emit('deleteAlarmPositionMarker');
    },
    sliceItemName(item, index) {
      if (item.length === 0) {
        return index === 0 ? '历史警情0次' : '重复报警0次';
      }
      if (item.length > 7) {
        return (index === 0 ? '历史' : '重复') + item.slice(4);
      } else {
        return item;
      }
    },
    initAlarmPhoneTagArr(item) {
      this.alarmPhoneTagArr = '';
      if (item.alarmPersonPhone) {
        getHistoryAlarm({
          phone: item.alarmPersonPhone,
          alarmNo: item.alarmNo
        }).then(({ data }) => {
          this.alarmPhoneTagArr = data;
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.alarm-detail {
  width: 745px;
  height: 820px;
  // height: calc(100% - 150px);
  position: absolute;
  left: 438px;
  top: 55px;
  display: flex;
  pointer-events: none;
  z-index: 999;
  &-pane {
    width: 416px;
    height: 100%;
    background: #ffffff;
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.29);
    border-radius: 2px;
    margin-right: 8px;
    pointer-events: auto;
    &-title {
      width: 100%;
      height: 40px;
      background-image: linear-gradient(270deg, #43b7fc 0%, #2080f7 100%);
      border-radius: 2px 2px 100px 100px;
      font-size: 14px;
      color: #ffffff;
      display: flex;
      align-items: center;
      text-indent: 16px;
      position: relative;
      > i {
        font-size: 1.5rem;
        margin-right: 14px;
      }
      > i:last-child {
        position: absolute;
        right: 0;
        cursor: pointer;
      }
    }
    > div:last-child {
      width: 100%;
      height: calc(100% - 40px);
      overflow-y: auto;
      overflow-x: hidden;
      .alarm-detail-pane-step {
        width: 382px;
        height: 78px;
        margin: 12px auto 8px;
      }
      .alarm-detail-pane-info {
        width: 382px;
        margin: 8px auto 4px;
        &-top {
          width: 100%;
          height: 93.5px;
          border: 1px solid #dadada;
          border-radius: 4px;
          border-bottom: none;
          position: relative;
          &-title {
            width: 100%;
            height: 50px;
            font-size: 18px;
            color: #4d4d4d;
            font-weight: bold;
            // display: flex;
            // align-items: center;
            line-height: 50px;
            text-indent: 17px;
            @include utils-ellipsis();
          }
          &-detail {
            width: 95%;
            height: 42px;
            color: rgba(77, 77, 77, 0.7);
            text-indent: 17px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: normal;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            padding-left: 17px;
          }
          &::after {
            content: '';
            width: 95%;
            height: 1px;
            border-top: 1px dashed #dadada;
            position: absolute;
            bottom: 0;
            left: 2.5%;
          }
        }
        &-center {
          width: 100%;
          border: 1px solid #dadada;
          border-radius: 4px;
          border-bottom: none;
          border-top: none;
          &-title {
            width: 100%;
            height: 30px;
            line-height: 30px;
            font-size: 14px;
            color: #4d4d4d;
            font-weight: bold;
            text-indent: 17px;
          }
          &-listItems {
            width: 100%;
            &-listItem {
              height: 30px;
              display: flex;
              &-title {
                font-size: 14px;
                color: rgba(77, 77, 77, 0.7);
                text-indent: 17px;
                margin-right: 8px;
              }
              &-tag {
                width: 88px;
                height: 24px;
                margin-left: 12px;
                background: rgba(32, 128, 247, 0.1);
                border: 1px solid #2080f7;
                border-radius: 2px;
                font-size: 12px;
                color: #2080f7;
                text-align: center;
                line-height: 22px;
                // cursor: pointer;
              }
            }
          }
        }
        &-bottom {
          width: 100%;
          height: 110px;
          border: 1px solid #dadada;
          border-radius: 4px;
          border-top: none;
          position: relative;
          &-title {
            width: 100%;
            height: 30px;
            line-height: 30px;
            font-size: 14px;
            color: #4d4d4d;
            font-weight: bold;
            text-indent: 17px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            &-tip {
              color: #7ab8ff;
              font-size: 1.5rem;
              text-indent: 0;
              margin-left: 6px;
              line-height: 33px;
            }
          }
          &::before {
            content: '';
            width: 95%;
            height: 1px;
            border-top: 1px dashed #dadada;
            position: absolute;
            top: 0;
            left: 2.5%;
          }
          &-radioList {
            width: 100%;
            height: calc(100% - 30px);
            display: flex;
            flex-direction: column;
            align-items: space-around;
            padding-left: 15px;
            padding-right: 13px;
            &-radio {
              display: flex;
              justify-content: space-between;
              align-items: center;
              > span {
                display: block;
                width: 200px;
                text-align: right;
                @include utils-ellipsis();
              }
            }
          }
        }
      }
      .alarm-detail-pane-dealPeople {
        width: 382px;
        height: 172px;
        border: 1px solid #dadada;
        border-radius: 4px;
        margin: 8px auto 4px;
        &-title {
          display: flex;
          height: 30px;
          &-item {
            width: 23%;
            padding: 0;
            > button {
              padding: 0;
            }
            &:first-child {
              line-height: 32px;
              text-indent: 17px;
              font-size: 14px;
              color: #4d4d4d;
              font-weight: bold;
            }
          }
        }
        &-listItems {
          width: 100%;
          height: calc(100% - 30px);
          padding: 0 15px 15px;
          display: flex;
          align-items: space-around;
          justify-content: space-between;
          flex-wrap: wrap;
          overflow-y: auto;
          &-item {
            height: 45%;
            width: 45%;
            background: #f8fbff;
            border: 1px solid #7ab8ff;
            border-radius: 2px;
            position: relative;
            margin-top: 12px;
            display: flex;
            align-items: center;
            cursor: pointer;
            &-left {
              width: 40%;
              height: 85%;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              border-right: 1px dashed #7ab8ff;
              > div:first-child {
                font-size: 14px;
                color: #5b5b5b;
                font-weight: bold;
                width: 85%;
                text-align: center;
                line-height: 14px;
                height: 1.5em;
                @include utils-ellipsis();
              }
              > div:last-child {
                font-size: 12px;
                color: #5b5b5b;
                width: 85%;
                text-align: center;
                line-height: 12px;
                height: 1.5em;
                @include utils-ellipsis();
              }
            }
            &-right {
              width: 65%;
              height: 85%;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              > div {
                font-size: 12px;
                color: #4d4d4d;
                width: 85%;
                text-align: center;
                line-height: 12px;
                height: 1.5em;
                @include utils-ellipsis();
              }
            }
            &-closeItem {
              width: 12px;
              height: 12px;
              border-radius: 6px;
              background: #79b5ff;
              color: white;
              position: absolute;
              top: -4.5px;
              right: -4.5px;
              cursor: pointer;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          }
        }
      }
      .alarm-detail-pane-alarmPeople {
        width: 382px;
        height: 124px;
        border: 1px solid #dadada;
        border-radius: 4px;
        margin: 8px auto 4px;
        &-title {
          height: 30px;
          font-size: 14px;
          line-height: 30px;
          text-indent: 17px;
          color: #4d4d4d;
          font-weight: bold;
          display: flex;
          justify-content: space-between;
        }
        &-info {
          width: 100%;
          height: 55px;
          display: flex;
          margin-top: 10px;
          cursor: pointer;
          &-img {
            width: 48px;
            height: 48px;
            margin: 0px 12px 0 17px;
          }
          &-mes {
            width: calc(100% - 77px);
            height: 100%;
            &-tags {
              width: 100%;
              height: 24px;
              display: flex;
              align-items: center;
              margin-top: 8px;
              &-tag {
                width: 21%;
                height: 100%;
                background: rgba(255, 51, 51, 0.1);
                border: 1px solid #ff3333;
                border-radius: 2px;
                font-size: 12px;
                color: #ff3333;
                text-align: center;
                line-height: 22px;
                margin-right: 8px;
              }
            }
          }
        }
        &-phone {
          width: 80%;
          height: 20px;
          display: flex;
          align-items: center;
          padding-left: 70px;
          > i {
            font-size: 1.5rem;
          }
          &-num {
            margin-left: 6px;
            color: rgba(77, 77, 77, 0.7);
          }
        }
      }
    }
  }
}
.detail-slide-enter-active,
.detail-slide-leave-active {
  transition: all 0.3s ease;
}
.detail-slide-enter,
.detail-slide-leave-to {
  transform: translateX(-10px);
  opacity: 0;
}
</style>
