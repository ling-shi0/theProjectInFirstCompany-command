<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-08-10 16:18:56
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-08-11 13:52:36
-->
<template>
  <div class="sign-up-pop">
    <div class="title">确认签收警情:</div>
    <AlarmDetail :itemMes="itemMes"></AlarmDetail>
    <div class="buts">
      <van-button type="default" @click="close" class="but">关闭</van-button>
      <van-button type="primary" @click="sign" class="but">签收</van-button>
    </div>
  </div>
</template>

<script>
import AlarmDetail from "./alarmDetail.vue";
import http from "@/src/axios/dispose";

export default {
  name: "SignUpPop",
  props: { itemMes: Object },
  components: { AlarmDetail },
  methods: {
    close() {
      this.$emit("close");
    },
    sign() {
      http
        .signById({
          alarmNo: this.itemMes.alarmNo,
          userId: this.$store.state.userInfo.userIndexCode,
        })
        .then((res) => {
          this.$toast.success("签收成功!");
          this.itemMes.alarmState = "签收";
          this.$emit("close", this.itemMes);
        })
        .catch((err) => {
          this.itemMes.onlyRead = true;
          this.$emit("close", this.itemMes);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.sign-up-pop {
  width: 84.1vw;
  padding: 0.7075rem 1rem 1.9175rem;
  .title {
    font-size: 1.1675rem;
    color: #2080f7;
    margin-bottom: 0.73rem;
  }
  .buts {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-top: 1.6675rem;
    .but {
      width: 9.9175rem !important;
      height: 2.9175rem;
      border-radius: 4px;
      border: none;
      background: #f5f6f8;
      &:last-child {
        background: #2080f7;
      }
    }
  }
}
</style>