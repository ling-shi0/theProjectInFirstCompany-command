<template>
  <div class="detail-info" ref="container">
    <listItem
      :itemMes="taskInfo"
      :dontShowFooter="true"
      :dontShowDetail="true"
      style="height: 3.8325rem"
    ></listItem>
    <div class="alarm-person">
      <div>
        <van-image
          width="6rem"
          height="6rem"
          fit="fill"
          :src="headIcon"
          class="img"
        />
        <div class="info">
          <div>
            {{ taskInfo.alarmPerson || "匿名" }}
            <van-button
              plain
              type="primary"
              :icon="callIcon"
              @click.stop="phoneCall"
              size="small"
              class="call-but"
              >呼叫</van-button
            >
          </div>
          <div>
            <van-icon name="idcard" />&nbsp;{{
              taskInfo.alarmPersonCertificateNumber || "未知身份证号"
            }}
          </div>
          <div>
            <van-icon name="phone-o" />&nbsp;{{ taskInfo.alarmPersonPhone }}
          </div>
        </div>
      </div>
    </div>
    <div class="alarm-detail">
      <AlarmDetail :itemMes="taskInfo"></AlarmDetail>
    </div>

    <!-- 进度 -->
    <div class="step-box">
      <DealComment
        :comment="feedbackComment"
        :container="container"
        v-if="feedbackComment"
      ></DealComment>
      <showCon
        :fileList="fileList"
        v-if="fileList && fileList.length"
      ></showCon>
      <DealStep :msgInfo="msgInfo"></DealStep>
    </div>

    <div class="footer-buts" v-if="!dontShowButs">
      <van-button
        type="primary"
        size="large"
        class="footer-buts-but"
        v-if="taskInfo.alarmState === '分派'"
        @click.stop="signUp"
        >立即签收</van-button
      >
      <van-button
        type="primary"
        size="large"
        class="footer-buts-but"
        v-if="taskInfo.alarmState === '签收'"
        @click.stop="arriveAt"
        >到达</van-button
      >
      <van-button
        type="primary"
        size="large"
        class="footer-buts-but"
        v-if="taskInfo.alarmState === '到达'"
        @click.stop="toPispose"
        >立即处置</van-button
      >
    </div>
    <van-popup v-model="videoInfo.showPreVideo" get-container="#container">
      <Video :videoInfo="videoInfo"></Video>
    </van-popup>
    <van-action-sheet
      v-model:show="feedBackShow"
      title="处置"
      v-if="taskInfo.alarmState === '到达'"
    >
      <toDispose :disposeItem="taskInfo"></toDispose>
    </van-action-sheet>
  </div>
</template>
<script>
import showCon from "@/src/components/showCon";
import Video from "@/src/components/mulit/Video";
import http from "@/src/axios/dispose";
import listItem from "@/src/pages/dispose/listItem.vue";
import callIcon from "@/src/assets/icons/callicon.png";
import headIcon from "@/src/assets/images/myPage/man-login.png";
import DealStep from "./DealStep.vue";
import toDispose from "@/src/pages/dispose/toDispose.vue";
import AlarmDetail from "@/src/components/dispose/alarmDetail.vue";
import DealComment from "@/src/components/detailPage/DealComment.vue";

