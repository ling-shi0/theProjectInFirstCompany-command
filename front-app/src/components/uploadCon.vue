<template>
  <div class="upload-con">
    <!-- 上传 -->
    <div class="upload-box">
      <div class="con" @click="changeVoice">
        <img src="@/src/assets/icons/addVoice.png" class="icon" />添加语音
      </div>
      <div class="con" @click="showPicShow = true">
        <img src="@/src/assets/icons/addPic.png" class="icon" />添加图片
      </div>
      <div class="con" @click="showVideoShow = true">
        <img src="@/src/assets/icons/addVideo.png" class="icon" />添加视频
      </div>
    </div>
    <div class="upload-list">
      <div class="img" v-for="(item, index) in imgList" :key="index">
        <img :src="item.fileUrl" class="uploud-img" @click="showImg(index)" />
        <img
          src="@/src/assets/images/dispose/close.png"
          class="close"
          @click.stop="deleteFile(item)"
        />
      </div>
      <div
        id="imgUploadList"
        class="img"
        v-for="(item, index) in videoList"
        :key="index"
        @click="showVideo(index)"
      >
        <video :src="item.fileUrl" class="uploud-img"></video>
        <img
          src="@/src/assets/images/selfAlarm/close.png"
          class="close"
          @click.stop="deleteFile(item)"
        />
        <div class="video-tip">视频</div>
      </div>
      <div
        id="imgUploadList"
        class="img"
        v-for="(item, index) in audioList"
        :key="index"
      >
        <Amr
          id="imgUploadList"
          :audioSrc="item.filePath"
          :key="index"
          v-if="item.videoType === 'audio/amr'"
        ></Amr>
        <audio-aac
          id="imgUploadList"
          :audioSrc="item.filePath"
          :key="index"
          v-else-if="item.videoType === 'audio/x-aac'"
        ></audio-aac>
        <Audio
          id="imgUploadList"
          :audioSrc="item.filePath"
          :key="index"
          v-else
        ></Audio>
        <img
          src="@/src/assets/images/selfAlarm/close.png"
          class="close"
          @click.stop="deleteFile(item)"
        />
        <div class="audio-tip">语音</div>
      </div>
    </div>
    <!-- 图片预览 -->
    <van-image-preview
      v-model="showPreview"
      :startPosition="startIndex"
      :images="imgPreList"
      get-container="#app"
    ></van-image-preview>
    <!-- 遮罩层，展示视屏-->
    <van-popup v-model="videoInfo.showPreVideo" get-container="#app">
      <Video :videoInfo="videoInfo"></Video>
    </van-popup>
    <!-- 选择相册底部弹出框 -->
    <van-popup v-model="showPicShow" position="bottom" key="pic">
      <!-- <div class="choose-con" @click="uploadPicture(0)">从照片库中选择</div> -->
      <div class="choose-con" @click="uploadPicture(2)">从相册中选择</div>
      <div class="choose-con" @click="uploadPicture(1)">打开相机</div>
      <div class="board"></div>
      <div class="choose-con" @click="showPicShow = false">取消</div>
    </van-popup>
    <!-- 选择视频底部弹出框 -->
    <van-popup v-model="showVideoShow" position="bottom" key="video">
      <!-- <div class="choose-con" @click="chooseVideo(0)">从照片库中选择</div> -->
      <div class="choose-con" @click="chooseVideo(2)">从相册中选择</div>
      <div class="choose-con" @click="chooseVideo(1)">录制视频</div>
      <div class="board"></div>
      <div class="choose-con" @click="showVideoShow = false">取消</div>
    </van-popup>
    <!-- 遮罩层 上传过渡 -->
    <van-overlay :show="loadingShow">
      <div class="overlay-content">
        <van-loading size="36px" text-size="20px" color="#0094ff" vertical
          >上传中...</van-loading
        >
      </div>
    </van-overlay>
  </div>
