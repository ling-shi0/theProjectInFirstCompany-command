<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-03-31 11:23:30
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-04-09 10:38:30
-->
<template>
  <div class="feed-back">
    <div class="feed-back-top">
      <div class="feed-back-top-title">文本反馈信息</div>
      <div class="feed-back-top-listItem" style="height: 3em">
        <div class="feed-back-top-listItem-title">现场反馈:</div>
        {{ alertMes.feedback }}
      </div>
      <div class="feed-back-top-listItem" style="height: 3em">
        <div class="feed-back-top-listItem-title">最终反馈:</div>
        {{ alertMes.finalFeedback }}
      </div>
    </div>
    <div class="feed-back-bottom">
      <div class="feed-back-top-title">音视频反馈信息</div>
      <div class="feed-back-bottom-imgs">
        <div
          v-for="(item, index) in alertMes.feedbackPicUrl &&
          alertMes.feedbackPicUrl.split(',').splice(0, 7)"
          :key="index"
          @click="showDetailImg(index)"
        >
          <h-img-view
            :src="item"
            mode="fill"
            style="width: 100%; height: 100%"
          />
        </div>
      </div>
    </div>
    <h-img-preview
      ref="single"
      :data="urls"
      :current-index="currentIndex"
      :visible.sync="previewShow"
    />
  </div>
</template>

<script>
export default {
  name: 'FeedBack',
  props: {
    alertMes: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      urls: [],
      previewShow: false,
      currentIndex: 0
    };
  },
  methods: {
    showDetailImg(index) {
      this.urls =
        this.alertMes.feedbackPicUrl && this.alertMes.feedbackPicUrl.split(',');
      this.currentIndex = index;
      this.previewShow = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.feed-back {
  width: 100%;
  height: 100%;
  &-top {
    width: 95%;
    height: 38%;
    margin: 0 auto;
    &-title {
      width: 100%;
      height: 60px;
      font-size: 14px;
      color: #4d4d4d;
      font-weight: bold;
      position: relative;
      line-height: 60px;
      text-indent: 8px;
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
    &-listItem {
      width: 100%;
      display: flex;
      margin-bottom: 17px;
      &-title {
        font-size: 14px;
        color: rgba(77, 77, 77, 0.7);
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
        cursor: pointer;
      }
    }
  }
  &-bottom {
    width: 95%;
    height: 60%;
    margin: 0 auto;
    &-imgs {
      width: 100%;
      height: calc(100% - 60px);
      display: flex;
      flex-wrap: wrap;
      > div {
        width: 24%;
        height: 47%;
        margin-right: 1%;
        margin-bottom: 1%;
        cursor: pointer;
      }
    }
  }
}
</style>
