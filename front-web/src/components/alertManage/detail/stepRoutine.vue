<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-04-06 09:55:36
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-05-13 10:27:09
-->
<template>
  <div class="step-routine">
    <div class="step-routine-title">流程回溯</div>
    <div class="step-routine-detail">
      <div
        v-for="(item, index) in arr"
        :key="index"
        class="step-routine-detail-item"
      >
        <div class="step-routine-detail-item-stepName" v-if="item.step">
          {{ item.step }}
        </div>
        <div class="step-routine-detail-item-normal"><div></div></div>
        <div class="step-routine-detail-item-info">
          {{ item.time }} {{ item.info }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StepRoutine',
  props: {
    alertMes: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      // arr: [
      //   {
      //     step: '分派',
      //     time: '2020/04/12  12:23:29',
      //     info: '接警'
      //   },
      //   {
      //     step: '签收',
      //     time: '2020/04/12  12:23:29',
      //     info: '民警张三000283签收，祥符派出所'
      //   },
      //   {
      //     step: '',
      //     time: '2020/04/12  12:23:29',
      //     info: '民警张三000283签收，祥符派出所'
      //   },
      //   {
      //     step: '到达',
      //     time: '2020/04/12  12:23:29',
      //     info: '到达现场，发送定位'
      //   },
      //   {
      //     step: '',
      //     time: '2020/04/12  12:23:29',
      //     info: '进行身份查询，查询内容'
      //   },
      //   {
      //     step: '',
      //     time: '2020/04/12  12:23:29',
      //     info: '进行身份查询，查询内容'
      //   },
      //   {
      //     step: '',
      //     time: '2020/04/12  12:23:29',
      //     info: '进行身份查询，查询内容'
      //   },
      //   {
      //     step: '反馈',
      //     time: '2020/04/12  12:23:29',
      //     info: '现场反馈'
      //   },
      //   {
      //     step: '',
      //     time: '2020/04/12  12:23:29',
      //     info: '祥符派出所，最终反馈'
      //   },
      //   {
      //     step: '完结',
      //     time: '2020/04/12  12:23:29',
      //     info: '祥符派出所，完结警情'
      //   }
      // ]
      arr: []
    };
  },
  async mounted() {
    await this.initData();
  },
  methods: {
    initData() {
      setTimeout(() => {
        console.log(this.alertMes);
        this.arr.push({
          step: '接警',
          time: this.alertMes.alarmTime,
          info: '接警'
        });
        if (this.alertMes.disposePersonUserId) {
          this.alertMes.disposePersonUserId
            .split('@')
            .forEach((item, index) => {
              this.arr.push({
                step: '',
                time: this.alertMes.assignTime,
                info: `分派警员${
                  (this.alertMes.disposePerson &&
                    this.alertMes.disposePerson.split('@')[index]) ||
                  '未知警员姓名'
                }为处置人员`
              });
            });
        }
      }, 300);
    }
  }
};
</script>

<style lang="scss" scoped>
.step-routine {
  width: 100%;
  height: 100%;
  &-title {
    width: 90%;
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
  &-detail {
    width: 90%;
    height: calc(100% - 60px);
    margin: 0 auto;
    &-item {
      width: 100%;
      height: 55px;
      position: relative;
      &-stepName {
        width: 40px;
        height: 22px;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1000;
        background: #78aaff;
        border-radius: 11px;
        color: white;
        text-align: center;
        line-height: 22px;
      }
      &-info {
        width: calc(100% - 40px);
        height: 100%;
        margin-left: 44px;
      }
      &-normal {
        position: absolute;
        top: 0;
        left: 12px;
        width: 16px;
        height: 16px;
        background: rgba(120, 170, 255, 0.29);
        border-radius: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
        > div {
          width: 8px;
          height: 8px;
          background: rgba(120, 170, 255, 1);
          border-radius: 4px;
        }
      }
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 20px;
        width: 1px;
        height: 100%;
        border-left: 1px dashed rgba(151, 151, 151, 0.35);
      }
    }
  }
}
</style>
