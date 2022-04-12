<!--
 * @Description:
 * @Version:
 * @Autor: wangXiaoMing
 * @Date: 2021-02-22 10:25:22
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-05-13 10:28:13
-->
<template>
  <div
    class="alert-list-item"
    :class="
      !+itemData.readType
        ? 'newAlarm'
        : itemData.activeStatus
        ? 'activeItem'
        : ''
    "
  >
    <div class="alert-list-item-top">
      <div
        class="alert-list-item-top-itemType"
        :class="itemType[itemData.alarmLevel - 1].style"
        :title="itemData.alarmSituationCategory"
      >
        <div>
          <div>
            <div
              :style="
                getFontStyle(
                  itemData.alarmSituationCategory &&
                    itemData.alarmSituationCategory.length
                )
              "
            >
              {{ itemData.alarmSituationCategory }}
            </div>
          </div>
        </div>
      </div>
      <div class="alert-list-item-top-title">
        <div class="alert-list-item-top-title-alarmNo">
          <div>{{ itemData.alarmTime }}</div>
          <div title="警情编号">
            {{ itemData.alarmNo || '未知编号' }}
            <i
              class="h-icon-copy"
              @click.stop="copyToClip(itemData.alarmNo)"
              v-if="itemData.alarmNo"
            ></i>
          </div>
        </div>
        <i
          class="h-icon-star"
          @click.stop="addMonitor(1)"
          v-if="itemData.focus === '0'"
        ></i>
        <i
          class="h-icon-star_f"
          @click.stop="addMonitor(0)"
          style="color: #2080f7"
          v-else
        ></i>
      </div>
      <div class="alert-list-item-top-step">
        <span :title="itemData.takeAlarmDept">
          {{ itemData.takeAlarmDept || '未知部门' }}
        </span>
        <operation-step
          :step="dealSteps[itemData.alarmState || '接警']"
          :overTime="judgeIsOverTime(itemData)"
          :planTime="computedOverTime(itemData)"
        ></operation-step>
      </div>
    </div>
    <div class="alert-list-item-bottom">
      <div class="alert-list-item-bottom-title">
        <span :title="itemData.alarmSituationAddress">
          {{ itemData.alarmSituationAddress }}
        </span>
      </div>
      <div class="alert-list-item-bottom-detail" :title="itemData.alarmComment">
        {{ itemData.alarmComment }}
      </div>
      <div class="alert-list-item-bottom-peopleType">
        <div
          v-for="(item, index) in itemData.alarmPersonTag &&
          itemData.alarmPersonTag.split(',').slice(0, 3)"
          :key="index"
        >
          <span :title="item">{{ item }}</span>
        </div>
        <div
          v-if="
            itemData.alarmPersonTag &&
            itemData.alarmPersonTag.split(',').length > 3
          "
          :title="
            itemData.alarmPersonTag &&
            itemData.alarmPersonTag.split(',').slice(3).join(',')
          "
        >
          <span>.....</span>
        </div>
      </div>
    </div>
    <div class="alert-list-item-divider"><div></div></div>
  </div>
</template>

