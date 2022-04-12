<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-03-31 13:51:13
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-05-06 20:03:56
-->
<template>
  <div class="alarm-person">
    <div class="alarm-person-title">涉警人员</div>
    <div class="alarm-person-imgs">
      <div
        class="alarm-person-imgs-item"
        v-for="(item, index) in policeArr"
        :key="index"
      >
        <div class="alarm-person-imgs-item-img"></div>
        <div class="alarm-person-imgs-item-info">
          <div>
            <div :title="item.alarmPersonName">
              {{ item.alarmPersonName }}
            </div>
            <div v-if="item.isAlarmPerson">报警人</div>
          </div>
          <div>{{ item.alarmPersonCertificateNumber || '未知身份证号' }}</div>
          <div
            class="alarm-person-imgs-item-info-tags"
            v-if="item.alarmPersonTag"
          >
            <div class="alarm-person-imgs-item-info-tags-tag">
              {{ item.alarmPersonTag.split(',')[0] }}
            </div>
            <div
              class="alarm-person-imgs-item-info-tags-tag"
              :title="item.alarmPersonTag"
              v-if="item.alarmPersonTag.split(',').length > 1"
            >
              ...
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AlarmPerson',
  props: {
    alertMes: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      policeArr: []
    };
  },
  watch: {
    alertMes() {
      this.initData();
    }
  },
  methods: {
    initData() {
      this.alertMes.isAlarmPerson = true;
      this.policeArr.push(this.alertMes);
    }
  }
};
</script>

<style lang="scss" scoped>
.alarm-person {
  width: 100%;
  height: 100%;
  &-title {
    width: 95%;
    height: 60px;
    font-size: 14px;
    color: #4d4d4d;
    font-weight: bold;
    position: relative;
    line-height: 60px;
    text-indent: 8px;
    margin: 0 auto;
    &::before {
      content: '';
      position: absolute;
      top: 28px;
      left: 0;
      width: 4px;
      height: 4px;
      border-radius: 2px;
      border: 1px solid #2080f7;
      box-shadow: 0 0 4px 0 rgba(32, 128, 247, 0.3);
    }
  }
  &-imgs {
    width: 95%;
    height: calc(100% - 60px);
    overflow-y: auto;
    margin: 0 auto;
    &-item {
      width: 23%;
      height: 102px;
      margin-right: 1%;
      margin-bottom: 16px;
      background: #ffffff;
      border: 1px solid #dfdfdf;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      &-img {
        width: 34%;
        height: 80px;
        margin-right: 6%;
        border: 1px solid #ebecf0;
        border-radius: 1px;
      }
      &-info {
        width: 45%;
        height: 80px;
        > div {
          margin-bottom: 8px;
        }
        > div:first-child {
          font-size: 16px;
          color: #4d4d4d;
          font-weight: bold;
          position: relative;
          > div:first-child {
            width: 52px;
            height: 22px;
            @include utils-ellipsis();
          }
          > div:last-child {
            width: 48px;
            height: 22px;
            background: rgba(245, 166, 35, 0.1);
            border-radius: 2px;
            font-size: 12px;
            color: #f5a623;
            text-align: center;
            line-height: 22px;
            position: absolute;
            left: 52px;
            top: 0;
          }
        }
        &-tags {
          width: 100%;
          height: 24px;
          display: flex;
          align-items: center;
          &-tag {
            width: 60%;
            height: 100%;
            margin-right: 2px;
            background: rgba(255, 51, 51, 0.1);
            border: 1px solid #ff3333;
            border-radius: 2px;
            font-size: 12px;
            color: #ff3333;
            text-align: center;
            line-height: 20px;
          }
        }
      }
    }
  }
}
</style>
