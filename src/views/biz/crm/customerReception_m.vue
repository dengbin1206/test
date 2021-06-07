<template>
  <el-container style="width: 100%; height: 100%; background-color: #fff">
    <el-header style="padding-left: 0; padding-right: 10px">
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
            @click="handleClick"
          />
        </template>
        <template #action>
          <span class="text">客户接待</span>
        </template>
      </van-search>
    </el-header>
    <el-main>
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
            class="list-item"
            :key="index"
            v-for="(item, index) in list"
            @click="getDetail(item)"
          >
            <div>
              <span style="color: #323233; font-weight: 700; font-size: 14px">
                {{ `纸质合同号:${item.contractCode}` }}
              </span>
              <span style="color: #969799; font-weight: 400; font-size: 12px">
                <van-tag v-if="item.flowStatus == 1" type="warning"
                  >审批中</van-tag
                >
                <van-tag v-if="item.flowStatus == 2" type="success"
                  >审批通过</van-tag
                >
              </span>
            </div>
            <div>
              <span style="color: #969799; font-weight: 400; font-size: 12px">
                <span>客户名称:</span>
                <span>{{ item.createUserName }}</span>
              </span>
              <span style="color: #969799; font-weight: 400; font-size: 12px">{{
                item.createTime
              }}</span>
            </div>
          </div>
        </van-list>
        <div class="placeholder"></div>
      </van-pull-refresh>
    </el-main>
  </el-container>
</template>
<script>
import { getList } from "@/api/biz/crm/customerReception_m";
import { setStore } from "@/util/store";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      search: "",
      loading: false,
      refreshing: false,
      finished: false,
      current: 1,
      size: 10,
      total: null,
      list: [],
    };
  },
  created() {
    this.onLoad();
  },
  methods: {
    ...mapMutations("Flow", ["SET_PROINSTID", "SET_FLOWROUTE", "SET_TASKID"]),

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
    handleSearch(value) {
      this.list = [];
      this.current = 1;
      this.onLoad();
    },
    onRefresh() {
      this.list = [];
      this.current = 1;
      this.finished = true;
      this.onLoad();
    },
    getDetail({ proInstId }) {
      this.SET_PROINSTID(proInstId);
      this.SET_TASKID("");
      this.SET_FLOWROUTE("crm/customerList");
      setStore({
        name: "proInstId",
        content: proInstId,
      });
      setStore({
        name: "taskId",
        content: "",
      });
      setStore({
        name: "flowRoute",
        content: "crm/customerList",
      });
      this.$router.push("/mobile/flowDetail");
    },

    handleClick(){
      this.$router.push('/mobile/home')
    }
  },
};
</script>

<style scoped>
.list-item {
  border-top: 1px solid #ebedf0;
  border-bottom: 1px solid #ebedf0;
  margin-top: 10px;
  width: 100%;
  height: 80px;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 10px;
}
.list-item div {
  display: flex;
  justify-content: space-between;
}
</style>