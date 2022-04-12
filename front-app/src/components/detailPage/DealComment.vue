<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-08-11 15:24:42
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-08-19 09:48:17
-->
<template>
  <div class="deal-comment">
    <div class="title">处置描述</div>
    <div class="comment">{{ comment }}</div>
  </div>
</template>

<script>
export default {
  name: "DealComment",
  props: {
    comment: String,
  },
};
</script>

<style lang="scss" scoped>
.deal-comment {
  width: 100%;
  background: white;
  .title {
    width: 100%;
    height: 2.3325rem;
    font-size: 1.3325rem;
    line-height: 1.3325rem;
    margin-bottom: 0.5rem;
    background: white;
    padding: 0.5rem 1.3325rem 0.5rem;
  }
  .comment {
    width: calc(100% - 2.665rem);
    min-height: 4.8325rem;
    background: #f5f6f8;
    border-radius: 4px;
    padding: 0.75rem 1.25rem 0.75rem;
    margin: 0 auto;
    font-size: 1.17rem;
  }
}
</style>