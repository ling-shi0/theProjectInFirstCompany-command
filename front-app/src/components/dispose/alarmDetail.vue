<!--
 * @Description: 每一条警情的详细描述
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-08-10 16:08:27
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-08-17 17:00:37
-->
<template>
  <div class="content">
    <span>#{{ itemMes.alarmType }}#</span>{{ itemMes.alarmComment }}
    <div class="item-icon">
      <img :src="itemIcon" style="width: 100%; height: 100%" />
    </div>
  </div>
</template>

<script>
import itemIcon from "@/src/assets/icons/listIcon.png";

export default {
  name: "AlarmDetail",
  props: { itemMes: Object },
  data() {
    return {
      itemIcon,
    };
  },
};
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  min-height: 5rem;
  background: #f5f6f8;
  border-radius: 4px;
  font-size: 1.17rem;
  padding: 0.75rem 0.67rem 0.58rem 2.92rem;
  position: relative;
  .item-icon {
    width: 1.2rem;
    height: 1.2rem;
    position: absolute;
    top: 1rem;
    left: 1rem;
  }
  & span {
    color: #f79420;
  }
}
</style>