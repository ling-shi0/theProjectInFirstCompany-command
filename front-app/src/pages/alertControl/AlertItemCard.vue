<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-08-25 09:52:45
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-09-13 13:49:17
-->
<template>
  <div class="alert-item-card">
    <div class="alert-item-card-img">
      <van-image
        width="6.5rem"
        height="6.5rem"
        fit="fill"
        lazy-load
        :src="itemMes.snappedPicUrl"
      />
    </div>
    <div class="alert-item-card-info">
      <div class="alert-item-card-info-title van-ellipsis">
        {{ itemMes.deployName }}
      </div>
      <div class="alert-item-card-info-item">
        <img :src="mapIcon" style="width: 1.17rem; margin-right: 0.5rem" />
        <span class="van-ellipsis">{{ itemMes.inputSourceName }}</span>
      </div>
      <div class="alert-item-card-info-item">
        <img :src="clockIcon" style="width: 1.17rem; margin-right: 0.5rem" />
        <span class="van-ellipsis">{{
          itemMes.alarmTime &&
          new Date(itemMes.alarmTime).Format("yyyy-MM-dd HH:mm:ss")
        }}</span>
      </div>
    </div>
    <div v-if="activeIndex === 0" class="alert-item-card-progress">
      <RateBall
        :isHigh="+itemMes.similarity.split(',')[0] >= 0.5"
        :progressDescription="formatDesc(itemMes) + '%'"
      ></RateBall>
    </div>
  </div>
</template>

<script>
import mapIcon from "@/src/assets/icons/mapicon.png";
import clockIcon from "@/src/assets/images/selfAlarm/clock.png";
import RateBall from "./RateBall.vue";
export default {
  name: "AlertItemCard",
  props: {
    itemMes: Object,
    activeIndex: Number,
  },
  components: {
    RateBall,
  },
  data() {
    return {
      mapIcon,
      clockIcon,
    };
  },
  methods: {
    formatDesc(item) {
      if (item) {
        return Math.ceil(item.similarity.split(",")[0] * 100);
      } else {
        return "0";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.alert-item-card {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  background: white;
  padding: 0 1rem 0;
  &-img {
    width: 7rem;
    height: 80%;
  }
  &-info {
    width: 60%;
    height: 80%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin-left: 1rem;
    &-title {
      font-size: 1.17rem;
      color: #666666;
    }
    &-item {
      width: 100%;
      height: 2rem;
      display: flex;
      align-items: center;
      font-size: 1.17rem;
      color: #666666;
    }
  }
  &-progress {
    width: calc(40% - 8rem);
    height: 80%;
    display: flex;
    justify-content: flex-end;
  }
  &:active {
    background: #eee;
  }
}
</style>