export default {
  components: {
    showCon,
    Video,
    listItem,
    DealStep,
    toDispose,
    AlarmDetail,
    DealComment,
  },
  name: "detailInfo",
  props: {
    taskInfo: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      fileList: [],
      msgInfo: [],
      videoInfo: {
        firstFrame: "",
        url: "",
        type: "video/mp4",
        showPreVideo: false,
      },
      feedbackComment: "",
      headIcon,
      callIcon,
      dontShowButs: false,
      feedBackShow: false,
      container: null,
    };
  },
  methods: {
    phoneCall() {
      if (!this.taskInfo.alarmPersonPhone) {
        this.$toast("电话号未知!");
        return;
      }
      let p = {
        phoneNumber: this.taskInfo.alarmPersonPhone,
      };
      this.$hatom.native(
        "System.phoneCall",
        (res) => {
          // this.$toast(res);
        },
        p
      );
    },
    initMesInfo(mes) {
      this.msgInfo.length = 0;
      // 报警状态
      this.msgInfo.push({
        dataId: -2,
        dealTimeValue: mes.alarmTime,
        dealStatus: "报警",
        dealPerson: mes.alarmPerson,
        stepName: "报警",
        index: 0,
      });
      // 接警状态
      this.msgInfo.push({
        dataId: -1,
        dealTimeValue: mes.takeAlarmTime,
        dealStatus: "接警",
        dealPerson: mes.takeAlarmPersonName,
        stepName: "接警",
        index: 1,
      });
      const stepMap = {
        callInTime: {
          strName: "alarmPerson",
          stepName: "分派",
        },
        alarmTime: {
          strName: "takeAlarmPersonName",
          stepName: "签收",
        },
        signTime: {
          strName: "signUserName",
          stepName: "到达",
        },
        arriveTime: {
          strName: "signUserName",
          stepName: "完结",
        },
      };
      // 规定好正确的顺序
      const rightRoutine = [
        "callInTime",
        "alarmTime",
        "signTime",
        "arriveTime",
      ];
      for (let r = 0; r < rightRoutine.length; r++) {
        mes &&
          mes.alertProcesse &&
          mes.alertProcesse.forEach((item) => {
            if (
              item.processState &&
              stepMap[rightRoutine[r]].stepName === item.processState
            ) {
              if (stepMap[rightRoutine[r]].stepName === "分派") {
                item.userName = item.userName.slice(
                  1,
                  item.userName.length - 1
                );
                item.userName = item.userName.split("@").join(",");
                while (
                  mes.appointPerson &&
                  mes.appointPerson[0] &&
                  mes.appointPerson[0].userName.indexOf("@") >= 0
                ) {
                  mes.appointPerson[0].userName =
                    mes.appointPerson[0].userName.replace("@", "");
                }
                this.msgInfo.push({
                  dataId: r,
                  dealTimeValue: item.processTime,
                  dealStatus: r + "",
                  dealPerson:
                    mes.appointPerson[0].userName +
                    "分派警单给" +
                    item.userName,
                  stepName: stepMap[rightRoutine[r]].stepName,
                  index: r + 2,
                });
              } else {
                this.msgInfo.push({
                  dataId: r,
                  dealTimeValue: item.processTime,
                  dealStatus: r + "",
                  dealPerson: item.userName,
                  stepName: stepMap[rightRoutine[r]].stepName,
                  index: r + 2,
                });
              }
            }
          });
      }
      this.msgInfo = this.msgInfo.reverse();
    },
    callUp() {
      // 第三方应用的包名
      const packageName = "com.xmessage.phone";
      const data = {
        params: {},
        target: `native:/${packageName}`,
      };
      /** 跳转到包名为packageName的应用 */
      this.$hatom.native(
        "Router.pushPage",
        (res) => {
          if (res.message === "应用不存在") {
            this.$toast.fail("没有安装融合通信app!");
          }
        },
        data
      );
    },
    signUp() {
      http
        .signById({
          alarmNo: this.taskInfo.alarmNo,
          userId: this.$store.state.userInfo.userIndexCode,
        })
        .then((res) => {
          this.$toast.success("签收成功!");
          this.taskInfo.alarmState = "签收";
          this.$emit("refreshStatus");
        })
        .catch(() => {
          this.dontShowButs = true;
        });
    },
    arriveAt() {
      this.$hatom.locationInfo.getLocation((res) => {
        let longitude = JSON.parse(res.message).longitude;
        let latitude = JSON.parse(res.message).latitude;
        if (!+longitude || !+latitude) {
          this.$toast.fail("请检查并打开GPS开关!");
          longitude = this.taskInfo.longitude;
          latitude = this.taskInfo.latitude;
        }
        http
          .arriveAtAlarmPosition({
            alarmNo: this.taskInfo.alarmNo,
            userId: this.$store.state.userInfo.userIndexCode,
            longitude: JSON.parse(res.message).longitude,
            latitude: JSON.parse(res.message).latitude,
          })
          .then((res) => {
            this.$toast.success("状态修改成功！");
            this.taskInfo.alarmState = "到达";
            this.$emit("refreshStatus");
          });
      });
    },
    toPispose() {
      this.feedBackShow = true;
    },
    getFeedBack(val) {
      if (val && val.feedbackSource) {
        for (let index = 0; index < val.feedbackSource.length; index++) {
          const element = val.feedbackSource[index];
          if (element.type === "text") {
            this.feedbackComment = element.source;
          }
        }
      }
    },
  },
  watch: {
    taskInfo(val) {
      // 增加弹窗show为true处理
      this.container = this.$refs["container"];
      this.dontShowButs = this.$route.query.onlyRead || false;
      this.getFeedBack(val);
      // 附件
      this.$set(this, "fileList", val.feedbackSource);
      // 处理流程信息
      this.initMesInfo(val);
      this.$nextTick(() => {
        this.feedBackShow = this.$route.query.showDispose || false;
      });
    },
  },
};
</script>

