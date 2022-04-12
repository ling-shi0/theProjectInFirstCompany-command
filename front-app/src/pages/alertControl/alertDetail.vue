<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-06-29 13:50:58
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-09-13 13:58:52
-->
<template>
  <div class="alert-detail">
    <van-nav-bar
      title="报警详情"
      left-text="返回"
      left-arrow
      @click-left="goBack"
    />
    <div class="alert-detail-content">
      <div class="main-image">
        <div class="title">
          <van-icon name="clock-o" style="margin-right: 0.375rem" />{{
            detailInfo.alarmTime &&
            new Date(detailInfo.alarmTime).Format("yyyy-MM-dd HH:mm:ss")
          }}
        </div>

        <div>
          <van-image
            style="width: 42%; height: 14rem"
            fit="fill"
            :src="detailInfo.bkgPicUrl || detailInfo.snappedPicUrl"
            @click="
              previewImg(
                detailInfo.bkgPicUrl || detailInfo.snappedPicUrl,
                0,
                true
              )
            "
          /><van-image
            style="width: 40%; height: 80%"
            fit="fill"
            v-if="detailInfo.refrencePicUrl && isCarPage"
            :src="detailInfo.refrencePicUrl"
            @click="previewImg(detailInfo.refrencePicUrl, 0, true)"
          />
        </div>
      </div>
      <div class="compare-image" v-if="!isCarPage">
        <div class="title">{{ isCarPage ? "车辆信息" : "嫌疑人信息" }}</div>
        <div class="pics">
          <div class="pics-item">
            <van-image
              style="width: 100%; height: 100%"
              fit="contain"
              @click="previewImg(detailInfo.facePicUrl, 0)"
              :src="detailInfo.facePicUrl || detailInfo.snappedPicUrl"
            />
          </div>
          <div class="pics-item">
            <van-image
              style="width: 100%; height: 100%"
              fit="contain"
              @click="previewImg(compareArr.facePicUrl, 1)"
              :src="compareArr.facePicUrl || detailInfo.refrencePicUrl"
            />
          </div>
          <div class="compare-similarity">
            <RateBall
              :isHigh="
                (+compareArr.similarity || +detailInfo.similarity) >= 0.5
              "
              :progressDescription="
                formatDesc(+compareArr.similarity || +detailInfo.similarity) +
                '%'
              "
              class="ball"
            ></RateBall>
          </div>
        </div>
        <div class="images-list" v-if="!isCarPage">
          <album
            :list="detailInfo.alarmHumans"
            @changeActiveIndex="changeAlbum"
          ></album>
        </div>
      </div>
      <div class="main-info">
        <div v-for="item in infoArr">
          <span>{{ item.name }}</span>
          {{
            isCarPage
              ? getValue(detailInfo, item.str)
              : getValue(compareArr, item.str)
          }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import album from "./album.vue";
import wave from "./wave.vue";
import { ImagePreview } from "vant";
import RateBall from "./RateBall.vue";

const personArr = [
  { name: "姓名", str: "humanName" },
  { name: "性别", str: "gender" },
  { name: "证件号码", str: "certificateNumber" },
  { name: "布控名称", str: "controlName" },
  { name: "告警时间", str: "alarmTime" },
];

const carArr = [
  { name: "任务名称", str: "deployName" },
  { name: "车牌号", str: "alarmEventObjName" },
  { name: "抓拍时间", str: "alarmTime" },
  { name: "抓拍地点", str: "inputSourceName" },
];

export default {
  name: "AlertControl",
  data() {
    return {
      detailInfo: {},
      infoArr: [],
      compareArr: {},
      imgUrl: [],
      isCarPage: false,
    };
  },
  activated() {
    if (this.$route.query.type === 1) {
      this.infoArr = carArr;
      this.isCarPage = true;
    } else {
      this.infoArr = personArr;
      this.isCarPage = false;
    }
    this.detailInfo = JSON.parse(this.$route.query.alertItem);
    this.imgUrl[0] = this.detailInfo.facePicUrl;
    if (this.detailInfo.alarmHumans && this.detailInfo.alarmHumans.length) {
      this.compareArr = this.detailInfo.alarmHumans[0];
      this.imgUrl[1] = this.compareArr.facePicUrl;
    }
  },
  components: {
    album,
    wave,
    RateBall,
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    changeAlbum(item) {
      this.compareArr = item;
    },
    previewImg(url, index, isBackPic) {
      if (isBackPic) {
        ImagePreview({
          images: [url],
          startPosition: 0,
        });
        return;
      }
      this.imgUrl[index] = url;
      ImagePreview({
        images: this.imgUrl,
        startPosition: index,
      });
    },
    getValue(val, str) {
      if (val[str] === "male") {
        return "男";
      } else if (val[str] === "female") {
        return "女";
      } else if (val[str] === "unknown") {
        return "未知";
      } else if (str === "alarmTime") {
        return this.isCarPage
          ? val[str] && new Date(val[str]).Format("yyyy-MM-dd HH:mm:ss")
          : this.detailInfo.alarmTime &&
              new Date(this.detailInfo.alarmTime).Format("yyyy-MM-dd HH:mm:ss");
      } else if (str === "controlName") {
        return this.detailInfo[str];
      } else {
        return val[str] || "未知";
      }
    },
    formatDesc(item) {
      if (item) {
        return Math.ceil(item * 100);
      } else {
        return "0";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.alert-detail {
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  &-content {
    width: 100%;
    height: calc(100% - 3.6rem);
    overflow-y: auto;
    margin-bottom: 1rem;
    .main-image {
      width: 100%;
      height: 18.9575rem;
      background: white;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      .title {
        font-size: 1.1675rem;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 2rem;
      }
      > div {
        width: 100%;
        height: 80%;
        display: flex;
        justify-content: space-around;
      }
    }
    .compare-image {
      width: 100%;
      margin: 0 auto;
      margin-top: 1rem;
      background: white;
      padding: 1.3325rem;
      .title {
        width: 100%;
        height: 2rem;
        font-size: 1.3271rem;
        line-height: 2rem;
        position: relative;
        margin-bottom: 1rem;
      }
      .pics {
        width: 100%;
        height: 12.6675rem;
        background: white;
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        .compare-similarity {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          pointer-events: none;
          .ball {
            width: 6.25rem;
            height: 6.25rem;
            border-radius: 3.125rem;
          }
        }
        &-item {
          width: 12.6675rem;
          height: 12.6675rem;
        }
      }
      .images-list {
        width: 100%;
        height: 6.5rem;
        background: white;
      }
    }
    .main-info {
      width: 100%;
      background: white;
      font-size: 1.1675rem;
      padding-bottom: 2rem;
      & > div {
        height: 2rem;
        padding-left: 1.3325rem;
      }
      & > div span {
        display: inline-block;
        color: rgba(77, 77, 77, 0.7);
        width: 6rem;
      }
    }
  }
}
</style>
<style lang="scss">
.pics-item .van-image__img {
  border-radius: 2px;
  background: #d8d8d8;
  border: 1px solid #979797;
}
.ball.rate-ball {
  > div {
    border-radius: 2.8125rem !important;
    line-height: 5.625rem !important;
    font-size: 1.5rem;
  }
}
</style>
