<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-03-09 16:11:33
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-04-10 10:57:37
-->
<template>
  <div class="video-list" v-if="videoListVisible">
    <div class="video-list-title">
      视频
      <div>
        <i class="h-icon-menu_leftbar" @click="openPointList"></i>
        <i class="h-icon-close" @click="closeVideoList"></i>
      </div>
    </div>
    <div class="video-list-items">
      <div
        class="video-list-items-item"
        v-for="(item, index) in videoList"
        :key="index"
      >
        <div v-if="!item" class="video-list-items-item-blank">
          <el-load-icon></el-load-icon>
          <div>暂无播放资源</div>
        </div>
        <player style="width: 100% !important;height: 100% !important" :itemData="item" :key="index" :index="index" v-else></player>
      </div>
    </div>
  </div>
</template>

<script>
import Player from '@/components/Player';
import { queryVideoUrl } from '@/api/aroundVideo.js';
export default {
  name: 'VideoList',
  components: {
    Player
  },
  props: {
    visible: {
      type: Boolean,
      default: () => {}
    }
  },
  watch: {
    visible(val) {
      this.videoListVisible = val;
    }
  },
  mounted() {
    this.videoListVisible = this.visible;
    this.bus.$on('pointListToVideoList', data => {
      this.$set(this, 'videoPointMes', data);
      this.getVideoListUrls(data);
    });
  },
  data() {
    return {
      videoList: ['', '', '', ''],
      videoPointMes: [],
      videoListVisible: false
    };
  },
  methods: {
    closeVideoList() {
      this.videoListVisible = false;
      this.$emit('closeVideoList');
    },
    openPointList() {
      this.$emit('openPointList');
    },
    getVideoListUrls(datas) {
      const params = [];
      datas.forEach(item => {
        if (JSON.stringify(item) !== '{}' && item) {
          params.push({
            cameraIndexCode:
              item.indexCode || item.cameraIndexCode || item.address,
            cameraName: item.nameStr || item.name
          });
        }
      });
      if (params.length) {
        queryVideoUrl(params).then(({ data }) => {
          let j = 0;
          for (let i in data) {
            if (data[i]) {
              data[i] = data[i].slice(0, data[i].length - 1);
              data[i] += `,"deviceIndexCode":"${
                datas[j].indexCode ||
                datas[j].cameraIndexCode ||
                datas[j].address
              }"`;
              data[i] += `,"nameStr":"${datas[j].nameStr || datas[j].name}"}`;
              j++;
            }
          }
          let videoObjList = [];
          datas.forEach(item => {
            if (JSON.stringify(item) !== '{}') {
              videoObjList.push(
                data[item.indexCode || item.cameraIndexCode || item.address]
              );
            } else {
              videoObjList.push('');
            }
          });
          if (videoObjList.length < 4) {
            let len = videoObjList.length;
            // 补一下位置  要不界面有点丑
            for (let i = 0; i < 4 - len; i++) {
              videoObjList.push('');
            }
          }
          this.$set(this, 'videoList', videoObjList);
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.video-list {
  width: 100%;
  height: 100%;
  background: #ffffff;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  pointer-events: auto;
  &-title {
    width: 100%;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 6px;
    font-weight: bold;
    > div {
      height: 44px;
      display: flex;
      align-items: center;
      > i {
        font-size: 1.5rem;
        cursor: pointer;
      }
    }
  }
  &-items {
    width: 100%;
    height: calc(100% - 44px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    &-item {
      width: 100%;
      height: 24.5%;
      background: black;
      &-blank {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: white;
        ::v-deep .h-an-icon-loading {
          color: white;
        }
      }
    }
  }
}
</style>