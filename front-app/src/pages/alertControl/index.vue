<!--
 * @Description:
 * @Version:
 * @Autor: wangXiaoMing
 * @Date: 2021-06-29 13:50:58
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-09-13 14:01:48
-->
<template>
  <div class="alert-control">
    <div class="alert-control-tabs">
      <van-tabs
        v-model:active="activeIndex"
        animated
        color="#027aff"
        @click="changeTab"
      >
        <van-tab
          v-for="tabItem in tabArr"
          :key="tabItem.id"
          :title="tabItem.name"
        >
          <div class="list" @scroll="handleScroll">
            <van-pull-refresh
              v-model="isPullLoading"
              success-text="刷新成功"
              @refresh="refreshData"
            >
              <div
                v-for="item in listArr"
                :key="item.id"
                class="list-item"
                @click="goToDetail(item)"
              >
                <AlertItemCard
                  :itemMes="item"
                  :activeIndex="activeIndex"
                ></AlertItemCard>
              </div>
              <div v-if="listArr.length === 0" class="empty">
                <van-empty description="暂无数据" :image="emptyImage" />
              </div>
            </van-pull-refresh>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import http from "@/src/axios/alertControl";
import emptyImage from "@/src/assets/images/common/empty.png";
import AlertItemCard from "./AlertItemCard.vue";
import Vue from "vue";

export default {
  name: "AlertControl",
  data() {
    return {
      activeIndex: 0,
      tabArr: [
        {
          name: "人脸报警",
          id: 0,
        },
        {
          name: "车辆报警",
          id: 1,
        },
      ],
      page: {
        pageNo: 1,
        pageSize: 20,
      },
      listArr: [],
      fetchTimer: false,
      emptyImage,
      isPullLoading: false,
      userId: "",
      timer: null,
    };
  },
  components: {
    AlertItemCard,
  },
  async activated() {
    this.userId = await this.initRootInfo();
    this.refreshData();
  },
  methods: {
    getPersonList(isPageFetch) {
      // 假数据fake
      // process.env.NODE_ENV === "development" &&
      //   http.getFakeAlarmPersonList().then(({ data }) => {
      //     if (isPageFetch) {
      //       if (data == null || data.list == null || data.list.length === 0) {
      //         this.page.pageNo--;
      //       } else {
      //         this.listArr = this.listArr.concat([...data.list]);
      //       }
      //     } else {
      //       if (data && data.list && data.list.length > 0) {
      //         this.listArr = data.list;
      //       } else {
      //         this.list = [];
      //       }
      //     }
      //     this.isPullLoading = false;
      //   });
      http
        .getAlarmPersonList({
          userId: this.userId,
          ...this.page,
        })
        .then(({ data }) => {
          if (isPageFetch) {
            if (data == null || data.list == null || data.list.length === 0) {
              this.page.pageNo--;
            } else {
              this.listArr = this.listArr.concat([...data.list]);
            }
          } else {
            if (data && data.list && data.list.length > 0) {
              this.listArr = data.list;
            } else {
              this.list = [];
            }
          }
          this.isPullLoading = false;
        });
    },
    getCarList(isPageFetch) {
      // 假数据fake
      // process.env.NODE_ENV === "development" &&
      //   http.getFakeCarAlarmList().then(({ data }) => {
      //     if (isPageFetch) {
      //       if (data == null || data.list == null || data.list.length === 0) {
      //         this.page.pageNo--;
      //       } else {
      //         this.listArr = this.listArr.concat([...data.list]);
      //       }
      //     } else {
      //       if (data && data.list && data.list.length > 0) {
      //         this.listArr = data.list;
      //       } else {
      //         this.list = [];
      //       }
      //     }
      //     this.isPullLoading = false;
      //   });
      http
        .getAlarmCarList({
          userId: this.userId,
          ...this.page,
        })
        .then(({ data }) => {
          if (isPageFetch) {
            if (data == null || data.list == null || data.list.length === 0) {
              this.page.pageNo--;
            } else {
              this.listArr = this.listArr.concat([...data.list]);
            }
          } else {
            if (data && data.list && data.list.length > 0) {
              this.listArr = data.list;
            } else {
              this.list = [];
            }
          }
          this.isPullLoading = false;
        });
    },
    goToDetail(item) {
      this.$router.push({
        name: "alertControlDetail",
        query: {
          alertItem:
            this.activeIndex === 1 ? JSON.stringify(item) : item.attribute,
          type: this.activeIndex,
        },
      });
    },
    changeTab(item) {
      this.page.pageNo = 1;
      if (item === 1) {
        this.listArr = [];
        this.getCarList();
      } else {
        this.listArr = [];
        this.getPersonList();
      }
    },
    handleScroll(e, t) {
      // let sp = 10; //也可根据当前scrollTop动态改变sp的值，从而实现加速和减速滚动的效果
      // let cont = Number.parseInt(t / sp);
      // let oneLong = e / cont;
      // this.timer = setInterval(() => {
      //   console.log(cont);
      //   if (cont > 0) {
      //     cont--;
      //     window.scrollBy(0, oneLong);
      //   } else {
      //     clearInterval(this.timer);
      //   }
      // }, sp);
      if (
        e.srcElement.scrollTop + e.srcElement.offsetHeight >
        e.srcElement.scrollHeight - 100
      ) {
        this.page.pageNo++;
        if (this.activeIndex === 1) {
          this.getCarList(true);
        } else {
          this.getPersonList(true);
        }
      }
    },
    refreshData() {
      this.page.pageNo = 1;
      if (this.activeIndex === 1) {
        this.getCarList();
      } else {
        this.getPersonList();
      }
    },
    async initRootInfo() {
      return new Promise((resolve, reject) => {
        try {
          Vue.prototype.$hatom.rootInfo.getRootInfo((res) => {
            res = JSON.parse(res.message);
            resolve(res.userIndexCode);
          });
        } catch (error) {
          reject("admin");
        }
      });
    },
  },
};
</script>

<style lang="scss">
.van-tabs__line {
  width: 80px;
}
.van-tabs__wrap {
  border-bottom: 1px solid #f5f6f8;
}
</style>
<style lang="scss" scoped>
.alert-control {
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  &-tabs {
    width: 100%;
    height: calc(100% - 6.4rem);
    .list {
      width: 100%;
      height: 92vh;
      padding: 0 0 1.2rem;
      overflow-y: auto;
      .list-item {
        width: 100%;
        height: 8rem;
        margin-bottom: 0.67rem;
        &:active {
          background: #eee;
        }
      }
      .empty {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>
