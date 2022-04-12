<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-06-30 17:04:28
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-07-01 10:03:55
-->
<template>
  <div class="container">
    <div class="wave">
      <div class="top" :style="`top: ${calcPer}%;`"></div>
      <div class="bottom" :style="`top: ${calcPer}%;`"></div>
    </div>
    <div class="description">{{ des }}</div>
  </div>
</template>

<script>
export default {
  name: "wave",
  props: {
    num: Number,
    description: [String, Number],
  },
  computed: {
    calcPer() {
      return 150 - this.num * 100;
    },
    des() {
      return (this.description * 100).toFixed(2) + "%";
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  border: 3px solid #76daff;
  border-radius: 50%;
  overflow: hidden;
}

.wave {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
}
.top,
.bottom {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 100%;
  left: 40%;
  background-color: #76daff;
  border-radius: 45%;
  transform: translate(-50%, -50%) rotate(0);
  -webkit-animation: rotate 6s linear infinite;
  animation: rotate 6s linear infinite;
  z-index: 10;
}
.bottom {
  left: 60%;
  border-radius: 47%;
  background-color: #76daff;
  transform: translate(-50%, -50%) rotate(0);
  -webkit-animation: rotate 10s linear -5s infinite;
  animation: rotate 10s linear -5s infinite;
  z-index: 20;
}

.description {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 1.5rem;
  z-index: 100;
}

@-webkit-keyframes rotate {
  50% {
    transform: translate(-50%, -53%) rotate(180deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@keyframes rotate {
  50% {
    transform: translate(-50%, -50%) rotate(180deg);
  }
  100% {
    transform: translate(-50%, -53%) rotate(360deg);
  }
}
</style>