<script>
import OperationStep from '@/components/alertManage/operationStep';
import { dealSteps, itemTypeOptions } from './alertManageConstant';
import { mapState } from 'vuex';
export default {
  name: 'AlertListItem',
  props: {
    itemData: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  computed: {
    ...mapState(['initConfigData'])
  },
  components: {
    OperationStep
  },
  data() {
    return {
      itemType: itemTypeOptions,
      dealSteps,
      overTimeLength: 0
    };
  },
  methods: {
    copyToClip(content) {
      const aux = document.createElement('input');
      aux.setAttribute('value', content);
      document.body.appendChild(aux);
      aux.select();
      document.execCommand('copy');
      document.body.removeChild(aux);
      this.$message.success('复制成功');
    },
    addMonitor(focus) {
      this.$confirm(`确认${focus ? '关注' : '取消关注'}该警情?`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        onConfirm: () => {
          this.$emit('addFocus', { focus, alarmNo: this.itemData.alarmNo });
        },
        onCancel: () => {}
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

      //测试
      // planTime =
      //   new Date(item.alarmTime.replace(/-/g, '/')).getTime() + 1000 * 5 * 60;
      return planTime;
    },
    judgeIsOverTime(item) {
      /**
       * 应该还会存在问题 如果没有到达时间怎么判断 现在是判断如果没到达时间就定为当前时间
       */
      let { arriveTime, signTime } = item;
      if (!arriveTime) {
        arriveTime = new Date();
      }
      if (new Date(signTime) - new Date(arriveTime) > this.overTimeLength) {
        return true;
      } else {
        return false;
      }
    },
    getFontStyle(len) {
      let sizeMap = {
        1: '16px',
        2: '16px',
        3: '16px',
        4: '14px',
        5: '14px',
        6: '12px',
        7: '12px',
        8: '8px'
      };
      let widthMap = {
        1: '48px',
        2: '48px',
        3: '48px',
        4: '2rem',
        5: '2.6rem',
        6: '2.6rem',
        7: '3.3rem',
        8: '3.3rem'
      };
      let paddingTop = len >= 4 ? '6px' : '0';
      let styleStr = `font-size: ${
        sizeMap[len] || '8px'
      };padding-top: ${paddingTop};width: ${widthMap[len]}`;
      return styleStr;
    }
  }
};
</script>

<style lang="scss" scoped>
.alert-list-item {
  width: 398px;
  height: 212px;
  background: white;
  position: relative;
  &-top {
    width: 100%;
    height: 79px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    border: 1px solid #dadada;
    position: relative;
    overflow: hidden;
    &-itemType {
      width: 60px;
      height: 60px;
      border-radius: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: -16px;
      left: -8px;
      > div {
        width: 54px;
        height: 54px;
        border-radius: 27px;
        display: flex;
        justify-content: center;
        align-items: center;
        > div {
          width: 48px;
          height: 48px;
          border-radius: 24px;
          font-size: 16px;
          display: flex;
          justify-content: center;
          align-items: center;
          > div {
            padding-top: 2px;
            width: 2rem;
            height: 48px;
            color: #ffffff;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            text-align: center;
          }
        }
      }
    }
    &-title {
      margin-left: 60px;
      margin-top: 4px;
      display: flex;
      align-items: center;
      font-size: 12px;
      color: rgba(77, 77, 77, 0.7);
      > i {
        font-size: 1.5rem;
        margin-left: 13px;
        cursor: pointer;
        &:hover {
          color: rgba(72, 184, 244, 1);
        }
        margin-top: -20px;
      }
      &-alarmNo {
        width: 85%;
        > div {
          display: flex;
          align-items: center;
        }
        > div:first-child {
          color: black;
        }
        > div:last-child {
          > i {
            font-size: 1.5rem;
            margin-left: 10px;
            cursor: pointer;
            &:hover {
              color: rgba(72, 184, 244, 1);
            }
          }
        }
      }
    }
    &-step {
      margin-top: 4px;
      margin-left: 60px;
      color: #4d4d4d;
      display: flex;
      font-weight: bold;
      align-items: center;
      > span {
        margin-left: -38px;
        width: 7.5rem;
        height: 1.1em;
        line-height: 1.1em;
        @include utils-ellipsis();
      }
    }
  }
  &-bottom {
    width: 100%;
    height: 132px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    border: 1px solid #dadada;
    &-title {
      margin-top: 10px;
      margin-left: 22px;
      display: flex;
      align-items: center;
      font-size: 18px;
      color: #4d4d4d;
      font-weight: 600;
      > i {
        font-size: 1.5rem;
        cursor: pointer;
      }
      > span {
        width: 20rem;
        @include utils-ellipsis();
      }
    }
    &-detail {
      margin-left: 24px;
      margin-top: 6px;
      height: 40px;
      width: 350px;
      color: rgba(77, 77, 77, 0.7);
      display: -webkit-box;
      overflow: hidden;
      white-space: normal;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      padding-right: 2px;
    }
    &-peopleType {
      margin-left: 24px;
      margin-top: 6px;
      > div {
        display: inline-block;
        width: 78px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        background: #f4f4f4;
        border-radius: 12px;
        margin-right: 8px;
        > span {
          display: inline-block;
          width: 60px;
          @include utils-ellipsis();
        }
      }
    }
  }
  &-divider {
    position: absolute;
    top: 75px;
    left: 7px;
    background: inherit;
    width: 384px;
    height: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    > div {
      width: 370px;
      height: 2px;
      border-top: 1px dashed #dadada;
    }
  }
  &:hover {
    .alert-list-item-top {
      box-shadow: -5px -5px 10px -4px rgba(0, 0, 0, 0.16),
        5px -5px 10px -4px rgba(0, 0, 0, 0.16);
    }
    .alert-list-item-bottom {
      box-shadow: -5px 5px 10px -4px rgba(0, 0, 0, 0.16),
        5px 5px 10px -4px rgba(0, 0, 0, 0.16);
    }
  }
  &.activeItem {
    .alert-list-item-top {
      border: 1px solid #39a7fb;
      box-shadow: -5px -5px 10px -4px rgba(0, 0, 0, 0.16),
        5px -5px 10px -4px rgba(0, 0, 0, 0.16);
    }
    .alert-list-item-bottom {
      border: 1px solid #39a7fb;
      box-shadow: -5px 5px 10px -4px rgba(0, 0, 0, 0.16),
        5px 5px 10px -4px rgba(0, 0, 0, 0.16);
    }
  }
}
.info {
  background: rgba(72, 184, 244, 0.3);
  > div {
    background: rgba(72, 184, 244, 0.6);
    > div {
      background: rgba(72, 184, 244, 1);
    }
  }
}
.warning {
  background: rgba(255, 184, 106, 0.3);
  > div {
    background: rgba(255, 184, 106, 0.6);
    > div {
      background: rgba(255, 184, 106, 1);
    }
  }
}
.danger {
  background: rgba(255, 106, 106, 0.3);
  > div {
    background: rgba(255, 106, 106, 0.6);
    > div {
      background: rgba(255, 106, 106, 1);
    }
  }
}
.mostDanger {
  background: rgba(216, 0, 0, 0.3);
  > div {
    background: rgba(216, 0, 0, 0.6);
    > div {
      background: rgba(216, 0, 0, 1);
    }
  }
}
.newAlarm {
  box-shadow: inset 0 0 10px 2px rgba(255, 0, 0, 0.13);
  .alert-list-item-top {
    border: 1px solid #ffb7b7;
  }
  .alert-list-item-bottom {
    border: 1px solid #ffb7b7;
  }
}
</style>
