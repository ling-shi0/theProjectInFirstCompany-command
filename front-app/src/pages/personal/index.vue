<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-07-28 18:58:40
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-09-06 11:21:13
-->
<template>
  <div class="personal">
    <div class="main">
      <img :src="backgroundPic" class="background" />
      <div class="img">
        <van-image
          :src="infoMes.imgUrl ? infoMes.imgUrl : defaultImgUrl"
          style="width: 99%; height: 99%"
        />
      </div>
      <div class="content">
        <div>{{ infoMes.realName }}</div>
        <div>警号:&nbsp;{{ infoMes.code || "——" }}</div>
        {{ infoMes.deptName }}
      </div>
    </div>
    <!-- <van-cell
      title="修改密码"
      is-link
      icon="location-o"
      style="margin-bottom: 1.75rem"
    /> -->
    <van-cell clickable center @click="exit">
      <template #title>
        <div class="exit">退出登录</div>
      </template>
    </van-cell>
    <div class="divider">
      <van-divider>{{ dividerStr }}</van-divider>
    </div>
  </div>
</template>

<script>
import defaultImgUrl from "@/src/assets/images/myPage/man-login.png";
import http from "@/src/axios/personal.js";
import backgroundPic from "@/src/assets/images/personalBack.png";

export default {
  name: "personal",
  data() {
    return {
      infoMes: {
        imgUrl: "",
        phoneNum: "",
        realName: "",
      },
      defaultImgUrl,
      backgroundPic,
      dividerStr: "V1.0.0Build2021803",
    };
  },
  activated() {
    this.judgePhoneType();
    this.getPersonalInfo();
  },
  methods: {
    exit() {
      this.$hatom.rootInfo.redirectLogin();
    },
    getPersonalInfo() {
      http
        .getPersonalInfo({ userId: this.GLOBAL.userIndexCode })
        .then((res) => {
          Object.assign(this.infoMes, res.data);
        });
    },
    judgePhoneType() {
      this.$hatom.native(
        "AppInfo.getAppInfo",
        (res) => {
          console.log(res);
          res = JSON.parse(res.message);
          this.dividerStr = "V" + res.versionName + "Build" + res.versionCode;
        },
        {}
      );
    },
  },
};
</script>

<style lang="scss">
.personal .van-cell {
  width: 90.2vw;
  height: 5.9vh;
  margin: 0 auto;
  border-radius: 12px;
  &::after {
    border-bottom: none;
  }
}
</style>

<style lang="scss" scoped>
.personal {
  width: 100%;
  height: 100%;
  padding-top: 3.1vh;
  background: #f5f5f5;
  .main {
    width: 90.2vw;
    height: 57.2vh;
    background: white;
    margin: 0 auto 1.9vh;
    border-radius: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    .background {
      position: absolute;
      z-index: 0;
      left: 0;
      top: -1rem;
      width: 100%;
      height: 100%;
    }
    .img {
      width: 32.775vw;
      height: 32.775vw;
      border-radius: 16.3875vw;
      display: flex;
      justify-content: center;
      align-items: center;
      background: white;
      border: 6px white solid;
    }
    .content {
      width: 100%;
      height: 18.6vh;
      position: absolute;
      left: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 1rem;
      color: #999999;
      & div:first-child {
        color: #333333;
        font-size: 1.5rem;
        margin-top: 1.5vh;
        margin-bottom: 3.2vh;
      }
      & div:nth-child(2) {
        min-width: 20.8vw;
        height: 2rem;
        font-size: 1rem;
        line-height: 2rem;
        background: #f5f6f8;
        border-radius: 12px;
        text-align: center;
        margin-bottom: 1.3vh;
        color: #747474;
      }
    }
  }
  .exit {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #f65b53;
  }
  .divider {
    width: 100%;
    position: absolute;
    bottom: 0;
  }
}
</style>