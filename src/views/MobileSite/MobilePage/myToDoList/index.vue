<template>
  <div class="todoWrapper">
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
        <span class="text">我的待办</span>
      </template>
    </van-search>
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
            <div>
              {{ `事务编号:${item.instId}` }}
            </div>
            <div>{{ item.title }}</div>
          </div>
          <div class="right">
            {{ item.taskCreateTime | formatDate }}
            <van-icon name="arrow" color="#969799" size="1rem" />
          </div>
        </div>
        
      </van-list>
      <div class="placeholder"></div>
    </van-pull-refresh>
  </div>
</template>


<script>
import { myToDoList } from "@/api/mobileApi/flow";
import { mapMutations } from "vuex";
import { filters } from "./index";
import { setStore, getStore, removeStore } from "@/util/store";
import * as dd from "dingtalk-jsapi";

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
  filters: filters,
  created() {
    if (dd.env.platform != 'notInDingTalk') {
      dd.ready(function() {
        document.addEventListener('backbutton', function(e) {
          dd.biz.navigation.close();
        });
      });
    }
    this.$nextTick(() => {
      this.$refs.list.check();
    });
  },
  methods: {
    ...mapMutations("Flow", ["SET_PROINSTID", "SET_FLOWROUTE", "SET_TASKID",'SET_DIATYPE']),
    async onLoad() {
      const { data } = await myToDoList(this.search, this.current, this.size);

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

    getCurrentRow({ proInstId, taskId }) {
      this.SET_PROINSTID(proInstId);
      this.SET_TASKID(taskId);
      this.SET_FLOWROUTE("myTodoList");
      this.SET_DIATYPE(4)
      
      // 持久存储 proInstId taskId 防止刷新页面 vuex 被清空
      setStore({
        name: "proInstId",
        content: proInstId,
      });

      setStore({
        name: "taskId",
        content: taskId,
      });

      setStore({
        name: "flowRoute",
        content: "myTodoList",
      });

      setStore({
        name: "diaType",
        content: 4,
      });

      this.$router.push("/mobile/flowDetail");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
