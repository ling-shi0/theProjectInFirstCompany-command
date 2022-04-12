<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-03-08 09:44:35
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-04-06 15:13:49
-->
<template>
  <div class="alarm-person-pop-item" v-show="visible">
    <div class="alarm-person-pop-item-title">
      报警对象
      <i class="h-icon-close" @click="closePop"></i>
    </div>
    <div class="alarm-person-pop-item-info">
      <div class="alarm-person-pop-item-info-img">
        <h-img-view
          :src="propsData.alarmPersonFaceUrl"
          mode="contain"
          style="width: 130px; height: 130px"
        />
      </div>
      <div class="alarm-person-pop-item-info-mes">
        <div>
          {{ propsData.alarmPersonName }}
          <span>
            {{ '未知年龄' }}
            <i>
              <img
                src="@/assets/images/alarmCommand/male.png"
                v-if="propsData.alarmPersonSex"
              />
              <img src="@/assets/images/alarmCommand/female.png" v-else />
            </i>
          </span>
        </div>
        <div>
          {{ propsData.alarmPersonCertificateNumber || '未知身份证号' }}
          <i
            class="h-icon-copy"
            @click.stop="copyToClip(propsData.alarmPersonCertificateNumber)"
            v-if="propsData.alarmPersonCertificateNumber"
          ></i>
        </div>
        <div class="alarm-person-pop-item-info-mes-tags">
          <div
            class="alarm-person-pop-item-info-mes-tags-tag"
            v-for="(item, index) in propsData.alarmPersonTag &&
            propsData.alarmPersonTag.split(',').slice(0, 3)"
            :key="index"
          >
            {{ item }}
          </div>
          <div
            class="alarm-person-pop-item-info-mes-tags-tag"
            v-if="
              propsData.alarmPersonTag &&
              propsData.alarmPersonTag.split(',').length > 3
            "
            :title="
              propsData.alarmPersonTag &&
              propsData.alarmPersonTag.split(',').slice(3).join(',')
            "
          >
            ...
          </div>
        </div>
        <div class="alarm-person-pop-item-info-mes-phone">
          <div class="alarm-person-pop-item-info-mes-phone-title">
            <i class="h-icon-telephone"></i>
            联系方式
          </div>
          <div class="alarm-person-pop-item-info-mes-phone-num">
            {{ propsData.alarmPersonPhone }}
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="alarm-person-pop-item-buts">
      <el-button type="default" @click="manageControl">一键布控</el-button>
    </div> -->
  </div>
</template>

<script>
import { manageControl } from '@/api/alarmCommand';

export default {
  name: 'AlarmPersonPopItem',
  data() {
    return {
      visible: true
    };
  },
  props: {
    propsData: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    propsData() {
      this.visible = this.propsData.visible;
    }
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
    closePop() {
      this.visible = false;
    },
    manageControl() {
      manageControl({ alarmNo: this.propsData.alarmNo })
        .then(({ data }) => {
          this.$message.success('布控成功！');
        })
        .catch(err => {
          this.$message.error(err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.alarm-person-pop-item {
  width: 357px;
  height: 240px;
  background: white;
  &-title {
    width: 100%;
    height: 38px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 12px;
    border-bottom: 1px solid rgba(151, 151, 151, 0.35);
    > i {
      font-size: 1.5rem;
      cursor: pointer;
    }
  }
  &-info {
    height: 150px;
    width: 100%;
    display: flex;
    &-img {
      width: 130px;
      height: 130px;
      margin: 12px 12px 9px 23px;
      border: 1px red solid;
    }
    &-mes {
      width: 170px;
      height: 130px;
      color: #4d4d4d;
      margin-top: 12px;
      > div {
        &:first-child {
          font-size: 16px;
          font-weight: bold;
        }
      }
      > div {
        display: flex;
        align-items: center;
        > span {
          font-size: 14px;
          font-weight: 500;
          display: flex;
          align-items: center;
          margin-left: 40px;
        }
      }
      &-tags {
        width: 100%;
        height: 26px;
        &-tag {
          width: 72px;
          height: 24px;
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
      &-phone {
        margin-top: 17px;
        flex-wrap: wrap;
        &-title {
          width: 100%;
          height: 20px;
          display: flex;
          align-items: center;
          > i {
            font-size: 1.5em;
          }
        }
        &-num {
          margin-top: 6px;
          padding-left: 23px;
          font-size: 14px;
          color: rgba(77, 77, 77, 0.7);
        }
      }
    }
  }
  &-buts {
    width: 315px;
    height: 45px;
    margin-left: 21px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px dashed rgba(151, 151, 151, 0.35);
  }
}
</style>
