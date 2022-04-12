<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-08-25 15:02:53
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-08-25 16:09:11
-->
<template>
  <div :class="isHigh ? 'rate-ball' : 'rate-ball low'">
    <div>{{ progressDescription }}</div>
  </div>
</template>

<script>
export default {
  name: "RateBall",
  props: {
    progressDescription: String,
    isHigh: Boolean,
  },
};
</script>

<style lang="scss" scoped>
.rate-ball {
  width: 3.0825rem;
  height: 3.0825rem;
  border: 1px solid #ff490c;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 1.54125rem;
  > div {
    width: 90%;
    height: 90%;
    background: #ff490c;
    color: white;
    font-size: 1.1675rem;
    line-height: 2.774rem;
    text-align: center;
    font-weight: bold;
    border-radius: 1.387125rem;
  }
  &.low {
    border: 1px solid #21d3ab;
    > div {
      background: #21d3ab;
    }
  }
}
</style>
