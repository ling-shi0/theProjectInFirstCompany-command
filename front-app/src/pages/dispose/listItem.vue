<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-07-31 10:28:48
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-09-13 16:50:00
-->
<template>
  <div class="card">
    <div class="header" @click="handleClick">
      {{ itemMes.alarmTime }}
      <span :style="judgeColor('font') + judgeColor('back')">
        <div
          class="circle"
          :style="judgeColor('font').replace('color:', 'background: ')"
        ></div>
        已{{ itemMes.alarmState }}</span
      >
    </div>
    <div class="content" v-if="!dontShowDetail" @click="handleClick">
      <div class="van-multi-ellipsis--l2">
        <span>#{{ itemMes.alarmType }}#</span>{{ itemMes.alarmComment }}
      </div>
      <div class="item-icon">
        <img :src="itemIcon" style="width: 100%; height: 100%" />
      </div>
    </div>
    <div class="position" v-if="!dontShowFooter" @click="handleClick">
      <img :src="mapIcon" />&nbsp;{{ sliceAddress(itemMes.alarmAddress) }}
    </div>
    <div class="footer" v-if="!dontShowFooter">
      <van-button :icon="call" plain type="primary" @click.stop="callUp">
        呼叫 </van-button
      ><van-button
        :icon="mess"
        plain
        type="primary"
        @click.stop="signUp(itemMes)"
        v-if="itemMes.alarmState === '分派'"
        :disabled="disabledBut || itemMes.onlyRead"
      >
        签收 </van-button
      ><van-button
        :icon="arrive"
        plain
        type="primary"
        v-if="itemMes.alarmState === '签收'"
        @click.stop="arriveAt(itemMes)"
        :disabled="disabledBut || itemMes.onlyRead"
      >
        到达 </van-button
      ><van-button
        :icon="deal"
        plain
        type="primary"
        @click.stop="toPispose(itemMes)"
        v-if="itemMes.alarmState === '到达'"
        :disabled="disabledBut || itemMes.onlyRead"
      >
        处置
      </van-button>
    </div>
  </div>
</template>

<script>
import mapIcon from "@/src/assets/icons/mapicon.png";
import call from "@/src/assets/icons/callicon.png";
import mess from "@/src/assets/images/dispose/mess.png";
import arrive from "@/src/assets/images/dispose/place.png";
import deal from "@/src/assets/images/dispose/deal.png";
import http from "@/src/axios/dispose";
import itemIcon from "@/src/assets/icons/listIcon.png";

export default {
  name: "listItem",
  props: {
    itemMes: Object,
    dontShowFooter: Boolean,
    index: Number,
    dontShowDetail: Boolean,
  },
  data() {
    return {
      mapIcon,
      call,
      disabledBut: false,
      mess,
      arrive,
      deal,
      itemIcon,
    };
  },
  methods: {
    arriveAt(item) {
      if (this.disabledBut || item.onlyRead) {
        this.$toast.fail("该条警情已被其他警员签收！");
        return;
      }
      this.$hatom.locationInfo.getLocation((res) => {
        let longitude = JSON.parse(res.message).longitude;
        let latitude = JSON.parse(res.message).latitude;
        if (!+longitude || !+latitude) {
          this.$toast.fail("请检查并打开GPS开关!");
          longitude = item.longitude;
          latitude = item.latitude;
        }
        http
          .arriveAtAlarmPosition({
            alarmNo: item.alarmNo,
            userId: this.$store.state.userInfo.userIndexCode,
            longitude: JSON.parse(res.message).longitude,
            latitude: JSON.parse(res.message).latitude,
          })
          .then((res) => {
            this.$toast.success("状态修改成功！");
            item.alarmState = "到达";
          });
      });
    },
    signUp(item) {
      if (this.disabledBut || item.onlyRead) {
        this.$toast.fail("该条警情已被其他警员签收！");
        return;
      }
      this.$emit("signDataChange", { item, index: this.index });
    },
    toPispose(item) {
      if (this.disabledBut || item.onlyRead) {
        this.$toast.fail("该条警情已被其他警员签收！");
        return;
      }
      const currentUserId = this.$store.state.userInfo.userIndexCode;
      this.$router.push({
        name: "detailPage",
        query: {
          currentUserId: currentUserId,
          alarmNo: item.alarmNo,
          showDispose: true,
          item,
        },
      });
      // this.$router.push({ name: "toDispose", params: { item: item } });
    },
    callUp() {
      // /** pageName为跳转页面名称 */
      // const data = {
      //   params: {},
      //   target: `native:/xmessage/activity`,
      // };
      // /** 跳转到page1.html */
      // this.$hatom.page.pushPage(data);

      this.$hatom.native(
        "customPortal.selectNavItem",
        (res) => {
          console.log(res);
        },
        {
          navItemIndex: "1",
        }
      );
    },
    judgeColor(which) {
      let res;
      switch (this.itemMes.alarmState) {
        case "接警": {
          res =
            which === "font"
              ? "color: #457BFA;"
              : "background: rgba(69,123,250,0.1)";
          break;
        }
        case "分派": {
          res =
            which === "font"
              ? "color: #457BFA;"
              : "background: rgba(69,123,250,0.1)";
          break;
        }
        case "签收": {
          res = "";
          break;
        }
        case "到达": {
          res = "";
          break;
        }
        case "完结": {
          res =
            which === "font"
              ? "color: #9B9B9B;"
              : "background: rgba(155,155,155,0.1)";
          break;
        }
        default: {
          res = "";
        }
      }
      return res;
    },
    handleClick() {
      this.$emit("handleClick");
    },
    sliceAddress(address) {
      if (address.length > 25) {
        return address.slice(0, 25) + "...";
      } else {
        return address;
      }
    },
  },
};
</script>

<style>
.card .van-button--primary {
  border: none !important;
  color: #2080f7 !important;
}
</style>

<style lang="scss" scoped>
.card {
  width: 100%;
  height: 15.67rem;
  background: #ffffff;
  .header {
    width: 100%;
    height: 3.67rem;
    padding: 0 1.33rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1rem;
    > span {
      width: 5.42rem;
      height: 1.67rem;
      border-radius: 10px;
      background: rgba(247, 148, 32, 0.1);
      color: #f79420;
      text-indent: 1.67rem;
      position: relative;
      .circle {
        width: 0.5rem;
        height: 0.5rem;
        border-radius: 0.25rem;
        background: #f79420;
        position: absolute;
        top: calc(50% - 0.25rem);
        left: 0.83rem;
      }
    }
  }
  .content {
    width: calc(100% - 2.66rem);
    height: 4.83rem;
    margin: 0 auto;
    background: #f5f6f8;
    border-radius: 4px;
    font-size: 1.17rem;
    padding: 0.75rem 0.67rem 0.58rem 2.92rem;
    position: relative;
    > div:first-child {
      width: 100%;
      height: 3.3rem;
      // border: 1px red solid;
    }
    .item-icon {
      width: 1.2rem;
      height: 1.2rem;
      position: absolute;
      top: 1rem;
      left: 1rem;
    }
    & span:first-child {
      color: #f79420;
    }
  }
  .position {
    width: 100%;
    height: 3.5rem;
    padding: 0 1.33rem;
    color: #999999;
    border-bottom: 0.08rem solid #f5f6f8;
    display: flex;
    align-items: center;
    font-size: 1rem;
    & img {
      width: 1.11rem;
    }
  }
  &:active {
    .position,
    .content,
    .header {
      background: #f5f6f8;
    }
  }
  .footer {
    width: 100%;
    height: 3.67rem;
    padding: 0 1.33rem;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>