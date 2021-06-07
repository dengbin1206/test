<template>
  <div>
    <van-tabs
      v-model="active"
      color="#0079fe"
      animated
      swipeable
      type="line"
      border
      line-height="2px"
      line-width="80px"
      title-active-color="#0079fe"
      class="tabs"
      @change="change"
    >
      <van-tab
        v-for="(item, index) in tabList"
        :title="item.title"
        :key="index"
      >
      </van-tab>
    </van-tabs>

    <van-pull-refresh
      v-model="refreshing"
      @refresh="onRefresh"
      class="pullrefresh"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
        ref="list"
      >
        <div
          class="cellNode"
          v-for="item in list"
          :key="item.id"
          @click="getCurrentRow(item)"
        >
          <div class="left">
            <div>
              {{ `事务编号:${item.instId}` }}
              <van-tag v-if="item.status === 1" type="warning">处理中</van-tag>
              <van-tag v-if="item.status === 2" type="success">已完成</van-tag>
              <van-tag v-if="item.status === 3" type="danger">已作废</van-tag>
              <van-tag
                v-if="item.readStatus === 0"
                type="warning"
                style="margin-left: 4px"
                plain
                mark
                >未读</van-tag
              >
              <van-tag
                v-if="item.readStatus === 1"
                type="success"
                style="margin-left: 4px"
                mark
                plain
                >已读</van-tag
              >
            </div>
            <div>{{ item.title }}</div>
          </div>
          <div class="right">
            {{ item.createTime | formatDate }}
            <van-icon name="arrow" color="#969799" size="1rem" />
          </div>
        </div>
      </van-list>
      <div class="placeholder"></div>
    </van-pull-refresh>
  </div>
</template>


<script>
import { instCopyReply } from "@/api/mobileApi/flow";
import { filters } from "../myToDoList/index";

export default {
  name: "tabs",
  props: ["tabList", "keyWords"],
  data() {
    return {
      active: 0,
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      current: 1,
      size: 10,
      total: null,
      status: 0,
      search: "",
    };
  },

  created() {
    this.onLoad();
  },
  filters: filters,
  methods: {
    async onLoad() {
      const { data } = await instCopyReply(
        this.search,
        this.status,
        this.current,
        this.size
      );

      if (this.refreshing) {
        this.list = [];
        this.current = 1;
        this.refreshing = false;
      }
      this.loading = false;
      this.list = this.list.concat(data.data.records);
      this.total = data.data.total;
      if (this.list.length < data.data.total) {
        this.current++;
      }
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
      this.onLoad();
    },

    change(name, title) {
      this.status = name;
      this.onRefresh();
    },

    getCurrentRow(rows) {
      this.$emit("getCurrentRow", rows);
    },
  },
};
</script>

<style lang="scss" scoped>
.tabs {
  margin-top: 50px;
  position: absolute;
  left: 0;
  right: 0;
  top: 5px;
  z-index: 1;
}

.pullrefresh {
  margin-top: 100px;

  .placeholder {
    height: 150px;
  }

  .cellNode {
    box-sizing: border-box;
    padding: 3px 16px;
    color: #323233;
    font-size: 14px;
    line-height: 24px;
    background-color: #fff;
    border-bottom: 1px solid #ebedf0;
    display: flex;
    justify-content: space-between;

    .left {
      width: 65%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      div {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #323233;
        font-size: 14px;
      }

      div:nth-child(2) {
        color: #969799;
        font-size: 12px;
      }
    }

    .right {
      width: 35%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      div {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .right {
      text-align: right;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      color: #969799;
    }
  }
}

/deep/.van-tabs--line .van-tabs__wrap {
  border-bottom: 1px solid #eee;
}

/deep/.van-tabs__line {
  width: 80px;
}
</style>