</template>
<script>
import Video from "./mulit/Video";
import audioAac from "./mulit/audioAac";
import Audio from "./mulit/Audio";
import Amr from "./mulit/Amr";
import Vue from "vue";
export default {
  name: "uploadCon",
  data() {
    return {
      showPicShow: false, // 显示选择相片弹框
      showVideoShow: false, // 显示选择视频弹框
      showPreview: false, // 显示图片预览
      showPreVideo: false, // 显示视频预览
      imgList: [],
      videoList: [],
      imgPreList: [],
      startIndex: 0,
      videoInfo: {
        firstFrame: "",
        url: "",
        type: "",
        showPreVideo: false,
      },
      audioList: [],
      loadingShow: false,
    };
  },
  props: {
    alarmNo: {
      type: String,
      default: "",
    },
  },
  mounted() {
    this.bus.$on("stopUpload", () => {
      this.loadingShow = false;
      this.imgList = [];
      this.audioList = [];
      this.videoList = [];
    });
  },
  methods: {
    showVideo(index) {
      this.videoInfo.showPreVideo = true;
      this.$nextTick().then(() => {
        this.videoInfo.url = this.videoList[index].filePath;
        this.videoInfo.firstFrame = this.videoList[index].firstFramePath;
        this.videoInfo.type = this.videoList[index].videoType;
      });
    },
    showImg(index) {
      this.startIndex = index;
      this.showPreview = true;
    },
    // 选择图片
    uploadPicture(type) {
      if (this.imgList.length > 16) {
        this.$toast.fail("上传图片数量超过最大限制16个!");
        return;
      }
      if (type === 1) {
        const params = {
          mQuality: "",
          destType: "",
          srcType: type,
          targetWidth: "",
          targetHeight: "",
          encodingType: "",
          mediaType: 0,
          allowEdit: false,
          correctOrientation: false,
          saveToPhotoAlbum: false,
        };
        const self = this;
        this.$hatom.camera(
          (res) => {
            if (Number(res.code) === 0) {
              console.log(res);
              const fileUrl = res.message;
              const fileName =
                fileUrl.split("/")[fileUrl.split("/").length - 1];
              self.upLoadFile(fileUrl, fileName, "0");
            }
          },
          // params非必须参数，不传则使用默认参数
          params
        );
      } else {
        const self = this;
        this.$hatom.native(
          "FilePicker.chooseFile",
          (res) => {
            if (Number(res.code) === 0) {
              const fileUrl = res.message;
              const fileName =
                fileUrl.split("/")[fileUrl.split("/").length - 1];
              self.upLoadFile(eval(fileUrl), fileName, "0");
            }
          },
          { type: 0, maxCount: 5 }
        );
      }
    },
    // 选择视频
    chooseVideo(type) {
      if (this.videoList.length > 8) {
        this.$toast.fail("上传视频数量超过最大限制8个!");
        return;
      }
      if (type === 2) {
        this.$hatom.native(
          "FilePicker.chooseFile",
          (res) => {
            console.log(res);
            if (Number(res.code) === 0) {
              const fileUrl = res.message;
              const fileName =
                fileUrl.split("/")[fileUrl.split("/").length - 1];
              this.upLoadFile(eval(fileUrl), fileName, "1");
            }
          },
          { type: 1, maxCount: 4 }
        );
      } else {
        const params = {
          recordTime: 60,
        };
        const self = this;
        this.$hatom.native(
          "VideoRecordPlugin.videoRecord",
          (res) => {
            const fileUrl = JSON.parse(res.message).filePath;
            const fileName = fileUrl.split("/")[fileUrl.split("/").length - 1];
            self.upLoadFile(fileUrl, fileName, "1");
          },
          // params非必须参数，不传则使用默认参数
          params
        );
      }
    },
    // 选择音频
    changeVoice() {
      if (this.audioList.length > 8) {
        this.$toast.fail("上传音频数量超过最大限制8个!");
        return;
      }
      const self = this;
      this.$hatom.native(
        "FilePicker.chooseFile",
        (res) => {
          if (Number(res.code) === 0) {
            const fileUrl = res.message;
            const fileName = fileUrl.split("/")[fileUrl.split("/").length - 1];
            self.upLoadFile(eval(fileUrl), fileName, "2");
          }
        },
        { type: 2, maxCount: 4 }
      );
    },
    // 将附件上传到服务器
    upLoadFile(uploadFilePath, uploadFileName, type) {
      this.loadingShow = true;
      // 0图片，1视频，2音频
      const urlMap = {
        0:
          Vue.prototype.GLOBAL.address +
          "/avc-app/service/rs/v1/api/alert/uploadPic?alarmNo=" +
          this.alarmNo,
        1:
          Vue.prototype.GLOBAL.address +
          "/avc-app/service/rs/v1/api/alert/uploadVideo?alarmNo=" +
          this.alarmNo,
        2:
          Vue.prototype.GLOBAL.address +
          "/avc-app/service/rs/v1/api/alert/uploadVoice?alarmNo=" +
          this.alarmNo,
      };
      let filePathList = [];

      if (Object.prototype.toString.call(uploadFilePath) === "[object Array]") {
        filePathList = uploadFilePath;
      } else {
        filePathList.push(uploadFilePath);
      }
      const p = {
        netRequestInfo: {
          url: urlMap[type + ""],
          token: this.$store.state.userInfo.token,
        },
        filePathList: filePathList,
      };
      console.log("开始上传文件。。。。");
      try {
        this.showPicShow = false;
        this.showVideoShow = false;
        this.$hatom.native(
          "FileUploadPlugin.upLoadFile",
          (res) => {
            console.log("上传完成");
            console.log(res);
            const callData = JSON.parse(res.message).data;
            if (!callData) {
              //上传文件大小大于100Mb的时候给提示
              this.$toast.fail(JSON.parse(res.message).msg);
            } else {
              // 正常的上传状态下的操作
              // 向列表里填值
              callData &&
                callData.forEach((element, index) => {
                  if (index === 0) {
                    for (let i in element) {
                      const fileName = i;
                      const fileUrl = element[i];
                      const fileType = fileName.split(".")[1];
                      if (type === "0") {
                        this.imgList.push({
                          fileName: fileName,
                          fileUrl: fileUrl,
                          fileType: type,
                          filelocal: uploadFilePath,
                          filePath: fileUrl,
                        });
                        this.imgPreList.push(fileUrl);
                      }
                      if (type === "1") {
                        this.videoList.push({
                          fileName: fileName,
                          fileUrl: fileUrl,
                          fileType: type,
                          filelocal: uploadFilePath,
                          firstFrame: "",
                          filePath: fileUrl,
                          firstFramePath: "",
                          videoType: fileType,
                        });
                      }
                      if (type === "2") {
                        this.audioList.push({
                          fileName: fileName,
                          fileUrl: fileUrl,
                          fileType: type,
                          filelocal: uploadFilePath,
                          filePath: fileUrl,
                          videoType: fileType,
                        });
                      }
                    }
                  }
                });
            }
            this.loadingShow = false;
          },
          p
        );
      } catch (error) {
        this.loadingShow = false;
        this.showPicShow = false;
        this.showVideoShow = false;
      }
    },
    deleteFile(data) {
      this.imgList.some((item, i) => {
        if (item.fileUrl === data.fileUrl) {
          this.imgList.splice(i, 1);
          // 在数组的some方法中，如果return true，就会立即终止这个数组的后续循环
          return true;
        }
        return false;
      });
      this.videoList.some((item, i) => {
        if (item.fileUrl === data.fileUrl) {
          this.videoList.splice(i, 1);
          // 在数组的some方法中，如果return true，就会立即终止这个数组的后续循环
          return true;
        }
        return false;
      });
      this.audioList.some((item, i) => {
        if (item.fileUrl === data.fileUrl) {
          this.audioList.splice(i, 1);
          // 在数组的some方法中，如果return true，就会立即终止这个数组的后续循环
          return true;
        }
        return false;
      });
    },
  },
  components: {
    Video,
    Audio,
    audioAac,
    Amr,
  },
};
</script>
<style lang="scss" scoped >
.upload-con {
  width: 100%;
  height: calc(100% - 2.3325rem);
  .upload-box {
    width: 100%;
    height: 4.6675rem;
    display: flex;
    justify-content: space-between;
    .con {
      width: 28.89vw;
      height: 4.6675rem;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #c7c7c8;
      font-size: 1rem;
      background: #f5f6f8;
      border-radius: 4px;
      .icon {
        width: 1.67rem;
        height: 1.67rem;
        margin-right: 0.29rem;
      }
      &:active {
        background: #e1e3e5;
      }
    }
  }
  .upload-list {
    width: 100%;
    height: calc(100% - 4.6675rem);
    padding: 1.3325rem 0 6rem 0;
    overflow-y: auto;
    .img {
      width: 24%;
      height: 21vw;
      margin-right: 1%;
      margin-bottom: 0.7rem;
      display: inline-block;
      position: relative;
      border-radius: 4px;
      overflow: hidden;
      .uploud-img {
        width: 100%;
        height: 100%;
      }
      .close {
        position: absolute;
        right: 0;
        top: 0;
        width: 2.8rem;
        height: 2.8rem;
      }
      .video-tip,
      .audio-tip {
        position: absolute;
        left: 0.1675rem;
        top: 0.1675rem;
        width: 2.3325rem;
        height: 1.1675rem;
        background: rgba(0, 0, 0, 0.6);
        color: white;
        text-align: center;
        line-height: 1.1675rem;
        font-size: 0.8325rem;
        border-radius: 2px;
      }
    }
  }
  .choose-con {
    text-align: center;
    height: 5rem;
    line-height: 5rem;
    font-size: 1.6rem;
    color: rgba(0, 0, 0, 0.7);
    box-shadow: inset 0 -1px 0 0 #e5e5e5;
  }
  .board {
    height: 1rem;
    background: #f2f2f2;
  }
  .videoOverLay {
    padding: 10rem 1.5rem 1rem 1.5rem;
    z-index: 200;
  }
}
.overlay-content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
