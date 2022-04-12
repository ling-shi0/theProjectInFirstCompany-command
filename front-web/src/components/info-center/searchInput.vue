<template>
  <div class="keyword-search" v-clickoutside="closeSearchReault">
    <el-input
      class="P210 add-search-input"
      placeholder="请输入需要添加的人员姓名"
      suffix-icon="h-icon-search"
      v-model="audioInput"
      :on-icon-click="handleSearchMembers"
      @keyup.enter.native="handleSearchMembers"
      clearable
    ></el-input>

    <div
      class="search-result"
      v-if="suggestionVisible && searchMembersData.length"
    >
      <div
        class="result-item"
        v-for="(memberItem, index) in searchMembersData"
        :key="index"
        :class="{ 'exits-member-disabled': !memberItem.status }"
      >
        <i
          class="icon"
          :class="{
            'on-line': memberItem.status,
            'off-line': !memberItem.status
          }"
        ></i>
        <span class="text" v-ellipsis>
          {{ memberItem.name }}&nbsp;{{ memberItem.code }} &nbsp;{{
            memberItem.department
          }}
        </span>
        <span
          v-if="!memberExits(memberItem.resId)"
          class="h-icon-add add-member-btn"
          @click.stop="addMemberToAudioPanel(memberItem)"
        ></span>
        <span v-else class="member-exist">已添加</span>
      </div>
    </div>
    <div
      v-else-if="suggestionVisible && !searchMembersData.length"
      class="search-result empty-result"
    >
      暂无匹配数据
    </div>
  </div>
