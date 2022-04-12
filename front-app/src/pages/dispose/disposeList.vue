<template>
  <div class="dispose-page">
    <div class="tab-list">
      <van-tabs
        v-model:active="focusIndex"
        swipeable
        animated
        color="#027aff"
        title-active-color="#2080F7"
      >
        <van-tab
          v-for="(item, index) in tabArr"
          :key="index"
          :title="item.name"
          :dot="item.dot"
        >
          <div
            class="tab-list-note"
            @click="refreshData"
            v-if="newAlarmCount > 0 && focusIndex == ''"
          >
            有{{ newAlarmCount }}条新警情
          </div>
          <div class="time-box" @scroll="scrollFetchData">
            <van-pull-refresh
              v-model="isPullLoading"
              success-text="刷新成功"
              @refresh="refreshData"
            >
              <div class="empty-box" v-if="list.length === 0 && !loading">
                <van-empty :image="emptyImage" />
              </div>
              <listItem
                v-for="(item, index) in list"
                :key="index"
                @handleClick="jumpPage(item)"
                :itemMes="item"
                :index="index"
                @signDataChange="signDataChange"
                style="margin-bottom: 0.67rem"
              ></listItem>
              <div class="not-any-more" v-if="notAnyMore">没有更多了...</div>
            </van-pull-refresh>
          </div>
        </van-tab>
      </van-tabs>
    </div>
    <van-dialog
      v-model:show="showSignDetail"
      :showConfirmButton="false"
      closeOnClickOverlay
    >
      <SignUpPop :itemMes="signData" @close="closeSignPop"></SignUpPop>
    </van-dialog>
  </div>
</template>
<script>
import http from "@/src/axios/dispose";
import store from "@/src/store/index";
import { alertInfoData } from "@/src/axios/mockApi.js";
import emptyImage from "@/src/assets/images/common/empty.png";
import listItem from "./listItem.vue";
import SignUpPop from "@/src/components/dispose/singUpPop.vue";

export default {
  name: "dispose",
  data() {
    return {
      form: {
        state: "",
        pageNo: 1,
        pageSize: 5,
        userId: "",
      },
      focusIndex: "",
      list: [],
      loading: false,
      tabArr: [
        { name: "全部", tabVal: "", dot: false },
        { name: "未签收", tabVal: 1 },
        { name: "已出警", tabVal: 3 },
        { name: "已处置", tabVal: 5 },
      ],
      isPullLoading: false,
      newAlarmCount: 0,
      emptyImage,
      showSignDetail: false,
      signData: {},
      signIndex: -1,
      notAnyMore: false,
    };
  },
  components: {
    listItem,
    SignUpPop,
  },
  activated() {
    this.list = [];
    this.activeList(this.focusIndex);
  },
  watch: {
    focusIndex(val) {
      this.activeList(val);
    },
    "$store.state.newAlertNum"(val) {
      this.newAlarmCount = val;
    },
    newAlarmCount(val) {
      if (val > 0 && this.focusIndex != 0) {
        this.tabArr[0].dot = true;
      }
    },
  },
  methods: {
    jumpPage(item) {
      const currentUserId = this.$store.state.userInfo.userIndexCode;
      this.$router.push({
        name: "detailPage",
        query: {
          currentUserId: currentUserId,
          alarmNo: item.alarmNo,
          onlyRead: item.onlyRead,
        },
      });
    },
    // 获取列表数据
    getListData(isPageFetch) {
      this.form.userId = this.GLOBAL.userIndexCode;
      http
        .getListData(this.form)
        .then(({ data }) => {
          this.newAlarmCount = 0;
          if (isPageFetch) {
            if (data == null || data.list == null || data.list.length === 0) {
              this.form.pageNo--;
              this.notAnyMore = true;
            } else {
              this.list = this.list.concat([...data.list]);
              this.notAnyMore = false;
            }
          } else {
            if (data && data.list && data.list.length > 0) {
              this.list = data.list;
            } else {
              this.list = [];
            }
          }
          setTimeout(() => {
            store.commit("SET_NEWALERT", 0);
            this.isPullLoading = false;
          }, 1000);
        })
        .catch((err) => {
          this.isPullLoading = false;
          this.$toast(err.msg);
        });
    },
    makeFakeData() {
      this.list = alertInfoData.data;
    },
    refreshData() {
      this.activeList(this.focusIndex);
    },
    activeList(val) {
      val = val === 0 ? "" : val;
      if (!val) {
        this.tabArr[0].dot = false;
      }
      if (val === 2) {
        val = 3;
      } else if (val === 3) {
        val = 5;
      }
      this.form.state = val;
      this.form.pageNo = 1;
      this.getListData();
    },
    signDataChange(data) {
      this.signData = data.item;
      this.signIndex = data.index;
      this.showSignDetail = true;
    },
    closeSignPop(data) {
      if (data && this.signIndex > -1) {
        this.$set(this.list, this.signIndex, data);
      }
      this.showSignDetail = false;
    },
    scrollFetchData(e) {
      if (
        e.srcElement.scrollTop + e.srcElement.offsetHeight >
        e.srcElement.scrollHeight - 100
      ) {
        this.form.pageNo++;
        this.getListData(true);
      }
    },
  },
};
</script>
<style lang="scss">
.van-tabs__wrap {
  border-bottom: 1px solid #f5f6f8;
}
</style>
<style scoped lang="scss">
.dispose-page {
  background-color: #f5f5f5;
  height: 100%;
  position: relative;
  .tab-list {
    width: 100%;
    height: 100%;
    &-note {
      width: 100%;
      height: 2.5rem;
      font-size: 1.5rem;
      line-height: 2.5rem;
      text-align: center;
      color: white;
      background-image: linear-gradient(
        90deg,
        rgba(162, 201, 255, 0.5) 0%,
        #74afff 50%,
        rgba(162, 201, 255, 0.5) 100%
      );
    }
    .time-box {
      height: 92vh;
      overflow-y: auto;
      padding-bottom: 1rem;
      .empty-box {
        padding-top: 20%;
        .empty {
          width: 100%;
        }
      }
      .not-any-more {
        width: 100%;
        height: 2rem;
        text-align: center;
        line-height: 2rem;
        font-size: 1rem;
      }
    }
  }
}
</style>
<style lang="scss">
.tab-list .van-tabs.van-tabs--line {
  height: 100%;
}
.dispose-page .van-dialog {
  width: 84.1vw;
  border-radius: 4px;
}
</style>
