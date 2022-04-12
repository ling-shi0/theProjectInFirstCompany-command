<template>
  <div
    v-clickoutside="() => (visible = false)"
    :class="[kind ? 'el-select--' + kind : '']"
    class="el-select"
  >
    <div
      v-if="multiple"
      ref="tags"
      :class="{
        'el-select__tags--nowrap': multipleNowrap
      }"
      :style="{ 'max-width': inputWidth - inputWidthMin + 'px' }"
      class="el-select__tags"
      @click.stop="visible = !visible"
    >
      <span v-if="collapseTags && !checkStrictly && selected.length">
        <el-tag
          :closable="!disabled"
          :size="collapseTagSize"
          :title="selected[0][props.label]"
          :hit="true"
          max-width="94px"
          type="primary"
          close-transitions
          @close="_deleteTag($event, selected[0])"
        >
          <span class="el-select__tags-text">
            {{ selected[0][props.label] }}
          </span>
        </el-tag>
        <el-tag
          v-if="selected.length > 1"
          :closable="false"
          :size="collapseTagSize"
          :title="
            selected
              .slice(1)
              .map(item => item[props.label])
              .join(',')
          "
          type="primary"
          close-transitions
        >
          <span class="el-select__tags-text">+ {{ selected.length - 1 }}</span>
        </el-tag>
      </span>
      <transition-group
        v-if="!collapseTags || checkStrictly"
        @after-leave="resetInputHeight"
      >
        <el-tag
          v-for="item in selected"
          :key="item[nodeKey]"
          :title="item[props.label]"
          :closable="!disabled"
          :size="collapseTagSize"
          :hit="true"
          max-width="94px"
          type="primary"
          close-transition
          @close="_deleteTag($event, item)"
        >
          <span class="el-select__tags-text">{{ item[props.label] }}</span>
        </el-tag>
      </transition-group>
    </div>
    <el-input
      ref="reference"
      :placeholder="placeholder"
      :size="size"
      :disabled="disabled"
      :readonly="true"
      :validate-event="false"
      type="text"
      @click.native.stop="visible = !visible"
      @mouseenter.native="mouseover = true"
      @mouseleave.native="mouseover = false"
    >
      <i
        slot="suffix"
        :class="{
          'h-icon-angle_down_sm': !showClear,
          'h-icon-close_f': showClear
        }"
        class="el-input__icon"
        @click.stop="showClear ? clearSelected() : (visible = !visible)"
      />
    </el-input>
    <transition name="el-zoom-in-top" @after-leave="doDestroy">
      <el-select-menu
        v-show="visible"
        ref="popper"
        :append-to-body="popperAppendToBody"
      >
        <el-input
          v-if="showSearch"
          v-model="searchWords"
          placeholder="搜索"
          clearable
          :on-icon-click="SearchTreeAction"
          suffix-icon="h-icon-search"
          @clear="ClearSearchResultAction"
        ></el-input>
        <el-tree
          v-if="asyncTreeChangeflag"
          ref="tree"
          :default-expanded-keys="expandKeys"
          :default-expand-all="defaultExpandAll"
          :empty-text="emptyText"
          :data="data"
          :check-strictly="checkStrictly"
          :show-checkbox="multiple"
          :highlight-current="!multiple"
          :expand-on-dbclick-node="false"
          :node-key="nodeKey"
          :parent-key="parentKey"
          :props="props"
          :load="load"
          :lazy="lazy"
          :simple-data="simpleData"
          @check="_handleTreeCheck"
          @node-expand="_handleNodeExpand"
          @node-collapse="_handleNodeCollapse"
        />
      </el-select-menu>
    </transition>
  </div>
</template>

<script type="text/babel">
import Emitter from "hui/src/mixins/emitter";
import Locale from "hui/src/mixins/locale";
import ElSelectMenu from "./tree-select-dropdown.vue";
import Clickoutside from "hui/src/utils/clickoutside";
import { addClass, removeClass, hasClass } from "hui/src/utils/dom";
import {
  addResizeListener,
  removeResizeListener
} from "hui/src/utils/resize-event";
import { t } from "hui/src/locale";
// import { findLabelTreeByInfoKeyWord } from '@/api/criminalLibary/lib';
const sizeMap = {
  large: 42,
  small: 30,
  mini: 22
};