</template>
<script>
import Clickoutside from '@/utils/clickoutside.js';
import { mapMutations, mapState } from 'vuex';
import {
  getUsersByDeptCode,
  searchUsers,
  modGroup
} from '@/api/InfoCenter/infoCenter';
export default {
  name: 'SearchInput',
  directives: {
    Clickoutside
  },
  data() {
    return { audioInput: '', searchMembersData: [], activated: false };
  },
  watch: {
    audioInput(val) {
      if (!val) {
        this.closeSearchReault();
      }
    }
  },
  computed: {
    ...mapState([
      'showAudioPanel',
      'mapObj',
      'chatUsers',
      'curChatResId',
      'audioStatus',
      'vertoLoginInfo',
      'groupUsers'
    ]),
    suggestionVisible() {
      return this.activated && Array.isArray(this.searchMembersData);
    }
  },
  methods: {
    ...mapMutations([
      'setCurChatResId',
      'updateChatUsers',
      'updateChatGroupUsers'
    ]),
    memberExits(member) {
      const groupMembers = this.groupUsers[this.curChatResId] || [];
      const loginData = this.vertoLoginInfo.resId;
      return loginData === member || groupMembers.includes(member);
    },
    // 根据人员名字搜索相关人员
    async handleSearchMembers() {
      // 接口获取相关警员数据(待完善.........)
      const { data } = await searchUsers({
        keyWord: this.audioInput,
        pageNo: 1,
        pageSize: 1000
      });
      const memRes = data.list;

      this.searchMembersData = memRes.map(item => {
        const { deptPath, number } = item;
        const deptName = deptPath.split('/');
        return {
          ...item,
          code: number,
          department: deptName[deptName.length - 1],
          svgIcon: '', // 设备的图标自己处理
          isDevice: true // 是否是设备
        };
      });
      this.activated = true;
    },
    addMemberToAudioPanel(member) {
      const { resId, name, number,deptPath,displayNumber } = member;
      const memberExit = this.memberExits(resId);
      if (memberExit) return;
      // if (!this.curChatResId) {
      //   this.setCurChatResId(resId);
      //   this.updateChatUsers({ [resId]: { name, number ,deptPath,displayNumber } });
      //   this.updateChatGroupUsers({
      //     [resId]: [resId, this.vertoLoginInfo.resId]
      //   });
      // } else {
        this.handleAddMember(member);
        // const groupMembers = this.groupUsers[this.curChatResId] || [];
        // const memberNum = groupMembers.length;
      // }
      this.closeSearchReault();
      this.audioInput = '';
    },
    // 添加聊天人员
    async handleAddMember(member) {
      // const {resId}
      const groupMembers = this.groupUsers[this.curChatResId] || [];
      const { isGroup, name } = this.chatUsers[this.curChatResId];
      const allMembers = [...new Set([member.resId, ...groupMembers])];

      const oldName = name.split('...')[0];
      const groupName =
        oldName.split(',').length >= 2
          ? name
          : oldName.split(',')[0] + ',' + member.name + '...';
      if (isGroup) {
        // 更新群组成员的信息(新增、删除) 后台数据更新 (待完善。。。。。)
        await modGroup({
          addMembers: member.resId,
          groupId: this.curChatResId,
          name: groupName,
          delMembers: '',
          resId: this.vertoLoginInfo.resId
        });
        this.updateChatUsers({
          [member.resId]: {
            name: member.name,
            number: member.number,
            deptPath: member.deptPath,
            displayNumber: member.displayNumber
          }
        });
        this.updateChatGroupUsers({ [this.curChatResId]: allMembers });
      }
      // else {
      // this.createGroup(allMembers, member);
      // }
    },
    // 创建聊天群组
    // createGroup(allMembers, addMember) {
    //   // 创建聊天群组的请求(待完善。。。。。)
    //   const data = { resId: '12255412122', number: '000000123' };
    //   this.updateChatUsers({
    //     [data.resId]: {
    //       creator: this.vertoLoginInfo.resId,
    //       isGroup: true,
    //       name: '群组',
    //       number: data.number
    //     }
    //   });
    //   this.updateChatUsers({
    //     [addMember.resId]: { name: addMember.name, number: addMember.code }
    //   });
    //   this.updateChatGroupUsers({ [data.resId]: allMembers });
    //   this.setCurChatResId(data.resId);
    // },
    closeSearchReault() {
      this.activated = false;
      this.searchMembersData = [];
    }
  }
};
</script>
<style lang="scss" scoped>
@mixin scrollClass {
  &::-webkit-scrollbar {
    width: 4px;
    height: 20px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 100px;
    background: rgba(0, 0, 0, 0.12);
  }
  &::-webkit-scrollbar-track {
    width: 12px;
  }
}
.keyword-search {
  display: inline-block;
  position: relative;
  .add-search-input {
    margin-right: 8px;
    ::v-deep input {
      padding-right: 28px !important;
    }
  }
  .search-result {
    position: absolute;
    top: 36px;
    left: 0px;
    width: 210px;
    border: 1px solid #ccc;
    background: #fff;
    z-index: 55;
    max-height: 300px;
    // padding-bottom: 4px;
    border-radius: 2px;
    overflow: auto;
    @include scrollClass;
    &.empty-result {
      height: 80px;
      line-height: 78px;
      text-align: center;
    }
    .result-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 32px;
      line-height: 32px;
      padding: 4px 6px;
      .text {
        width: 120px;
        white-space: nowrap;
      }
      .add-member-btn {
        width: 55px;
        font-size: 16px;
        text-align: right;
        cursor: pointer;
      }
      .member-exist {
        display: inline-block;
        width: 55px;
        height: 24px;
        // padding: 4px 8px;
        border-radius: 4px;
        vertical-align: middle;
        background: rgb(167, 168, 167);
        color: rgb(255, 255, 255);
        line-height: 24px;
        text-align: center;
      }
      .icon {
        display: inline-block;
        width: 20px;
        height: 20px;

        vertical-align: middle;
        margin-right: 3px;
        &.on-line {
          background: url('../../assets/images/audio/on-line.png') no-repeat
            center;
        }
        &.off-line {
          background: url('../../assets/images/audio/off-line.png') no-repeat
            center;
        }
      }
      &:hover {
        background: #e9f3ff;
      }
      &.exits-member-disabled {
        opacity: 0.6;
        // cursor: not-allowed;
        // .add-member-btn {
        //   cursor: not-allowed;
        // }
      }
    }
  }
  .P210 {
    width: 210px;
  }
}
</style>