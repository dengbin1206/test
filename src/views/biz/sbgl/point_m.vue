<template>
  <div class="check-record">
    <div class="header">
      <div class="date">
        <van-button plain size="small" style="border: none"
          >选择点检日期:</van-button
        >
        <van-button
          round
          plain
          size="mini"
          type="info"
          @click="showPicker = true"
          >{{ currentDate }}</van-button
        >
      </div>
      <div class="search">
        <van-search
          placeholder="请输入搜索关键词"
          v-model="search"
          class="todoSearch"
          clearable
          @search="handleSearch"
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
        </van-search>
      </div>
      <div class="tabs">
        <van-tabs
          v-model="active"
          animated
          swipeable
          type="line"
          border
          line-height="2px"
          line-width="80px"
          color="#0079fe"
          @change="tabChange"
          title-active-color="#0079fe"
        >
          <van-tab title="未点检" name="notCheck"></van-tab>
          <van-tab title="已点检" name="check"></van-tab>
          <van-tab title="异常" name="errors"></van-tab>
        </van-tabs>
      </div>
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
            v-for="(item, index) in list"
            :key="index"
            @click="getCurrentRow(item)"
          >
            <div class="left">
              <div class="title">{{ `${item.equipName}${item.equipNum}` }}</div>
              <div class="subtitle">{{ `点检人:${item.userNow}` }}</div>
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

    <!-- 点检日期弹窗 -->
    <van-popup
      v-model="showPicker"
      round
      position="bottom"
      get-container="body"
    >
      <van-datetime-picker
        v-model="pickerDate"
        type="date"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onConfirm"
        @cancel="showPicker = false"
      />
    </van-popup>
  </div>
</template>

<script>
import { selectByStatus, selectByStatusByDate } from "@/api/biz/sbgl";
export default {
  data() {
    return {
      currentDate: "",
      minDate: new Date(2010, 0, 1),
      maxDate: new Date(2050, 10, 1),
      showPicker: false,
      pickerDate: new Date(),
      active: "notCheck",
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      current: 1,
      size: 10,
      search: "",
      total: null,
      checkStatus: 1,
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

    this.currentDate = this.dayjs().format("YYYY-MM-DD");
  },

  methods: {
    onConfirm(value) {
      this.currentDate = this.dayjs(value).format("YYYY-MM-DD");
      this.showPicker = false;
      this.onRefresh();
    },

    tabChange(name, title) {
      switch (name) {
        case "notCheck":
          this.checkStatus = 1;
          this.onRefresh();
          break;
        case "check":
          this.checkStatus = 2;
          this.onRefresh();
          break;
        case "errors":
          this.checkStatus = 3;
          this.onRefresh();
          break;
        default:
          break;
      }
    },

    async onLoad() {
      const { data } = await selectByStatus({
        search: this.search,
        checkStatus: this.checkStatus,
        current: this.current,
        size: this.size,
        checkTime: this.currentDate,
      });

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

    getCurrentRow({ equipNum, id }) {
      this.$router.push({
        path: "/biz/sbgl/spot",
        query: {
          equipNum: equipNum,
          checkId: id,
          time: this.currentDate,
          old: this.checkStatus,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.check-record {
  height: 100%;
  display: flex;
  flex-direction: column;

  .header {
    height: 122px;

    .date {
      display: flex;
      align-items: center;
      justify-content: center;

      .title {
        font-size: 14px;
        color: #323233;
        font-weight: 400;
      }
    }

    .todoSearch {
      padding: 5px 10px;
    }
  }

  .main {
    flex: 1;
    overflow-y: scroll;

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
</style>