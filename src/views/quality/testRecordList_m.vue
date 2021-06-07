<template>
  <div class="todoWrapper">
    <div class="header">
      <van-search
        v-model="search"
        placeholder="请输入搜索关键词"
        class="todoSearch"
        @search="handleSearch"
        clearable
        show-action
      >
        <template #left>
          <van-icon
            name="arrow-left"
            size="1rem"
            color="#0079fe"
            class="arrowIcon"
            @click="$router.push('/mobile/home')"
          />
        </template>
        <template #action>
          <span class="text" style="color: #0079fe">检验记录</span>
        </template>
      </van-search>
    </div>
    <div class="main">
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
            :key="item.taskId"
            @click="getCurrentRow(item)"
          >
            <div class="left">
              <div class="title">{{ `检验单号:${item.testListCode}` }}</div>
              <div class="subtitle">{{ `合同号:${item.contractCode}` }}</div>
              <div class="subtitle">{{ `检验单名称:${item.produceName}` }}</div>
            </div>
            <div class="right">
              <div class="top">
                <van-tag size="mini" type="warning" v-if="item.flowStatus == 1"
                  >审批中</van-tag
                >
                <van-tag size="mini" type="success" v-if="item.flowStatus == 2"
                  >审批通过</van-tag
                >
              </div>
              <div class="bottom">{{ createTime(item.createTime) }}</div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <div class="footer">
      <van-button type="info" round block @click="addTest"
        >新建检验单</van-button
      >
    </div>
  </div>
</template>


<script>
import { getList } from "@/api/quality/testList_m";
import { mapMutations } from "vuex";
import { setStore, getStore, removeStore } from "@/util/store";

export default {
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      current: 1,
      size: 10,
      search: "",
      total: null,
    };
  },
  computed: {
    createTime() {
      return function (time) {
        return this.dayjs(time).format("YYYY-MM-DD HH:mm");
      };
    },
  },
  created() {
    this.$nextTick(() => {
      this.$refs.list.check();
    });
  },
  methods: {
    ...mapMutations("quality", ["SET_QUALITYROUTE", "SET_QUERYID"]),

    async onLoad() {
      const { data } = await getList(this.search, this.current, this.size);

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

    handleSearch(value) {
      this.list = [];
      this.current = 1;
      this.onLoad();
    },

    getCurrentRow({ id }) {
      this.SET_QUALITYROUTE(this.$route.path);
      setStore({
        name: "qualityPath",
        content: this.$route.path,
      });
      this.$router.push({
        path: "/quality/testRecord",
        query: { id: id },
      });
    },

    // 新建检验单

    addTest() {
      this.SET_QUALITYROUTE(this.$route.path);
      setStore({
        name: "qualityPath",
        content: this.$route.path,
      });
      this.$router.push("/quality/testRecord");
    },
  },
};
</script>

<style lang="scss" scoped>
.todoWrapper {
  height: 100%;
  display: flex;
  flex-direction: column;

  .header,
  .footer {
    height: 46px;
  }

  .footer {
    padding: 0 10px;
  }

  .main {
    flex: 1;
    overflow-y: scroll;

    .todoSearch {
      position: fixed;
      left: 0px;
      right: 0px;
      top: 0;
      z-index: 9;
      border-bottom: 1px solid #f6f7f8;

      .arrowIcon {
        margin-right: 4px;
      }

      .text {
        color: #0079fe;
      }
    }

    .pullrefresh {
      .cellNode {
        padding: 3px 16px;
        color: #323233;
        font-size: 14px;
        background-color: #fff;
        border-bottom: 1px solid #ebedf0;
        display: flex;

        .left {
          width: 60%;
          .title {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #323233;
            font-size: 14px;
            font-weight: 400;
          }

          .subtitle {
            color: #969799;
            font-size: 12px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        .right {
          width: 40%;
          display: flex;
          flex-direction: column;
          justify-content: center;

          .bottom,
          .top {
            text-align: right;
          }
        }
      }
    }
  }
}

.tododetail {
  height: 100vh;
  background-color: #f6f7f8;
  overflow-y: auto;

  .listCard {
    width: 90%;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    margin: 3% auto;
    border-radius: 7px;
    padding: 10px 12px;
    background: #fff;
    position: relative;
  }

  .placeholder {
    margin-bottom: 200px;
  }
}

/deep/.van-uploader__upload {
  background-color: #f7f8fa;
  border: 1px dashed #0079fe;
}

/deep/.van-uploader__upload-icon {
  color: #0079fe;
}

/deep/.van-collapse-item__content {
  padding: 3px 16px;
  font-size: 12px;
}

/deep/.van-nav-bar__title {
  max-width: 80%;
}

/deep/.van-popup
  > .el-select-dropdown
  > .el-scrollbar
  > .el-select-dropdown__wrap {
  max-height: 133px !important;
}

textarea::-webkit-input-placeholder {
  color: #bcbdc1;
  font-size: 12px;
}
textarea:-moz-placeholder {
  color: #bcbdc1;
  font-size: 12px;
}
textarea::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #bcbdc1;
  font-size: 12px;
}
textarea::-ms-input-placeholder {
  /* Internet Explorer 10+ */
  color: #bcbdc1;
  font-size: 12px;
}

textarea {
  -webkit-appearance: none;
}
</style>
