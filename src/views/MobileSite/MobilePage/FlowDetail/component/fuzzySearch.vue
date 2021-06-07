<template>
  <div class="copyList">
    <van-nav-bar
      :title="title"
      left-arrow
      fixed
      placeholder
      @click-left="$parent.close()"
    />

    <div class="searchBox">
      <div class="search-content">
        <van-icon name="search" style="margin-top: 2px; margin-right: 2px" />
        <input
          type="text"
          placeholder="请输入搜索关键词"
          @keyup.enter="search"
        />
      </div>
    </div>

    <div class="selectAllBox">
      <van-cell clickable>
        <template #title>
          <van-checkbox
            name="all"
            icon-size="16px"
            v-model="checkedAll"
            @click="selectAll"
            >全选</van-checkbox
          >
        </template>
      </van-cell>
    </div>

    <van-pull-refresh
      v-model="refreshing"
      @refresh="onRefresh"
      style="margin-top: 95px"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :immediate-check="false"
        @load="onLoad"
        ref="list"
      >
        <van-checkbox-group v-model="result" ref="checkboxGroup">
          <van-cell-group>
            <van-cell
              v-for="(item, index) in list"
              clickable
              :key="index"
              @click="toggle(index)"
            >
              <template #title>
                <van-checkbox
                  :name="item.value"
                  ref="checkboxes"
                  icon-size="16px"
                  :value="item.label"
                >
                  {{ item.label }}
                </van-checkbox>
              </template>
            </van-cell>
          </van-cell-group>
        </van-checkbox-group>
      </van-list>
    </van-pull-refresh>
    <div class="footer">
      <div class="people">
        <van-tag
          plain
          type="primary"
          v-for="(item, index) in resultRecall"
          :key="index"
          class="tag"
        >
          {{ `${allList.has(item) ? allList.get(item).label : item}` }}
        </van-tag>
      </div>
      <div class="rightBtnBox">
        <div class="emptyBtn right" @click="$parent.close()">取消</div>
        <div
          class="customBtn"
          v-if="resultRecall"
          @click="onConfirm"
        >
          {{ `确认(${resultRecall.length})` }}
        </div>
        <div class="emptyBtn" v-else @click="onConfirm">确认</div>
      </div>
    </div>
  </div>
</template>

<script>
import { fuzzySearch } from "@/api/mobileApi/flow";
import { mapMutations, mapState } from "vuex";

