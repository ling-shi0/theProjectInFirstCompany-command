<template>
  <div class="to-dispose-page">
    <!-- 说明内容 -->
    <div class="comment">
      <div class="title">说明</div>
      <van-field
        v-model="form.comment"
        rows="3"
        autosize
        label="留言"
        type="textarea"
        maxlength="50"
        placeholder="点击输入处置情况说明"
        show-word-limit
      />
    </div>
    <div class="info">
      <div class="title">附件</div>
      <upload-con ref="uploadCon" :alarmNo="alarmNo"></upload-con>
    </div>
    <!-- 底部操作栏 -->
    <div class="deal-bar">
      <van-button
        type="primary"
        size="large"
        class="deal-bar-but"
        @click.stop="confirm"
        >确认反馈</van-button
      >
    </div>
  </div>
</template>

<script>
import uploadCon from "@/src/components/uploadCon";
import http from "@/src/axios/dispose";
import { Dialog } from "vant";
export default {
  props: {
    disposeItem: Object,
  },
  data() {
    return {
      form: {
        alarmNo: "",
        alertVaild: "0",
        userId: this.$store.state.userInfo.userIndexCode,
        caseNo: "",
        feedbackSource: [],
        comment: "",
      },
      item: {},
      alarmNo: "",
    };
  },
  components: {
    uploadCon,
  },
  methods: {
    goBack() {
      // this.$router.push({ name: "disposeList" });
      this.$router.go(-1);
    },
    dealForm() {
      this.form.feedbackSource.length = 0;
      const map = {
        pic: "imgList",
        video: "videoList",
        voice: "audioList",
      };
      console.log(this.$refs.uploadCon);
      ["pic", "video", "voice", "text"].forEach((item) => {
        if (item === "text") {
          this.form.feedbackSource.push({
            type: "text",
            name: "",
            source: this.form.comment,
          });
        } else {
          for (let i = 0; i < this.$refs.uploadCon[map[item]].length; i++) {
            this.form.feedbackSource.push({
              type: item,
              name: this.$refs.uploadCon[map[item]][i].fileName,
              source: this.$refs.uploadCon[map[item]][i].fileUrl,
              id: this.$refs.uploadCon[map[item]][i].id,
            });
          }
        }
      });
    },
    checkForm() {
      if (!this.form.comment) {
        this.$toast("请填入情况说明");
        return false;
      }
      return true;
    },
    confirm() {
      if (this.checkForm()) {
        Dialog.confirm({
          message: "确认添加处置",
        })
          .then(() => {
            try {
              this.dealForm();
              http
                .saveFeedback(this.form)
                .then((res) => {
                  this.$toast("处置成功");
                  this.$router.push({ name: "disposeList" });
                })
                .catch((err) => {
                  this.$toast(err.msg);
                });
            } catch (err) {
              console.log(err);
            }
          })
          .catch(() => {
            // on cancel
          });
      }
    },
    dealRouteQuery() {
      if (this.disposeItem) {
        this.item = this.disposeItem;
        this.form.alarmNo = this.disposeItem.alarmNo;
        this.alarmNo = this.disposeItem.alarmNo;
      }
    },
    init() {
      this.bus.$emit("stopUpload");
      this.form.alertVaild = "0";
      this.form.feedbackSource = [];
      this.form.comment = "";
      this.dealRouteQuery();
    },
  },
  watch: {
    disposeItem(val) {
      this.init();
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style scoped lang="scss">
.to-dispose-page {
  width: 100%;
  height: 43.5rem;
  padding-bottom: 10rem;
  background-color: #fff;
  .comment {
    width: 100%;
    height: 11.5rem;
    padding: 0 1.3325rem;
    margin-top: 1rem;
    margin-bottom: 2rem;
    .title {
      color: #333333;
      font-size: 1.3325rem;
      height: 1.3325rem;
      line-height: 1.3325rem;
    }
  }
  .info {
    width: 100%;
    height: 30rem;
    padding: 0 1.3325rem;
    .title {
      color: #333333;
      font-size: 1.3325rem;
      height: 1.3325rem;
      line-height: 1.3325rem;
      margin-bottom: 1rem;
    }
  }
  .deal-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 6.665rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.39) 0%,
      #ffffff 100%
    );
    &-but {
      width: 92vw;
      height: 4rem;
      background: #2080f7;
      border-radius: 4px;
      border: none;
    }
  }
}
</style>
<style lang="scss">
.to-dispose-page .van-cell__title.van-field__label {
  display: none;
}
.to-dispose-page .van-cell.van-field {
  margin-top: 1rem;
  height: 9rem;
  background: #f5f6f8;
  border-radius: 4px;
  & textarea {
    height: 100% !important;
  }
}
</style>
