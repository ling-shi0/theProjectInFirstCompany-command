<template>
  <div class="show-con">
    <div class="title">附件信息</div>
    <div class="upload-list">
      <div
        id="imgUploadList"
        class="img"
        v-for="(item, index) in imgList"
        :key="index"
      >
        <img :src="item.filePath" class="uploud-img" @click="showImg(index)" />
      </div>
      <div
        id="imgUploadList"
        class="img"
        v-for="(item, index) in videoList"
        :key="index"
        @click="showVideo(index)"
      >
        <video :src="item.filePath" class="uploud-img"></video>
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
          v-if="item.videoType === 'amr'"
        ></Amr>
        <audio-aac
          id="imgUploadList"
          :audioSrc="item.filePath"
          :key="index"
          v-else-if="item.videoType === 'aac'"
        ></audio-aac>
        <Audio
          id="imgUploadList"
          :audioSrc="item.filePath"
          :key="index"
          v-else
        ></Audio>
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
    <van-popup v-model="videoInfo.showPreVideo" get-container="#container">
      <Video :videoInfo="videoInfo"></Video>
    </van-popup>
  </div>
</template>

<script>
import Video from "./mulit/Video";
import Audio from "./mulit/Audio";
import audioAac from "./mulit/audioAac";
import Amr from "./mulit/Amr";

export default {
  name: "showCon",
  components: {
    Video,
    Audio,
    audioAac,
    Amr,
  },
  props: {
    fileList: {
      type: [Array, Object],
      default: () => {},
    },
  },
  data() {
    return {
      audioList: [],
      imgList: [],
      imgPreList: [],
      videoList: [],
      startIndex: 0,
      showPreview: false, // 显示图片预览
      videoInfo: {
        firstFrame: "",
        url: "",
        type: "",
        showPreVideo: false,
      },
    };
  },
  methods: {
    play() {
      if (this.$refs.audio) {
        this.$refs.audio.play();
      }
    },
    showVideo(index) {
      this.videoInfo.showPreVideo = true;
      this.$nextTick().then(() => {
        this.videoInfo.url = this.videoList[index].filePath;
        this.videoInfo.firstFrame = this.videoList[index].firstFramePath;
        this.videoInfo.type = this.videoList[index].videoType;
        this.videoInfo.id = this.videoList[index].id;
      });
    },
    showImg(index) {
      this.startIndex = index;
      this.showPreview = true;
    },
    getFileArr() {
      this.audioList = [];
      this.imgList = [];
      this.imgPreList = [];
      this.videoList = [];
      const typeMap = {
        video: { arr: this.videoList, type: "mp4", fileType: 1 },
        pic: { arr: this.imgList, type: "jpg", fileType: 0 },
        voice: { arr: this.audioList, type: "aac", fileType: 2 },
      };
      this.fileList &&
        this.fileList.forEach((item) => {
          if (item.type !== "text") {
            const type =
              (item.name && item.name.split(".")[1]) || typeMap[item.type].type;
            typeMap[item.type].arr.push({
              fileName: item.name,
              fileUrl: item.source,
              fileType: typeMap[item.type].fileType,
              firstFrame: "",
              filePath: item.source,
              firstFramePath: "",
              videoType: type,
              id: item.id,
            });
            if (item.type === "pic") {
              this.imgPreList.push(item.source);
            }
          }
        });
    },
  },
  watch: {
    fileList: {
      handler() {
        this.getFileArr();
      },
      deep: true,
    },
  },
  mounted() {
    this.getFileArr();
  },
};
</script>

<style lang="scss">
.img-preview {
  z-index: 9999;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
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
.show-con {
  width: 100%;
  margin-top: 2.0425rem;
  // padding: 0 1.3325rem 1.3325rem;
  .title {
    width: 100%;
    height: 2.3325rem;
    font-size: 1.3325rem;
    line-height: 1.3325rem;
    margin-bottom: 0.5rem;
    background: white;
    padding: 0.5rem 1.3325rem 0.5rem;
  }
  .upload-list {
    width: 100%;
    height: calc(100% - 4.6675rem);
    // padding: 1.3325rem 0 6rem 0;
    display: flex;
    flex-wrap: wrap;
    overflow-y: auto;
    padding: 0 1.3325rem 1.3325rem;
    .img {
      width: 24%;
      height: 21vw;
      margin-right: 1%;
      margin-bottom: 0.7rem;
      position: relative;
      border-radius: 4px;
      overflow: hidden;
      background: #f5f6f8;
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
}
// .upload-list {
//   width: calc(100% - 1.6rem);
//   padding: 2rem 0 1rem 0;
//   display: flex;
//   flex-wrap: wrap;
//   padding-left: 1.33rem;
//   .img {
//     width: 8rem;
//     height: 8rem;
//     margin-bottom: 0.8rem;
//     margin-right: 0.8rem;
//     position: relative;
//     .uploud-img {
//       width: 8rem;
//       height: 8rem;
//     }
//     .close {
//       position: absolute;
//       right: -0.4rem;
//       top: -0.4rem;
//       width: 2rem;
//       height: 2rem;
//     }
//   }
//   .uploud-video {
//     position: absolute;
//     z-index: 10;
//     left: 2.3rem;
//     top: 2.3rem;
//   }
//   .audio {
//     margin-right: 0.8rem;
//     margin-bottom: 0.8rem;
//     position: relative;
//     .closeAudio {
//       position: absolute;
//       right: -0.4rem;
//       top: -0.4rem;
//       width: 2rem;
//       height: 2rem;
//     }
//   }
// }
.van-popup {
  width: 100%;
}
.wrapper {
  /*width: 30rem;*/
  /*height: 20rem;*/
}
</style>