export default {
  name: "TreeSelect",

  components: {
    ElSelectMenu
  },

  directives: { Clickoutside },
  mixins: [Emitter, Locale],

  componentName: "TreeSelect",

  props: {
    removeChildKeys: {
      type: Boolean,
      default: true
    },
    defaultExpandAll: {
      type: Boolean,
      default: false
    },
    asyncTreeChangeflag: {
      type: Boolean,
      default: true
    },
    lazy: {
      type: Boolean,
      default: false
    },
    // 清除搜索结果
    handleClearSearchResult: {
      type: Function,
      default: null
    },
    // 搜索功能函数
    handleSearchTree: {
      type: Function,
      default: null
    },
    // 是否展示搜索框
    showSearch: {
      type: Boolean,
      default: false
    },
    // 回显数据
    displayLabels: {
      type: Array,
      default: () => []
    },
    value: {
      type: [String, Number, Array],
      required: true
    },
    size: {
      type: String,
      default: null
    },
    clearable: {
      type: Boolean,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: null
    },
    popperClass: {
      type: String,
      default: null
    },
    kind: {
      type: String,
      default: null
    },

    multiple: {
      type: Boolean,
      default: null
    },
    multipleNowrap: {
      type: Boolean,
      default: null
    },
    placeholder: {
      type: String,
      default() {
        return t("el.select.placeholder");
      }
    },
    collapseTags: {
      type: Boolean,
      default: null
    },
    popperAppendToBody: {
      type: Boolean,
      default: true
    },
    // 树
    treeData: {
      type: Array,
      default: () => []
    },
    checkStrictly: {
      type: Boolean,
      default: false
    },
    nodeKey: {
      type: String,
      default: "value"
    },
    parentKey: {
      type: String,
      default: null
    },
    simpleData: {
      type: Boolean,
      default: false
    },
    load: {
      type: Function,
      default: null
    },
    props: {
      type: Object,
      default: () => ({
        label: "label",
        children: "children",
        icon: "icon",
        disabled: "disabled",
        selectable: "selectable",
        isLeaf: "isLeaf"
      })
    }
  },

  data() {
    return {
      selected: this.multiple ? [] : {},
      expandKeys: [],
      visible: false,

      inputWidth: 0,
      inputWidthMin: 0,
      mouseover: false,
      searchWords: "",
      flag: true
    };
  },

  computed: {
    showClear() {
      return (
        this.clearable &&
        !this.disabled &&
        this.mouseover &&
        this.value !== undefined &&
        (Array.isArray(this.value)
          ? this.value.length !== 0
          : this.value !== "")
      );
    },
    emptyText() {
      return this.t("el.select.noData");
    },
    selectSize() {
      return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
    },
    selectDisabled() {
      return this.disabled || (this.elForm || {}).disabled;
    },
    collapseTagSize() {
      return ["medium", "small"].indexOf(this.selectSize) > -1
        ? "small"
        : "medium";
    }
  },

  watch: {
    treeData: {
      handler(val) {
        this.data = val;
      },
      immediate: true
    },
    searchWords(val) {
      if (!val) {
        this.ClearSearchResultAction();
      }
    },
    value(val) {
      this.dispatch("ElFormItem", "el.form.change", val);
    },
    displayLabels(val) {
      if (this.multiple) {
        this.selected = val.length ? val.concat() : [];
      } else {
        this.selected = {};
      }
    },
    visible(val) {
      if (!val) {
        this.broadcast("TreeSelectDropdown", "destroyPopper");
        !this.criteria && this._handleIconHide();
      } else {
        this.broadcast("TreeSelectDropdown", "updatePopper");
        !this.criteria && this._handleIconShow();
      }
      this.$emit("visible-change", val);
    }
  },

  created() {
    this.dom = document.createElement("div");
    this.dom.classList.add("el-select-tree-dropdown");
  },

  mounted() {
    addResizeListener(this.$el, this.handleResize);
    this.$nextTick(() => {
      if (this.$refs.reference && this.$refs.reference.$el) {
        if (this.$refs.reference) {
          this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width;
        }
      }
    });
  },

  beforeDestroy() {
    if (this.$el && this.handleResize) {
      removeResizeListener(this.$el, this.handleResize);
    }
  },

  methods: {
    ClearSearchResultAction() {
      this.handleClearSearchResult(this.selected);
    },
    // 搜索框点击搜索
    async SearchTreeAction() {
      this.handleSearchTree(this.searchWords, this.selected);
    },
    _handleNodeExpand(data, node) {
      this.expandKeys.push(data[this.nodeKey]);
    },
    _handleNodeCollapse(data, node) {
      this._removeExpandKeys(node);
    },
    _removeExpandKeys(node, removeKeys) {
      const index = this.expandKeys.indexOf(node.data[this.nodeKey]);
      if (index > -1) this.expandKeys.splice(index, 1);
      node.childNodes.forEach(item => {
        this._removeExpandKeys(item);
      });
    },
    _deleteTag(event, tag) {
      event.stopPropagation();
      const index = this.selected.findIndex(
        item => item[this.nodeKey] === tag[this.nodeKey]
      );
      if (index > -1) this.selected.splice(index, 1);
      this.$refs.tree.setChecked(tag, false, true);
      if (this.multiple) {
        const inputVal = [];
        this.selected.forEach(item => {
          inputVal.push(item[this.nodeKey]);
        });
        this.$emit("input", inputVal);
      } else {
        const value = this.$refs.tree.getCheckedKeys();
        this.$emit("input", value);
      }
    },
    _handleTreeCheck(data) {
      const node = this.$refs.tree.getNode(data);
      this.checkStrictly
        ? this._mergetCheckedNodes(node)
        : this._findCheckedNodes(node);

      if (this.multiple) {
        const inputVal = [];
        const addKeys = (items, arr) => {
          if (items.children.length > 0) {
            items.children.forEach(item => {
              arr.push(item[this.nodeKey]);
              addKeys(item, arr);
            });
          }
        };
        this.selected.forEach(item => {
          inputVal.push(item[this.nodeKey]);
          !this.removeChildKeys && addKeys(item, inputVal);
        });
        this.$emit("input", inputVal);
      } else {
        const val = this.$refs.tree.getCheckedKeys();
        this.$emit("input", val);
      }
    },
    _findCheckedNodes(node) {
      const parentNode = node.parent;
      if (parentNode && parentNode.checked) {
        this._findCheckedNodes(parentNode);
        this._removeChildrenNodesInSelect(parentNode);
      } else {
        this._mergetCheckedNodes(node);
      }
    },
    _mergetCheckedNodes(node) {
      if (node.checked) {
        this._removeChildrenNodesInSelect(node);
        this.selected.push(node.data);
      } else {
        this._removeParentNodeInSelect(node);
      }
    },
    _removeChildrenNodesInSelect(node) {
      if (node && node.childNodes.length > 0) {
        node.childNodes.forEach(itemNode => {
          this._removeChildrenNodesInSelect(itemNode);
          const index = this.selected.findIndex(
            item => item[this.nodeKey] === itemNode.data[this.nodeKey]
          );
          if (index > -1) this.selected.splice(index, 1);
        });
      }
    },
    _removeParentNodeInSelect(node) {
      const index = this.selected.findIndex(
        item => item[this.nodeKey] === node.data[this.nodeKey]
      );
      if (index > -1) {
        this.selected.splice(index, 1);
      }

      if (
        !this.checkStrictly &&
        node.parent &&
        !Array.isArray(node.parent.data)
      ) {
        this._removeParentNodeInSelect(node.parent);
        node.parent.childNodes.forEach(itemNode => {
          if (itemNode.checked) {
            const _index = this.selected.findIndex(
              item => item[this.nodeKey] === itemNode.data[this.nodeKey]
            );
            if (_index === -1) this.selected.push(itemNode.data);
          }
        });
      }
    },
    // 如果存在，返回node, 不存在，返回null
    _isSelectedContainsParentNode(node) {
      if (
        this.selected.findIndex(
          item => item[this.nodeKey] === node.data[this.nodeKey]
        ) > -1
      ) {
        return node;
      }
      if (node.parent) return this._isSelectedContainsParentNode(node.parent);
      return null;
    },
    _handleIconHide() {
      const icon = this.$el.querySelector(".el-input__suffix");
      if (icon) {
        removeClass(icon, "is-reverse");
      }
    },
    _handleIconShow() {
      const icon = this.$el.querySelector(".el-input__suffix");
      if (icon && !hasClass(icon, "h-icon-close_f")) {
        addClass(icon, "is-reverse");
      }
    },

    doDestroy() {
      this.searchWords = "";
      this.$refs.popper && this.$refs.popper.doDestroy();
    },

    resetInputHeight() {
      this.$nextTick(() => {
        if (!this.$refs.reference) return;
        const inputChildNodes = this.$refs.reference.$el.childNodes;
        const input = [].filter.call(
          inputChildNodes,
          item => item.tagName === "INPUT"
        )[0];
        input.style.height =
          Math.max(this.$refs.tags.clientHeight, sizeMap[this.size] || 32) +
          "px";
        if (this.visible && this.emptyText !== false) {
          this.broadcast("TreeSelectDropdown", "updatePopper");
        }
      });
    },

    resetInputWidth() {
      this.inputWidth =
        (this.$refs.reference &&
          this.$refs.reference.$el.getBoundingClientRect().width) ||
        0;
    },
    resetInputWidthMin() {
      this.inputWidthMin = this.clearable ? 50 : 32;
    },
    handleResize() {
      this.resetInputWidth();
      this.resetInputWidthMin();
      if (this.multiple) this.resetInputHeight();
    },
    clearSelected() {
      this.selected = [];
      this.$refs.tree.setCheckedKeys([]);
      this.$emit("input", []);
    }
  }
};
</script>
<style lang="scss">
.el-select-dropdown {
  .el-tree-scrollbar__wrap {
    max-height: 274px;
  }
}
</style>
