<!--
 * @Description:
 * @Version: 2.0
 * @Autor: caokeke
 * @Date: 2021-02-21 14:10:07
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-04-15 14:10:22
-->
<template>
  <div class="command-map">
    <map-res
      :resourceTypeData="resourceTypeData"
      :alarmListItemData="alarmListItemData"
      :alarmPositionData="alarmPositionData"
      :alarmPersonPopData="alarmPersonPopData"
      :dealPeopleDetailData="dealPeopleDetailData"
      :advisePersonData="advisePersonData"
    ></map-res>
    <alarm-list @departmentChange="departmentChange"></alarm-list>
    <general-situation :departIndexCode="departIndexCode"></general-situation>
    <resource-type
      @resourceTypeDataChange="resourceTypeDataChange"
    ></resource-type>
    <info-center></info-center>
    <alarm-detail
      @alarmPositionChange="alarmPositionChange"
      @addAlarmPersonPop="addAlarmPersonPop"
      @showDealPeopleDetail="showDealPeopleDetail"
      @addAdvisePersonPop="addAdvisePersonPop"
    ></alarm-detail>
    <around-video-point></around-video-point>
    <around-video-list></around-video-list>
  </div>
</template>
<script>
import { positionPolice } from '@/api/alarmCommand.js';
import MapRes from '@/components/map/map-select-res.vue';
import AlarmList from '@/components/alarm-command/alarm-list/AlarmList.vue';
import GeneralSituation from '@/components/alarm-command/GeneralSituation.vue';
import ResourceType from '@/components/alarm-command/ResourceType.vue';
import InfoCenter from '@/components/info-center/infoCenter.vue';
import AlarmDetail from '@/components/alarm-command/alarm-detail/AlarmDetail.vue';
import AroundVideoPoint from '@/components/alarm-command/around-video-point/AroundVideoPoint.vue';
import AroundVideoList from '@/components/alarm-command/around-video-point/AroundVideoList';
import { mapOfDataAndLabel } from '@/components/alarm-command/alarmListConstant';

export default {
  name: 'Hello',
  components: {
    MapRes,
    AlarmList,
    GeneralSituation,
    ResourceType,
    InfoCenter,
    AlarmDetail,
    AroundVideoPoint,
    AroundVideoList
  },
  props: {
    breadcrumbObj: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      resourceTypeData: [],
      alarmListItemData: {},
      departIndexCode: '',
      alarmPositionData: {},
      alarmPersonPopData: {},
      dealPeopleDetailData: {},
      advisePersonData: {}
    };
  },
  mounted() {
    // 增加刷新监听器删除sessionStorage的存值
    window.addEventListener('beforeunload', e => this.removeSession(e));
  },
  destroyed() {
    window.removeEventListener('beforeunload', e => this.removeSession(e));
  },
  methods: {
    /*
     * 资源上图数据接收传递
     */
    resourceTypeDataChange(data) {
      const mapDataObj = [];
      data.forEach(item => {
        mapDataObj.push(mapOfDataAndLabel[item]);
      });
      this.resourceTypeData = mapDataObj;
    },
    /**
     * 警情列表数据点击传递
     */
    alarmListChangeCenter(item) {
      this.$set(this, 'alarmListItemData', item);
    },
    /**
     * 所选部门更改传递
     */
    departmentChange(departIndexCode) {
      this.departIndexCode = departIndexCode;
    },
    /**
     * 警情详情部分的警情位置部分数据更改传递
     */
    alarmPositionChange(val) {
      this.$set(this, 'alarmPositionData', {
        type: val.type,
        ...val
      });
    },
    /**
     * 报警人员弹窗部分信息传递
     */
    addAlarmPersonPop(data) {
      this.$set(this, 'alarmPersonPopData', data);
      this.$set(
        this.alarmPersonPopData,
        'clickFlag',
        this.alarmPersonPopData.clickFlag ? 0 : 1
      );
    },
    /**
     * 处置人员列表项点击后的详情展示
     */
    showDealPeopleDetail(item) {
      positionPolice(item.disposePersonUserId).then(({ data }) => {
        this.$set(this, 'dealPeopleDetailData', {
          type: 'db',
          mes: data
        });
      });
    },
    /**
     * 推荐人员数据传递
     */
    addAdvisePersonPop(data) {
      this.$set(this, 'advisePersonData', {
        type: 'db',
        mes: data
      });
    },
    removeSession() {
      sessionStorage.removeItem('alarmDetailVisible');
    }
  }
};
</script>
<style lang="scss" scoped>
.command-map {
  height: 100%;
  width: 100%;
  position: relative;
}
</style>