export default {
  props: {
    menuKey: Number,
    title: {
      type: String,
      default: "选择",
    },
    defaultValue: String | Array,
    fieldDictTable: String,
    fieldDictField: String,
    fieldDictRemark: String,
  },
  data() {
    return {
      list: [],
      result: [],
      keyWords: "",
      checkedAll: false,
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      current: 1,
      size: 10,
      total: null,
      resultRecall: [],
      allList: new Map(),
      resaveList: [],
      valueList: [],
      returnValue: "",
      returnLabel: "",
      returnLabelList: [],
      returnObjList: [],
    };
  },

  watch: {
    menuKey: {
      handler(next, pre) {
        this.list = [];
        this.current = 1;
        this.checkedAll = false;
        this.onLoad();
        this.result = [];
        if (typeof this.defaultValue === "string") {
          if (this.defaultValue) {
            this.result = this.defaultValue.split(",");
          }
        } else {
          this.result = this.defaultValue;
        }
        this.resultRecall = this.result;
        this.init();
      },
      immediate: true,
      deep: true,
    },
  },

  methods: {
    toggle(index) {
      this.$refs.checkboxes[index].toggle();
      setTimeout(() => {
        this.resultRecall = this.result;
      }, 100);
    },

    selectAll() {
      this.$refs.checkboxGroup.toggleAll(this.checkedAll);
      setTimeout(() => {
        this.resultRecall = this.result;
      }, 100);
    },

    getBack() {
      this.$parent.close();
    },

    async init() {
      if (this.resultRecall) {
        const { data } = await fuzzySearch({
          fieldDictTable: this.fieldDictTable,
          fieldDictField: this.fieldDictField,
          fieldDictRemark: this.fieldDictRemark,
          valueList: this.resultRecall,
          search: this.keyWords,
          current: this.current,
          size: -1,
        });

        let initList = data.data.records;

        initList.forEach((e) => {
          this.allList.set(e.value, e);
        });
      }
    },

    async onLoad() {
      const { data } = await fuzzySearch({
        fieldDictTable: this.fieldDictTable,
        fieldDictField: this.fieldDictField,
        fieldDictRemark: this.fieldDictRemark,
        search: this.keyWords,
        current: this.current,
        size: this.size,
      });

      // 如果 refreshing 的值为 true 则刷新列表时重置 list 和 current
      if (this.refreshing) {
        this.list = [];
        this.current = 1;
        this.refreshing = false;
      }
      this.loading = false;

      // 保证每次获取的新数据和上次的合并，防止替换当前列表
      this.list = this.list.concat(data.data.records);
      this.result = this.resultRecall;

      // alllist 作用为，每次请求接口后将数据保存一份作为参照，便于找到选中人员id所对应的名称
      this.list.forEach((e) => {
        this.allList.set(e.value, e);
      });

      this.total = data.data.total;

      // 只有当前列表的长度小于 接口返回的所有总数时才进行分页
      if (this.list.length < data.data.total) {
        this.current++;
      }

      // 否则 设置  finished 为 true 停止分页
      if (this.list.length >= data.data.total) {
        this.finished = true;
      } else {
        this.finished = false;
      }
    },

    onRefresh() {
      this.list = [];
      this.current = 1;
      this.finished = true;
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      //   this.loading = true;
      this.onLoad();
    },

    search(e) {
      this.keyWords = e.target.value;
      this.list = [];
      this.current = 1;
      this.onLoad();
    },

    onConfirm() {
      this.$parent.close();
      this.returnLabel = "";
      this.returnValue = this.resultRecall.join(",");
      this.returnLabelList = [];
      this.returnObjList = [];

      this.result.forEach((e) => {
        this.returnLabelList.push(this.allList.get(e).label);
        this.returnObjList.push(this.allList.get(e));
      });

      this.returnLabel = this.returnLabelList.join(",");

      this.$emit("onConfirm", {
        label: this.returnLabel,
        value: this.returnValue,
        labelList: this.returnLabelList,
        valueList: this.resultRecall,
        objList: this.returnObjList,
      });
    },
  },
};
</script>


<style lang="scss" scoped>
.copyList {
  height: 100vh;
  overflow-y: auto;

  .searchBox {
    position: absolute;
    left: 0;
    right: 0;
    top: 46px;
    z-index: 99;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    box-sizing: border-box;
    padding: 10px 12px;
    background-color: #fff;

    .search-content {
      display: -webkit-box;
      display: -webkit-flex;
      display: flex;
      -webkit-box-flex: 1;
      -webkit-flex: 1;
      flex: 1;
      padding-left: 12px;
      background-color: #f7f8fa;
      border-radius: 2px;
      align-items: center;
      height: 35px;

      input {
        display: block;
        box-sizing: border-box;
        width: 100%;
        min-width: 0;
        margin: 0;
        padding: 0;
        color: #323233;
        line-height: inherit;
        text-align: left;
        background-color: transparent;
        border: 0;
        resize: none;
      }

      input::-webkit-input-placeholder {
        color: #aab2bd;
        font-size: 14px;
      }
    }
  }

  .selectAllBox {
    position: absolute;
    left: 0;
    right: 0;
    top: 100px;
    z-index: 99;
    background-color: #fff;
    border-bottom: 1px solid #f6f7f9;
    border-top: 1px solid #f6f7f9;
  }
}
.clickAll {
  height: 30px;
  background-color: #f6f7f8;
  margin-bottom: 10px;
  padding: 10px 0;

  .inner {
    background-color: #fff;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 2px 15px;
  }
}

.footer {
  height: 40px;
  background-color: #fff;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  border-top: 1px solid rgba(0, 0, 0, 0.055);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;

  .rightBtnBox {
    display: flex;
  }

  .people {
    max-width: 220px;
    overflow: hidden;
    white-space: nowrap;
    font-size: 12px;
    .tag {
      margin-right: 5px;
      margin-bottom: 5px;
    }
  }

  .customBtn {
    border-radius: 5px;
    background-color: #0079fe;
    color: #fff;
    padding: 6px;
    font-size: 12px;
  }

  .emptyBtn {
    border-radius: 5px;
    background-color: #0079fe;
    color: #fff;
    padding: 6px 15px;
    font-size: 12px;
  }

  .right {
    margin-right: 5px;
    background-color: #ee0a24;
  }
}
</style>