<style lang="scss">
.call-but .van-button {
  color: #2080f7 !important;
  font-size: 1rem !important;
}
.call-but .van-button--primary {
  border: none !important;
  color: #2080f7 !important;
  font-size: 1rem !important;
}
.call-but .van-button__content {
  font-size: 1rem !important;
}
.detail-info .van-action-sheet__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.33rem;
  text-indent: 1.33rem;
  font-size: 1.83rem;
  & .van-action-sheet__close {
    position: relative;
  }
}
</style>
<style lang="scss">
.videoOverLay {
  padding: 10rem 1.5rem 1rem 1.5rem;
  z-index: 200 !important;
  .innerVideo {
    height: 100%;
    width: 100%;
  }
}
</style>
<style lang="scss" scoped>
.detail-info {
  background-color: #f5f5f5;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  .alarm-person {
    width: 100%;
    height: 9.33rem;
    background: white;
    > div {
      width: calc(100% - 2.66rem);
      height: 8rem;
      margin: 0 auto;
      border-radius: 4px;
      padding: 0.67rem;
      display: flex;
      position: relative;
      .info {
        width: calc(100% - 7rem);
        height: 100%;
        margin-left: 1rem;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        & div {
          display: flex;
          align-items: center;
          font-size: 1.17rem;
          color: #666666;
          .call-but {
            font-size: 1rem;
            width: 5rem;
            height: 2rem;
          }
        }
        & div:first-child {
          justify-content: space-between;
        }
      }
      &::before {
        content: "报案人";
        width: 4.33rem;
        height: 1.67rem;
        position: absolute;
        top: 0;
        left: 0;
        background: #2080f7;
        border-radius: 4px 0 4px 0;
        color: white;
        font-size: 1rem;
        text-align: center;
        line-height: 1.67rem;
        z-index: 100;
      }
    }
  }
  .alarm-detail {
    width: 100%;
    min-height: 5rem;
    background: white;
    padding: 0 1.3325rem 1.3325rem;
  }
  .step-box {
    width: 100%;
    background-color: #ffffff;
    padding-bottom: 1rem;
  }
  .footer-buts {
    width: 100%;
    position: fixed;
    bottom: 1.33rem;
    left: 0;
    display: flex;
    justify-content: center;
    background-image: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.39) 0%,
      #ffffff 100%
    );
    &-but {
      width: calc(100% - 2.66rem);
      background: #2080f7;
      box-shadow: 0 6px 12px 0 rgba(8, 34, 66, 0.2);
      border-radius: 6px;
      height: 4rem;
      margin: 0 auto;
    }
  }
}
</style>
