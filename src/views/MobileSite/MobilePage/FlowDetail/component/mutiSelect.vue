<template>
  <div class="copyList">
    <van-nav-bar
      :title="title"
      left-arrow
      fixed
      placeholder
      @click-left="getBack"
    />
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
    <van-checkbox-group
      v-model="result"
      ref="checkboxGroup"
      style="margin-top: 35px"
    >
      <van-cell-group>
        <van-cell v-for="(item, index) in dictList" clickable :key="index">
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

    <div class="footer">
      <div class="people">
        <van-tag
          plain
          type="primary"
          v-for="(item, index) in result"
          :key="index"
          class="tag"
        >
          {{ allList.get(item) }}
        </van-tag>
      </div>
      <div class="rightBtnBox">
        <div class="emptyBtn right" @click="$parent.close()">取消</div>
        <div class="customBtn" v-if="result.length > 0" @click="onConfirm">
          {{ `确认(${result.length})` }}
        </div>
        <div class="emptyBtn" v-else @click="onConfirm">确认</div>
      </div>
    </div>
  </div>
</template>

<script>
import { userList } from "@/api/mobileApi/flow";
import { mapMutations, mapState } from "vuex";
import _ from "lodash";

export default {
  props: {
    title: {
      type: String,
      default: "选择",
    },
    dictList: Array,
    defaultValue: String,
    menuKey: Number,
  },
  computed: {
    ...mapState("Todo", ["selectedList"]),
  },
  data() {
    return {
      result: [],
      checkedAll: false,
      allList: new Map(),
      returnValue: "",
      returnLabel: "",
      returnList: {},
    };
  },

  watch: {
    menuKey: {
      handler(next, pre) {
        this.result = [];
        if (this.defaultValue.length > 0) {
          this.result = this.defaultValue.split(",");
        }

        this.dictList.forEach((e) => {
          this.allList.set(e.value, e.label);
        });
      },
      immediate: true,
      deep: true,
    },
  },

  methods: {
    selectAll() {
      this.$refs.checkboxGroup.toggleAll(this.checkedAll);
    },

    getBack() {
      this.$parent.close();
    },

    onConfirm() {
      this.returnLabel = "";
      this.returnValue = this.result.join(",");
      let data = [];

      this.result.forEach((e) => {
        data.push(this.allList.get(e));
      });

      this.returnLabel = data.join(",");

      this.$emit("onConfirm", {
        label: this.returnLabel,
        value: this.returnValue,
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
    top: 40px;
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

  .rightBtnBox{
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

  .right{
    margin-right: 5px;
    background-color: #EE0A24;
  }
}
</style>